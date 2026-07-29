# Scene Runtime Clean Baseline — 2026-07-28

| Field | Value |
|---|---|
| **Date** | `2026-07-28` |
| **Decision authority** | `AD-SCENE-01` |
| **Canonical toolbar zone** | `TOP_CENTER` |
| **Canonical top baseline** | `12` (`EXECUTIVE_SCENE_HUD_GRID.topMargin`) |
| **Resolved failure IDs** | `SCENE-FAIL-01` through `SCENE-FAIL-08` |
| **Status** | `SceneRuntimeCiGateEstablished` (local) |
| **Deployment authorization** | **None** — this baseline is not deployment authorization |

---

## 1. Purpose

Record the clean Scene runtime test baseline and the CI gate that keeps it durable.

This document does **not** authorize production deployment, full product certification, or EX-2:3.

---

## 2. Architecture authority

| Item | Value |
|---|---|
| Decision | `AD-SCENE-01` — Accepted |
| Record | `docs/architecture/ad-scene-01-canonical-toolbar-zone.md` |
| Toolbar zone | `executiveSceneToolbar.zone = TOP_CENTER` |
| Top baseline | `executiveSceneToolbar.top = EXECUTIVE_SCENE_HUD_GRID.topMargin` (`12`) |
| Narrow supersession | E2:56 superseded only for `executiveSceneToolbar.zone` |

---

## 3. Resolved Scene failures

| ID | Classification | Disposition |
|---|---|---|
| `SCENE-FAIL-01` | StaleAssertionCurrentAuthorityClear | Test corrected to E2:58 vocabulary |
| `SCENE-FAIL-02` | ArchitectureConflictDecisionRequired | Resolved via AD-SCENE-01 + alignment |
| `SCENE-FAIL-03` | ArchitectureConflictDecisionRequired | Resolved via AD-SCENE-01 + alignment |
| `SCENE-FAIL-04` | ArchitectureConflictDecisionRequired | Resolved via AD-SCENE-01 + alignment |
| `SCENE-FAIL-05` | ArchitectureConflictDecisionRequired | Resolved via AD-SCENE-01 + alignment |
| `SCENE-FAIL-06` | TestHarnessOrEnvironmentDefect | Browser localStorage harness |
| `SCENE-FAIL-07` | StaleAssertionCurrentAuthorityClear | Assert `SCENE_PANEL_TOP` |
| `SCENE-FAIL-08` | TestHarnessOrEnvironmentDefect | Node suite via pinned `jiti@2.6.1` |

---

## 4. Suite counts (clean)

### Vitest Scene

| Metric | Value |
|---|---|
| Files | **31** |
| Tests passed | **180** |
| Failed | **0** |
| Skipped | **0** |
| Consecutive clean runs | **2** |

### Node Scene (`node:test` + `jiti/register`)

| Metric | Value |
|---|---|
| Files | **54** |
| Tests passed | **296** |
| Failed | **0** |
| Skipped | **0** |
| `ERR_MODULE_NOT_FOUND` | **0** |
| Consecutive clean runs | **2** |

---

## 5. Commands

From `frontend/`:

```bash
npm run test:scene:vitest
npm run test:scene:node
npm run test:scene
```

| Script | Behavior |
|---|---|
| `test:scene:vitest` | Deterministic Vitest-only Scene discovery; `vitest run` (no watch) |
| `test:scene:node` | Deterministic `node:test` Scene discovery via `--import jiti/register` |
| `test:scene` | Sequential Vitest then Node; fails if either child fails |

Loader: **`jiti@2.6.1`** (direct frontend `devDependency`, exact pin).

Discovery helpers (test/tooling only):

- `frontend/scripts/list-scene-tests.mjs`
- `frontend/scripts/run-scene-vitest.mjs`
- `frontend/scripts/run-scene-node.mjs`

Rules:

- Vitest files → Vitest only
- `node:test` files → Node harness only
- Dual-import / wrong-runner files excluded
- Archived `.test.ts.md` not discovered (only `*.test.ts`)
- Zero discovery or missing `app/lib/scene` → nonzero exit
- No skipped active Scene files
- No allowed-failure budget

---

## 6. TypeScript and build

| Check | Result |
|---|---|
| `npm run typecheck` | Exit **0**, diagnostics **0** |
| `npm run build` | Exit **0** (compile + TypeScript + static generation) |
| EX / RTC diagnostics | **0** |

---

## 7. CI gate

| Field | Value |
|---|---|
| Workflow | `.github/workflows/ci.yml` |
| Job | `frontend` |
| Step name | `Full Scene runtime tests` |
| Command | `npm run test:scene` |
| Working directory | `frontend` |
| Order | After `Full-project TypeScript typecheck`; before `Run frontend build` |
| `continue-on-error` | **No** |
| Failure behavior | Any Scene test failure fails the frontend job |
| Hosted CI status | **Not run** in the recording session unless separately evidenced |

Eternal/Omega archived specifications remain outside active Scene test discovery.

---

## 8. Explicit non-claims

- Not deployment authorization
- Not full product / platform certification
- Not EX-2:3 authorization or implementation
- Hosted CI success is not claimed without execution evidence
