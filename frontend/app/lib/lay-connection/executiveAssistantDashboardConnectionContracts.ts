import type {
  ExecutiveAssistantDashboardCategory,
  ExecutiveAssistantDashboardConnectionApi as ExecutiveAssistantDashboardConnectionApiContract,
  ExecutiveAssistantDashboardMetadata,
  ExecutiveAssistantDashboardPolicy,
} from "./executiveAssistantDashboardConnectionTypes.ts";

export const EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_API_ID = "executive-assistant-dashboard-connection-api";
export const EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_VERSION = "LAY-CONN-9";

export const EXECUTIVE_ASSISTANT_DASHBOARD_CATEGORIES: readonly ExecutiveAssistantDashboardCategory[] = Object.freeze([
  "Executive Summary",
  "Operational Dashboard",
  "Risk Dashboard",
  "KPI Dashboard",
  "Timeline Dashboard",
  "Scenario Dashboard",
  "War Room",
  "Assistant Conversation",
  "Assistant Explanation",
  "Assistant Recommendation",
  "Shared Executive Context",
  "Executive Awareness",
] as const);

export const EXECUTIVE_ASSISTANT_DASHBOARD_API_TYPES: readonly string[] = Object.freeze([
  "executive-summary-api",
  "operational-dashboard-api",
  "risk-dashboard-api",
  "kpi-dashboard-api",
  "timeline-dashboard-api",
  "scenario-dashboard-api",
  "war-room-api",
  "assistant-conversation-api",
  "assistant-explanation-api",
  "assistant-recommendation-api",
  "shared-executive-context-api",
  "executive-awareness-api",
] as const);

export const EXECUTIVE_ASSISTANT_DASHBOARD_METADATA: ExecutiveAssistantDashboardMetadata = Object.freeze({
  apiId: EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_API_ID,
  phaseId: "LAY-CONN-9",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "assistant-dashboard", "metadata-api"] as const),
});

export const EXECUTIVE_ASSISTANT_DASHBOARD_POLICY: ExecutiveAssistantDashboardPolicy = Object.freeze({
  policyId: "assistant-dashboard-metadata-only-policy",
  assistantRuntimeAllowed: false,
  dashboardRuntimeAllowed: false,
  messageTransportAllowed: false,
  panelNavigationAllowed: false,
  coordinationAllowed: false,
  stateChangeAllowed: false,
  extensionMode: "additive-only",
});

const dashboardReference = Object.freeze({
  referenceId: "dashboard-response-reference",
  referenceType: "dashboard-response" as const,
  sourceId: "dashboard-response-metadata",
  metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
});

const assistantReference = Object.freeze({
  referenceId: "assistant-response-reference",
  referenceType: "assistant-response" as const,
  sourceId: "assistant-response-metadata",
  metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
});

const executiveContextReference = Object.freeze({
  referenceId: "shared-executive-context-reference",
  referenceType: "executive-object" as const,
  sourceId: "executive-context-metadata",
  metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
});

export const ExecutiveAssistantDashboardConnectionApi: ExecutiveAssistantDashboardConnectionApiContract = Object.freeze({
  apiId: EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_API_ID,
  name: "Executive Assistant Dashboard Connection API",
  identity: Object.freeze({
    connectionId: "assistant-dashboard-metadata-connection",
    name: "Assistant Dashboard Metadata Connection",
    category: "Shared Executive Context",
    apiType: "shared-executive-context-api",
  }),
  context: Object.freeze({
    contextId: "assistant-dashboard-context-contract",
    assistantContextId: "assistant-context-metadata",
    dashboardContextId: "dashboard-context-metadata",
    sharedExecutiveContextId: "shared-executive-context-metadata",
    metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
  }),
  requests: Object.freeze([
    Object.freeze({
      requestId: "dashboard-request-contract",
      requestType: "dashboard-request" as const,
      category: "Operational Dashboard",
      apiType: "operational-dashboard-api",
      references: Object.freeze([assistantReference, executiveContextReference] as const),
      metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
    }),
    Object.freeze({
      requestId: "assistant-request-contract",
      requestType: "assistant-request" as const,
      category: "Assistant Conversation",
      apiType: "assistant-conversation-api",
      references: Object.freeze([dashboardReference, executiveContextReference] as const),
      metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
    }),
  ] as const),
  responses: Object.freeze([
    Object.freeze({ responseId: "dashboard-response-contract", responseReferenceId: dashboardReference.referenceId, metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA }),
    Object.freeze({ responseId: "assistant-response-contract", responseReferenceId: assistantReference.referenceId, metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA }),
  ] as const),
  references: Object.freeze([
    dashboardReference,
    assistantReference,
    Object.freeze({ referenceId: "explanation-reference", referenceType: "explanation" as const, sourceId: "explanation-metadata", metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA }),
    Object.freeze({ referenceId: "recommendation-reference", referenceType: "recommendation" as const, sourceId: "recommendation-metadata", metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA }),
    Object.freeze({ referenceId: "awareness-reference", referenceType: "awareness" as const, sourceId: "awareness-metadata", metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA }),
    executiveContextReference,
    Object.freeze({ referenceId: "executive-kpi-reference", referenceType: "executive-kpi" as const, sourceId: "executive-kpi-metadata", metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA }),
    Object.freeze({ referenceId: "executive-risk-reference", referenceType: "executive-risk" as const, sourceId: "executive-risk-metadata", metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA }),
    Object.freeze({ referenceId: "executive-timeline-reference", referenceType: "executive-timeline" as const, sourceId: "executive-timeline-metadata", metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA }),
    Object.freeze({ referenceId: "executive-scenario-reference", referenceType: "executive-scenario" as const, sourceId: "executive-scenario-metadata", metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA }),
  ] as const),
  policy: EXECUTIVE_ASSISTANT_DASHBOARD_POLICY,
  metadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
});
