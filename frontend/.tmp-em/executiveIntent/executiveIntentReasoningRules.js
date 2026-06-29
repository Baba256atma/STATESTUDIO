/**
 * APP-3:11 — Executive Intent reasoning rules.
 * Deterministic orchestration — aggregate only, no new inference.
 */
export const EXECUTIVE_INTENT_REASONING_RULES_VERSION = "APP-3/11-RULES-1";
export const REASONING_RULE_IDS = Object.freeze([
    "RULE_SYNTHESIZE_INTENT_SUMMARY",
    "RULE_SYNTHESIZE_STATE",
    "RULE_SYNTHESIZE_SEMANTIC",
    "RULE_SYNTHESIZE_CLASSIFICATION",
    "RULE_SYNTHESIZE_CONFLICT",
    "RULE_SYNTHESIZE_DEPENDENCY",
    "RULE_SYNTHESIZE_EVOLUTION",
    "RULE_SYNTHESIZE_CONFIDENCE",
    "RULE_AGGREGATE_KNOWN",
    "RULE_AGGREGATE_UNKNOWN",
    "RULE_BUILD_HIGHLIGHTS",
    "RULE_BUILD_ISSUES",
    "RULE_BUILD_EVIDENCE",
    "RULE_ASSESS_READINESS",
    "RULE_BUILD_SUMMARY",
]);
function deterministicId(prefix, payload) {
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}
function buildSection(input) {
    return Object.freeze({
        sectionId: deterministicId("reasoning-section", input.sectionKey),
        sectionKey: input.sectionKey,
        title: input.title,
        content: input.content,
        available: input.available,
        sourceEngine: input.sourceEngine,
        readOnly: true,
    });
}
export function buildReasoningSections(input) {
    const { extraction, state, semanticModel, classification, conflict, dependency, evolution, confidence, } = input;
    const intentLabel = extraction?.primaryIntent?.title ??
        semanticModel?.summary.headline ??
        "Executive intent unavailable";
    return Object.freeze([
        buildSection({
            sectionKey: "intent_summary",
            title: "Intent Summary",
            content: intentLabel,
            available: Boolean(extraction?.primaryIntent ?? semanticModel),
            sourceEngine: extraction ? "APP-3/4" : semanticModel ? "APP-3/5" : null,
        }),
        buildSection({
            sectionKey: "current_state",
            title: "Current State",
            content: state?.summary.headline ?? "State resolution unavailable.",
            available: Boolean(state),
            sourceEngine: state ? "APP-3/2" : null,
        }),
        buildSection({
            sectionKey: "semantic_summary",
            title: "Semantic Summary",
            content: semanticModel?.summary.headline ?? "Semantic model unavailable.",
            available: Boolean(semanticModel),
            sourceEngine: semanticModel ? "APP-3/5" : null,
        }),
        buildSection({
            sectionKey: "primary_classification",
            title: "Primary Classification",
            content: classification?.summary.primaryClassLabel ?? "Primary classification unavailable.",
            available: Boolean(classification?.primaryClass),
            sourceEngine: classification ? "APP-3/6" : null,
        }),
        buildSection({
            sectionKey: "secondary_classifications",
            title: "Secondary Classifications",
            content: classification && classification.summary.secondaryClassLabels.length > 0
                ? classification.summary.secondaryClassLabels.join(", ")
                : "No secondary classifications.",
            available: Boolean(classification),
            sourceEngine: classification ? "APP-3/6" : null,
        }),
        buildSection({
            sectionKey: "conflict_summary",
            title: "Conflict Summary",
            content: conflict?.summary.headline ?? "No conflict analysis provided.",
            available: Boolean(conflict),
            sourceEngine: conflict ? "APP-3/7" : null,
        }),
        buildSection({
            sectionKey: "dependency_summary",
            title: "Dependency Summary",
            content: dependency?.summary.headline ?? "No dependency analysis provided.",
            available: Boolean(dependency),
            sourceEngine: dependency ? "APP-3/8" : null,
        }),
        buildSection({
            sectionKey: "evolution_summary",
            title: "Evolution Summary",
            content: evolution?.summary.headline ?? "No evolution analysis provided.",
            available: Boolean(evolution),
            sourceEngine: evolution ? "APP-3/9" : null,
        }),
        buildSection({
            sectionKey: "confidence_summary",
            title: "Confidence Summary",
            content: confidence?.summary.headline ?? "Confidence analysis unavailable.",
            available: Boolean(confidence),
            sourceEngine: confidence ? "APP-3/10" : null,
        }),
        buildSection({
            sectionKey: "known_information",
            title: "Known Information",
            content: semanticModel && semanticModel.knownInformation.length > 0
                ? semanticModel.knownInformation.join("; ")
                : "No explicit known information recorded.",
            available: Boolean(semanticModel),
            sourceEngine: semanticModel ? "APP-3/5" : null,
        }),
        buildSection({
            sectionKey: "unknown_information",
            title: "Unknown Information",
            content: semanticModel && semanticModel.unknowns.length > 0
                ? semanticModel.unknowns.map((entry) => entry.label).join("; ")
                : "No explicit unknowns recorded.",
            available: Boolean(semanticModel),
            sourceEngine: semanticModel ? "APP-3/5" : null,
        }),
    ]);
}
export function buildReasoningUnknowns(semanticModel) {
    if (!semanticModel)
        return Object.freeze([]);
    return Object.freeze(semanticModel.unknowns.map((entry) => Object.freeze({
        unknownId: entry.unknownId,
        label: entry.label,
        description: entry.reason,
        sourceEngine: "APP-3/5",
        readOnly: true,
    })));
}
export function buildReasoningEvidence(input) {
    const evidence = [];
    if (input.extraction?.primaryIntent) {
        evidence.push(Object.freeze({
            evidenceId: deterministicId("reasoning-evidence", "extraction"),
            label: "Extracted Intent",
            description: `Extraction status: ${input.extraction.status}.`,
            sourceEngine: "APP-3/4",
            sourceReference: input.extraction.extractionId,
            readOnly: true,
        }));
    }
    if (input.semanticModel) {
        for (const entry of input.semanticModel.evidence) {
            evidence.push(Object.freeze({
                evidenceId: deterministicId("reasoning-evidence", entry.evidenceId),
                label: entry.source,
                description: entry.summary,
                sourceEngine: "APP-3/5",
                sourceReference: input.semanticModel.modelId,
                readOnly: true,
            }));
        }
    }
    if (input.classification?.primaryClass) {
        evidence.push(Object.freeze({
            evidenceId: deterministicId("reasoning-evidence", "classification"),
            label: "Classification Evidence",
            description: input.classification.summary.headline,
            sourceEngine: "APP-3/6",
            sourceReference: input.classification.classificationId,
            readOnly: true,
        }));
    }
    if (input.confidence) {
        evidence.push(Object.freeze({
            evidenceId: deterministicId("reasoning-evidence", "confidence"),
            label: "Confidence Evidence",
            description: input.confidence.summary.headline,
            sourceEngine: "APP-3/10",
            sourceReference: input.confidence.resultId,
            readOnly: true,
        }));
    }
    return Object.freeze(evidence);
}
export function buildReasoningIssues(input) {
    const issues = [];
    const pushIssue = (issueKey, label, description, severity, sourceEngine, blocking) => {
        issues.push(Object.freeze({
            issueId: deterministicId("reasoning-issue", issueKey),
            issueKey,
            label,
            description,
            severity,
            sourceEngine,
            blocking,
            readOnly: true,
        }));
    };
    if (input.semanticModel?.flags.missingTarget || input.semanticModel?.flags.missingMeasure) {
        pushIssue("missing_target_value", "Missing Target Value", "Semantic model indicates missing target or measure information.", "warning", "APP-3/5", false);
    }
    if (input.semanticModel?.timeHorizon.kind === "unknown" ||
        input.semanticModel?.timeHorizon.label.toLowerCase().includes("unknown")) {
        pushIssue("missing_deadline", "Missing Deadline", "Time horizon is not explicitly defined.", "warning", "APP-3/5", false);
    }
    if (input.conflict?.flags.hasConflict) {
        pushIssue("conflicting_objectives", "Conflicting Objectives", input.conflict.summary.headline, "warning", "APP-3/7", Boolean(input.conflict.flags.requiresExecutiveReview));
    }
    if (input.dependency?.flags.circularDependency) {
        pushIssue("circular_dependency", "Circular Dependency", "Dependency graph contains a circular dependency.", "error", "APP-3/8", true);
    }
    if (input.evolution?.status === "broken" ||
        (input.evolution && input.evolution.timeline.events.length > 5)) {
        pushIssue("unstable_evolution", "Unstable Evolution", input.evolution?.summary.headline ?? "Evolution history is unstable.", "warning", "APP-3/9", input.evolution?.status === "broken");
    }
    if (input.confidence &&
        (input.confidence.flags.lowConfidence || input.confidence.level === "low" ||
            input.confidence.level === "very_low" ||
            input.confidence.level === "unknown")) {
        pushIssue("low_understanding_confidence", "Low Understanding Confidence", input.confidence.summary.headline, "warning", "APP-3/10", false);
    }
    if (input.classification &&
        (input.classification.status === "partial" ||
            input.classification.status === "unknown" ||
            input.classification.status === "incomplete")) {
        pushIssue("incomplete_classification", "Incomplete Classification", `Classification status is ${input.classification.status}.`, "warning", "APP-3/6", !input.classification.primaryClass);
    }
    if (input.semanticModel &&
        input.semanticModel.constraints.length === 0 &&
        input.semanticModel.flags.hasConstraints === false &&
        input.semanticModel.flags.requiresClarification) {
        pushIssue("unknown_constraints", "Unknown Constraints", "Constraints may be present but are not explicitly captured.", "info", "APP-3/5", false);
    }
    return Object.freeze(issues);
}
export function buildReasoningHighlights(input) {
    const items = [];
    const pushHighlight = (highlightKey, label, description) => {
        items.push(Object.freeze({
            highlightId: deterministicId("reasoning-highlight", highlightKey),
            highlightKey,
            label,
            description,
            readOnly: true,
        }));
    };
    if (input.semanticModel?.primaryGoal &&
        !input.semanticModel.flags.incompleteObjective &&
        !input.semanticModel.flags.missingTarget) {
        pushHighlight("clearly_defined_objective", "Clearly Defined Objective", input.semanticModel.summary.primaryGoalLabel);
    }
    if (input.evolution &&
        input.evolution.status !== "broken" &&
        (input.evolution.flags.rootIntent ||
            (input.evolution.flags.hasHistory && input.evolution.timeline.events.length <= 3))) {
        pushHighlight("stable_strategy", "Stable Strategy", input.evolution.summary.headline);
    }
    if (input.semanticModel?.primaryGoal &&
        !input.semanticModel.flags.incompleteObjective) {
        pushHighlight("strong_semantic_model", "Strong Semantic Model", input.semanticModel.summary.headline);
    }
    if (!input.conflict?.flags.hasConflict) {
        pushHighlight("no_major_conflicts", "No Major Conflicts", "No executive intent conflicts detected.");
    }
    if (input.dependency?.flags.hasDependencies &&
        input.dependency.summary.highestStrength === "critical") {
        pushHighlight("critical_dependency", "Critical Dependency", input.dependency.summary.headline);
    }
    if (input.unknownCount >= 3) {
        pushHighlight("multiple_unknowns", "Multiple Unknowns", `${input.unknownCount} explicit unknowns are recorded.`);
    }
    if (input.evolution && input.evolution.timeline.events.length > 5) {
        pushHighlight("recent_strategy_shift", "Recent Strategy Shift", `${input.evolution.timeline.events.length} evolution events recorded.`);
    }
    if (input.confidence?.flags.highConfidence) {
        pushHighlight("high_structural_confidence", "High Structural Confidence", input.confidence.summary.headline);
    }
    return Object.freeze({
        highlightsId: deterministicId("reasoning-highlights", String(items.length)),
        items: Object.freeze(items),
        readOnly: true,
    });
}
export function buildReadinessAssessment(input) {
    const extractionAvailable = Boolean(input.extraction?.primaryIntent && input.extraction.status !== "failed");
    let state = "unknown";
    let headline = "Readiness could not be determined.";
    let explanation = "Required pipeline artifacts are unavailable.";
    const blockingIssueCount = input.issues.filter((issue) => issue.blocking).length;
    if (input.state?.state.flags.isArchived) {
        state = "archived";
        headline = "Intent is archived.";
        explanation = "Archived intents are not active for downstream reasoning.";
    }
    else if (input.state?.state.flags.isBlocked || blockingIssueCount > 0) {
        state = "blocked";
        headline = "Intent is blocked.";
        explanation = "Blocking state or issues prevent downstream readiness.";
    }
    else if (!input.semanticModel ||
        !extractionAvailable ||
        input.semanticModel.flags.incompleteObjective) {
        state = "incomplete";
        headline = "Intent representation is incomplete.";
        explanation = "Extraction or semantic completeness is insufficient.";
    }
    else if (input.semanticModel.flags.requiresClarification ||
        input.confidence?.flags.requiresClarification ||
        input.unknownCount >= 3) {
        state = "needs_clarification";
        headline = "Intent needs clarification.";
        explanation = "Clarification is required before confident downstream use.";
    }
    else if (input.confidence?.flags.readyForReasoning &&
        input.state?.state.flags.isReady) {
        state = "ready";
        headline = "Intent is ready for downstream consumption.";
        explanation = "State and confidence indicate readiness for assistant and dashboard phases.";
    }
    else if (input.state && !input.state.state.flags.isReady) {
        state = "not_ready";
        headline = "Intent is not ready.";
        explanation = `State readiness is ${input.state.readiness}.`;
    }
    const readyForAssistant = state === "ready" || (state === "needs_clarification" && blockingIssueCount === 0);
    const readyForDashboard = state === "ready";
    return Object.freeze({
        assessmentId: deterministicId("readiness-assessment", state),
        state,
        headline,
        explanation,
        readyForAssistant,
        readyForDashboard,
        blockingIssueCount,
        readOnly: true,
    });
}
export function buildReasoningSummary(input) {
    const intentLabel = input.extraction?.primaryIntent?.title ??
        input.semanticModel?.summary.headline ??
        "Executive intent";
    return Object.freeze({
        summaryId: deterministicId("reasoning-summary", intentLabel),
        headline: `Executive intent reasoning for ${intentLabel}.`,
        intentLabel,
        readinessState: input.readinessAssessment.state,
        confidenceLevel: input.confidence?.level ?? null,
        primaryClassification: input.classification?.summary.primaryClassLabel ?? null,
        issueCount: input.issues.length,
        unknownCount: input.unknownCount,
        highlightCount: input.highlightCount,
        readOnly: true,
    });
}
export function collectReasoningRulesApplied() {
    return Object.freeze([...REASONING_RULE_IDS]);
}
export function collectEnginesConsumed(input) {
    const engines = ["APP-3/1"];
    if (input.extraction)
        engines.push("APP-3/4");
    if (input.state)
        engines.push("APP-3/2");
    if (input.semanticModel)
        engines.push("APP-3/5");
    if (input.classification)
        engines.push("APP-3/6");
    if (input.conflict)
        engines.push("APP-3/7");
    if (input.dependency)
        engines.push("APP-3/8");
    if (input.evolution)
        engines.push("APP-3/9");
    if (input.confidence)
        engines.push("APP-3/10");
    return Object.freeze(engines);
}
