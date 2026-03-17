#!/usr/bin/env python3
"""CLI smoke test for the Nexora strategic decision engine."""

from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT_DIR / "backend"

for path in (ROOT_DIR, BACKEND_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)

from backend.engines.decision_engine.decision_engine import StrategicDecisionEngine  # noqa: E402
from backend.engines.decision_engine.decision_schema import CandidateAction  # noqa: E402
from backend.engines.scenario_simulation.scenario_engine import ScenarioSimulationEngine  # noqa: E402
from backend.engines.scenario_simulation.simulation_schema import ScenarioInput, ScenarioShock  # noqa: E402
from backend.engines.system_modeling.system_model_builder import UniversalSystemModelBuilder  # noqa: E402


def main() -> int:
    problem_text = (
        "Supply chain delays are increasing costs and reducing customer satisfaction. "
        "Suppliers are unreliable and inventory shortages create panic orders."
    )
    model = UniversalSystemModelBuilder().build(problem_text)
    baseline = ScenarioSimulationEngine().simulate(
        model,
        ScenarioInput(
            shocks=[
                ScenarioShock(signal="demand", delta=0.25),
                ScenarioShock(signal="supplier reliability", delta=-0.2),
            ],
            time_steps=12,
        ),
    )
    result = StrategicDecisionEngine().analyze(
        system_model=model,
        simulation=baseline,
        candidate_actions=[
            CandidateAction(id="act_increase_inventory", description="Increase inventory buffer."),
            CandidateAction(id="act_diversify_supplier", description="Add new suppliers and diversify sourcing."),
        ],
    )
    print(json.dumps(result.model_dump(), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
