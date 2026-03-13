# Backend Notes

- Debug endpoint (dev only): `GET /debug/system-state-schema` returns `SystemArchetypeState` fields and an example payload to verify contract expectations. Enable by setting `ENV=dev`.
- AI chat endpoint: `POST /chat/ai` returns `{reply, actions, debug?}` with rule-first pipeline and OpenAI fallback. Run tests with `cd backend && pytest -q`.
- Event log: `GET /events/recent?user_id=...` and `POST /events/replay?user_id=...` provide per-user chat action history (in-memory). `/chat` logs events when `user_id` is supplied; logging failures never break chat.
- Replay curl example (dev):
  - Recent: `curl "http://127.0.0.1:8000/events/recent?user_id=demo&limit=10"`
  - Replay: `curl -X POST "http://127.0.0.1:8000/events/replay?user_id=demo&limit=10"`
