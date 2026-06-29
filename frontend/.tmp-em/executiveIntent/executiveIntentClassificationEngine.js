/**
 * APP-3:6 — Executive Intent Classification Engine.
 * Deterministic taxonomy classification from APP-3:5 semantic model — read-only, no scoring.
 */
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import { createIntentClassificationDiagnostic, } from "./executiveIntentClassificationDiagnostics.ts";
import { getIntentClassificationCanonicalExample, } from "./executiveIntentClassificationExamples.ts";
import { collectRulesApplied, resolveClassificationCandidates, resolvePrimaryClassFromCandidates, resolveSecondaryClassesFromCandidates, isSupportedActionType, } from "./executiveIntentClassificationRules.ts";
import { EXECUTIVE_INTENT_CLASSIFICATION_TAXONOMY_VERSION, getIntentTaxonomyClassDefinition, sortIntentClasses, } from "./executiveIntentClassificationTaxonomy.ts";
import { buildExecutiveIntentSemanticModel, buildExecutiveIntentSemanticModelFromExample, validateSemanticModel, } from "./executiveIntentSemanticModel.ts";
import { createIntentClassificationResult, EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION, } from "./executiveIntentClassificationTypes.ts";
export const EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_OWNER = "executive-intent-classification";
export const EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_TAGS = Object.freeze([
    "[APP3_6]",
    "[EXECUTIVE_INTENT_CLASSIFICATION]",
    "[TAXONOMY_ENGINE]",
    "[MULTI_LABEL_CLASSIFICATION]",
    "[READ_ONLY]",
    "[ARCHITECTURE_SAFE]",
    "[BACKWARD_COMPATIBLE]",
]);
export const EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_RULES = Object.freeze({
    deterministic: true,
    pure: true,
    noSideEffects: true,
    noGlobalState: true,
    noStorage: true,
    noMutation: true,
    noConfidence: true,
    noRecommendations: true,
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
    diagnostics.push(createIntentClassificationDiagnostic(code, message, timestamp, options));
}
export function resolvePrimaryClassification(model, candidates = resolveClassificationCandidates(model)) {
    const primaryClassId = resolvePrimaryClassFromCandidates(candidates);
    if (!primaryClassId)
        return null;
    const matching = candidates
        .filter((entry) => entry.classId === primaryClassId)
        .sort((left, right) => right.priority - left.priority)[0];
    const definition = getIntentTaxonomyClassDefinition(primaryClassId);
    return Object.freeze({
        classId: primaryClassId,
        label: definition.label,
        ruleId: matching?.ruleId ?? "RULE_CUSTOM_FALLBACK",
        source: matching?.source ?? "custom",
        readOnly: true,
    });
}
export function resolveSecondaryClassifications(model, primaryClass, candidates = resolveClassificationCandidates(model)) {
    const secondaryIds = resolveSecondaryClassesFromCandidates(candidates, primaryClass?.classId ?? null);
    return Object.freeze(secondaryIds.map((classId) => {
        const matching = candidates.find((entry) => entry.classId === classId);
        const definition = getIntentTaxonomyClassDefinition(classId);
        return Object.freeze({
            classId,
            label: definition.label,
            ruleId: matching?.ruleId ?? "RULE_KEYWORD_TARGET",
            source: matching?.source === "dimension" || matching?.source === "action"
                ? "composite"
                : (matching?.source ?? "keyword"),
            readOnly: true,
        });
    }));
}
export function resolveClassificationFlags(input) {
    const multiClass = input.allClasses.length > 1;
    const compositeIntent = input.model.flags.multipleGoals || input.allClasses.length >= 2;
    const hybridIntent = input.secondaryClasses.length >= 2 ||
        new Set(input.allClasses.map((classId) => getIntentTaxonomyClassDefinition(classId).group)).size >= 2;
    const customClassification = input.primaryClass?.classId === "custom" ||
        input.allClasses.includes("custom");
    const requiresManualReview = customClassification ||
        input.model.flags.incompleteObjective ||
        input.model.flags.requiresClarification ||
        !input.primaryClass;
    return Object.freeze({
        multiClass,
        compositeIntent,
        hybridIntent,
        customClassification,
        requiresManualReview,
        futureCompatible: true,
        readOnly: true,
        deterministic: true,
    });
}
export function buildClassificationSummary(input) {
    const primaryLabel = input.primaryClass?.label ?? "Unclassified";
    const secondaryLabels = Object.freeze(input.secondaryClasses.map((entry) => entry.label));
    const headline = input.secondaryClasses.length > 0
        ? `${primaryLabel} with ${secondaryLabels.join(", ")}`
        : primaryLabel;
    return Object.freeze({
        headline,
        primaryClassLabel: primaryLabel,
        secondaryClassLabels: secondaryLabels,
        classCount: input.allClasses.length,
        taxonomyVersion: EXECUTIVE_INTENT_CLASSIFICATION_TAXONOMY_VERSION,
        readOnly: true,
    });
}
function buildExplanations(candidates, primaryClass, secondaryClasses) {
    const entries = [];
    if (primaryClass) {
        entries.push(Object.freeze({
            explanationId: deterministicId("explanation", `primary-${primaryClass.classId}`),
            ruleId: primaryClass.ruleId,
            description: `Primary class ${primaryClass.label} resolved via ${primaryClass.ruleId}.`,
            readOnly: true,
        }));
    }
    for (const secondary of secondaryClasses) {
        entries.push(Object.freeze({
            explanationId: deterministicId("explanation", `secondary-${secondary.classId}`),
            ruleId: secondary.ruleId,
            description: `Secondary class ${secondary.label} resolved via ${secondary.ruleId}.`,
            readOnly: true,
        }));
    }
    if (entries.length === 0 && candidates.length > 0) {
        entries.push(Object.freeze({
            explanationId: deterministicId("explanation", "fallback"),
            ruleId: candidates[0].ruleId,
            description: "Classification derived from semantic model candidates.",
            readOnly: true,
        }));
    }
    return Object.freeze(entries);
}
export function classifySemanticModel(model, timestamp = model.timestamp) {
    return classifyExecutiveIntent(model, timestamp);
}
export function classifyExecutiveIntent(model, timestamp = model.timestamp) {
    const diagnostics = [];
    const validation = validateSemanticModel(model);
    if (!validation.valid || model.readOnly !== true) {
        pushDiagnostic(diagnostics, "invalid_semantic_model", "Semantic model failed validation for classification.", timestamp, { metadata: Object.freeze({ issues: validation.issues }) });
    }
    if (!model.primaryGoal && model.goals.length === 0) {
        pushDiagnostic(diagnostics, "classification_incomplete", "Classification cannot proceed without semantic goals.", timestamp);
    }
    if (model.businessDimension === "custom") {
        pushDiagnostic(diagnostics, "unknown_business_dimension", "Semantic business dimension is custom.", timestamp);
    }
    if (!isSupportedActionType(model.actionType)) {
        pushDiagnostic(diagnostics, "unsupported_action_type", `Unsupported semantic action type: ${model.actionType}.`, timestamp);
    }
    if (model.actionType === "custom" || model.businessDimension === "custom") {
        pushDiagnostic(diagnostics, "custom_class_required", "Custom taxonomy class required for unmapped semantic signals.", timestamp);
    }
    const candidates = resolveClassificationCandidates(model);
    const primaryClass = resolvePrimaryClassification(model, candidates);
    const secondaryClasses = resolveSecondaryClassifications(model, primaryClass, candidates);
    const primaryCandidates = candidates.filter((entry) => {
        const resolved = resolvePrimaryClassFromCandidates([entry]);
        return resolved === entry.classId;
    });
    const distinctPrimaryCandidates = sortIntentClasses(primaryCandidates.map((entry) => entry.classId));
    if (distinctPrimaryCandidates.length > 1) {
        pushDiagnostic(diagnostics, "multiple_primary_classes", "Multiple primary class candidates detected; highest-priority rule applied.", timestamp, { metadata: Object.freeze({ candidates: distinctPrimaryCandidates }) });
    }
    if (!primaryClass) {
        pushDiagnostic(diagnostics, "no_primary_class", "No primary taxonomy class could be resolved.", timestamp);
    }
    const allClasses = Object.freeze(sortIntentClasses([
        ...(primaryClass ? [primaryClass.classId] : []),
        ...secondaryClasses.map((entry) => entry.classId),
    ]));
    if (allClasses.length > 1) {
        pushDiagnostic(diagnostics, "multi_label_classification", `${allClasses.length} taxonomy classes assigned.`, timestamp);
    }
    const flags = resolveClassificationFlags({ primaryClass, secondaryClasses, allClasses, model });
    if (flags.compositeIntent) {
        pushDiagnostic(diagnostics, "composite_intent_detected", "Composite intent classification applied.", timestamp);
    }
    if (flags.hybridIntent) {
        pushDiagnostic(diagnostics, "hybrid_intent_detected", "Hybrid intent classification applied.", timestamp);
    }
    if (flags.requiresManualReview) {
        pushDiagnostic(diagnostics, "classification_requires_review", "Classification may require manual review.", timestamp);
    }
    const rulesApplied = collectRulesApplied(candidates);
    const metadata = Object.freeze({
        taxonomyVersion: EXECUTIVE_INTENT_CLASSIFICATION_TAXONOMY_VERSION,
        classificationEngineVersion: EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION,
        semanticModelVersion: model.versionMetadata.semanticModelVersion,
        rulesApplied,
        semanticModelId: model.modelId,
        readOnly: true,
    });
    const explanations = buildExplanations(candidates, primaryClass, secondaryClasses);
    const summary = buildClassificationSummary({ primaryClass, secondaryClasses, allClasses });
    let status = "classified";
    if (!primaryClass)
        status = "unknown";
    else if (model.flags.incompleteObjective || flags.customClassification)
        status = "partial";
    else if (flags.requiresManualReview && allClasses.length === 1)
        status = "partial";
    if (primaryClass && status !== "unknown") {
        pushDiagnostic(diagnostics, "classification_success", "Executive intent classified successfully.", timestamp);
    }
    const classificationId = deterministicId("classification", `${model.modelId}:${timestamp}`);
    return createIntentClassificationResult({
        classificationId,
        workspaceId: model.workspaceId,
        semanticModelId: model.modelId,
        status,
        primaryClass,
        secondaryClasses,
        allClasses,
        flags,
        explanations,
        diagnostics: Object.freeze([...diagnostics]),
        summary,
        metadata,
        timestamp,
    });
}
export function validateClassification(result) {
    const issues = [];
    if (result.readOnly !== true)
        issues.push("Classification result must be read-only.");
    if (result.flags.readOnly !== true)
        issues.push("Classification flags must be read-only.");
    if (result.flags.deterministic !== true)
        issues.push("Classification must be deterministic.");
    if (result.metadata.classificationEngineVersion !== EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION) {
        issues.push("Unexpected classification engine version.");
    }
    if (result.status === "classified" && !result.primaryClass) {
        issues.push("Classified status requires a primary class.");
    }
    if (result.allClasses.length === 0 && result.status === "classified") {
        issues.push("Classified status requires at least one taxonomy class.");
    }
    const primaryInAll = result.primaryClass
        ? result.allClasses.includes(result.primaryClass.classId)
        : true;
    if (!primaryInAll)
        issues.push("Primary class must appear in allClasses.");
    return Object.freeze({
        valid: issues.length === 0,
        issues: Object.freeze(issues),
        readOnly: true,
    });
}
export function buildClassificationExample(exampleId, workspaceId = "ws-example-001", owner = "executive-owner", generatedAt = new Date(0).toISOString()) {
    const example = getIntentClassificationCanonicalExample(exampleId);
    if (!example)
        return null;
    let semanticResult;
    if (example.semanticExampleId) {
        semanticResult = buildExecutiveIntentSemanticModelFromExample(example.semanticExampleId, workspaceId, owner, generatedAt);
    }
    else if (example.customText) {
        const extraction = extractExecutiveIntent(Object.freeze({
            text: example.customText,
            workspaceId,
            owner,
            languageCode: example.languageCode,
            generatedAt,
        }));
        semanticResult = buildExecutiveIntentSemanticModel(extraction, generatedAt);
    }
    if (!semanticResult)
        return null;
    return classifyExecutiveIntent(semanticResult.model, generatedAt);
}
export function buildClassificationProbe(generatedAt = new Date(0).toISOString()) {
    const extraction = extractExecutiveIntent(Object.freeze({
        text: "Increase company profit by 20% next year.",
        workspaceId: "ws-example-001",
        owner: "executive-owner",
        languageCode: "en",
        generatedAt,
    }));
    const semantic = buildExecutiveIntentSemanticModel(extraction, generatedAt);
    return classifyExecutiveIntent(semantic.model, generatedAt);
}
export function getExecutiveIntentClassificationEngineVersionMetadata() {
    return Object.freeze({
        classificationEngineVersion: EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION,
        taxonomyVersion: EXECUTIVE_INTENT_CLASSIFICATION_TAXONOMY_VERSION,
        owner: EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_OWNER,
    });
}
export const ExecutiveIntentClassificationEngine = Object.freeze({
    classifyExecutiveIntent,
    classifySemanticModel,
    resolvePrimaryClassification,
    resolveSecondaryClassifications,
    resolveClassificationFlags,
    validateClassification,
    buildClassificationSummary,
    buildClassificationExample,
    buildClassificationProbe,
    getExecutiveIntentClassificationEngineVersionMetadata,
    version: EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION,
    taxonomyVersion: EXECUTIVE_INTENT_CLASSIFICATION_TAXONOMY_VERSION,
    rules: EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_RULES,
    tags: EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_TAGS,
});
