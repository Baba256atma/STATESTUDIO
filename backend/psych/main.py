from fastapi import APIRouter

from .interpreter import analyze_psych_text
from .schemas import PsychAnalyzeRequest, PsychAnalyzeResponse


router = APIRouter(prefix="/psych", tags=["psych"])


@router.post("/analyze", response_model=PsychAnalyzeResponse)
def analyze_psych(request: PsychAnalyzeRequest) -> PsychAnalyzeResponse:
    return analyze_psych_text(request)
