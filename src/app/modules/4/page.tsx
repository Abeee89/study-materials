import { ActiveComponents } from "@/components/interactive/ActiveComponents";

export default function Module4Page() {
  return (
    <div className="space-y-12">
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-3xl font-bold mb-4 text-white">
          <span className="text-purple-500">Module 4:</span> Active Electronic Components
        </h2>
        <div className="bg-purple-950/30 border border-purple-900/50 rounded-xl p-6 relative z-10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
            🎯 Tujuan Pembelajaran (Learning Objectives)
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Understand the functionality of active components requiring a power source.</li>
            <li>Explain how a PN junction diode works under forward and reverse bias.</li>
            <li>Identify the depletion region and its role in controlling electron flow.</li>
          </ul>
        </div>
      </section>

      <section>
        <ActiveComponents />
      </section>
    </div>
  );
}
