# APP-3:7 Executive Intent Conflict Detection Engine Report

**Project:** Nexora Type-C  
**Phase:** APP-3:7  
**Title:** Executive Intent Conflict Detection Engine  
**Status:** PASS

**Tags:** `[APP3_7]` `[EXECUTIVE_INTENT_CONFLICT]` `[CONFLICT_DETECTION]` `[READ_ONLY]` `[ARCHITECTURE_SAFE]` `[BACKWARD_COMPATIBLE]`

---

## Architecture Summary

APP-3:7 detects conflicts among executive intents by comparing immutable APP-3:5 semantic models, APP-3:6 classifications, and APP-3:2 state results. The engine identifies, classifies, and explains conflicts — it does **not** resolve conflicts, recommend actions, prioritize intents, or estimate confidence.

```
IntentConflictAnalysisInput[] (semantic + classification + state)
        ↓
Pairwise rule-based conflict detection (APP-3:7)
        ↓
IntentConflictResult + IntentConflictMatrix (immutable)
        ↓
Future engines (APP-3:8+)
```

---

## Files Created

| File | Purpose |
|------|---------|
| `executiveIntentConflictTypes.ts` | Conflict result, pair, matrix, flag, and metadata types |
| `executiveIntentConflictRules.ts` | 17 deterministic conflict detection rules |
| `executiveIntentConflictDiagnostics.ts` | 17 diagnostic codes |
| `executiveIntentConflictExamples.ts` | 10 canonical conflict examples |
| `executiveIntentConflictEngine.ts` | Main conflict detection engine and public APIs |
| `executiveIntentConflictEngine.test.ts` | 22 certification tests |
| `docs/app-3-7-executive-intent-conflict-report.md` | Phase report |

APP-3:1 through APP-3:6 and all other certified modules were **not modified**. APP-3:3 is not yet present in the codebase.

---

## Public APIs

| API | Description |
|-----|-------------|
| `detectIntentConflicts(request)` | Batch workspace intent set analysis |
| `detectIntentConflict(left, right, timestamp?)` | Pairwise conflict detection |
| `buildConflictMatrix(input)` | Build pairwise conflict matrix |
| `resolveConflictCategory(conflict)` | Resolve conflict category |
| `resolveConflictSeverity(conflict)` | Resolve conflict severity |
| `resolveConflictFlags(input)` | Derive conflict flags |
| `validateConflictResult(result)` | Structural validation |
| `buildConflictSummary(input)` | Human-readable summary |
| `buildConflictExample(exampleId, ...)` | Canonical example detection |
| `buildConflictProbe(timestamp?)` | Certification probe |
| `ExecutiveIntentConflictEngine` | Engine facade |

---

## Conflict Categories

17 categories supported:

`financial`, `resource`, `time`, `strategic`, `operational`, `technology`, `compliance`, `customer`, `people`, `priority`, `scope`, `target`, `constraint`, `assumption`, `duplicate`, `unknown`, `custom`

---

## Conflict Rules

| Rule ID | Detects |
|---------|---------|
| `RULE_DUPLICATE_INTENT` | Same goal, action, and target |
| `RULE_TARGET_SHARED` | Shared target with distinct goals |
| `RULE_GOAL_CONTRADICTION` | Opposing actions on same target |
| `RULE_ACTION_OPPOSITION` | Opposing actions on same measure |
| `RULE_RESOURCE_ACTOR_OVERLAP` | Shared explicit actors |
| `RULE_RESOURCE_KEYWORD` | Budget/cost resource tension |
| `RULE_TIME_OVERLAP` | Shared time horizon |
| `RULE_TIME_SAME_HORIZON` | Same horizon with overlapping targets |
| `RULE_CONSTRAINT_OPPOSITION` | Opposing constraint markers |
| `RULE_ASSUMPTION_OPPOSITION` | Incompatible assumptions |
| `RULE_CLASSIFICATION_TENSION` | Different classes, opposing actions |
| `RULE_GROWTH_VS_COST` | Growth vs cost reduction |
| `RULE_TECHNOLOGY_REPLACEMENT` | Technology replacement overlap |
| `RULE_COMPLIANCE_TENSION` | Compliance action divergence |
| `RULE_STATE_BLOCKED` | Both intents blocked |
| `RULE_UNKNOWN_COMPARISON` | Incomplete semantic data |
| `RULE_COMPATIBLE_INTENTS` | No conflict (implicit clear) |

---

## Conflict Matrix

| Capability | Support |
|------------|---------|
| Intent A ↔ Intent B | ✅ |
| Intent A ↔ Multiple Intents | ✅ |
| Workspace Intent Set | ✅ |
| Batch Analysis | ✅ |
| Deterministic pair ordering | ✅ |
| Pair index by semantic model ID | ✅ |

---

## Severity Levels

7 levels: `none`, `informational`, `low`, `medium`, `high`, `critical`, `unknown`

Conflicts sorted by severity (descending), then category, then conflict ID.

---

## Conflict Flags

| Flag | Meaning |
|------|---------|
| `hasConflict` | One or more conflicts detected |
| `multipleConflicts` | More than one conflict |
| `duplicateIntent` | Duplicate intent detected |
| `sharedResources` | Resource/budget overlap |
| `sharedTargets` | Target entity overlap |
| `timelineOverlap` | Time horizon overlap |
| `requiresExecutiveReview` | High/critical/unknown severity |
| `futureCompatible` | Reserved extension placeholder |
| `readOnly` | Immutable output marker |
| `deterministic` | Deterministic detection marker |

---

## Diagnostics Vocabulary

17 diagnostic codes including: `no_conflict`, `resource_conflict`, `target_conflict`, `time_conflict`, `classification_conflict`, `duplicate_intent`, `goal_contradiction`, `constraint_conflict`, `assumption_conflict`, `unknown_conflict`, `multiple_conflicts`, `conflict_detection_success`, etc.

---

## Certification Results

| Suite | Tests | Result |
|-------|-------|--------|
| APP-3:1 Contract | 14 | PASS |
| APP-3:2 State Engine | 18 | PASS |
| APP-3:4 Extraction | 21 | PASS |
| APP-3:5 Semantic Model | 20 | PASS |
| APP-3:6 Classification | 29 | PASS |
| APP-3:7 Conflict Detection | 22 | PASS |
| **Total** | **124** | **PASS** |

---

## Future Compatibility

- `IntentConflictFutureExtension` placeholder reserved for APP-3:8 (resolution, recommendation, priority bindings).
- `futureCompatible` flag set on all results.
- Diagnostic vocabulary includes reserved future codes.

---

## Known Limitations

1. **Extraction dependency** — incomplete APP-3:4 extractions yield `unknown` comparisons.
2. **APP-3:3 Context Engine** — not present; context-aware conflict detection deferred.
3. **No conflict resolution** — detection only; resolution belongs to APP-3:8+.
4. **Actor overlap** — only detects explicitly named actors from extraction.
5. **Replace verb gap** — "Replace" not in APP-3:4 verb list; examples use "Upgrade" instead.

---

## Next Phase (APP-3:8)

APP-3:8 should consume `IntentConflictResult` for:

- Conflict resolution strategies
- Executive recommendations
- Priority and dependency analysis
- Decision ranking

APP-3:7 outputs are the canonical conflict contract for downstream APP-3 intelligence phases.
