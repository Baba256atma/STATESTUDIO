import type {
  ExecutiveAttentionSignalCategory,
  ExecutiveAttentionSignalMetadata,
  ExecutiveAttentionSignalPlatform as ExecutiveAttentionSignalPlatformContract,
  ExecutiveAttentionSignalPolicy,
} from "./executiveAttentionSignalTypes.ts";

export const EXECUTIVE_ATTENTION_SIGNAL_PLATFORM_ID = "executive-attention-signal-platform";
export const EXECUTIVE_ATTENTION_SIGNAL_PLATFORM_VERSION = "LAY-CONN-6";

export const EXECUTIVE_ATTENTION_SIGNAL_CATEGORIES: readonly ExecutiveAttentionSignalCategory[] = Object.freeze([
  "Strategic",
  "Operational",
  "Decision",
  "Risk",
  "Opportunity",
  "Resource",
  "Timeline",
  "Stakeholder",
  "Dependency",
  "Awareness",
  "Confidence",
  "Constraint",
] as const);

export const EXECUTIVE_ATTENTION_SIGNAL_TYPES: readonly string[] = Object.freeze([
  "strategic-attention",
  "operational-attention",
  "critical-attention",
  "urgent-attention",
  "opportunity-attention",
  "risk-attention",
  "timeline-attention",
  "resource-attention",
  "dependency-attention",
  "stakeholder-attention",
  "confidence-attention",
  "awareness-attention",
] as const);

export const EXECUTIVE_ATTENTION_SIGNAL_METADATA: ExecutiveAttentionSignalMetadata = Object.freeze({
  platformId: EXECUTIVE_ATTENTION_SIGNAL_PLATFORM_ID,
  phaseId: "LAY-CONN-6",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "attention-signal", "metadata-contract"] as const),
});

export const EXECUTIVE_ATTENTION_SIGNAL_POLICY: ExecutiveAttentionSignalPolicy = Object.freeze({
  policyId: "attention-signal-metadata-only-policy",
  creationAllowed: false,
  distributionAllowed: false,
  pathSelectionAllowed: false,
  orderingAllowed: false,
  selectionAllowed: false,
  stateMutationAllowed: false,
  extensionMode: "additive-only",
});

export const ExecutiveAttentionSignalPlatform: ExecutiveAttentionSignalPlatformContract = Object.freeze({
  platformId: EXECUTIVE_ATTENTION_SIGNAL_PLATFORM_ID,
  name: "Executive Attention Signal Platform",
  signals: Object.freeze([
    Object.freeze({ identity: Object.freeze({ signalId: "strategic-attention-signal", name: "Strategic Attention", category: "Strategic", signalType: "strategic-attention" }), severity: "Notable", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "awareness-context-provider", targetId: "lay-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "operational-attention-signal", name: "Operational Attention", category: "Operational", signalType: "operational-attention" }), severity: "Informational", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "awareness-context-provider", targetId: "dashboard-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "critical-attention-signal", name: "Critical Attention", category: "Decision", signalType: "critical-attention" }), severity: "Critical", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "app-judge-provider", targetId: "lay-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "urgent-attention-signal", name: "Urgent Attention", category: "Timeline", signalType: "urgent-attention" }), severity: "Urgent", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "runtime-provider", targetId: "assistant-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "opportunity-attention-signal", name: "Opportunity Attention", category: "Opportunity", signalType: "opportunity-attention" }), severity: "Notable", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "recommendation-provider", targetId: "lay-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "risk-attention-signal", name: "Risk Attention", category: "Risk", signalType: "risk-attention" }), severity: "Elevated", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "app-judge-provider", targetId: "dashboard-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "timeline-attention-signal", name: "Timeline Attention", category: "Timeline", signalType: "timeline-attention" }), severity: "Informational", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "runtime-provider", targetId: "dashboard-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "resource-attention-signal", name: "Resource Attention", category: "Resource", signalType: "resource-attention" }), severity: "Notable", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "knowledge-provider", targetId: "lay-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "dependency-attention-signal", name: "Dependency Attention", category: "Dependency", signalType: "dependency-attention" }), severity: "Elevated", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "awareness-context-provider", targetId: "assistant-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "stakeholder-attention-signal", name: "Stakeholder Attention", category: "Stakeholder", signalType: "stakeholder-attention" }), severity: "Notable", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "smm-provider", targetId: "lay-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "confidence-attention-signal", name: "Confidence Attention", category: "Confidence", signalType: "confidence-attention" }), severity: "Informational", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "app-reason-provider", targetId: "dashboard-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "awareness-attention-signal", name: "Awareness Attention", category: "Awareness", signalType: "awareness-attention" }), severity: "Informational", priority: "MetadataOnly", confidence: "Unspecified", sourceId: "awareness-context-provider", targetId: "lay-attention-consumer", metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA }),
  ] as const),
  policy: EXECUTIVE_ATTENTION_SIGNAL_POLICY,
  metadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA,
});
