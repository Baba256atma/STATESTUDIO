/**
 * APP-6:12 — Decision Timeline Platform Freeze registry.
 * Metadata-only platform identity and API registry.
 */

export const DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION = "APP-6/12" as const;
export const DECISION_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION =
  "APP-6/12-platform-freeze-arch" as const;

export const DECISION_TIMELINE_PLATFORM_VERSION = "APP-6" as const;
export const DECISION_TIMELINE_PLATFORM_RELEASE_TAG = "app-6-decision-timeline-v1.0.0-frozen" as const;
export const DECISION_TIMELINE_PLATFORM_RELEASE_STAGE = "production-ready" as const;
export const DECISION_TIMELINE_PLATFORM_COMPATIBILITY_VERSION = "APP-6-compat-v1" as const;

export const DECISION_TIMELINE_PLATFORM_STATUS_CERTIFIED = "CERTIFIED" as const;
export const DECISION_TIMELINE_PLATFORM_STATUS_FROZEN = "FROZEN" as const;
export const DECISION_TIMELINE_PLATFORM_STATUS_RELEASED = "RELEASED" as const;
export const DECISION_TIMELINE_PLATFORM_STATUS_PRODUCTION_READY = "PRODUCTION_READY" as const;

export const DECISION_TIMELINE_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[APP6_12]",
  "[PLATFORM_FROZEN]",
  "[DECISION_TIMELINE_PLATFORM_COMPLETE]",
  "[METADATA_ONLY]",
  "[NO_RUNTIME_CHANGES]",
  "[EXTEND_ONLY]",
  "[ARCHITECTURE_FROZEN]",
] as const);

export const DECISION_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES = Object.freeze([
  "docs/app-6-1-decision-timeline-foundation-report.md",
  "docs/app-6-2-decision-event-engine-report.md",
  "docs/app-6-3-decision-history-engine-report.md",
  "docs/app-6-4-decision-lifecycle-engine-report.md",
  "docs/app-6-5-decision-state-engine-report.md",
  "docs/app-6-6-decision-query-engine-report.md",
  "docs/app-6-7-decision-comparison-engine-report.md",
  "docs/app-6-8-decision-replay-engine-report.md",
  "docs/app-6-9-decision-dashboard-integration-report.md",
  "docs/app-6-10-decision-assistant-integration-report.md",
  "docs/app-6-11-decision-timeline-platform-certification-report.md",
  "docs/app-6-12-decision-timeline-platform-freeze-report.md",
] as const);

export const DECISION_TIMELINE_PLATFORM_SUPPORT_POLICY = Object.freeze({
  policyId: "APP-6-SUPPORT",
  contractPreservation: true,
  breakingChangesForbidden: true,
  bugFixesMustPreservePublicContracts: true,
  readOnly: true as const,
} as const);

export const DECISION_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-6-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend the platform without modifying certified APP-6 implementation.",
  permitted: Object.freeze([
    "consumer_bindings",
    "adapter_wrappers",
    "metadata_extensions",
    "future_layer_modules",
    "future_app_extensions",
  ]),
  forbidden: Object.freeze([
    "engine_rewrites",
    "public_api_breaking_changes",
    "decision_vocabulary_changes",
    "event_model_changes",
    "direct_engine_consumer_access",
    "dashboard_bypass",
    "assistant_bypass",
  ]),
  integrationBoundary: "APP-6:9 Dashboard Integration / APP-6:10 Assistant Integration",
  readOnly: true as const,
} as const);

export const DECISION_TIMELINE_PLATFORM_PUBLIC_GUARANTEES = Object.freeze([
  "frozen_public_apis",
  "frozen_contracts",
  "frozen_decision_vocabulary",
  "frozen_event_model",
  "backward_compatibility",
  "extension_only_future_development",
  "no_breaking_changes",
  "architecture_stability",
  "workspace_isolation",
] as const);

export const DECISION_TIMELINE_PLATFORM_FROZEN_PHASES = Object.freeze([
  Object.freeze({ phaseId: "APP-6/1", title: "Decision Timeline Foundation", contractVersion: "APP-6/1" }),
  Object.freeze({ phaseId: "APP-6/2", title: "Decision Event Engine", contractVersion: "APP-6/2" }),
  Object.freeze({ phaseId: "APP-6/3", title: "Decision History Engine", contractVersion: "APP-6/3" }),
  Object.freeze({ phaseId: "APP-6/4", title: "Decision Lifecycle Engine", contractVersion: "APP-6/4" }),
  Object.freeze({ phaseId: "APP-6/5", title: "Decision State Engine", contractVersion: "APP-6/5" }),
  Object.freeze({ phaseId: "APP-6/6", title: "Decision Query Engine", contractVersion: "APP-6/6" }),
  Object.freeze({ phaseId: "APP-6/7", title: "Decision Comparison Engine", contractVersion: "APP-6/7" }),
  Object.freeze({ phaseId: "APP-6/8", title: "Decision Replay Engine", contractVersion: "APP-6/8" }),
  Object.freeze({ phaseId: "APP-6/9", title: "Decision Dashboard Integration", contractVersion: "APP-6/9" }),
  Object.freeze({ phaseId: "APP-6/10", title: "Decision Assistant Integration", contractVersion: "APP-6/10" }),
  Object.freeze({ phaseId: "APP-6/11", title: "Platform Certification", contractVersion: "APP-6/11" }),
  Object.freeze({ phaseId: "APP-6/12", title: "Platform Freeze", contractVersion: "APP-6/12" }),
] as const);

export const DECISION_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
  "createDecisionTimelineFoundation",
  "validateDecisionTimelineFoundation",
  "getDecisionTimelineManifest",
  "buildDecisionEvent",
  "initializeDecisionEventEngine",
  "computeDecisionHistory",
  "deriveDecisionLifecycle",
  "computeDecisionState",
  "getDecisionById",
  "listDecisionStates",
  "getActiveDecisions",
  "getTerminalDecisions",
  "getRecentDecisions",
  "compareDecisions",
  "createDecisionReplay",
  "moveReplayCursor",
  "buildDecisionDashboardModel",
  "buildDecisionDashboardSummary",
  "buildDecisionAssistantModel",
  "buildDecisionExplanation",
  "runDecisionTimelinePlatformCertification",
  "runDecisionTimelinePlatformFreeze",
] as const);

export const DECISION_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY = Object.freeze([
  Object.freeze({ contractId: "APP-6/1", label: "Foundation", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/2", label: "Event Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/3", label: "History Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/4", label: "Lifecycle Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/5", label: "State Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/6", label: "Query Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/7", label: "Comparison Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/8", label: "Replay Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/9", label: "Dashboard Integration", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/10", label: "Assistant Integration", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/11", label: "Platform Certification", frozen: true as const }),
  Object.freeze({ contractId: "APP-6/12", label: "Platform Freeze", frozen: true as const }),
] as const);

export type DecisionTimelinePlatformRegistrySnapshot = Readonly<{
  registryVersion: typeof DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;
  platformId: string;
  platformName: string;
  releaseVersion: string;
  frozen: boolean;
  publicApiCount: number;
  contractCount: number;
  moduleCount: number;
  readOnly: true;
}>;

let publishedManifest: import("./decisionTimelinePlatformFreezeManifest.ts").DecisionTimelinePlatformFreezeManifest | null =
  null;

export function resetDecisionTimelinePlatformFreezeRegistryForTests(): void {
  publishedManifest = null;
}

export function registerDecisionTimelinePlatformFreezeManifest(
  manifest: import("./decisionTimelinePlatformFreezeManifest.ts").DecisionTimelinePlatformFreezeManifest
): void {
  publishedManifest = manifest;
}

export function getPublishedDecisionTimelineFreezeManifest():
  | import("./decisionTimelinePlatformFreezeManifest.ts").DecisionTimelinePlatformFreezeManifest
  | null {
  return publishedManifest;
}

export function getDecisionTimelinePlatformRegistry(): DecisionTimelinePlatformRegistrySnapshot {
  const manifest = publishedManifest;
  return Object.freeze({
    registryVersion: DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
    platformId: manifest?.platformId ?? "decision-timeline-platform",
    platformName: manifest?.platformName ?? "Decision Timeline",
    releaseVersion: manifest?.releaseVersion ?? DECISION_TIMELINE_PLATFORM_VERSION,
    frozen: manifest?.frozen === true,
    publicApiCount: DECISION_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS.length,
    contractCount: DECISION_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY.length,
    moduleCount: DECISION_TIMELINE_PLATFORM_FROZEN_PHASES.length,
    readOnly: true as const,
  });
}

export const DecisionTimelinePlatformFreezeRegistry = Object.freeze({
  resetDecisionTimelinePlatformFreezeRegistryForTests,
  registerDecisionTimelinePlatformFreezeManifest,
  getPublishedDecisionTimelineFreezeManifest,
  getDecisionTimelinePlatformRegistry,
});
