export type DependencyId = string;
export type DependencyNodeId = string;
export type DependencyEdgeId = string;

export type DependencyType =
  | "Predecessor"
  | "Successor"
  | "Blocking"
  | "Supporting"
  | "CrossPlatform"
  | "Governance"
  | "Escalation"
  | "Informational";

export type DependencyDirection = "Inbound" | "Outbound" | "Bidirectional";

export type DependencyStrength = "Weak" | "Moderate" | "Strong" | "Critical";

export type DependencyPriority = "Low" | "Normal" | "High" | "Critical";

export type DependencyCriticality =
  | "Advisory"
  | "Important"
  | "Essential"
  | "MissionCritical";

export type DependencyStatus =
  | "Defined"
  | "Cataloged"
  | "Approved"
  | "Active"
  | "Paused"
  | "Archived";

export interface DependencyMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly tags: readonly string[];
}

export interface DependencyNode {
  readonly id: DependencyNodeId;
  readonly category: string;
  readonly label: string;
  readonly description: string;
  readonly metadata: DependencyMetadata;
}

export interface DependencyEdge {
  readonly id: DependencyEdgeId;
  readonly source: DependencyNodeId;
  readonly target: DependencyNodeId;
  readonly direction: DependencyDirection;
  readonly type: DependencyType;
  readonly strength: DependencyStrength;
  readonly priority: DependencyPriority;
  readonly criticality: DependencyCriticality;
  readonly status: DependencyStatus;
  readonly metadata: DependencyMetadata;
}

export interface DependencyGraph {
  readonly nodes: readonly DependencyNode[];
  readonly edges: readonly DependencyEdge[];
  readonly graphMetadata: DependencyMetadata;
  readonly platformMetadata: DependencyPlatformDescriptor;
}

export interface DependencySummary {
  readonly totalNodes: number;
  readonly totalEdges: number;
  readonly supportedTypes: readonly DependencyType[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyStatistics {
  readonly typeCount: number;
  readonly directionCount: number;
  readonly strengthCount: number;
  readonly statusCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyPlatformDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly platformDescription: string;
  readonly platformStatus: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyFoundationDescriptor {
  readonly namespace: string;
  readonly contractCount: number;
  readonly metadataCatalogCount: number;
  readonly registryStatus: "Complete";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const DependencyTypes = Object.freeze([
  "Predecessor",
  "Successor",
  "Blocking",
  "Supporting",
  "CrossPlatform",
  "Governance",
  "Escalation",
  "Informational",
] as const satisfies readonly DependencyType[]);

export const DependencyDirections = Object.freeze([
  "Inbound",
  "Outbound",
  "Bidirectional",
] as const satisfies readonly DependencyDirection[]);

export const DependencyStrengths = Object.freeze([
  "Weak",
  "Moderate",
  "Strong",
  "Critical",
] as const satisfies readonly DependencyStrength[]);

export const DependencyPriorities = Object.freeze([
  "Low",
  "Normal",
  "High",
  "Critical",
] as const satisfies readonly DependencyPriority[]);

export const DependencyCriticalities = Object.freeze([
  "Advisory",
  "Important",
  "Essential",
  "MissionCritical",
] as const satisfies readonly DependencyCriticality[]);

export const DependencyStatuses = Object.freeze([
  "Defined",
  "Cataloged",
  "Approved",
  "Active",
  "Paused",
  "Archived",
] as const satisfies readonly DependencyStatus[]);

export const DependencyIntelligenceTypes = Object.freeze({
  dependencyTypes: DependencyTypes,
  dependencyDirections: DependencyDirections,
  dependencyStrengths: DependencyStrengths,
  dependencyPriorities: DependencyPriorities,
  dependencyCriticalities: DependencyCriticalities,
  dependencyStatuses: DependencyStatuses,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
