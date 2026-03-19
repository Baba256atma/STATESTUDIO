#!/usr/bin/env bash
# ==========================================================
# Nexora Full Stack Launcher
# ----------------------------------------------------------
# Purpose:
#   Launch the Nexora backend and frontend for local development
#   in separate macOS Terminal tabs/windows.
#
# Usage:
#   ./run_nexora.sh
#
# Launches:
#   - Backend:  ./run_backend.sh dev
#   - Frontend: npm run dev
#
# Project:
#   Nexora Decision Simulation Platform
# ==========================================================

set -euo pipefail

PROJECT_NAME="Nexora Decision Simulation Platform"
BACKEND_DIR="/Users/bahadoors/Documents/StateStudio/backend"
FRONTEND_DIR="/Users/bahadoors/Documents/StateStudio/frontend"
BACKEND_RUNNER="$BACKEND_DIR/run_backend.sh"

BACKEND_URL="http://127.0.0.1:8000"
BACKEND_DOCS_URL="http://127.0.0.1:8000/docs"
FRONTEND_URL="http://127.0.0.1:3000"

BACKEND_COMMAND="cd $BACKEND_DIR && bash ./run_backend.sh dev"
FRONTEND_COMMAND="cd $FRONTEND_DIR && npm run dev"

require_path() {
  local path="$1"
  local label="$2"
  if [[ ! -e "$path" ]]; then
    echo "Error: $label not found at: $path"
    exit 1
  fi
}

require_directory() {
  local path="$1"
  local label="$2"
  if [[ ! -d "$path" ]]; then
    echo "Error: $label directory not found at: $path"
    exit 1
  fi
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: Required command not found: $cmd"
    exit 1
  fi
}

require_directory "$BACKEND_DIR" "Backend"
require_directory "$FRONTEND_DIR" "Frontend"
require_path "$BACKEND_RUNNER" "Backend runner script"
require_command "npm"
require_command "osascript"

echo "=================================================="
echo "Project: $PROJECT_NAME"
echo "Backend Path: $BACKEND_DIR"
echo "Frontend Path: $FRONTEND_DIR"
echo "Backend URL: $BACKEND_URL"
echo "Backend Docs URL: $BACKEND_DOCS_URL"
echo "Expected Frontend URL: $FRONTEND_URL"
echo "=================================================="
echo "Launching backend in macOS Terminal..."

osascript -e "tell application \"Terminal\" to activate" \
          -e "tell application \"Terminal\" to do script \"$BACKEND_COMMAND\""

sleep 2

echo "Launching frontend in macOS Terminal..."

osascript -e "tell application \"Terminal\" to activate" \
          -e "tell application \"Terminal\" to do script \"$FRONTEND_COMMAND\""

echo "Nexora launch commands were sent to Terminal successfully."
