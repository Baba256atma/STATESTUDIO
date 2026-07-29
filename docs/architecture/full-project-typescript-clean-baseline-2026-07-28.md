# Full-Project TypeScript Clean Baseline — 2026-07-28

| Field | Value |
|---|---|
| **Date** | `2026-07-28` |
| **Authority / context** | Nexora TypeScript remediation Waves 1–4 |
| **Canonical command** | `npm run typecheck` |
| **Recommended local memory** | `NODE_OPTIONS=--max-old-space-size=8192` |
| **Final exit code** | `0` |
| **Production diagnostics** | `0` |
| **Test diagnostics** | `0` |
| **EX diagnostics** | `0` |
| **RTC diagnostics** | `0` |
| **Production build** | exit `0` |

---

## Remediation trajectory

| Milestone | Diagnostics |
|---|---:|
| Original baseline | `947` |
| Wave 1 | `653` |
| Wave 2 | `488` |
| Wave 3 | `386` (production `0`) |
| Wave 4 | `34` orphan-only |
| Authorized Eternal/Omega archival | `0` |

Eternal/Omega archival decision: `GOV-TS-ORPHAN-2026-07-28-01`  
Disposition: `ArchiveAsUnimplementedConceptSpecifications`  
Archived specifications are **historical, non-binding** and are **not** active product requirements.

---

## CI TypeScript gate

| Field | Value |
|---|---|
| Workflow | `.github/workflows/ci.yml` (Frontend job) |
| Step | `Full-project TypeScript typecheck` |
| Working directory | `frontend/` |
| Command | `npm run typecheck` |
| Memory | `NODE_OPTIONS=--max-old-space-size=8192` |
| Position | After lint (when present), **before** production build |
| Failure policy | Any TypeScript diagnostic → nonzero exit → **CI job fails** |
| Error budget / suppression | **None** — no allowed-error baseline, no `continue-on-error`, no path exclusions, no `ignoreBuildErrors` |

Regression policy: any future TypeScript diagnostic must fail CI.

---

## Scope of this baseline

This record establishes a **full-project TypeScript zero-diagnostic** baseline and a durable CI typecheck gate.

It does **not** claim that all runtime tests pass.

### Scene runtime-test disclosure

- Scene Navigation stale assertion: **corrected** (focused suite passing)
- Other Scene runtime-test failures: **still require separate classification**
- TypeScript blocker: `false`
- Build blocker: `false`
- Full runtime-test certification: **not achieved**
- Production layout changes: not authorized by the typecheck-gate task

The CI TypeScript gate is **not** a replacement for runtime test gates.

---

## Local usage

```bash
cd frontend
NODE_OPTIONS="--max-old-space-size=8192" npm run typecheck
```

The package script is portable (`tsc --noEmit --pretty false --incremental false`).  
Large clean runs should set the 8 GB heap via environment configuration (local shell or CI step `env`), not by hard-coding platform-specific assignment inside the script.
