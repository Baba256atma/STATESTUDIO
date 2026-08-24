# CORE-INT:1 — Executive Intelligence Capability Audit

Identity: `CORE-INT:1/ExecutiveIntelligenceCapabilityAudit`  
Frozen MVP: `MVP:1/NexoraManagerMVPReleaseBaseline` version **1.2.0** on `/executive`  
Production behavior: **unchanged** (certification artifacts + connectivity tests only)

Governing law: **Nexora Core owns intelligence truth. EXI presents and composes it.** A manager-visible answer is not a Core capability.

This phase did **not** implement CI-1..CI-5, did **not** start EXI:4, did **not** add an LLM, and did **not** redesign `/executive`.

---

## 1. Direct answer

Does Nexora currently have these five intelligence capabilities as **real Core capabilities** on the manager runtime?

| Capability | Core capability today? | Primary status |
|---|---|---|
| Assumption & Uncertainty | **No on `/executive`.** A claim model exists in EI:3 but is not live, and Core does not classify unlabeled claims. | **IMPLEMENTED-NON-LIVE** |
| Causal | **No.** EI:3 can record caller-supplied causal-support kinds. `/executive` shows EXI:2 fixture-link composition. No ranking. | **IMPLEMENTED-NON-LIVE** |
| Constraint | **No.** Constraints are listed from relation kinds / parallel CC:8 fields. No binding. No relief reasoning. | **FRAGMENTED** |
| Priority | **No.** Live behavior is **attention**. EI:4 explainable priority is unused. | **FRAGMENTED** |
| Trade-off | **No on `/executive`.** EI:4 qualitative trade-offs exist and are **not wired**. EXI:3 reads scenario summaries. | **IMPLEMENTED-NON-LIVE** |

None are **FULL-LIVE**. None are **ABSENT** in the entire repository (except quantitative economics, binding constraint, causal ranking, and claim classification, which are absent as *functions*).

---

## 2. EI:1–EI:6 (code, not names)

`frontend/app/lib/nex-mvp` and `frontend/app/executive` **do not import** `frontend/app/lib/executive-intelligence/`. EI:1–EI:6 are real TypeScript integration modules consumed by their own tests, not by the `/executive` NEX-MVP runtime.

### EI:1 — End-to-end integration
- Module: `executiveIntelligenceIntegration.ts`
- Owns: **nothing** (`ownsReality/Issues/Scenarios/Decisions/Executions/Outcomes/Learning/Memory` all false)
- Output: reference-only `ExecutiveIntelligenceTrace`
- Reaches `/executive`: **no**
- Intelligence vs integration: **integration only**

### EI:2 — Strategy & objective
- Module: `strategicIntelligenceIntegration.ts`
- CSF: **MISSING**
- Strategy: **PARTIAL** (BUS-18 metadata)
- OKR/KPI/Risk: **DUPLICATED** stores; `computesPriority: false`
- Reaches `/executive`: **no**

### EI:3 — Problem, risk & opportunity
- Module: `problemRiskOpportunityIntelligence.ts`
- Canonical types: `FACT | ASSUMPTION | PREDICTION | UNKNOWN`, `SemanticConfidence`, causal relationship kinds, `CONSTRAINT_CATEGORIES`
- Writers: `createExecutiveClaim`, `createEvidenceBoundedRelationship`, `createExecutiveConstraintReference`
- Boundary: `infersCausality: false`, `computesPriority: false`, `predicts: false`
- Callers of writers: **EI tests only** (plus EI:4/EI:5 tests)
- Reaches `/executive`: **no**

### EI:4 — Scenario, priority & trade-off
- Module: `scenarioPriorityTradeoffIntelligence.ts`
- `createScenarioPriorityTradeoffTrace` input: EI:1 trace, scenario evaluations (priority factors, qualitative tradeoffs, assumptions, uncertainties, constraints), comparison
- Output: frozen trace with `comparison.preferredAlternativeCandidateId`, `noFakePrecision` (`numericalScore === null`), Advisor projection `recommendation: null`
- Live on `/executive`: **false** (`NEXORA_EXI3_ENRICHMENT_BOUNDARY.ei4LiveOnExecutive`)
- Missing binding: **EI:4 output → (no nex-mvp reader) → `/executive`**

### EI:5 — Decision intelligence
- Module: `executiveDecisionIntelligence.ts`
- Synthesizes recommendation; `recommendationIsDecision: false`
- Marks NBA/Decision Brief **PRESENTATION_ONLY**
- Reaches `/executive`: **no** (live recommend path is NBA/Brief/Advisor/CC:8)

### EI:6 — Execution, outcome & learning
- Module: `executionOutcomeLearningIntelligence.ts`
- Comparison/eligibility only; `infersCausality: false`
- CC:11 not wired on NEX-MVP `/executive`
- APP-4 does **not** feed CI-1..CI-5
- Reaches `/executive`: **no**

---

## 3. Capability findings

### CI-1 Assumption & Uncertainty — IMPLEMENTED-NON-LIVE

**Authority (off-path):** EI:3 `createExecutiveClaim`.

**Fact/assumption/prediction model:** Present as an enum + validation (FACT needs evidence and provenance). **Classification of an unlabeled executive statement: absent.**

**Confidence model:** EI:3 `resolveSemanticConfidence` (`unknown|low|medium|high`) from evidence/provenance/reality overlap — **not live**. Live Advisor uses `evidenceState` (`strong|limited|incomplete|stale|none`). EXI uses a parallel confidence enum. These are **not** one contract.

**Uncertainty propagation:** **Does not survive** Data → Problem → Scenario → Recommendation → Decision as a shared object. Subsystems assign independently. “Evidence limited” copy is presentation, not a Core uncertainty model.

**Assumption intelligence test:** **Fail.** Core cannot receive a claim and determine type from evidence without the caller already passing `type`.

### CI-2 Causal Intelligence — IMPLEMENTED-NON-LIVE

**Authority (off-path):** EI:3 `EvidenceBoundedRelationship` with kinds `observed-relationship | possible-contributor | supported-causal | unknown-cause`. Correlation cannot be stored as `supported-causal`.

**Relationship vs causation:** Nexora **mostly has graph relationships**. `/executive` Stage edges are unlabeled fixtures. EXI:2 honestly says relationship ≠ causation, then still composes “possible contributors.”

**Causal ranking:** **Absent.** EXI:2 sets `primaryContributor` iff **exactly one** inbound contributor edge. That is cardinality, not evidence ranking.

**Causal chain:** EXI:2 `composeRecordedChain` walks fixture links. **Not** a Core writer with per-edge provenance. EI:3 can store one evidenced edge at a time in tests; it does not produce a live chain.

### CI-3 Constraint Intelligence — FRAGMENTED

**Authorities:** EI:3 `ExecutiveConstraintReference` (non-live); Stage `constrained-by` / `blocks`; CC:8 assessment constraint fields; no `/executive` import of dashboard `policyConstraintIntelligence`.

**Binding constraint:** **Absent.** EXI:2 `bindingConstraint` is **always `null`**. “Most severe” is not modeled.

**Constraint relief:** **Absent.** No Core “if relieved, downstream KPI/problem improves” reasoner.

### CI-4 Priority Intelligence — FRAGMENTED

**Authorities (collision):** Stage fixture `attention`, `overviewAttentionItems()` sort by `ATTENTION_RANK` then id, Queue overlay counts, NBA, Advisor, unused EI:4 `resolveExplainablePriority`.

**Attention vs priority:** Live `/executive` answers **notice**. It does **not** answer “address B before A because…” with grounded comparative criteria.

**Priority ranking (live):** Fixture attention order. **Not** Core priority intelligence.

**Priority criteria actually in EI:4 (tests only):** factor dimensions include urgency, time-sensitivity, strategic-relevance, impact, risk-exposure, opportunity-value, constraint-pressure. `numericalScore` is always `null`. Live `/executive` uses **attention enum only**, not that factor set.

### CI-5 Trade-off Intelligence — IMPLEMENTED-NON-LIVE

**Authority (off-path):** EI:4 `ScenarioTradeoff` (gain/sacrifice strings + `evidenceRefs`), comparison, preferred candidate.

**Live `/executive`:** EXI:3 qualitative extraction from **scenario fixture summaries**. Comparable options via `explored-by` parent only.

**Quantitative economics:** **Absent** (no cost/benefit/time/risk-delta/opportunity-cost model on this path).

**Qualitative trade-off:** **Present** as copy (fixtures + EXI:3; EI:4 strings in tests).

**EI:4 live:** **No.**

---

## 4. Strategy / OKR / CSF / Risk

| Concept | Runtime status |
|---|---|
| Strategy | Partially modeled metadata (BUS-18); not `/executive` Stage/Advisor authority |
| OKR | DS-5 workspace store exists; duplicated with BUS; not live Core priority input on `/executive` |
| CSF | **Absent** |
| Risk | DS-6 canonical + Stage objects + CC:8; not unified |
| KPI | Data Reality + duplicated DS-4; MVP manager journey is fixture-led |

Priority cannot be truly strategic on `/executive` today.

---

## 5. Data Reality and learning

| Capability | Grounding on `/executive` |
|---|---|
| Uncertainty | Ungrounded as Core; presentation copy. EI:3 tests can be PARTIALLY GROUNDED via RDI handoff |
| Causal | MODEL/FIXTURE GROUNDED |
| Constraint | MODEL/FIXTURE GROUNDED |
| Priority | MODEL/FIXTURE GROUNDED (attention) |
| Trade-off | MODEL/FIXTURE GROUNDED (summaries) |

APP-4 / EI:6 **does not** feed these five capabilities. Outcome → Learning remains a gap for future confidence/priority.

EI:6 certification tests L/M/N currently **fail** (`promoteEligibleLearningToApp4` does not persist). That is recorded as evidence, not fixed in CORE-INT:1.

---

## 6. Target architecture (recommendation only)

Reuse EI:1–EI:6. **Do not** build five new engines.

Target stack: **EI:3 claims (epistemic)** → **EI:3 graph (causal + constraint)** → **EI:4 priority (≠ attention)** → **EI:4 trade-offs live** → EXI reads.

Four implementation phases: CORE-INT:2 (epistemic contract live) → CORE-INT:3 (causal+constraint graph) → CORE-INT:4 (priority authority) → CORE-INT:5 (EI:4 runtime binding). Then EXI:4 can present Core trade-offs. **Not this phase.**

---

## 7. Gaps by severity

**P0**
- No shared uncertainty/epistemic contract on `/executive`; EXI assigns epistemic state
- EI:4 not live; EXI compensates with summary extraction

**P1**
- No causal ranking; EXI cardinality-as-primary
- No binding constraint; no relief reasoning
- Priority fragmented (attention vs unused ExplainablePriority)
- Recommendation authorities collide (NBA / Brief / Advisor / CC:8 / dead EI:5)

**P2**
- CSF absent; Strategy not live on `/executive`
- No quantitative economics
- Data Reality not grounding EXI cause/constraint/trade-off

**P3**
- APP-4 learning not feeding these capabilities
- CC:11 unwired on NEX-MVP
- Parallel unused intelligence modules (enterprise causality, policy constraint dashboards)

---

## 8. Confirmations

- No CI-1..CI-5 capability implemented in this phase
- EXI:4 not started
- No LLM added
- Frozen MVP identity remains `MVP:1` / `1.2.0`
- No Stage topology change intended or made
