/**
 * APP-5:1 — Scenario Timeline Platform constants.
 * Versioning, lifecycle keys, limits, and certification tags.
 */

import type {
  ScenarioTimelineEventType,
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineTypeId,
} from "./scenarioTimelinePlatformTypes.ts";

export const SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION = "APP-5/1" as const;
export const SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION = "APP-5/1-arch" as const;
export const SCENARIO_TIMELINE_PLATFORM_API_VERSION = "APP-5/1" as const;
export const SCENARIO_TIMELINE_PLATFORM_SOURCE = "scenario-timeline-platform-foundation" as const;
export const SCENARIO_TIMELINE_PLATFORM_LOG_PREFIX = "[NexoraScenarioTimeline]" as const;
export const SCENARIO_TIMELINE_PLATFORM = "nexora-type-c" as const;

export const SCENARIO_TIMELINE_PLATFORM_TAGS = Object.freeze([
  "[APP5_1]",
  "[SCENARIO_TIMELINE_FOUNDATION]",
  "[SCENARIO_TIMELINE_CONTRACT]",
  "[METADATA_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
  "[NO_VISUALIZATION]",
  "[NO_PERSISTENCE]",
] as const);

export const SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS = Object.freeze([
  "scenario_created",
  "scenario_updated",
  "scenario_simulated",
  "decision_made",
  "execution_started",
  "execution_finished",
  "actual_results_recorded",
  "lessons_learned",
] as const satisfies readonly ScenarioTimelineLifecycleStage[]);

export const SCENARIO_TIMELINE_EVENT_TYPE_KEYS = Object.freeze([
  "lifecycle_transition",
  "scenario_milestone",
  "decision_record",
  "execution_milestone",
  "results_recorded",
  "lesson_learned",
  "metadata_annotation",
  "custom",
] as const satisfies readonly ScenarioTimelineEventType[]);

export const SCENARIO_TIMELINE_RESERVED_TYPE_IDS = Object.freeze([
  "timeline-system",
  "timeline-reserved",
  "timeline-internal",
  "timeline-placeholder",
] as const satisfies readonly ScenarioTimelineTypeId[]);

export const SCENARIO_TIMELINE_MANDATORY_EVENT_FIELDS = Object.freeze([
  "eventId",
  "scenarioId",
  "workspaceId",
  "eventType",
  "lifecycleStage",
  "occurredAt",
  "sourceModule",
  "contractVersion",
] as const);

export const SCENARIO_TIMELINE_FUTURE_PHASE_KEYS = Object.freeze([
  "timeline_events",
  "timeline_storage",
  "timeline_retrieval",
  "timeline_search",
  "timeline_visualization",
  "timeline_playback",
  "timeline_filters",
  "timeline_assistant_integration",
  "timeline_dashboard_integration",
  "timeline_simulation_integration",
] as const);

export const SCENARIO_TIMELINE_MUST_NOT_OWN = Object.freeze([
  "timeline_ui",
  "timeline_charts",
  "scenario_history_viewer",
  "decision_timeline_viewer",
  "business_timeline_viewer",
  "executive_timeline_viewer",
  "timeline_playback",
  "timeline_filters",
  "timeline_search",
  "timeline_persistence",
  "simulation_integration",
  "assistant_integration",
  "dashboard_integration",
  "ai_recommendations",
  "semantic_reasoning",
  "vector_search",
] as const);

export const SCENARIO_TIMELINE_FUTURE_COMPATIBILITY = Object.freeze({
  app5Ready: true,
  eventsReady: false,
  storageReady: false,
  retrievalReady: false,
  visualizationReady: false,
  playbackReady: false,
  scenarioIntelligenceConsumerReady: true,
  executiveIntentConsumerReady: true,
  executiveMemoryConsumerReady: true,
  executiveTimeConsumerReady: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const SCENARIO_TIMELINE_DEFAULT_LIMITS = Object.freeze({
  maxTimelineTypeLabelLength: 128,
  maxTimelineTypeDescriptionLength: 512,
  maxEventTitleLength: 256,
  maxEventSummaryLength: 2048,
  maxRegisteredTimelineTypes: 64,
} as const);

export const SCENARIO_TIMELINE_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({
    extensionId: "timeline-events",
    label: "Timeline Events",
    phaseKey: "timeline_events",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "timeline-storage",
    label: "Timeline Storage",
    phaseKey: "timeline_storage",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "timeline-visualization",
    label: "Timeline Visualization",
    phaseKey: "timeline_visualization",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "timeline-playback",
    label: "Timeline Playback",
    phaseKey: "timeline_playback",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "timeline-simulation-integration",
    label: "Simulation Integration",
    phaseKey: "timeline_simulation_integration",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "timeline-assistant-integration",
    label: "Assistant Integration",
    phaseKey: "timeline_assistant_integration",
    status: "registered" as const,
  }),
] as const);

export const SCENARIO_TIMELINE_COMPATIBILITY_REGISTRY = Object.freeze([
  Object.freeze({
    guaranteeId: "backward-compatibility",
    description: "Public interfaces extend only; breaking changes forbidden.",
    enforced: true as const,
  }),
  Object.freeze({
    guaranteeId: "metadata-only-foundation",
    description: "APP-5:1 provides contracts and registry only — no runtime execution.",
    enforced: true as const,
  }),
  Object.freeze({
    guaranteeId: "scenario-lifecycle-canonical",
    description: "Canonical scenario lifecycle stages are immutable vocabulary.",
    enforced: true as const,
  }),
  Object.freeze({
    guaranteeId: "app2-scenario-consumer",
    description: "Compatible with APP-2 Scenario Intelligence identity contracts.",
    enforced: true as const,
  }),
  Object.freeze({
    guaranteeId: "frozen-app1-app4",
    description: "Does not modify certified APP-1 through APP-4 platforms.",
    enforced: true as const,
  }),
] as const);

export const SCENARIO_TIMELINE_RELEASE_METADATA = Object.freeze({
  releaseStage: "foundation",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  readOnly: true,
} as const);

export const SCENARIO_TIMELINE_CERTIFICATION_METADATA = Object.freeze({
  certificationPhase: "APP-5/1",
  certificationScope: "platform-foundation",
  requiredChecks: Object.freeze([
    "platform_identity",
    "contracts",
    "registry",
    "manifest",
    "compatibility",
    "extension_registry",
    "api_stability",
    "architecture_boundaries",
  ]),
  readOnly: true,
} as const);
