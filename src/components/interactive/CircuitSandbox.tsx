"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge,
  Node, Edge, NodeChange, EdgeChange, Connection, Handle, Position,
  BackgroundVariant, ReactFlowProvider, useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Battery, Zap, Activity, Power, RotateCcw, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── types ─── */
interface BatteryData { voltage: number; shortCircuit?: boolean }
interface ResistorData { resistance: number }
interface LEDData { forwardVoltage: number; maxCurrent: number; lit: boolean; burnt: boolean; dim: boolean }
type CircuitState = 'idle' | 'short' | 'overcurrent' | 'underpowered' | 'open' | 'success';
interface EvalResult { state: CircuitState; current?: number; message: string; hint: string }

const fmt = (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}kΩ` : `${v}Ω`;

/* ─── nodes ─── */
const BatteryNode = ({ data }: { data: BatteryData }) => (
  <div className={`bg-slate-800 border-2 rounded-lg p-2 text-white shadow-xl w-28 transition-all
    ${data.shortCircuit ? 'border-red-500 animate-overheat animate-shake' : 'border-blue-500'}`}>
    <Handle type="target" position={Position.Left} id="in" style={{ background: '#3b82f6' }} />
    <div className="text-center font-bold text-xs mb-1">{data.voltage}V Battery</div>
    <div className="relative flex justify-center">
      <Battery className={`w-full ${data.shortCircuit ? 'text-red-400' : 'text-blue-400'}`} />
      {data.shortCircuit && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" className="animate-sparkle">
            <path d="M16 2 L18 13 L24 13 L14 30 L15 18 L8 18 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
          </svg>
        </div>
      )}
    </div>
    <Handle type="source" position={Position.Right} id="out" style={{ background: '#ef4444' }} />
  </div>
);

const ResistorNode = ({ data }: { data: ResistorData }) => (
  <div className="bg-slate-800 border-2 border-orange-500 rounded-lg p-2 text-white shadow-xl w-28">
    <Handle type="target" position={Position.Left} id="in" />
    <div className="text-center font-bold text-xs mb-1">{fmt(data.resistance)}</div>
    <svg width="100%" height="20" viewBox="0 0 100 20">
      <path d="M0,10 L15,10 L20,0 L30,20 L40,0 L50,20 L60,0 L70,20 L80,0 L85,10 L100,10" fill="none" stroke="#f97316" strokeWidth="3"/>
    </svg>
    <Handle type="source" position={Position.Right} id="out" />
  </div>
);

const LEDNode = ({ data }: { data: LEDData }) => {
  const border = data.burnt ? 'border-amber-900' : data.lit ? 'border-emerald-400' : data.dim ? 'border-yellow-800' : 'border-slate-600';
  const bg = data.burnt ? 'bg-amber-950' : 'bg-slate-800';
  const bulb = data.burnt
    ? 'bg-neutral-800 animate-lamp-pop'
    : data.lit
    ? 'bg-emerald-400 shadow-[0_0_20px_#34d399]'
    : data.dim
    ? 'bg-yellow-900/40 animate-dim-glow'
    : 'bg-slate-700';
  return (
    <div className={`${bg} border-2 ${border} rounded-lg p-2 shadow-xl w-24 flex flex-col items-center
      ${data.lit ? 'animate-success-pulse' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" />
      <div className="text-center font-bold text-[9px] text-slate-400 mb-0.5">LED</div>
      <div className="text-[8px] text-slate-500 mb-1">{data.forwardVoltage}V / {data.maxCurrent}mA</div>
      <div className={`w-8 h-8 rounded-full mb-1 transition-all ${bulb}`} />
      <Handle type="source" position={Position.Bottom} id="out" />
    </div>
  );
};

const nodeTypes = { battery: BatteryNode, resistor: ResistorNode, led: LEDNode };
let idCounter = 10;
const getId = () => `node_${++idCounter}`;

/* ─── evaluation engine ─── */
function evaluateCircuit(nodes: Node[], edges: Edge[]): EvalResult {
  if (nodes.length === 0) return { state: 'idle', message: '', hint: '' };

  const batteries = nodes.filter(n => n.type === 'battery');
  const resistors = nodes.filter(n => n.type === 'resistor');
  const leds = nodes.filter(n => n.type === 'led');

  if (batteries.length === 0) return { state: 'open', message: 'No battery in the circuit.', hint: 'Add a battery to provide voltage.' };

  // BFS loop detection
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => { adj[e.source]?.push(e.target); adj[e.target]?.push(e.source); });

  function hasLoop(startId: string): boolean {
    const visited = new Set<string>();
    const queue = [startId];
    visited.add(startId);
    while (queue.length) {
      const cur = queue.shift()!;
      for (const nb of (adj[cur] || [])) {
        if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
        else if (nb === startId && visited.size > 2) return true;
      }
    }
    return false;
  }

  const bat = batteries[0];
  const loopExists = hasLoop(bat.id);

  if (!loopExists) return { state: 'open', message: "The electricity doesn't have a full path to travel from the positive to the negative terminal.", hint: "Check your wire connections to close the loop." };

  // Gather values
  const V = (bat.data as unknown as BatteryData).voltage;
  const R = resistors.reduce((sum, r) => sum + ((r.data as unknown as ResistorData).resistance || 0), 0);
  const led = leds.length > 0 ? leds[0] : null;
  const Vf = led ? (led.data as unknown as LEDData).forwardVoltage : 0;
  const Imax = led ? (led.data as unknown as LEDData).maxCurrent : Infinity;

  // Short circuit: loop exists, no resistor AND no LED
  if (R === 0 && leds.length === 0) {
    return { state: 'short', message: "Danger: Short Circuit! Electricity is flowing with zero resistance. In the real world, this causes the battery to rapidly overheat and potentially catch fire.", hint: "What component can you add to resist the flow of electricity?" };
  }

  if (!led) return { state: 'success', current: R > 0 ? (V / R) * 1000 : 0, message: "Circuit is complete with resistor protection.", hint: "" };

  const totalR = R > 0 ? R : 1; // avoid div-by-zero
  const I_mA = ((V - Vf) / totalR) * 1000;

  if (R === 0 || I_mA > Imax) {
    return { state: 'overcurrent', current: Math.round(I_mA * 10) / 10, message: `Pop! Your circuit generated ${Math.round(I_mA * 10) / 10} mA, but the lamp can only handle ${Imax} mA. The current was too high, so the lamp burned out.`, hint: "How should you adjust your resistor's Ohm value to reduce the current?" };
  }

  if (V < Vf || I_mA < 1) {
    return { state: 'underpowered', current: Math.max(0, Math.round(I_mA * 10) / 10), message: "The circuit is complete, but the lamp isn't lighting up. The power reaching it is too low.", hint: "You might have too much resistance, or your battery voltage is too low. What values can you tweak to give the lamp more power?" };
  }

  return { state: 'success', current: Math.round(I_mA * 10) / 10, message: `Circuit is working! Current: ${Math.round(I_mA * 10) / 10} mA — within safe range.`, hint: "" };
}

/* ─── palette config item ─── */
function PaletteItem({
  label,
  icon,
  color,
  children,
  onDragStart,
  draggable = true,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  onDragStart: (e: React.DragEvent) => void;
  draggable?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  onPointerCancel?: (e: React.PointerEvent) => void;
}) {
  const [open, setOpen] = useState(false);
  const border = { blue: 'border-blue-500/30', orange: 'border-orange-500/30', green: 'border-emerald-500/30' }[color] || 'border-slate-700';
  const hoverBg = { blue: 'hover:bg-blue-950/40', orange: 'hover:bg-orange-950/40', green: 'hover:bg-emerald-950/40' }[color] || '';

  return (
    <div className={`rounded-xl border ${border} overflow-hidden transition-all bg-slate-800/60`}>
      <div className="flex items-center gap-2">
        <div
          draggable={draggable}
          onDragStart={onDragStart}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          className={`flex-1 flex items-center gap-3 p-3 cursor-grab active:cursor-grabbing ${hoverBg} transition-colors ${
            draggable ? '' : 'touch-none'
          }`}
        >
          {icon}
          <span className="text-sm font-semibold text-white">{label}</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 text-slate-400 hover:text-white transition-colors">
          {open ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
            transition={{duration:0.2}} className="overflow-hidden">
            <div className="px-3 pb-3 pt-1 space-y-2 border-t border-slate-700/50">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type PaletteDragItem = {
  label: string;
  icon: React.ReactNode;
  color: string;
  type: string;
  data: Record<string, unknown>;
};

type TouchDragState = {
  pointerId: number;
  x: number;
  y: number;
  item: PaletteDragItem;
};

function SliderInput({ label, value, min, max, step, unit, sliderClass, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; sliderClass: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-slate-400">{label}</span>
        <div className="flex items-center gap-1">
          <input type="number" value={value} min={min} max={max} step={step}
            onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= min && v <= max) onChange(v); }}
            className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white text-right focus:outline-none focus:border-blue-500"/>
          <span className="text-[10px] text-slate-500">{unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={`circuit-slider ${sliderClass}`}/>
    </div>
  );
}

/* ─── reflection modal ─── */
function ReflectionModal({ result, onClose }: { result: EvalResult; onClose: () => void }) {
  const icons: Record<CircuitState,string> = { idle:'', short:'⚡', overcurrent:'💥', underpowered:'🔋', open:'🔌', success:'✅' };
  const titles: Record<CircuitState,string> = { idle:'', short:'Short Circuit!', overcurrent:'Blown Lamp!', underpowered:'Underpowered', open:'Open Circuit', success:'Success!' };
  const colors: Record<CircuitState,string> = { idle:'', short:'from-red-500/20 to-orange-500/10 border-red-500/40', overcurrent:'from-amber-500/20 to-red-500/10 border-amber-500/40', underpowered:'from-yellow-500/15 to-slate-500/10 border-yellow-500/30', open:'from-slate-500/20 to-slate-500/10 border-slate-500/40', success:'from-emerald-500/20 to-cyan-500/10 border-emerald-500/40' };

  return (
    <div className="circuit-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{opacity:0,y:24,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:24,scale:0.96}}
        transition={{duration:0.3,ease:'easeOut'}} onClick={e=>e.stopPropagation()}
        className={`relative bg-gradient-to-br ${colors[result.state]} bg-slate-900 border rounded-2xl p-6 max-w-md w-full shadow-2xl`}>
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5"/>
        </button>
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">{icons[result.state]}</div>
          <h3 className="text-xl font-bold text-white">{titles[result.state]}</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">{result.message}</p>
        {result.current !== undefined && (
          <div className="bg-slate-800/60 rounded-lg p-3 mb-3 flex justify-between text-xs">
            <span className="text-slate-400">Calculated Current:</span>
            <span className="text-white font-mono font-bold">{result.current} mA</span>
          </div>
        )}
        {result.hint && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
            <p className="text-blue-300 text-sm italic">💡 {result.hint}</p>
          </div>
        )}
        <button onClick={onClose}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
          {result.state === 'success' ? 'Great!' : 'Try Again'}
        </button>
      </motion.div>
    </div>
  );
}

/* ─── main component ─── */
function CircuitSandboxContent() {
  const wrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [powered, setPowered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchDrag, setTouchDrag] = useState<TouchDragState | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsTouchDevice(
        typeof window !== 'undefined' &&
          ('ontouchstart' in window || (navigator?.maxTouchPoints ?? 0) > 0)
      );
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // palette config state
  const [batV, setBatV] = useState(9);
  const [resOhm, setResOhm] = useState(330);
  const [ledVf, setLedVf] = useState(2.0);
  const [ledImax, setLedImax] = useState(20);

  const onNodesChange = useCallback((c: NodeChange[]) => setNodes(n => applyNodeChanges(c, n)), []);
  const onEdgesChange = useCallback((c: EdgeChange[]) => setEdges(e => applyEdgeChanges(c, e)), []);
  const onConnect = useCallback((p: Connection) => setEdges(e => addEdge({ ...p, animated: true, style: { stroke: '#facc15', strokeWidth: 3 } }, e)), []);

  const onDragStart = (event: React.DragEvent, type: string, data: Record<string, unknown>) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type, data }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const addNodeAtClientPoint = useCallback((item: PaletteDragItem, clientX: number, clientY: number) => {
    const position = screenToFlowPosition({ x: clientX, y: clientY });
    setNodes((nds) => nds.concat({ id: getId(), type: item.type, position, data: item.data }));
    setPowered(false);
  }, [screenToFlowPosition]);

  const startTouchDrag = useCallback((event: React.PointerEvent, item: PaletteDragItem) => {
    if (!isTouchDevice) return;
    if (event.pointerType === 'mouse') return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setTouchDrag({ pointerId: event.pointerId, x: event.clientX, y: event.clientY, item });
  }, [isTouchDevice]);

  const moveTouchDrag = useCallback((event: React.PointerEvent) => {
    if (!touchDrag) return;
    if (event.pointerId !== touchDrag.pointerId) return;
    event.preventDefault();
    setTouchDrag((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : null));
  }, [touchDrag]);

  const endTouchDrag = useCallback((event: React.PointerEvent) => {
    if (!touchDrag) return;
    if (event.pointerId !== touchDrag.pointerId) return;
    event.preventDefault();

    if (wrapper.current) {
      const rect = wrapper.current.getBoundingClientRect();
      const isInsideCanvas =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (isInsideCanvas) addNodeAtClientPoint(touchDrag.item, event.clientX, event.clientY);
    }

    setTouchDrag(null);
  }, [addNodeAtClientPoint, touchDrag]);

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!wrapper.current) return;
    const raw = event.dataTransfer.getData('application/reactflow');
    if (!raw) return;
    const { type, data } = JSON.parse(raw);
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setNodes(nds => nds.concat({ id: getId(), type, position, data }));
    setPowered(false);
  }, [screenToFlowPosition]);

  const handlePowerOn = () => {
    const result = evaluateCircuit(nodes, edges);
    setEvalResult(result);

    // update node visuals
    setNodes(prev => prev.map(n => {
      if (n.type === 'battery') return { ...n, data: { ...n.data, shortCircuit: result.state === 'short' } };
      if (n.type === 'led') return { ...n, data: { ...n.data, lit: result.state === 'success', burnt: result.state === 'overcurrent', dim: result.state === 'underpowered' } };
      return n;
    }));

    setPowered(true);
    if (result.state !== 'idle') setShowModal(true);
  };

  const handleClear = () => {
    setNodes([]); setEdges([]); setEvalResult(null); setPowered(false); setShowModal(false);
  };

  const handleReset = () => {
    setNodes(prev => prev.map(n => {
      if (n.type === 'battery') return { ...n, data: { ...n.data, shortCircuit: false } };
      if (n.type === 'led') return { ...n, data: { ...n.data, lit: false, burnt: false, dim: false } };
      return n;
    }));
    setEvalResult(null); setPowered(false);
  };

  const statusColor = !evalResult || evalResult.state === 'idle' ? 'text-slate-400'
    : evalResult.state === 'success' ? 'text-emerald-400'
    : evalResult.state === 'short' || evalResult.state === 'overcurrent' ? 'text-red-400'
    : 'text-yellow-400';

  const batteryPaletteItem: PaletteDragItem = {
    label: `${batV}V Battery`,
    icon: <Battery className="w-5 h-5 text-blue-400"/>,
    color: 'blue',
    type: 'battery',
    data: { voltage: batV, shortCircuit: false },
  };

  const resistorPaletteItem: PaletteDragItem = {
    label: `${fmt(resOhm)} Resistor`,
    icon: <Activity className="w-5 h-5 text-orange-400"/>,
    color: 'orange',
    type: 'resistor',
    data: { resistance: resOhm },
  };

  const ledPaletteItem: PaletteDragItem = {
    label: `LED (${ledVf}V / ${ledImax}mA)`,
    icon: (
      <div className="w-5 h-5 rounded-full bg-emerald-400/20 border border-emerald-400 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-emerald-400"/>
      </div>
    ),
    color: 'green',
    type: 'led',
    data: {
      forwardVoltage: ledVf,
      maxCurrent: ledImax,
      lit: false,
      burnt: false,
      dim: false,
    },
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl mx-auto h-auto md:h-[650px]">
      {/* ── palette sidebar ── */}
      <aside className="w-full md:w-72 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col shrink-0 backdrop-blur-sm md:overflow-y-auto no-scrollbar">
        <h3 className="text-white font-bold mb-1 flex items-center gap-2 text-base">
          <Zap className="w-5 h-5 text-blue-400"/> Component Palette
        </h3>
        <p className="text-[11px] text-slate-500 mb-4">Configure values, then drag onto canvas</p>

        <div className="space-y-3 flex-1">
          {/* Battery */}
          <PaletteItem
            label={batteryPaletteItem.label}
            icon={batteryPaletteItem.icon}
            color={batteryPaletteItem.color}
            draggable={!isTouchDevice}
            onPointerDown={(e) => startTouchDrag(e, batteryPaletteItem)}
            onPointerMove={moveTouchDrag}
            onPointerUp={endTouchDrag}
            onPointerCancel={endTouchDrag}
            onDragStart={(e) => onDragStart(e, batteryPaletteItem.type, batteryPaletteItem.data)}
          >
            <SliderInput label="Voltage" value={batV} min={1.5} max={24} step={0.5} unit="V" sliderClass="slider-blue" onChange={setBatV}/>
          </PaletteItem>

          {/* Resistor */}
          <PaletteItem
            label={resistorPaletteItem.label}
            icon={resistorPaletteItem.icon}
            color={resistorPaletteItem.color}
            draggable={!isTouchDevice}
            onPointerDown={(e) => startTouchDrag(e, resistorPaletteItem)}
            onPointerMove={moveTouchDrag}
            onPointerUp={endTouchDrag}
            onPointerCancel={endTouchDrag}
            onDragStart={(e) => onDragStart(e, resistorPaletteItem.type, resistorPaletteItem.data)}
          >
            <SliderInput label="Resistance" value={resOhm} min={10} max={10000} step={10} unit="Ω" sliderClass="slider-orange" onChange={setResOhm}/>
          </PaletteItem>

          {/* LED */}
          <PaletteItem
            label={ledPaletteItem.label}
            icon={ledPaletteItem.icon}
            color={ledPaletteItem.color}
            draggable={!isTouchDevice}
            onPointerDown={(e) => startTouchDrag(e, ledPaletteItem)}
            onPointerMove={moveTouchDrag}
            onPointerUp={endTouchDrag}
            onPointerCancel={endTouchDrag}
            onDragStart={(e) => onDragStart(e, ledPaletteItem.type, ledPaletteItem.data)}
          >
            <SliderInput label="Forward Voltage" value={ledVf} min={1.0} max={5.0} step={0.1} unit="V" sliderClass="slider-green" onChange={setLedVf}/>
            <SliderInput label="Max Current" value={ledImax} min={5} max={100} step={1} unit="mA" sliderClass="slider-green" onChange={setLedImax}/>
          </PaletteItem>
        </div>

        {/* action buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
          <button onClick={handlePowerOn}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15">
            <Power className="w-4 h-4"/> Power On
          </button>
          {powered && (
            <button onClick={handleReset}
              className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl transition-colors border border-amber-500/20 text-sm font-bold flex items-center justify-center gap-2">
              <RotateCcw className="w-3.5 h-3.5"/> Reset State
            </button>
          )}
          <button onClick={handleClear}
            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20 text-sm font-bold">
            Clear Board
          </button>
        </div>
      </aside>

      {/* ── canvas ── */}
      <div className="flex-1 flex flex-col relative h-full">
        {evalResult && evalResult.state !== 'idle' && (
          <div className={`absolute top-4 left-4 right-4 z-10 bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-3 rounded-xl shadow-lg`}>
            <p className={`text-sm font-medium ${statusColor}`}>
              {evalResult.state === 'success' ? '✅' : evalResult.state === 'short' ? '⚡' : evalResult.state === 'overcurrent' ? '💥' : evalResult.state === 'underpowered' ? '🔋' : '🔌'}
              {' '}{evalResult.message}
            </p>
          </div>
        )}

        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl h-[420px] md:h-full touch-none" ref={wrapper}>
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onDrop={onDrop} onDragOver={onDragOver} nodeTypes={nodeTypes} fitView colorMode="dark">
            <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#334155"/>
            <Controls/>
          </ReactFlow>
        </div>
      </div>

      {/* ── touch drag overlay ── */}
      {touchDrag && (
        <div
          className="fixed z-[60] pointer-events-none"
          style={{ left: touchDrag.x, top: touchDrag.y, transform: 'translate(-50%, -70%)' }}
        >
          <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 shadow-2xl flex items-center gap-2">
            <div className="opacity-90">{touchDrag.item.icon}</div>
            <span className="text-xs font-semibold text-white whitespace-nowrap">{touchDrag.item.label}</span>
          </div>
        </div>
      )}

      {/* ── modal ── */}
      <AnimatePresence>
        {showModal && evalResult && evalResult.state !== 'idle' && (
          <ReflectionModal result={evalResult} onClose={() => setShowModal(false)}/>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CircuitSandbox() {
  return (
    <ReactFlowProvider>
      <CircuitSandboxContent/>
    </ReactFlowProvider>
  );
}
