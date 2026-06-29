/**
 * APP-7:1 — Business Timeline Platform contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_CATEGORY_KEYS,
  BUSINESS_TIMELINE_CERTIFICATION_METADATA,
  BUSINESS_TIMELINE_COMPATIBILITY_REGISTRY,
  BUSINESS_TIMELINE_EVENT_TYPE_KEYS,
  BUSINESS_TIMELINE_EXTENSION_REGISTRY,
  BUSINESS_TIMELINE_FUTURE_COMPATIBILITY,
  BUSINESS_TIMELINE_IMPORTANCE_KEYS,
  BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS,
  BUSINESS_TIMELINE_METADATA_EXTENSION_REGISTRY,
  BUSINESS_TIMELINE_MUST_NOT_OWN,
  BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  BUSINESS_TIMELINE_PLATFORM_CAPABILITIES,
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_PRINCIPLES,
  BUSINESS_TIMELINE_PLATFORM_TAGS,
  BUSINESS_TIMELINE_RELEASE_METADATA,
  BUSINESS_TIMELINE_SOURCE_KEYS,
  BUSINESS_TIMELINE_STATUS_KEYS,
} from "./businessTimelineConstants.ts";
import {
  createBusinessTimelineFoundation,
  isBusinessTimelinePlatformInitialized,
} from "./businessTimelineFoundation.ts";
import {
  getBusinessTimelineRegistry,
  getBusinessTimelineRegistrySnapshot,
} from "./businessTimelineRegistry.ts";
import type {
  BusinessEvent,
  BusinessEventTypeRegistration,
  BusinessFutureCompatibility,
  BusinessPlatformIdentity,
  BusinessPlatformValidationReport,
} from "./businessTimelineTypes.ts";
import {
  isBusinessEventCategory,
  isBusinessEventImportance,
  isBusinessEventSource,
  isBusinessEventStatus,
  isBusinessEventType,
  validateBusinessEventContractShape,
  validatePlatformIdentity,
  validateTimelineIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
} from "./businessTimelineValidation.ts";

export type BusinessTimelinePlatformManifest = Readonly<{
  manifestVersion: typeof BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION;
  stageManifest: StageManifest;
  releaseMetadata: typeof BUSINESS_TIMELINE_RELEASE_METADATA;
  certificationMetadata: typeof BUSINESS_TIMELINE_CERTIFICATION_METADATA;
  futureCompatibility: typeof BUSINESS_TIMELINE_FUTURE_COMPATIBILITY;
  extensionRegistry: typeof BUSINESS_TIMELINE_EXTENSION_REGISTRY;
  metadataExtensionRegistry: typeof BUSINESS_TIMELINE_METADATA_EXTENSION_REGISTRY;
  compatibilityRegistry: typeof BUSINESS_TIMELINE_COMPATIBILITY_REGISTRY;
  platformCapabilities: typeof BUSINESS_TIMELINE_PLATFORM_CAPABILITIES;
  platformPrinciples: typeof BUSINESS_TIMELINE_PLATFORM_PRINCIPLES;
  registrySnapshot: ReturnType<typeof getBusinessTimelineRegistrySnapshot>;
  platformInitialized: boolean;
  readOnly: true;
}>;

export const BUSINESS_TIMELINE_PLATFORM_IDENTITY: BusinessPlatformIdentity = Object.freeze({
  appId: "APP-7",
  title: "Business Timeline",
  platformId: "business-timeline-platform",
  version: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
});

export const BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "scenario-timeline/",
  "decision-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "BusinessChart",
  "TimelineRenderer",
  "vectorSearch",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "APP-7/1",
  title: "Business Timeline Platform Foundation",
  goal: "Immutable APP-7 architecture foundation — business event contracts, registry, validation, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/business-timeline/businessTimelineConstants.ts",
    "frontend/app/lib/business-timeline/businessTimelineTypes.ts",
    "frontend/app/lib/business-timeline/businessTimelineValidation.ts",
    "frontend/app/lib/business-timeline/businessTimelineRegistry.ts",
    "frontend/app/lib/business-timeline/businessTimelineFoundation.ts",
    "frontend/app/lib/business-timeline/businessTimelineContracts.ts",
    "frontend/app/lib/business-timeline/businessTimelineRunner.ts",
    "frontend/app/lib/business-timeline/businessTimelineFoundation.test.ts",
    "docs/app-7-1-business-timeline-foundation.md",
  ]),
  forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1", "APP-2", "APP-3", "APP-4", "APP-5", "APP-6", "DS", "INT"]),
  runtimePath: "library-only" as const,
  tags: BUSINESS_TIMELINE_PLATFORM_TAGS,
} satisfies StageManifest);

export const BUSINESS_TIMELINE_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeExecution: true,
  noVisualization: true,
  noAnalytics: true,
  noPersistence: true,
} as const);

export const BUSINESS_TIMELINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noAnalytics: true,
  noVisualization: true,
  noRuntime: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  metadataOnly: true,
} as const);

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

export function resolveBusinessEventExample(timestamp: string = DEFAULT_TIME): BusinessEvent {
  return Object.freeze({
    id: "business-event-company-founded-001",
    workspaceId: "ws-business-timeline-001",
    title: "Company founded",
    description: "Organization established and registered as a legal entity.",
    category: "corporate",
    type: "milestone",
    importance: "critical",
    status: "completed",
    source: "manual",
    createdAt: timestamp,
    occurredAt: timestamp,
    createdBy: "business-timeline-platform-foundation",
    tags: Object.freeze(["founding", "corporate", "milestone"]),
    metadata: Object.freeze({
      metadataVersion: "APP-7/1",
      owner: "business-timeline-platform-foundation",
      extensions: Object.freeze({ jurisdiction: "EU" }),
      readOnly: true as const,
    }),
    version: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function resolveBusinessEventTypeRegistrationExample(): BusinessEventTypeRegistration {
  return Object.freeze({
    typeId: "business-type-corporate-milestone",
    label: "Corporate Milestone",
    description: "Canonical corporate milestone business event type for APP-7 foundation.",
    supportedCategories: BUSINESS_TIMELINE_CATEGORY_KEYS,
    supportedStatuses: BUSINESS_TIMELINE_STATUS_KEYS,
    supportedImportanceLevels: BUSINESS_TIMELINE_IMPORTANCE_KEYS,
    metadata: Object.freeze({ owner: "business-timeline-platform-foundation" }),
  });
}

export function getBusinessTimelineContractVersionMetadata(): Readonly<{
  contractVersion: typeof BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION;
}> {
  return Object.freeze({
    contractVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    architectureVersion: BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  });
}

export function getBusinessTimelineFutureCompatibility(): BusinessFutureCompatibility {
  return BUSINESS_TIMELINE_FUTURE_COMPATIBILITY;
}

export function buildBusinessTimelineManifest(
  stageManifest: StageManifest,
  timestamp: string
): BusinessTimelinePlatformManifest {
  void timestamp;
  return Object.freeze({
    manifestVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    architectureVersion: BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
    stageManifest,
    releaseMetadata: BUSINESS_TIMELINE_RELEASE_METADATA,
    certificationMetadata: BUSINESS_TIMELINE_CERTIFICATION_METADATA,
    futureCompatibility: BUSINESS_TIMELINE_FUTURE_COMPATIBILITY,
    extensionRegistry: BUSINESS_TIMELINE_EXTENSION_REGISTRY,
    metadataExtensionRegistry: BUSINESS_TIMELINE_METADATA_EXTENSION_REGISTRY,
    compatibilityRegistry: BUSINESS_TIMELINE_COMPATIBILITY_REGISTRY,
    platformCapabilities: BUSINESS_TIMELINE_PLATFORM_CAPABILITIES,
    platformPrinciples: BUSINESS_TIMELINE_PLATFORM_PRINCIPLES,
    registrySnapshot: getBusinessTimelineRegistrySnapshot(),
    platformInitialized: isBusinessTimelinePlatformInitialized(),
    readOnly: true as const,
  });
}

export function validateBusinessTimelineManifest(
  manifest: BusinessTimelinePlatformManifest
): ReturnType<typeof validatePlatformIdentity> {
  const stageValidation = validateStageManifest(manifest.stageManifest);
  const issues = [...stageValidation.issues.map((entry) =>
    Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const })
  )];
  if (manifest.manifestVersion !== BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_manifest",
        message: "Manifest version mismatch.",
        field: "manifestVersion",
        readOnly: true as const,
      })
    );
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function getBusinessTimelineManifest(
  timestamp: string = DEFAULT_TIME
): BusinessTimelinePlatformManifest {
  if (!isBusinessTimelinePlatformInitialized()) {
    createBusinessTimelineFoundation(timestamp);
  }
  return buildBusinessTimelineManifest(BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST, timestamp);
}

export function validateBusinessTimeline(
  timestamp: string = DEFAULT_TIME
): BusinessPlatformValidationReport {
  const issues: BusinessPlatformValidationReport["issues"] = [];

  const identityValidation = validatePlatformIdentity(BUSINESS_TIMELINE_PLATFORM_IDENTITY);
  if (!identityValidation.valid) {
    issues.push(...identityValidation.issues);
  }

  const versionValidation = validateVersionCompatibility(BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  if (!isBusinessTimelinePlatformInitialized()) {
    createBusinessTimelineFoundation(timestamp);
  }

  const manifest = buildBusinessTimelineManifest(BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST, timestamp);
  const manifestValidation = validateBusinessTimelineManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }

  const eventValidation = validateBusinessEventContractShape(resolveBusinessEventExample(timestamp));
  if (!eventValidation.valid) {
    issues.push(...eventValidation.issues);
  }

  const timelineIdentityValidation = validateTimelineIdentity("business-timeline-ws-business-timeline-001");
  if (!timelineIdentityValidation.valid) {
    issues.push(...timelineIdentityValidation.issues);
  }

  const workspaceIsolationValidation = validateWorkspaceIsolation(
    "ws-business-timeline-001",
    "ws-business-timeline-001"
  );
  if (!workspaceIsolationValidation.valid) {
    issues.push(...workspaceIsolationValidation.issues);
  }

  const registry = getBusinessTimelineRegistrySnapshot();
  if (registry.registryVersion.trim().length === 0) {
    issues.push(
      Object.freeze({
        code: "invalid_registry",
        message: "Registry version is missing.",
        field: "registryVersion",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    platformInitialized: isBusinessTimelinePlatformInitialized(),
    registryValid:
      registry.categoryCount > 0 && registry.statusTypeCount > 0 && registry.importanceTypeCount > 0,
    manifestValid: manifestValidation.valid,
    compatibilityValid: BUSINESS_TIMELINE_FUTURE_COMPATIBILITY.metadataOnly === true,
    workspaceIsolationValid: workspaceIsolationValidation.valid,
    timelineIdentityValid: timelineIdentityValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export {
  createBusinessTimelineFoundation as createBusinessTimeline,
  isBusinessTimelinePlatformInitialized as isBusinessTimelineReady,
} from "./businessTimelineFoundation.ts";
export { registerBusinessTimeline } from "./businessTimelineRegistry.ts";

export const BusinessTimelinePlatformContract = Object.freeze({
  resolveBusinessEventExample,
  resolveBusinessEventTypeRegistrationExample,
  validateBusinessTimeline,
  getBusinessTimelineManifest,
  getBusinessTimelineContractVersionMetadata,
  getBusinessTimelineFutureCompatibility,
  isBusinessEventCategory,
  isBusinessEventType,
  isBusinessEventImportance,
  isBusinessEventStatus,
  isBusinessEventSource,
  identity: BUSINESS_TIMELINE_PLATFORM_IDENTITY,
  version: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  tags: BUSINESS_TIMELINE_PLATFORM_TAGS,
  mandatoryEventFields: BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS,
  mustNotOwn: BUSINESS_TIMELINE_MUST_NOT_OWN,
  principles: BUSINESS_TIMELINE_PLATFORM_PRINCIPLES,
});

export {
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_TAGS,
  BUSINESS_TIMELINE_MUST_NOT_OWN,
  BUSINESS_TIMELINE_FUTURE_COMPATIBILITY,
  BUSINESS_TIMELINE_PLATFORM_PRINCIPLES,
  getBusinessTimelineRegistry,
};
