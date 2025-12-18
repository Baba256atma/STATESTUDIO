"""Manual test runner for ChaosEngine.

Run this script to exercise the engine with three example texts and
print the resulting intensity, volatility, affected objects, and
explanation. No test framework required — just a simple script.
"""

from __future__ import annotations

try:
    # When executed as a module (python -m backend.chaos_engine.test_manual)
    # relative import works.
    from core import ChaosEngine
except Exception:
    # When executed directly from project root: use package import.
    from backend.chaos_engine.core import ChaosEngine


EXAMPLES = [
    "inventory is low and delays are increasing",
    "quality is stable but pressure is rising",
    "everything looks fine",
]


def run():
    engine = ChaosEngine()

    for i, text in enumerate(EXAMPLES, start=1):
        print(f"\nExample {i}: {text}")
        result = engine.analyze(text)
        print(f"  intensity: {result.intensity:.3f}")
        print(f"  volatility: {result.volatility:.3f}")
        print(f"  affected_objects: {result.affected_objects}")
        print(f"  explanation: {result.explanation}")


if __name__ == "__main__":
    run()
