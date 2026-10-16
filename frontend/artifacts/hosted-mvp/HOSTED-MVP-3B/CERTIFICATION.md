# NPA-T HOSTED-MVP:3B — CERTIFIED

NPA-T HOSTED-MVP:3 — CERTIFIED

Outcome and Learning persistence were not added. HOSTED-MVP:4 was not started.

## Authority

Hosted Decision, Execution, and Saved Scene records are rows in the existing Hosted database. The browser session and local stores are not the Hosted authority. Local mode still uses the existing session and `nexora.saved-scenes.v1` stores.

The stored JSON is the existing canonical Decision, Execution, and Saved Scene record. A second domain model was not added.

## Schema

`hosted_decision`, `hosted_execution`, and `hosted_saved_scene` are created by the same schema execution that opens `hosted_workspace`. An execution row references a decision in the same workspace. A scene rename updates the name and default flag on the existing `scene_id`.

## Proof

- `hostedOperationalPersistence.test.ts` passed: create, update, retry, execution linkage, cross-workspace rejection, scene rename, default, delete, store reopen, demo workspace refusal, and fail-closed store failure.
- Anonymous operations read returned HTTP 401.
- User B reading Company A operations returned HTTP 404 `workspace_not_found`.
- Company A `ws_UZ5YCnJqspkHgZ1KvSzrtA`: decision `dec-capacity-certification`, execution `execution-dec-capacity-certification`, scene `scene-capacity-room` renamed to Capacity Room Certified and kept as the default. The same ids returned after reload, a fresh browser with empty storage, and one intentional server reopen.
- Project A `ws_wPEPWgjYq3aYK7Y0JNOxAA` has separate rows. Company rows were absent while Project A was active, then returned unchanged.
- Stale session and local records named `dec-stale-browser` and `scene-stale-browser` did not replace the server records.
- Manufacturing Demo and Reset Demo left the Company A rows unchanged. `demo_workspace` has no decision rows.
- Direct inspection: execution `decision_id` matches the Company A decision, the Company scene `is_default` is true, and Project rows are separate. Project source `project-cert-3a.csv` and Company B source `company-b-cert.csv` remain.
- Hydration mismatch, React hydration, and uncaught counts on the certification journey were 0. First client `data-core-int4-ranked` was `false`.
- On process 65598, a fresh User A session opened Company A and recovered the same decision, execution, scene, and default. Hydration mismatch 0, React hydration errors 0, uncaught errors 0, first client `data-core-int4-ranked` `false`.
- Local Decision and Execution suites passed: 75 tests, 0 failures (`executiveDecisionCommitment`, `executiveDecisionRuntimeFullDebtClosure`, `executiveExecutionFollowUp`, `executiveExecutionLifecycleRecording`, `nexoraLlmManagementContext`).
- TSC_EXIT:0. BUILD_EXIT:0.

## Server process

The current Hosted server is process 65598. `GET /executive` returns HTTP 200.

Process 36531 was the pre-3B server. It was stopped on purpose so this phase could open the same database with the extended schema. A later stop inspected the rows, then process 65598 replaced it. Those stops are intentional persistence and database-inspection restarts. They are not crashes, watcher failures, or certification failures. No further restart was required. Process 65598 remained the listener through the remaining runtime check. The local server on port 3000 was left running.

## Creation path

The existing conversation refuses to invent a Decision writer. The certification Decision and Execution were written through the authenticated operations API in the canonical record shape, then hydrated by the shell. Saved Scene rename and default were performed in the scene UI. The empty stage declined `save this scene as Capacity Room`; the scene row was then created through the same operations API and renamed without changing `scene-capacity-room`.
