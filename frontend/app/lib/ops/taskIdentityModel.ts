import {
  ExecutiveOperationsPublicIndexId,
} from "./executiveOperationsPublicIndex.ts";
import {
  TaskIntelligenceIdentity,
  TaskIntelligencePlatformVersion,
} from "./taskIntelligenceIndex.ts";
import { TaskPlatformMetadata } from "./taskMetadataIndex.ts";
import type {
  TaskExecutionReadinessDescriptor,
  TaskModelIdentity,
  TaskModelMetadata,
} from "./taskModelTypes.ts";

const taskModelMetadata = Object.freeze({
  platformId: TaskIntelligenceIdentity.platformId,
  platformVersion: TaskIntelligencePlatformVersion,
  compatibilityVersion: TaskPlatformMetadata.compatibilityVersion,
  sourceDependency: ExecutiveOperationsPublicIndexId,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies TaskModelMetadata);

export const TaskExecutionReadinessModel = Object.freeze([
  Object.freeze({
    readinessState: "Ready",
    gatingSignals: Object.freeze([
      "IdentityDefined",
      "OwnershipDefined",
      "DependenciesReviewed",
    ]),
    missingInputs: Object.freeze([]),
    dependencyHealth: "Healthy",
    metadata: taskModelMetadata,
  } as const satisfies TaskExecutionReadinessDescriptor),
  Object.freeze({
    readinessState: "Blocked",
    gatingSignals: Object.freeze([
      "DependencyMissing",
      "OwnershipMissing",
    ]),
    missingInputs: Object.freeze([
      "RequiredDependencyReference",
      "RequiredOwnerReference",
    ]),
    dependencyHealth: "Constrained",
    metadata: taskModelMetadata,
  } as const satisfies TaskExecutionReadinessDescriptor),
] as const);

export const TaskIdentityModel = Object.freeze({
  taskIdPattern: "task-{category}-{sequence}",
  displayName: "Task Identity Model",
  description: "Canonical metadata model for task identity and classification.",
  category: "TaskIdentity",
  sourcePlatform: TaskIntelligenceIdentity.platformName,
  decisionReferenceMetadata: Object.freeze([
    "BusDecisionReference",
    "DecisionOriginMetadata",
  ]),
  taskClassification: Object.freeze([
    "Executive",
    "Operational",
    "Strategic",
    "Approval",
    "Review",
    "Automated",
    "Manual",
  ]),
  executionReadinessMetadata: TaskExecutionReadinessModel,
  metadata: taskModelMetadata,
} as const satisfies TaskModelIdentity);
