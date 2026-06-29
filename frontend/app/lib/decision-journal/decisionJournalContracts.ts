/**
 * APP-8:1 — Decision Journal Platform contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DECISION_JOURNAL_CERTIFICATION_METADATA,
  DECISION_JOURNAL_COMPATIBILITY_REGISTRY,
  DECISION_JOURNAL_CONFIDENCE_KEYS,
  DECISION_JOURNAL_EXTENSION_REGISTRY,
  DECISION_JOURNAL_FUTURE_COMPATIBILITY,
  DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS,
  DECISION_JOURNAL_METADATA_EXTENSION_REGISTRY,
  DECISION_JOURNAL_MUST_NOT_OWN,
  DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION,
  DECISION_JOURNAL_PLATFORM_CAPABILITIES,
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_PRINCIPLES,
  DECISION_JOURNAL_PLATFORM_TAGS,
  DECISION_JOURNAL_RELEASE_METADATA,
  DECISION_JOURNAL_SOURCE_KEYS,
  DECISION_JOURNAL_STATUS_KEYS,
} from "./decisionJournalConstants.ts";
import {
  createDecisionJournalFoundation,
  isDecisionJournalPlatformInitialized,
} from "./decisionJournalFoundation.ts";
import {
  getDecisionJournalRegistry,
  getDecisionJournalRegistrySnapshot,
} from "./decisionJournalRegistry.ts";
import type {
  DecisionJournalEntry,
  DecisionJournalFutureCompatibility,
  DecisionJournalPlatformIdentity,
  DecisionJournalPlatformValidationReport,
} from "./decisionJournalTypes.ts";
import {
  isDecisionJournalConfidence,
  isDecisionJournalSource,
  isDecisionJournalStatus,
  validateDecisionJournalEntryContractShape,
  validateJournalIdentity,
  validatePlatformIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
} from "./decisionJournalValidation.ts";

export type DecisionJournalPlatformManifest = Readonly<{
  manifestVersion: typeof DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION;
  stageManifest: StageManifest;
  releaseMetadata: typeof DECISION_JOURNAL_RELEASE_METADATA;
  certificationMetadata: typeof DECISION_JOURNAL_CERTIFICATION_METADATA;
  futureCompatibility: typeof DECISION_JOURNAL_FUTURE_COMPATIBILITY;
  extensionRegistry: typeof DECISION_JOURNAL_EXTENSION_REGISTRY;
  metadataExtensionRegistry: typeof DECISION_JOURNAL_METADATA_EXTENSION_REGISTRY;
  compatibilityRegistry: typeof DECISION_JOURNAL_COMPATIBILITY_REGISTRY;
  platformCapabilities: typeof DECISION_JOURNAL_PLATFORM_CAPABILITIES;
  platformPrinciples: typeof DECISION_JOURNAL_PLATFORM_PRINCIPLES;
  registrySnapshot: ReturnType<typeof getDecisionJournalRegistrySnapshot>;
  platformInitialized: boolean;
  readOnly: true;
}>;

export const DECISION_JOURNAL_PLATFORM_IDENTITY: DecisionJournalPlatformIdentity = Object.freeze({
  appId: "APP-8",
  title: "Decision Journal",
  platformId: "decision-journal-platform",
  version: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION,
});

export const DECISION_JOURNAL_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "scenario-timeline/",
  "decision-timeline/",
  "business-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "JournalEditor",
  "JournalChart",
  "vectorSearch",
  "openai",
  "prompt(",
] as const);

export const DECISION_JOURNAL_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "APP-8/1",
  title: "Decision Journal Platform Foundation",
  goal: "Immutable APP-8 architecture foundation — journal entry contracts, registry, validation, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/decision-journal/decisionJournalConstants.ts",
    "frontend/app/lib/decision-journal/decisionJournalTypes.ts",
    "frontend/app/lib/decision-journal/decisionJournalValidation.ts",
    "frontend/app/lib/decision-journal/decisionJournalRegistry.ts",
    "frontend/app/lib/decision-journal/decisionJournalFoundation.ts",
    "frontend/app/lib/decision-journal/decisionJournalContracts.ts",
    "frontend/app/lib/decision-journal/decisionJournalRunner.ts",
    "frontend/app/lib/decision-journal/decisionJournalFoundation.test.ts",
    "docs/app-8-1-decision-journal-foundation.md",
  ]),
  forbiddenPatterns: DECISION_JOURNAL_PLATFORM_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1", "APP-2", "APP-3", "APP-4", "APP-5", "APP-6", "APP-7", "DS", "INT"]),
  runtimePath: "library-only" as const,
  tags: DECISION_JOURNAL_PLATFORM_TAGS,
} satisfies StageManifest);

export const DECISION_JOURNAL_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeExecution: true,
  noVisualization: true,
  noAnalytics: true,
  noPersistence: true,
  noAiReasoning: true,
} as const);

export const DECISION_JOURNAL_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noAnalytics: true,
  noVisualization: true,
  noRuntime: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  noDecisionTimelineIntegration: true,
  metadataOnly: true,
} as const);

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

export function resolveDecisionJournalEntryExample(timestamp: string = DEFAULT_TIME): DecisionJournalEntry {
  return Object.freeze({
    id: "decision-journal-entry-strategy-pivot-001",
    workspaceId: "ws-decision-journal-001",
    decisionId: "decision-strategy-pivot-001",
    scenarioId: "scenario-expansion-001",
    title: "Strategy pivot rationale",
    summary: "Executive rationale for pivoting from direct sales to channel partnerships.",
    rationale:
      "Channel partnerships reduce customer acquisition cost while preserving enterprise credibility in target markets.",
    assumptions: Object.freeze([
      "Partner network can reach 60% of target accounts within 12 months.",
      "Margin impact remains acceptable with volume commitments.",
    ]),
    alternatives: Object.freeze([
      "Continue direct sales expansion.",
      "Acquire a regional distributor.",
      "Delay pivot until next fiscal year.",
    ]),
    evidenceReferences: Object.freeze([
      "market-analysis-q4-2025",
      "partner-pipeline-assessment-2025",
    ]),
    acceptedRisks: Object.freeze([
      "Partner onboarding may delay revenue recognition.",
      "Brand control requires tighter governance.",
    ]),
    expectedOutcome: "Achieve 25% revenue growth through partner-sourced pipeline within 18 months.",
    confidence: "high",
    tradeoffs: Object.freeze([
      "Lower direct customer intimacy.",
      "Higher operational complexity in partner management.",
    ]),
    constraints: Object.freeze([
      "Must preserve existing enterprise SLA commitments.",
      "Budget cap for partner incentives in FY2026.",
    ]),
    author: "chief-strategy-officer",
    reviewers: Object.freeze(["ceo", "cfo", "cro"]),
    tags: Object.freeze(["strategy", "partnerships", "pivot"]),
    metadata: Object.freeze({
      metadataVersion: "APP-8/1",
      owner: "decision-journal-platform-foundation",
      extensions: Object.freeze({ reviewCycle: "quarterly" }),
      readOnly: true as const,
    }),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function getDecisionJournalContractVersionMetadata(): Readonly<{
  contractVersion: typeof DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION;
}> {
  return Object.freeze({
    contractVersion: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
    architectureVersion: DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION,
  });
}

export function getDecisionJournalFutureCompatibility(): DecisionJournalFutureCompatibility {
  return DECISION_JOURNAL_FUTURE_COMPATIBILITY;
}

export function buildDecisionJournalManifest(
  stageManifest: StageManifest,
  timestamp: string
): DecisionJournalPlatformManifest {
  void timestamp;
  return Object.freeze({
    manifestVersion: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
    architectureVersion: DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION,
    stageManifest,
    releaseMetadata: DECISION_JOURNAL_RELEASE_METADATA,
    certificationMetadata: DECISION_JOURNAL_CERTIFICATION_METADATA,
    futureCompatibility: DECISION_JOURNAL_FUTURE_COMPATIBILITY,
    extensionRegistry: DECISION_JOURNAL_EXTENSION_REGISTRY,
    metadataExtensionRegistry: DECISION_JOURNAL_METADATA_EXTENSION_REGISTRY,
    compatibilityRegistry: DECISION_JOURNAL_COMPATIBILITY_REGISTRY,
    platformCapabilities: DECISION_JOURNAL_PLATFORM_CAPABILITIES,
    platformPrinciples: DECISION_JOURNAL_PLATFORM_PRINCIPLES,
    registrySnapshot: getDecisionJournalRegistrySnapshot(),
    platformInitialized: isDecisionJournalPlatformInitialized(),
    readOnly: true as const,
  });
}

export function validateDecisionJournalManifest(
  manifest: DecisionJournalPlatformManifest
): ReturnType<typeof validatePlatformIdentity> {
  const stageValidation = validateStageManifest(manifest.stageManifest);
  const issues = [...stageValidation.issues.map((entry) =>
    Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const })
  )];
  if (manifest.manifestVersion !== DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION) {
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

export function getDecisionJournalManifest(
  timestamp: string = DEFAULT_TIME
): DecisionJournalPlatformManifest {
  if (!isDecisionJournalPlatformInitialized()) {
    createDecisionJournalFoundation(timestamp);
  }
  return buildDecisionJournalManifest(DECISION_JOURNAL_PLATFORM_SELF_MANIFEST, timestamp);
}

export function validateDecisionJournal(
  timestamp: string = DEFAULT_TIME
): DecisionJournalPlatformValidationReport {
  const issues: DecisionJournalPlatformValidationReport["issues"] = [];

  const identityValidation = validatePlatformIdentity(DECISION_JOURNAL_PLATFORM_IDENTITY);
  if (!identityValidation.valid) {
    issues.push(...identityValidation.issues);
  }

  const versionValidation = validateVersionCompatibility(DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  if (!isDecisionJournalPlatformInitialized()) {
    createDecisionJournalFoundation(timestamp);
  }

  const manifest = buildDecisionJournalManifest(DECISION_JOURNAL_PLATFORM_SELF_MANIFEST, timestamp);
  const manifestValidation = validateDecisionJournalManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }

  const entryValidation = validateDecisionJournalEntryContractShape(resolveDecisionJournalEntryExample(timestamp));
  if (!entryValidation.valid) {
    issues.push(...entryValidation.issues);
  }

  const journalIdentityValidation = validateJournalIdentity("decision-journal-ws-decision-journal-001");
  if (!journalIdentityValidation.valid) {
    issues.push(...journalIdentityValidation.issues);
  }

  const workspaceIsolationValidation = validateWorkspaceIsolation(
    "ws-decision-journal-001",
    "ws-decision-journal-001"
  );
  if (!workspaceIsolationValidation.valid) {
    issues.push(...workspaceIsolationValidation.issues);
  }

  const registry = getDecisionJournalRegistrySnapshot();
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
    platformInitialized: isDecisionJournalPlatformInitialized(),
    registryValid:
      registry.statusTypeCount > 0 && registry.sourceTypeCount > 0 && registry.confidenceTypeCount > 0,
    manifestValid: manifestValidation.valid,
    compatibilityValid: DECISION_JOURNAL_FUTURE_COMPATIBILITY.metadataOnly === true,
    workspaceIsolationValid: workspaceIsolationValidation.valid,
    journalIdentityValid: journalIdentityValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export {
  createDecisionJournalFoundation as createDecisionJournal,
  isDecisionJournalPlatformInitialized as isDecisionJournalReady,
} from "./decisionJournalFoundation.ts";
export { registerDecisionJournal } from "./decisionJournalRegistry.ts";

export const DecisionJournalPlatformContract = Object.freeze({
  resolveDecisionJournalEntryExample,
  validateDecisionJournal,
  getDecisionJournalManifest,
  getDecisionJournalContractVersionMetadata,
  getDecisionJournalFutureCompatibility,
  isDecisionJournalStatus,
  isDecisionJournalSource,
  isDecisionJournalConfidence,
  identity: DECISION_JOURNAL_PLATFORM_IDENTITY,
  version: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  tags: DECISION_JOURNAL_PLATFORM_TAGS,
  mandatoryEntryFields: DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS,
  mustNotOwn: DECISION_JOURNAL_MUST_NOT_OWN,
  principles: DECISION_JOURNAL_PLATFORM_PRINCIPLES,
});

export {
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_TAGS,
  DECISION_JOURNAL_MUST_NOT_OWN,
  DECISION_JOURNAL_FUTURE_COMPATIBILITY,
  DECISION_JOURNAL_PLATFORM_PRINCIPLES,
  getDecisionJournalRegistry,
};
