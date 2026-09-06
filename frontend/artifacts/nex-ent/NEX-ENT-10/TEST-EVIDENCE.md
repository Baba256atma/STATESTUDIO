# NEX-ENT:10 — Test evidence

Date: 2026-09-05.

## Focused (L1)

`tsx --test app/lib/nexora-entrance/nexoraPersonalDemoHandoffExperience.test.ts` — **11/11**.

## Packs

| Pack | Result |
| --- | --- |
| Entrance + visual + DIR:GA | **292/292** |
| TypeScript | pass |
| Production build | pass |

## Live

`NEXORA_BASE_URL=http://127.0.0.1:3006 node scripts/nex-ent10-personal-demo-handoff-certify.mjs`

Current-build `next start` on **:3006**. `live-browser.json` — **passed: true**.

Hung `:3000` was not used and was not killed.
