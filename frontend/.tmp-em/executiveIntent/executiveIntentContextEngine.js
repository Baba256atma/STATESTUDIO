/**
 * APP-3.3.1 — Executive Intent Context Engine.
 * Deterministic context model from intent, state, and semantic model — read-only, no reasoning.
 */
import { EXECUTIVE_INTENT_CONTRACT_VERSION } from "./executiveIntentConstants.ts";
import { createIntentContextDiagnostic, } from "./executiveIntentContextDiagnostics.ts";
import { getIntentContextCanonicalExample } from "./executiveIntentContextExamples.ts";
import { getIntentExtractionCanonicalExample } from "./executiveIntentExtractionExamples.ts";
import { resolveBusinessDomainLabel, resolveContextScope, resolveContextScopeLabel, resolveKnownContextEntries, resolveStateCategoryLabel, resolveStateReadinessLabel, resolveUnknownContextEntries, resolveWorkspaceLabel, } from "./executiveIntentContextRules.ts";
import { createExecutiveIntentContext, createExecutiveIntentContextAnalysisInput, createIntentContextFlags, createIntentContextMetadata, createIntentContextSummary, EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION, } from "./executiveIntentContextTypes.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { getIntentSemanticCanonicalExample } from "./executiveIntentSemanticExamples.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";
export const EXECUTIVE_INTENT_CONTEXT_ENGINE_OWNER = "executive-intent-context";
export const EXECUTIVE_INTENT_CONTEXT_ENGINE_TAGS = Object.freeze([
    "[APP3_3_1]",
    "[EXECUTIVE_INTENT_CONTEXT]",
    "[MAINTENANCE_RELEASE]",
    "[NON_BREAKING]",
    "[READ_ONLY]",
    "[ARCHITECTURE_SAFE]",
    "[APP3_PLATFORM_EXTENSION]",
]);
export const EXECUTIVE_INTENT_CONTEXT_ENGINE_RULES = Object.freeze({
    deterministic: true,
    pure: true,
    noSideEffects: true,
    noGlobalState: true,
    noStorage: true,
    noMutation: true,
    noInference: true,
    noRecommendations: true,
    noReasoning: true,
    noClassification: true,
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
    diagnostics.push(createIntentContextDiagnostic(code, message, timestamp, options));
}
export function buildWorkspaceContext(intent, state, scope) {
    const workspaceId = intent?.workspaceId ?? state?.workspaceId ?? null;
    return Object.freeze({
        workspaceId,
        workspaceLabel: resolveWorkspaceLabel(workspaceId, intent),
        scope,
        scopeLabel: resolveContextScopeLabel(scope),
        owner: intent?.metadata.owner ?? null,
        source: intent?.metadata.source ?? null,
        readiness: resolveStateReadinessLabel(state),
        stateCategory: resolveStateCategoryLabel(state),
        readOnly: true,
    });
}
export function buildBusinessContext(intent, semanticModel) {
    return Object.freeze({
        businessDomain: resolveBusinessDomainLabel(semanticModel, intent),
        category: intent?.metadata.category ?? null,
        primaryGoalLabel: semanticModel?.summary.primaryGoalLabel ?? null,
        actionType: semanticModel?.actionType ?? null,
        timeHorizonLabel: semanticModel?.summary.timeHorizonLabel ?? null,
        desiredFutureState: semanticModel?.desiredFutureState?.desiredFutureState ?? null,
        readOnly: true,
    });
}
export function buildObjectContext(intent, semanticModel) {
    const objects = [];
    const seen = new Set();
    const addObject = (objectId, label, objectType, source) => {
        const key = `${source}|${label}`;
        if (!label || seen.has(key))
            return;
        seen.add(key);
        objects.push(Object.freeze({
            objectId,
            label,
            objectType,
            source,
            readOnly: true,
        }));
    };
    if (semanticModel?.targetEntity) {
        addObject(semanticModel.targetEntity.targetId, semanticModel.targetEntity.entityLabel, semanticModel.targetEntity.entityType ?? "target", "semantic_target");
    }
    for (const object of semanticModel?.businessObjects ?? []) {
        addObject(object.objectId, object.label, object.objectType, "semantic_object");
    }
    for (const reference of intent?.metadata.references ?? []) {
        addObject(reference.referenceId, reference.label, reference.referenceType, "intent_reference");
    }
    return Object.freeze(objects);
}
export function buildRelationshipContext(intent) {
    if (!intent)
        return Object.freeze([]);
    return Object.freeze(intent.relations.map((relation) => Object.freeze({
        relationshipId: relation.relationId,
        relationType: relation.relationType,
        sourceIntentId: relation.sourceIntentId,
        targetIntentId: relation.targetIntentId,
        label: `${relation.relationType}:${relation.targetIntentId}`,
        readOnly: true,
    })));
}
export function buildConstraintContext(intent, semanticModel) {
    const constraints = [];
    const seen = new Set();
    const addConstraint = (constraintId, label, description, origin) => {
        const key = `${origin}|${label}`;
        if (!label || seen.has(key))
            return;
        seen.add(key);
        constraints.push(Object.freeze({
            constraintId,
            label,
            description,
            origin,
            readOnly: true,
        }));
    };
    for (const constraint of intent?.metadata.constraints ?? []) {
        addConstraint(constraint.constraintId, constraint.label, constraint.description, "intent");
    }
    for (const constraint of semanticModel?.constraints ?? []) {
        addConstraint(constraint.constraintId, constraint.label, constraint.description, "semantic");
    }
    return Object.freeze(constraints);
}
export function buildStakeholderContext(intent, semanticModel) {
    const stakeholders = [];
    const seen = new Set();
    const addStakeholder = (stakeholderId, name, role, stakeholderType) => {
        const key = `${stakeholderType}|${name}`;
        if (!name || seen.has(key))
            return;
        seen.add(key);
        stakeholders.push(Object.freeze({
            stakeholderId,
            name,
            role,
            stakeholderType,
            readOnly: true,
        }));
    };
    if (intent?.metadata.owner) {
        addStakeholder(deterministicId("stakeholder-owner", intent.metadata.owner), intent.metadata.owner, "owner", "owner");
    }
    for (const actor of semanticModel?.actors ?? []) {
        addStakeholder(actor.actorId, actor.name, actor.role, "actor");
    }
    return Object.freeze(stakeholders);
}
function buildEvidenceContext(intent, semanticModel) {
    const evidence = [];
    const seen = new Set();
    const addEvidence = (evidenceId, label, source, summary, origin) => {
        const key = `${origin}|${label}|${summary}`;
        if (seen.has(key))
            return;
        seen.add(key);
        evidence.push(Object.freeze({
            evidenceId,
            label,
            source,
            summary,
            origin,
            readOnly: true,
        }));
    };
    for (const entry of intent?.metadata.evidence ?? []) {
        addEvidence(entry.evidenceId, entry.summary, entry.source, entry.summary, "intent");
    }
    for (const entry of semanticModel?.evidence ?? []) {
        addEvidence(entry.evidenceId, entry.summary, entry.source, entry.summary, "semantic");
    }
    return Object.freeze(evidence);
}
export function buildContextSummary(context) {
    return createIntentContextSummary({
        headline: context.business.primaryGoalLabel
            ? `${context.business.businessDomain} context for ${context.business.primaryGoalLabel}`
            : `${context.business.businessDomain} context`,
        scopeLabel: context.workspace.scopeLabel,
        businessDomain: context.business.businessDomain,
        objectCount: context.objects.length,
        relationshipCount: context.relationships.length,
        stakeholderCount: context.stakeholders.length,
        constraintCount: context.constraints.length,
        evidenceCount: context.evidence.length,
        knownCount: context.knownContext.length,
        unknownCount: context.unknownContext.length,
    });
}
export function validateContext(context) {
    const issues = [];
    if (context.readOnly !== true)
        issues.push("Context must be read-only.");
    if (!context.contextId)
        issues.push("Context id is required.");
    if (context.metadata.contextEngineVersion !== EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION) {
        issues.push("Unexpected context engine version.");
    }
    if (context.summary.objectCount !== context.objects.length) {
        issues.push("Summary object count mismatch.");
    }
    if (context.summary.knownCount !== context.knownContext.length) {
        issues.push("Summary known count mismatch.");
    }
    return Object.freeze({
        valid: issues.length === 0,
        issues: Object.freeze(issues),
        readOnly: true,
    });
}
function resolveContextFlags(input) {
    const workspaceReady = input.workspace.workspaceId !== null;
    const businessReady = input.business.businessDomain !== "unknown";
    const objectsReady = input.objects.length > 0;
    const relationshipsReady = input.relationships.length > 0;
    const stakeholdersReady = input.stakeholders.length > 0;
    const constraintsReady = input.constraints.length > 0;
    const evidenceReady = input.evidence.length > 0;
    const unknown = input.unknownContext.length > 0;
    const complete = workspaceReady &&
        businessReady &&
        (objectsReady || stakeholdersReady || input.business.primaryGoalLabel !== null);
    return createIntentContextFlags({
        workspaceReady,
        businessReady,
        objectsReady,
        relationshipsReady,
        stakeholdersReady,
        constraintsReady,
        evidenceReady,
        complete,
        incomplete: !complete,
        unknown,
    });
}
export function buildExecutiveIntentContext(input) {
    const diagnostics = [];
    const { intent, state, semanticModel, timestamp } = input;
    if (!intent) {
        pushDiagnostic(diagnostics, "context_intent_missing", "Intent record unavailable.", timestamp);
    }
    if (!semanticModel) {
        pushDiagnostic(diagnostics, "context_semantic_missing", "Semantic model unavailable.", timestamp);
    }
    if (!state) {
        pushDiagnostic(diagnostics, "context_state_missing", "State resolution unavailable.", timestamp);
    }
    const scope = resolveContextScope(intent, semanticModel);
    if (scope === "unknown") {
        pushDiagnostic(diagnostics, "context_scope_unknown", "Context scope could not be resolved.", timestamp);
    }
    const workspace = buildWorkspaceContext(intent, state, scope);
    const business = buildBusinessContext(intent, semanticModel);
    const objects = buildObjectContext(intent, semanticModel);
    const relationships = buildRelationshipContext(intent);
    const stakeholders = buildStakeholderContext(intent, semanticModel);
    const constraints = buildConstraintContext(intent, semanticModel);
    const evidence = buildEvidenceContext(intent, semanticModel);
    const knownContext = resolveKnownContextEntries(intent, semanticModel, scope);
    const unknownContext = resolveUnknownContextEntries(intent, semanticModel);
    if (workspace.workspaceId) {
        pushDiagnostic(diagnostics, "workspace_context_ready", "Workspace context resolved.", timestamp);
    }
    else {
        pushDiagnostic(diagnostics, "missing_context", "Workspace context missing.", timestamp);
    }
    if (business.businessDomain !== "unknown") {
        pushDiagnostic(diagnostics, "business_context_ready", "Business context resolved.", timestamp);
    }
    if (objects.length > 0) {
        pushDiagnostic(diagnostics, "object_context_ready", "Object context resolved.", timestamp);
    }
    if (relationships.length > 0) {
        pushDiagnostic(diagnostics, "relationship_context_ready", "Relationship context resolved.", timestamp);
    }
    if (stakeholders.length > 0) {
        pushDiagnostic(diagnostics, "stakeholder_context_ready", "Stakeholder context resolved.", timestamp);
    }
    if (constraints.length > 0) {
        pushDiagnostic(diagnostics, "constraint_context_ready", "Constraint context resolved.", timestamp);
    }
    if (evidence.length > 0) {
        pushDiagnostic(diagnostics, "evidence_context_ready", "Evidence context resolved.", timestamp);
    }
    if (unknownContext.length > 0) {
        pushDiagnostic(diagnostics, "unknown_context", "Unknown context entries present.", timestamp);
    }
    const flags = resolveContextFlags({
        workspace,
        business,
        objects,
        relationships,
        stakeholders,
        constraints,
        evidence,
        unknownContext,
    });
    if (flags.incomplete) {
        pushDiagnostic(diagnostics, "context_incomplete", "Context model is incomplete.", timestamp);
    }
    else {
        pushDiagnostic(diagnostics, "context_ready", "Context model ready.", timestamp);
    }
    pushDiagnostic(diagnostics, "context_future_reserved", "Context engine reserved for APP-3.15.1 reasoning refresh.", timestamp);
    const partialContext = {
        contextId: deterministicId("intent-context", `${intent?.intentId ?? "none"}:${semanticModel?.modelId ?? "none"}:${timestamp}`),
        intentId: intent?.intentId ?? null,
        workspaceId: intent?.workspaceId ?? state?.workspaceId ?? null,
        scope,
        workspace,
        business,
        objects,
        relationships,
        stakeholders,
        constraints,
        evidence,
        knownContext,
        unknownContext,
        flags,
        diagnostics: Object.freeze([...diagnostics]),
        metadata: createIntentContextMetadata({
            contextEngineVersion: EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION,
            contractVersion: intent?.contractVersion ?? EXECUTIVE_INTENT_CONTRACT_VERSION,
            semanticModelVersion: semanticModel?.versionMetadata.semanticModelVersion ?? null,
            stateEngineVersion: state?.engineVersion ?? null,
            owner: EXECUTIVE_INTENT_CONTEXT_ENGINE_OWNER,
        }),
        timestamp,
    };
    return createExecutiveIntentContext({
        ...partialContext,
        summary: buildContextSummary(partialContext),
    });
}
function buildPipelineFromText(text, workspaceId, owner, timestamp) {
    const extraction = extractExecutiveIntent(Object.freeze({ text, workspaceId, owner, languageCode: "en", generatedAt: timestamp }));
    const semanticModel = buildExecutiveIntentSemanticModel(extraction, timestamp).model;
    const intent = extraction.primaryIntent;
    const state = intent
        ? resolveExecutiveIntentStateResult(Object.freeze({
            intent,
            intentId: intent.intentId,
            workspaceId,
            evaluatedAt: timestamp,
            proposedLifecycleTransition: null,
        }))
        : null;
    return createExecutiveIntentContextAnalysisInput({
        intent,
        state,
        semanticModel,
        timestamp,
    });
}
export function buildContextFromExample(exampleId, workspaceId, owner, timestamp) {
    const example = getIntentContextCanonicalExample(exampleId);
    if (!example)
        return null;
    if (example.expectedUnknown && !example.customText && !example.semanticExampleId) {
        return buildExecutiveIntentContext(createExecutiveIntentContextAnalysisInput({
            intent: null,
            state: null,
            semanticModel: null,
            timestamp,
        }));
    }
    let text = example.customText;
    if (!text && example.semanticExampleId) {
        const semanticExample = getIntentSemanticCanonicalExample(example.semanticExampleId);
        const extractionRef = semanticExample?.extractionExampleId
            ? getIntentExtractionCanonicalExample(semanticExample.extractionExampleId)
            : null;
        text = semanticExample?.customText ?? extractionRef?.text ?? null;
    }
    if (!text)
        return null;
    return buildExecutiveIntentContext(buildPipelineFromText(text, workspaceId, owner, timestamp));
}
export function buildContextProbe(timestamp = "2026-01-01T00:00:00.000Z") {
    return (buildContextFromExample("single-workspace", "ws-context-probe", "executive-context-probe", timestamp) ??
        buildExecutiveIntentContext(createExecutiveIntentContextAnalysisInput({
            intent: null,
            state: null,
            semanticModel: null,
            timestamp,
        })));
}
export function getExecutiveIntentContextEngineVersionMetadata() {
    return Object.freeze({
        contextEngineVersion: EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION,
        owner: EXECUTIVE_INTENT_CONTEXT_ENGINE_OWNER,
    });
}
export const ExecutiveIntentContextEngine = Object.freeze({
    buildExecutiveIntentContext,
    buildWorkspaceContext,
    buildBusinessContext,
    buildObjectContext,
    buildRelationshipContext,
    buildConstraintContext,
    buildStakeholderContext,
    validateContext,
    buildContextSummary,
    buildContextProbe,
    buildContextFromExample,
    getExecutiveIntentContextEngineVersionMetadata,
    version: EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION,
    rules: EXECUTIVE_INTENT_CONTEXT_ENGINE_RULES,
    tags: EXECUTIVE_INTENT_CONTEXT_ENGINE_TAGS,
});
export { createExecutiveIntentContextAnalysisInput };
