/**
 * APP-3.3.1 — Executive Intent context construction rules.
 * Deterministic mapping from intent, state, and semantic model — no inference.
 */
export const EXECUTIVE_INTENT_CONTEXT_RULES_VERSION = "APP-3.3.1";
const SCOPE_LABELS = Object.freeze({
    enterprise: "Enterprise",
    workspace: "Workspace",
    business_unit: "Business Unit",
    department: "Department",
    project: "Project",
    object: "Object",
    cross_department: "Cross Department",
    unknown: "Unknown",
});
const INTENT_SCOPE_TO_CONTEXT_SCOPE = Object.freeze({
    enterprise: "enterprise",
    business_unit: "business_unit",
    department: "department",
    project: "project",
    object: "object",
    scenario: "workspace",
    custom: "unknown",
});
export function resolveContextScope(intent, semanticModel) {
    if (semanticModel?.flags.multipleGoals)
        return "cross_department";
    const scope = intent?.metadata.scope.scope ?? null;
    if (scope && INTENT_SCOPE_TO_CONTEXT_SCOPE[scope]) {
        const mapped = INTENT_SCOPE_TO_CONTEXT_SCOPE[scope];
        if (mapped !== "unknown")
            return mapped;
    }
    if (semanticModel?.flags.explicitScope)
        return "workspace";
    if (semanticModel?.businessObjects.length && semanticModel.businessObjects.length > 1) {
        return "cross_department";
    }
    if (intent?.metadata.scope.scopeRef)
        return "object";
    return "unknown";
}
export function resolveContextScopeLabel(scope) {
    return SCOPE_LABELS[scope];
}
export function resolveWorkspaceLabel(workspaceId, intent) {
    if (intent?.metadata.title)
        return `${intent.metadata.title} workspace context`;
    if (workspaceId)
        return `Workspace ${workspaceId}`;
    return "Unknown workspace";
}
export function resolveBusinessDomainLabel(semanticModel, intent) {
    if (semanticModel?.businessDimension)
        return semanticModel.businessDimension;
    if (intent?.metadata.category)
        return intent.metadata.category;
    return "unknown";
}
export function resolveKnownContextEntries(intent, semanticModel, scope) {
    const entries = [];
    if (intent?.metadata.title)
        entries.push(`Intent title: ${intent.metadata.title}`);
    if (intent?.metadata.summary)
        entries.push(`Intent summary: ${intent.metadata.summary}`);
    if (scope !== "unknown")
        entries.push(`Scope: ${SCOPE_LABELS[scope]}`);
    if (semanticModel?.summary.primaryGoalLabel) {
        entries.push(`Primary goal: ${semanticModel.summary.primaryGoalLabel}`);
    }
    if (semanticModel) {
        for (const item of semanticModel.knownInformation) {
            if (!entries.includes(item))
                entries.push(item);
        }
    }
    return Object.freeze([...entries]);
}
export function resolveUnknownContextEntries(intent, semanticModel) {
    const entries = [];
    if (!intent)
        entries.push("Intent record unavailable.");
    if (!semanticModel)
        entries.push("Semantic model unavailable.");
    if (semanticModel) {
        for (const unknown of semanticModel.unknowns) {
            entries.push(`${unknown.label}: ${unknown.reason}`);
        }
    }
    if (intent && intent.metadata.constraints.length === 0 && !semanticModel?.flags.hasConstraints) {
        entries.push("No explicit constraints declared.");
    }
    return Object.freeze([...entries]);
}
export function resolveStateReadinessLabel(state) {
    return state?.readiness ?? null;
}
export function resolveStateCategoryLabel(state) {
    return state?.state.stateCategory ?? null;
}
export function collectContextRulesApplied() {
    return Object.freeze([
        "resolveContextScope",
        "resolveWorkspaceLabel",
        "resolveBusinessDomainLabel",
        "resolveKnownContextEntries",
        "resolveUnknownContextEntries",
        "explicit_intent_metadata_only",
        "explicit_semantic_model_only",
        "explicit_state_metadata_only",
    ]);
}
export const ExecutiveIntentContextRules = Object.freeze({
    resolveContextScope,
    resolveContextScopeLabel,
    resolveWorkspaceLabel,
    resolveBusinessDomainLabel,
    resolveKnownContextEntries,
    resolveUnknownContextEntries,
    resolveStateReadinessLabel,
    resolveStateCategoryLabel,
    collectContextRulesApplied,
    version: EXECUTIVE_INTENT_CONTEXT_RULES_VERSION,
});
