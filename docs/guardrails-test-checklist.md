# Guardrails Test Checklist

## Frontend
- API base URL wrong → error banner appears, app remains usable and live mode still works.
- Replay episode returns empty frames → empty state message shows, no crash, controls disabled.
- VisualState invalid → last good visual is rendered, warning badge appears, no white screen.
- Network timeout → friendly message shown, retry (if offered) works without app breakage.

## Backend
- Extremely long text (>4k chars) → 422 INVALID_INPUT.
- NaN or non-finite metrics/system signals → sanitized or rejected without 500s.
- Replay file missing → 404 NOT_FOUND with structured error.
- Replay file corrupted → warning logged, file moved to corrupt archive, new episode can be created.

## Debugging Tips
- Browser console: check fetch errors, schema warnings, and VisualState validation logs.
- Backend logs: look for INVALID_INPUT, NOT_FOUND, or corruption notices.
- Filesystem: inspect `backend/data/replay` (current, archive, corrupt) for episode files and timestamps.
