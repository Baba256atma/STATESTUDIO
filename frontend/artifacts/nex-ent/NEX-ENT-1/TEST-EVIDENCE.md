# NEX-ENT:1 test evidence

## Focused proof

Command: `./node_modules/.bin/tsx --test app/lib/nexora-entrance/nexoraGuidedEntranceExperience.test.ts app/lib/nexora-entrance/nexoraEntranceIdentity.test.ts`

Result: 32 passed, 0 failed, 0 skipped.

NEX-ENT:1 suite: 10/10. NEX-EXP:1 identity suite: 22/22.

## Owning-layer entrance

Command: `./node_modules/.bin/tsx --test app/lib/nexora-entrance/*.test.ts`

Result: 142 passed, 0 failed, 0 skipped.

## Conversation regression

Command: `./node_modules/.bin/tsx --test app/lib/conversational-control/*.test.ts`

Result: 336 passed, 0 failed, 0 skipped.

Shell/page: `NexoraExecutiveShell.test.tsx` + `page.test.tsx` included in a 60/60 combined run with CC:5.

## Funnel

- Level 1: passed; 1/1 required.
- Level 2: passed; 1/1 required.
- Level 3: passed; 1/1 required.
- Level 4: passed in 495941 ms; 7/7 required. Omnibus 1381/1381. TypeScript, ESLint, `git diff --check`, production build, and `/executive` live smoke included.

## TypeScript / ESLint

- `NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck` — passed.
- Targeted ESLint on NEX-ENT:1 files — 0 errors. One pre-existing `react-hooks/exhaustive-deps` warning in `NexoraExecutiveShell.tsx` (csv import version), not introduced by NEX-ENT:1.

## Live proof

Command: `node scripts/nex-ent1-entrance-introduction-certify.mjs`

URL: `http://localhost:3000/executive?entrance=1&reset=1` and `http://localhost:3000/executive`

Result: all required live gates true; HTTP 200; 0 uncaught page errors.

Observed:

- Default `/executive` remains existing-workspace with a populated Stage; `data-nex-ent1-state=INACTIVE`.
- Entrance route shows one centered NEXORA subject, Advisor welcome copy, and suggested actions.
- “What can Nexora do?” is answered in manager language without identity/Goal/Decision writes.
- Refresh keeps a single Stage actor.
- Skip restores existing-workspace with the normal object catalog.
- Re-entering `?entrance=1&reset=1` reactivates introduction deterministically.
