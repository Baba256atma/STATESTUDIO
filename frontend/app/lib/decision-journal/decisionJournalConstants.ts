/**
 * APP-8:1 — Decision Journal Platform constants.
 */

import type {
  DecisionJournalConfidence,
  DecisionJournalSource,
  DecisionJournalStatus,
} from "./decisionJournalTypes.ts";

export const DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION = "APP-8/1" as const;
export const DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION = "APP-8/1-arch" as const;
export const DECISION_JOURNAL_PLATFORM_API_VERSION = "APP-8/1" as const;
export const DECISION_JOURNAL_PLATFORM_SOURCE = "decision-journal-platform-foundation" as const;
export const DECISION_JOURNAL_PLATFORM_LOG_PREFIX = "[NexoraDecisionJournal]" as const;
export const DECISION_JOURNAL_PLATFORM = "nexora-type-c" as const;

export const DECISION_JOURNAL_PLATFORM_ID = "decision-journal-platform" as const;
export const DECISION_JOURNAL_PLATFORM_NAME = "Decision Journal" as const;

export const DECISION_JOURNAL_PLATFORM_TAGS = Object.freeze([
  "[APP8_1]",
  "[DECISION_JOURNAL_FOUNDATION]",
  "[DECISION_JOURNAL_CONTRACT]",
  "[METADATA_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[NO_RUNTIME]",
] as const);

export const DECISION_JOURNAL_STATUS_KEYS = Object.freeze([
  "draft",
  "active",
  "reviewed",
  "archived",
] as const satisfies readonly DecisionJournalStatus[]);

export const DECISION_JOURNAL_SOURCE_KEYS = Object.freeze([
  "manual",
  "assistant",
  "imported",
  "workspace",
  "api",
] as const satisfies readonly DecisionJournalSource[]);

export const DECISION_JOURNAL_CONFIDENCE_KEYS = Object.freeze([
  "very_low",
  "low",
  "medium",
  "high",
  "very_high",
] as const satisfies readonly DecisionJournalConfidence[]);

export const DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "title",
  "summary",
  "rationale",
  "assumptions",
  "alternatives",
  "evidenceReferences",
  "acceptedRisks",
  "expectedOutcome",
  "confidence",
  "tradeoffs",
  "constraints",
  "author",
  "reviewers",
  "tags",
  "metadata",
  "createdAt",
  "updatedAt",
  "version",
] as const);

export const DECISION_JOURNAL_OPTIONAL_ENTRY_FIELDS = Object.freeze([
  "decisionId",
  "scenarioId",
] as const);

export const DECISION_JOURNAL_PLATFORM_PRINCIPLES = Object.freeze([
  "journal_entry_ids_are_immutable",
  "executive_thinking_is_preserved",
  "rationale_is_first_class_metadata",
  "every_entry_belongs_to_one_workspace",
  "journal_timestamps_are_immutable",
  "journal_metadata_is_version_safe",
  "platform_must_remain_deterministic",
  "no_runtime_mutations",
  "no_execution_logic",
  "no_visualization_logic",
  "no_ai_reasoning_in_foundation",
] as const);

export const DECISION_JOURNAL_FUTURE_PHASE_KEYS = Object.freeze([
  "journal_engine",
  "journal_storage",
  "journal_editor",
  "journal_visualization",
  "journal_dashboard",
  "journal_assistant",
  "journal_search",
  "journal_decision_timeline_link",
  "journal_analytics",
] as const);

export const DECISION_JOURNAL_MUST_NOT_OWN = Object.freeze([
  "journal_storage",
  "journal_engine",
  "visualization",
  "dashboard",
  "assistant",
  "search",
  "analytics",
  "ai_reasoning",
  "execution_engine",
  "database",
  "persistence",
  "api_routes",
  "react_ui",
  "timeline_rendering",
  "decision_timeline_engine",
] as const);

export const DECISION_JOURNAL_PLATFORM_CAPABILITIES = Object.freeze([
  "platform_identity",
  "journal_entry_contracts",
  "decision_journal_registry",
  "journal_validation",
  "manifest_generation",
  "extension_registration",
  "workspace_isolation_contracts",
] as const);

export const DECISION_JOURNAL_FUTURE_COMPATIBILITY = Object.freeze({
  app8Ready: true,
  journalEngineReady: false,
  storageReady: false,
  visualizationReady: false,
  dashboardReady: false,
  assistantReady: false,
  analyticsReady: false,
  decisionTimelineLinkReady: false,
  scenarioTimelineConsumerReady: true,
  decisionTimelineConsumerReady: true,
  workspaceConsumerReady: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const DECISION_JOURNAL_DEFAULT_LIMITS = Object.freeze({
  maxJournalLabelLength: 128,
  maxJournalDescriptionLength: 512,
  maxEntryTitleLength: 256,
  maxEntrySummaryLength: 1024,
  maxEntryRationaleLength: 8192,
  maxRegisteredJournals: 256,
  maxListItemsPerField: 32,
  maxTagsPerEntry: 32,
  maxTagLength: 64,
  maxReviewersPerEntry: 16,
} as const);

export const DECISION_JOURNAL_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "journal-visualization", label: "Journal Visualization", phaseKey: "journal_visualization", status: "registered" as const }),
  Object.freeze({ extensionId: "journal-analytics", label: "Journal Analytics", phaseKey: "journal_analytics", status: "registered" as const }),
  Object.freeze({ extensionId: "journal-dashboard", label: "Journal Dashboard", phaseKey: "journal_dashboard", status: "registered" as const }),
  Object.freeze({ extensionId: "journal-assistant", label: "Journal Assistant", phaseKey: "journal_assistant", status: "registered" as const }),
] as const);

export const DECISION_JOURNAL_METADATA_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "journal-metadata-rationale", label: "Rationale Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "journal-metadata-evidence", label: "Evidence Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "journal-metadata-confidence", label: "Confidence Metadata", status: "registered" as const }),
] as const);

export const DECISION_JOURNAL_COMPATIBILITY_REGISTRY = Object.freeze([
  Object.freeze({ guaranteeId: "backward-compatibility", description: "Public interfaces extend only; breaking changes forbidden.", enforced: true as const }),
  Object.freeze({ guaranteeId: "metadata-only-foundation", description: "APP-8:1 provides contracts and registry only — no runtime execution.", enforced: true as const }),
  Object.freeze({ guaranteeId: "executive-thinking-canonical", description: "Decision Journal preserves why decisions happened — not when they happened.", enforced: true as const }),
  Object.freeze({ guaranteeId: "app6-decision-reference", description: "Future-compatible with APP-6 Decision Timeline without modification in APP-8:1.", enforced: true as const }),
  Object.freeze({ guaranteeId: "app7-business-reference", description: "Compatible with APP-7 Business Timeline without modification.", enforced: true as const }),
  Object.freeze({ guaranteeId: "frozen-prior-platforms", description: "Does not modify certified APP-1 through APP-7 platforms.", enforced: true as const }),
] as const);

export const DECISION_JOURNAL_RELEASE_METADATA = Object.freeze({
  releaseStage: "foundation",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  readOnly: true,
} as const);

export const DECISION_JOURNAL_CERTIFICATION_METADATA = Object.freeze({
  certificationPhase: "APP-8/1",
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
    "workspace_isolation",
    "journal_identity",
  ]),
  readOnly: true,
} as const);

export const DECISION_JOURNAL_RESERVED_METADATA_KEYS = Object.freeze([
  "journal-system-metadata",
  "journal-reserved-metadata",
  "journal-internal-metadata",
] as const);

export const DECISION_JOURNAL_RESERVED_JOURNAL_IDS = Object.freeze([
  "decision-journal-system",
  "decision-journal-reserved",
  "decision-journal-internal",
] as const);
