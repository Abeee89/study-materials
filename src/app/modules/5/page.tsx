import { CircuitSandbox } from "@/components/interactive/CircuitSandbox";

export default function Module5Page() {
  return (
    <div className="space-y-12">
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-3xl font-bold mb-4 text-white">
          <span className="text-amber-500">Module 5:</span> Electrical and Electronic Circuits
        </h2>
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-6 relative z-10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-amber-300 mb-3 flex items-center gap-2">
            🎯 Tujuan Pembelajaran (Learning Objectives)
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Construct basic circuits using power sources, resistors, and LEDs.</li>
            <li>Verify correct circuit polarity.</li>
            <li>Identify the consequences of short circuits and missing resistors (overcurrent).</li>
          </ul>
        </div>
      </section>

      <section>
        <CircuitSandbox />
      </section>
    </div>
  );
}
