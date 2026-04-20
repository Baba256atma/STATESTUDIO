"""Main orchestrator for Nexora strategic decision analysis."""

from __future__ import annotations

from engines.decision_engine.decision_ranker import DecisionRanker
from engines.decision_engine.decision_schema import (
    CandidateAction,
    DecisionAnalysis,
    DecisionAnalysisRequest,
    DecisionWeights,
    RiskAnalysis,
)
from engines.decision_engine.strategy_evaluator import StrategyEvaluator
from engines.decision_engine.strategy_generator import StrategyGenerator
from engines.decision_engine.strategy_simulator import StrategySimulator
from engines.scenario_simulation.scenario_engine import ScenarioSimulationEngine
from engines.scenario_simulation.simulation_schema import ScenarioInput, SimulationResult
from engines.system_modeling.model_schema import SystemModel


class StrategicDecisionEngine:
    """Analyze complex systems and recommend strategic actions."""

    def __init__(
        self,
        *,
        simulation_engine: ScenarioSimulationEngine | None = None,
        strategy_generator: StrategyGenerator | None = None,
        strategy_simulator: StrategySimulator | None = None,
        strategy_evaluator: StrategyEvaluator | None = None,
        decision_ranker: DecisionRanker | None = None,
    ) -> None:
        self.simulation_engine = simulation_engine or ScenarioSimulationEngine()
        self.strategy_generator = strategy_generator or StrategyGenerator()
        self.strategy_simulator = strategy_simulator or StrategySimulator(self.simulation_engine)
        self.strategy_evaluator = strategy_evaluator or StrategyEvaluator()
        self.decision_ranker = decision_ranker or DecisionRanker()

    def analyze(
        self,
        *,
        system_model: SystemModel,
        simulation: SimulationResult,
        candidate_actions: list[CandidateAction] | None = None,
        weights: DecisionWeights | None = None,
        scenario: ScenarioInput | None = None,
    ) -> DecisionAnalysis:
        """Run the full strategic decision workflow."""
        weights = weights or DecisionWeights()
        scenario = scenario or ScenarioInput(
            time_steps=max(len(simulation.timeline) - 1, 1),
            metadata={"source": "baseline_simulation"},
        )
        actions = candidate_actions or self.strategy_generator.generate(system_model)
        evaluations = []
        comparison_inputs: dict[str, ScenarioInput] = {}

        for action in actions:
            result, action_scenario = self.strategy_simulator.simulate(
                system_model=system_model,
                baseline_scenario=scenario,
                action=action,
            )
            comparison_inputs[action.id] = action_scenario
            evaluations.append(
                self.strategy_evaluator.evaluate(
                    action=action,
                    baseline=simulation,
                    result=result,
                    weights=weights,
                )
            )

        ranked = self.decision_ranker.rank(evaluations)
        risk_analysis = self._risk_analysis(system_model, simulation)
        preflight_insights = self._preflight_insights(system_model, simulation)
        decision_summary = self._decision_summary(system_model, simulation, ranked)
        recommended = self.decision_ranker.recommend(
            ranked,
            baseline=simulation,
            risk_analysis=risk_analysis,
            system_model=system_model,
            system_insights=preflight_insights,
            decision_summary=decision_summary,
        )
        return DecisionAnalysis(
            decision_summary=decision_summary,
            strategies=ranked,
            recommended_action=recommended,
            scenario_comparison=self.simulation_engine.compare(system_model, comparison_inputs) if comparison_inputs else None,
            system_insights=self._system_insights(system_model, simulation, ranked),
            risk_analysis=risk_analysis,
            metadata={
                "strategy_count": len(ranked),
                "weights": weights.model_dump(),
            },
        )

    def analyze_request(self, request: DecisionAnalysisRequest) -> DecisionAnalysis:
        """Compatibility wrapper for structured request objects."""
        return self.analyze(
            system_model=request.system_model,
            simulation=request.simulation,
            candidate_actions=request.candidate_actions,
            weights=request.weights,
            scenario=request.scenario,
        )

    def _decision_summary(
        self,
        system_model: SystemModel,
        simulation: SimulationResult,
        strategies: list,
    ) -> str:
        if not strategies:
            return f"No decision strategies were generated for: {system_model.problem_summary}"
        best = strategies[0]
        return (
            f"Nexora evaluated {len(strategies)} strategies for '{system_model.problem_summary}'. "
            f"The leading option is {best.id}, which best improves stability while controlling cost and risk."
        )

    def _preflight_insights(self, system_model: SystemModel, simulation: SimulationResult) -> list[str]:
        insights = [
            f"Baseline stability is {simulation.stability_score:.2f} across {max(len(simulation.timeline) - 1, 0)} simulated steps.",
            f"The model contains {len(system_model.fragility_points)} fragility points and {len(system_model.conflicts)} strategic conflicts.",
        ]
        high_risk = [event.signal for event in simulation.events]
        if high_risk:
            insights.append(f"Fragility warnings concentrate around: {', '.join(dict.fromkeys(high_risk))}.")
        return insights

    def _system_insights(
        self,
        system_model: SystemModel,
        simulation: SimulationResult,
        strategies: list,
    ) -> list[str]:
        insights = self._preflight_insights(system_model, simulation)
        if strategies:
            best = strategies[0]
            insights.append(
                f"{best.id} ranks first because it achieves decision score {best.decision_score:.2f} with risk {best.risk:.2f}."
            )
        return insights

    def _risk_analysis(self, system_model: SystemModel, simulation: SimulationResult) -> RiskAnalysis:
        adverse = [
            value
            for key, value in simulation.final_state.items()
            if any(token in key for token in ("risk", "cost", "delay", "pressure", "panic", "protest", "security"))
        ]
        beneficial = [
            value
            for key, value in simulation.final_state.items()
            if any(token in key for token in ("inventory", "reliability", "stability", "satisfaction", "margin", "liquidity", "morale", "legitimacy", "adoption"))
        ]
        baseline_risk = round(sum(adverse) / len(adverse), 4) if adverse else 0.3
        baseline_stability = round(sum(beneficial) / len(beneficial), 4) if beneficial else simulation.stability_score
        return RiskAnalysis(
            baseline_risk=baseline_risk,
            baseline_stability=baseline_stability,
            fragility_count=len(system_model.fragility_points),
            conflict_count=len(system_model.conflicts),
            event_count=len(simulation.events),
            primary_fragilities=[point.signal for point in system_model.fragility_points],
        )
