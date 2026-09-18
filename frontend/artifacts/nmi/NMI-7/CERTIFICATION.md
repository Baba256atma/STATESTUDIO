# NPA-T NMI:7 — Advisor + Management Intelligence Integration

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start NMI:8. Do not start DTH-EXP. No second Advisor was created.

## Status

**NPA-T NMI:7 — CERTIFIED**

## Architecture inspected

NMI:1–6, CC:5 `finalize` overlay path, NCA referent, ECA:8, NPS:2, VAI:4 Advisor overlay, STAGE-PROD Queue/Attention, RDI:1 Gate, RMS isolation.

Canonical integration: optional `nmiAdvisorBundle` → `applyNmiAdvisorToPresentedResponse` after VAI overlay. Conversational ownership remains CC:5 / NCA / ECA.

## Files created

- `frontend/app/lib/nmi/nmiAdvisorIdentity.ts`
- `frontend/app/lib/nmi/nmiAdvisorContract.ts`
- `frontend/app/lib/nmi/nmiAdvisorQuery.ts`
- `frontend/app/lib/nmi/nmiAdvisorCompose.ts`
- `frontend/app/lib/nmi/nmiAdvisorFoundation.ts`
- `frontend/app/lib/nmi/nmiAdvisor.test.ts`
- `frontend/artifacts/nmi/NMI-7/*`

## Files modified

- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts` — optional NMI overlay in `finalize`
- `frontend/app/lib/conversational-control/conversationalExperience.ts` — `nmiAdvisorComposition` on the experience result

NMI:6 `startsNmi7` remains false. NMI:7 `startsNmi8` is false.

## Tests / gates

Focused NMI:7: **7 pass / 0 fail**.

Focused NMI:1–7: **57 pass / 0 fail**.

CC:5 conversational experience: **17 pass / 0 fail**.

NCA:1: **13 pass / 0 fail**.

ECA:8 + NPS:2 + VAI:4 + VAI:3 + NMI:6 (combined focused batch): **141 pass / 0 fail**.

ESLint NMI:7 + CC:5 files: **0 errors**.

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining debt

See `KNOWN-DEBT.md`.

## Program close

NMI:8 was not started. DTH-EXP was not started. Decision/Execution writers were not replaced.

## Final status

**NPA-T NMI:7 — CERTIFIED**
