# APP-3:4 Executive Intent Extraction Engine Report

**Project:** Nexora Type-C  
**Phase:** APP-3:4  
**Title:** Executive Intent Extraction Engine  
**Status:** PASS

**Tags:** `[APP3_4]` `[EXECUTIVE_INTENT_EXTRACTION]` `[EXTRACTION_ENGINE]` `[MULTILINGUAL_READY]` `[READ_ONLY]` `[ARCHITECTURE_SAFE]` `[BACKWARD_COMPATIBLE]`

---

## Architecture Summary

APP-3:4 implements the first intelligence phase of the Executive Intent Platform: **structured extraction only**. The engine transforms executive natural-language requests into canonical `ExecutiveIntent` objects defined by APP-3:1, enriched with explicit targets, constraints, assumptions, time references, and evidence.

No recommendations, classification quality scoring, scenario generation, AI inference, or persistence is implemented.

---

## Files Created

| File | Purpose |
|------|---------|
| `executiveIntentExtractionTypes.ts` | Extraction request/result and extracted component types |
| `executiveIntentExtractionDiagnostics.ts` | 16 diagnostic codes |
| `executiveIntentExtractionRules.ts` | Pattern rules and multilingual language adapters |
| `executiveIntentExtractionExamples.ts` | 12 canonical extraction examples |
| `executiveIntentExtractionEngine.ts` | Main extraction engine and public APIs |
| `executiveIntentExtractionEngine.test.ts` | 21 certification tests |
| `docs/app-3-4-executive-intent-extraction-report.md` | Phase report |

APP-3:1, APP-3:2, and all other certified modules were not modified. APP-3:3 is not yet present in the codebase.

---

## Public APIs

| API | Description |
|-----|-------------|
| `extractExecutiveIntent(request)` | Primary extraction entry point |
| `extractExecutiveIntentBatch(requests)` | Batch extraction |
| `extractExecutiveIntentExample(exampleId, ...)` | Canonical example extraction |
| `extractIntentTargets(text, languageCode?)` | Target extraction |
| `extractIntentConstraints(text, languageCode?)` | Constraint extraction |
| `extractIntentAssumptions(text, languageCode?)` | Assumption extraction |
| `extractIntentTimeReferences(text, languageCode?)` | Time horizon extraction |
| `extractIntentEvidence(text, languageCode?)` | Evidence extraction |
| `extractIntentActors(text, languageCode?)` | Named actor extraction |
| `validateExtractionResult(result)` | APP-3:1 shape validation |
| `ExecutiveIntentExtractionEngine` | Engine facade |

---

## Extraction Pipeline

```
IntentExtractionRequest (text + workspace + language)
        ↓
Language adapter normalization
        ↓
Segment split (multi-intent detection)
        ↓
Explicit pattern extraction (verbs, targets, time, constraints, ...)
        ↓
ExecutiveIntent assembly (APP-3:1 contract)
        ↓
Diagnostics + IntentExtractionResult (immutable)
```

---

## Supported Patterns

| Pattern | Rule ID |
|---------|---------|
| Action verbs | RULE_ACTION_VERB |
| Target object keywords | RULE_TARGET_OBJECT |
| Percent / numeric values | RULE_TARGET_VALUE_PERCENT / NUMBER |
| Absolute year / quarter | RULE_TIME_ABSOLUTE_YEAR |
| Relative time phrases | RULE_TIME_RELATIVE |
| Constraint markers | RULE_CONSTRAINT_MARKER |
| Assumption markers | RULE_ASSUMPTION_MARKER |
| Evidence markers | RULE_EVIDENCE_MARKER |
| Explicit priority | RULE_PRIORITY_EXPLICIT |
| Explicit scope | RULE_SCOPE_EXPLICIT |
| Category keywords | RULE_CATEGORY_KEYWORD |
| Multi-intent split | RULE_MULTI_INTENT_SPLIT |
| Conflict markers | RULE_CONFLICT_MARKER |

**Languages:** English (`en`), Spanish (`es`), neutral fallback adapter.

---

## Diagnostics Vocabulary

16 codes including: `intent_not_found`, `multiple_intents_found`, `target_not_specified`, `no_action_verb`, `ambiguous_time_reference`, `unsupported_pattern`, `incomplete_sentence`, `empty_input`, `successful_extraction`, `conflicting_statements`, `nested_intent_detected`, `priority_not_explicit`, `scope_not_explicit`, `category_not_explicit`, `missing_required_field`, `language_adapter_fallback`.

---

## Example Inputs / Outputs

**Input:** `Increase company profit by 20% next year.`

**Output:** `ExecutiveIntent` with category `financial`, action verb `increase`, target value `20%`, time horizon `next year`, scope `enterprise`, status `draft`, diagnostics including `successful_extraction` and `priority_not_explicit`.

**Input:** `Increase profit by 10%. Reduce cost by 5%.`

**Output:** Two `ExecutiveIntent` records + `multiple_intents_found` diagnostic.

**Input:** `Increase by 20%`

**Output:** Failed extraction + `target_not_specified`.

---

## Certification Results

```
53/53 tests passing (21 extraction + 18 state + 14 contract)
```

---

## Future Compatibility

Reserved extension placeholder: `IntentExtractionFutureExtension` for classification labels, confidence scores, and ranking hints (APP-3:5+).

Extracted intents validate against APP-3:1 and resolve through APP-3:2 state engine.

---

## Known Limitations

- Rule-based extraction only — no LLM/ML
- Priority defaults to contract placeholder when not explicit (with diagnostic)
- Category resolution uses ordered keyword matching
- APP-3:3 context enrichment not yet wired (module pending)
- Actor extraction limited to explicit role tokens (CEO, CFO, CTO, Board)

---

## Next Phase

**APP-3:5 Executive Intent Classification Engine** — classify extracted intents without modifying APP-3:1 through APP-3:4 contracts.
