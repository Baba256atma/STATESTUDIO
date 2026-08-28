# NXA:6-PREP — Conversation Diagnostic, Observability & Certification Efficiency

## 1. Final verdict

**NXA:6-PREP = CERTIFIED**

## 2. Adjacent phases

NXA:5-FIX2 remains CERTIFIED.  
NXA:6 was not started.

## 3. Infrastructure delivered

- Diagnostic workflow: `nxaConversationDiagnosis` with six verdicts; records cannot authorize a Fix.
- Test Funnel: Levels 1–4 wrapping existing repo commands; `npm run nxa:funnel -- --level N`.
- Conversation harness: `npm run nxa:harness`; 10 certified seed cases covering the 25 required families; invalid synthetic self-test excluded from the passing set.
- Observability: read-only path projection from existing CC:5/DIR/Stage results; `nxaConversation` diagnostic scope default-off.
- AGENTS.md plus `.cursor/rules/nexora-debugging-certification.mdc`.
- Task accounting: ledger + certification barrier.
- Prompt templates: diagnosis / fix / certification.

## 4. Existing mechanisms reused

CC:5 executor, CC:5 trace, DIR:1 `directorPlan`, Queue presenter, `diagnosticSwitch`, FINAL:3 Playwright helpers, existing `tsx --test` / `tsc` / `next build` / ESLint / `git diff --check`.

## 5. Files created

`frontend/app/lib/nexora-certification/*`, funnel/harness/live scripts, `AGENTS.md`, `.cursor/rules/nexora-debugging-certification.mdc`, `frontend/artifacts/nxa6-prep/*`, `.certification/nxa-6-prep-conversation-diagnostics/*`.

## 6. Files modified

`diagnosticSwitch.ts` (+ default-off `nxaConversation` scope), its test, `package.json` scripts.

## 7. Test totals

Focused: 18/18. Layer: 420/420. Integration: 46/46. Harness: 10/10. Omnibus: 1297/1297. DIR: 58/58. Combined: 1355/1355. Skipped: 0.

## 8. TypeScript / build / lint / diff

Typecheck pass. Production build pass (static generation included). PREP ESLint pass. `git diff --check` pass.

## 9. Live /executive smoke

Pass. Zero page errors. After `show problems`: collection mode, 2 visible Problems. Advisor: `Current Problems: Capacity Gap, Margin Pressure.`

## 10. Production-behavior parity

No NCA/NXA/Stage/collection/decision/execution production logic was rewritten. Diagnostic switch only adds a default-off scope. Harness calls the existing executor.

## 11. Background-task ledger

Required started 7, passed 7, failed 0, still running 0, uninspected 0.  
Nonessential still running: existing Next.js `npm run dev` (not started here, not killed).

## 12. Remaining risks

See `KNOWN-RISKS.md`. None block PREP.

## 13. Stop Condition

Success: NXA:6-PREP = CERTIFIED, required gates green, required tasks finished and inspected, artifacts written, production behavior unchanged, NXA:6 not started.
