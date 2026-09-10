# MRA:1 — Root-Cause Clusters

Date: 2026-09-09

Clusters are derived from the Failure Map, not assumed in advance. MRA:2 should fix these systems, not add phrase handlers.

## C1 — Reference resolution

**Failures:** 007, 008, 009, 014, 015, 018, 025

**Earliest incorrect transition:** current-turn meaning / collection sibling / ordinal / letter alias is not bound; NCA:1 Outcome clarification or a stale subject wins.

**Systemic gap:** ECA:1 reference precedence (explicit current turn vs focus vs recent vs Stage vs collection members) is incomplete for manager English (`it`, `the other one`, `the first problem`, `Scenario A`, correction to Executions).

**MRA:2 shape:** Strengthen one reference resolver over ECA:1 + NCA-POST:3 membership. Do not add per-phrase aliases.

## C2 — Phrase-class routing (Stage-meta, SHOW, count, readiness)

**Failures:** 005, 016, 026, plus count in 006/028

**Earliest incorrect transition:** utterance classifies as BUSINESS SHOW/UNKNOWN instead of WORKSPACE_STATE, COLLECTION_QUERY COUNT, EXPLAIN, or ECA:7 readiness.

**Systemic gap:** NCA-POST:3 semantic scope and ECA:2 intent selection are still phrase-shape sensitive (`what is on stage?` vs `show me what is on Stage`; `explian it` vs `explain it`).

**MRA:2 shape:** One classification yield order: DATA-ADV → Stage-meta → collection query → ECA intent. Recover CC:1 verbs before UNKNOWN.

## C3 — Collection catalog and membership

**Failures:** 003, 006, 012, 017, 023, 028, 029

**Earliest incorrect transition:** unknown name → empty collection; missing kinds → BUSINESS ambiguity; “critical” → comparison; bare “risks” → not a collection query.

**Systemic gap:** Canonical membership exists for Problems/Scenarios/Decisions/Executions. Goals/KPI/Evidence/Outcomes/Data Objects are not first-class collections. Unknown member handling deletes the collection rather than reporting a miss.

**MRA:2 shape:** Extend NCA-POST:3 membership + unknown-member behavior. Align Goal talk with catalog emptiness. Do not invent Goal objects.

## C4 — Advisor composition / professionalism

**Failures:** 009, 022, 029, 030, 032

**Earliest incorrect transition:** NCA:6 / NXA:5 fill Advisor copy with unfilled slots and internal reason codes; multiple overlays concatenate.

**Systemic gap:** Manager-facing composer is not a single bounded utterance. Architecture vocabulary (`DECISION REQUIREMENT`) leaks.

**MRA:2 shape:** One manager-facing compose gate: no internal codes, no empty slots, no duplicate paragraphs. Keep ECA overlays from stacking identically.

## C5 — Recommendation identity and readiness

**Failures:** 013, 021, 026, 032

**Earliest incorrect transition:** NCA:4 emits “temporary capacity” (not a catalog Scenario); ECA:7 READY while compare said insufficient; SHOW/focus re-attaches “My recommendation remains…”.

**Systemic gap:** Advisory option identity is not the catalog/Theatre scenario set. Readiness and spoken recommendation can diverge.

**MRA:2 shape:** Bind NCA:4/ECA:7 options to NCA-POST:3/POST:4 candidates. Suppress leftover recommendation on knowledge/SHOW unless the manager asked.

## C6 — Data vs business routing

**Failures:** 010, 011

**Earliest incorrect transition:** DATA-ADV matcher returns null on follow-ups and “support [Problem]”; NCA BUSINESS investigation wins.

**Systemic gap:** Inventory/BKL/KPI paths work; anaphoric field questions and data-support-for-object questions do not lock DATA-ADV.

**MRA:2 shape:** Extend DATA-ADV:1 classifiers and dialogue “current source” — still one Data Library. Do not confirm LIKELY meanings.

## C7 — Decision / Execution session continuity

**Failures:** 001, 002, 031

**Earliest incorrect transition:** CC:10 `applied` on Approve; later ECA:9/CC:11 talk reads no Decision. Insufficient-evidence challenge skipped.

**Systemic gap:** Two Decision surfaces: CC:10 session vs Theatre/catalog Decision objects. ECA:8/9 consume the wrong one after conversational Approve. Live ECA:10 proofs required Theatre clicks for a reason.

**MRA:2 shape:** ECA:9/CC:11 must read the same CC:10 session the Advisor just announced. Keep ECA from writing Decisions. Align challenge with CC:10 confirmation policy.

## C8 — Mutation operation typing and proposal repair

**Failures:** 004, 019, 020, 027

**Earliest incorrect transition:** delete→ADD; pronoun copied as name; correction asks Risk vs Demand; GOAL proposal without Goal writer.

**Systemic gap:** ECA:1 proposal captures operation and name too loosely. Only Risk has a certified conversational writer.

**MRA:2 shape:** Type operations (ADD/UPDATE/REMOVE). Resolve “this” to active subject. Refuse Goal/Problem writes without a canonical writer. Correction replaces proposal identity.

## C9 — Stage / Advisor projection

**Failures:** 024, 005, 031

**Earliest incorrect transition:** SHOW_COLLECTION updates Advisor collection copy but Stage `visibleMembers` still includes Overview queue actors (Risk Watch). SHOW-Stage phrase ignores NXA:5-FIX4.

**Systemic gap:** DIR leftover actors vs NCA-POST:3 membership vs Stage-meta phrasing.

**MRA:2 shape:** NXA:5-FIX4 remains the Stage read model. Collection presentation must either hide leftover actors or Advisor must describe them as still visible. Do not make Stage the business collection authority.

## Ordered MRA:2 input

1. C1 Reference resolution  
2. C7 Decision/Execution session continuity  
3. C6 Data vs business routing  
4. C2 Phrase-class routing  
5. C5 Recommendation identity and readiness  
6. C3 Collection catalog and membership  
7. C8 Mutation operation typing  
8. C4 Advisor composition / professionalism  
9. C9 Stage/Advisor projection  

Do not start these fixes in MRA:1.
