from __future__ import annotations

from chaos_engine.core import ChaosEngine
from chaos_engine.scene_adapter import build_scene_actions
from chaos_engine.mapping import map_chaos


def main() -> None:
    engine = ChaosEngine()
    samples = [
        "I feel anxious and unsafe",
        "I want clarity and insight",
        "I feel love and connection",
    ]
    for text in samples:
        result = engine.analyze(text)
        ids = map_chaos(result, mode="spirit")
        actions = build_scene_actions(result, mode="spirit")
        print(f"text: {text!r}")
        print(f"affected_ids: {ids}")
        print(f"scene_actions: {actions}")
        print("-" * 40)


if __name__ == "__main__":
    main()
