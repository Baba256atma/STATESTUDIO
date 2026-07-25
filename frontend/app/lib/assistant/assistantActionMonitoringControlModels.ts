/** ASSISTANT-9:3 — Exactly 14 canonical monitoring domain models. */
import { AssistantActionMonitoringControlModelStructuralMetadata } from "./assistantActionMonitoringControlModelMetadata.ts";
import type { AssistantActionMonitoringControlDomainModelMetadata } from "./assistantActionMonitoringControlModelTypes.ts";
import { AssistantActionMonitoringControlRelationships } from "./assistantActionMonitoringControlRelationships.ts";
import { AssistantActionMonitoringControlRegistry } from "./assistantActionMonitoringControlRegistry.ts";

const registry = AssistantActionMonitoringControlRegistry;
const policyReference =
  AssistantActionMonitoringControlModelStructuralMetadata
    .defaultPolicyReference;

const registryRef = (
  collection: readonly { readonly id: string }[],
): string =>
  collection[0]?.id ?? registry.identity.id;

const relationshipsFor = (modelName: string): readonly string[] =>
  Object.freeze(
    AssistantActionMonitoringControlRelationships
      .filter(({ source, target }) =>
        source === modelName || target === modelName)
      .map(({ id }) => id),
  );

const declarations = Object.freeze([
  [
    "ExecutiveActionMonitoringModel",
    "Executive Action Monitoring",
    "Canonical domain model for monitoring a single Executive Action.",
    registryRef(registry.collections.monitoringDomains),
  ],
  [
    "MonitoringSessionModel",
    "Monitoring Session",
    "Canonical domain model for one monitoring session.",
    registryRef(registry.collections.monitoringStates),
  ],
  [
    "MonitoringStateModel",
    "Monitoring State",
    "Canonical domain model for monitoring lifecycle state.",
    registryRef(registry.collections.monitoringStates),
  ],
  [
    "ProgressTrackingModel",
    "Progress Tracking",
    "Canonical domain model for execution progress observations.",
    registryRef(registry.collections.progressStates),
  ],
  [
    "KPIObservationModel",
    "KPI Observation",
    "Canonical domain model for KPI observation metadata.",
    registryRef(registry.collections.kpiObservationTypes),
  ],
  [
    "GoalObservationModel",
    "Goal Observation",
    "Canonical domain model for goal achievement observations.",
    registryRef(registry.collections.goalObservationTypes),
  ],
  [
    "RiskObservationModel",
    "Risk Observation",
    "Canonical domain model for monitored risk observations.",
    registryRef(registry.collections.riskCategories),
  ],
  [
    "AlertModel",
    "Alert",
    "Canonical domain model for alert metadata.",
    registryRef(registry.collections.alertCategories),
  ],
  [
    "ExceptionModel",
    "Exception",
    "Canonical domain model for monitoring exception metadata.",
    registryRef(registry.collections.exceptionCategories),
  ],
  [
    "ControlDecisionModel",
    "Control Decision",
    "Canonical domain model for control recommendation metadata.",
    registryRef(registry.collections.controlActionCategories),
  ],
  [
    "FeedbackModel",
    "Feedback",
    "Canonical domain model for execution feedback metadata.",
    registryRef(registry.collections.feedbackCategories),
  ],
  [
    "MonitoringPolicyModel",
    "Monitoring Policy",
    "Canonical domain model for monitoring policy metadata.",
    registryRef(registry.collections.monitoringPolicies),
  ],
  [
    "MonitoringContextModel",
    "Monitoring Context",
    "Canonical domain model for contextual monitoring information.",
    registryRef(registry.collections.monitoringDomains),
  ],
  [
    "MonitoringCapabilityModel",
    "Monitoring Capability",
    "Canonical domain model for Foundation monitoring capabilities.",
    registryRef(registry.collections.capabilities),
  ],
] as const);

export const AssistantActionMonitoringControlDomainModels:
readonly AssistantActionMonitoringControlDomainModelMetadata[] =
  Object.freeze(
    declarations.map(
      ([name, displayName, description, parentRegistryReference], index) =>
        Object.freeze({
          id: `ASSISTANT-9:3/DomainModel/${
            String(index + 1).padStart(2, "0")
          }`,
          name,
          displayName,
          description,
          parentRegistryReference,
          version: "1.0.0",
          status: "Canonical",
          lifecycleReference: "ASSISTANT-9:3/Lifecycle",
          compatibility: "ASSISTANT-9 Registry Compatible",
          policyReference,
          relationshipReferences: relationshipsFor(name),
          order: index + 1,
          executable: false,
          metadataOnly: true,
          immutable: true,
        }),
    ),
  );

export const ExecutiveActionMonitoringModel =
  AssistantActionMonitoringControlDomainModels[0];
export const MonitoringSessionModel =
  AssistantActionMonitoringControlDomainModels[1];
export const MonitoringStateModel =
  AssistantActionMonitoringControlDomainModels[2];
export const ProgressTrackingModel =
  AssistantActionMonitoringControlDomainModels[3];
export const KPIObservationModel =
  AssistantActionMonitoringControlDomainModels[4];
export const GoalObservationModel =
  AssistantActionMonitoringControlDomainModels[5];
export const RiskObservationModel =
  AssistantActionMonitoringControlDomainModels[6];
export const AlertModel = AssistantActionMonitoringControlDomainModels[7];
export const ExceptionModel =
  AssistantActionMonitoringControlDomainModels[8];
export const ControlDecisionModel =
  AssistantActionMonitoringControlDomainModels[9];
export const FeedbackModel =
  AssistantActionMonitoringControlDomainModels[10];
export const MonitoringPolicyModel =
  AssistantActionMonitoringControlDomainModels[11];
export const MonitoringContextModel =
  AssistantActionMonitoringControlDomainModels[12];
export const MonitoringCapabilityModel =
  AssistantActionMonitoringControlDomainModels[13];
