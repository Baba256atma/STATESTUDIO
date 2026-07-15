export type ExecutivePlanningModelId = string;
export type ExecutivePlanningModelOwner = "ENG-5";
export type ExecutivePlanningModelVersion = "1.0.0";
export type ExecutivePlanningModelPhase = "ENG-5:3";
export type ExecutivePlanningModelNamespace = "nexora.engine.executive.planning.model";

export type ExecutivePlanningModelCategory =
  | "Plan"
  | "Step"
  | "Graph"
  | "Dependency"
  | "Outcome";

export type ExecutivePlanningModelStatus = "Defined" | "Active" | "Frozen";

export type ExecutivePlanningModelLifecycleStage =
  | "Created"
  | "Validated"
  | "Prepared"
  | "Frozen"
  | "Released";

export type ExecutivePlanningModelVisibility = true;

export interface ExecutivePlanningModelBase {
  readonly id: ExecutivePlanningModelId;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutivePlanningModelCategory;
  readonly owner: ExecutivePlanningModelOwner;
  readonly version: ExecutivePlanningModelVersion;
  readonly status: ExecutivePlanningModelStatus;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly public: true;
}

export interface ExecutivePlanningModelPlatformMetadata {
  readonly platformId: "ENG-5:3";
  readonly name: "Executive Planning Model Platform";
  readonly version: ExecutivePlanningModelVersion;
  readonly namespace: ExecutivePlanningModelNamespace;
  readonly description: string;
  readonly status: Readonly<{
    model: "Model";
    metadataOnly: "MetadataOnly";
    runtimeFree: "RuntimeFree";
    immutable: "Immutable";
    deterministic: "Deterministic";
  }>;
  readonly dependencyOnFoundation: "executivePlanningIndex.ts";
  readonly dependencyOnRegistry: "executivePlanningRegistryIndex.ts";
  readonly ownership: "ENG-5";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly readinessForValidation: "ReadyForValidation";
  readonly nextPhase: "ENG-5:4";
  readonly planModelCount: 8;
  readonly stepModelCount: 10;
  readonly graphModelCount: 6;
  readonly dependencyModelCount: 6;
  readonly outcomeModelCount: 8;
  readonly totalModelCount: 38;
}

export interface ExecutivePlanModelDescriptor extends ExecutivePlanningModelBase {
  readonly category: "Plan";
  readonly purpose: string;
  readonly compatibleRegistries: readonly string[];
  readonly supportedLifecycleStages: readonly ExecutivePlanningModelLifecycleStage[];
}

export interface ExecutivePlanningStepModelDescriptor extends ExecutivePlanningModelBase {
  readonly category: "Step";
  readonly planningRole: string;
  readonly metadataInputs: readonly string[];
  readonly metadataOutputs: readonly string[];
  readonly dependencyCompatibility: readonly string[];
  readonly parallelCompatibility: string;
  readonly retryCompatibility: string;
  readonly compatibleStepRegistryId: string;
  readonly supportedLifecycleStages: readonly ExecutivePlanningModelLifecycleStage[];
}

export interface ExecutivePlanningGraphModelDescriptor extends ExecutivePlanningModelBase {
  readonly category: "Graph";
  readonly compatibleNodeRegistry: "ExecutivePlanningGraphNodeRegistry";
  readonly compatibleEdgeRegistry: "ExecutivePlanningGraphEdgeRegistry";
  readonly supportedLifecycleStages: readonly ExecutivePlanningModelLifecycleStage[];
}

export interface ExecutivePlanningDependencyModelDescriptor extends ExecutivePlanningModelBase {
  readonly category: "Dependency";
  readonly compatibleDependencyRegistry: "ExecutivePlanningDependencyRegistry";
  readonly supportedLifecycleStages: readonly ExecutivePlanningModelLifecycleStage[];
}

export interface ExecutivePlanningOutcomeModelDescriptor extends ExecutivePlanningModelBase {
  readonly category: "Outcome";
  readonly outcomeRole: string;
  readonly supportedLifecycleStages: readonly ExecutivePlanningModelLifecycleStage[];
}

export type ExecutivePlanningModelDescriptor =
  | ExecutivePlanModelDescriptor
  | ExecutivePlanningStepModelDescriptor
  | ExecutivePlanningGraphModelDescriptor
  | ExecutivePlanningDependencyModelDescriptor
  | ExecutivePlanningOutcomeModelDescriptor;
