/**
 * APP-3.15.1 — Executive Intent Platform Refresh Manifest.
 * Updated immutable platform metadata — administrative refresh only.
 */

import {
  EXECUTIVE_INTENT_ARCHITECTURE_VERSION,
  EXECUTIVE_INTENT_CONTRACT_VERSION,
  EXECUTIVE_INTENT_PLATFORM,
} from "./executiveIntentConstants.ts";
import { EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION } from "./executiveIntentContextTypes.ts";
import {
  EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION,
  EXECUTIVE_INTENT_PLATFORM_IDENTITY,
} from "./executiveIntentPlatformCertificationContract.ts";
import {
  buildExecutiveIntentPlatformFreezeManifest,
  EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST,
  EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS,
  EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES,
  EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
  EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_APIS,
  EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_SURFACE,
  EXECUTIVE_INTENT_PLATFORM_STATUS,
  type ExecutiveIntentPlatformFreezeManifest,
} from "./executiveIntentPlatformFreezeManifest.ts";

export const EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION = "APP-3.15.1" as const;
export const EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_VERSION = "APP-3.15.1-compat" as const;
export const EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS = "FROZEN_WITH_EXTENSIONS" as const;

export const EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS = Object.freeze([
  "[APP3_15_1]",
  "[EXECUTIVE_INTENT_PLATFORM_REFRESH]",
  "[PLATFORM_REFRESH]",
  "[MAINTENANCE_CERTIFIED]",
  "[CONTEXT_EXTENSION_REGISTERED]",
  "[ARCHITECTURE_REFRESHED]",
  "[BACKWARD_COMPATIBLE]",
  "[RELEASE_READY]",
] as const);

export const EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({
    extensionId: "executive-intent-context-engine",
    exportName: "ExecutiveIntentContextEngine",
    version: EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION,
    status: "optional_extension" as const,
    certified: true,
    nonBreaking: true,
    readOnly: true,
    futureCompatible: true,
    primaryIntelligence: false,
    consumes: Object.freeze(["ExecutiveIntent", "IntentResolutionResult", "ExecutiveIntentSemanticModel"]),
    readOnlyGuarantee: true,
  }),
] as const);

export const EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX = Object.freeze({
  app315Freeze: Object.freeze({
    compatible: true,
    freezeVersion: EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
    runtimeBehaviorChanged: false,
  }),
  app331ContextEngine: Object.freeze({
    compatible: true,
    contextEngineVersion: EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION,
    optionalExtension: true,
    runtimeBehaviorChanged: false,
  }),
  assistant: Object.freeze({
    compatible: true,
    mustUseReasoningOrRunner: true,
    contextOptional: true,
    runtimeBehaviorChanged: false,
  }),
  dashboard: Object.freeze({
    compatible: true,
    mustUseReasoningOrRunner: true,
    contextOptional: true,
    runtimeBehaviorChanged: false,
  }),
  executiveTime: Object.freeze({
    compatible: true,
    readOnlyReferenceOnly: true,
    runtimeBehaviorChanged: false,
  }),
  scenarioIntelligence: Object.freeze({
    compatible: true,
    mustUsePublicSurface: true,
    runtimeBehaviorChanged: false,
  }),
  executiveMemory: Object.freeze({
    compatible: true,
    mustUseRunner: true,
    contextOptional: true,
    runtimeBehaviorChanged: false,
  }),
  governance: Object.freeze({
    compatible: true,
    mustUseRunner: true,
    runtimeBehaviorChanged: false,
  }),
  layArchitecture: Object.freeze({
    compatible: true,
    mustUsePublicSurface: true,
    runtimeBehaviorChanged: false,
  }),
  backwardCompatible: Object.freeze({
    compatible: true,
    breakingChanges: false,
    runtimeBehaviorChanged: false,
  }),
});

export const EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES = Object.freeze({
  permittedConsumers: Object.freeze([
    "ExecutiveIntentPlatformRunner",
    "ExecutiveIntentReasoning",
    "ExecutiveIntentContextEngine",
    "ExecutiveIntentAssistantIntegration",
    "ExecutiveIntentDashboardIntegration",
  ]),
  primaryIntelligenceInterface: "ExecutiveIntentReasoning" as const,
  optionalExtensions: Object.freeze(["ExecutiveIntentContextEngine"]),
  forbiddenDirectEngineImports: EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS,
  reasoningConsumerOnlyForPresentation: true,
  readOnly: true,
});

export const EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA = Object.freeze({
  runnerVersion: EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
  refreshVersion: EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION,
  platformStatus: EXECUTIVE_INTENT_PLATFORM_STATUS,
  refreshStatus: EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS,
  registeredExtensions: Object.freeze(
    EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY.map((entry) => entry.exportName)
  ),
  optionalFeatures: Object.freeze(["ExecutiveIntentContextEngine"]),
  publicSurface: Object.freeze([
    ...EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_SURFACE,
    "ExecutiveIntentContextEngine",
  ]),
  frozenPublicApis: EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_APIS,
  compatibilityVersion: EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_VERSION,
  runtimeBehaviorChanged: false,
  metadataOnly: true,
});

export type ExecutiveIntentPlatformExtensionEntry =
  (typeof EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY)[number];

export type ExecutiveIntentPlatformRefreshManifest = Readonly<{
  refreshVersion: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION;
  compatibilityVersion: typeof EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_VERSION;
  platformId: typeof EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformId;
  platformName: typeof EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformName;
  freezeVersion: typeof EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION;
  platformStatus: typeof EXECUTIVE_INTENT_PLATFORM_STATUS;
  refreshStatus: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS;
  architectureVersion: typeof EXECUTIVE_INTENT_ARCHITECTURE_VERSION;
  contractVersion: typeof EXECUTIVE_INTENT_CONTRACT_VERSION;
  certificationVersion: typeof EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION;
  contextEngineVersion: typeof EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION;
  nexoraPlatform: typeof EXECUTIVE_INTENT_PLATFORM;
  refreshDate: string;
  releaseTags: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS;
  extensionRegistry: typeof EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY;
  compatibilityMatrix: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX;
  consumerRules: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES;
  runnerMetadata: typeof EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA;
  freezeManifest: ExecutiveIntentPlatformFreezeManifest;
  freezeRules: typeof EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES;
  legacyCompatibilityManifest: typeof EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST;
  refreshHash: string;
  metadataOnly: true;
  readOnly: true;
}>;

function buildRefreshHash(payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `refresh-${hash.toString(16).padStart(8, "0")}`;
}

export function buildExecutiveIntentPlatformRefreshManifest(
  refreshDate: string
): ExecutiveIntentPlatformRefreshManifest {
  const freezeManifest = buildExecutiveIntentPlatformFreezeManifest(refreshDate);
  const payload = [
    EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION,
    EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION,
    freezeManifest.architectureHash,
    EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY.map((entry) => entry.extensionId).join("|"),
  ].join(":");
  return Object.freeze({
    refreshVersion: EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION,
    compatibilityVersion: EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_VERSION,
    platformId: EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformId,
    platformName: EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformName,
    freezeVersion: EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
    platformStatus: EXECUTIVE_INTENT_PLATFORM_STATUS,
    refreshStatus: EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS,
    architectureVersion: EXECUTIVE_INTENT_ARCHITECTURE_VERSION,
    contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
    certificationVersion: EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION,
    contextEngineVersion: EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION,
    nexoraPlatform: EXECUTIVE_INTENT_PLATFORM,
    refreshDate,
    releaseTags: EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS,
    extensionRegistry: EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY,
    compatibilityMatrix: EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX,
    consumerRules: EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES,
    runnerMetadata: EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA,
    freezeManifest,
    freezeRules: EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES,
    legacyCompatibilityManifest: EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST,
    refreshHash: buildRefreshHash(payload),
    metadataOnly: true,
    readOnly: true as const,
  });
}

export const ExecutiveIntentPlatformRefreshManifestBuilder = Object.freeze({
  buildExecutiveIntentPlatformRefreshManifest,
});
