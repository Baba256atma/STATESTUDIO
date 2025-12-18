from __future__ import annotations

from memory.engine import ObjectMemoryEngine
from memory.models import MemoryConfig
from memory.store import JsonMemoryStore


def _base_actions(ids: list[str]) -> dict:
    return {"objects": [{"id": obj_id, "scale": 1.0, "color": "#999999", "emphasis": 0.0} for obj_id in ids]}


def main() -> None:
    store = JsonMemoryStore()
    engine = ObjectMemoryEngine(store, MemoryConfig())
    user_id = "demo_user"

    ts0 = 1700000000
    cases = [
        (ts0, 0.7, ["obj_inventory"]),
        (ts0 + 60, 0.8, ["obj_inventory", "obj_quality"]),
        (ts0 + 120, 0.4, ["obj_inventory"]),
    ]

    for ts, intensity, ids in cases:
        scene_actions = _base_actions(ids)
        updated_actions, state = engine.process(
            user_id=user_id,
            affected_ids=ids,
            base_intensity=intensity,
            scene_actions=scene_actions,
            ts=ts,
        )
        print(f"ts={ts} intensity={intensity} ids={ids}")
        print(f"scene_actions: {updated_actions}")
        print("memory_state:")
        for obj_id in ids:
            mem = state.get(obj_id)
            if mem:
                print(
                    f"  {obj_id}: hits={mem.hits} energy={mem.energy:.3f} "
                    f"trend={mem.trend}"
                )
        print("-" * 40)


if __name__ == "__main__":
    main()
