# NEX-ENT:4 test evidence

## Focused

`./node_modules/.bin/tsx --test app/lib/nexora-entrance/nexoraConversationEducationExperience.test.ts app/lib/nexora-entrance/nexoraObjectEducationExperience.test.ts app/lib/nexora-entrance/nexoraGuidedEntranceExperience.test.ts`

51 passed (NEX-ENT:1 10, NEX-ENT:2 7, NEX-ENT:3 14, NEX-ENT:4 20).

## Owning layer

`./node_modules/.bin/tsx --test app/lib/nexora-entrance/*.test.ts` — 183/183.

## Conversation

`./node_modules/.bin/tsx --test app/lib/conversational-control/*.test.ts` — 336/336.

## NCA / NXA

`./node_modules/.bin/tsx --test app/lib/manager-object/nexoraNca*.test.ts app/lib/manager-object/nexoraNxa*.test.ts app/lib/manager-object/nexoraAdvisorDataInquiry.test.ts` — 348/348.

## Decision Theatre

`./node_modules/.bin/tsx --test app/lib/decision-theatre/*.test.ts` — 172/172.

## Funnel

L1–L3 pass. L4 7/7 required. Omnibus 1422/1422.

## TypeScript / ESLint

Typecheck passed. Targeted ESLint: 0 errors. Pre-existing `csvImportStoreVersion` exhaustive-deps warning; pre-existing unused `_runtimeState` on guided skip helper.

## Live

`node scripts/nex-ent4-guided-conversation-certify.mjs` — all required gates true; 0 page errors; 0 unique-key/hydration warnings.

## State safety

Before/after ENT:4 educational conversation: discovery sessions remain null; identity insufficient; Goal unconfirmed; issue/scenario discovery counts 0. Skip restores existing-workspace without publishing educational IDs as business Objects.
