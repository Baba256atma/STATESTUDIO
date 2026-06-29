/**
 * APP-3:1 — Executive Intent Contract.
 * Immutable architecture vocabulary — metadata-only foundation for APP-3.
 */
import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import { EXECUTIVE_INTENT_ARCHITECTURE_VERSION, EXECUTIVE_INTENT_CONTRACT_VERSION, EXECUTIVE_INTENT_FUTURE_COMPATIBILITY, EXECUTIVE_INTENT_FUTURE_PHASE_KEYS, EXECUTIVE_INTENT_LIFECYCLE_DEFINITIONS, EXECUTIVE_INTENT_LOG_PREFIX, EXECUTIVE_INTENT_MANDATORY_METADATA_FIELDS, EXECUTIVE_INTENT_MUST_NOT_OWN, EXECUTIVE_INTENT_PLATFORM, EXECUTIVE_INTENT_RESERVED_FIELDS, EXECUTIVE_INTENT_RESERVED_IDS, EXECUTIVE_INTENT_RESERVED_NAMESPACES, EXECUTIVE_INTENT_SOURCE, EXECUTIVE_INTENT_TAGS, EXECUTIVE_INTENT_TERMINAL_LIFECYCLE_STAGES, EXECUTIVE_INTENT_TERMINAL_STATUSES, INTENT_CATEGORY_KEYS, INTENT_LIFECYCLE_KEYS, INTENT_PRIORITY_KEYS, INTENT_RELATION_TYPE_KEYS, INTENT_SCOPE_KEYS, INTENT_SOURCE_KEYS, INTENT_STATUS_KEYS, } from "./executiveIntentConstants.ts";
import { isIntentCategory, isIntentLifecycleStage, isIntentPriority, isIntentRelationType, isIntentScope, isIntentSource, isIntentStatus, validateExecutiveIntentShape, validateIntentMetadataShape, } from "./executiveIntentValidation.ts";
export { EXECUTIVE_INTENT_ARCHITECTURE_VERSION, EXECUTIVE_INTENT_CONTRACT_VERSION, EXECUTIVE_INTENT_FUTURE_COMPATIBILITY, EXECUTIVE_INTENT_FUTURE_PHASE_KEYS, EXECUTIVE_INTENT_LIFECYCLE_DEFINITIONS, EXECUTIVE_INTENT_LOG_PREFIX, EXECUTIVE_INTENT_MANDATORY_METADATA_FIELDS, EXECUTIVE_INTENT_MUST_NOT_OWN, EXECUTIVE_INTENT_PLATFORM, EXECUTIVE_INTENT_RESERVED_FIELDS, EXECUTIVE_INTENT_RESERVED_IDS, EXECUTIVE_INTENT_RESERVED_NAMESPACES, EXECUTIVE_INTENT_SOURCE, EXECUTIVE_INTENT_TAGS, EXECUTIVE_INTENT_TERMINAL_LIFECYCLE_STAGES, EXECUTIVE_INTENT_TERMINAL_STATUSES, INTENT_CATEGORY_KEYS, INTENT_LIFECYCLE_KEYS, INTENT_PRIORITY_KEYS, INTENT_RELATION_TYPE_KEYS, INTENT_SCOPE_KEYS, INTENT_SOURCE_KEYS, INTENT_STATUS_KEYS, isIntentCategory, isIntentLifecycleStage, isIntentPriority, isIntentRelationType, isIntentScope, isIntentSource, isIntentStatus, validateExecutiveIntentShape, validateIntentMetadataShape, };
export const EXECUTIVE_INTENT_IDENTITY = Object.freeze({
    appId: "APP-3",
    title: "Executive Intent",
    version: EXECUTIVE_INTENT_CONTRACT_VERSION,
    status: "build",
    certificationStatus: "pending",
    freezeState: "open",
    architectureVersion: EXECUTIVE_INTENT_ARCHITECTURE_VERSION,
});
export const EXECUTIVE_INTENT_FORBIDDEN_PATTERNS = Object.freeze([
    ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
    "app-2-scenario-intelligence/",
    "executive-time/executiveTimeContextEngine",
    "executive-time/executiveTimeStateEngine",
    "dashboard/",
    "assistant/",
    "components/",
    ".tsx",
    "IntentExtractionEngine",
    "IntentReasoningEngine",
    "IntentScoringEngine",
]);
export const EXECUTIVE_INTENT_SELF_MANIFEST = Object.freeze({
    stageId: "APP-3/1",
    title: "Executive Intent Contract & Types",
    goal: "Immutable APP-3 architecture contract — intent language, types, validation, and certification only.",
    lifecycle: "build",
    allowedFiles: Object.freeze([
        "frontend/app/lib/executiveIntent/executiveIntentTypes.ts",
        "frontend/app/lib/executiveIntent/executiveIntentConstants.ts",
        "frontend/app/lib/executiveIntent/executiveIntentContract.ts",
        "frontend/app/lib/executiveIntent/executiveIntentValidation.ts",
        "frontend/app/lib/executiveIntent/executiveIntentContract.test.ts",
        "docs/app-3-1-executive-intent-contract-report.md",
    ]),
    forbiddenPatterns: EXECUTIVE_INTENT_FORBIDDEN_PATTERNS,
    prerequisites: Object.freeze(["APP-1", "APP-2", "DS", "INT"]),
    runtimePath: "library-only",
    tags: EXECUTIVE_INTENT_TAGS,
});
export const EXECUTIVE_INTENT_MODULE_PATHS = Object.freeze(EXECUTIVE_INTENT_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts")));
export const EXECUTIVE_INTENT_FREEZE_RULES = Object.freeze({
    contractImmutable: true,
    publicInterfacesExtendOnly: true,
    breakingChangesForbidden: true,
    metadataOnly: true,
    noRuntimeExecution: true,
});
export const EXECUTIVE_INTENT_PUBLIC_API_RULES = Object.freeze({
    interfaceOnly: true,
    noHiddenState: true,
    noSingletonMutation: true,
    noDirectEngineImportsForConsumers: true,
    noStorage: true,
    noReact: true,
    noAssistantIntegration: true,
    noDashboardIntegration: true,
    noScenarioIntegration: true,
    metadataOnly: true,
});
export function createIntentVersionExample(timestamp) {
    return Object.freeze({
        versionId: "intent-version-example-001",
        semanticVersion: "1.0.0",
        createdAt: timestamp,
        readOnly: true,
    });
}
export function createIntentScopeExample() {
    return Object.freeze({
        scope: "enterprise",
        scopeRef: "enterprise-root",
        label: "Enterprise",
        readOnly: true,
    });
}
export function resolveExecutiveIntentMetadataExample(timestamp = new Date(0).toISOString()) {
    return Object.freeze({
        intentId: "intent-example-001",
        title: "Increase enterprise revenue resilience",
        summary: "Executive intent to strengthen revenue resilience across core business units.",
        description: "Metadata-only contract example describing what the executive is trying to achieve.",
        createdAt: timestamp,
        updatedAt: timestamp,
        version: createIntentVersionExample(timestamp),
        owner: "executive-owner-example",
        workspaceId: "ws-example-001",
        tags: Object.freeze([
            Object.freeze({ tagId: "tag-strategic", label: "Strategic", readOnly: true }),
        ]),
        priority: "high",
        status: "active",
        scope: createIntentScopeExample(),
        category: "strategic",
        source: "executive",
        lifecycle: "activated",
        references: Object.freeze([]),
        assumptions: Object.freeze([]),
        constraints: Object.freeze([]),
        dependencies: Object.freeze([]),
        evidence: Object.freeze([]),
        confidenceReference: null,
        conflictReference: null,
        customMetadata: Object.freeze({}),
        readOnly: true,
    });
}
export function resolveExecutiveIntentExample(timestamp = new Date(0).toISOString()) {
    const metadata = resolveExecutiveIntentMetadataExample(timestamp);
    return Object.freeze({
        intentId: metadata.intentId,
        workspaceId: metadata.workspaceId,
        metadata,
        relations: Object.freeze([]),
        readOnly: true,
        contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
    });
}
export function getExecutiveIntentFutureCompatibility() {
    return EXECUTIVE_INTENT_FUTURE_COMPATIBILITY;
}
export function getExecutiveIntentContractVersionMetadata() {
    return Object.freeze({
        contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
        architectureVersion: EXECUTIVE_INTENT_ARCHITECTURE_VERSION,
        platform: EXECUTIVE_INTENT_PLATFORM,
        owner: EXECUTIVE_INTENT_SOURCE,
    });
}
export const ExecutiveIntentContract = Object.freeze({
    identity: EXECUTIVE_INTENT_IDENTITY,
    manifest: EXECUTIVE_INTENT_SELF_MANIFEST,
    freezeRules: EXECUTIVE_INTENT_FREEZE_RULES,
    publicApiRules: EXECUTIVE_INTENT_PUBLIC_API_RULES,
    resolveExecutiveIntentExample,
    resolveExecutiveIntentMetadataExample,
    getExecutiveIntentFutureCompatibility,
    getExecutiveIntentContractVersionMetadata,
    version: EXECUTIVE_INTENT_CONTRACT_VERSION,
});
