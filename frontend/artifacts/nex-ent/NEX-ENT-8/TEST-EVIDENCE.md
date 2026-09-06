# NEX-ENT:8 — Test evidence

Date: 2026-09-04.

## Focused (L1)

`./node_modules/.bin/tsx --test app/lib/nexora-entrance/nexoraDecisionLoopEducationExperience.test.ts`

**17/17 pass.**

## Owning layer / integration

| Pack | Result |
| --- | --- |
| `app/lib/nexora-entrance/*.test.ts` + visual intelligence + DIR:GA + UI guidance | **289/289** |
| `app/lib/conversational-control/*.test.ts` + EI + nexora-certification | **658/658** |
| `app/lib/decision-theatre/*.test.ts` (DTH:1–12) | **172/172** |
| `app/lib/manager-object/*.test.ts` | **596/596** |

## TypeScript / build

- `npm run typecheck` — pass
- `npm run build` — pass (Next.js 16.0.10)

## Live

`NEXORA_BASE_URL=http://localhost:3003 node scripts/nex-ent8-decision-loop-certify.mjs`

Production `next start -p 3003` after the build above. Hung/stale `next dev` on **:3000 was not used and was not killed.**

Result: `frontend/.certification/nex-ent8-decision-loop/live-browser.json` — **passed: true**, http 200, zero page errors.

## Funnel

L1-style focused + owning-layer packs above. Full NXA funnel L4 live-smoke was **not** pointed at :3000 (stale/dev listener). Current-build live proof is :3003.

## Canonical loop outside ENT

Focused test walks NEX-EXP:7/8 with identity + CC:10R + CC:11: one Decision, no auto Execution, then explicit Confirm starts Execution; second `Yes, confirm.` does not duplicate Decision (`listDecisions().length === 1`).
