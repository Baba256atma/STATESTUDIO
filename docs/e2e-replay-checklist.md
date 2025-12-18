# E2E Replay Checklist

## Steps
1) Start backend and frontend.
2) Send 3 chat messages in the UI.
3) Confirm backend responses include `episode_id` on each analyze call.
4) Confirm a replay file exists for that `episode_id` in `backend/data/replay/current/`.
5) Open replay in the UI (Episode dropdown or “Open Replay”).
6) Scrub the timeline and verify the scene updates per frame.
7) Press Play and verify smooth playback without jumps.
8) Switch back to Live and send another message.
9) Return to Replay and verify a new frame appended (duration increases).

## Common Failure Cases and Debugging
- Missing `episode_id`:
  - Check `/analyze/full` response in network tab.
  - Verify `frontend/app/lib/api/analyzeApi.ts` is used and no errors are thrown.
- Frames unsorted:
  - Inspect replay file to confirm `frames` sorted by `t`.
  - `useReplayEpisode` sorts frames on load; confirm hook usage in AppShell.
- Duration mismatch:
  - Check replay file `duration` vs max `t` in frames.
  - `ReplayEpisode` model clamps and updates duration; ensure append logic writes updated value.
- CORS / base URL issues:
  - Confirm `NEXT_PUBLIC_API_BASE` matches backend origin.
  - Check browser console for CORS errors and adjust backend CORS settings if needed.
