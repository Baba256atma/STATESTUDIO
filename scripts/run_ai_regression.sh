#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Running AI routing regression pytest suite"
python3 -m pytest backend/tests/ai_regression -m regression -q

echo "==> Generating AI routing regression report"
python3 backend/tests/ai_regression/regression_runner.py --output backend/tools/e2e_ai_eval/regression_summary.json

echo "==> AI routing regression completed successfully"
