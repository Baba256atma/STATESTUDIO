/**
 * APP-11:8 — Executive Inbox Platform Freeze registry.
 * Metadata-only platform identity, phase registry, and API registry.
 */

import { EXECUTIVE_INBOX_CONSUMER_REGISTRY } from "./executiveInboxConstants.ts";

export const EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION = "APP-11/8" as const;
export const EXECUTIVE_INBOX_PLATFORM_FREEZE_ARCHITECTURE_VERSION =
  "APP-11/8-platform-freeze-arch" as const;

export const EXECUTIVE_INBOX_PLATFORM_RELEASE_VERSION = "APP-11" as const;
export const EXECUTIVE_INBOX_PLATFORM_RELEASE_TAG = "app-11-executive-inbox-v1.0.0-frozen" as const;
export const EXECUTIVE_INBOX_PLATFORM_RELEASE_STATUS = "released" as const;
export const EXECUTIVE_INBOX_PLATFORM_FREEZE_STATUS = "frozen" as const;
export const EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_VERSION = "APP-11-compat-v1" as const;
export const EXECUTIVE_INBOX_PLATFORM_CERTIFIED_BY = "APP-11:7 Platform Certification" as const;
export const EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SOURCE = "APP-11/7" as const;

export const EXECUTIVE_INBOX_PLATFORM_STATUS_CERTIFIED = true as const;
export const EXECUTIVE_INBOX_PLATFORM_STATUS_FROZEN = true as const;
export const EXECUTIVE_INBOX_PLATFORM_STATUS_RELEASED = true as const;

export const EXECUTIVE_INBOX_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[APP11_8]",
  "[PLATFORM_FROZEN]",
  "[EXECUTIVE_INBOX_PLATFORM_COMPLETE]",
  "[METADATA_ONLY]",
  "[NO_RUNTIME_CHANGES]",
  "[EXTEND_ONLY]",
  "[ARCHITECTURE_FROZEN]",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_FREEZE_DOCUMENTATION_FILES = Object.freeze([
  "docs/app-11-1-executive-inbox-foundation.md",
  "docs/app-11-2-executive-inbox-aggregation-engine.md",
  "docs/app-11-3-executive-inbox-prioritization-engine.md",
  "docs/app-11-4-executive-inbox-notification-engine.md",
  "docs/app-11-5-executive-inbox-reminder-engine.md",
  "docs/app-11-6-executive-inbox-scheduling-engine.md",
  "docs/app-11-7-executive-inbox-platform-certification.md",
  "docs/app-11-8-executive-inbox-platform-freeze.md",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS = Object.freeze([
  "app11_addon_modules",
  "lay_inbox_adapter_modules",
  "workspace_consumer_integration",
  "dashboard_consumer_integration",
  "assistant_consumer_integration",
  "report_export_modules",
  "inbox_query_api_facade",
  "inbox_facade_api",
  "persistence_adapter",
  "app1_app2_app3_app4_reference_adapters_facade_only",
  "app5_app6_app7_app8_app9_app10_source_adapters_facade_only",
  "audit_governance_integration",
  "external_inbox_import_export_adapter",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES = Object.freeze([
  "changing_inbox_session_identity",
  "changing_immutable_inbox_artifact_rules",
  "changing_deterministic_inbox_semantics",
  "bypassing_future_app11_api_facade",
  "direct_internal_imports_by_consumers",
  "mutating_certified_app11_1_through_11_7_contracts",
  "direct_app1_through_app10_internal_coupling",
  "adding_ml_embeddings_or_vector_search_inside_frozen_core",
  "adding_notification_delivery_inside_frozen_core",
  "adding_reminder_delivery_inside_frozen_core",
  "adding_scheduling_execution_inside_frozen_core",
  "adding_ui_dashboard_assistant_behavior_inside_frozen_core",
  "changing_aggregation_prioritization_notification_reminder_scheduling_semantics",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-11-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend APP-11 through consumer bindings and adapters without modifying certified APP-11:1 through APP-11:7 contracts.",
  allowedFutureExtensions: EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  forbiddenChanges: EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES,
  facadeRequired: true,
  consumerContractsRequired: true,
  layCompatibilityRequired: true,
  readOnly: true as const,
} as const);

export const EXECUTIVE_INBOX_PLATFORM_NO_MUTATION_POLICY = Object.freeze({
  policyId: "APP-11-NO-MUTATION-FREEZE",
  metadataOnly: true,
  noNewRuntimeBehavior: true,
  noEngineChanges: true,
  noAggregationChanges: true,
  noPrioritizationChanges: true,
  noNotificationChanges: true,
  noReminderChanges: true,
  noSchedulingChanges: true,
  readOnly: true as const,
} as const);

export const EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES = Object.freeze([
  Object.freeze({ phaseId: "APP-11/1", title: "Executive Inbox Foundation", contractVersion: "APP-11/1" }),
  Object.freeze({ phaseId: "APP-11/2", title: "Aggregation Engine", contractVersion: "APP-11/2" }),
  Object.freeze({ phaseId: "APP-11/3", title: "Prioritization Engine", contractVersion: "APP-11/3" }),
  Object.freeze({ phaseId: "APP-11/4", title: "Notification Engine", contractVersion: "APP-11/4" }),
  Object.freeze({ phaseId: "APP-11/5", title: "Reminder Engine", contractVersion: "APP-11/5" }),
  Object.freeze({ phaseId: "APP-11/6", title: "Scheduling Engine", contractVersion: "APP-11/6" }),
  Object.freeze({ phaseId: "APP-11/7", title: "Platform Certification", contractVersion: "APP-11/7" }),
  Object.freeze({ phaseId: "APP-11/8", title: "Platform Freeze", contractVersion: "APP-11/8" }),
] as const);

export const EXECUTIVE_INBOX_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
  "buildExecutiveInboxFoundation",
  "createExecutiveInboxFoundation",
  "validateExecutiveInboxFoundation",
  "getExecutiveInboxManifest",
  "runExecutiveInboxFoundation",
  "registerExecutiveInboxSession",
  "registerExecutiveInboxItem",
  "aggregateExecutiveInbox",
  "buildExecutiveInboxItems",
  "validateExecutiveInboxAggregation",
  "registerInboxItem",
  "getInboxItems",
  "runExecutiveInboxAggregationCertification",
  "prioritizeExecutiveInbox",
  "calculateExecutivePriorities",
  "validateExecutivePriority",
  "runExecutiveInboxPrioritizationCertification",
  "generateExecutiveNotifications",
  "buildExecutiveNotifications",
  "validateExecutiveNotifications",
  "runExecutiveInboxNotificationCertification",
  "generateExecutiveReminders",
  "buildExecutiveReminders",
  "validateExecutiveReminders",
  "runExecutiveInboxReminderCertification",
  "generateExecutiveScheduleIntents",
  "buildExecutiveScheduleIntents",
  "validateExecutiveScheduleIntents",
  "runExecutiveInboxSchedulingCertification",
  "certifyExecutiveInboxPlatform",
  "validateExecutiveInboxPlatform",
  "runExecutiveInboxPlatformCertification",
  "getExecutiveInboxCertificationManifest",
  "runExecutiveInboxPlatformRegression",
  "freezeExecutiveInboxPlatform",
  "validateExecutiveInboxPlatformFreeze",
  "runExecutiveInboxPlatformFreeze",
  "getExecutiveInboxPlatformFreezeManifest",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_PUBLIC_CONTRACT_REGISTRY = Object.freeze([
  Object.freeze({ contractId: "APP-11/1", label: "Foundation", frozen: true as const }),
  Object.freeze({ contractId: "APP-11/2", label: "Aggregation Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-11/3", label: "Prioritization Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-11/4", label: "Notification Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-11/5", label: "Reminder Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-11/6", label: "Scheduling Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-11/7", label: "Platform Certification", frozen: true as const }),
  Object.freeze({ contractId: "APP-11/8", label: "Platform Freeze", frozen: true as const }),
] as const);

let publishedManifest: import("./executiveInboxPlatformFreezeManifest.ts").ExecutiveInboxPlatformFreezeManifest | null =
  null;

export function resetExecutiveInboxPlatformFreezeRegistryForTests(): void {
  publishedManifest = null;
}

export function registerExecutiveInboxPlatformFreezeManifest(
  manifest: import("./executiveInboxPlatformFreezeManifest.ts").ExecutiveInboxPlatformFreezeManifest
): void {
  publishedManifest = manifest;
}

export function getPublishedExecutiveInboxFreezeManifest():
  | import("./executiveInboxPlatformFreezeManifest.ts").ExecutiveInboxPlatformFreezeManifest
  | null {
  return publishedManifest;
}

export function getExecutiveInboxConsumerRegistry() {
  return EXECUTIVE_INBOX_CONSUMER_REGISTRY.map((entry) =>
    Object.freeze({
      consumerId: entry.consumerId,
      label: entry.label,
      integrationPath: entry.integrationPath,
      status: entry.status,
      readOnly: true as const,
    })
  );
}

export function getExecutiveInboxPlatformRegistry(): import("./executiveInboxPlatformFreezeTypes.ts").ExecutiveInboxPlatformRegistrySnapshot {
  const manifest = publishedManifest;
  return Object.freeze({
    registryVersion: EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION,
    platformId: manifest?.platformId ?? "executive-inbox-platform",
    platformName: manifest?.platformName ?? "Executive Inbox",
    releaseVersion: manifest?.releaseVersion ?? EXECUTIVE_INBOX_PLATFORM_RELEASE_VERSION,
    frozen: manifest?.releaseStatus.frozen === true,
    publicApiCount: EXECUTIVE_INBOX_PLATFORM_FROZEN_PUBLIC_APIS.length,
    phaseCount: EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES.length,
    consumerCount: getExecutiveInboxConsumerRegistry().length,
    readOnly: true as const,
  });
}

export const ExecutiveInboxPlatformFreezeRegistry = Object.freeze({
  resetExecutiveInboxPlatformFreezeRegistryForTests,
  registerExecutiveInboxPlatformFreezeManifest,
  getPublishedExecutiveInboxFreezeManifest,
  getExecutiveInboxPlatformRegistry,
  getExecutiveInboxConsumerRegistry,
});
