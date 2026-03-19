"""Deterministic candidate strategy generation for Nexora decisions."""

from __future__ import annotations

from engines.decision_engine.decision_schema import CandidateAction
from engines.system_modeling.model_schema import SystemModel


class StrategyGenerator:
    """Generate candidate strategies from system structure and signals."""

    def generate(self, system_model: SystemModel) -> list[CandidateAction]:
        """Return ordered deterministic strategies inferred from the model."""
        signal_names = {signal.name.lower() for signal in system_model.signals}
        object_ids = {obj.id for obj in system_model.objects}
        actions: list[CandidateAction] = []

        if "inventory level" in signal_names or "obj_inventory" in object_ids:
            actions.append(
                CandidateAction(
                    id="act_increase_inventory_buffer",
                    description="Increase inventory buffer and protect critical stock levels.",
                )
            )
        if "reliability" in signal_names or "obj_supplier" in object_ids:
            actions.append(
                CandidateAction(
                    id="act_diversify_suppliers",
                    description="Diversify suppliers to reduce dependency on unreliable inputs.",
                )
            )
        if "operational cost" in signal_names:
            actions.append(
                CandidateAction(
                    id="act_reduce_cost_exposure",
                    description="Reduce cost exposure through targeted efficiency and contract controls.",
                )
            )
        if "system pressure" in signal_names or "protest intensity" in signal_names:
            actions.append(
                CandidateAction(
                    id="act_relieve_operational_pressure",
                    description="Relieve systemic pressure with staged intervention and de-escalation measures.",
                )
            )
        if "adoption rate" in signal_names or "obj_technology" in object_ids:
            actions.append(
                CandidateAction(
                    id="act_invest_in_adoption_enablement",
                    description="Invest in enablement, training, and rollout support to improve adoption.",
                )
            )
        if "security risk" in signal_names:
            actions.append(
                CandidateAction(
                    id="act_harden_security_controls",
                    description="Harden security controls and reduce exposed attack surface.",
                )
            )
        if "legitimacy" in signal_names:
            actions.append(
                CandidateAction(
                    id="act_restore_legitimacy",
                    description="Restore legitimacy through communication, concessions, and governance reform.",
                )
            )
        if "liquidity" in signal_names:
            actions.append(
                CandidateAction(
                    id="act_preserve_liquidity",
                    description="Preserve liquidity through reserves, credit support, and phased spending.",
                )
            )
        if "margin" in signal_names or "demand" in signal_names:
            actions.append(
                CandidateAction(
                    id="act_adjust_pricing_and_capacity",
                    description="Adjust pricing and capacity to stabilize demand and margin pressure.",
                )
            )

        if actions:
            return actions
        return [
            CandidateAction(
                id="act_invest_in_resilience",
                description="Invest in resilience to reduce systemic fragility and improve stability.",
            )
        ]
