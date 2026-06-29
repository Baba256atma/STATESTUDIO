/**
 * APP-3:5 — Executive Intent Semantic Model engine.
 * Deterministic normalization from APP-3:4 extraction — read-only, no inference.
 */
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import { createIntentSemanticDiagnostic, } from "./executiveIntentSemanticDiagnostics.ts";
import { buildDesiredFutureStatePhrase, mapActionVerbToActionType, normalizeTimeReferenceToHorizon, resolveBusinessDimensionFromExtraction, } from "./executiveIntentSemanticRules.ts";
import { getIntentSemanticCanonicalExample } from "./executiveIntentSemanticExamples.ts";
import { getIntentExtractionCanonicalExample } from "./executiveIntentExtractionExamples.ts";
import { createExecutiveIntentSemanticModel, EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION, } from "./executiveIntentSemanticTypes.ts";
export const EXECUTIVE_INTENT_SEMANTIC_MODEL_OWNER = "executive-intent-semantic-model";
export const EXECUTIVE_INTENT_SEMANTIC_MODEL_TAGS = Object.freeze([
    "[APP3_5]",
    "[EXECUTIVE_INTENT_SEMANTIC_MODEL]",
    "[SEMANTIC_NORMALIZATION]",
    "[READ_ONLY]",
    "[ARCHITECTURE_SAFE]",
    "[BACKWARD_COMPATIBLE]",
]);
export const EXECUTIVE_INTENT_SEMANTIC_MODEL_RULES = Object.freeze({
    deterministic: true,
    pure: true,
    noSideEffects: true,
    noGlobalState: true,
    noStorage: true,
    noMutation: true,
    noInference: true,
    explicitOnly: true,
    readOnly: true,
});
function deterministicId(prefix, payload) {
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}
function pushDiagnostic(diagnostics, code, message, timestamp, options = Object.freeze({})) {
    diagnostics.push(createIntentSemanticDiagnostic(code, message, timestamp, options));
}
export function normalizeSemanticGoal(goal, intent, timestamp) {
    const actionType = normalizeActionTypeFromVerb(goal.actionVerb);
    return Object.freeze({
        goalId: goal.goalId,
        intentId: intent?.intentId ?? null,
        label: goal.primaryPhrase,
        actionType,
        actionVerb: goal.actionVerb,
        rawPhrase: goal.rawSegment,
        readOnly: true,
    });
}
export function normalizeActionTypeFromVerb(verb) {
    return mapActionVerbToActionType(verb);
}
export function normalizeSemanticOutcome(goal, target, actionType) {
    if (!goal)
        return null;
    const desiredFutureState = buildDesiredFutureStatePhrase(goal, target, actionType);
    return Object.freeze({
        outcomeId: deterministicId("outcome", `${goal.goalId}|${desiredFutureState}`),
        desiredFutureState,
        explicitText: goal.rawSegment,
        readOnly: true,
    });
}
export function normalizeSemanticTarget(target) {
    if (!target || !target.objectLabel)
        return null;
    return Object.freeze({
        targetId: target.targetId,
        entityLabel: target.objectLabel,
        entityType: target.businessArea,
        readOnly: true,
    });
}
export function normalizeBusinessDimension(intent, target) {
    return resolveBusinessDimensionFromExtraction(intent?.metadata.category ?? null, target);
}
export function normalizeTimeHorizon(timeReference, timestamp) {
    const mapped = normalizeTimeReferenceToHorizon(timeReference);
    return Object.freeze({
        horizonId: timeReference?.timeRefId ?? deterministicId("horizon", "unknown"),
        kind: mapped.kind,
        label: mapped.label,
        explicitText: timeReference?.explicitText ?? null,
        readOnly: true,
    });
}
export function normalizeConstraints(constraints) {
    return Object.freeze(constraints.map((entry) => Object.freeze({
        constraintId: entry.constraintId,
        label: entry.label,
        description: entry.description,
        explicitText: entry.explicitText,
        readOnly: true,
    })));
}
export function normalizeAssumptions(assumptions) {
    return Object.freeze(assumptions.map((entry) => Object.freeze({
        assumptionId: entry.assumptionId,
        label: entry.label,
        description: entry.description,
        explicitText: entry.explicitText,
        readOnly: true,
    })));
}
export function normalizeActors(actors) {
    return Object.freeze(actors.map((entry) => Object.freeze({
        actorId: entry.actorId,
        name: entry.name,
        role: entry.role,
        explicitText: entry.explicitText,
        readOnly: true,
    })));
}
export function normalizeBusinessObjects(targets) {
    return Object.freeze(targets
        .filter((entry) => entry.objectLabel.length > 0)
        .map((entry) => Object.freeze({
        objectId: entry.targetId,
        label: entry.objectLabel,
        objectType: entry.businessArea ?? "business_object",
        readOnly: true,
    })));
}
function normalizeMeasure(target) {
    if (!target)
        return null;
    if (!target.valueLabel && target.numericValue === null)
        return null;
    return Object.freeze({
        measureId: deterministicId("measure", target.targetId),
        label: target.objectLabel || "measure",
        numericValue: target.numericValue,
        unit: target.unit,
        explicitText: target.valueLabel,
        readOnly: true,
    });
}
function normalizeChange(goal, target, actionType) {
    if (!goal)
        return null;
    return Object.freeze({
        changeId: deterministicId("change", goal.goalId),
        actionType,
        targetLabel: target?.objectLabel ?? "",
        measureLabel: target?.valueLabel ?? null,
        readOnly: true,
    });
}
export function resolveSemanticUnknowns(input) {
    const unknowns = [];
    if (!input.target?.objectLabel) {
        unknowns.push(Object.freeze({
            unknownId: deterministicId("unknown", "target_entity"),
            kind: "target_entity",
            label: "Unknown Target Entity",
            reason: "No explicit target entity was extracted.",
            readOnly: true,
        }));
    }
    if (!input.measure) {
        unknowns.push(Object.freeze({
            unknownId: deterministicId("unknown", "measure"),
            kind: "measure",
            label: "Unknown Target Value",
            reason: "No explicit measure or target value was extracted.",
            readOnly: true,
        }));
    }
    if (input.timeHorizon.kind === "unknown") {
        unknowns.push(Object.freeze({
            unknownId: deterministicId("unknown", "deadline"),
            kind: "deadline",
            label: "Unknown Deadline",
            reason: "No explicit time horizon was extracted.",
            readOnly: true,
        }));
    }
    if (input.actors.length === 0) {
        unknowns.push(Object.freeze({
            unknownId: deterministicId("unknown", "actor"),
            kind: "actor",
            label: "Unknown Actor",
            reason: "No explicit actor was extracted.",
            readOnly: true,
        }));
    }
    if (input.businessDimension === "custom") {
        unknowns.push(Object.freeze({
            unknownId: deterministicId("unknown", "business_dimension"),
            kind: "business_dimension",
            label: "Unknown Business Dimension",
            reason: "Business dimension could not be mapped from explicit extraction.",
            readOnly: true,
        }));
    }
    if (input.actionType === "custom") {
        unknowns.push(Object.freeze({
            unknownId: deterministicId("unknown", "action_type"),
            kind: "action_type",
            label: "Unknown Action Type",
            reason: "Action verb could not be mapped to a canonical action type.",
            readOnly: true,
        }));
    }
    if (input.constraints.length === 0) {
        unknowns.push(Object.freeze({
            unknownId: deterministicId("unknown", "constraint"),
            kind: "constraint",
            label: "Unknown Constraint",
            reason: "No explicit constraint was extracted.",
            readOnly: true,
        }));
    }
    if (input.assumptions.length === 0) {
        unknowns.push(Object.freeze({
            unknownId: deterministicId("unknown", "assumption"),
            kind: "assumption",
            label: "Unknown Assumption",
            reason: "No explicit assumption was extracted.",
            readOnly: true,
        }));
    }
    if (input.evidence.length === 0) {
        unknowns.push(Object.freeze({
            unknownId: deterministicId("unknown", "evidence"),
            kind: "evidence",
            label: "Unknown Evidence",
            reason: "No explicit evidence reference was extracted.",
            readOnly: true,
        }));
    }
    return Object.freeze(unknowns);
}
export function buildSemanticSummary(model) {
    return Object.freeze({
        headline: model.primaryGoal?.label ?? "Semantic model incomplete",
        primaryGoalLabel: model.primaryGoal?.label ?? "Unknown goal",
        businessDimension: model.businessDimension,
        actionType: model.actionType,
        timeHorizonLabel: model.timeHorizon.label,
        unknownCount: model.unknowns.length,
        goalCount: model.goals.length,
        readOnly: true,
    });
}
function buildSemanticFlags(input) {
    const requiresClarification = input.extraction.status === "failed" ||
        input.extraction.status === "partial" ||
        input.unknowns.some((entry) => ["target_entity", "measure", "deadline", "business_dimension"].includes(entry.kind));
    return Object.freeze({
        multipleGoals: input.goals.length > 1,
        incompleteObjective: input.extraction.status === "failed" || input.target === null,
        missingMeasure: input.measure === null,
        missingTarget: input.target === null,
        hasConstraints: input.constraints.length > 0,
        hasAssumptions: input.assumptions.length > 0,
        hasEvidence: input.evidence.length > 0,
        requiresClarification,
        explicitPriority: input.extraction.metadata.explicitPriority,
        explicitScope: input.extraction.metadata.explicitScope,
        futureCompatible: true,
        readOnly: true,
    });
}
export function normalizeExecutiveIntent(extraction, timestamp = extraction.timestamp) {
    return buildExecutiveIntentSemanticModel(extraction, timestamp);
}
export function buildExecutiveIntentSemanticModel(extraction, timestamp = extraction.timestamp) {
    const diagnostics = [];
    const primaryIntent = extraction.primaryIntent;
    const primaryGoalExtracted = extraction.goals[0] ?? null;
    const primaryTarget = extraction.targets[0] ?? null;
    const primaryTime = extraction.timeReferences[0] ?? null;
    if (extraction.status === "failed" || !primaryIntent) {
        pushDiagnostic(diagnostics, "semantic_incomplete_model", "Semantic model cannot be fully normalized from failed extraction.", timestamp);
    }
    if (extraction.goals.length > 1) {
        pushDiagnostic(diagnostics, "semantic_multiple_goals", `${extraction.goals.length} goals detected in extraction.`, timestamp);
    }
    const goals = Object.freeze(extraction.goals.map((goal, index) => normalizeSemanticGoal(goal, extraction.intents[index] ?? primaryIntent, timestamp)));
    const primaryGoal = goals[0] ?? null;
    const actionType = primaryGoal?.actionType ?? "custom";
    const businessDimension = normalizeBusinessDimension(primaryIntent, primaryTarget);
    const targetEntity = normalizeSemanticTarget(primaryTarget);
    const targetMeasure = normalizeMeasure(primaryTarget);
    const timeHorizon = normalizeTimeHorizon(primaryTime, timestamp);
    const constraints = normalizeConstraints(extraction.constraints);
    const assumptions = normalizeAssumptions(extraction.assumptions);
    const actors = normalizeActors(extraction.actors);
    const businessObjects = normalizeBusinessObjects(extraction.targets);
    const desiredFutureState = normalizeSemanticOutcome(primaryGoalExtracted, primaryTarget, actionType);
    const semanticChange = normalizeChange(primaryGoalExtracted, primaryTarget, actionType);
    if (!targetEntity) {
        pushDiagnostic(diagnostics, "semantic_target_unknown", "Semantic target entity is unknown.", timestamp);
    }
    if (!targetMeasure) {
        pushDiagnostic(diagnostics, "semantic_measure_unknown", "Semantic measure is unknown.", timestamp);
    }
    if (timeHorizon.kind === "unknown") {
        pushDiagnostic(diagnostics, "semantic_time_unknown", "Semantic time horizon is unknown.", timestamp);
    }
    if (businessDimension === "custom") {
        pushDiagnostic(diagnostics, "semantic_business_dimension_unknown", "Semantic business dimension mapped to custom.", timestamp);
    }
    if (actionType === "custom") {
        pushDiagnostic(diagnostics, "semantic_action_unknown", "Semantic action type mapped to custom.", timestamp);
    }
    if (!desiredFutureState) {
        pushDiagnostic(diagnostics, "semantic_outcome_unknown", "Desired future state is unknown.", timestamp);
    }
    const unknowns = resolveSemanticUnknowns({
        target: primaryTarget,
        measure: targetMeasure,
        timeHorizon,
        actors,
        constraints,
        assumptions,
        evidence: extraction.evidence,
        businessDimension,
        actionType,
        timestamp,
    });
    const knownInformation = Object.freeze([
        primaryGoal ? `goal:${primaryGoal.label}` : null,
        targetEntity ? `target:${targetEntity.entityLabel}` : null,
        targetMeasure?.explicitText ? `measure:${targetMeasure.explicitText}` : null,
        timeHorizon.kind !== "unknown" ? `time:${timeHorizon.label}` : null,
        `dimension:${businessDimension}`,
        `action:${actionType}`,
    ].filter((entry) => entry !== null));
    const flags = buildSemanticFlags({
        goals,
        measure: targetMeasure,
        target: targetEntity,
        constraints,
        assumptions,
        evidence: extraction.evidence,
        unknowns,
        extraction,
    });
    const modelId = deterministicId("semantic-model", extraction.extractionId);
    const workspaceId = primaryIntent?.workspaceId ?? extraction.intents[0]?.workspaceId ?? "ws-unknown";
    const modelWithoutSummary = {
        modelId,
        workspaceId,
        extractionId: extraction.extractionId,
        primaryGoal,
        goals,
        desiredFutureState,
        businessDimension,
        targetEntity,
        targetMeasure,
        semanticChange,
        actionType,
        timeHorizon,
        actors,
        businessObjects,
        constraints,
        assumptions,
        evidence: extraction.evidence,
        knownInformation,
        unknowns,
        flags,
        diagnostics: Object.freeze([...diagnostics]),
        summary: Object.freeze({
            headline: "",
            primaryGoalLabel: "",
            businessDimension,
            actionType,
            timeHorizonLabel: timeHorizon.label,
            unknownCount: unknowns.length,
            goalCount: goals.length,
            readOnly: true,
        }),
        versionMetadata: Object.freeze({
            semanticModelVersion: EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION,
            extractionEngineVersion: extraction.engineVersion,
            contractVersion: extraction.contractVersion,
        }),
        timestamp,
    };
    const summary = buildSemanticSummary(modelWithoutSummary);
    const model = createExecutiveIntentSemanticModel({ ...modelWithoutSummary, summary });
    let status = "ready";
    if (extraction.status === "failed" || !primaryGoal)
        status = "incomplete";
    else if (extraction.status === "partial" || flags.requiresClarification)
        status = "partial";
    if (status === "ready" || (status === "partial" && primaryGoal)) {
        pushDiagnostic(diagnostics, "semantic_normalization_success", "Semantic normalization completed.", timestamp);
        pushDiagnostic(diagnostics, "semantic_model_ready", "Executive intent semantic model is ready.", timestamp);
    }
    const finalModel = createExecutiveIntentSemanticModel({
        ...modelWithoutSummary,
        diagnostics: Object.freeze([...diagnostics]),
        summary,
    });
    return Object.freeze({
        modelId,
        status,
        model: finalModel,
        diagnostics: Object.freeze([...diagnostics]),
        summary,
        timestamp,
        readOnly: true,
    });
}
export function validateSemanticModel(model) {
    const issues = [];
    if (model.readOnly !== true)
        issues.push("Semantic model must be read-only.");
    if (model.flags.readOnly !== true)
        issues.push("Semantic flags must be read-only.");
    if (model.versionMetadata.semanticModelVersion !== EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION) {
        issues.push("Unexpected semantic model version.");
    }
    if (!model.primaryGoal && model.goals.length === 0) {
        issues.push("Semantic model requires at least one goal or explicit incomplete state.");
    }
    return Object.freeze({
        valid: issues.length === 0,
        issues: Object.freeze(issues),
        readOnly: true,
    });
}
export function buildExecutiveIntentSemanticModelFromExample(semanticExampleId, workspaceId = "ws-example-001", owner = "executive-owner", generatedAt = new Date(0).toISOString()) {
    const example = getIntentSemanticCanonicalExample(semanticExampleId);
    if (!example)
        return null;
    const extractionRef = example.extractionExampleId
        ? getIntentExtractionCanonicalExample(example.extractionExampleId)
        : null;
    const text = example.customText ?? extractionRef?.text;
    if (!text)
        return null;
    const extraction = extractExecutiveIntent(Object.freeze({
        text,
        workspaceId,
        owner,
        languageCode: example.languageCode,
        generatedAt,
    }));
    return buildExecutiveIntentSemanticModel(extraction, generatedAt);
}
export function buildExecutiveIntentSemanticModelProbeExample(generatedAt = new Date(0).toISOString()) {
    const extraction = extractExecutiveIntent(Object.freeze({
        text: "Increase company profit by 20% next year.",
        workspaceId: "ws-example-001",
        owner: "executive-owner",
        languageCode: "en",
        generatedAt,
    }));
    return buildExecutiveIntentSemanticModel(extraction, generatedAt);
}
export function getExecutiveIntentSemanticModelVersionMetadata() {
    return Object.freeze({
        semanticModelVersion: EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION,
        owner: EXECUTIVE_INTENT_SEMANTIC_MODEL_OWNER,
    });
}
export const ExecutiveIntentSemanticModelEngine = Object.freeze({
    buildExecutiveIntentSemanticModel,
    normalizeExecutiveIntent,
    normalizeSemanticGoal,
    normalizeSemanticOutcome,
    normalizeSemanticTarget,
    normalizeBusinessDimension,
    normalizeTimeHorizon,
    normalizeConstraints,
    normalizeAssumptions,
    normalizeActors,
    normalizeActionTypeFromVerb,
    normalizeBusinessObjects,
    resolveSemanticUnknowns,
    validateSemanticModel,
    buildSemanticSummary,
    buildExecutiveIntentSemanticModelProbeExample,
    buildExecutiveIntentSemanticModelFromExample,
    getExecutiveIntentSemanticModelVersionMetadata,
    version: EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION,
    rules: EXECUTIVE_INTENT_SEMANTIC_MODEL_RULES,
});
