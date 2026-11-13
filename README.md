# PosturePulse

Real-time, 100%-client-side AI posture tracking with a FastAPI backend for session scoring and a Gen-Z roast leaderboard.

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS. Pose detection runs entirely in-browser via `@mediapipe/pose` (WASM) — no video is ever sent to a server.
- **Backend**: FastAPI + Pydantic v2. Scores sessions and generates roasts; no video/image data is ever received, only numeric telemetry (accuracy score, slouch count, hold time).

## Running locally

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs available at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at http://localhost:3000

The frontend expects the backend at `http://localhost:8000/api/v1` (configurable via `NEXT_PUBLIC_API_BASE` in `frontend/.env.local`).

## Privacy

Camera frames are processed locally via MediaPipe's WASM runtime in the browser. Only a numeric accuracy score, slouch count, and hold duration are sent to the backend when a session ends.
