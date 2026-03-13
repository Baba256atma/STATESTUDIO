"""Catalog store with JSON persistence and versioning."""
from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any

from app.models.human_catalog import HumanCatalog, HumanArchetypeDefinition, HumanArchetypeOutputs, HumanArchetypeSignals, HumanArchetypeWeights
from app.models.bridge import BridgeConfig, BridgeRule
from app.models.system_archetype_config import (
    LoopTemplate,
    SystemArchetypeCatalog,
    SystemArchetypeDefinition,
    SystemArchetypeThresholds,
)


def _now_ts() -> datetime:
    return datetime.now(timezone.utc)


def _version_stamp(dt: datetime) -> str:
    return dt.isoformat(timespec="seconds").replace(":", "")


def _atomic_write(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(path.suffix + ".tmp")
    with tmp_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, sort_keys=True)
    tmp_path.replace(path)


def _read_json(path: Path) -> Any | None:
    if not path.exists():
        return None
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        bad_path = path.with_suffix(path.suffix + ".bad")
        try:
            path.replace(bad_path)
        except OSError:
            pass
        return None


def _bootstrap_human_catalog() -> HumanCatalog:
    now = _now_ts()
    items = [
        HumanArchetypeDefinition(
            id="ha_01",
            name="Stabilizer",
            description="Seeks equilibrium through steady pacing and careful adjustments.",
            tags=["balance", "stability"],
            signals=HumanArchetypeSignals(
                keywords=["stabilize", "steady", "balance"],
                phrases=["keep it stable", "avoid swings"],
                sentiment_hint="neutral",
            ),
            weights=HumanArchetypeWeights(
                keyword_weight=0.6,
                phrase_weight=0.8,
                intensity_scale=1.0,
            ),
            outputs=HumanArchetypeOutputs(default_intensity=0.4),
            editable=True,
        ),
        HumanArchetypeDefinition(
            id="ha_02",
            name="Accelerator",
            description="Prefers rapid momentum and decisive action.",
            tags=["momentum", "speed"],
            signals=HumanArchetypeSignals(
                keywords=["fast", "accelerate", "push"],
                phrases=["move quickly", "speed things up"],
                sentiment_hint="pos",
            ),
            weights=HumanArchetypeWeights(
                keyword_weight=0.7,
                phrase_weight=0.9,
                intensity_scale=1.3,
            ),
            outputs=HumanArchetypeOutputs(default_intensity=0.6),
            editable=True,
        ),
        HumanArchetypeDefinition(
            id="ha_03",
            name="Reducer",
            description="Focuses on minimizing risk and reducing exposure.",
            tags=["risk", "caution"],
            signals=HumanArchetypeSignals(
                keywords=["reduce", "minimize", "protect"],
                phrases=["lower the risk", "reduce exposure"],
                sentiment_hint="mixed",
            ),
            weights=HumanArchetypeWeights(
                keyword_weight=0.6,
                phrase_weight=0.8,
                intensity_scale=0.9,
            ),
            outputs=HumanArchetypeOutputs(default_intensity=0.5),
            editable=True,
        ),
    ]
    return HumanCatalog(version="bootstrap", updated_at=now, items=items)


def _bootstrap_bridge_config() -> BridgeConfig:
    now = _now_ts()
    rules = [
        BridgeRule(
            human_archetype_id="ha_01",
            system_signals={
                "decision_volatility": 0.8,
                "rework": 0.6,
                "latency": 0.4,
            },
        ),
        BridgeRule(
            human_archetype_id="ha_02",
            system_signals={
                "scope_creep": 0.7,
                "resource_overload": 0.6,
                "latency": 0.5,
            },
        ),
        BridgeRule(
            human_archetype_id="ha_03",
            system_signals={
                "escalation": 0.9,
                "decision_volatility": 0.6,
            },
        ),
        BridgeRule(
            human_archetype_id="ha_04",
            system_signals={
                "short_term_relief": 0.8,
                "long_term_risk": 0.7,
            },
        ),
        BridgeRule(
            human_archetype_id="ha_05",
            system_signals={
                "dependency_growth": 0.8,
                "quality_drop": 0.5,
            },
        ),
        BridgeRule(
            human_archetype_id="ha_06",
            system_signals={
                "resource_overload": 0.9,
                "latency": 0.6,
                "quality_drop": 0.4,
            },
        ),
        BridgeRule(
            human_archetype_id="ha_07",
            system_signals={
                "decision_volatility": 0.5,
                "scope_creep": 0.6,
            },
        ),
        BridgeRule(
            human_archetype_id="ha_08",
            system_signals={
                "rework": 0.7,
                "quality_drop": 0.6,
            },
        ),
        BridgeRule(
            human_archetype_id="ha_09",
            system_signals={
                "escalation": 0.6,
                "resource_overload": 0.5,
            },
        ),
        BridgeRule(
            human_archetype_id="ha_10",
            system_signals={
                "short_term_relief": 0.6,
                "dependency_growth": 0.6,
                "long_term_risk": 0.5,
            },
        ),
    ]
    return BridgeConfig(version="bootstrap", updated_at=now, rules=rules)


def _bootstrap_system_archetypes() -> SystemArchetypeCatalog:
    now = _now_ts()
    items = [
        SystemArchetypeDefinition(
            id="obj_limits_to_growth",
            name="Limits to Growth",
            description=(
                "Reinforcing growth meets balancing constraints, leading to slowed expansion."
            ),
            required_signals=["latency", "resource_overload", "quality_drop"],
            weights={
                "latency": 0.5,
                "resource_overload": 0.8,
                "quality_drop": 0.6,
            },
            thresholds=SystemArchetypeThresholds(
                min_confidence=0.4,
                activation={
                    "latency": 0.3,
                    "resource_overload": 0.4,
                    "quality_drop": 0.3,
                },
            ),
            loops_template=[
                LoopTemplate(
                    id="ltg_r_growth",
                    type="R",
                    variables=["growth", "adoption"],
                    notes="Growth reinforces growth.",
                ),
                LoopTemplate(
                    id="ltg_b_constraint",
                    type="B",
                    variables=["constraint", "latency", "quality"],
                    notes="Constraints dampen growth after delay.",
                ),
            ],
        ),
        SystemArchetypeDefinition(
            id="obj_fixes_that_fail",
            name="Fixes That Fail",
            description=(
                "Short-term relief creates long-term risk, increasing the core issue."
            ),
            required_signals=["short_term_relief", "long_term_risk"],
            weights={"short_term_relief": 0.7, "long_term_risk": 0.9},
            thresholds=SystemArchetypeThresholds(min_confidence=0.4, activation={}),
            loops_template=[
                LoopTemplate(
                    id="ftf_b_relief",
                    type="B",
                    variables=["symptom", "short_term_relief"],
                    notes="Short-term relief reduces symptoms.",
                ),
                LoopTemplate(
                    id="ftf_r_side_effects",
                    type="R",
                    variables=["side_effects", "long_term_risk"],
                    notes="Side effects amplify the root issue.",
                ),
            ],
        ),
        SystemArchetypeDefinition(
            id="obj_escalation",
            name="Escalation",
            description=(
                "Mutual reactions reinforce each other, increasing instability."
            ),
            required_signals=["escalation", "decision_volatility"],
            weights={"escalation": 0.9, "decision_volatility": 0.5},
            thresholds=SystemArchetypeThresholds(min_confidence=0.4, activation={}),
            loops_template=[
                LoopTemplate(
                    id="esc_r_side_a",
                    type="R",
                    variables=["action_a", "reaction_b"],
                    notes="Side A reacts to Side B.",
                ),
                LoopTemplate(
                    id="esc_r_side_b",
                    type="R",
                    variables=["action_b", "reaction_a"],
                    notes="Side B reacts to Side A.",
                ),
            ],
        ),
        SystemArchetypeDefinition(
            id="obj_shifting_the_burden",
            name="Shifting the Burden",
            description=(
                "Symptomatic relief grows dependency while fundamental capability weakens."
            ),
            required_signals=["dependency_growth", "short_term_relief", "long_term_risk"],
            weights={"dependency_growth": 0.8, "long_term_risk": 0.6},
            thresholds=SystemArchetypeThresholds(min_confidence=0.4, activation={}),
            loops_template=[
                LoopTemplate(
                    id="stb_b_symptomatic",
                    type="B",
                    variables=["symptom", "short_term_relief"],
                    notes="Symptomatic fixes reduce pressure temporarily.",
                ),
                LoopTemplate(
                    id="stb_r_dependency",
                    type="R",
                    variables=["dependency_growth", "capability_erosion"],
                    notes="Reliance grows and erodes core capability.",
                ),
            ],
        ),
    ]
    return SystemArchetypeCatalog(version="bootstrap", updated_at=now, items=items)


class CatalogStore:
    def __init__(self, base_dir: str = "backend/data"):
        self.base_dir = Path(base_dir)
        self.human_dir = self.base_dir / "human_catalog"
        self.bridge_dir = self.base_dir / "bridge_config"
        self.system_dir = self.base_dir / "system_archetypes"
        self.human_current = self.human_dir / "current.json"
        self.bridge_current = self.bridge_dir / "current.json"
        self.system_current = self.system_dir / "current.json"

    def load_human_catalog(self) -> HumanCatalog:
        raw = _read_json(self.human_current)
        if raw is None:
            catalog = _bootstrap_human_catalog()
            self.save_human_catalog(catalog)
            return catalog
        return HumanCatalog.model_validate(raw)

    def save_human_catalog(self, catalog: HumanCatalog) -> HumanCatalog:
        validated = HumanCatalog.model_validate(catalog.model_dump())
        now = _now_ts()
        version = _version_stamp(now)
        payload = validated.model_dump()
        payload["version"] = version
        payload["updated_at"] = now.isoformat()
        history_path = self.human_dir / "history" / f"{version}.json"
        _atomic_write(history_path, payload)
        _atomic_write(self.human_current, payload)
        return HumanCatalog.model_validate(payload)

    def load_bridge_config(self) -> BridgeConfig:
        raw = _read_json(self.bridge_current)
        if raw is None:
            cfg = _bootstrap_bridge_config()
            self.save_bridge_config(cfg)
            return cfg
        return BridgeConfig.model_validate(raw)

    def save_bridge_config(self, cfg: BridgeConfig) -> BridgeConfig:
        validated = BridgeConfig.model_validate(cfg.model_dump())
        now = _now_ts()
        version = _version_stamp(now)
        payload = validated.model_dump()
        payload["version"] = version
        payload["updated_at"] = now.isoformat()
        history_path = self.bridge_dir / "history" / f"{version}.json"
        _atomic_write(history_path, payload)
        _atomic_write(self.bridge_current, payload)
        return BridgeConfig.model_validate(payload)

    def load_system_archetypes(self) -> SystemArchetypeCatalog:
        raw = _read_json(self.system_current)
        if raw is None:
            catalog = _bootstrap_system_archetypes()
            self.save_system_archetypes(catalog)
            return catalog
        return SystemArchetypeCatalog.model_validate(raw)

    def save_system_archetypes(self, catalog: SystemArchetypeCatalog) -> SystemArchetypeCatalog:
        validated = SystemArchetypeCatalog.model_validate(catalog.model_dump())
        now = _now_ts()
        version = _version_stamp(now)
        payload = validated.model_dump()
        payload["version"] = version
        payload["updated_at"] = now.isoformat()
        history_path = self.system_dir / "history" / f"{version}.json"
        _atomic_write(history_path, payload)
        _atomic_write(self.system_current, payload)
        return SystemArchetypeCatalog.model_validate(payload)
