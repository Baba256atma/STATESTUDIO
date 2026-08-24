# Failure log — discovered and closed in FINAL:6.6

| ID | Dialogue / suite | Expected | Actual | Owner | Root cause | Fix | Regression | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FIX1 | 6.1 `ch4` / I disagree | CHALLENGE | Dropped cue | 6.1 | Type-C family edit dropped `i disagree` | Restore family cue + related families | 6.1 corpus | Closed |
| FIX2 | I dont buy that | CHALLENGE | Missed apostrophe-less contraction | 6.1 | Light-prepare stripped `'` without mapping dont/cant | General contraction map after apostrophe strip | 6.1/6.6 | Closed |
| FIX3 | RAG/PDF/SQL asks | Honest limitation | Weak fiction classifier | 6.5 | Incomplete product-fiction families | Extend capability classifier (not per-sentence routes) | 6.5 fiction | Closed |
| FIX4 | FINAL:1 first-contact help | Situation / decision you control | Investigate UNRESOLVED_ISSUE | 6.5 | Attention label was screaming enum | Humanize next-step; don’t use SNAKE labels as objects | FINAL:1, 6.5 | Closed |
| FIX5 | Manager copy enums | Human language | DECISION_REQUIRED / READY_FOR_ | 6.4 | Polish missed workflow enums | Strip/humanize in 6.4 | 6.6 leak assert | Closed |
| FIX6 | FINAL:4 Let’s do that | Commitment deictic | 6.3 that-ambiguity | 6.3 | `that` gate too broad | Skip that-clarify on do/go with/lets do that | FINAL:4, 6.3 | Closed |
| FIX7 | Live onboarding Why / look first | Executive 6.1–6.5 | Thin “Understood.” | Runtime / EXP:1 | Entrance owned all turns until identity SUFFICIENT | Don’t own executive ops (HELP/CAUSE/FOCUS/…) while identity incomplete | FINAL:1 persist test | Closed |
| FIX8 | FINAL:1 click+Show Goal | Catalog after loop | Session dropped after unowned turn | Runtime integration | `finalize` nulled `nextEntranceSession` | Persist previous entrance session unless entrance produced a new one | FINAL:1 | Closed |
| FIX9 | NEX-EXP:5 recommend / 6.5 options | EXP:5 / 6.5 copy | 6.4/6.5/investigation overwrote authorities | 6.4, 6.5, orchestrator | Investigation beat preserve; 6.4 rec overlay used identity “Dana ·”; 6.5 skipped when scenarioResult preserve | `lockPresentedResponse` for entrance; keep CC:9 preservable; don’t overlay identity labels; OPTIONS still fires if authority needs two scenarios | EXP:5, 6.5 corpus | Closed |
| FIX10 | NEX-EXP:2 success question | What does success look like? | Depth cap dropped the question | 6.4 | BRIEF capDepth on entrance-owned Goal summary | Lock 6.4 rewrite/cap when entrance locks presented response | EXP:2 | Closed |
| FIX11 | FINAL:3 show risk problem | Ambiguity | KPI vs problem (6.3) | 6.3 vs FINAL:3 copy | Assertion too tight | Accept 6.3 KPI/problem clarify | FINAL:3 | Closed |
| FIX12 | EXP:6/5 unknowns | “unknown” word | “do not have validated causal proof” | 6.4/FINAL:5 | Honest wording without the token; Goal id leaked | Manager-facing `labelFor`; don’t use `goal-executive-discovered`; tests accept do-not-have | EXP:5/6, 6.6 leak | Closed |
| FIX13 | EI:2 How sure | Evidence limited | “I’m sure … Watch” | 6.4 | ASK_UNCERTAINTY overwrote thin EXI | Don’t overwrite evidence-limited answers; don’t treat Watch as a fact | EI:2, 6.4 | Closed |
| FIX14 | Live Why? | No ranking codes | GOAL RELEVANCE / JOURNEY BLOCKER | 6.4 / MO:6 | Ranking tokens in manager copy | Strip ranking tokens in 6.4 + leak regex | Live leak gate, 6.6 | Closed |
| FIX16 | Live supplier email | 6.5 limitation | CC:1 unknown | 6.5 | `send an email` didn’t match `send the supplier an email` | General `send … email` window, not a sentence route | 6.5 fiction + live | Closed |

No remaining unexplained failing tests in the FINAL:1–6.6, MO:4–6, CC:5, NEX-EXP:1–7, EI:1–4 suites rerun for this phase.
