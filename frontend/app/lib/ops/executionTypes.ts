export type ExecutionPlatformId = "OPS-1:1";

export type ExecutionPlatformVersion = "1.0.0";

export type ExecutionPlatformStatus =
  | "Draft"
  | "Foundation"
  | "Released"
  | "MetadataOnly";

export type ExecutionCategory =
  | "Task"
  | "Workflow"
  | "Project"
  | "Resource"
  | "Schedule"
  | "Monitoring"
  | "Automation";

export type ExecutionBoundary =
  | "MetadataOnly"
  | "NoRuntime"
  | "NoPersistence"
  | "NoNetworking"
  | "NoUi"
  | "NoAi"
  | "FrameworkIndependent"
  | "SideEffectFree";

export type ExecutionConsumer =
  | "BUS"
  | "OPS"
  | "APP"
  | "LAY"
  | "CORE"
  | "ExecutiveOperationsPlatform";

export interface ExecutionDependency {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly kind: "Platform" | "Architecture" | "Consumer";
  readonly optional: boolean;
  readonly metadata: ExecutionMetadata;
}

export interface ExecutionCapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutionCategory;
  readonly boundaries: readonly ExecutionBoundary[];
  readonly consumers: readonly ExecutionConsumer[];
  readonly dependencies: readonly ExecutionDependency[];
  readonly metadata: ExecutionMetadata;
}

export interface ExecutionPublicApi {
  readonly name: string;
  readonly exportPath: string;
  readonly kind: "Type" | "Constant" | "Object" | "Function";
  readonly stability: "Stable";
  readonly description: string;
}

export interface ExecutionMetadata {
  readonly owner: string;
  readonly namespace: string;
  readonly releaseStage: "Draft";
  readonly metadataStatus: "Immutable";
  readonly publicApiStatus: "Stable";
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly frameworkIndependent: true;
  readonly tags: readonly string[];
}
