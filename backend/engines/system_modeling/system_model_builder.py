"""Main builder for Nexora universal system models."""

from __future__ import annotations

import re

from backend.engines.system_modeling.conflict_detector import SystemConflictDetector
from backend.engines.system_modeling.fragility_detector import SystemFragilityDetector
from backend.engines.system_modeling.loop_detector import SystemLoopDetector
from backend.engines.system_modeling.model_schema import SystemModel, SystemObject, SystemRelationship, SystemSignal
from backend.engines.system_modeling.object_extractor import SystemObjectExtractor
from backend.engines.system_modeling.signal_extractor import SystemSignalExtractor


_RELATION_VERBS: tuple[tuple[tuple[str, ...], str], ...] = (
    (("depends on", "dependent on"), "dependency"),
    (("increases", "increase", "raising", "raises", "drives", "driving"), "influence"),
    (("reduces", "reduce", "weakens", "erodes", "degrading"), "influence"),
    (("controls", "regulates", "governs"), "control"),
    (("competes", "competition", "competing"), "competition"),
    (("cooperates", "coordination", "alliance", "partner"), "cooperation"),
)

_OBJECT_ALIASES: dict[str, tuple[str, ...]] = {
    "obj_company": ("company", "firm", "business"),
    "obj_supplier": ("supplier", "suppliers", "vendor", "vendors"),
    "obj_customer": ("customer", "customers", "buyer", "buyers", "client", "clients"),
    "obj_inventory": ("inventory", "stock", "buffer"),
    "obj_market": ("market", "industry"),
    "obj_competitor": ("competitor", "competitors", "rival", "rivals"),
    "obj_startup": ("startup", "startups"),
    "obj_government": ("government", "state"),
    "obj_regulator": ("regulator", "regulators"),
    "obj_population": ("population", "public", "citizens"),
    "obj_bank": ("bank", "banks"),
    "obj_central_bank": ("central bank",),
    "obj_leadership": ("leadership", "management", "executive team"),
    "obj_team": ("team", "teams", "department", "departments", "organization"),
    "obj_technology": ("technology", "platform", "system", "software"),
    "obj_workforce": ("workforce", "employees", "staff"),
    "obj_logistics": ("logistics", "distribution", "transport"),
    "obj_investor": ("investor", "investors", "capital"),
    "obj_system": ("system",),
}


class UniversalSystemModelBuilder:
    """Transform natural language problem descriptions into system models."""

    def __init__(self) -> None:
        self.object_extractor = SystemObjectExtractor()
        self.signal_extractor = SystemSignalExtractor()
        self.loop_detector = SystemLoopDetector()
        self.conflict_detector = SystemConflictDetector()
        self.fragility_detector = SystemFragilityDetector()

    def build(self, problem_text: str) -> SystemModel:
        """Build and validate a complete system model."""
        normalized = _normalize(problem_text)
        objects = self.object_extractor.extract(normalized)
        signals = self.signal_extractor.extract(normalized)
        relationships = self._extract_relationships(normalized, objects, signals)
        loops = self.loop_detector.detect(normalized, [item.model_dump(by_alias=True) for item in relationships])
        conflicts = self.conflict_detector.detect(normalized, objects)
        fragility_points = self.fragility_detector.detect(normalized, signals)

        return SystemModel(
            problem_summary=self._build_summary(problem_text),
            objects=objects,
            signals=signals,
            relationships=relationships,
            loops=loops,
            conflicts=conflicts,
            fragility_points=fragility_points,
        )

    def _extract_relationships(
        self,
        text: str,
        objects: list[SystemObject],
        signals: list[SystemSignal],
    ) -> list[SystemRelationship]:
        relationships: list[SystemRelationship] = []
        seen: set[tuple[str, str, str]] = set()
        sentences = [sentence.strip() for sentence in re.split(r"[.;]", text) if sentence.strip()]

        for sentence in sentences:
            mentioned_objects = _mentioned_objects(sentence, objects)
            if len(mentioned_objects) < 2:
                continue
            relation_type = _relation_type(sentence)
            source_id = mentioned_objects[0].id
            target_id = mentioned_objects[1].id
            key = (source_id, target_id, relation_type)
            if key in seen:
                continue
            seen.add(key)
            relationships.append(
                SystemRelationship(
                    from_object=source_id,
                    to_object=target_id,
                    type=relation_type,
                )
            )

        if relationships:
            return relationships

        if len(objects) >= 2:
            for index in range(len(objects) - 1):
                key = (objects[index].id, objects[index + 1].id, "dependency")
                if key in seen:
                    continue
                seen.add(key)
                relationships.append(
                    SystemRelationship(
                        from_object=objects[index].id,
                        to_object=objects[index + 1].id,
                        type="dependency",
                    )
                )
        return relationships

    @staticmethod
    def _build_summary(problem_text: str) -> str:
        sentences = [part.strip() for part in re.split(r"[.;]", problem_text.strip()) if part.strip()]
        if not sentences:
            return "Problem description provided for system modeling."
        if len(sentences) == 1:
            return sentences[0]
        return f"{sentences[0]}. {sentences[1]}"


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def _mentioned_objects(sentence: str, objects: list[SystemObject]) -> list[SystemObject]:
    matches: list[tuple[int, SystemObject]] = []
    for obj in objects:
        aliases = _OBJECT_ALIASES.get(obj.id, (obj.name.lower(),))
        positions = [
            match.start()
            for alias in aliases
            if (match := re.search(rf"\b{re.escape(alias)}\b", sentence))
        ]
        if positions:
            matches.append((min(positions), obj))
    matches.sort(key=lambda item: item[0])
    return [obj for _, obj in matches]


def _relation_type(sentence: str) -> str:
    for phrases, relation_type in _RELATION_VERBS:
        if any(phrase in sentence for phrase in phrases):
            return relation_type
    return "dependency"
