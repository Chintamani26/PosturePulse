const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api/v1";

export interface SessionSubmissionPayload {
  user_handle: string;
  accuracy_score: number;
  slouch_count: number;
  hold_time_seconds: number;
}

export interface SessionSubmissionResult {
  status: string;
  rank: number;
  roast: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_handle: string;
  score: number;
  roast: string;
}

export async function submitSessionResult(
  payload: SessionSubmissionPayload
): Promise<SessionSubmissionResult> {
  const res = await fetch(`${API_BASE}/sessions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit session telemetry");
  return res.json();
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE}/leaderboard/`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}
