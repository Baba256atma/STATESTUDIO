import {
  DependencyCriticalities,
  DependencyDirections,
  DependencyPriorities,
  DependencyStatuses,
  DependencyStrengths,
  DependencyTypes,
} from "./dependencyIntelligenceTypes.ts";

export const SupportedDependencyCategories = Object.freeze([
  "ExecutiveEntity",
  "Task",
  "Workflow",
  "Project",
  "Resource",
  "Scheduling",
  "Governance",
  "ExternalPlatform",
] as const);

export const DependencyCompatibilityVersion = "1.0.0" as const;

export const DependencyReleaseMetadata = Object.freeze({
  releaseStage: "Draft",
  releaseStatus: "Defined",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const DependencyIntelligenceMetadata = Object.freeze({
  supportedDependencyCategories: SupportedDependencyCategories,
  supportedRelationshipDirections: DependencyDirections,
  supportedRelationshipStrengths: DependencyStrengths,
  supportedPriorityLevels: DependencyPriorities,
  supportedCriticalityLevels: DependencyCriticalities,
  supportedLifecycleStatuses: DependencyStatuses,
  supportedDependencyTypes: DependencyTypes,
  compatibilityVersion: DependencyCompatibilityVersion,
  releaseMetadata: DependencyReleaseMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
