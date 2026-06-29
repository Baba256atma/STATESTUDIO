/**
 * APP-6:1 — Decision Timeline Platform contracts.
 * Immutable architecture vocabulary — foundation for APP-6.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DECISION_TIMELINE_CATEGORY_KEYS,
  DECISION_TIMELINE_EVENT_TYPE_KEYS,
  DECISION_TIMELINE_EXTENSION_REGISTRY,
  DECISION_TIMELINE_FUTURE_COMPATIBILITY,
  DECISION_TIMELINE_MANDATORY_DECISION_FIELDS,
  DECISION_TIMELINE_MANDATORY_EVENT_FIELDS,
  DECISION_TIMELINE_METADATA_EXTENSION_REGISTRY,
  DECISION_TIMELINE_MUST_NOT_OWN,
  DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  DECISION_TIMELINE_PLATFORM_CAPABILITIES,
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_PRINCIPLES,
  DECISION_TIMELINE_PLATFORM_TAGS,
  DECISION_TIMELINE_CERTIFICATION_METADATA,
  DECISION_TIMELINE_COMPATIBILITY_REGISTRY,
  DECISION_TIMELINE_RELEASE_METADATA,
  DECISION_TIMELINE_SOURCE_KEYS,
  DECISION_TIMELINE_STATUS_KEYS,
} from "./decisionTimelineConstants.ts";
import {
  createDecisionTimelineFoundation,
  isDecisionTimelinePlatformInitialized,
} from "./decisionTimelineFoundation.ts";
import {
  getDecisionTimelineRegistry,
  getDecisionTimelineRegistrySnapshot,
} from "./decisionTimelineRegistry.ts";
import type {
  Decision,
  DecisionEvent,
  DecisionFutureCompatibility,
  DecisionPlatformIdentity,
  DecisionPlatformValidationReport,
  DecisionTimelineEntry,
  DecisionTypeRegistration,
} from "./decisionTimelineTypes.ts";
import {
  isDecisionCategory,
  isDecisionEventType,
  isDecisionSource,
  isDecisionStatus,
  validateDecisionContractShape,
  validateDecisionEventContractShape,
  validateDecisionTimelineEntryShape,
  validatePlatformIdentity,
  validateTimelineIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
} from "./decisionTimelineValidation.ts";

export type DecisionTimelinePlatformManifest = Readonly<{
  manifestVersion: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION;
  stageManifest: StageManifest;
  releaseMetadata: typeof DECISION_TIMELINE_RELEASE_METADATA;
  certificationMetadata: typeof DECISION_TIMELINE_CERTIFICATION_METADATA;
  futureCompatibility: typeof DECISION_TIMELINE_FUTURE_COMPATIBILITY;
  extensionRegistry: typeof DECISION_TIMELINE_EXTENSION_REGISTRY;
  metadataExtensionRegistry: typeof DECISION_TIMELINE_METADATA_EXTENSION_REGISTRY;
  compatibilityRegistry: typeof DECISION_TIMELINE_COMPATIBILITY_REGISTRY;
  platformCapabilities: typeof DECISION_TIMELINE_PLATFORM_CAPABILITIES;
  platformPrinciples: typeof DECISION_TIMELINE_PLATFORM_PRINCIPLES;
  registrySnapshot: ReturnType<typeof getDecisionTimelineRegistrySnapshot>;
  platformInitialized: boolean;
  readOnly: true;
}>;

export const DECISION_TIMELINE_PLATFORM_IDENTITY: DecisionPlatformIdentity = Object.freeze({
  appId: "APP-6",
  title: "Decision Timeline",
  platformId: "decision-timeline-platform",
  version: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
});

export const DECISION_TIMELINE_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "DecisionChart",
  "DecisionViewer",
  "ReplayEngine",
  "OutcomeTracker",
  "vectorSearch",
  "semanticSearch",
] as const);

export const DECISION_TIMELINE_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/1",
  title: "Decision Timeline Platform Foundation",
  goal: "Immutable APP-6 architecture foundation — decision contracts, registry, validation, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/decision-timeline/decisionTimelineConstants.ts",
    "frontend/app/lib/decision-timeline/decisionTimelineTypes.ts",
    "frontend/app/lib/decision-timeline/decisionTimelineValidation.ts",
    "frontend/app/lib/decision-timeline/decisionTimelineRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionTimelineFoundation.ts",
    "frontend/app/lib/decision-timeline/decisionTimelineContracts.ts",
    "frontend/app/lib/decision-timeline/decisionTimelineRunner.ts",
    "frontend/app/lib/decision-timeline/decisionTimelineFoundation.test.ts",
    "docs/app-6-1-decision-timeline-foundation-report.md",
  ]),
  forbiddenPatterns: DECISION_TIMELINE_PLATFORM_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1", "APP-2", "APP-3", "APP-4", "APP-5", "DS", "INT"]),
  runtimePath: "library-only" as const,
  tags: DECISION_TIMELINE_PLATFORM_TAGS,
} satisfies StageManifest);

export const DECISION_TIMELINE_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeExecution: true,
  noAnalytics: true,
  noReplay: true,
  noPersistence: true,
} as const);

export const DECISION_TIMELINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noAnalytics: true,
  noReplay: true,
  noSearch: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
  metadataOnly: true,
} as const);

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

export function resolveDecisionExample(timestamp: string = DEFAULT_TIME): Decision {
  return Object.freeze({
    decisionId: "decision-eu-expansion-commit-001",
    workspaceId: "ws-decision-timeline-001",
    status: "committed",
    source: "executive_direct",
    category: "strategic",
    title: "Approve European expansion",
    summary: "Executive commitment to proceed with European market expansion in Q3.",
    decidedAt: timestamp,
    contractVersion: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
    decisionTypeId: "decision-type-executive-commitment",
    tags: Object.freeze(["expansion", "europe", "strategic"]),
    readOnly: true as const,
  });
}

export function resolveDecisionEventExample(timestamp: string = DEFAULT_TIME): DecisionEvent {
  return Object.freeze({
    eventId: "decision-event-001",
    decisionId: "decision-eu-expansion-commit-001",
    workspaceId: "ws-decision-timeline-001",
    eventType: "decision_committed",
    title: "Decision committed",
    summary: "Executive decision formally committed to the timeline.",
    occurredAt: timestamp,
    sourceModule: "decision-timeline-platform-foundation",
    contractVersion: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function resolveDecisionTimelineEntryExample(timestamp: string = DEFAULT_TIME): DecisionTimelineEntry {
  return Object.freeze({
    entryId: "decision-timeline-entry-001",
    decisionId: "decision-eu-expansion-commit-001",
    workspaceId: "ws-decision-timeline-001",
    event: resolveDecisionEventExample(timestamp),
    sequenceNumber: 0,
    recordedAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveDecisionTypeRegistrationExample(): DecisionTypeRegistration {
  return Object.freeze({
    typeId: "decision-type-executive-commitment",
    label: "Executive Commitment Decision",
    description: "Canonical executive commitment decision type for APP-6 foundation.",
    supportedStatuses: DECISION_TIMELINE_STATUS_KEYS,
    supportedCategories: DECISION_TIMELINE_CATEGORY_KEYS,
    supportedEventTypes: DECISION_TIMELINE_EVENT_TYPE_KEYS,
    metadata: Object.freeze({ owner: "decision-timeline-platform-foundation" }),
  });
}

export function getDecisionTimelineContractVersionMetadata(): Readonly<{
  contractVersion: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION;
}> {
  return Object.freeze({
    contractVersion: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
    architectureVersion: DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  });
}

export function getDecisionTimelineFutureCompatibility(): DecisionFutureCompatibility {
  return DECISION_TIMELINE_FUTURE_COMPATIBILITY;
}

export function buildDecisionTimelineManifest(
  stageManifest: StageManifest,
  timestamp: string
): DecisionTimelinePlatformManifest {
  void timestamp;
  return Object.freeze({
    manifestVersion: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
    architectureVersion: DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
    stageManifest,
    releaseMetadata: DECISION_TIMELINE_RELEASE_METADATA,
    certificationMetadata: DECISION_TIMELINE_CERTIFICATION_METADATA,
    futureCompatibility: DECISION_TIMELINE_FUTURE_COMPATIBILITY,
    extensionRegistry: DECISION_TIMELINE_EXTENSION_REGISTRY,
    metadataExtensionRegistry: DECISION_TIMELINE_METADATA_EXTENSION_REGISTRY,
    compatibilityRegistry: DECISION_TIMELINE_COMPATIBILITY_REGISTRY,
    platformCapabilities: DECISION_TIMELINE_PLATFORM_CAPABILITIES,
    platformPrinciples: DECISION_TIMELINE_PLATFORM_PRINCIPLES,
    registrySnapshot: getDecisionTimelineRegistrySnapshot(),
    platformInitialized: isDecisionTimelinePlatformInitialized(),
    readOnly: true as const,
  });
}

export function validateDecisionTimelineManifest(
  manifest: DecisionTimelinePlatformManifest
): ReturnType<typeof validatePlatformIdentity> {
  const stageValidation = validateStageManifest(manifest.stageManifest);
  const issues = [...stageValidation.issues.map((entry) =>
    Object.freeze({
      code: entry.code,
      message: entry.message,
      readOnly: true as const,
    })
  )];
  if (manifest.manifestVersion !== DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_manifest",
        message: "Manifest version mismatch.",
        field: "manifestVersion",
        readOnly: true as const,
      })
    );
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export function getDecisionTimelineManifest(
  timestamp: string = DEFAULT_TIME
): DecisionTimelinePlatformManifest {
  if (!isDecisionTimelinePlatformInitialized()) {
    createDecisionTimelineFoundation(timestamp);
  }
  return buildDecisionTimelineManifest(DECISION_TIMELINE_PLATFORM_SELF_MANIFEST, timestamp);
}

export function validateDecisionTimelineFoundation(
  timestamp: string = DEFAULT_TIME
): DecisionPlatformValidationReport {
  const issues: DecisionPlatformValidationReport["issues"] = [];

  const identityValidation = validatePlatformIdentity(DECISION_TIMELINE_PLATFORM_IDENTITY);
  if (!identityValidation.valid) {
    issues.push(...identityValidation.issues);
  }

  const versionValidation = validateVersionCompatibility(DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  if (!isDecisionTimelinePlatformInitialized()) {
    createDecisionTimelineFoundation(timestamp);
  }

  const manifest = buildDecisionTimelineManifest(DECISION_TIMELINE_PLATFORM_SELF_MANIFEST, timestamp);
  const manifestValidation = validateDecisionTimelineManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }

  const decisionValidation = validateDecisionContractShape(resolveDecisionExample(timestamp));
  if (!decisionValidation.valid) {
    issues.push(...decisionValidation.issues);
  }

  const eventValidation = validateDecisionEventContractShape(resolveDecisionEventExample(timestamp));
  if (!eventValidation.valid) {
    issues.push(...eventValidation.issues);
  }

  const entryValidation = validateDecisionTimelineEntryShape(resolveDecisionTimelineEntryExample(timestamp));
  if (!entryValidation.valid) {
    issues.push(...entryValidation.issues);
  }

  const timelineIdentityValidation = validateTimelineIdentity("decision-timeline-ws-decision-timeline-001");
  if (!timelineIdentityValidation.valid) {
    issues.push(...timelineIdentityValidation.issues);
  }

  const workspaceIsolationValidation = validateWorkspaceIsolation(
    "ws-decision-timeline-001",
    "ws-decision-timeline-001"
  );
  if (!workspaceIsolationValidation.valid) {
    issues.push(...workspaceIsolationValidation.issues);
  }

  const registry = getDecisionTimelineRegistrySnapshot();
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
    platformInitialized: isDecisionTimelinePlatformInitialized(),
    registryValid: registry.decisionTypeCount >= 0 && registry.categoryCount > 0 && registry.statusTypeCount > 0,
    manifestValid: manifestValidation.valid,
    compatibilityValid: DECISION_TIMELINE_FUTURE_COMPATIBILITY.metadataOnly === true,
    workspaceIsolationValid: workspaceIsolationValidation.valid,
    timelineIdentityValid: timelineIdentityValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const DecisionTimelinePlatformContract = Object.freeze({
  resolveDecisionExample,
  resolveDecisionEventExample,
  resolveDecisionTimelineEntryExample,
  resolveDecisionTypeRegistrationExample,
  validateDecisionTimelineFoundation,
  getDecisionTimelineManifest,
  getDecisionTimelineContractVersionMetadata,
  getDecisionTimelineFutureCompatibility,
  isDecisionStatus,
  isDecisionSource,
  isDecisionCategory,
  isDecisionEventType,
  identity: DECISION_TIMELINE_PLATFORM_IDENTITY,
  version: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  tags: DECISION_TIMELINE_PLATFORM_TAGS,
  mandatoryDecisionFields: DECISION_TIMELINE_MANDATORY_DECISION_FIELDS,
  mandatoryEventFields: DECISION_TIMELINE_MANDATORY_EVENT_FIELDS,
  mustNotOwn: DECISION_TIMELINE_MUST_NOT_OWN,
  principles: DECISION_TIMELINE_PLATFORM_PRINCIPLES,
});

export {
  DECISION_TIMELINE_STATUS_KEYS,
  DECISION_TIMELINE_SOURCE_KEYS,
  DECISION_TIMELINE_CATEGORY_KEYS,
  DECISION_TIMELINE_EVENT_TYPE_KEYS,
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_TAGS,
  DECISION_TIMELINE_MUST_NOT_OWN,
  DECISION_TIMELINE_FUTURE_COMPATIBILITY,
  DECISION_TIMELINE_PLATFORM_PRINCIPLES,
  getDecisionTimelineRegistry,
};
