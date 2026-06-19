import { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft } from "lucide-react";

export default function ModuleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <h1 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Basic Electricity
            </h1>
          </div>
          <nav>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <BookOpen className="w-4 h-4" />
              <span>Vocational High School</span>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}
