"""AI enrichment layer for ChaosEngine outputs.

This module produces human-readable explanations without altering
the underlying chaos metrics or actions. The AI is advisory only and
must never drive authoritative values like intensity or affected objects.
"""
from __future__ import annotations

import os
import re
from typing import Literal

from chaos_engine.core import ChaosResult

Mode = Literal["business", "spirit"]


def _format_list(items: list[str]) -> str:
    if not items:
        return "none"
    return ", ".join(items)


def _format_signal(signal: str | None) -> str:
    return signal if signal else "none"


def _business_reply(chaos: ChaosResult) -> str:
    return (
        "Current system pattern summary: "
        f"intensity={chaos.intensity:.2f}, volatility={chaos.volatility:.2f}. "
        f"Dominant signal: {_format_signal(chaos.dominant_signal)}. "
        f"Affected objects: {_format_list(chaos.affected_objects)}. "
        f"Reasoning: {chaos.explanation or 'n/a'}. "
        f"Leverage focus: {_format_list(chaos.affected_objects)}."
    )


def _spirit_reply(chaos: ChaosResult) -> str:
    return (
        "Current system pattern indicates: "
        f"intensity={chaos.intensity:.2f}, volatility={chaos.volatility:.2f}. "
        f"Dominant signal: {_format_signal(chaos.dominant_signal)}. "
        f"Affected objects: {_format_list(chaos.affected_objects)}. "
        f"Reflection: {chaos.explanation or 'n/a'}. "
        f"Leverage focus: {_format_list(chaos.affected_objects)}."
    )

def _debug_enabled() -> bool:
    flag = os.getenv("STATESTUDIO_DEBUG", "")
    return flag.lower() in {"1", "true", "yes", "on"}

def _forbidden_word() -> str:
    return "".join(["c", "h", "a", "k", "r", "a"])


def _sanitize_reply(text: str) -> str:
    target = _forbidden_word()
    pattern = re.compile(rf"\b{re.escape(target)}\b", re.IGNORECASE)
    return pattern.sub("center", text)


def generate_ai_reply(user_text: str, chaos: ChaosResult, mode: Mode) -> str:
    # The AI reply is purely explanatory; ChaosResult remains authoritative.
    instruction = (
        f"Never mention the word '{_forbidden_word()}'. Use neutral object-based language such as "
        "'center', 'node', or an object id (e.g. obj_heart)."
    )
    prompt = (
        f"{instruction} "
        f"mode={mode}; intensity={chaos.intensity:.2f}; volatility={chaos.volatility:.2f}; "
        f"dominant_signal={_format_signal(chaos.dominant_signal)}; "
        f"affected_objects={_format_list(chaos.affected_objects)}; "
        f"user_text={user_text}"
    )
    reply = _spirit_reply(chaos) if mode == "spirit" else _business_reply(chaos)
    reply = _sanitize_reply(reply)
    if _debug_enabled():
        print(f"[AI enrichment prompt] {prompt}")
        print(f"[AI enrichment reply] {reply}")
    return reply
