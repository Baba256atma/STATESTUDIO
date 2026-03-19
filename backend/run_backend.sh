#!/usr/bin/env bash
# ./run_backend.sh dev
# ============================================================================
# Nexora Ultimate Backend Runner
# Project: Nexora Decision Simulation Platform
#
# Professional local backend launcher for the Nexora FastAPI service.
# This script safely prepares the local Python environment and starts the
# backend server in development or production mode.
#
# Usage:
#   ./run_backend.sh dev
#   ./run_backend.sh prod
#   PORT=8001 ./run_backend.sh dev
#   FORCE_INSTALL=1 ./run_backend.sh dev
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PROJECT_NAME="Nexora Decision Simulation Platform"
MODE="${1:-dev}"

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8000}"
APP_MODULE="${APP_MODULE:-main:app}"
VENV_DIR="${VENV_DIR:-.venv}"
REQUIREMENTS_FILE="${REQUIREMENTS_FILE:-requirements.txt}"
ENV_FILE="${ENV_FILE:-.env}"
FORCE_INSTALL="${FORCE_INSTALL:-0}"

VENV_ACTIVATE_PATH="$VENV_DIR/bin/activate"
CACHE_DIR=".cache"
REQ_HASH_CACHE="$CACHE_DIR/requirements.sha256"

COLOR_RESET=""
COLOR_INFO=""
COLOR_WARN=""
COLOR_ERROR=""
COLOR_SUCCESS=""

if [[ -t 1 ]]; then
  COLOR_RESET=$'\033[0m'
  COLOR_INFO=$'\033[1;34m'
  COLOR_WARN=$'\033[1;33m'
  COLOR_ERROR=$'\033[1;31m'
  COLOR_SUCCESS=$'\033[1;32m'
fi

log_info() {
  printf "%s[INFO]%s %s\n" "$COLOR_INFO" "$COLOR_RESET" "$*"
}

log_warn() {
  printf "%s[WARN]%s %s\n" "$COLOR_WARN" "$COLOR_RESET" "$*"
}

log_error() {
  printf "%s[ERROR]%s %s\n" "$COLOR_ERROR" "$COLOR_RESET" "$*" >&2
}

log_success() {
  printf "%s[SUCCESS]%s %s\n" "$COLOR_SUCCESS" "$COLOR_RESET" "$*"
}

die() {
  log_error "$*"
  exit 1
}

print_usage() {
  cat <<'EOF'
Usage:
  ./run_backend.sh dev
  ./run_backend.sh prod
  PORT=8001 ./run_backend.sh dev
  FORCE_INSTALL=1 ./run_backend.sh dev
EOF
}

validate_mode() {
  case "$MODE" in
    dev|prod) ;;
    *)
      print_usage
      die "Invalid mode: $MODE"
      ;;
  esac
}

require_command() {
  local cmd="$1"
  command -v "$cmd" >/dev/null 2>&1 || die "Required command not found: $cmd"
}

load_env_file() {
  if [[ -f "$ENV_FILE" ]]; then
    log_info "Loading environment from $ENV_FILE"
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
  else
    log_warn "Environment file not found: $ENV_FILE (continuing)"
  fi
}

ensure_main_file() {
  [[ -f "main.py" ]] || die "main.py not found in backend directory: $SCRIPT_DIR"
}

ensure_virtualenv() {
  if [[ ! -d "$VENV_DIR" ]]; then
    log_info "Creating virtual environment in $VENV_DIR"
    python3 -m venv "$VENV_DIR"
  fi

  [[ -f "$VENV_ACTIVATE_PATH" ]] || die "Virtual environment activation script not found: $VENV_ACTIVATE_PATH"
}

activate_virtualenv() {
  # shellcheck disable=SC1090
  source "$VENV_ACTIVATE_PATH"
  log_success "Virtual environment activated"
}

compute_file_sha256() {
  local target_file="$1"

  python3 - "$target_file" <<'PY'
import hashlib
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
print(hashlib.sha256(path.read_bytes()).hexdigest())
PY
}

install_requirements_if_needed() {
  mkdir -p "$CACHE_DIR"

  if [[ ! -f "$REQUIREMENTS_FILE" ]]; then
    log_warn "Requirements file not found: $REQUIREMENTS_FILE (continuing)"
    return
  fi

  local current_hash=""
  local cached_hash=""

  current_hash="$(compute_file_sha256 "$REQUIREMENTS_FILE")"

  if [[ -f "$REQ_HASH_CACHE" ]]; then
    cached_hash="$(<"$REQ_HASH_CACHE")"
  fi

  if [[ "$FORCE_INSTALL" == "1" ]]; then
    log_info "FORCE_INSTALL=1 set; installing dependencies"
    python -m pip install -r "$REQUIREMENTS_FILE"
    printf "%s\n" "$current_hash" > "$REQ_HASH_CACHE"
    log_success "Dependencies installed and cache updated"
    return
  fi

  if [[ "$current_hash" == "$cached_hash" ]]; then
    log_info "Requirements unchanged; skipping dependency install"
    return
  fi

  log_info "Requirements changed; installing dependencies"
  python -m pip install -r "$REQUIREMENTS_FILE"
  printf "%s\n" "$current_hash" > "$REQ_HASH_CACHE"
  log_success "Dependencies installed and cache updated"
}

ensure_uvicorn() {
  if python -c "import uvicorn" >/dev/null 2>&1; then
    log_info "Bootstrap module available: uvicorn"
    return
  fi

  log_warn "Bootstrap module missing: uvicorn. Installing now."
  python -m pip install uvicorn
  log_success "uvicorn installed"
}

check_port_available() {
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    log_error "Port $PORT is already in use on host $HOST"
    lsof -nP -iTCP:"$PORT" -sTCP:LISTEN || true
    exit 1
  fi
}

print_summary() {
  printf "\n"
  log_info "Startup Summary"
  printf "  Project: %s\n" "$PROJECT_NAME"
  printf "  Mode: %s\n" "$MODE"
  printf "  Host: %s\n" "$HOST"
  printf "  Port: %s\n" "$PORT"
  printf "  App Module: %s\n" "$APP_MODULE"
  printf "  Directory: %s\n" "$SCRIPT_DIR"
  printf "\n"
}

start_server() {
  local backend_url="http://$HOST:$PORT"
  local docs_url="$backend_url/docs"

  log_success "Backend URL: $backend_url"
  log_success "Docs URL: $docs_url"

  if [[ "$MODE" == "dev" ]]; then
    log_info "Starting FastAPI backend in development mode"
    exec python -m uvicorn "$APP_MODULE" --host "$HOST" --port "$PORT" --reload
  fi

  log_info "Starting FastAPI backend in production mode"
  exec python -m uvicorn "$APP_MODULE" --host "$HOST" --port "$PORT"
}

main() {
  validate_mode
  require_command python3
  require_command lsof
  load_env_file
  ensure_main_file
  ensure_virtualenv
  activate_virtualenv
  install_requirements_if_needed
  ensure_uvicorn
  check_port_available
  print_summary
  start_server
}

main "$@"
