/**
 * APP-7:8 — Business Timeline Platform Freeze registry.
 * Metadata-only platform identity, phase registry, and API registry.
 */

import { listBusinessTimelineConsumerContracts } from "./businessTimelineConsumerContracts.ts";

export const BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION = "APP-7/8" as const;
export const BUSINESS_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION =
  "APP-7/8-platform-freeze-arch" as const;

export const BUSINESS_TIMELINE_PLATFORM_RELEASE_VERSION = "APP-7" as const;
export const BUSINESS_TIMELINE_PLATFORM_RELEASE_TAG = "app-7-business-timeline-v1.0.0-frozen" as const;
export const BUSINESS_TIMELINE_PLATFORM_RELEASE_STATUS = "released" as const;
export const BUSINESS_TIMELINE_PLATFORM_FREEZE_STATUS = "frozen" as const;
export const BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_VERSION = "APP-7-compat-v1" as const;
export const BUSINESS_TIMELINE_PLATFORM_CERTIFIED_BY = "APP-7:7 Platform Certification" as const;
export const BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SOURCE = "APP-7/7" as const;

export const BUSINESS_TIMELINE_PLATFORM_STATUS_CERTIFIED = true as const;
export const BUSINESS_TIMELINE_PLATFORM_STATUS_FROZEN = true as const;
export const BUSINESS_TIMELINE_PLATFORM_STATUS_RELEASED = true as const;

export const BUSINESS_TIMELINE_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[APP7_8]",
  "[PLATFORM_FROZEN]",
  "[BUSINESS_TIMELINE_PLATFORM_COMPLETE]",
  "[METADATA_ONLY]",
  "[NO_RUNTIME_CHANGES]",
  "[EXTEND_ONLY]",
  "[ARCHITECTURE_FROZEN]",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES = Object.freeze([
  "docs/app-7-1-business-timeline-foundation.md",
  "docs/app-7-2-business-event-engine.md",
  "docs/app-7-3-business-timeline-query-ordering.md",
  "docs/app-7-4-business-timeline-lifecycle-milestones.md",
  "docs/app-7-5-business-timeline-causality-context.md",
  "docs/app-7-6-business-timeline-api-consumer-contract.md",
  "docs/app-7-7-business-timeline-platform-certification.md",
  "docs/app-7-8-business-timeline-platform-freeze.md",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS = Object.freeze([
  "app7_addon_modules",
  "dashboard_consumer_integration",
  "assistant_consumer_integration",
  "visualization_consumer_integration",
  "datasource_adapter_integration",
  "export_report_modules",
  "persistence_adapter",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES = Object.freeze([
  "changing_app7_event_identity",
  "changing_immutable_event_rules",
  "changing_append_only_history_policy",
  "bypassing_api_facade",
  "direct_internal_imports_by_consumers",
  "mutating_certified_app7_1_through_7_7_contracts",
  "coupling_app7_directly_to_app5_or_app6_internals",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-7-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend APP-7 through consumer bindings and adapters without modifying certified APP-7:1 through APP-7:7 contracts.",
  allowedFutureExtensions: BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  forbiddenChanges: BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES,
  facadeRequired: true,
  consumerContractsRequired: true,
  readOnly: true as const,
} as const);

export const BUSINESS_TIMELINE_PLATFORM_NO_MUTATION_POLICY = Object.freeze({
  policyId: "APP-7-NO-MUTATION-FREEZE",
  metadataOnly: true,
  noNewRuntimeBehavior: true,
  noEngineChanges: true,
  noApiBehaviorChanges: true,
  readOnly: true as const,
} as const);

export const BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES = Object.freeze([
  Object.freeze({ phaseId: "APP-7/1", title: "Business Timeline Foundation", contractVersion: "APP-7/1" }),
  Object.freeze({ phaseId: "APP-7/2", title: "Business Event Engine", contractVersion: "APP-7/2" }),
  Object.freeze({ phaseId: "APP-7/3", title: "Business Timeline Query + Ordering", contractVersion: "APP-7/3" }),
  Object.freeze({ phaseId: "APP-7/4", title: "Business Timeline Lifecycle + Milestones", contractVersion: "APP-7/4" }),
  Object.freeze({ phaseId: "APP-7/5", title: "Business Timeline Context + Relationships", contractVersion: "APP-7/5" }),
  Object.freeze({ phaseId: "APP-7/6", title: "Business Timeline API + Consumer Contract", contractVersion: "APP-7/6" }),
  Object.freeze({ phaseId: "APP-7/7", title: "Platform Certification", contractVersion: "APP-7/7" }),
  Object.freeze({ phaseId: "APP-7/8", title: "Platform Freeze", contractVersion: "APP-7/8" }),
] as const);

export const BUSINESS_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
  "createBusinessTimelineFoundation",
  "validateBusinessTimeline",
  "getBusinessTimelineManifest",
  "createBusinessEvent",
  "getBusinessEventById",
  "getBusinessEventsByWorkspace",
  "updateBusinessEventMetadata",
  "archiveBusinessEvent",
  "queryBusinessTimeline",
  "getBusinessTimelineOrderedEvents",
  "getBusinessTimelineRange",
  "getBusinessTimelineSummary",
  "buildBusinessLifecycleModel",
  "getBusinessLifecycleSummary",
  "extractBusinessMilestones",
  "buildBusinessTimelineContextModel",
  "getBusinessEventContext",
  "getBusinessRelatedEvents",
  "createBusinessTimelineApi",
  "getBusinessTimelineApi",
  "getBusinessTimelineApiManifest",
  "validateBusinessTimelineApiContract",
  "getBusinessTimelineConsumerContract",
  "validateBusinessTimelineConsumerAccess",
  "runBusinessTimelineApiCertification",
  "runBusinessTimelinePlatformCertification",
  "runBusinessTimelinePlatformRegression",
  "getBusinessTimelinePlatformManifest",
  "runBusinessTimelinePlatformFreeze",
  "getBusinessTimelineFreezeManifest",
  "validateBusinessTimelinePlatformFreeze",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY = Object.freeze([
  Object.freeze({ contractId: "APP-7/1", label: "Foundation", frozen: true as const }),
  Object.freeze({ contractId: "APP-7/2", label: "Event Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-7/3", label: "Query + Ordering", frozen: true as const }),
  Object.freeze({ contractId: "APP-7/4", label: "Lifecycle + Milestones", frozen: true as const }),
  Object.freeze({ contractId: "APP-7/5", label: "Context + Relationships", frozen: true as const }),
  Object.freeze({ contractId: "APP-7/6", label: "API + Consumer Contract", frozen: true as const }),
  Object.freeze({ contractId: "APP-7/7", label: "Platform Certification", frozen: true as const }),
  Object.freeze({ contractId: "APP-7/8", label: "Platform Freeze", frozen: true as const }),
] as const);

let publishedManifest: import("./businessTimelinePlatformFreezeManifest.ts").BusinessTimelinePlatformFreezeManifest | null =
  null;

export function resetBusinessTimelinePlatformFreezeRegistryForTests(): void {
  publishedManifest = null;
}

export function registerBusinessTimelinePlatformFreezeManifest(
  manifest: import("./businessTimelinePlatformFreezeManifest.ts").BusinessTimelinePlatformFreezeManifest
): void {
  publishedManifest = manifest;
}

export function getPublishedBusinessTimelineFreezeManifest():
  | import("./businessTimelinePlatformFreezeManifest.ts").BusinessTimelinePlatformFreezeManifest
  | null {
  return publishedManifest;
}

export function getBusinessTimelineConsumerRegistry() {
  return listBusinessTimelineConsumerContracts();
}

export function getBusinessTimelinePlatformRegistry(): import("./businessTimelinePlatformFreezeTypes.ts").BusinessTimelinePlatformRegistrySnapshot {
  const manifest = publishedManifest;
  return Object.freeze({
    registryVersion: BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
    platformId: manifest?.platformId ?? "business-timeline-platform",
    platformName: manifest?.platformName ?? "Business Timeline",
    releaseVersion: manifest?.releaseVersion ?? BUSINESS_TIMELINE_PLATFORM_RELEASE_VERSION,
    frozen: manifest?.releaseStatus.frozen === true,
    publicApiCount: BUSINESS_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS.length,
    phaseCount: BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES.length,
    consumerCount: getBusinessTimelineConsumerRegistry().length,
    readOnly: true as const,
  });
}

export const BusinessTimelinePlatformFreezeRegistry = Object.freeze({
  resetBusinessTimelinePlatformFreezeRegistryForTests,
  registerBusinessTimelinePlatformFreezeManifest,
  getPublishedBusinessTimelineFreezeManifest,
  getBusinessTimelinePlatformRegistry,
  getBusinessTimelineConsumerRegistry,
});
