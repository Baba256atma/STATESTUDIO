/**
 * APP-3:10 — Executive Intent confidence rules.
 * Deterministic understanding confidence — no AI or business prediction.
 */
export const EXECUTIVE_INTENT_CONFIDENCE_RULES_VERSION = "APP-3/10-RULES-1";
export const CONFIDENCE_RULE_IDS = Object.freeze([
    "RULE_EXTRACTION_COMPLETENESS",
    "RULE_SEMANTIC_COMPLETENESS",
    "RULE_CLASSIFICATION_DETERMINISM",
    "RULE_CONFLICT_IMPACT",
    "RULE_DEPENDENCY_COMPLEXITY",
    "RULE_EVOLUTION_STABILITY",
    "RULE_STATE_INTEGRITY",
    "RULE_STRUCTURAL_CONSISTENCY",
    "RULE_UNKNOWN_INFORMATION",
    "RULE_READINESS",
    "RULE_FUTURE_COMPATIBILITY",
]);
export const CONFIDENCE_FACTOR_WEIGHTS = Object.freeze({
    extraction_completeness: 0.14,
    semantic_completeness: 0.16,
    classification_determinism: 0.1,
    conflict_impact: 0.1,
    dependency_complexity: 0.08,
    evolution_stability: 0.08,
    state_integrity: 0.12,
    structural_consistency: 0.08,
    unknown_information: 0.06,
    readiness: 0.05,
    future_compatibility: 0.03,
});
export const CONFIDENCE_LEVEL_THRESHOLDS = Object.freeze([
    Object.freeze({ level: "very_high", minimum: 90 }),
    Object.freeze({ level: "high", minimum: 75 }),
    Object.freeze({ level: "medium", minimum: 55 }),
    Object.freeze({ level: "low", minimum: 35 }),
    Object.freeze({ level: "very_low", minimum: 15 }),
]);
function clampScore(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}
function deterministicId(prefix, payload) {
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}
function buildFactor(input) {
    const rawScore = clampScore(input.rawScore);
    const weightedScore = clampScore(rawScore * input.weight);
    return Object.freeze({
        factorId: deterministicId("confidence-factor", input.factorKey),
        factorKey: input.factorKey,
        factorName: input.factorName,
        rawScore,
        weight: input.weight,
        weightedScore,
        diagnostic: input.diagnostic,
        explanation: input.explanation,
        contribution: weightedScore,
        blocking: input.blocking,
        futureCompatible: true,
        readOnly: true,
    });
}
export function scoreExtractionCompleteness(extraction) {
    let raw = 0;
    let diagnostic = "missing_information";
    let explanation = "Extraction result is unavailable.";
    let blocking = true;
    if (extraction) {
        blocking = false;
        if (extraction.status === "success" && extraction.primaryIntent)
            raw = 100;
        else if (extraction.status === "partial" && extraction.primaryIntent)
            raw = 65;
        else if (extraction.status === "failed")
            raw = 20;
        else
            raw = 40;
        diagnostic =
            extraction.status === "success"
                ? "confidence_high"
                : extraction.status === "partial"
                    ? "extraction_incomplete"
                    : "missing_information";
        explanation = `Extraction status is ${extraction.status}.`;
        if (!extraction.primaryIntent) {
            raw = Math.min(raw, 25);
            blocking = true;
            diagnostic = "missing_information";
        }
    }
    return buildFactor({
        factorKey: "extraction_completeness",
        factorName: "Extraction Completeness",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.extraction_completeness,
        diagnostic,
        explanation,
        blocking,
    });
}
export function scoreSemanticCompleteness(semanticModel) {
    let raw = 0;
    let diagnostic = "missing_information";
    let explanation = "Semantic model is unavailable.";
    let blocking = true;
    if (semanticModel) {
        blocking = false;
        raw = 100;
        if (semanticModel.flags.incompleteObjective)
            raw -= 35;
        if (semanticModel.flags.missingTarget)
            raw -= 20;
        if (semanticModel.flags.missingMeasure)
            raw -= 15;
        if (semanticModel.flags.requiresClarification)
            raw -= 10;
        if (semanticModel.unknowns.length > 0)
            raw -= Math.min(25, semanticModel.unknowns.length * 5);
        if (!semanticModel.primaryGoal) {
            raw = 15;
            blocking = true;
        }
        diagnostic = raw >= 75 ? "confidence_high" : raw >= 45 ? "semantic_incomplete" : "missing_information";
        explanation = `Semantic model has ${semanticModel.unknowns.length} unknown(s) and ${semanticModel.goals.length} goal(s).`;
    }
    return buildFactor({
        factorKey: "semantic_completeness",
        factorName: "Semantic Completeness",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.semantic_completeness,
        diagnostic,
        explanation,
        blocking,
    });
}
export function scoreClassificationDeterminism(classification) {
    let raw = 50;
    let diagnostic = "classification_uncertain";
    let explanation = "Classification result is unavailable.";
    let blocking = false;
    if (classification) {
        if (classification.status === "classified" && classification.primaryClass)
            raw = 100;
        else if (classification.status === "partial")
            raw = 60;
        else if (classification.status === "unknown")
            raw = 25;
        else
            raw = 40;
        if (classification.flags.customClassification)
            raw -= 15;
        if (classification.flags.requiresManualReview)
            raw -= 10;
        if (!classification.flags.deterministic)
            raw -= 20;
        diagnostic =
            raw >= 75 ? "confidence_high" : raw >= 45 ? "classification_uncertain" : "missing_information";
        explanation = `Classification status is ${classification.status} with ${classification.allClasses.length} class(es).`;
        blocking = !classification.primaryClass;
    }
    return buildFactor({
        factorKey: "classification_determinism",
        factorName: "Classification Determinism",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.classification_determinism,
        diagnostic,
        explanation,
        blocking,
    });
}
export function scoreConflictImpact(conflict) {
    let raw = 85;
    let diagnostic = "confidence_medium";
    let explanation = "No conflict analysis provided; neutral conflict impact assumed.";
    let blocking = false;
    if (conflict) {
        if (!conflict.flags.hasConflict) {
            raw = 100;
            diagnostic = "confidence_high";
            explanation = "No executive intent conflicts detected.";
        }
        else {
            raw = 100 - Math.min(70, conflict.conflicts.length * 12);
            if (conflict.flags.duplicateIntent)
                raw -= 15;
            if (conflict.flags.requiresExecutiveReview)
                raw -= 10;
            if (conflict.summary.highestSeverity === "critical")
                raw -= 20;
            diagnostic = "conflict_present";
            explanation = `${conflict.conflicts.length} conflict(s) affect understanding confidence.`;
            blocking = conflict.flags.requiresExecutiveReview;
        }
    }
    return buildFactor({
        factorKey: "conflict_impact",
        factorName: "Conflict Impact",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.conflict_impact,
        diagnostic,
        explanation,
        blocking,
    });
}
export function scoreDependencyComplexity(dependency) {
    let raw = 85;
    let diagnostic = "confidence_medium";
    let explanation = "No dependency analysis provided; neutral dependency complexity assumed.";
    let blocking = false;
    if (dependency) {
        if (dependency.flags.independentIntent || !dependency.flags.hasDependencies) {
            raw = 100;
            explanation = "Intent dependencies are independent or absent.";
        }
        else {
            raw = 100 - Math.min(50, dependency.dependencies.length * 8);
            if (dependency.flags.circularDependency)
                raw -= 25;
            if (dependency.flags.requiresPrerequisite)
                raw -= 10;
            diagnostic = "dependency_complex";
            explanation = `${dependency.dependencies.length} dependency relationship(s) increase complexity.`;
            blocking = dependency.flags.circularDependency;
        }
    }
    return buildFactor({
        factorKey: "dependency_complexity",
        factorName: "Dependency Complexity",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.dependency_complexity,
        diagnostic,
        explanation,
        blocking,
    });
}
export function scoreEvolutionStability(evolution) {
    let raw = 85;
    let diagnostic = "confidence_medium";
    let explanation = "No evolution analysis provided; neutral stability assumed.";
    let blocking = false;
    if (evolution) {
        if (evolution.status === "broken") {
            raw = 20;
            diagnostic = "unstable_evolution";
            explanation = "Broken lineage reduces evolution stability confidence.";
            blocking = true;
        }
        else if (evolution.status === "unknown") {
            raw = 40;
            diagnostic = "unstable_evolution";
            explanation = "Unknown evolution history.";
        }
        else if (evolution.flags.rootIntent ||
            (evolution.flags.hasHistory && evolution.timeline.events.length <= 3 && !evolution.flags.superseded)) {
            raw = 95;
            diagnostic = "confidence_high";
            explanation = "Evolution lineage is stable.";
        }
        else if (evolution.timeline.events.length > 5) {
            raw = 55;
            diagnostic = "unstable_evolution";
            explanation = "Rapid evolution history detected.";
        }
        else {
            raw = 80;
            explanation = "Evolution history is moderately stable.";
        }
    }
    return buildFactor({
        factorKey: "evolution_stability",
        factorName: "Evolution Stability",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.evolution_stability,
        diagnostic,
        explanation,
        blocking,
    });
}
export function scoreStateIntegrity(state) {
    let raw = 50;
    let diagnostic = "state_integrity_warning";
    let explanation = "State resolution result is unavailable.";
    let blocking = false;
    if (state) {
        if (state.structuralHealth === "healthy")
            raw = 100;
        else if (state.structuralHealth === "warning")
            raw = 70;
        else if (state.structuralHealth === "invalid")
            raw = 30;
        else
            raw = 45;
        if (state.state.flags.isBlocked)
            raw -= 15;
        if (!state.state.flags.isStructurallyValid) {
            raw = Math.min(raw, 35);
            blocking = true;
        }
        diagnostic = raw >= 75 ? "confidence_high" : "state_integrity_warning";
        explanation = `Structural health is ${state.structuralHealth}.`;
    }
    return buildFactor({
        factorKey: "state_integrity",
        factorName: "State Integrity",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.state_integrity,
        diagnostic,
        explanation,
        blocking,
    });
}
export function scoreStructuralConsistency(input) {
    let raw = 100;
    let blocking = false;
    const issues = [];
    if (input.extraction?.primaryIntent && input.semanticModel) {
        if (input.extraction.primaryIntent.workspaceId !== input.semanticModel.workspaceId) {
            issues.push("workspace mismatch");
            raw -= 30;
        }
    }
    if (input.semanticModel && input.classification) {
        if (input.semanticModel.modelId !== input.classification.semanticModelId) {
            issues.push("semantic/classification id mismatch");
            raw -= 20;
        }
    }
    if (input.state && input.extraction?.primaryIntent) {
        if (input.state.intentId !== input.extraction.primaryIntent.intentId) {
            issues.push("state/intent id mismatch");
            raw -= 25;
            blocking = true;
        }
    }
    if (!input.extraction && !input.semanticModel) {
        raw = 0;
        blocking = true;
        issues.push("no pipeline artifacts");
    }
    return buildFactor({
        factorKey: "structural_consistency",
        factorName: "Structural Consistency",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.structural_consistency,
        diagnostic: raw >= 75 ? "confidence_high" : "missing_information",
        explanation: issues.length > 0 ? `Structural issues: ${issues.join(", ")}.` : "Pipeline artifacts are consistent.",
        blocking,
    });
}
export function scoreUnknownInformation(semanticModel) {
    const unknownCount = semanticModel?.unknowns.length ?? 0;
    const raw = clampScore(100 - unknownCount * 12);
    return buildFactor({
        factorKey: "unknown_information",
        factorName: "Unknown Information",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.unknown_information,
        diagnostic: unknownCount === 0 ? "confidence_high" : "missing_information",
        explanation: `${unknownCount} explicit unknown(s) reduce understanding confidence.`,
        blocking: unknownCount >= 5,
    });
}
export function scoreReadiness(input) {
    let raw = 0;
    let blocking = true;
    const semanticReady = Boolean(input.semanticModel?.primaryGoal && !input.semanticModel.flags.incompleteObjective);
    const classified = input.classification?.status === "classified";
    const stateReady = input.state?.state.flags.isReady ?? false;
    const noBlockingConflict = !(input.conflict?.flags.requiresExecutiveReview ?? false);
    raw =
        (semanticReady ? 40 : 0) +
            (classified ? 25 : 0) +
            (stateReady ? 20 : 0) +
            (noBlockingConflict ? 15 : 0);
    blocking = !(semanticReady && classified && noBlockingConflict);
    return buildFactor({
        factorKey: "readiness",
        factorName: "Readiness",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.readiness,
        diagnostic: raw >= 75 ? "ready_for_reasoning" : "requires_clarification",
        explanation: blocking
            ? "Intent is not ready for downstream executive reasoning."
            : "Intent is ready for downstream executive reasoning.",
        blocking,
    });
}
export function scoreFutureCompatibility(semanticModel, classification) {
    const semanticFuture = semanticModel?.flags.futureCompatible ?? false;
    const classificationFuture = classification?.flags.futureCompatible ?? false;
    const raw = semanticFuture && classificationFuture ? 100 : semanticFuture || classificationFuture ? 75 : 50;
    return buildFactor({
        factorKey: "future_compatibility",
        factorName: "Future Compatibility",
        rawScore: raw,
        weight: CONFIDENCE_FACTOR_WEIGHTS.future_compatibility,
        diagnostic: "confidence_high",
        explanation: "Future compatibility flags are present on pipeline artifacts.",
        blocking: false,
    });
}
export function resolveConfidenceFactors(input) {
    return Object.freeze([
        scoreExtractionCompleteness(input.extraction),
        scoreSemanticCompleteness(input.semanticModel),
        scoreClassificationDeterminism(input.classification),
        scoreConflictImpact(input.conflict),
        scoreDependencyComplexity(input.dependency),
        scoreEvolutionStability(input.evolution),
        scoreStateIntegrity(input.state),
        scoreStructuralConsistency(input),
        scoreUnknownInformation(input.semanticModel),
        scoreReadiness(input),
        scoreFutureCompatibility(input.semanticModel, input.classification),
    ]);
}
export function resolveAggregateScore(factors) {
    const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
    if (totalWeight <= 0)
        return 0;
    const weighted = factors.reduce((sum, factor) => sum + factor.rawScore * factor.weight, 0) / totalWeight;
    return clampScore(weighted);
}
export function resolveConfidenceLevel(score) {
    for (const threshold of CONFIDENCE_LEVEL_THRESHOLDS) {
        if (score >= threshold.minimum)
            return threshold.level;
    }
    return "unknown";
}
export function collectConfidenceRulesApplied(factors) {
    return Object.freeze([...CONFIDENCE_RULE_IDS]);
}
