from pydantic import BaseModel, Field


class SessionSubmission(BaseModel):
    user_handle: str = Field(..., min_length=2, max_length=30)
    accuracy_score: float = Field(..., ge=0.0, le=100.0)
    slouch_count: int = Field(..., ge=0)
    hold_time_seconds: int = Field(..., ge=0)


class SessionResponse(BaseModel):
    status: str
    rank: int
    roast: str


class LeaderboardEntry(BaseModel):
    rank: int
    user_handle: str
    score: float
    roast: str
