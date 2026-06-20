import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export type WorkspaceOwnedResourceKind =
  | "object"
  | "relationship"
  | "kpi"
  | "risk"
  | "scenario"
  | "data_source"
  | "dashboard_state"
  | "assistant_context"
  | "report"
  | "simulation";

export type WorkspaceOwnedResourceBase = Readonly<{
  workspaceId: WorkspaceId;
  resourceId: string;
  resourceKind: WorkspaceOwnedResourceKind;
  createdAt?: string;
  updatedAt?: string;
}>;

export type WorkspaceOwnedObject = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "object";
  objectId: string;
  objectName?: string | null;
}>;

export type WorkspaceOwnedRelationship = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "relationship";
  relationshipId: string;
  sourceObjectId?: string | null;
  targetObjectId?: string | null;
}>;

export type WorkspaceOwnedKpi = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "kpi";
  kpiId: string;
  label?: string | null;
}>;

export type WorkspaceOwnedRisk = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "risk";
  riskId: string;
  label?: string | null;
}>;

export type WorkspaceOwnedScenario = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "scenario";
  scenarioId: string;
  label?: string | null;
}>;

export type WorkspaceOwnedDataSource = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "data_source";
  dataSourceId: string;
  label?: string | null;
  sourceType?: string | null;
}>;

export type WorkspaceOwnedDashboardState = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "dashboard_state";
  dashboardStateId: string;
  dashboardMode?: string | null;
}>;

export type WorkspaceOwnedAssistantContext = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "assistant_context";
  assistantContextId: string;
  conversationId?: string | null;
}>;

export type WorkspaceOwnedFutureReport = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "report";
  reportId: string;
}>;

export type WorkspaceOwnedFutureSimulation = WorkspaceOwnedResourceBase & Readonly<{
  resourceKind: "simulation";
  simulationId: string;
}>;

export type WorkspaceOwnedResource =
  | WorkspaceOwnedObject
  | WorkspaceOwnedRelationship
  | WorkspaceOwnedKpi
  | WorkspaceOwnedRisk
  | WorkspaceOwnedScenario
  | WorkspaceOwnedDataSource
  | WorkspaceOwnedDashboardState
  | WorkspaceOwnedAssistantContext
  | WorkspaceOwnedFutureReport
  | WorkspaceOwnedFutureSimulation;

export type WorkspaceOwnershipCounts = Readonly<{
  objects: number;
  relationships: number;
  kpis: number;
  risks: number;
  scenarios: number;
  dataSources: number;
  dashboardStates: number;
  assistantContexts: number;
  reports: number;
  simulations: number;
}>;

export type WorkspaceScopedResourceCollections = Readonly<{
  workspaceId: WorkspaceId;
  objects: readonly WorkspaceOwnedObject[];
  relationships: readonly WorkspaceOwnedRelationship[];
  kpis: readonly WorkspaceOwnedKpi[];
  risks: readonly WorkspaceOwnedRisk[];
  scenarios: readonly WorkspaceOwnedScenario[];
  dataSources: readonly WorkspaceOwnedDataSource[];
  dashboardStates: readonly WorkspaceOwnedDashboardState[];
  assistantContexts: readonly WorkspaceOwnedAssistantContext[];
  reports: readonly WorkspaceOwnedFutureReport[];
  simulations: readonly WorkspaceOwnedFutureSimulation[];
  counts: WorkspaceOwnershipCounts;
}>;

export function hasWorkspaceOwnership(value: unknown): value is { workspaceId: WorkspaceId } {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as { workspaceId?: unknown }).workspaceId === "string" &&
    (value as { workspaceId: string }).workspaceId.trim().length > 0
  );
}

export function assertWorkspaceOwnership<T extends { workspaceId?: unknown }>(
  value: T,
  expectedWorkspaceId: WorkspaceId
): value is T & { workspaceId: WorkspaceId } {
  return typeof value.workspaceId === "string" && value.workspaceId === expectedWorkspaceId;
}
