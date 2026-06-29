/**
 * APP-9:1 — Confidence Evolution Platform constants.
 */

import type {
  ConfidenceChangeReason,
  ConfidenceLevel,
  ConfidenceSource,
} from "./confidenceEvolutionTypes.ts";

export const CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION = "APP-9/1" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION = "APP-9/1-arch" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_API_VERSION = "APP-9/1" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_SOURCE = "confidence-evolution-platform-foundation" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_LOG_PREFIX = "[NexoraConfidenceEvolution]" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM = "nexora-type-c" as const;

export const CONFIDENCE_EVOLUTION_PLATFORM_ID = "confidence-evolution-platform" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_NAME = "Confidence Evolution" as const;

export const CONFIDENCE_EVOLUTION_PLATFORM_TAGS = Object.freeze([
  "[APP9_1]",
  "[CONFIDENCE_EVOLUTION_FOUNDATION]",
  "[CONFIDENCE_EVOLUTION_CONTRACT]",
  "[METADATA_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[NO_RUNTIME]",
] as const);

export const CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS = Object.freeze([
  "very_low",
  "low",
  "medium",
  "high",
  "very_high",
] as const satisfies readonly ConfidenceLevel[]);

export const CONFIDENCE_EVOLUTION_SOURCE_KEYS = Object.freeze([
  "manual",
  "assistant",
  "scenario",
  "evidence",
  "retrospective",
  "journal",
  "workspace",
  "api",
] as const satisfies readonly ConfidenceSource[]);

export const CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS = Object.freeze([
  "new_evidence",
  "risk_changed",
  "assumption_updated",
  "scenario_completed",
  "outcome_observed",
  "executive_review",
  "manual_revision",
  "unknown",
] as const satisfies readonly ConfidenceChangeReason[]);

export const CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "title",
  "confidenceLevel",
  "confidenceScore",
  "source",
  "reason",
  "notes",
  "evidenceReferences",
  "metadata",
  "createdAt",
  "updatedAt",
  "version",
] as const);

export const CONFIDENCE_EVOLUTION_OPTIONAL_RECORD_FIELDS = Object.freeze([
  "decisionId",
  "scenarioId",
  "journalEntryId",
  "previousConfidence",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES = Object.freeze([
  "confidence_record_ids_are_immutable",
  "executive_confidence_evolution_is_preserved",
  "confidence_change_reason_is_first_class_metadata",
  "every_record_belongs_to_one_workspace",
  "confidence_timestamps_are_immutable",
  "confidence_metadata_is_version_safe",
  "platform_must_remain_deterministic",
  "no_runtime_mutations",
  "no_execution_logic",
  "no_visualization_logic",
  "no_ai_reasoning_in_foundation",
  "no_trend_calculations_in_foundation",
] as const);

export const CONFIDENCE_EVOLUTION_FUTURE_PHASE_KEYS = Object.freeze([
  "evolution_engine",
  "trend_engine",
  "evolution_storage",
  "evolution_visualization",
  "evolution_dashboard",
  "evolution_assistant",
  "evolution_search",
  "evolution_decision_journal_link",
  "evolution_decision_timeline_link",
  "evolution_analytics",
] as const);

export const CONFIDENCE_EVOLUTION_MUST_NOT_OWN = Object.freeze([
  "evolution_storage",
  "evolution_engine",
  "trend_engine",
  "visualization",
  "dashboard",
  "assistant",
  "search",
  "analytics",
  "ai_reasoning",
  "prediction",
  "execution_engine",
  "database",
  "persistence",
  "api_routes",
  "react_ui",
  "decision_journal_engine",
  "decision_timeline_engine",
  "business_timeline_engine",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_CAPABILITIES = Object.freeze([
  "platform_identity",
  "confidence_record_contracts",
  "confidence_evolution_registry",
  "confidence_validation",
  "manifest_generation",
  "extension_registration",
  "workspace_isolation_contracts",
  "vocabulary_registration",
] as const);

export const CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY = Object.freeze({
  app9Ready: true,
  evolutionEngineReady: false,
  trendEngineReady: false,
  storageReady: false,
  visualizationReady: false,
  dashboardReady: false,
  assistantReady: false,
  decisionJournalLinkReady: false,
  decisionTimelineLinkReady: false,
  scenarioTimelineConsumerReady: true,
  workspaceConsumerReady: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const CONFIDENCE_EVOLUTION_DEFAULT_LIMITS = Object.freeze({
  maxEvolutionLabelLength: 128,
  maxEvolutionDescriptionLength: 512,
  maxRecordTitleLength: 256,
  maxRecordNotesLength: 4096,
  maxRegisteredEvolutions: 256,
  maxEvidenceReferences: 32,
  minConfidenceScore: 0,
  maxConfidenceScore: 1,
} as const);

export const CONFIDENCE_EVOLUTION_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "confidence-visualization", label: "Confidence Visualization", phaseKey: "evolution_visualization", status: "registered" as const }),
  Object.freeze({ extensionId: "confidence-analytics", label: "Confidence Analytics", phaseKey: "evolution_analytics", status: "registered" as const }),
  Object.freeze({ extensionId: "confidence-dashboard", label: "Confidence Dashboard", phaseKey: "evolution_dashboard", status: "registered" as const }),
  Object.freeze({ extensionId: "confidence-assistant", label: "Confidence Assistant", phaseKey: "evolution_assistant", status: "registered" as const }),
] as const);

export const CONFIDENCE_EVOLUTION_METADATA_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "confidence-metadata-volatility", label: "Volatility Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "confidence-metadata-stability", label: "Stability Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "confidence-metadata-milestone", label: "Milestone Metadata", status: "registered" as const }),
] as const);

export const CONFIDENCE_EVOLUTION_COMPATIBILITY_REGISTRY = Object.freeze([
  Object.freeze({ guaranteeId: "backward-compatibility", description: "Public interfaces extend only; breaking changes forbidden.", enforced: true as const }),
  Object.freeze({ guaranteeId: "metadata-only-foundation", description: "APP-9:1 provides contracts and registry only — no runtime execution.", enforced: true as const }),
  Object.freeze({ guaranteeId: "confidence-evolution-canonical", description: "Confidence Evolution preserves how executive confidence changes — not why decisions were made.", enforced: true as const }),
  Object.freeze({ guaranteeId: "frozen-prior-platforms", description: "Does not modify certified APP-1 through APP-8 platforms.", enforced: true as const }),
  Object.freeze({ guaranteeId: "no-app6-app7-app8-integration", description: "No integration with APP-6, APP-7, or APP-8 in APP-9:1 foundation.", enforced: true as const }),
] as const);

export const CONFIDENCE_EVOLUTION_RELEASE_METADATA = Object.freeze({
  releaseStage: "foundation",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  readOnly: true,
} as const);

export const CONFIDENCE_EVOLUTION_CERTIFICATION_METADATA = Object.freeze({
  certificationPhase: "APP-9/1",
  certificationScope: "platform-foundation",
  requiredChecks: Object.freeze([
    "platform_identity",
    "contracts",
    "registry",
    "constants",
    "manifest",
    "metadata",
    "public_api",
    "vocabulary",
    "workspace_isolation",
  ]),
  readOnly: true,
} as const);

export const CONFIDENCE_EVOLUTION_RESERVED_METADATA_KEYS = Object.freeze([
  "confidence-evolution-system-metadata",
  "confidence-evolution-reserved-metadata",
  "confidence-evolution-internal-metadata",
] as const);

export const CONFIDENCE_EVOLUTION_RESERVED_EVOLUTION_IDS = Object.freeze([
  "confidence-evolution-system",
  "confidence-evolution-reserved",
  "confidence-evolution-internal",
] as const);
