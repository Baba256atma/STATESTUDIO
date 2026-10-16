# NPA-T HOSTED-MVP:2-FIX1 — CERTIFIED + SEALED

Sealed by NPA-T HOSTED-MVP:2-FIX1-RECERT-R4.

Accepted evidence combined here:

- HOSTED-MVP:1 — CERTIFIED
- HOSTED-MVP:2 — CERTIFIED
- HOSTED-MVP:2-FIX1-RECERT-TSC1 — CERTIFIED
- HOSTED-MVP:2-FIX1-SERVER1 — CERTIFIED
- HOSTED-MVP:2-FIX1-WORKSPACE1 — CERTIFIED
- RECERT-R3 anonymous hydration proof
- RECERT-R4 remaining gates

## Original hydration defect

`data-core-int4-ranked` on `NexoraAdvisorInsightRegion`.

- SSR: `true`
- First client render: `false`

The ranked attribute read live fixture permission during render. The server had no demo profile, so fixtures were permitted. The client module read `nexora.demo-profile.v1` before the first render, so fixtures were blocked. The shell already had a hydration snapshot that was false on both sides. The ranked attribute did not use it.

## Hydration repair

The shell snapshot `productFixturesPermitted` is passed into executive experience composition and the fixture projectors. When that boolean is present, the projectors do not read browser stores. `suppressHydrationWarning` is not the repair.

Final invariant, observed on the hosted executive page:

- SSR `data-core-int4-ranked` = `false`
- First client `data-core-int4-ranked` = `false`

Anonymous hydration mismatch = 0. React hydration errors = 0. Uncaught product errors = 0. Anonymous Manufacturing, Project, and Reset Demo passed before this seal. Reload in R4 again observed first-client `false`.

## Additional defect found during recertification

An active modern Demo Profile kept the live workspace on `demo_workspace` after an explicit Company A selection. The hosted menu only remembered a presentation id.

## Workspace repair

`selectAuthorizedHostedWorkspace` accepts a workspace only when that id is already in the server-authorized list. It adopts the record into the existing in-memory registry, makes it the live workspace, releases the demo profile, and remembers the selection. The adoption is not written to `nexora.workspace.registry.v1`. The server workspace store remains the durable authority. Reset Demo still restores the active demo and does not exit it.

## RECERT-R4 proof

Hosted server `127.0.0.1:3010`, `NEXORA_DEPLOYMENT_MODE=hosted`. Preflight `GET /executive` HTTP 200.

One sequential browser context, signed in as `dev:user_a`:

- Principal: authenticated `true`, userId `dev:user_a`
- Company A: live and hosted id `ws_UZ5YCnJqspkHgZ1KvSzrtA`, profile `none`, label `Company A`
- Project A: live and hosted id `ws_wPEPWgjYq3aYK7Y0JNOxAA`, profile `none`
- Company A again: same Company A id, profile `none`
- Workflow controls Problem, Scenario, Decision, Execution, and Overview were activated. After each one the live workspace, hosted id, and demo profile stayed on Company A.
- Company A → Manufacturing: live `demo_workspace`, profile `manufacturing`. Company A remained selectable.
- Manufacturing → Company A: same Company A id, profile `none`
- Company A → Project Demo: live `demo_workspace`, profile `project`
- Project Demo → Company A: same Company A id, profile `none`
- One reload: authenticated `dev:user_a`, live and hosted id still Company A, profile `none`, first-client ranked `false`

Console for that run:

- Hydration mismatch errors: 0
- React hydration errors: 0
- Uncaught product errors: 0
- Connection refused errors: 0
- `GET /api/monitoring/background` 404 remains the certified HOSTED-MVP:2 closure

## Authorization and demo authority

`hostedWorkspaceTransition.test.ts`: 8 passed.

- Anonymous cannot activate Company A
- A list that contains only Company B cannot activate Company A
- A stale `project` profile does not override a live hosted workspace
- Demo workspace kind stays unset
- Hosted adoption does not write the hosted id into `nexora.workspace.registry.v1`
- Manufacturing and Project remain demo profiles

## Server, typecheck, and build

After the browser run, `GET /executive` returned HTTP 200. Process `88608` was sleeping at 0.0% CPU. No open connections remained. EMFILE, ENFILE, and watcher failure were not observed.

- TSC_EXIT:0 from HOSTED-MVP:2-FIX1-RECERT-TSC1, reused. R4 did not change product source.
- BUILD_EXIT:0 from HOSTED-MVP:2-FIX1-RECERT-TSC1 and again after WORKSPACE1, reused.

## Out of scope

`hostedManagerData.test.ts` fails with `data_store_unavailable` because `hosted_pending_csv` is missing. That is unfinished HOSTED-MVP:3A. This seal does not create that table or persist customer manager data.

## R4 production changes

0.
