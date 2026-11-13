"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { Pose, Results } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS } from "@mediapipe/pose";
import { evaluatePosture } from "@/lib/poseUtils";
import { submitSessionResult, SessionSubmissionResult } from "@/lib/api";

const SESSION_DURATION_SECONDS = 30;

type SessionStatus = "loading" | "active" | "finished" | "error";

export default function SessionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const accuracyRef = useRef<number>(100);
  const slouchCountRef = useRef<number>(0);
  const wasSlouchingRef = useRef<boolean>(false);
  const accuracySamplesRef = useRef<number[]>([]);

  const [status, setStatus] = useState<SessionStatus>("loading");
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isSlouching, setIsSlouching] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(SESSION_DURATION_SECONDS);
  const [userHandle, setUserHandle] = useState<string>("SovereignOperator");
  const [result, setResult] = useState<SessionSubmissionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function finishSession() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      cameraRef.current?.stop();
      setStatus("finished");

      const samples = accuracySamplesRef.current;
      const avgAccuracy = samples.length
        ? Math.round(samples.reduce((sum, v) => sum + v, 0) / samples.length)
        : accuracyRef.current;

      try {
        const submission = await submitSessionResult({
          user_handle: userHandle || "Anonymous",
          accuracy_score: avgAccuracy,
          slouch_count: slouchCountRef.current,
          hold_time_seconds: SESSION_DURATION_SECONDS,
        });
        if (!cancelled) setResult(submission);
      } catch {
        if (!cancelled) setErrorMessage("Session finished, but we couldn't reach the server to log your score.");
      }
    }

    async function setup() {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const pose = new Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results: Results) => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (!canvas || !ctx) return;

          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

          if (results.poseLandmarks) {
            drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
              color: "#10b981",
              lineWidth: 2,
            });
            drawLandmarks(ctx, results.poseLandmarks, { color: "#22d3ee", lineWidth: 1, radius: 3 });

            const evalResult = evaluatePosture(results.poseLandmarks);
            accuracyRef.current = evalResult.accuracy;
            accuracySamplesRef.current.push(evalResult.accuracy);

            if (evalResult.isSlouching && !wasSlouchingRef.current) {
              slouchCountRef.current += 1;
            }
            wasSlouchingRef.current = evalResult.isSlouching;

            setAccuracy(evalResult.accuracy);
            setIsSlouching(evalResult.isSlouching);
          }
          ctx.restore();
        });

        poseRef.current = pose;

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await pose.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        await camera.start();
        cameraRef.current = camera;

        if (cancelled) return;
        setStatus("active");

        intervalRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              finishSession();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage("Camera access was denied or unavailable. Grant camera permissions and reload.");
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      cameraRef.current?.stop();
      poseRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Posture Session</h1>
      <p className="text-slate-500 text-sm mb-6">
        Everything is processed locally in your browser. No video ever leaves your device.
      </p>

      {status === "loading" && (
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 className="animate-spin" size={20} />
          Requesting camera access...
        </div>
      )}

      {status === "error" && (
        <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 px-6 py-4 rounded-xl max-w-md text-center">
          {errorMessage}
        </div>
      )}

      {(status === "active" || status === "finished") && (
        <>
          <div className="flex gap-4 mb-6">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center min-w-[120px]">
              <p className="text-sm text-slate-400">Time Remaining</p>
              <p className="text-2xl font-mono text-emerald-400">{timer}s</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center min-w-[120px]">
              <p className="text-sm text-slate-400">Form Accuracy</p>
              <p className={`text-2xl font-mono ${accuracy < 60 ? "text-rose-500" : "text-cyan-400"}`}>
                {accuracy}%
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center min-w-[120px]">
              <p className="text-sm text-slate-400">Slouch Count</p>
              <p className="text-2xl font-mono text-amber-400">{slouchCountRef.current}</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <video ref={videoRef} className="hidden" playsInline></video>
            <canvas ref={canvasRef} width={640} height={480} className="rounded-2xl bg-slate-900"></canvas>
            {isSlouching && status === "active" && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-rose-500/90 text-slate-950 font-bold px-4 py-2 rounded-lg animate-pulse">
                <AlertTriangle size={18} />
                Slouch Detected! Sit Up!
              </div>
            )}
          </div>
        </>
      )}

      {status === "finished" && (
        <div className="mt-8 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <h2 className="text-xl font-bold">Session Complete</h2>
          {result ? (
            <>
              <p className="text-slate-400">Global Rank</p>
              <p className="text-4xl font-mono text-emerald-400">#{result.rank}</p>
              <p className="text-slate-300 italic">&ldquo;{result.roast}&rdquo;</p>
            </>
          ) : errorMessage ? (
            <p className="text-rose-400">{errorMessage}</p>
          ) : (
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Loader2 className="animate-spin" size={18} />
              Submitting session...
            </div>
          )}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg flex items-center gap-2"
            >
              <RotateCcw size={16} /> Run Again
            </button>
            <Link
              href="/leaderboard"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
