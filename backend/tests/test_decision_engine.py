from __future__ import annotations

from backend.engines.decision_engine.decision_engine import StrategicDecisionEngine
from backend.engines.decision_engine.decision_schema import CandidateAction
from backend.engines.scenario_simulation.scenario_engine import ScenarioSimulationEngine
from backend.engines.scenario_simulation.simulation_schema import ScenarioInput, ScenarioShock
from backend.engines.system_modeling.system_model_builder import UniversalSystemModelBuilder


def test_decision_engine_generates_recommendation_for_supply_chain():
    builder = UniversalSystemModelBuilder()
    model = builder.build(
        "Supply chain delays are increasing costs and reducing customer satisfaction. "
        "Suppliers are unreliable and inventory shortages create panic orders."
    )
    baseline = ScenarioSimulationEngine().simulate(
        model,
        ScenarioInput(
            shocks=[
                ScenarioShock(signal="demand", delta=0.25),
                ScenarioShock(signal="supplier reliability", delta=-0.2),
            ],
            time_steps=10,
        ),
    )

    analysis = StrategicDecisionEngine().analyze(system_model=model, simulation=baseline)

    assert analysis.recommended_action is not None
    assert analysis.strategies
    assert analysis.scenario_comparison is not None
    assert 0.0 <= analysis.risk_analysis.baseline_risk <= 1.0


def test_decision_engine_accepts_explicit_candidate_actions():
    builder = UniversalSystemModelBuilder()
    model = builder.build(
        "Technology adoption is slow, security risk is rising, and teams are under pressure."
    )
    baseline = ScenarioSimulationEngine().simulate(
        model,
        ScenarioInput(
            shocks=[
                ScenarioShock(signal="adoption", delta=-0.2),
                ScenarioShock(signal="risk", delta=0.15),
            ],
            time_steps=8,
        ),
    )

    analysis = StrategicDecisionEngine().analyze(
        system_model=model,
        simulation=baseline,
        candidate_actions=[
            CandidateAction(id="act_training_rollout", description="Invest in adoption training and enablement."),
            CandidateAction(id="act_harden_security", description="Harden security controls."),
        ],
    )

    strategy_ids = [item.id for item in analysis.strategies]
    assert "act_training_rollout" in strategy_ids
    assert "act_harden_security" in strategy_ids
    assert analysis.recommended_action is not None


def test_decision_engine_detects_strategy_tradeoffs():
    builder = UniversalSystemModelBuilder()
    model = builder.build(
        "The startup faces intense competition and rising burn. "
        "Leadership wants growth, but investors worry about stability."
    )
    baseline = ScenarioSimulationEngine().simulate(
        model,
        ScenarioInput(
            shocks=[ScenarioShock(signal="cost", delta=0.2)],
            time_steps=8,
        ),
    )

    analysis = StrategicDecisionEngine().analyze(
        system_model=model,
        simulation=baseline,
        candidate_actions=[
            CandidateAction(id="act_expand_capacity", description="Increase capacity and pricing reach."),
            CandidateAction(id="act_reduce_cost", description="Reduce cost exposure with efficiency controls."),
        ],
    )

    assert any(item.unintended_consequences for item in analysis.strategies)
    assert analysis.strategies[0].decision_score >= analysis.strategies[-1].decision_score
