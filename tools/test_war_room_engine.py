#!/usr/bin/env python3
"""CLI smoke test for the Nexora Strategy War-Room Engine."""

from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT_DIR / "backend"

for path in (ROOT_DIR, BACKEND_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)

from backend.engines.system_modeling.system_model_builder import UniversalSystemModelBuilder  # noqa: E402
from backend.engines.war_room.war_room_engine import StrategyWarRoomEngine  # noqa: E402
from backend.engines.war_room.war_room_schema import WarRoomActor, WarRoomSimulation  # noqa: E402


def main() -> int:
    problem_text = (
        "Supply chain delays are increasing costs and reducing customer satisfaction. "
        "Suppliers are unreliable and inventory shortages create panic orders while competitors cut prices."
    )
    model = UniversalSystemModelBuilder().build(problem_text)
    result = StrategyWarRoomEngine().run(
        WarRoomSimulation(
            system_model=model,
            actors=[
                WarRoomActor(id="actor_company", type="company"),
                WarRoomActor(id="actor_competitor", type="competitor"),
                WarRoomActor(id="actor_market", type="market"),
            ],
            strategies={
                "actor_company": ["expand capacity", "reduce price", "diversify suppliers"],
                "actor_competitor": ["price war", "product innovation"],
                "actor_market": ["adaptive pricing", "cooperate on supply"],
            },
            time_steps=12,
        )
    )
    print(json.dumps(result.model_dump(), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
