import type {
  DependencyDirection,
  DependencyMetadata,
} from "./dependencyIntelligenceIndex.ts";

export type DependencyEntityType =
  | "Task"
  | "Workflow"
  | "Project"
  | "Resource"
  | "Schedule";

export type DependencyEntityCategory =
  | "Execution"
  | "Coordination"
  | "Planning"
  | "Support";

export interface DependencyEntityDescriptor {
  readonly id: string;
  readonly name: DependencyEntityType;
  readonly category: DependencyEntityCategory;
  readonly description: string;
  readonly metadata: DependencyMetadata;
}

export type DependencyRelationshipType =
  | "blocks"
  | "requires"
  | "enables"
  | "dependsOn"
  | "precedes"
  | "follows"
  | "consumes"
  | "produces"
  | "references";

export type DependencyRelationshipCategory =
  | "Execution"
  | "Temporal"
  | "Resource"
  | "Informational";

export interface DependencyRelationshipDescriptor {
  readonly id: string;
  readonly type: DependencyRelationshipType;
  readonly category: DependencyRelationshipCategory;
  readonly description: string;
  readonly direction: DependencyDirection;
  readonly metadata: DependencyMetadata;
}

export type DependencyLifecycleStage =
  | "proposed"
  | "active"
  | "deprecated"
  | "archived";

export interface DependencyLifecycleDescriptor {
  readonly id: DependencyLifecycleStage;
  readonly description: string;
  readonly metadata: DependencyMetadata;
}

export interface DependencyRegistryDescriptor {
  readonly platformId: string;
  readonly registryVersion: string;
  readonly supportedEntityCount: number;
  readonly supportedRelationshipCount: number;
  readonly supportedLifecycleCount: number;
  readonly compatibilityVersion: string;
  readonly deterministicStatus: "Deterministic";
  readonly readonlyStatus: "Readonly";
  readonly metadataOnlyStatus: "MetadataOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyRegistrySummary {
  readonly entityCount: number;
  readonly relationshipCount: number;
  readonly lifecycleCount: number;
  readonly status: "PASS";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const DependencyEntityTypes = Object.freeze([
  "Task",
  "Workflow",
  "Project",
  "Resource",
  "Schedule",
] as const satisfies readonly DependencyEntityType[]);

export const DependencyEntityCategories = Object.freeze([
  "Execution",
  "Coordination",
  "Planning",
  "Support",
] as const satisfies readonly DependencyEntityCategory[]);

export const DependencyRelationshipTypes = Object.freeze([
  "blocks",
  "requires",
  "enables",
  "dependsOn",
  "precedes",
  "follows",
  "consumes",
  "produces",
  "references",
] as const satisfies readonly DependencyRelationshipType[]);

export const DependencyRelationshipCategories = Object.freeze([
  "Execution",
  "Temporal",
  "Resource",
  "Informational",
] as const satisfies readonly DependencyRelationshipCategory[]);

export const DependencyLifecycleStages = Object.freeze([
  "proposed",
  "active",
  "deprecated",
  "archived",
] as const satisfies readonly DependencyLifecycleStage[]);
