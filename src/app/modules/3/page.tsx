import { PassiveGallery } from "@/components/interactive/PassiveGallery";

export default function Module3Page() {
  return (
    <div className="space-y-12">
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-3xl font-bold mb-4 text-white">
          <span className="text-emerald-500">Module 3:</span> Identification of Passive Components
        </h2>
        <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-6 relative z-10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center gap-2">
            🎯 Tujuan Pembelajaran (Learning Objectives)
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Differentiate between basic passive components: Resistors, Capacitors, and Inductors.</li>
            <li>Read resistor values using the 4-band color code system.</li>
          </ul>
        </div>
      </section>

      <section>
        <PassiveGallery />
      </section>
    </div>
  );
}
