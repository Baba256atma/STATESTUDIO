# NCA-POST:3 root cause

Identity: `NCA-POST:3/SemanticScopeMultiEntityCanonicalCollectionNexoraWorkspaceIntelligence`  
Version: 1.0.0  
Namespace: `nexora.nca.post.semantic-scope-multi-entity-canonical-collection-workspace`

This is not NCA:8. No phrase tables. No second Problems store.

## A. Relationship request collapses to one subject

Canonical meaning kept a **single** `subject`. When `objects.length > 1`, the interpreter left `subject` null or took the first match. MO explain then used the **active object's first registered edge** (Risk → Margin Pressure) instead of evaluating the named pair (Risk ↔ Delivery). Stage fixtures already contain `rel-risk-delivery`. Owner: NCA:1 meaning + MO explain path, not missing catalog data.

## B. Unnecessary business-outcome clarification

NCA:1 `applyNcaStrategyToResponse` rewrote UNKNOWN / unknown-intent copy to “I need to know which business outcome you're referring to.” Product, workspace, capability, help, and mixed turns were classified as business UNKNOWN. Conditional `if … is it ok` was not always EVALUATE. NCA:3 `shouldAsk` had no semantic-scope gate.

## C. Multi-entity assertion becomes navigation + advice

Copular classification (“are problems”) was not POST:2 OBSERVE. Meaning defaulted to FOCUS/LOCATE on the first fuzzy match. NCA:4 `shouldAdvise` appended the last recommendation (temporary capacity) because the turn still looked like business follow-up.

## D. Advisor vs Menu Problems mismatch

Menu membership is `resolveExecutiveQueueEntryForCategory({ category: "problem" })` over `catalog.contextSubjects` (Capacity Gap + Margin Pressure). Advisor `reveal-problems` is `primary-optional`; an inherited conversational subject became `primaryTargetId` → select-interaction-subject → “Showing problems for {label}”. Two paths, two memberships.

## E. ALL collection inherits conversational subject

Explicit ALL / unfiltered `show problems` still passed the active subject as a related-to filter. Collection kind, scope, and filter were collapsed into one subject field.

## F. Disappearance / change questions route to investigation

No collection-delta owner. “Why did Capacity Gap remove?” matched INVESTIGATE / CAUSE. NCA:3, NCA:4, and MO investigation then composed a stitched answer.

## G. Product-capability questions become business gaps

No PRODUCT_ACTION / capability-inquiry vs action-request distinction. The word “object” and UNKNOWN need fell through to the business-outcome fallback.

## H. Workspace / Stage questions become business gaps

No CURRENT_WORKSPACE or MIXED (product + workspace) classification before NCA:3. “Explain the Stage. What is on Stage now?” was treated as a missing outcome, not product knowledge plus runtime trail.

## I. Response-authority collision

NCA:3/4/5 and MO append even when they are not required by the primary request. NCA:7 ordered authorities but did not bind every manager-facing clause to one primary semantic owner.
