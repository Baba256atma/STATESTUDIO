#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/backend"

echo "==> Running AI routing regression pytest suite"
python3 -m pytest tests/ai_regression -m regression -q

echo "==> Generating AI routing regression report"
python3 -m tests.ai_regression.regression_runner --output tools/e2e_ai_eval/regression_summary.json

echo "==> AI routing regression completed successfully"
