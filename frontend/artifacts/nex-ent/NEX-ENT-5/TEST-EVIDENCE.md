# NEX-ENT:5 test evidence

## Focused

DIR:GA 9/9. UI guidance intent 8/8. NEX-ENT:5 education 16/16. Combined with ENT:1–4 guided-entrance pack: 50/50.

## Owning layer

`app/lib/nexora-entrance/*.test.ts` — 199/199.

## Conversation / NCA / DTH

conversational-control 336/336. NCA/NXA 343/343. Decision Theatre 172/172.

## Funnel

- Level 1: passed; 1/1 required.
- Level 2: passed; 1/1 required.
- Level 3: passed; 1/1 required.
- Level 4: passed in 454672 ms; 7/7 required. Omnibus 1446/1446.

L4 live-smoke used `EXECUTIVE_URL=http://127.0.0.1:3001/executive` because existing `next dev` PID 12933 on port 3000 accepts TCP but does not complete HTTP. This task did not terminate that process. Production `next start` on 3001 was started for live gates.

## TypeScript / ESLint

Typecheck passed (L4). Targeted ESLint: 0 errors. Pre-existing `csvImportStoreVersion` exhaustive-deps warning.

## Live

`NEXORA_BASE_URL=http://127.0.0.1:3001 node scripts/nex-ent5-guided-attention-certify.mjs`

Result: `.certification/nex-ent5-guided-attention/live-browser.json` — all required gates true, `uncaught: 0`, no unique-key/hydration warnings.
