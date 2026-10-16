# NPA-T HOSTED-MVP:4 — CERTIFIED

Hosted customer data can be created, retained, expired, removed, and proven absent. HOSTED-MVP:5 was not started.

## Authority

One server transaction deletes a Hosted workspace the authenticated owner is allowed to delete. The browser workspace id is not permission. Account-data deletion removes every Hosted workspace owned by the authenticated principal. It does not delete the GitHub account or any other identity-provider record.

Deletion order inside the transaction:

1. `hosted_execution`
2. `hosted_decision`
3. `hosted_saved_scene`
4. `hosted_observation`
5. `hosted_pending_csv`
6. `hosted_data_source`
7. `hosted_workspace`

Existing workspace foreign keys were not given new cascade rules. The execution-to-decision foreign key has no cascade, so executions are deleted before decisions.

## Data classes

| Class | What | Where | Removal |
| --- | --- | --- | --- |
| Temporary | Pending raw CSV, 24-hour TTL | `hosted_pending_csv` | Accept, discard, expiry, workspace deletion, account deletion |
| Active customer data | Workspace, accepted source metadata and mapping, observations, Decision, Execution, Saved Scene | The tables above | Source removal, workspace deletion, or account deletion |
| Derived data | KPI, Data Reality, and Advisor projections rebuilt from accepted observations | In-memory projection released with the workspace; accepted observations are the durable input | Rebuilt from surviving server rows |
| Security / operational metadata | LLM usage ledger counters, provider, model, latency, token counts, cost | `backend/data/nexora_llm/usage.json` when present | Not customer content. No production retention TTL yet. Not deleted in this phase |
| Certification / dev data | Rows created for Hosted proofs | Same customer tables, owned by `dev:user_a` or `dev:user_b` | Removed only when that owner deletes the workspace or account data |

Nexora does not yet control production backups or infrastructure logs. Those are not claimed as deleted. Backup retention remains HOSTED-MVP:6.

## Proof

- `hostedLifecycle.test.ts` passed: pending expiry, source removal, owner authorization, cross-user refusal, store failure, mid-transaction rollback, workspace deletion, idempotent repeat, Decision/Execution/Scene/default removal, Project and User B preservation, stale operational projection, LLM context exclusion, account deletion, account-deletion retry, and demo workspace refusal.
- Hosted authentication, authorization, transition, hydration snapshot, manager data, and operational persistence regressions passed: 23 tests, 0 failures.
- Demo, Saved Scene, and LLM context regressions passed: 79 tests, 0 failures.
- Local Decision and Execution suites passed: 64 tests, 0 failures.
- Workspace entry, save, demo library, and CSV ownership regressions passed: 24 tests, 0 failures.
- Browser: Lifecycle Company was deleted by the named confirmation. Lifecycle Project remained after the delete, after reload, and in a fresh browser. User B received HTTP 404 `workspace_not_found` for User A's project. Account deletion then left User A with no Company or Project. User B still had Company B and Lifecycle Company B, including `dec-lifecycle-b`.
- Stale Decision session, Execution session, Saved Scene local storage, and IndexedDB `nexora-csv-real-data` remained after deleting Stale Company. The workspace stayed absent on the server and in the menu.
- Manufacturing Demo, Project Demo, and Reset Demo ran with no customer workspace row.
- Direct inspection after an intentional stop of process 65598: User A workspace rows = 0. Deleted Lifecycle Company ids and the prior Company A and Project A ids had 0 rows in all seven customer tables. User B Company B kept 1 source and 6 observations. Lifecycle Company B kept 1 source, 3 observations, 1 decision, 1 execution, and 1 scene. Pending rows = 0. `hosted_data_source` has no raw CSV text column.
- Process 86263 replaced 65598 for that inspection and remained healthy. `GET /executive` returned HTTP 200. A fresh sign-in still showed User A empty, the deleted id HTTP 404, account-deletion retry `deletedWorkspaces: 0` with `identityProviderDeleted: false`, and User B's decision still present.
- Hydration mismatch 0, React hydration errors 0, uncaught product errors 0. First client `data-core-int4-ranked` was `false`.
- TSC_EXIT:0. BUILD_EXIT:0. `frontend/tsconfig.json` does not include a `.next-hosted-*` path.

## Account-deletion boundary

The same GitHub or development principal can sign in again. Previous Nexora customer rows do not return. The identity provider account remains.

Account deletion of `dev:user_a` removed the earlier Company A and Project A certification rows. That removal is the required account-deletion proof, not a persistence regression. User B's Company B certification source remains.

## Server process

The current Hosted server is process 86263 on port 3010. The local server on port 3000, process 84225, was left running.

Process 65598 was stopped on purpose to inspect the database, then 86263 started against the same directory. That stop is an intentional inspection restart.
