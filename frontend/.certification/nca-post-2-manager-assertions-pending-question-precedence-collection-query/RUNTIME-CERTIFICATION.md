# Runtime certification

Primary runtime proof is deterministic `executeNexoraConversationalExperience` plus NCA-POST:2 unit tests.

Live browser proof is recorded in `live-browser.json` when the executive shell is reachable. Unit/orchestration gates do not require a running server, but NCA-POST:2 attempts Playwright against `http://localhost:3000/executive` when the harness is available.
