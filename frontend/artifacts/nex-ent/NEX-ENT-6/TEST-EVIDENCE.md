# NEX-ENT:6 test evidence

## Focused

NEX-ENT:6 19/19. DIR:GA 9/9. UI guidance 8/8. Guided entrance 1–5 remain green in the 218-test entrance pack.

## Owning layer

`app/lib/nexora-entrance/*.test.ts` — 218/218.

## Conversation / NCA / DTH / Data

conversational-control 336/336. NCA/NXA + Advisor Data Inquiry 348/348. Decision Theatre 172/172 (plus DATA-UX:3 semantic tests in a combined 180 run). `csvSemanticUnderstanding` isolation and clarification writer tests used for Proofs H/O.

## Funnel

L1–L3 pass. L4 omnibus 1465/1465, dir-inventory, typecheck, eslint, diff-check, and production build passed. In-funnel live-smoke failed because `next start` on 3001 was serving the previous build during rebuild (exit 143 on an earlier omnibus was `spawnSync` buffer; funnel `maxBuffer` raised to 64MB). After restarting production on 3001: live-smoke passed.

## Live

`NEXORA_BASE_URL=http://127.0.0.1:3001 node scripts/nex-ent6-data-evidence-certify.mjs` — all required gates true, `uncaught: 0`.
