from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import sys

BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(BASE_DIR))

from app.models.human_catalog import (
    HumanCatalog,
    HumanArchetypeDefinition,
    HumanArchetypeOutputs,
    HumanArchetypeSignals,
    HumanArchetypeWeights,
)


def main() -> None:
    now = datetime.now(timezone.utc)
    items = []
    for idx in range(1, 50):
        archetype_id = f"ha_{idx:02d}"
        items.append(
            HumanArchetypeDefinition(
                id=archetype_id,
                name=f"Archetype {idx:02d}",
                description="Placeholder definition. Update this archetype via the catalog API.",
                tags=["placeholder"],
                signals=HumanArchetypeSignals(
                    keywords=[],
                    phrases=[],
                    sentiment_hint="neutral",
                ),
                weights=HumanArchetypeWeights(
                    keyword_weight=0.6,
                    phrase_weight=0.8,
                    intensity_scale=1.0,
                ),
                outputs=HumanArchetypeOutputs(default_intensity=0.4),
                editable=True,
            )
        )

    catalog = HumanCatalog(version="seed", updated_at=now, items=items)
    payload = catalog.model_dump()
    payload["updated_at"] = now.isoformat()

    base_dir = Path("backend/data/human_catalog")
    base_dir.mkdir(parents=True, exist_ok=True)
    out_path = base_dir / "current.json"
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, sort_keys=True)


if __name__ == "__main__":
    main()
