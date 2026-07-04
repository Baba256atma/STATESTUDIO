import type {
  ExecutivePrioritySignalCategory,
  ExecutivePrioritySignalMetadata,
  ExecutivePrioritySignalPlatform as ExecutivePrioritySignalPlatformContract,
  ExecutivePrioritySignalPolicy,
} from "./executivePrioritySignalTypes.ts";

export const EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_ID = "executive-priority-signal-platform";
export const EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_VERSION = "LAY-CONN-7";

export const EXECUTIVE_PRIORITY_SIGNAL_CATEGORIES: readonly ExecutivePrioritySignalCategory[] = Object.freeze([
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

export const EXECUTIVE_PRIORITY_SIGNAL_TYPES: readonly string[] = Object.freeze([
  "strategic-priority",
  "operational-priority",
  "critical-priority",
  "urgent-priority",
  "risk-priority",
  "opportunity-priority",
  "resource-priority",
  "timeline-priority",
  "dependency-priority",
  "stakeholder-priority",
  "executive-priority",
  "awareness-priority",
] as const);

export const EXECUTIVE_PRIORITY_SIGNAL_METADATA: ExecutivePrioritySignalMetadata = Object.freeze({
  platformId: EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_ID,
  phaseId: "LAY-CONN-7",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "priority-signal", "metadata-contract"] as const),
});

export const EXECUTIVE_PRIORITY_SIGNAL_POLICY: ExecutivePrioritySignalPolicy = Object.freeze({
  policyId: "priority-signal-metadata-only-policy",
  derivationAllowed: false,
  confidenceAssignmentAllowed: false,
  orderingAllowed: false,
  timeAssignmentAllowed: false,
  adjustmentAllowed: false,
  finalizationAllowed: false,
  distributionAllowed: false,
  pathSelectionAllowed: false,
  selectionAllowed: false,
  stateMutationAllowed: false,
  extensionMode: "additive-only",
});

export const ExecutivePrioritySignalPlatform: ExecutivePrioritySignalPlatformContract = Object.freeze({
  platformId: EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_ID,
  name: "Executive Priority Signal Platform",
  signals: Object.freeze([
    Object.freeze({ identity: Object.freeze({ signalId: "strategic-priority-signal", name: "Strategic Priority", category: "Strategic", priorityType: "strategic-priority" }), level: "Reference", severity: "Notable", confidence: "Unspecified", sourceId: "awareness-context-provider", targetId: "lay-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "operational-priority-signal", name: "Operational Priority", category: "Operational", priorityType: "operational-priority" }), level: "Reference", severity: "Informational", confidence: "Unspecified", sourceId: "awareness-context-provider", targetId: "dashboard-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "critical-priority-signal", name: "Critical Priority", category: "Decision", priorityType: "critical-priority" }), level: "Critical", severity: "Critical", confidence: "Unspecified", sourceId: "app-judge-provider", targetId: "lay-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "urgent-priority-signal", name: "Urgent Priority", category: "Timeline", priorityType: "urgent-priority" }), level: "Urgent", severity: "Urgent", confidence: "Unspecified", sourceId: "runtime-provider", targetId: "assistant-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "risk-priority-signal", name: "Risk Priority", category: "Risk", priorityType: "risk-priority" }), level: "Reference", severity: "Elevated", confidence: "Unspecified", sourceId: "app-judge-provider", targetId: "dashboard-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "opportunity-priority-signal", name: "Opportunity Priority", category: "Opportunity", priorityType: "opportunity-priority" }), level: "Reference", severity: "Notable", confidence: "Unspecified", sourceId: "recommendation-provider", targetId: "lay-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "resource-priority-signal", name: "Resource Priority", category: "Resource", priorityType: "resource-priority" }), level: "Reference", severity: "Notable", confidence: "Unspecified", sourceId: "knowledge-provider", targetId: "dashboard-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "timeline-priority-signal", name: "Timeline Priority", category: "Timeline", priorityType: "timeline-priority" }), level: "Reference", severity: "Informational", confidence: "Unspecified", sourceId: "runtime-provider", targetId: "assistant-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "dependency-priority-signal", name: "Dependency Priority", category: "Dependency", priorityType: "dependency-priority" }), level: "Reference", severity: "Elevated", confidence: "Unspecified", sourceId: "attention-signal-provider", targetId: "lay-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "stakeholder-priority-signal", name: "Stakeholder Priority", category: "Stakeholder", priorityType: "stakeholder-priority" }), level: "Reference", severity: "Notable", confidence: "Unspecified", sourceId: "smm-provider", targetId: "dashboard-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "executive-priority-signal", name: "Executive Priority", category: "Decision", priorityType: "executive-priority" }), level: "Reference", severity: "Notable", confidence: "Unspecified", sourceId: "app-judge-provider", targetId: "lay-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
    Object.freeze({ identity: Object.freeze({ signalId: "awareness-priority-signal", name: "Awareness Priority", category: "Awareness", priorityType: "awareness-priority" }), level: "Reference", severity: "Informational", confidence: "Unspecified", sourceId: "awareness-context-provider", targetId: "assistant-priority-consumer", metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA }),
  ] as const),
  policy: EXECUTIVE_PRIORITY_SIGNAL_POLICY,
  metadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA,
});
