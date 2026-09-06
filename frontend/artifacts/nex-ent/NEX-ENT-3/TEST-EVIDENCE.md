# NEX-ENT:3 test evidence

## Focused

`./node_modules/.bin/tsx --test app/lib/nexora-entrance/nexoraObjectEducationExperience.test.ts app/lib/nexora-entrance/nexoraGuidedEntranceExperience.test.ts`

31 passed (NEX-ENT:1 10, NEX-ENT:2 7, NEX-ENT:3 14).

## Owning layer

`./node_modules/.bin/tsx --test app/lib/nexora-entrance/*.test.ts` — 163/163.

## Conversation

`./node_modules/.bin/tsx --test app/lib/conversational-control/*.test.ts` — 336/336.

## Decision Theatre

`./node_modules/.bin/tsx --test app/lib/decision-theatre/*.test.ts` — 172/172.

## Funnel

L1–L3 pass. L4 7/7 required after typecheck fix (first L4 stopped on `VISIBLE` string[] typing). Omnibus 1402/1402 (log count from l4-executive-omnibus).

## TypeScript / ESLint / build

Typecheck passed. Targeted ESLint: 0 errors. Pre-existing `csvImportStoreVersion` warning; skip `_runtimeState` unused warning in guided skip helper. Production build included in L4.

## Live

`node scripts/nex-ent3-object-education-certify.mjs` — all required gates true; 0 page errors.

## State safety

Focused proofs A–K and full recap: discovery sessions remain null; identity insufficient; educational IDs only `obj-nex-ent3-*`.
