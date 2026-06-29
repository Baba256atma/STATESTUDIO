/**
 * APP-8:7 — Decision Journal API capability manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  DECISION_JOURNAL_PLATFORM_ID,
  DECISION_JOURNAL_PLATFORM_NAME,
} from "./decisionJournalConstants.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "./decisionJournalContracts.ts";
import { DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST } from "./decisionJournalRetrospective.ts";
import {
  DECISION_JOURNAL_API_CONTRACT_VERSION,
  DECISION_JOURNAL_API_FORBIDDEN_PATTERNS,
  DECISION_JOURNAL_API_GROUP_KEYS,
  DECISION_JOURNAL_API_TAGS,
  type DecisionJournalApiCapabilityManifest,
} from "./decisionJournalApiTypes.ts";
import { listDecisionJournalConsumerContracts } from "./decisionJournalConsumerContracts.ts";

export const DECISION_JOURNAL_API_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_JOURNAL_API_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_JOURNAL_API_SELF_MANIFEST = Object.freeze({
  stageId: "APP-8/7",
  title: "Decision Journal API + Consumer Contract Layer",
  goal: "Official public API facade and consumer contracts for APP-8 Decision Journal platform access.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-journal/decisionJournalApiTypes.ts",
    "frontend/app/lib/decision-journal/decisionJournalApiFacade.ts",
    "frontend/app/lib/decision-journal/decisionJournalApiManifest.ts",
    "frontend/app/lib/decision-journal/decisionJournalConsumerContracts.ts",
    "frontend/app/lib/decision-journal/decisionJournalConsumerValidation.ts",
    "frontend/app/lib/decision-journal/decisionJournalApiValidation.ts",
    "frontend/app/lib/decision-journal/decisionJournalApi.ts",
    "frontend/app/lib/decision-journal/decisionJournalApiRunner.ts",
    "frontend/app/lib/decision-journal/decisionJournalApi.test.ts",
    "docs/app-8-7-decision-journal-api-consumer-contract.md",
  ]),
  forbiddenPatterns: DECISION_JOURNAL_API_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-8/1", "APP-8/2", "APP-8/3", "APP-8/4", "APP-8/5", "APP-8/6"]),
  runtimePath: "library-only" as const,
  tags: DECISION_JOURNAL_API_TAGS,
} satisfies StageManifest);

export const DECISION_JOURNAL_DIRECT_IMPORT_GUARD_NOTES = Object.freeze(
  "Future Workspace, Dashboard, Assistant, Visualization, Report, and Export consumers MUST import APP-8:7 public APIs only. Direct imports from decisionJournalEngine, decisionJournalQuery, decisionJournalReflection, decisionJournalEvidenceAssumption, or decisionJournalRetrospective internal modules are forbidden."
);

export const DECISION_JOURNAL_API_READ_CAPABILITIES = Object.freeze([
  "getEntryById",
  "getEntries",
  "queryJournal",
  "getOrderedEntries",
  "getRange",
  "getSummary",
  "buildReflection",
  "extractInsights",
  "getReflectionSummary",
  "buildEvidenceAssumptionModel",
  "evaluateEvidence",
  "evaluateAssumptions",
  "detectQualityFlags",
  "buildRetrospectiveModel",
  "evaluateOutcome",
  "evaluateRetrospective",
  "runCertification",
] as const);

export const DECISION_JOURNAL_API_WRITE_CAPABILITIES = Object.freeze([
  "createEntry",
  "updateEntryMetadata",
  "archiveEntry",
] as const);

export const DECISION_JOURNAL_API_FORBIDDEN_CAPABILITIES = Object.freeze([
  "directInternalModuleImport",
  "dashboardRendering",
  "assistantPrompting",
  "visualizationRendering",
  "persistence",
  "app6Integration",
  "scenarioTimelineCoupling",
  "decisionTimelineCoupling",
] as const);

export const DECISION_JOURNAL_API_CERTIFIED_PREREQUISITES = Object.freeze([
  "APP-8/1",
  "APP-8/2",
  "APP-8/3",
  "APP-8/4",
  "APP-8/5",
  "APP-8/6",
] as const);

export const DECISION_JOURNAL_API_PUBLIC_RULES = Object.freeze({
  facadeOnly: true,
  noDirectInternalImports: true,
  consumerContractsRequired: true,
  readOnlyConsumersEnforced: true,
  controlledWriteThroughFacade: true,
  noDashboardImplementation: true,
  noAssistantImplementation: true,
  noVisualizationImplementation: true,
  noPersistence: true,
  noApp6Integration: true,
} as const);

export function buildDecisionJournalApiManifest(generatedAt: string): DecisionJournalApiCapabilityManifest {
  return Object.freeze({
    platformId: DECISION_JOURNAL_PLATFORM_ID,
    platformName: DECISION_JOURNAL_PLATFORM_NAME,
    appId: DECISION_JOURNAL_PLATFORM_IDENTITY.appId,
    version: DECISION_JOURNAL_API_CONTRACT_VERSION,
    availableApiGroups: DECISION_JOURNAL_API_GROUP_KEYS,
    readCapabilities: DECISION_JOURNAL_API_READ_CAPABILITIES,
    writeCapabilities: DECISION_JOURNAL_API_WRITE_CAPABILITIES,
    forbiddenCapabilities: DECISION_JOURNAL_API_FORBIDDEN_CAPABILITIES,
    consumerCompatibility: listDecisionJournalConsumerContracts(),
    certifiedPrerequisites: DECISION_JOURNAL_API_CERTIFIED_PREREQUISITES,
    directImportGuardNotes: DECISION_JOURNAL_DIRECT_IMPORT_GUARD_NOTES,
    generatedAt,
    readOnly: true as const,
  });
}

export const DecisionJournalApiManifest = Object.freeze({
  buildDecisionJournalApiManifest,
  directImportGuardNotes: DECISION_JOURNAL_DIRECT_IMPORT_GUARD_NOTES,
});
