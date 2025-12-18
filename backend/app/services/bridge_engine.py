"""Bridge engine converting human archetype state to system signals."""
from __future__ import annotations

from typing import Dict, List

from app.models.bridge import BridgeConfig
from app.models.signals import HumanArchetypeState
from app.utils.clamp import clamp01, ensure_finite


def _top_keys(values: Dict[str, float], limit: int) -> List[str]:
    return [k for k, _ in sorted(values.items(), key=lambda item: item[1], reverse=True)[:limit]]


def map_human_to_system(
    human_state: HumanArchetypeState,
    bridge_cfg: BridgeConfig,
    top_limit: int = 6,
) -> Dict[str, float]:
    rules_by_id = {rule.human_archetype_id: rule for rule in bridge_cfg.rules}
    system_signals: Dict[str, float] = {}

    for result in human_state.results:
        rule = rules_by_id.get(result.archetype_id)
        if not rule:
            continue
        for name, weight in rule.system_signals.items():
            increment = ensure_finite(result.intensity * clamp01(weight), 0.0)
            system_signals[name] = system_signals.get(name, 0.0) + increment

    for key in list(system_signals.keys()):
        system_signals[key] = clamp01(ensure_finite(system_signals[key], 0.0))

    if top_limit > 0 and len(system_signals) > top_limit:
        keep = set(_top_keys(system_signals, top_limit))
        system_signals = {k: v for k, v in system_signals.items() if k in keep}

    return system_signals
