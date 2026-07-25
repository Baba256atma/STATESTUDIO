/** ASSISTANT-9:2 — Immutable registry collections and relationships. */
import { AssistantActionMonitoringControlFoundation } from "./assistantActionMonitoringControlFoundation.ts";
import type {
  AssistantActionMonitoringControlRegistryEntry,
  AssistantActionMonitoringControlRegistryRelationship,
} from "./assistantActionMonitoringControlRegistryTypes.ts";

const foundationId =
  AssistantActionMonitoringControlFoundation.identity.id;

const registerNamedEntries = (
  registryGroup: string,
  names: readonly string[],
  parentReference: string | null = null,
): readonly AssistantActionMonitoringControlRegistryEntry[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-9:2/${registryGroup}/${String(index + 1).padStart(2, "0")}`,
    canonicalName: name,
    displayName: name,
    description:
      `Canonical ${registryGroup} registry metadata for ${name}.`,
    registryGroup,
    version: "1.0.0",
    status: "Registered",
    parentReference,
    compatibility: "ASSISTANT-9 Foundation Compatible",
    sourceFoundationReference: foundationId,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const registerFoundationEntries = (
  registryGroup: string,
  source: readonly {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
  }[],
): readonly AssistantActionMonitoringControlRegistryEntry[] => Object.freeze(
  source.map((entry, index) => Object.freeze({
    id: `ASSISTANT-9:2/${registryGroup}/${String(index + 1).padStart(2, "0")}`,
    canonicalName: entry.name,
    displayName: entry.name,
    description: entry.description
      ?? `Canonical ${registryGroup} registry metadata for ${entry.name}.`,
    registryGroup,
    version: "1.0.0",
    status: "Registered",
    parentReference: entry.id,
    compatibility: "ASSISTANT-9 Foundation Compatible",
    sourceFoundationReference: entry.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const MonitoringDomainEntries = registerNamedEntries(
  "MonitoringDomain",
  [
    "Executive",
    "Strategic",
    "Operational",
    "Financial",
    "Project",
    "Workflow",
    "Resource",
    "Compliance",
  ],
);

export const MonitoringStateEntries = registerNamedEntries(
  "MonitoringState",
  [
    "Registered",
    "Waiting",
    "Observing",
    "Monitoring",
    "Evaluating",
    "Controlled",
    "Completed",
    "Archived",
  ],
  "MonitoringDomain",
);

export const ProgressStateEntries = registerNamedEntries(
  "ProgressState",
  [
    "NotStarted",
    "Started",
    "OnTrack",
    "Delayed",
    "Blocked",
    "Completed",
  ],
  "MonitoringState",
);

export const KpiObservationTypeEntries = registerNamedEntries(
  "KpiObservationType",
  [
    "KPI Increase",
    "KPI Decrease",
    "KPI Stable",
    "KPI Missing",
    "KPI Warning",
  ],
);

export const GoalObservationTypeEntries = registerNamedEntries(
  "GoalObservationType",
  [
    "Achieved",
    "InProgress",
    "Delayed",
    "AtRisk",
    "Failed",
  ],
);

export const RiskCategoryEntries = registerNamedEntries(
  "RiskCategory",
  [
    "Low",
    "Medium",
    "High",
    "Critical",
  ],
);

export const AlertCategoryEntries = registerNamedEntries(
  "AlertCategory",
  [
    "Information",
    "Warning",
    "Critical",
    "Escalation",
  ],
  "ProgressState",
);

export const ExceptionCategoryEntries = registerNamedEntries(
  "ExceptionCategory",
  [
    "Timeout",
    "DependencyFailure",
    "ValidationFailure",
    "ExecutionFailure",
    "Unknown",
  ],
);

export const FeedbackCategoryEntries = registerNamedEntries(
  "FeedbackCategory",
  [
    "Positive",
    "Neutral",
    "Negative",
    "Improvement",
    "Recommendation",
  ],
  "ControlActionCategory",
);

export const ControlActionCategoryEntries = registerNamedEntries(
  "ControlActionCategory",
  [
    "Observe",
    "Notify",
    "Escalate",
    "Pause",
    "Resume",
    "Recover",
    "Close",
  ],
  "AlertCategory",
);

export const MonitoringPolicyEntries = registerFoundationEntries(
  "MonitoringPolicy",
  AssistantActionMonitoringControlFoundation.policies,
);

export const CapabilityRegistryEntries = registerFoundationEntries(
  "MonitoringCapability",
  AssistantActionMonitoringControlFoundation.capabilities,
);

export const AssistantActionMonitoringControlRegistryCollections =
  Object.freeze({
    monitoringDomains: MonitoringDomainEntries,
    monitoringStates: MonitoringStateEntries,
    progressStates: ProgressStateEntries,
    kpiObservationTypes: KpiObservationTypeEntries,
    goalObservationTypes: GoalObservationTypeEntries,
    riskCategories: RiskCategoryEntries,
    alertCategories: AlertCategoryEntries,
    exceptionCategories: ExceptionCategoryEntries,
    feedbackCategories: FeedbackCategoryEntries,
    controlActionCategories: ControlActionCategoryEntries,
    monitoringPolicies: MonitoringPolicyEntries,
    capabilities: CapabilityRegistryEntries,
  });

export const AssistantActionMonitoringControlRegistryEntries = Object.freeze([
  ...MonitoringDomainEntries,
  ...MonitoringStateEntries,
  ...ProgressStateEntries,
  ...KpiObservationTypeEntries,
  ...GoalObservationTypeEntries,
  ...RiskCategoryEntries,
  ...AlertCategoryEntries,
  ...ExceptionCategoryEntries,
  ...FeedbackCategoryEntries,
  ...ControlActionCategoryEntries,
  ...MonitoringPolicyEntries,
  ...CapabilityRegistryEntries,
]);

const relationshipDeclarations = Object.freeze([
  [
    "MonitoringDomain",
    "MonitoringState",
    "Monitoring Domain precedes Monitoring State metadata.",
  ],
  [
    "MonitoringState",
    "ProgressState",
    "Monitoring State precedes Progress State metadata.",
  ],
  [
    "ProgressState",
    "AlertCategory",
    "Progress State precedes Alert Category metadata.",
  ],
  [
    "AlertCategory",
    "ControlActionCategory",
    "Alert Category precedes Control Action Category metadata.",
  ],
  [
    "ControlActionCategory",
    "FeedbackCategory",
    "Control Action Category precedes Feedback Category metadata.",
  ],
] as const);

export const AssistantActionMonitoringControlRegistryRelationships:
readonly AssistantActionMonitoringControlRegistryRelationship[] =
  Object.freeze(
    relationshipDeclarations.map(
      ([sourceGroup, targetGroup, description], index) => Object.freeze({
        id: `ASSISTANT-9:2/Relationship/${String(index + 1).padStart(2, "0")}`,
        sourceGroup,
        targetGroup,
        relationshipType: "precedes",
        description,
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );
