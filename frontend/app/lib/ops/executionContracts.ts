import type { ExecutionCapability, ExecutionDependency } from "./executionTypes.ts";
import { ExecutionIdentityMetadata } from "./executionIdentity.ts";

const sharedDependencies = Object.freeze([
  Object.freeze({
    id: "dep-bus-architecture",
    name: "Executive Business Intelligence",
    version: "public-api",
    kind: "Architecture",
    optional: false,
    metadata: ExecutionIdentityMetadata,
  } as const satisfies ExecutionDependency),
]) as readonly ExecutionDependency[];

const sharedBoundaries = Object.freeze([
  "MetadataOnly",
  "NoRuntime",
  "NoPersistence",
  "NoNetworking",
  "NoUi",
  "NoAi",
  "FrameworkIndependent",
  "SideEffectFree",
] as const);

const sharedConsumers = Object.freeze([
  "BUS",
  "OPS",
  "APP",
  "LAY",
  "CORE",
  "ExecutiveOperationsPlatform",
] as const);

export const TaskExecutionContract = Object.freeze({
  id: "execution-task",
  name: "Task",
  description: "Metadata contract for executive task execution architecture.",
  category: "Task",
  boundaries: sharedBoundaries,
  consumers: sharedConsumers,
  dependencies: sharedDependencies,
  metadata: ExecutionIdentityMetadata,
} as const satisfies ExecutionCapability);

export const WorkflowExecutionContract = Object.freeze({
  id: "execution-workflow",
  name: "Workflow",
  description: "Metadata contract for executive workflow execution architecture.",
  category: "Workflow",
  boundaries: sharedBoundaries,
  consumers: sharedConsumers,
  dependencies: sharedDependencies,
  metadata: ExecutionIdentityMetadata,
} as const satisfies ExecutionCapability);

export const ProjectExecutionContract = Object.freeze({
  id: "execution-project",
  name: "Project",
  description: "Metadata contract for executive project execution architecture.",
  category: "Project",
  boundaries: sharedBoundaries,
  consumers: sharedConsumers,
  dependencies: sharedDependencies,
  metadata: ExecutionIdentityMetadata,
} as const satisfies ExecutionCapability);

export const ResourceExecutionContract = Object.freeze({
  id: "execution-resource",
  name: "Resource",
  description: "Metadata contract for executive resource execution architecture.",
  category: "Resource",
  boundaries: sharedBoundaries,
  consumers: sharedConsumers,
  dependencies: sharedDependencies,
  metadata: ExecutionIdentityMetadata,
} as const satisfies ExecutionCapability);

export const ScheduleExecutionContract = Object.freeze({
  id: "execution-schedule",
  name: "Schedule",
  description: "Metadata contract for executive scheduling architecture.",
  category: "Schedule",
  boundaries: sharedBoundaries,
  consumers: sharedConsumers,
  dependencies: sharedDependencies,
  metadata: ExecutionIdentityMetadata,
} as const satisfies ExecutionCapability);

export const MonitoringExecutionContract = Object.freeze({
  id: "execution-monitoring",
  name: "Monitoring",
  description: "Metadata contract for executive monitoring architecture.",
  category: "Monitoring",
  boundaries: sharedBoundaries,
  consumers: sharedConsumers,
  dependencies: sharedDependencies,
  metadata: ExecutionIdentityMetadata,
} as const satisfies ExecutionCapability);

export const AutomationExecutionContract = Object.freeze({
  id: "execution-automation",
  name: "Automation",
  description: "Metadata contract for executive automation architecture.",
  category: "Automation",
  boundaries: sharedBoundaries,
  consumers: sharedConsumers,
  dependencies: sharedDependencies,
  metadata: ExecutionIdentityMetadata,
} as const satisfies ExecutionCapability);

export const ExecutionContracts = Object.freeze({
  task: TaskExecutionContract,
  workflow: WorkflowExecutionContract,
  project: ProjectExecutionContract,
  resource: ResourceExecutionContract,
  schedule: ScheduleExecutionContract,
  monitoring: MonitoringExecutionContract,
  automation: AutomationExecutionContract,
  all: Object.freeze([
    TaskExecutionContract,
    WorkflowExecutionContract,
    ProjectExecutionContract,
    ResourceExecutionContract,
    ScheduleExecutionContract,
    MonitoringExecutionContract,
    AutomationExecutionContract,
  ]),
} as const);
