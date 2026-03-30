from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    repo_root = Path(__file__).resolve().parents[2]
    backend_root = repo_root / "backend"
    sys.path.insert(0, str(backend_root))

    from main import app  # noqa: WPS433

    output_path = Path(sys.argv[1]) if len(sys.argv) > 1 else backend_root / "openapi.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(app.openapi(), indent=2, sort_keys=True), encoding="utf-8")
    print(output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
