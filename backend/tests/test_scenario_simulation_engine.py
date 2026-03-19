from __future__ import annotations

from engines.scenario_simulation.scenario_engine import ScenarioSimulationEngine
from engines.scenario_simulation.simulation_schema import ScenarioInput, ScenarioShock
from engines.system_modeling.system_model_builder import UniversalSystemModelBuilder


def test_simulation_engine_runs_supply_shock_scenario():
    builder = UniversalSystemModelBuilder()
    model = builder.build(
        "Supply chain delays are increasing costs and reducing customer satisfaction. "
        "Suppliers are unreliable and inventory shortages create panic orders."
    )

    engine = ScenarioSimulationEngine()
    result = engine.simulate(
        model,
        ScenarioInput(
            shocks=[
                ScenarioShock(signal="demand", delta=0.3),
                ScenarioShock(signal="supplier reliability", delta=-0.2),
            ],
            time_steps=10,
        ),
    )

    assert len(result.timeline) == 11
    assert result.timeline[0].t == 0
    assert result.timeline[-1].t == 10
    assert "inventory level" in result.final_state
    assert 0.0 <= result.stability_score <= 1.0


def test_simulation_engine_emits_fragility_warning_for_inventory_shock():
    builder = UniversalSystemModelBuilder()
    model = builder.build(
        "Supply chain delays are increasing costs. "
        "Suppliers are unreliable and inventory shortages create panic orders."
    )

    engine = ScenarioSimulationEngine()
    result = engine.simulate(
        model,
        ScenarioInput(
            shocks=[ScenarioShock(signal="inventory", delta=-0.45)],
            time_steps=8,
        ),
    )

    assert any(event.type == "fragility_warning" for event in result.events)
    assert any(event.signal == "inventory level" for event in result.events)


def test_simulation_engine_compares_named_scenarios():
    builder = UniversalSystemModelBuilder()
    model = builder.build(
        "Technology adoption is slow, security risk is rising, and teams are under pressure."
    )

    engine = ScenarioSimulationEngine()
    comparison = engine.compare(
        model,
        {
            "adoption_push": ScenarioInput(
                shocks=[ScenarioShock(signal="adoption", delta=0.2)],
                time_steps=10,
            ),
            "security_breakdown": ScenarioInput(
                shocks=[
                    ScenarioShock(signal="adoption", delta=-0.25),
                    ScenarioShock(signal="risk", delta=0.2),
                ],
                time_steps=10,
            ),
        },
    )

    assert comparison.best_scenario is not None
    assert comparison.worst_scenario is not None
    assert len(comparison.scenarios) == 2
    assert comparison.baseline.stability_score >= 0.0
