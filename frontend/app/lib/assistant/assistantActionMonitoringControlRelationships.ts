/** ASSISTANT-9:3 — Exactly 20 immutable monitoring relationship kinds. */
import { AssistantActionMonitoringControlRegistry } from "./assistantActionMonitoringControlRegistry.ts";
import type { AssistantActionMonitoringControlRelationshipMetadata } from "./assistantActionMonitoringControlModelTypes.ts";

const registryId = AssistantActionMonitoringControlRegistry.identity.id;

const declarations = Object.freeze([
  [
    "ExecutiveActionMonitoringModel",
    "contains",
    "MonitoringSessionModel",
    "Executive Action Monitoring contains Monitoring Session metadata.",
  ],
  [
    "MonitoringSessionModel",
    "observes",
    "MonitoringStateModel",
    "Monitoring Session observes Monitoring State metadata.",
  ],
  [
    "MonitoringStateModel",
    "tracks",
    "ProgressTrackingModel",
    "Monitoring State tracks Progress Tracking metadata.",
  ],
  [
    "ProgressTrackingModel",
    "records",
    "KPIObservationModel",
    "Progress Tracking records KPI Observation metadata.",
  ],
  [
    "KPIObservationModel",
    "informs",
    "GoalObservationModel",
    "KPI Observation informs Goal Observation metadata.",
  ],
  [
    "GoalObservationModel",
    "surfaces",
    "RiskObservationModel",
    "Goal Observation surfaces Risk Observation metadata.",
  ],
  [
    "RiskObservationModel",
    "raises",
    "AlertModel",
    "Risk Observation raises Alert metadata.",
  ],
  [
    "AlertModel",
    "triggers",
    "ControlDecisionModel",
    "Alert triggers Control Decision metadata.",
  ],
  [
    "ControlDecisionModel",
    "produces",
    "FeedbackModel",
    "Control Decision produces Feedback metadata.",
  ],
  [
    "MonitoringSessionModel",
    "uses",
    "MonitoringContextModel",
    "Monitoring Session uses Monitoring Context metadata.",
  ],
  [
    "MonitoringSessionModel",
    "governedBy",
    "MonitoringPolicyModel",
    "Monitoring Session is governed by Monitoring Policy metadata.",
  ],
  [
    "MonitoringStateModel",
    "records",
    "ExceptionModel",
    "Monitoring State records Exception metadata.",
  ],
  [
    "ProgressTrackingModel",
    "mayRaise",
    "AlertModel",
    "Progress Tracking may raise Alert metadata.",
  ],
  [
    "KPIObservationModel",
    "correlatesWith",
    "RiskObservationModel",
    "KPI Observation correlates with Risk Observation metadata.",
  ],
  [
    "AlertModel",
    "associatesWith",
    "ExceptionModel",
    "Alert associates with Exception metadata.",
  ],
  [
    "ControlDecisionModel",
    "references",
    "MonitoringPolicyModel",
    "Control Decision references Monitoring Policy metadata.",
  ],
  [
    "FeedbackModel",
    "contextualizes",
    "MonitoringContextModel",
    "Feedback contextualizes Monitoring Context metadata.",
  ],
  [
    "MonitoringCapabilityModel",
    "enables",
    "ExecutiveActionMonitoringModel",
    "Monitoring Capability enables Executive Action Monitoring metadata.",
  ],
  [
    "MonitoringPolicyModel",
    "constrains",
    "MonitoringCapabilityModel",
    "Monitoring Policy constrains Monitoring Capability metadata.",
  ],
  [
    "ExceptionModel",
    "informs",
    "ControlDecisionModel",
    "Exception informs Control Decision metadata.",
  ],
] as const);

export const AssistantActionMonitoringControlRelationships:
readonly AssistantActionMonitoringControlRelationshipMetadata[] =
  Object.freeze(
    declarations.map(
      ([source, relationshipType, target, description], index) =>
        Object.freeze({
          id: `ASSISTANT-9:3/Relationship/${
            String(index + 1).padStart(2, "0")
          }`,
          source,
          relationshipType,
          target,
          description,
          registryReference: registryId,
          order: index + 1,
          executable: false,
          metadataOnly: true,
          immutable: true,
        }),
    ),
  );
