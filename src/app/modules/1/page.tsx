import { OhmsLawVisualizer } from "@/components/interactive/OhmsLawVisualizer";

export default function Module1Page() {
  return (
    <div className="space-y-12">
      
      {/* Learning Objectives Header */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-3xl font-bold mb-4 text-white">
          <span className="text-blue-500">Module 1:</span> Basic Units & Laws of Electrical Engineering
        </h2>
        <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-6 relative z-10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
            🎯 Tujuan Pembelajaran (Learning Objectives)
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Understand the relationship between Voltage (V), Current (I), and Resistance (R).</li>
            <li>Define Ohm&apos;s Law and apply its formula in basic calculations.</li>
            <li>Visually identify how changing resistance impacts the flow of current in a closed circuit.</li>
          </ul>
        </div>
      </section>

      {/* Main Content & Interactive Visualizer */}
      <section className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Ohm&apos;s Law Visualizer</h3>
          <p className="text-slate-400">
            Interact with the sliders below to see how Voltage and Resistance affect the flow of Current in real-time.
          </p>
        </div>
        
        {/* INTERACTIVE COMPONENT */}
        <OhmsLawVisualizer />
        
      </section>

      <div className="prose prose-invert max-w-none pt-8 border-t border-slate-800">
        <h3 className="text-xl font-bold text-white">Summary</h3>
        <p className="text-slate-300 leading-relaxed">
          Ohm&apos;s Law states that the current through a conductor between two points is directly proportional to the voltage across the two points. 
          When you increase the voltage (pushing force), the current increases. When you increase the resistance (obstacle), the current decreases. 
          Use this visualizer to build an intuitive understanding of this fundamental law before moving on to complex circuits.
        </p>
      </div>

    </div>
  );
}
