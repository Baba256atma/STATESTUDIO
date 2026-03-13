#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8000}"
USER_ID="${USER_ID:-tester}"

curl_json() {
  # Usage: curl_json METHOD URL JSON_BODY(optional)
  local method="$1"; shift
  local url="$1"; shift
  local body="${1:-}"

  local tmp_body
  local tmp_err
  tmp_body=$(mktemp)
  tmp_err=$(mktemp)

  # Capture curl failures without killing the script under `set -e`
  set +e
  local status
  local code

  if [[ -n "$body" ]]; then
    status=$(curl -sS -L -X "$method" "$url" \
      -H "Content-Type: application/json" \
      -d "$body" \
      -o "$tmp_body" \
      -w "%{http_code}" 2>"$tmp_err")
    code=$?
  else
    status=$(curl -sS -L -X "$method" "$url" \
      -o "$tmp_body" \
      -w "%{http_code}" 2>"$tmp_err")
    code=$?
  fi

  set -e

  if [[ $code -ne 0 ]]; then
    # Curl failed (connection refused, DNS, TLS, proxy, etc.)
    cat "$tmp_err"
    printf "\n__HTTP__0\n"
  else
    cat "$tmp_body"
    printf "\n__HTTP__%s\n" "${status:-0}"
  fi

  rm -f "$tmp_body" "$tmp_err"
}

split_http() {
  # stdin => first line: status, remaining: body
  python3 - <<'PY'
import sys
raw = sys.stdin.read()
# Normalize line endings to avoid missing the marker
raw = raw.replace('\r\n', '\n').replace('\r', '\n')

marker = '__HTTP__'
status = '0'
body = raw
if marker in raw:
    body, status = raw.rsplit(marker, 1)
    status = (status or '').strip() or '0'
print(status)
sys.stdout.write(body)
PY
}

echo "== Nexora Smoke Test =="
echo "BASE_URL=$BASE_URL  USER_ID=$USER_ID"
echo

# Preflight
HEALTH_RAW=$(curl_json GET "$BASE_URL/health")
HEALTH_STATUS=$(echo "$HEALTH_RAW" | split_http | sed -n '1p')
HEALTH_BODY=$(echo "$HEALTH_RAW" | split_http | tail -n +2)
if [[ "$HEALTH_STATUS" != "200" ]]; then
  echo "ERROR: /health HTTP $HEALTH_STATUS" >&2
  if [[ "$HEALTH_STATUS" == "0" ]]; then
    echo "curl error:" >&2
    if [[ -n "$HEALTH_BODY" ]]; then
      echo "$HEALTH_BODY" >&2
    fi
    echo "diag: direct curl -v (first 20 lines) ->" >&2
    curl -v "$BASE_URL/health" 2>&1 | head -n 20 >&2 || true
  else
    if [[ -n "$HEALTH_BODY" ]]; then
      echo "$HEALTH_BODY" >&2
    fi
  fi
  echo "Hint: run -> curl -i $BASE_URL/health" >&2
  exit 1
fi
echo "[ok] health"

# 1) chat
CHAT_RAW=$(curl_json POST "$BASE_URL/chat" "{\"text\":\"inventory drop\",\"user_id\":\"$USER_ID\"}")
CHAT_STATUS=$(echo "$CHAT_RAW" | split_http | sed -n '1p')
CHAT_JSON=$(echo "$CHAT_RAW" | split_http | tail -n +2)
if [[ "$CHAT_STATUS" != "200" ]]; then
  echo "ERROR: /chat HTTP $CHAT_STATUS" >&2
  echo "$CHAT_JSON" >&2
  exit 1
fi
if [[ -z "$CHAT_JSON" ]]; then
  echo "ERROR: /chat returned empty body" >&2
  exit 1
fi
if [[ "${CHAT_JSON:0:1}" != "{" ]]; then
  echo "ERROR: /chat did not return JSON" >&2
  echo "$CHAT_JSON" >&2
  exit 1
fi

echo "$CHAT_JSON" | python3 - <<'PY'
import json,sys
j=json.load(sys.stdin)
scene=(j.get("scene_json") or {}).get("scene") or {}
frag=scene.get("fragility") or {}
print("[ok] chat:", "kpi=", scene.get("kpi"), "frag=", {"score":frag.get("score"),"level":frag.get("level")})
PY

# 2) episodes → pick EP_ID for this user
EP_RAW=$(curl_json GET "$BASE_URL/replay/episodes")
EP_STATUS=$(echo "$EP_RAW" | split_http | sed -n '1p')
EP_LIST=$(echo "$EP_RAW" | split_http | tail -n +2)
if [[ "$EP_STATUS" != "200" ]]; then
  echo "ERROR: /replay/episodes HTTP $EP_STATUS" >&2
  echo "$EP_LIST" >&2
  exit 1
fi

EP_ID=$(echo "$EP_LIST" | python3 - <<PY
import json,sys
user="${USER_ID}"
lst=json.load(sys.stdin)
matches=[e for e in lst if isinstance(e,dict) and f"chat:{user}" in str(e.get("title",""))]
cand=matches or lst
print((cand[0].get("episode_id") if cand else "") or "")
PY
)

test -n "$EP_ID"
echo "[ok] episode: $EP_ID"

# 3) branch
BR_RAW=$(curl_json POST "$BASE_URL/replay/episodes/$EP_ID/branch" '{"title":"Scenario B","include_history":false}')
BR_STATUS=$(echo "$BR_RAW" | split_http | sed -n '1p')
BR_JSON=$(echo "$BR_RAW" | split_http | tail -n +2)
if [[ "$BR_STATUS" != "200" ]]; then
  echo "ERROR: branch HTTP $BR_STATUS" >&2
  echo "$BR_JSON" >&2
  exit 1
fi

BR_ID=$(echo "$BR_JSON" | python3 - <<'PY'
import json,sys
j=json.load(sys.stdin)
print((j.get("episode") or {}).get("episode_id",""))
PY
)

test -n "$BR_ID"
echo "[ok] branch: $BR_ID"

# 4) override on branch
OV_RAW=$(curl_json POST "$BASE_URL/scenario/override" "{\"episode_id\":\"$BR_ID\",\"branch\":false,\"delta\":{\"inventory\":-0.2},\"absolute\":{}}")
OV_STATUS=$(echo "$OV_RAW" | split_http | sed -n '1p')
OV_JSON=$(echo "$OV_RAW" | split_http | tail -n +2)
if [[ "$OV_STATUS" != "200" ]]; then
  echo "ERROR: override HTTP $OV_STATUS" >&2
  echo "$OV_JSON" >&2
  exit 1
fi

echo "$OV_JSON" | python3 - <<'PY'
import json,sys
j=json.load(sys.stdin)
frag=j.get("fragility") or {}
print("[ok] override:", "kpi=", j.get("kpi"), "frag=", {"score":frag.get("score"),"level":frag.get("level")})
PY

# 5) compare
CMP_RAW=$(curl_json GET "$BASE_URL/replay/compare?a=$EP_ID&b=$BR_ID")
CMP_STATUS=$(echo "$CMP_RAW" | split_http | sed -n '1p')
CMP_JSON=$(echo "$CMP_RAW" | split_http | tail -n +2)
if [[ "$CMP_STATUS" != "200" ]]; then
  echo "ERROR: compare HTTP $CMP_STATUS" >&2
  echo "$CMP_JSON" >&2
  exit 1
fi

echo "$CMP_JSON" | python3 - <<'PY'
import json,sys
j=json.load(sys.stdin)
a=j.get("a") or {}
b=j.get("b") or {}
fa=(a.get("fragility") or {})
fb=(b.get("fragility") or {})
print("[ok] compare:", "A=", (fa.get("score"), fa.get("level")), "B=", (fb.get("score"), fb.get("level")))
PY

echo
echo "DONE ✅"