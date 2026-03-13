"""System archetype catalog for structural pattern matching."""
from __future__ import annotations

from typing import List

from .schemas import ArchetypeDefinition, FeedbackLoop


def get_archetype_library() -> List[ArchetypeDefinition]:
    return [
        ArchetypeDefinition(
            id="obj_limits_to_growth",
            name="Limits to Growth",
            description=(
                "Reinforcing growth loop encounters a balancing constraint, "
                "causing expansion to slow or stall after a delay."
            ),
            loops=[
                FeedbackLoop(
                    id="ltg_r_growth",
                    type="R",
                    variables=["growth", "capacity_utilization", "adoption"],
                    strength=0.7,
                ),
                FeedbackLoop(
                    id="ltg_b_constraint",
                    type="B",
                    variables=["constraint", "quality", "latency"],
                    strength=0.6,
                    delay=0.4,
                ),
            ],
            typical_signals=["demand_up", "quality_down", "latency_up"],
            risk_level="medium",
            leverage_points=["capacity_investment", "quality_stabilizers", "latency_buffers"],
        ),
        ArchetypeDefinition(
            id="obj_fixes_that_fail",
            name="Fixes That Fail",
            description=(
                "A quick fix reduces symptoms in the short term, but secondary effects "
                "increase the underlying problem later."
            ),
            loops=[
                FeedbackLoop(
                    id="ftf_b_relief",
                    type="B",
                    variables=["symptom", "quick_fix"],
                    strength=0.6,
                ),
                FeedbackLoop(
                    id="ftf_r_side_effects",
                    type="R",
                    variables=["side_effects", "problem_level"],
                    strength=0.55,
                    delay=0.5,
                ),
            ],
            typical_signals=["temporary_relief", "recurring_failure", "side_effects"],
            risk_level="high",
            leverage_points=["root_cause_resolution", "side_effect_visibility"],
        ),
        ArchetypeDefinition(
            id="obj_escalation",
            name="Escalation",
            description=(
                "Two reinforcing loops amplify each other as actors react to perceived threats, "
                "driving an arms race dynamic."
            ),
            loops=[
                FeedbackLoop(
                    id="esc_r_side_a",
                    type="R",
                    variables=["action_a", "reaction_b"],
                    strength=0.65,
                ),
                FeedbackLoop(
                    id="esc_r_side_b",
                    type="R",
                    variables=["action_b", "reaction_a"],
                    strength=0.65,
                ),
            ],
            typical_signals=["arms_race", "overreaction", "conflict"],
            risk_level="high",
            leverage_points=["shared_limits", "trust_building", "response_delays"],
        ),
        ArchetypeDefinition(
            id="obj_shifting_the_burden",
            name="Shifting the Burden",
            description=(
                "Symptomatic solutions reduce immediate pressure, while fundamental capability "
                "erodes over time."
            ),
            loops=[
                FeedbackLoop(
                    id="stb_b_symptomatic",
                    type="B",
                    variables=["symptom", "symptomatic_solution"],
                    strength=0.6,
                ),
                FeedbackLoop(
                    id="stb_r_erosion",
                    type="R",
                    variables=["capability_erosion", "problem_level"],
                    strength=0.55,
                    delay=0.6,
                ),
            ],
            typical_signals=["symptomatic_reliance", "capability_decline"],
            risk_level="medium",
            leverage_points=["fundamental_investment", "symptom_visibility"],
        ),
    ]
