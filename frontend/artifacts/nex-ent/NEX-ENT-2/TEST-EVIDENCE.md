# NEX-ENT:2 test evidence

## Focused proof

Command: `./node_modules/.bin/tsx --test app/lib/nexora-entrance/nexoraGuidedEntranceExperience.test.ts app/lib/nexora-entrance/nexoraEntranceIdentity.test.ts`

Result: 39 passed, 0 failed, 0 skipped.

NEX-ENT:1 suite: 10/10. NEX-ENT:2 suite: 7/7. NEX-EXP:1 identity suite: 22/22.

## Owning-layer entrance

Command: `./node_modules/.bin/tsx --test app/lib/nexora-entrance/*.test.ts`

Result: 149 passed, 0 failed, 0 skipped.

## Conversation regression

Command: `./node_modules/.bin/tsx --test app/lib/conversational-control/*.test.ts`

Result: 336 passed, 0 failed, 0 skipped.

## Shell / page

Command: `./node_modules/.bin/tsx --test app/executive/nex-mvp/NexoraExecutiveShell.test.tsx app/executive/page.test.tsx`

Result: 43 passed, 0 failed, 0 skipped.

## Decision Theatre

Command: `./node_modules/.bin/tsx --test app/lib/decision-theatre/*.test.ts`

Result: 172 passed, 0 failed, 0 skipped.

## Funnel

- Level 1: passed; 1/1 required.
- Level 2: passed; 1/1 required.
- Level 3: passed; 1/1 required.
- Level 4: 7/7 required after an environmental retry. First sequential L4 attempt failed `l4-build` with `.next/lock` (another `next build` already running). A later funnel write and a direct `NODE_OPTIONS=--max-old-space-size=8192 npm run build` both succeeded. Omnibus 1388/1388. TypeScript, ESLint, `git diff --check`, production build, and `/executive` live smoke included.

## TypeScript / ESLint

- `NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck` — passed.
- Targeted ESLint on NEX-ENT:2 files — 0 errors. One pre-existing `react-hooks/exhaustive-deps` warning in `NexoraExecutiveShell.tsx` (`csvImportStoreVersion`), not introduced by NEX-ENT:2.

## Live proof

Command: `node scripts/nex-ent2-stage-education-certify.mjs`

URL: `http://localhost:3000/executive?entrance=1&reset=1` and `http://localhost:3000/executive`

Result: all required live gates true; HTTP 200; 0 uncaught page errors; 0 unique-key / hydration warnings.

Observed:

- Default `/executive` remains existing-workspace; `data-nex-ent1-state=INACTIVE` and `data-nex-ent2-state=INACTIVE`.
- Entrance shows one NEXORA actor and NEX-ENT:1 introduction.
- **Show me** starts Stage education (`INTRODUCING`), investigate environment, Stage copy, suggested questions.
- Natural questions: what Stage is, dashboard distinction, what appears (no Object-family teaching).
- **Show problems** is not captured as Stage education; catalog stays one entrance actor.
- Focus demo uses existing object-focused select on `obj-nexora-entrance`.
- Opening the Stage object list and selecting NEXORA yields Advisor acknowledgment.
- Refresh keeps a single Stage actor (introduction may replay; no durable education store).
- Skip restores existing-workspace.
- Reduced-motion page still explains Stage and demonstrates focus.
- Re-entry `?entrance=1&reset=1` is deterministic.

L4 `/executive` live smoke: `ok: true`, 0 page errors.
