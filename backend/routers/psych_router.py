from fastapi import APIRouter

from psych.psych_interpreter import interpret_psych_input
from psych.schemas import PsychInterpretRequest, PsychState


router = APIRouter(prefix="/psych", tags=["psych"])


@router.post("/interpret", response_model=PsychState)
def interpret_psych(request: PsychInterpretRequest) -> PsychState:
    return interpret_psych_input(request.text)
