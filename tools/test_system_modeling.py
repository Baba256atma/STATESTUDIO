#!/usr/bin/env python3
"""CLI smoke test for the Nexora universal system-modeling engine."""

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


def main() -> int:
    problem_text = (
        "Supply chain delays are increasing costs and reducing customer satisfaction. "
        "Suppliers are unreliable and inventory shortages create panic orders."
    )
    builder = UniversalSystemModelBuilder()
    model = builder.build(problem_text)
    print(json.dumps(model.model_dump(by_alias=True), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
