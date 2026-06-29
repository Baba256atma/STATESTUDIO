/**
 * APP-8:9 — Decision Journal Platform Freeze registry.
 * Metadata-only platform identity, phase registry, and API registry.
 */

import { listDecisionJournalConsumerContracts } from "./decisionJournalConsumerContracts.ts";

export const DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION = "APP-8/9" as const;
export const DECISION_JOURNAL_PLATFORM_FREEZE_ARCHITECTURE_VERSION =
  "APP-8/9-platform-freeze-arch" as const;

export const DECISION_JOURNAL_PLATFORM_RELEASE_VERSION = "APP-8" as const;
export const DECISION_JOURNAL_PLATFORM_RELEASE_TAG = "app-8-decision-journal-v1.0.0-frozen" as const;
export const DECISION_JOURNAL_PLATFORM_RELEASE_STATUS = "released" as const;
export const DECISION_JOURNAL_PLATFORM_FREEZE_STATUS = "frozen" as const;
export const DECISION_JOURNAL_PLATFORM_COMPATIBILITY_VERSION = "APP-8-compat-v1" as const;
export const DECISION_JOURNAL_PLATFORM_CERTIFIED_BY = "APP-8:8 Platform Certification" as const;
export const DECISION_JOURNAL_PLATFORM_CERTIFICATION_SOURCE = "APP-8/8" as const;

export const DECISION_JOURNAL_PLATFORM_STATUS_CERTIFIED = true as const;
export const DECISION_JOURNAL_PLATFORM_STATUS_FROZEN = true as const;
export const DECISION_JOURNAL_PLATFORM_STATUS_RELEASED = true as const;

export const DECISION_JOURNAL_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[APP8_9]",
  "[PLATFORM_FROZEN]",
  "[DECISION_JOURNAL_PLATFORM_COMPLETE]",
  "[METADATA_ONLY]",
  "[NO_RUNTIME_CHANGES]",
  "[EXTEND_ONLY]",
  "[ARCHITECTURE_FROZEN]",
] as const);

export const DECISION_JOURNAL_PLATFORM_FREEZE_DOCUMENTATION_FILES = Object.freeze([
  "docs/app-8-1-decision-journal-foundation.md",
  "docs/app-8-2-decision-journal-engine.md",
  "docs/app-8-3-decision-journal-query-ordering.md",
  "docs/app-8-4-decision-journal-insight-reflection.md",
  "docs/app-8-5-decision-journal-evidence-assumption.md",
  "docs/app-8-6-decision-journal-outcome-retrospective.md",
  "docs/app-8-7-decision-journal-api-consumer-contract.md",
  "docs/app-8-8-decision-journal-platform-certification.md",
  "docs/app-8-9-decision-journal-platform-freeze.md",
] as const);

export const DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS = Object.freeze([
  "app8_addon_modules",
  "workspace_editor_integration",
  "dashboard_consumer_integration",
  "assistant_consumer_integration",
  "report_export_modules",
  "persistence_adapter",
  "app6_link_adapter_facade_only",
  "audit_governance_integration",
  "retrospective_import_export_adapter",
] as const);

export const DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES = Object.freeze([
  "changing_journal_entry_identity",
  "changing_immutable_entry_rules",
  "changing_append_only_revision_policy",
  "bypassing_app8_7_api_facade",
  "direct_internal_imports_by_consumers",
  "mutating_certified_app8_1_through_8_8_contracts",
  "directly_coupling_app8_to_app6_internals",
  "adding_ai_generation_inside_frozen_core",
  "adding_ui_dashboard_assistant_behavior_inside_frozen_core",
] as const);

export const DECISION_JOURNAL_PLATFORM_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-8-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend APP-8 through consumer bindings and adapters without modifying certified APP-8:1 through APP-8:8 contracts.",
  allowedFutureExtensions: DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  forbiddenChanges: DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES,
  facadeRequired: true,
  consumerContractsRequired: true,
  readOnly: true as const,
} as const);

export const DECISION_JOURNAL_PLATFORM_NO_MUTATION_POLICY = Object.freeze({
  policyId: "APP-8-NO-MUTATION-FREEZE",
  metadataOnly: true,
  noNewRuntimeBehavior: true,
  noEngineChanges: true,
  noApiBehaviorChanges: true,
  readOnly: true as const,
} as const);

export const DECISION_JOURNAL_PLATFORM_FROZEN_PHASES = Object.freeze([
  Object.freeze({ phaseId: "APP-8/1", title: "Decision Journal Foundation", contractVersion: "APP-8/1" }),
  Object.freeze({ phaseId: "APP-8/2", title: "Decision Journal Engine", contractVersion: "APP-8/2" }),
  Object.freeze({ phaseId: "APP-8/3", title: "Decision Journal Query + Ordering", contractVersion: "APP-8/3" }),
  Object.freeze({ phaseId: "APP-8/4", title: "Decision Journal Insight + Reflection", contractVersion: "APP-8/4" }),
  Object.freeze({ phaseId: "APP-8/5", title: "Decision Journal Evidence + Assumption", contractVersion: "APP-8/5" }),
  Object.freeze({ phaseId: "APP-8/6", title: "Decision Journal Outcome + Retrospective", contractVersion: "APP-8/6" }),
  Object.freeze({ phaseId: "APP-8/7", title: "Decision Journal API + Consumer Contract", contractVersion: "APP-8/7" }),
  Object.freeze({ phaseId: "APP-8/8", title: "Platform Certification", contractVersion: "APP-8/8" }),
  Object.freeze({ phaseId: "APP-8/9", title: "Platform Freeze", contractVersion: "APP-8/9" }),
] as const);

export const DECISION_JOURNAL_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
  "createDecisionJournalFoundation",
  "validateDecisionJournal",
  "getDecisionJournal",
  "createDecisionJournal",
  "runDecisionJournalFoundation",
  "createDecisionJournalEntry",
  "getDecisionJournalEntryById",
  "getDecisionJournalEntries",
  "updateDecisionJournalMetadata",
  "archiveDecisionJournalEntry",
  "runDecisionJournalEngineCertification",
  "queryDecisionJournal",
  "getDecisionJournalEntriesOrdered",
  "getDecisionJournalRange",
  "getDecisionJournalSummary",
  "runDecisionJournalQueryCertification",
  "buildDecisionJournalReflectionModel",
  "extractDecisionJournalInsights",
  "runDecisionJournalReflectionCertification",
  "buildDecisionJournalEvidenceAssumptionModel",
  "evaluateDecisionJournalEvidence",
  "evaluateDecisionJournalAssumptions",
  "runDecisionJournalEvidenceAssumptionCertification",
  "buildDecisionJournalRetrospectiveModel",
  "evaluateDecisionJournalOutcome",
  "evaluateDecisionJournalRetrospective",
  "runDecisionJournalRetrospectiveCertification",
  "createDecisionJournalApi",
  "getDecisionJournalApi",
  "getDecisionJournalApiManifest",
  "validateDecisionJournalApiContract",
  "getDecisionJournalConsumerContract",
  "validateDecisionJournalConsumerAccess",
  "runDecisionJournalApiCertification",
  "runDecisionJournalPlatformCertification",
  "runDecisionJournalPlatformRegression",
  "getDecisionJournalPlatformManifest",
  "validateDecisionJournalPlatform",
  "runDecisionJournalPlatformFreeze",
  "getDecisionJournalFreezeManifest",
  "validateDecisionJournalPlatformFreeze",
] as const);

export const DECISION_JOURNAL_PLATFORM_PUBLIC_CONTRACT_REGISTRY = Object.freeze([
  Object.freeze({ contractId: "APP-8/1", label: "Foundation", frozen: true as const }),
  Object.freeze({ contractId: "APP-8/2", label: "Journal Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-8/3", label: "Query + Ordering", frozen: true as const }),
  Object.freeze({ contractId: "APP-8/4", label: "Insight + Reflection", frozen: true as const }),
  Object.freeze({ contractId: "APP-8/5", label: "Evidence + Assumption", frozen: true as const }),
  Object.freeze({ contractId: "APP-8/6", label: "Outcome + Retrospective", frozen: true as const }),
  Object.freeze({ contractId: "APP-8/7", label: "API + Consumer Contract", frozen: true as const }),
  Object.freeze({ contractId: "APP-8/8", label: "Platform Certification", frozen: true as const }),
  Object.freeze({ contractId: "APP-8/9", label: "Platform Freeze", frozen: true as const }),
] as const);

let publishedManifest: import("./decisionJournalPlatformFreezeManifest.ts").DecisionJournalPlatformFreezeManifest | null =
  null;

export function resetDecisionJournalPlatformFreezeRegistryForTests(): void {
  publishedManifest = null;
}

export function registerDecisionJournalPlatformFreezeManifest(
  manifest: import("./decisionJournalPlatformFreezeManifest.ts").DecisionJournalPlatformFreezeManifest
): void {
  publishedManifest = manifest;
}

export function getPublishedDecisionJournalFreezeManifest():
  | import("./decisionJournalPlatformFreezeManifest.ts").DecisionJournalPlatformFreezeManifest
  | null {
  return publishedManifest;
}

export function getDecisionJournalConsumerRegistry() {
  return listDecisionJournalConsumerContracts();
}

export function getDecisionJournalPlatformRegistry(): import("./decisionJournalPlatformFreezeTypes.ts").DecisionJournalPlatformRegistrySnapshot {
  const manifest = publishedManifest;
  return Object.freeze({
    registryVersion: DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
    platformId: manifest?.platformId ?? "decision-journal-platform",
    platformName: manifest?.platformName ?? "Decision Journal",
    releaseVersion: manifest?.releaseVersion ?? DECISION_JOURNAL_PLATFORM_RELEASE_VERSION,
    frozen: manifest?.releaseStatus.frozen === true,
    publicApiCount: DECISION_JOURNAL_PLATFORM_FROZEN_PUBLIC_APIS.length,
    phaseCount: DECISION_JOURNAL_PLATFORM_FROZEN_PHASES.length,
    consumerCount: getDecisionJournalConsumerRegistry().length,
    readOnly: true as const,
  });
}

export const DecisionJournalPlatformFreezeRegistry = Object.freeze({
  resetDecisionJournalPlatformFreezeRegistryForTests,
  registerDecisionJournalPlatformFreezeManifest,
  getPublishedDecisionJournalFreezeManifest,
  getDecisionJournalPlatformRegistry,
  getDecisionJournalConsumerRegistry,
});
