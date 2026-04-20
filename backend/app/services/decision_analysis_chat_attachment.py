"""Attach StrategicDecisionEngine output to chat responses (additive JSON)."""

from __future__ import annotations

import logging
from typing import Any

from engines.decision_engine.decision_engine import StrategicDecisionEngine
from engines.scenario_simulation.scenario_engine import ScenarioSimulationEngine
from engines.scenario_simulation.simulation_schema import ScenarioInput
from engines.system_modeling.system_model_builder import UniversalSystemModelBuilder

logger = logging.getLogger(__name__)

_builder = UniversalSystemModelBuilder()
_simulation_engine = ScenarioSimulationEngine()
_decision_engine = StrategicDecisionEngine()


def build_decision_analysis_from_prompt_text(text: str) -> dict[str, Any] | None:
    """
    Shared pipeline: text → SystemModel → baseline simulation → StrategicDecisionEngine.analyze.

    Returns a JSON-serializable dict (``DecisionAnalysis`` dump plus trimmed ``system_model``)
    for UI attachment, or None on failure / too-short input.
    """
    cleaned = (text or "").strip()
    if len(cleaned) < 8:
        return None
    try:
        system_model = _builder.build(cleaned)
        baseline = _simulation_engine.simulate(
            system_model,
            ScenarioInput(time_steps=12),
        )
        analysis = _decision_engine.analyze(system_model=system_model, simulation=baseline)
        payload: dict[str, Any] = analysis.model_dump(mode="json")
        payload["system_model"] = {"problem_summary": system_model.problem_summary}
        return payload
    except Exception:
        logger.debug("decision_analysis_attachment_failed", exc_info=True)
        return None


def try_build_decision_analysis_payload(text: str) -> dict[str, Any] | None:
    """Chat attachment entrypoint; same contract as :func:`build_decision_analysis_from_prompt_text`."""
    return build_decision_analysis_from_prompt_text(text)
