/**
 * APP-9:1 — Confidence Evolution Platform contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  CONFIDENCE_EVOLUTION_CERTIFICATION_METADATA,
  CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS,
  CONFIDENCE_EVOLUTION_COMPATIBILITY_REGISTRY,
  CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS,
  CONFIDENCE_EVOLUTION_EXTENSION_REGISTRY,
  CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY,
  CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS,
  CONFIDENCE_EVOLUTION_METADATA_EXTENSION_REGISTRY,
  CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
  CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_CAPABILITIES,
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES,
  CONFIDENCE_EVOLUTION_PLATFORM_TAGS,
  CONFIDENCE_EVOLUTION_RELEASE_METADATA,
  CONFIDENCE_EVOLUTION_SOURCE_KEYS,
} from "./confidenceEvolutionConstants.ts";
import {
  createConfidenceEvolutionFoundation,
  isConfidenceEvolutionPlatformInitialized,
} from "./confidenceEvolutionFoundation.ts";
import {
  getConfidenceEvolutionRegistry,
  getConfidenceEvolutionRegistrySnapshot,
} from "./confidenceEvolutionRegistry.ts";
import type {
  ConfidenceEvolutionFutureCompatibility,
  ConfidenceEvolutionPlatformIdentity,
  ConfidenceEvolutionPlatformValidationReport,
  ConfidenceRecord,
} from "./confidenceEvolutionTypes.ts";
import {
  isConfidenceChangeReason,
  isConfidenceLevel,
  isConfidenceSource,
  validateConfidenceRecordContractShape,
  validateEvolutionIdentity,
  validatePlatformIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
} from "./confidenceEvolutionValidation.ts";

export type ConfidenceEvolutionPlatformManifest = Readonly<{
  manifestVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION;
  stageManifest: StageManifest;
  releaseMetadata: typeof CONFIDENCE_EVOLUTION_RELEASE_METADATA;
  certificationMetadata: typeof CONFIDENCE_EVOLUTION_CERTIFICATION_METADATA;
  futureCompatibility: typeof CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY;
  extensionRegistry: typeof CONFIDENCE_EVOLUTION_EXTENSION_REGISTRY;
  metadataExtensionRegistry: typeof CONFIDENCE_EVOLUTION_METADATA_EXTENSION_REGISTRY;
  compatibilityRegistry: typeof CONFIDENCE_EVOLUTION_COMPATIBILITY_REGISTRY;
  platformCapabilities: typeof CONFIDENCE_EVOLUTION_PLATFORM_CAPABILITIES;
  platformPrinciples: typeof CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES;
  registrySnapshot: ReturnType<typeof getConfidenceEvolutionRegistrySnapshot>;
  platformInitialized: boolean;
  readOnly: true;
}>;

export const CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY: ConfidenceEvolutionPlatformIdentity = Object.freeze({
  appId: "APP-9",
  title: "Confidence Evolution",
  platformId: "confidence-evolution-platform",
  version: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION,
});

export const CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "scenario-timeline/",
  "decision-timeline/",
  "business-timeline/",
  "decision-journal/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "ConfidenceChart",
  "ConfidenceEditor",
  "vectorSearch",
  "openai",
  "prompt(",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "APP-9/1",
  title: "Confidence Evolution Platform Foundation",
  goal: "Immutable APP-9 architecture foundation — confidence record contracts, registry, validation, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/confidence-evolution/confidenceEvolutionConstants.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionTypes.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionValidation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionRegistry.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionFoundation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionContracts.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionRunner.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionFoundation.test.ts",
    "docs/app-9-1-confidence-evolution-foundation.md",
  ]),
  forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1", "APP-2", "APP-3", "APP-4", "APP-5", "APP-6", "APP-7", "APP-8", "DS", "INT"]),
  runtimePath: "library-only" as const,
  tags: CONFIDENCE_EVOLUTION_PLATFORM_TAGS,
} satisfies StageManifest);

export const CONFIDENCE_EVOLUTION_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeExecution: true,
  noVisualization: true,
  noTrendAnalysis: true,
  noPersistence: true,
  noAiReasoning: true,
} as const);

export const CONFIDENCE_EVOLUTION_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noTrendAnalysis: true,
  noVisualization: true,
  noRuntime: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  noDecisionJournalIntegration: true,
  noDecisionTimelineIntegration: true,
  metadataOnly: true,
} as const);

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

export function resolveConfidenceRecordExample(timestamp: string = DEFAULT_TIME): ConfidenceRecord {
  return Object.freeze({
    id: "confidence-evolution-record-strategy-pivot-001",
    workspaceId: "ws-confidence-evolution-001",
    decisionId: "decision-strategy-pivot-001",
    scenarioId: "scenario-expansion-001",
    journalEntryId: "decision-journal-entry-strategy-pivot-001",
    title: "Confidence before strategy pivot approval",
    confidenceLevel: "medium",
    confidenceScore: 0.62,
    source: "manual",
    reason: "executive_review",
    notes:
      "Executive confidence moderated after partner pipeline review — channel strategy remains viable but onboarding timeline introduces uncertainty.",
    evidenceReferences: Object.freeze([
      "market-analysis-q4-2025",
      "partner-pipeline-assessment-2025",
    ]),
    previousConfidence: "high",
    metadata: Object.freeze({
      metadataVersion: "APP-9/1",
      owner: "confidence-evolution-platform-foundation",
      extensions: Object.freeze({ reviewCycle: "quarterly" }),
      readOnly: true as const,
    }),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function getConfidenceEvolutionContractVersionMetadata(): Readonly<{
  contractVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION;
}> {
  return Object.freeze({
    contractVersion: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
    architectureVersion: CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION,
  });
}

export function getConfidenceEvolutionFutureCompatibility(): ConfidenceEvolutionFutureCompatibility {
  return CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY;
}

export function buildConfidenceEvolutionManifest(
  stageManifest: StageManifest,
  timestamp: string
): ConfidenceEvolutionPlatformManifest {
  void timestamp;
  return Object.freeze({
    manifestVersion: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
    architectureVersion: CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION,
    stageManifest,
    releaseMetadata: CONFIDENCE_EVOLUTION_RELEASE_METADATA,
    certificationMetadata: CONFIDENCE_EVOLUTION_CERTIFICATION_METADATA,
    futureCompatibility: CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY,
    extensionRegistry: CONFIDENCE_EVOLUTION_EXTENSION_REGISTRY,
    metadataExtensionRegistry: CONFIDENCE_EVOLUTION_METADATA_EXTENSION_REGISTRY,
    compatibilityRegistry: CONFIDENCE_EVOLUTION_COMPATIBILITY_REGISTRY,
    platformCapabilities: CONFIDENCE_EVOLUTION_PLATFORM_CAPABILITIES,
    platformPrinciples: CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES,
    registrySnapshot: getConfidenceEvolutionRegistrySnapshot(),
    platformInitialized: isConfidenceEvolutionPlatformInitialized(),
    readOnly: true as const,
  });
}

export function validateConfidenceEvolutionManifest(
  manifest: ConfidenceEvolutionPlatformManifest
): ReturnType<typeof validatePlatformIdentity> {
  const stageValidation = validateStageManifest(manifest.stageManifest);
  const issues = [...stageValidation.issues.map((entry) =>
    Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const })
  )];
  if (manifest.manifestVersion !== CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION) {
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

export function getConfidenceEvolutionManifest(
  timestamp: string = DEFAULT_TIME
): ConfidenceEvolutionPlatformManifest {
  if (!isConfidenceEvolutionPlatformInitialized()) {
    createConfidenceEvolutionFoundation(timestamp);
  }
  return buildConfidenceEvolutionManifest(CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST, timestamp);
}

export function validateConfidenceEvolution(
  timestamp: string = DEFAULT_TIME
): ConfidenceEvolutionPlatformValidationReport {
  const issues: ConfidenceEvolutionPlatformValidationReport["issues"] = [];

  const identityValidation = validatePlatformIdentity(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY);
  if (!identityValidation.valid) {
    issues.push(...identityValidation.issues);
  }

  const versionValidation = validateVersionCompatibility(CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  if (!isConfidenceEvolutionPlatformInitialized()) {
    createConfidenceEvolutionFoundation(timestamp);
  }

  const manifest = buildConfidenceEvolutionManifest(CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST, timestamp);
  const manifestValidation = validateConfidenceEvolutionManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }

  const recordValidation = validateConfidenceRecordContractShape(resolveConfidenceRecordExample(timestamp));
  if (!recordValidation.valid) {
    issues.push(...recordValidation.issues);
  }

  const evolutionIdentityValidation = validateEvolutionIdentity("confidence-evolution-ws-confidence-evolution-001");
  if (!evolutionIdentityValidation.valid) {
    issues.push(...evolutionIdentityValidation.issues);
  }

  const workspaceIsolationValidation = validateWorkspaceIsolation(
    "ws-confidence-evolution-001",
    "ws-confidence-evolution-001"
  );
  if (!workspaceIsolationValidation.valid) {
    issues.push(...workspaceIsolationValidation.issues);
  }

  const registry = getConfidenceEvolutionRegistrySnapshot();
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
    platformInitialized: isConfidenceEvolutionPlatformInitialized(),
    registryValid:
      registry.confidenceLevelCount > 0 && registry.sourceCount > 0 && registry.changeReasonCount > 0,
    manifestValid: manifestValidation.valid,
    compatibilityValid: CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.metadataOnly === true,
    workspaceIsolationValid: workspaceIsolationValidation.valid,
    evolutionIdentityValid: evolutionIdentityValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export {
  createConfidenceEvolutionFoundation as createConfidenceEvolution,
  isConfidenceEvolutionPlatformInitialized as isConfidenceEvolutionReady,
} from "./confidenceEvolutionFoundation.ts";
export { registerConfidenceEvolution } from "./confidenceEvolutionRegistry.ts";

export const ConfidenceEvolutionPlatformContract = Object.freeze({
  resolveConfidenceRecordExample,
  validateConfidenceEvolution,
  getConfidenceEvolutionManifest,
  getConfidenceEvolutionContractVersionMetadata,
  getConfidenceEvolutionFutureCompatibility,
  isConfidenceLevel,
  isConfidenceSource,
  isConfidenceChangeReason,
  identity: CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY,
  version: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  tags: CONFIDENCE_EVOLUTION_PLATFORM_TAGS,
  mandatoryRecordFields: CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS,
  mustNotOwn: CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
  principles: CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES,
});

export {
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_TAGS,
  CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
  CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY,
  CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES,
  CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS,
  CONFIDENCE_EVOLUTION_SOURCE_KEYS,
  CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS,
  getConfidenceEvolutionRegistry,
};
