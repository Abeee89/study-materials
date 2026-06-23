"use client";

import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JoinClassForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/classes/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Enrolled successfully in ${data.className}!`);
        setCode("");
        router.refresh();
      } else {
        setError(data.error || "Failed to join class.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card border border-slate-700/40 p-6 flex flex-col justify-between h-full">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Join a Class Room</span>
        <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
          Ask your teacher for their 6-character class code to enroll and share your learning progress.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg text-xs mb-4 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg text-xs mb-4 text-center">
            {success}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CODE12"
          maxLength={6}
          disabled={loading}
          required
          className="flex-grow px-3 py-2 bg-slate-900 border border-slate-750 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none text-white text-sm tracking-widest uppercase text-center placeholder-slate-600 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || code.trim().length !== 6}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white p-2.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
