from fastapi import APIRouter, HTTPException

from app.models.schemas import SessionResponse, SessionSubmission
from app.services.roast_ai import generate_gen_z_roast

router = APIRouter()


@router.post("/", response_model=SessionResponse)
def submit_session(payload: SessionSubmission) -> SessionResponse:
    try:
        rank, roast = generate_gen_z_roast(payload.accuracy_score)
        return SessionResponse(status="success", rank=rank, roast=roast)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
