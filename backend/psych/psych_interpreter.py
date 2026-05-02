from __future__ import annotations

import json
import logging
import os
from typing import Any

from .schemas import PsychState

logger = logging.getLogger(__name__)


def _clamp01(value: Any, default: float) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return default
    return max(0.0, min(1.0, number))


def _fallback_interpret(text: str) -> PsychState:
    normalized = text.lower()
    focus = "self" if any(word in normalized for word in ("i ", "i'm", "me", "my ", "myself", "self", "identity", "ego", "lost")) else "environment"
    if any(word in normalized for word in ("they", "them", "others", "people", "someone")):
        focus = "others"

    if any(word in normalized for word in ("angry", "anger", "mad", "rage", "furious", "frustrated", "irritated")):
        return PsychState(
            emotion="anger",
            intensity=0.8,
            secondary_emotion="confusion" if any(word in normalized for word in ("lost", "confused", "why")) else None,
            focus=focus,
            dominant_element="fire",
            confidence=0.9,
        )
    if any(word in normalized for word in ("identity", "self", "ego", "myself", "who am i")):
        return PsychState(
            emotion="identity",
            intensity=0.74,
            secondary_emotion="uncertainty" if "lost" in normalized else None,
            focus="self",
            dominant_element="ego",
            confidence=0.86,
        )
    if any(word in normalized for word in ("calm", "peace", "peaceful", "relaxed", "safe", "steady")):
        return PsychState(
            emotion="calm",
            intensity=0.68,
            secondary_emotion=None,
            focus=focus,
            dominant_element="water",
            confidence=0.88,
        )
    if any(word in normalized for word in ("fear", "afraid", "scared", "scary", "anxious", "anxiety")):
        return PsychState(
            emotion="fear",
            intensity=0.76,
            secondary_emotion="self-protection",
            focus="self" if focus == "self" else focus,
            dominant_element="air",
            confidence=0.84,
        )
    if any(word in normalized for word in ("why", "curious", "curiosity", "wonder", "confused", "confusion")):
        return PsychState(
            emotion="curiosity",
            intensity=0.64,
            secondary_emotion="confusion" if "confus" in normalized or "lost" in normalized else None,
            focus=focus,
            dominant_element="air",
            confidence=0.82,
        )
    if any(word in normalized for word in ("energy", "alive", "excited", "hope", "bright", "power")):
        return PsychState(
            emotion="energy",
            intensity=0.66,
            secondary_emotion=None,
            focus=focus,
            dominant_element="sun",
            confidence=0.8,
        )

    return PsychState(
        emotion="attention",
        intensity=0.42,
        secondary_emotion=None,
        focus=focus,
        dominant_element="sun",
        confidence=0.62,
    )


def _coerce_psych_state(raw: dict[str, Any], fallback: PsychState) -> PsychState:
    return PsychState(
        emotion=str(raw.get("emotion") or fallback.emotion),
        intensity=_clamp01(raw.get("intensity"), fallback.intensity),
        secondary_emotion=raw.get("secondary_emotion") if isinstance(raw.get("secondary_emotion"), str) else fallback.secondary_emotion,
        focus=raw.get("focus") if raw.get("focus") in {"self", "others", "environment"} else fallback.focus,
        dominant_element=raw.get("dominant_element") if raw.get("dominant_element") in {"fire", "water", "air", "earth", "ego", "sun"} else fallback.dominant_element,
        confidence=_clamp01(raw.get("confidence"), fallback.confidence),
    )


def _interpret_with_openai(text: str, fallback: PsychState) -> PsychState | None:
    if not os.environ.get("OPENAI_API_KEY"):
        return None

    try:
        from openai import OpenAI

        client = OpenAI()
        response = client.chat.completions.create(
            model=os.environ.get("NEXORA_PSYCH_OPENAI_MODEL", "gpt-4.1-mini"),
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Return only compact JSON with keys emotion, intensity, secondary_emotion, "
                        "focus, dominant_element, confidence. dominant_element must be one of "
                        "fire, water, air, earth, ego, sun. focus must be self, others, or environment."
                    ),
                },
                {"role": "user", "content": text},
            ],
            temperature=0.2,
        )
        content = response.choices[0].message.content or "{}"
        return _coerce_psych_state(json.loads(content), fallback)
    except Exception:
        return None


def interpret_psych_input(text: str) -> PsychState:
    """
    Use OpenAI OR fallback mock.
    Must always return valid structured output.
    """
    fallback = _fallback_interpret(text)
    interpreted = _interpret_with_openai(text, fallback)
    if interpreted is None:
        logger.info("[Sycho][B12][InterpretFallback]")
        return fallback

    logger.info("[Sycho][B12][InterpretSuccess]")
    return interpreted
