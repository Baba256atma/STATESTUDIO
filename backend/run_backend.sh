#!/usr/bin/env bash
# ./run_backend.sh dev
# ==========================================================
# Nexora Backend Runner
# ----------------------------------------------------------
# This script starts the Nexora FastAPI backend server.
#
# Usage:
#   ./run_backend.sh dev
#   ./run_backend.sh prod
#
# Modes:
#   dev   - development mode with auto reload
#   prod  - production-like mode without reload
#
# Environment Variables:
#   HOST  - server host (default: 127.0.0.1)
#   PORT  - server port (default: 8000)
#
# Examples:
#   ./run_backend.sh dev
#   PORT=8001 ./run_backend.sh dev
#   HOST=0.0.0.0 ./run_backend.sh prod
#
# Project:
#   Nexora Decision Simulation Platform
# ==========================================================

set -euo pipefail

PROJECT_NAME="Nexora Backend"
APP_MODULE="main:app"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8000}"
VENV_DIR=".venv"
REQUIREMENTS_FILE="requirements.txt"
MODE="${1:-dev}"

echo "======================================"
echo "$PROJECT_NAME"
echo "Mode: $MODE"
echo "Host: $HOST"
echo "Port: $PORT"
echo "======================================"

if [ ! -f "main.py" ]; then
  echo "Error: main.py not found in current directory."
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 is not installed."
  exit 1
fi

if [ ! -d "$VENV_DIR" ]; then
  echo "Creating virtual environment..."
  python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

python -m pip install --upgrade pip

if [ -f "$REQUIREMENTS_FILE" ]; then
  pip install -r "$REQUIREMENTS_FILE"
fi

if ! python -c "import uvicorn" >/dev/null 2>&1; then
  echo "uvicorn not found. Installing..."
  pip install uvicorn
fi

if lsof -i :"$PORT" >/dev/null 2>&1; then
  echo "Error: Port $PORT is already in use."
  lsof -i :"$PORT"
  exit 1
fi

if [ "$MODE" = "prod" ]; then
  echo "Starting production-like server..."
  uvicorn "$APP_MODULE" --host "$HOST" --port "$PORT"
else
  echo "Starting development server with reload..."
  uvicorn "$APP_MODULE" --reload --host "$HOST" --port "$PORT"
fi
