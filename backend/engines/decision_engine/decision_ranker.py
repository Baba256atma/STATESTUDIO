"""Rank evaluated strategies and select a recommendation."""

from __future__ import annotations

from engines.decision_engine.decision_schema import RecommendedAction, RiskAnalysis, StrategyEvaluation
from engines.scenario_simulation.simulation_schema import SimulationResult
from engines.system_modeling.model_schema import SystemModel


def _clip(text: str, max_len: int = 220) -> str:
    t = " ".join(text.split())
    if len(t) <= max_len:
        return t
    return f"{t[: max(1, max_len - 1)].rstrip()}…"


def _humanize_id(strategy_id: str) -> str:
    raw = strategy_id.replace("act_", "", 1).replace("_", " ").strip()
    if not raw:
        return strategy_id
    return raw[0].upper() + raw[1:]


def _lead_clause(description: str) -> str:
    d = description.strip()
    if not d:
        return ""
    for sep in ".;\n":
        if sep in d:
            return d.split(sep, 1)[0].strip().rstrip(",")
    return d[:120].strip()


def _simulation_cycles(result: SimulationResult) -> int:
    meta = result.metadata or {}
    raw = meta.get("time_steps")
    if isinstance(raw, (int, float)) and int(raw) > 0:
        steps = int(raw)
    else:
        steps = max(len(result.timeline) - 1, 1)
    return max(1, min(8, max(1, steps // 4)))


def _time_horizon(winner: StrategyEvaluation, baseline: SimulationResult | None) -> str:
    meta = winner.simulation.metadata or {}
    raw = meta.get("time_steps")
    if isinstance(raw, (int, float)) and int(raw) > 0:
        steps = int(raw)
    else:
        steps = max(len(winner.simulation.timeline) - 1, 1)
    base_ev = len(baseline.events) if baseline is not None else 0
    ev_spread = len(winner.simulation.events) - base_ev
    if steps <= 10 and ev_spread <= 2:
        return "immediate"
    if steps <= 22:
        return "short"
    return "medium"


def _priority(winner: StrategyEvaluation, runner: StrategyEvaluation | None, risk: RiskAnalysis | None) -> str:
    br = float(risk.baseline_risk) if risk is not None else 0.45
    fc = int(risk.fragility_count) if risk is not None else 0
    cc = int(risk.conflict_count) if risk is not None else 0
    stakes = min(1.0, br * 0.55 + min(fc, 6) * 0.08 + min(cc, 6) * 0.06)

    if runner is not None:
        score_edge = max(winner.decision_score - runner.decision_score, 0.0)
        stab_edge = max(winner.stability_score - runner.stability_score, 0.0)
        risk_edge = max(runner.risk - winner.risk, 0.0)
        strong = score_edge > 0.06 or stab_edge > 0.05 or risk_edge > 0.06
    else:
        strong = winner.decision_score > 0.35 and winner.stability_score > 0.62

    if stakes >= 0.52 and strong:
        return "high"
    if stakes >= 0.38 or strong:
        return "medium"
    return "low"


def _executive_action(
    winner: StrategyEvaluation,
    system_model: SystemModel | None,
    risk: RiskAnalysis | None,
    cycles: int,
) -> str:
    core = _lead_clause(winner.description)
    if not core:
        core = _humanize_id(winner.id)

    problem = (system_model.problem_summary if system_model is not None else "").lower()
    if "demand" in problem or "customer" in problem or "order" in problem:
        bridge = "before scaling demand"
    elif "cost" in problem or "burn" in problem or "cash" in problem:
        bridge = "before expanding spend commitments"
    else:
        bridge = "before adding downstream volume"

    if risk is not None and risk.primary_fragilities:
        threat = f"{risk.primary_fragilities[0]} knock-on effects"
    else:
        threat = "cascading delivery and delay risk"

    return _clip(f"{core} within {cycles} cycle(s) {bridge} to prevent {threat}.", 240)


def _executive_title(winner: StrategyEvaluation) -> str:
    clause = _lead_clause(winner.description)
    if clause and len(clause) <= 56:
        return clause
    words = clause.split()[:7] if clause else []
    if words:
        return _clip(" ".join(words), 56)
    return _clip(_humanize_id(winner.id), 56)


def _executive_rationale(
    winner: StrategyEvaluation,
    runner: StrategyEvaluation | None,
    system_insights: list[str] | None,
) -> str:
    anchor = ""
    if system_insights:
        for line in system_insights:
            low = line.lower()
            if "fragility" in low or "concentrate" in low:
                anchor = line
                break
        if not anchor and len(system_insights) > 1:
            anchor = system_insights[1]

    if runner is not None:
        compare = (
            f"Edges out {runner.id} on stability ({winner.stability_score:.2f} vs {runner.stability_score:.2f}) "
            f"and modeled risk ({winner.risk:.2f} vs {runner.risk:.2f})."
        )
    else:
        compare = f"Top-ranked under current load; keeps modeled risk at {winner.risk:.2f} while lifting stability."

    parts = [p for p in (anchor, compare) if p]
    return _clip(" ".join(parts), 240)

def _why_this(
    decision_summary: str | None,
    winner: StrategyEvaluation,
    runner: StrategyEvaluation | None,
    system_insights: list[str] | None,
) -> str:
    anchor = ""
    if system_insights:
        for line in system_insights:
            lower = line.lower()
            if "fragility" in lower or "stability" in lower:
                anchor = line
                break
    edge = ""
    if runner is not None:
        edge = (
            f"It improves stability faster than {runner.id} while keeping risk lower "
            f"({winner.risk:.2f} vs {runner.risk:.2f})."
        )
    elif winner.decision_score > 0:
        edge = "It is the strongest available path to raise stability and contain risk."
    base = decision_summary or anchor or "This option targets the most fragile pressure point first."
    return _clip(f"{base} {edge}", 240)

def _evidence(
    winner: StrategyEvaluation,
    baseline: SimulationResult | None,
    risk: RiskAnalysis | None,
) -> list[str]:
    bullets: list[str] = []
    if risk is not None:
        bullets.append(
            f"Baseline risk is {risk.baseline_risk:.2f} with {risk.fragility_count} fragility point(s) and {risk.conflict_count} conflict(s)."
        )
        if risk.primary_fragilities:
            bullets.append(f"Fragility is concentrated around {risk.primary_fragilities[0]}.")

    if baseline is not None:
        bullets.append(
            f"Stability improves from {baseline.stability_score:.2f} to {winner.stability_score:.2f} in simulation."
        )
        if len(winner.simulation.events) < len(baseline.events):
            bullets.append(
                f"Propagation events drop from {len(baseline.events)} to {len(winner.simulation.events)} under this strategy."
            )
        elif winner.risk < 0.5:
            bullets.append(f"Modeled risk remains controlled at {winner.risk:.2f} after applying this move.")
    else:
        bullets.append(f"Decision score is {winner.decision_score:.2f} with modeled risk {winner.risk:.2f}.")

    return [_clip(item, 140) for item in bullets[:4]]

def _tradeoffs(winner: StrategyEvaluation, runner: StrategyEvaluation | None) -> str:
    if winner.unintended_consequences:
        return _clip(winner.unintended_consequences[0], 140)
    if runner is not None and winner.cost > runner.cost + 0.02:
        return _clip(
            f"Slightly higher implementation cost than {runner.id} in exchange for stronger risk containment.",
            140,
        )
    if runner is not None and winner.stability_score < runner.stability_score + 0.01:
        return _clip(
            f"Smaller short-term stability edge than {runner.id}, but with better overall risk-cost balance.",
            140,
        )
    return "Requires disciplined execution to realize the projected stability gains."

def _confidence_reason(
    winner: StrategyEvaluation,
    runner: StrategyEvaluation | None,
    risk: RiskAnalysis | None,
    priority: str,
) -> str:
    gap = winner.decision_score - runner.decision_score if runner is not None else winner.decision_score
    baseline_risk = float(risk.baseline_risk) if risk is not None else 0.45
    if gap >= 0.1 and winner.risk <= 0.45:
        level = "high"
        rationale = "clear lead over alternatives and controlled modeled risk"
    elif gap >= 0.04 and winner.risk <= 0.62:
        level = "medium"
        rationale = "moderate lead versus alternatives with manageable risk"
    else:
        level = "low"
        rationale = "small margin versus alternatives under elevated risk"
    return _clip(
        f"Confidence is {level} because the decision gap is {gap:.2f}, modeled strategy risk is {winner.risk:.2f}, "
        f"and baseline risk is {baseline_risk:.2f} ({priority} priority). {rationale}.",
        220,
    )

class DecisionRanker:
    """Rank strategies using weighted evaluation output."""

    def rank(self, strategies: list[StrategyEvaluation]) -> list[StrategyEvaluation]:
        """Return strategies ordered from strongest to weakest."""
        return sorted(
            strategies,
            key=lambda item: (item.decision_score, item.stability_score, item.resilience_score, -item.risk, -item.cost),
            reverse=True,
        )

    def recommend(
        self,
        strategies: list[StrategyEvaluation],
        *,
        baseline: SimulationResult | None = None,
        risk_analysis: RiskAnalysis | None = None,
        system_model: SystemModel | None = None,
        system_insights: list[str] | None = None,
        decision_summary: str | None = None,
    ) -> RecommendedAction | None:
        """Return the top-ranked strategy with executive-grade fields."""
        ranked = self.rank(strategies)
        if not ranked:
            return None
        winner = ranked[0]
        runner = ranked[1] if len(ranked) > 1 else None
        cycles = _simulation_cycles(winner.simulation)
        horizon = _time_horizon(winner, baseline)
        pri = _priority(winner, runner, risk_analysis)

        title = _executive_title(winner)
        action = _executive_action(winner, system_model, risk_analysis, cycles)
        rationale = _executive_rationale(winner, runner, system_insights)
        outcome = _clip(winner.expected_outcome, 200)
        why_this = _why_this(decision_summary, winner, runner, system_insights)
        evidence = _evidence(winner, baseline, risk_analysis)
        tradeoffs = _tradeoffs(winner, runner)
        confidence_reason = _confidence_reason(winner, runner, risk_analysis, pri)

        reason = _clip(f"{action} ({pri} priority, {horizon} horizon).", 260)

        return RecommendedAction(
            id=winner.id,
            reason=reason,
            title=title,
            action=action,
            rationale=rationale,
            expected_outcome=outcome,
            priority=pri,
            time_horizon=horizon,
            why_this=why_this,
            evidence=evidence,
            tradeoffs=tradeoffs,
            confidence_reason=confidence_reason,
        )
