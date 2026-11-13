"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Trophy, ArrowLeft } from "lucide-react";
import { fetchLeaderboard, LeaderboardEntry } from "@/lib/api";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaderboard()
      .then(setEntries)
      .catch(() => setError("Could not load the leaderboard. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 mb-6 text-sm">
          <ArrowLeft size={16} /> Back home
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-amber-400" size={28} />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="animate-spin" size={20} /> Loading rankings...
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.rank}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-mono text-emerald-400 w-10 text-center">#{entry.rank}</span>
                  <div>
                    <p className="font-semibold">{entry.user_handle}</p>
                    <p className="text-sm text-slate-500 italic">&ldquo;{entry.roast}&rdquo;</p>
                  </div>
                </div>
                <span className="text-lg font-mono text-cyan-400">{entry.score.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
