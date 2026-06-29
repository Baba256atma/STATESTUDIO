/**
 * APP-3:15 — Executive Intent Platform Freeze Manifest.
 * Immutable release metadata — freeze only, no runtime changes.
 */
import { EXECUTIVE_INTENT_ARCHITECTURE_VERSION, EXECUTIVE_INTENT_CONTRACT_VERSION, EXECUTIVE_INTENT_FUTURE_COMPATIBILITY, EXECUTIVE_INTENT_PLATFORM, } from "./executiveIntentConstants.ts";
import { EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION } from "./executiveIntentAssistantTypes.ts";
import { EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION } from "./executiveIntentClassificationTypes.ts";
import { EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION } from "./executiveIntentConfidenceTypes.ts";
import { EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION } from "./executiveIntentConflictTypes.ts";
import { EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION } from "./executiveIntentDashboardTypes.ts";
import { EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION } from "./executiveIntentDependencyTypes.ts";
import { EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION } from "./executiveIntentEvolutionTypes.ts";
import { EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION } from "./executiveIntentExtractionTypes.ts";
import { EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION, EXECUTIVE_INTENT_PLATFORM_IDENTITY, PLATFORM_CERTIFICATION_FUTURE_EXTENSION, } from "./executiveIntentPlatformCertificationContract.ts";
import { EXECUTIVE_INTENT_REASONING_ENGINE_VERSION } from "./executiveIntentReasoningTypes.ts";
import { EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION } from "./executiveIntentSemanticTypes.ts";
import { EXECUTIVE_INTENT_STATE_ENGINE_VERSION } from "./executiveIntentStateTypes.ts";
export const EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION = "APP-3/15";
export const EXECUTIVE_INTENT_PLATFORM_STATUS = "FROZEN";
export const EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS = Object.freeze([
    "[APP3_15]",
    "[EXECUTIVE_INTENT_PLATFORM_FROZEN]",
    "[PLATFORM_FREEZE]",
    "[IMMUTABLE_PLATFORM]",
    "[PUBLIC_PLATFORM]",
    "[ARCHITECTURE_FROZEN]",
    "[CERTIFIED]",
    "[RELEASE_READY]",
]);
export const EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES = Object.freeze({
    contractImmutable: true,
    architectureImmutable: true,
    publicApiImmutable: true,
    breakingChangesForbidden: true,
    internalEnginesPrivate: true,
    reasoningConsumerOnlyForPresentation: true,
    noNewIntelligence: true,
    noStorage: true,
    noMutation: true,
    noReact: true,
    readOnly: true,
    deterministic: true,
});
export const EXECUTIVE_INTENT_PLATFORM_FUTURE_EXTENSION_POLICY = Object.freeze({
    policyId: "APP-3-PLATFORM-EXTENSION",
    rule: "Future enhancements must extend the platform without modifying frozen APP-3 core architecture.",
    permitted: Object.freeze(["consumer_bindings", "presentation_wrappers", "metadata_extensions"]),
    forbidden: Object.freeze([
        "engine_rewrites",
        "public_api_breaking_changes",
        "export_surface_changes",
        "direct_engine_consumer_access",
        "presentation_bypass",
        "new_intelligence_in_freeze_layer",
    ]),
});
export const EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST = Object.freeze({
    backwardCompatible: Object.freeze({ compatible: true, runtimeBehaviorChanged: false }),
    forwardCompatible: Object.freeze({ compatible: true, reservedExtensionPoints: true, runtimeBehaviorChanged: false }),
    assistant: Object.freeze({ compatible: true, mustUseReasoningOrRunner: true, runtimeBehaviorChanged: false }),
    dashboard: Object.freeze({ compatible: true, mustUseReasoningOrRunner: true, runtimeBehaviorChanged: false }),
    executiveTime: Object.freeze({ compatible: true, readOnlyReferenceOnly: true, runtimeBehaviorChanged: false }),
    executiveMemory: Object.freeze({ compatible: true, mustUseRunner: true, runtimeBehaviorChanged: false }),
    governance: Object.freeze({ compatible: true, mustUseRunner: true, runtimeBehaviorChanged: false }),
    decisionJournal: Object.freeze({ compatible: true, mustUseRunner: true, runtimeBehaviorChanged: false }),
    workspace: Object.freeze({ compatible: true, mustUseRunner: true, runtimeBehaviorChanged: false }),
    layArchitecture: Object.freeze({ compatible: true, mustUsePublicSurface: true, runtimeBehaviorChanged: false }),
});
export const EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_SURFACE = Object.freeze([
    "ExecutiveIntentPlatformRunner",
    "ExecutiveIntentReasoning",
    "ExecutiveIntentAssistantIntegration",
    "ExecutiveIntentDashboardIntegration",
]);
export const EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
    "runExecutiveIntentPlatform",
    "runExecutiveIntentPlatformCertification",
    "runExecutiveIntentPlatformRegression",
    "getExecutiveIntentPlatformManifest",
    "runExecutiveIntentPlatformFinalCertification",
]);
export const EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS = Object.freeze([
    "extractExecutiveIntent",
    "classifyExecutiveIntent",
    "buildExecutiveIntentSemanticModel",
    "resolveExecutiveIntentStateResult",
    "detectIntentConflicts",
    "detectIntentDependencies",
    "buildIntentEvolution",
    "buildIntentConfidence",
    "calculateIntentConfidence",
    "ExecutiveIntentExtractionEngine",
    "ExecutiveIntentClassificationEngine",
    "ExecutiveIntentSemanticModelEngine",
    "ExecutiveIntentConflictEngine",
    "ExecutiveIntentDependencyEngine",
    "ExecutiveIntentEvolutionEngine",
    "ExecutiveIntentConfidenceEngine",
    "ExecutiveIntentStateEngine",
]);
export const EXECUTIVE_INTENT_PLATFORM_SUPPORTED_CONSUMERS = Object.freeze([
    "assistant",
    "dashboard",
    "workspace",
    "executive_memory",
    "governance",
    "decision_journal",
    "executive_time",
    "lay",
]);
export const EXECUTIVE_INTENT_PLATFORM_INTERNAL_DEPENDENCIES = Object.freeze([
    "APP-3/1 Contract",
    "APP-3/2 State Engine",
    "APP-3/4 Extraction Engine",
    "APP-3/5 Semantic Model",
    "APP-3/6 Classification Engine",
    "APP-3/7 Conflict Engine",
    "APP-3/8 Dependency Engine",
    "APP-3/9 Evolution Engine",
    "APP-3/10 Confidence Engine",
    "APP-3/11 Reasoning Engine",
    "APP-3/12 Assistant Integration",
    "APP-3/13 Dashboard Integration",
    "APP-3/14 Platform Certification",
]);
function buildArchitectureHash(components) {
    const payload = Object.entries(components)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}:${value}`)
        .join("|");
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `arch-${hash.toString(16).padStart(8, "0")}`;
}
export function buildExecutiveIntentPlatformFreezeManifest(certificationDate) {
    const frozenComponents = Object.freeze({
        contract: EXECUTIVE_INTENT_CONTRACT_VERSION,
        state: EXECUTIVE_INTENT_STATE_ENGINE_VERSION,
        extraction: EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION,
        semantic: EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION,
        classification: EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION,
        conflict: EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION,
        dependency: EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION,
        evolution: EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION,
        confidence: EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION,
        reasoning: EXECUTIVE_INTENT_REASONING_ENGINE_VERSION,
        assistant: EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION,
        dashboard: EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION,
        platformCertification: EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION,
        freeze: EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
    });
    return Object.freeze({
        freezeVersion: EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
        platformId: EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformId,
        platformName: EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformName,
        platformVersion: EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
        architectureVersion: EXECUTIVE_INTENT_ARCHITECTURE_VERSION,
        contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
        certificationVersion: EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION,
        nexoraPlatform: EXECUTIVE_INTENT_PLATFORM,
        certificationDate,
        platformStatus: EXECUTIVE_INTENT_PLATFORM_STATUS,
        frozenPublicSurface: EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_SURFACE,
        frozenPublicApis: EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_APIS,
        supportedConsumers: EXECUTIVE_INTENT_PLATFORM_SUPPORTED_CONSUMERS,
        internalDependencies: EXECUTIVE_INTENT_PLATFORM_INTERNAL_DEPENDENCIES,
        forbiddenConsumerImports: EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS,
        frozenComponents,
        frozenLayers: Object.freeze({
            contract: Object.freeze(["Contract", "State"]),
            engines: Object.freeze([
                "Extraction",
                "Semantic",
                "Classification",
                "Conflict",
                "Dependency",
                "Evolution",
                "Confidence",
            ]),
            reasoning: Object.freeze(["Reasoning Engine"]),
            integration: Object.freeze(["Assistant Integration", "Dashboard Integration"]),
            certification: Object.freeze(["Platform Certification", "Platform Freeze"]),
        }),
        freezeRules: EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES,
        futureExtensionPolicy: EXECUTIVE_INTENT_PLATFORM_FUTURE_EXTENSION_POLICY,
        compatibilityManifest: EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST,
        futureCompatibility: EXECUTIVE_INTENT_FUTURE_COMPATIBILITY,
        reservedExtensions: PLATFORM_CERTIFICATION_FUTURE_EXTENSION,
        releaseTags: EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS,
        architectureHash: buildArchitectureHash(frozenComponents),
        metadataOnly: true,
    });
}
export const ExecutiveIntentPlatformFreezeManifestBuilder = Object.freeze({
    buildExecutiveIntentPlatformFreezeManifest,
});
