import { CircuitSafetySim } from "@/components/interactive/CircuitSafetySim";

export default function Module2Page() {
  return (
    <div className="space-y-12">
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-3xl font-bold mb-4 text-white">
          <span className="text-red-500">Module 2:</span> Circuit Safety Systems
        </h2>
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6 relative z-10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
            🎯 Tujuan Pembelajaran (Learning Objectives)
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Identify safety devices such as MCBs (Miniature Circuit Breakers) and fuses.</li>
            <li>Calculate the expected load of a circuit based on appliance power ratings.</li>
            <li>Understand why overloads cause breakers to trip to prevent fires.</li>
          </ul>
        </div>
      </section>

      <section>
        <CircuitSafetySim />
      </section>
    </div>
  );
}
