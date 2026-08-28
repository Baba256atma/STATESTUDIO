# NXA:5-FIX1 — Collection Judgment, Priority Semantics & Stage Awareness

## Certification result

**NXA:5-FIX1 = CERTIFIED**

NXA:5 remains certified. The observed collection-authority, priority-language, Overview-label, and Stage-awareness defects are closed without adding a parallel Advisor, comparison engine, Stage authority, evidence store, score, Decision writer, or Execution writer.

## 1–8. Defects reproduced and owning causes

The supplied failures were reproduced on live `/executive` before correction.

1. `show all problems` followed by `which one is important?` fell into Scenario comparison fallback.
2. Urgency and one-member Risk follow-ups had the same authority leak.
3. Overall importance was not clearly distinguished from investigation priority.
4. Unknown Goal context could still produce Goal-flavored reasoning.
5. Overview used the unrestricted heading `Top Priority` despite scoped/limited evidence.
6. Stage answers read only shallow labels rather than the authoritative focused object plus visible collection members.
7. Stage collection presentation cleared the prior center focus.
8. Workspace questions beginning with `which` or `why` could be intercepted by comparison logic.

The primary root cause was an authority discontinuity: NCA-POST:4 considered an active comparison but not an active collection when deciding whether an ambiguous follow-up survived an upstream `focus`, `explain`, or false `compare-scenarios` classification. Secondary causes were response ownership being applied too late, Stage snapshot composition omitting collection members, and collection presentation treating focus and collection as mutually exclusive.

## 9–16. Collection and judgment reconciliation

- Active canonical collection is now an explicit input to comparison-meaning interpretation.
- Semantic follow-up cues cover `which`, compare/rank, important/matters, urgent, riskier/safer, investigate, attention, bigger, recommendation, and change-condition questions.
- Plain navigation remains navigation; an active collection alone does not turn `focus on Margin Pressure` into comparison.
- Candidate precedence remains explicit references → active collection → active comparison → context.
- A false Scenario intent is suppressed when a non-Scenario collection owns an ambiguous judgment follow-up.
- A real active Scenario assessment or explicit Scenario reference retains Scenario authority.
- Workspace/product owners cannot be overwritten by collection comparison or NXA:5.
- Comparison and judgment questions preserve the pre-turn Stage state and do not navigate.

## 17–23. Priority semantics and recommendation quality

- `OVERALL_SIGNIFICANCE`, `INVESTIGATION_PRIORITY`, `URGENCY`, `RISK`, financial impact, evidence strength, reversibility, Goal impact, and delivery impact remain distinct criteria.
- Unsupported overall importance now says that comparable impact evidence is missing; it does not silently substitute urgency, attention, Goal relevance, or investigation order.
- Investigation priority may recommend a reversible evidence-gathering sequence without claiming the selected Problem is larger or causal.
- Urgency reports insufficient urgency evidence when the candidates cannot be compared on urgency.
- A one-member collection reports that no peer comparison is available and never borrows stale Scenario candidates.
- Unknown Goal context remains `UNKNOWN`; manager copy does not invent Goal alignment.
- Current-context relevance and known decision-relevant relationships can support learning value without being relabeled as Goal evidence.

## 24–29. Overview and Stage semantics

- Overview headings are criterion-scoped: `Investigation Priority`, `Risk Priority`, `Opportunity Priority`, `Decision Priority`, or `Current Evidence Priority`.
- The unrestricted `Top Priority` heading is removed from this surface.
- A read-only Stage semantic snapshot is derived from existing Runtime/DIR state: workspace, mode, focused object, displayed collection, visible members, and object kinds.
- Showing a collection preserves an authoritative existing focus, allowing a focused center object and surrounding collection to coexist.
- `what is on stage now?` names the focus and visible members.
- `what is in the center?` reads the authoritative focus.
- `which decisions are shown?` enumerates actual members.
- `why are these decisions here?` describes presentation context and explicitly states that visibility does not establish causality.
- Stage questions are read-only and answers refresh from current state rather than a cached description.

## 30–37. Trust and adjacent regression reconciliation

The broad audit exposed and closed two adjacent communication regressions:

- The trusted-communication certainty filter removed `proven` even inside the safety phrase `not proven`. Negated qualification is now preserved while unsupported positive certainty is still removed.
- The NCA:6 architecture-jargon filter removed the legitimate business term `binding` from `binding constraint`. That business term is no longer treated as internal architecture language.

Scenario investigation continuity was also protected: once a real Scenario assessment is active, `Compare them` continues through Scenario options rather than falling back to a stale one-member Risk collection.

Safety invariants remain intact:

- no numerical score;
- no invented evidence, causality, approval, outcome, Goal, or urgency;
- no automatic Decision commitment;
- no automatic Execution start;
- no business mutation from Stage description or judgment questions;
- no architecture identifiers in manager-facing live responses.

## 38–44. Automated and live validation

- Focused NCA-POST:3/4, NXA:5, and DIR:1 matrix: **47/47 passed**, 0 failed, 0 skipped.
- Adjacent causal-intelligence regression: **33/33 passed**.
- Executive-domain omnibus (manager-object, conversational control, executive intelligence, entrance, semantic Director): **1,274/1,274 passed**, 0 failed, 0 skipped.
- Legacy Director manifest/foundation/freeze/public-index matrix, run with native Node so `import.meta.dirname` is available: **58/58 passed**, 0 failed, 0 skipped.
- Combined broad coverage: **1,332/1,332 passed**, 0 failed, 0 skipped.
- Live `/executive` certification: **passed all 16 proofs**, zero page errors.
- Production build: compiled successfully, TypeScript passed, static generation **13/13** passed with `NODE_OPTIONS=--max-old-space-size=8192`.
- Changed-file ESLint: passed with zero errors and zero warnings.
- `git diff --check`: passed.

The initial all-in-one `tsx` probe reported nine Director file-inventory failures because that transform does not supply `import.meta.dirname`; rerunning those unchanged tests with Node's native TypeScript runner produced 58/58. The same probe exposed three genuine adjacent failures, all reconciled above before the final green runs.

## 45–48. Runtime proof and final audit

The authoritative live artifact is:

- `.certification/nxa-5-fix1-collection-stage/runtime-collection-stage.json`
- screenshots: `problems.png`, `scenarios.png`, `risks.png`, and `stage.png` in the same directory.

Observed final behavior includes:

- Problems remain the candidate set for ambiguous importance and urgency follow-ups.
- Overall importance refuses a fake winner while investigation priority can give a qualified next investigation.
- Explicit Scenario comparison remains Scenario-owned.
- Risk collection scope is preserved without stale-candidate borrowing.
- Stage reports `Margin Pressure` as current focus with `Expand Capacity` and `Approve Repricing` visible in Decisions.
- Stage visibility is not promoted into causal truth.
- Reasoning and Stage-description turns preserve Stage state.

No known NXA:5-FIX1 defect remains. NXA:5 is retained as certified.
