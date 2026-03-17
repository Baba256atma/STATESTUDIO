"""Prompt builders for structured local AI tasks."""

from __future__ import annotations

from typing import Literal


AITaskType = Literal[
    "analyze_scenario",
    "extract_objects",
    "explain",
    "classify_intent",
    "summarize_context",
]


def _render_context_block(context: dict | None) -> str:
    if not context:
        return ""
    context_lines = [f"- {key}: {value}" for key, value in context.items()]
    return "\nContext:\n" + "\n".join(context_lines)


def build_analyze_scenario_prompt(text: str, context: dict | None = None) -> str:
    """Build a structured prompt for scenario analysis."""
    return (
        "You are Nexora's local analysis model.\n"
        "Return JSON only.\n"
        "Do not include markdown, commentary, or scene instructions.\n"
        "JSON schema:\n"
        '{'
        '"summary": "string", '
        '"risk_signals": [{"key": "string", "label": "string", "score": 0.0, "confidence": 0.0, "weight": 0.0}], '
        '"object_candidates": [{"object_id": "string", "label": "string", "object_type": "string", "score": 0.0, "confidence": 0.0, "weight": 0.0}], '
        '"metadata": {"decision_note": "string"}'
        '}\n'
        f"User input: {text}"
        f"{_render_context_block(context)}"
    )


def build_extract_objects_prompt(text: str, context: dict | None = None) -> str:
    """Build a structured prompt for object extraction."""
    return (
        "You are Nexora's local object extraction model.\n"
        "Return JSON only.\n"
        "Do not include markdown, commentary, or scene instructions.\n"
        "JSON schema:\n"
        '{'
        '"summary": "string", '
        '"risk_signals": [], '
        '"object_candidates": [{"object_id": "string", "label": "string", "object_type": "string", "score": 0.0, "confidence": 0.0, "weight": 0.0}], '
        '"metadata": {"focus": "string"}'
        '}\n'
        f"User input: {text}"
        f"{_render_context_block(context)}"
    )


def build_explain_prompt(text: str, context: dict | None = None) -> str:
    """Build a structured prompt for explanation tasks."""
    return (
        "You are Nexora's local explanation model.\n"
        "Return JSON only.\n"
        "Do not include markdown, commentary, or scene instructions.\n"
        "JSON schema:\n"
        '{'
        '"summary": "string", '
        '"risk_signals": [], '
        '"object_candidates": [], '
        '"metadata": {"explanation_type": "string"}'
        '}\n'
        f"User input: {text}"
        f"{_render_context_block(context)}"
    )


def build_classify_intent_prompt(text: str, context: dict | None = None) -> str:
    """Build a structured prompt for intent classification tasks."""
    return (
        "You are Nexora's local intent classification model.\n"
        "Return JSON only.\n"
        "Do not include markdown, commentary, or scene instructions.\n"
        "JSON schema:\n"
        '{'
        '"summary": "string", '
        '"risk_signals": [], '
        '"object_candidates": [], '
        '"metadata": {"intent": "string"}'
        '}\n'
        f"User input: {text}"
        f"{_render_context_block(context)}"
    )


def build_summarize_context_prompt(text: str, context: dict | None = None) -> str:
    """Build a structured prompt for context summarization tasks."""
    return (
        "You are Nexora's local context summarization model.\n"
        "Return JSON only.\n"
        "Do not include markdown, commentary, or scene instructions.\n"
        "JSON schema:\n"
        '{'
        '"summary": "string", '
        '"risk_signals": [], '
        '"object_candidates": [], '
        '"metadata": {"context_summary": "string"}'
        '}\n'
        f"User input: {text}"
        f"{_render_context_block(context)}"
    )


def build_task_prompt(task: AITaskType, text: str, context: dict | None = None) -> str:
    """Build the prompt for a specific structured AI task."""
    builders = {
        "analyze_scenario": build_analyze_scenario_prompt,
        "extract_objects": build_extract_objects_prompt,
        "explain": build_explain_prompt,
        "classify_intent": build_classify_intent_prompt,
        "summarize_context": build_summarize_context_prompt,
    }
    return builders[task](text, context)
