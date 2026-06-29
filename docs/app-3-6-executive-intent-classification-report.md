# APP-3:6 Executive Intent Classification Engine Report

**Project:** Nexora Type-C  
**Phase:** APP-3:6  
**Title:** Executive Intent Classification Engine  
**Status:** PASS

**Tags:** `[APP3_6]` `[EXECUTIVE_INTENT_CLASSIFICATION]` `[TAXONOMY_ENGINE]` `[MULTI_LABEL_CLASSIFICATION]` `[READ_ONLY]` `[ARCHITECTURE_SAFE]` `[BACKWARD_COMPATIBLE]`

---

## Architecture Summary

APP-3:6 classifies immutable `ExecutiveIntentSemanticModel` outputs from APP-3:5 into canonical executive taxonomy classes. The engine answers **“What kind of Executive Intent is this?”** through deterministic, rule-based multi-label classification.

No confidence scoring, recommendations, conflict detection, scenario generation, or persistence is implemented.

```
ExecutiveIntentSemanticModel (APP-3:5)
        ↓
Rule-based taxonomy classification (APP-3:6)
        ↓
IntentClassificationResult (immutable)
        ↓
Future engines (APP-3:7+)
```

---

## Files Created

| File | Purpose |
|------|---------|
| `executiveIntentClassificationTypes.ts` | Classification result, class, flag, and metadata types |
| `executiveIntentClassificationTaxonomy.ts` | 18 canonical taxonomy classes and deterministic ordering |
| `executiveIntentClassificationRules.ts` | Dimension, action, goal, and keyword mapping rules |
| `executiveIntentClassificationDiagnostics.ts` | 13 diagnostic codes |
| `executiveIntentClassificationExamples.ts` | 12 canonical classification examples |
| `executiveIntentClassificationEngine.ts` | Main classification engine and public APIs |
| `executiveIntentClassificationEngine.test.ts` | 29 certification tests |
| `docs/app-3-6-executive-intent-classification-report.md` | Phase report |

APP-3:1 through APP-3:5 and all other certified modules were **not modified**. APP-3:3 is not yet present in the codebase.

---

## Public APIs

| API | Description |
|-----|-------------|
| `classifyExecutiveIntent(model, timestamp?)` | Primary classification entry point |
| `classifySemanticModel(model, timestamp?)` | Alias for classification |
| `resolvePrimaryClassification(model, candidates?)` | Resolve primary taxonomy class |
| `resolveSecondaryClassifications(model, primary, candidates?)` | Resolve secondary classes |
| `resolveClassificationFlags(input)` | Derive multi-class and composite flags |
| `validateClassification(result)` | Structural validation |
| `buildClassificationSummary(input)` | Human-readable summary |
| `buildClassificationExample(exampleId, ...)` | Canonical example classification |
| `buildClassificationProbe(timestamp?)` | Certification probe |
| `ExecutiveIntentClassificationEngine` | Engine facade |

---

## Taxonomy

18 canonical classes in deterministic order:

| Class | Group |
|-------|-------|
| Strategic | strategic |
| Financial | business |
| Operational | operational |
| Growth | strategic |
| Transformation | transformation |
| Technology | transformation |
| Risk | risk |
| Compliance | compliance |
| Customer | business |
| People | resource |
| Innovation | innovation |
| Resource | resource |
| Supply Chain | operational |
| Marketing | business |
| Sales | business |
| Governance | compliance |
| Sustainability | reserved |
| Custom | reserved |

Taxonomy version: `APP-3/6-TAXONOMY-1`

---

## Classification Rules

| Rule ID | Description |
|---------|-------------|
| `RULE_DIMENSION_PRIMARY` | Semantic business dimension → primary class |
| `RULE_ACTION_SECONDARY` | Action type → secondary class (transform → transformation, expand → growth) |
| `RULE_GOAL_MULTI_LABEL` | Additional goals → secondary classes |
| `RULE_KEYWORD_TARGET` | Target and known-information keywords → classes |
| `RULE_KEYWORD_GOAL` | Goal label keywords → classes |
| `RULE_COMPOSITE_INTENT` | Multiple goals → composite intent flag |
| `RULE_HYBRID_INTENT` | Cross-group classes → hybrid intent flag |
| `RULE_CUSTOM_FALLBACK` | Unmapped signals → custom class |

Primary class selection uses rule priority with deterministic tie-breaking via taxonomy order.

---

## Classification Flags

| Flag | Meaning |
|------|---------|
| `multiClass` | More than one taxonomy class assigned |
| `compositeIntent` | Multiple goals or multi-class composite |
| `hybridIntent` | Classes span multiple taxonomy groups |
| `customClassification` | Custom class required or assigned |
| `requiresManualReview` | Incomplete or custom classification |
| `futureCompatible` | Reserved extension placeholder |
| `readOnly` | Immutable output marker |
| `deterministic` | Deterministic classification marker |

---

## Diagnostics Vocabulary

13 diagnostic codes:

| Code | Severity |
|------|----------|
| `classification_success` | info |
| `no_primary_class` | error |
| `multiple_primary_classes` | warning |
| `unknown_business_dimension` | warning |
| `unsupported_action_type` | warning |
| `custom_class_required` | warning |
| `classification_incomplete` | error |
| `invalid_semantic_model` | error |
| `multi_label_classification` | info |
| `composite_intent_detected` | info |
| `hybrid_intent_detected` | info |
| `classification_requires_review` | warning |
| `reserved_future_diagnostic` | info |

---

## Certification Results

| Suite | Tests | Result |
|-------|-------|--------|
| APP-3:1 Contract | 14 | PASS |
| APP-3:2 State Engine | 18 | PASS |
| APP-3:4 Extraction Engine | 21 | PASS |
| APP-3:5 Semantic Model | 20 | PASS |
| APP-3:6 Classification Engine | 29 | PASS |
| **Total** | **102** | **PASS** |

Coverage includes: financial, operational, risk, compliance, technology, growth, transformation, innovation, customer, people, hiring/resource, governance, sales/marketing/supply chain taxonomy, composite and hybrid multi-label intents, unknown classifications, deterministic ordering, read-only verification, and regression with APP-3:1, APP-3:2, APP-3:4, and APP-3:5.

---

## Future Compatibility

- `IntentClassificationFutureExtension` placeholder reserved for APP-3:7 (confidence, recommendation, conflict bindings).
- `futureCompatible` flag set on all results.
- Taxonomy includes reserved sustainability and custom classes.
- Engine version `APP-3/6` tracked in metadata.

---

## Known Limitations

1. **Classification depends on semantic model quality** — incomplete APP-3:4 extractions yield custom or partial classifications.
2. **APP-3:3 Context Engine** — not present; context-aware classification deferred.
3. **Sales/marketing extraction gap** — keyword rules apply when semantic goals exist; some natural-language inputs fail extraction before classification.
4. **Same-dimension multi-goal intents** — composite flag set, but taxonomy may remain single-class (e.g., profit + cost both financial).

---

## Next Phase (APP-3:7)

APP-3:7 should consume `IntentClassificationResult` for:

- Confidence estimation
- Intent quality assessment
- Conflict and dependency analysis
- Priority and recommendation layers

APP-3:6 outputs are the canonical taxonomy contract for all downstream APP-3 intelligence phases.
