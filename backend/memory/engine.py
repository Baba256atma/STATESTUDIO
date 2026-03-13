from __future__ import annotations

from typing import Dict, List, Tuple

from .models import MemoryConfig, ObjectMemoryState, clamp01, now_ts
from .store import JsonMemoryStore


class ObjectMemoryEngine:
    def __init__(self, store: JsonMemoryStore, config: MemoryConfig | None = None):
        self.store = store
        self.config = config or MemoryConfig()

    @staticmethod
    def decay_energy(energy: float, dt: int, half_life_seconds: int) -> float:
        if dt <= 0:
            return clamp01(energy)
        decayed = energy * (0.5 ** (dt / float(half_life_seconds)))
        return clamp01(decayed)

    @staticmethod
    def update_state_for_object(
        prev: ObjectMemoryState | None,
        intensity: float,
        ts: int,
        config: MemoryConfig,
    ) -> ObjectMemoryState:
        if prev is None:
            energy = clamp01(config.energy_gain * intensity)
            return ObjectMemoryState(
                hits=1,
                energy=min(config.max_energy, energy),
                last_intensity=clamp01(intensity),
                last_ts=ts,
                trend="rising" if energy > 0.05 else "stable",
            )

        dt = max(0, ts - prev.last_ts)
        decayed = ObjectMemoryEngine.decay_energy(prev.energy, dt, config.half_life_seconds)
        energy = decayed + (config.energy_gain * clamp01(intensity))
        energy = min(config.max_energy, clamp01(energy))

        if energy > prev.energy + 0.05:
            trend = "rising"
        elif energy < prev.energy - 0.05:
            trend = "falling"
        else:
            trend = "stable"

        return ObjectMemoryState(
            hits=prev.hits + 1,
            energy=energy,
            last_intensity=clamp01(intensity),
            last_ts=ts,
            trend=trend,
        )

    def apply_memory_to_scene_actions(
        self,
        scene_actions: dict,
        memory_state: Dict[str, ObjectMemoryState],
        ts: int,
    ) -> dict:
        objects = scene_actions.get("objects", [])
        if not isinstance(objects, list):
            return dict(scene_actions)

        updated_objects = []
        for obj in objects:
            if not isinstance(obj, dict) or "id" not in obj:
                updated_objects.append(obj)
                continue
            obj_id = obj.get("id")
            mem = memory_state.get(obj_id)
            if not mem:
                updated_objects.append(dict(obj))
                continue
            scale = float(obj.get("scale", 1.0))
            emphasis = float(obj.get("emphasis", 0.0))
            scale_boost = self.config.max_scale_boost * mem.energy
            emphasis_boost = self.config.max_emphasis_boost * mem.energy
            next_scale = max(self.config.min_scale, scale + scale_boost)
            next_emphasis = emphasis + emphasis_boost
            updated = dict(obj)
            updated["scale"] = next_scale
            updated["emphasis"] = next_emphasis
            updated_objects.append(updated)

        updated_scene = dict(scene_actions)
        updated_scene["objects"] = updated_objects
        return updated_scene

    def process(
        self,
        user_id: str,
        affected_ids: List[str],
        base_intensity: float,
        scene_actions: dict,
        ts: int | None = None,
    ) -> Tuple[dict, Dict[str, ObjectMemoryState]]:
        ts = now_ts() if ts is None else ts
        state = self.store.load(user_id)
        updated_state = dict(state)
        for obj_id in affected_ids:
            prev = state.get(obj_id)
            updated_state[obj_id] = self.update_state_for_object(
                prev, base_intensity, ts, self.config
            )
        self.store.save(user_id, updated_state)
        updated_actions = self.apply_memory_to_scene_actions(scene_actions, updated_state, ts)
        return updated_actions, updated_state
