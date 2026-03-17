"""Compatibility wrapper for the universal system-modeling engine."""

from __future__ import annotations

from backend.engines.system_modeling.system_model_builder import UniversalSystemModelBuilder
from app.schemas.ai import (
    SystemConflict,
    SystemFeedbackLoop,
    SystemFragilityPoint,
    SystemModel,
    SystemModelObject,
    SystemModelRelationship,
    SystemModelSignal,
    SystemScenarioInput,
)


class UniversalSystemModelingEngine:
    """Build machine-readable system models using the shared backend engine."""

    def __init__(self) -> None:
        self.builder = UniversalSystemModelBuilder()

    def build(self, *, text: str, context: dict | None = None, metadata: dict | None = None) -> SystemModel:
        """Return a deterministic system model compatible with the AI layer."""
        built = self.builder.build(text)
        scenario_inputs = [
            SystemScenarioInput(
                id=f"scn_{signal.id}",
                name=f"{signal.name} Scenario",
                signal=signal.name,
                baseline="current observed level",
                stress_case=_stress_case_for(signal.name, built.fragility_points),
            )
            for signal in built.signals
        ]
        return SystemModel(
            problem_summary=built.problem_summary,
            objects=[
                SystemModelObject(
                    id=item.id,
                    type=item.type,
                    name=item.name,
                    description=item.description,
                )
                for item in built.objects
            ],
            signals=[
                SystemModelSignal(
                    id=item.id,
                    name=item.name,
                    type=item.type,
                    description=None,
                )
                for item in built.signals
            ],
            relationships=[
                SystemModelRelationship(
                    from_object=item.from_object,
                    to_object=item.to_object,
                    type=item.type,
                    description=None,
                )
                for item in built.relationships
            ],
            loops=[
                SystemFeedbackLoop(
                    name=item.name,
                    type=item.type,
                    path=item.path,
                )
                for item in built.loops
            ],
            conflicts=[
                SystemConflict(
                    name=item.name,
                    actors=item.actors,
                    tradeoff=item.tradeoff,
                )
                for item in built.conflicts
            ],
            fragility_points=[
                SystemFragilityPoint(
                    signal=item.signal,
                    threshold=item.threshold,
                    description=None,
                )
                for item in built.fragility_points
            ],
            scenario_inputs=scenario_inputs,
        )


def _stress_case_for(signal_name: str, fragility_points: list) -> str:
    normalized = signal_name.lower()
    for item in fragility_points:
        if item.signal == normalized:
            return item.threshold
    return "adverse deviation from baseline"
