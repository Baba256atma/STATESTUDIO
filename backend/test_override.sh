#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8000}"
USER_ID="${USER_ID:-tester}"

curl_json() {
  # Usage: curl_json METHOD URL [JSON_BODY]
  local method="$1"; shift
  local url="$1"; shift
  local body="${1:-}"

  # We want to capture failures without killing the script at 'set -e'
  set +e
  local out
  local code
  if [[ -n "$body" ]]; then
    out=$(curl -sS -L -X "$method" "$url" \
      -H "Content-Type: application/json" \
      -d "$body" \
      -w "\n__STATUS__%{http_code}\n")
    code=$?
  else
    out=$(curl -sS -L -X "$method" "$url" \
      -w "\n__STATUS__%{http_code}\n")
    code=$?
  fi
  set -e

  if [[ $code -ne 0 ]]; then
    # Connection error / DNS error / refused
    echo ""
    echo "__STATUS__0"
    return 0
  fi

  echo "$out"
}

split_status() {
  # Reads stdin and outputs:
  #  line1: STATUS
  #  lines2+: BODY (verbatim)
  python3 - <<'PY'
import sys
raw=sys.stdin.read()
marker='\n__STATUS__'
status='0'
body=raw
if marker in raw:
    body, status = raw.rsplit(marker, 1)
    status = (status or '').strip() or '0'
print(status)
# print body as-is (may be empty)
sys.stdout.write(body)
PY
}

start_ts=$(python3 - <<'PY'
import time
print(time.time())
PY
)

echo "== Nexora 3-sec smoke test =="
echo "BASE_URL: $BASE_URL"
echo "USER_ID: $USER_ID"
echo

# Preflight: server reachable
echo "[preflight] GET /health"
HEALTH_RAW=$(curl_json GET "$BASE_URL/health")
HEALTH_STATUS=$(echo "$HEALTH_RAW" | split_status | sed -n '1p')
HEALTH_BODY=$(echo "$HEALTH_RAW" | split_status | tail -n +2)
if [[ "$HEALTH_STATUS" != "200" ]]; then
  echo "ERROR: Server not reachable at $BASE_URL (HTTP $HEALTH_STATUS)." >&2
  echo "- Make sure uvicorn is running, e.g.: uvicorn main:app --reload --port 8000" >&2
  echo "- Or set BASE_URL to the correct port, e.g.: BASE_URL=http://127.0.0.1:8001 ./test_override.sh" >&2
  echo "BODY:" >&2
  echo "$HEALTH_BODY" >&2
  exit 1
fi

echo "$HEALTH_BODY" | python3 - <<'PY'
import json,sys
try:
    j=json.load(sys.stdin)
    print("health ok:", j)
except Exception:
    print("health body:", sys.stdin.read()[:200])
PY

echo

# 1) Chat (creates an episode + frame)
echo "[1/5] POST /chat"
CHAT_RAW=$(curl_json POST "$BASE_URL/chat" "{\"text\":\"inventory drop\",\"user_id\":\"$USER_ID\"}")
CHAT_STATUS=$(echo "$CHAT_RAW" | split_status | sed -n '1p')
CHAT_RES=$(echo "$CHAT_RAW" | split_status | tail -n +2)

if [[ "$CHAT_STATUS" != "200" ]]; then
  echo "ERROR: /chat failed (HTTP $CHAT_STATUS). If status=0, server is not reachable or connection was refused." >&2
  echo "BODY:" >&2
  echo "$CHAT_RES" >&2
  exit 1
fi

if [[ -z "$CHAT_RES" ]]; then
  echo "ERROR: /chat returned empty body (possible redirect or server error)." >&2
  exit 1
fi

echo "$CHAT_RES" | python3 - <<'PY'
import json,sys
j=json.load(sys.stdin)
scene=(j.get('scene_json') or {}).get('scene') or {}
frag=scene.get('fragility') or {}
print("ok:", j.get('ok'))
print("reply:", (j.get('reply') or '')[:80])
print("kpi:", scene.get('kpi'))
print("fragility:", {"score": frag.get('score'), "level": frag.get('level')})
PY

echo

# 2) List episodes
echo "[2/5] GET /replay/episodes"
EP_RAW=$(curl_json GET "$BASE_URL/replay/episodes")
EP_STATUS=$(echo "$EP_RAW" | split_status | sed -n '1p')
EP_LIST=$(echo "$EP_RAW" | split_status | tail -n +2)
if [[ "$EP_STATUS" != "200" ]]; then
  echo "ERROR: /replay/episodes returned HTTP $EP_STATUS" >&2
  echo "$EP_LIST" >&2
  exit 1
fi

echo "$EP_LIST" | python3 - <<'PY'
import json,sys
lst=json.load(sys.stdin)
print("episodes:", len(lst))
for e in lst[:5]:
    print("-", e.get('episode_id'), e.get('title'), "frames=", e.get('frame_count'))
PY

# Pick the most recently updated episode for this user (title contains chat:<USER_ID>)
EP_ID=$(echo "$EP_LIST" | python3 - <<PY
import json,sys
user="${USER_ID}"
lst=json.load(sys.stdin)
# Prefer matching title
matches=[e for e in lst if isinstance(e,dict) and str(e.get('title','')).find(f"chat:{user}")!=-1]
# If store returns updated_at, sort by it; otherwise take first
cand=matches or [e for e in lst if isinstance(e,dict)]
if not cand:
    print("")
    raise SystemExit
# Sort by updated_at when present
cand.sort(key=lambda e: str(e.get('updated_at','')), reverse=True)
print(cand[0].get('episode_id',''))
PY
)

if [[ -z "$EP_ID" ]]; then
  echo "ERROR: Could not find an episode_id for user '$USER_ID'." >&2
  exit 1
fi

echo "Selected EP_ID: $EP_ID"
echo

# 3) Branch episode
echo "[3/5] POST /replay/episodes/$EP_ID/branch"
BR_RAW=$(curl_json POST "$BASE_URL/replay/episodes/$EP_ID/branch" '{"title":"Scenario B","include_history":false}')
BR_STATUS=$(echo "$BR_RAW" | split_status | sed -n '1p')
BR_RES=$(echo "$BR_RAW" | split_status | tail -n +2)
if [[ "$BR_STATUS" != "200" ]]; then
  echo "ERROR: branch returned HTTP $BR_STATUS" >&2
  echo "$BR_RES" >&2
  exit 1
fi

echo "$BR_RES" | python3 - <<'PY'
import json,sys
j=json.load(sys.stdin)
print("ok:", j.get('ok'))
print("parent_episode_id:", j.get('parent_episode_id'))
ep=j.get('episode') or {}
print("child_episode_id:", ep.get('episode_id'))
PY

BR_ID=$(echo "$BR_RES" | python3 - <<'PY'
import json,sys
j=json.load(sys.stdin)
ep=j.get('episode') or {}
print(ep.get('episode_id',''))
PY
)

if [[ -z "$BR_ID" ]]; then
  echo "ERROR: Branch did not return a child episode_id. Is branching endpoint enabled?" >&2
  exit 1
fi

echo "Created BR_ID: $BR_ID"
echo

# 4) Override on branch
echo "[4/5] POST /scenario/override (on branch)"
OV_RAW=$(curl_json POST "$BASE_URL/scenario/override" "{\"episode_id\":\"$BR_ID\",\"branch\":false,\"delta\":{\"inventory\":-0.2},\"absolute\":{}}")
OV_STATUS=$(echo "$OV_RAW" | split_status | sed -n '1p')
OV_RES=$(echo "$OV_RAW" | split_status | tail -n +2)
if [[ "$OV_STATUS" != "200" ]]; then
  echo "ERROR: override returned HTTP $OV_STATUS" >&2
  echo "$OV_RES" >&2
  exit 1
fi

echo "$OV_RES" | python3 - <<'PY'
import json,sys
j=json.load(sys.stdin)
print("ok:", j.get('ok'))
print("episode_id:", j.get('episode_id'))
print("kpi:", j.get('kpi'))
frag=j.get('fragility') or {}
print("fragility:", {"score": frag.get('score'), "level": frag.get('level')})
PY

echo

# 5) Compare A vs B
echo "[5/5] GET /replay/compare?a=$EP_ID&b=$BR_ID"
CMP_RAW=$(curl_json GET "$BASE_URL/replay/compare?a=$EP_ID&b=$BR_ID")
CMP_STATUS=$(echo "$CMP_RAW" | split_status | sed -n '1p')
CMP_RES=$(echo "$CMP_RAW" | split_status | tail -n +2)
if [[ "$CMP_STATUS" != "200" ]]; then
  echo "ERROR: compare returned HTTP $CMP_STATUS" >&2
  echo "$CMP_RES" >&2
  exit 1
fi

echo "$CMP_RES" | python3 - <<'PY'
import json,sys
j=json.load(sys.stdin)
print("ok:", j.get('ok'))
a=j.get('a') or {}
b=j.get('b') or {}
print("A fragility:", (a.get('fragility') or {}).get('score'), (a.get('fragility') or {}).get('level'))
print("B fragility:", (b.get('fragility') or {}).get('score'), (b.get('fragility') or {}).get('level'))
print("A kpi:", a.get('kpi'))
print("B kpi:", b.get('kpi'))
PY

echo
end_ts=$(python3 - <<'PY'
import time
print(time.time())
PY
)

python3 - <<PY
start=float("$start_ts")
end=float("$end_ts")
print(f"Done in {end-start:.2f}s")
PY