# MRA:3-FIX1 — Fix Map

Failure ID → Root cause → Fix → Runtime proof. No second Stage store, collection model, resolver, mutation writer, or session store.

| Failure ID | Root cause | Fix (existing authority) | Proof |
| --- | --- | --- | --- |
| Stage watches during Problems | FIX4 visible = presentation ∪ collection | Collection projection = collection members only; Overview drops leftover `spatialRole === "collection"` | J1 `show me problems` → `whats on stage` lists Capacity Gap, Margin Pressure only (`runtime-turns.json`) |
| MRA-3-002 | Ordinal vs return; lastCollection parse; pronoun EXPLICIT leftover; MO named-hint on `it` | NCA:2 ordinal before return; parse `Current Problems are`; POST:3 ordinal writes `activeSubject.id`; continuity skips deictic NLU as EXPLICIT; deictic utterances are not named hints | J2 `explain it` → Capacity Gap |
| MRA-3-003 | ECA ordinal vs Stage unique visible | Listed `lastCollection` ordinal pool unless “on stage”; leftover meaning name must appear in utterance | J4 `explain the second one` → Demand Surge |
| MRA-3-008 | Stage click ignored when NCA still named prior Problem | Incoming runtime focus ≠ session + deictic `explain it` → click activation on Manager-Object | NAV `explain it` after synthetic Margin click → Margin Pressure |
| MRA-3-004 | Cancel/topic/unnamed ADD | Broader cancel; topic-shift drops proposal; unnamed ADD NEEDS_CLARIFICATION | `Add this as a Risk` → which item; later `yes` does not add Risk |
| MRA-3-005/006/007 | Composer/fallback leaks | NCA:6 after ECA overlays; manager-facing labels; leak regex without WATCH | Isolated LEAK=[] ; plan change has no ECA:10 |
| Investigate it (MRA-1-008 class) | Action invocation unmatched before continuity | Do not “which item” when previous NCA subject exists | DEF-008 / FIX1 test |
| NXA:2 this object | NXA:1 used NLU Capacity Watch as explicit | Deictic `this object` uses NCA:2 active subject | `nexoraNxa2ConversationGuidanceContract.test.ts` |

Unseen variants in `mra2ManagerReadiness.runtime.test.ts`: J2-prefix interruption, `explain that problem`, Stage-click `explain it`.
