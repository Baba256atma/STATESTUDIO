# NXA:5-FIX3D-DIAG — Manager-Facing Numeric Precision & Internal-Language Leakage

## Verdict

**NXA:5-FIX3D-DIAG = COMPLETE**

- No Fix was implemented
- NXA:6 was not started
- Production files modified: **0**
- Test files modified: **0**
- Previous certifications were not recertified, revoked, or silently changed (NXA:5 / FIX1 / FIX2 / NXA:6-PREP remain as previously certified; FIX3A–C remain diagnosis-only and unimplemented)

This is **not** NXA:5-FIX3D CERTIFIED and **not** NXA:5-FIX3 CERTIFIED.

---

## Exact reproduction

**Utterance:** `Continue reviewing Customer`

**Required pre-turn state (proven, not inferred from the string alone):**

| Field | Value |
| --- | --- |
| Active/focused object | `obj-customer` / Customer |
| Active collection | none |
| Previous turn | `focus Customer` (or Stage focus) |
| Dialogue/journey (CC:5) | `CONTINUE_TOPIC/REALITY/INVESTIGATING` after focus |
| Customer facts | `satisfactionScore` = **4.2** `score`; `maximumSatisfactionScore` = **5** `score` |
| KPI source | `kpi.customer.satisfaction-index`, `score-percent`, `(left/right)*100` |
| Stored KPI | IEEE **number** `84.00000000000001` (not `0.84`, not a string) |
| Units | KPI `%`; facts `score` |
| Data Reality | Dataset A `nexora.executive-operations.demo.baseline` |
| P0 executive state | `attention` (band 75–85 exclusive of 85) |
| P1 Advisor state | `watch` |
| Advisor response mode | `standard` |
| Presentation density that **shows** the dump | `report` (minimum hides P1:5 summary) |
| Stage effect of the chat utterance | DIR `FOCUS_OBJECT` / already focused |

**P1:5 summary (exact match to the observed Advisor report):**

Customer Performance Requires Attention Customer requires executive attention. Customer Satisfaction Index is 84.00000000000001%. Customer executive state is attention. Customer maximumSatisfactionScore raw fact = 5 score. Customer performance is below the preferred operating range and may require investigation. Investigate Customer watch conditions.

**CC:5 chat is a different surface:** isolated executor `Focused on Customer.`; live after already focused `Already on Customer.` IEEE/`raw fact` do **not** appear in the chat bubble.

**Live `/executive`:** after focus Customer + UI **Report** presentation, Advisor rationale equals the P1:5 dump. Page errors: **0**.

---

## Per-defect diagnosis

### Numeric precision (`84.00000000000001%`)

- **Verdict:** REPRODUCED  
- **Impact:** NUMERIC_PRESENTATION_DEFECT  
- **Canonical source:** `(4.2/5)*100` in `kpiComputation` (`score-percent`). Arithmetic IEEE residue. Source facts `4.2` and `5` are clean.  
- **Path:** snapshot `kpi.value` → P1:2 evidence.value (unformatted) **and** evidence.summary (`Customer Satisfaction Index = 84%` via private `formatDeterministicNumber`) → P1:5 KPI `formatEvidenceText`: `` `${label} is ${String(value)}${unit}.` `` → P2:4 overlay rationale.  
- **First divergence:** P1:5 KPI interpolation, **not** JSON serialization and **not** percent conversion (conversion is `*100` at computation). Artifact introduced by **IEEE arithmetic** at computation and **revealed** by `String()` at presentation.  
- **Owner:** P1:5 `formatEvidenceText`.  
- **Existing formatter?** Yes, private P1:2 `toFixed(4)`+strip zeros **would** emit `84` for this value and is **already used** on `evidence.summary`. Stage `formatCanonicalStageKpiValue` uses `toFixed(1)` → `84.0%` and would **mis-round** `84.05` → `84.1`. Domain KPI `precision` is **not** attached to Data Reality demo KPIs. Confidence/currency helpers exist on **other** products and are not on this path.  
- **Fix surface:** manager-facing composition only; **do not** change canonical `84.00000000000001`. Smallest: P1:5 consume P1:2 (or one elevated) formatter.  
- **Too-early formatter risk:** rounding inside `kpiComputation` would change thresholds, comparisons, and tests that assert exact `(4.2/5)*100`. Stage `toFixed(1)` as a global policy would drop meaningful hundredths.

### Internal field name (`maximumSatisfactionScore`)

- **Verdict:** REPRODUCED  
- **Impact:** INTERNAL_LABEL_LEAK  
- **Source:** `NexoraBusinessFact.metricKey`  
- **Path:** P1:2 `buildBusinessFactEvidence` `` `${displayName} ${fact.metricKey} raw fact = …` `` → P1:5 business-fact `ensureSentence(summary)`  
- **First divergence:** P1:2 fact template ignores existing CSV label `Maximum Satisfaction Score`  
- **Owner:** P1:2  
- **Do not** Customer-hard-code; **do not** create a second label registry. CamelCase split is unsafe as sole authority.

### Internal terminology (`raw fact`, `executive state is attention`, `watch conditions`)

- **Verdict:** REPRODUCED  
- **Impact:** ARCHITECTURE_LANGUAGE_LEAK  
- **`raw fact`:** P1:2 business-fact template. Not in NCA:6 / FINAL:6.4 leak lists. Not allowed as manager-facing contract language (P1:5 principle “Executive Meaning before Technical Detail” is not enforced). Permitted in developer diagnostics only by practice, not a separate diagnostic mode flag on this path.  
- **`attention`:** P0 enum interpolated in P1:2 executive-state evidence; P1:5 turns `=` into `is`. Advisor state is `watch`, not `attention` — two vocabularies leak.  
- **`watch`:** P1:4 `guidanceTitle` interpolates Advisor state. NCA:6 would rewrite `\bwatch\b` → `worth monitoring` **if** this string were locked through `applyNca6StrategyToResponse`; P2:4 overlay **bypasses** NCA:6. Live dump still contains `watch conditions`.  
- **First layers:** P1:2 templates (`raw fact`, executive state); P1:4 title (`watch conditions`).  
- **Honest provenance:** replacing `raw fact` must still mark the sentence as a recorded fact, not an inference.

### Unit wording (`5 score`)

- **Verdict:** REPRODUCED  
- **Impact:** UNIT_PRESENTATION_DEFECT  
- **Source:** `fact.unit` `score` appended after formatted `5`  
- **First divergence:** P1:2 `unitSuffix`  
- **Owner:** P1:2 (same composer as field-name/`raw fact`)

### Repetition

- **Verdict:** REPRODUCED  
- **Impact:** RESPONSE_REDUNDANCY  
- **Sections:** headline `Requires Attention`; situation `requires executive attention`; evidence `executive state is attention`; meaning `below the preferred operating range…`; guidance investigate. Title is **not** a mistaken concat of title+body as one field — P1:5 **intentionally** joins sections with spaces.  
- **Dedupe policy:** declared (“Conciseness before Narrative”), **not implemented**. Not NXA:5 verbose diagnostic mode. Live **report** density, not a debug flag.  
- **Can drop repetition without dropping KPI/fact evidence:** yes.

### Vague recommendation

- **Verdict:** REPRODUCED  
- **Impact:** ADVISORY_QUALITY_GAP (also language leak via `watch`)  
- **Source:** generic P1:4 investigate title  
- **Does not** name an evidence gap or concrete condition. Production has a special-case title; Customer does not.

---

## Numeric examples (current vs recommended **illustration only**)

Not implemented policy.

| Input / stored | P1:5 `String`+`%` (current KPI path) | P1:2 helper replica | Stage `toFixed(1)` | User / diagnosis illustration |
| --- | --- | --- | --- | --- |
| `84.00000000000001` | `84.00000000000001%` | `84` | `84.0%` | `84%` |
| `84.05000000000001` | `84.05000000000001%` | `84.05` | `84.1%` | `84.05%` |
| `84.50000000000001` | `84.50000000000001%` | `84.5` | `84.5%` | `84.5%` |
| `84.56789` (meaningful extra decimals) | `84.56789%` | `84.5679` (4-decimal cap) | `84.6%` | **policy missing** — do not assume 2 decimals |
| `-2.5000000000000004` | `-2.5000000000000004%` | `-2.5` | `-2.5%` | strip IEEE; keep sign |
| `0.00001` | `0.00001%` | `0` (**collapses small non-zero**) | `0.0%` | **policy missing** |
| `0` / `100` integers | `0%` / `100%` | `0` / `100` | `0.0%` / `100.0%` | omit unnecessary decimals |
| score `5` | n/a (fact path uses P1:2 → `5`) | `5` | `5.0 score` if Stage | keep integer score; unit language via D2 |
| currency | **outside this Customer report** | Dataset A has USD facts (`currentRevenue` 8400000) unused here | Revenue fixture `$8.4M` is fixture presentation | Do not invent a currency policy in FIX3D1 from this report alone |
| `NaN` / `Infinity` | `String` would emit `NaN`/`Infinity` | helper assumes finite | Stage helper assumes finite | KPI compute currently rejects non-finite; still guard display |

Distinctions: IEEE-noise removal ≠ semantic rounding ≠ trailing-zero strip ≠ unit conversion ≠ locale ≠ abbreviation.

---

## Fix plan

FIX3D is **multiple Fixes:** D1 numeric (P1:5), D2 evidence language/units (P1:2, optional D2b executive-state enum), D3 guidance titles (P1:4), D4 section redundancy (P1:5 join). Do not merge with FIX3A/B/C.

Focused tests per partition; one **NXA:5-FIX3** Funnel L4 milestone **after** A–D Fixes, **before** NXA:6.

---

## Non-binding illustration (not a contract)

A manager-facing report **might** later read as a short attention headline, one situation sentence, `Customer Satisfaction Index is 84%`, a labeled maximum-score **fact**, and an investigate next step that names a condition rather than `watch`. That sentence is **not** production copy and **not** the Fix contract.

---

## Gates

| Gate | Result |
| --- | --- |
| Reproduction command | `cd frontend && ./node_modules/.bin/tsx artifacts/nxa5/NXA-5-FIX3D-DIAG/reproduce-nxa5-fix3d-diag.ts` — P1:5 exact match |
| Harness | `node scripts/nxa-conversation-harness.mjs` — 10/10 |
| Funnel | `npm run nxa:funnel -- --level 1` — pass (L4 **not** run) |
| Live | `node artifacts/nxa5/NXA-5-FIX3D-DIAG/live-nxa5-fix3d-diag.mjs` — dump in Report density; chat is navigation confirm; 0 page errors |
| Artifacts | `frontend/artifacts/nxa5/NXA-5-FIX3D-DIAG/` |
| Production / test files modified | 0 / 0 |
| Required tasks | started 4, passed 4, failed 0, running 0, uninspected 0 |
| Nonessential | existing `npm run dev` left running |

`nxaConversation` was on for the reproduce script and returned to default-off.
