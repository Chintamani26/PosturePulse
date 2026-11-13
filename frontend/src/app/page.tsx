import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          PosturePulse
        </h1>
        <p className="text-slate-400 text-lg">
          Real-time AI computer vision posture tracking. Zero server video streaming, 100% browser
          privacy, and ruthless Gen-Z ergonomic roasts.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/session"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            Start Session
          </Link>
          <Link
            href="/leaderboard"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all border border-slate-700"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}
