from __future__ import annotations

from collections.abc import Iterable

from .schemas import PsychAnalyzeRequest, PsychAnalyzeResponse, PsychBackendElement


KEYWORDS: dict[PsychBackendElement, tuple[str, ...]] = {
    "fire": ("angry", "anger", "mad", "rage", "furious", "frustrated", "irritated", "stress", "pressure", "urgent", "tension"),
    "liquid": ("calm", "peace", "peaceful", "relaxed", "soft", "safe", "steady", "flow"),
    "air": ("curious", "curiosity", "wonder", "why", "question", "confused", "confusion", "think", "thinking"),
    "earth": ("ground", "grounded", "stable", "stability", "heavy", "body", "practical"),
    "sun": ("energy", "alive", "excited", "hope", "bright", "power", "warm", "core"),
    "ego": ("fear", "afraid", "scared", "scary", "anxious", "anxiety", "self", "identity", "ego", "me", "myself", "who am i", "i am"),
}

MESSAGES: dict[PsychBackendElement, str] = {
    "fire": "You are experiencing rising internal pressure or urgency.",
    "liquid": "A calmer emotional current is trying to organize the field.",
    "air": "Your mind is searching for meaning and moving quickly.",
    "earth": "Your system is asking for grounding and steadiness.",
    "sun": "Your core energy is brightening and asking for expression.",
    "ego": "Your center of perception is reacting and protecting itself.",
}


def _score_keywords(text: str, keywords: Iterable[str]) -> int:
    return sum(1 for keyword in keywords if keyword in text)


def analyze_psych_text(request: PsychAnalyzeRequest) -> PsychAnalyzeResponse:
    """Rule-based MVP interpreter; keep shape ready for future AI refinement."""
    text = request.text.lower().strip()
    scores: dict[PsychBackendElement, int] = {element: _score_keywords(text, words) for element, words in KEYWORDS.items()}

    if "why" in text and scores["ego"] > 0:
        scores["air"] += 1
        scores["ego"] += 1
    if scores["fire"] > 0 and scores["sun"] > 0:
        scores["sun"] += 1

    dominant = max(scores, key=lambda element: scores[element])
    if scores[dominant] == 0:
        dominant = "sun"
        scores[dominant] = 1

    secondary = [
        element
        for element, score in sorted(scores.items(), key=lambda item: item[1], reverse=True)
        if element != dominant and score > 0
    ][:3]
    intensity = min(1.0, 0.34 + scores[dominant] * 0.18 + len(secondary) * 0.06)

    return PsychAnalyzeResponse(
        dominant_element=dominant,
        intensity=round(intensity, 2),
        secondary_elements=secondary,
        message=MESSAGES[dominant],
    )
