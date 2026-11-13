from fastapi import APIRouter

from app.models.schemas import LeaderboardEntry

router = APIRouter()

MOCK_LEADERBOARD = [
    LeaderboardEntry(rank=1, user_handle="CyberOperator", score=98.5, roast="Absolute sovereign alignment."),
    LeaderboardEntry(rank=2, user_handle="RedGhost", score=96.2, roast="Spinal column forged in titanium."),
    LeaderboardEntry(rank=3, user_handle="NeuronCoder", score=91.0, roast="Clean posture, zero latency."),
    LeaderboardEntry(rank=4, user_handle="QuantumSlouch", score=87.3, roast="Decent alignment, minor lumbar drift."),
    LeaderboardEntry(rank=5, user_handle="ByteBender", score=82.1, roast="Mid-tier spine energy, room to grow."),
]


@router.get("/", response_model=list[LeaderboardEntry])
def get_leaderboard() -> list[LeaderboardEntry]:
    return MOCK_LEADERBOARD
