import type {
  TaskCapability,
  TaskMetadata,
  TaskPublicApi,
} from "./taskIntelligenceTypes.ts";
import { TaskIntelligenceIdentity } from "./taskIntelligenceIdentity.ts";

const taskMetadata = Object.freeze({
  platformId: TaskIntelligenceIdentity.platformId,
  platformVersion: TaskIntelligenceIdentity.platformVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  sourceDependency: "OPS-1:9",
  tags: Object.freeze(["ops", "task-intelligence", "metadata-only"]),
} as const satisfies TaskMetadata);

export const ExecutiveTaskContract = Object.freeze({
  id: "task-executive",
  name: "Executive Task",
  description: "Canonical metadata contract for executive-level task definitions.",
  category: "Executive",
  status: "Defined",
  metadata: taskMetadata,
} as const satisfies TaskCapability);

export const OperationalTaskContract = Object.freeze({
  id: "task-operational",
  name: "Operational Task",
  description: "Canonical metadata contract for operational task definitions.",
  category: "Operational",
  status: "Defined",
  metadata: taskMetadata,
} as const satisfies TaskCapability);

export const StrategicTaskContract = Object.freeze({
  id: "task-strategic",
  name: "Strategic Task",
  description: "Canonical metadata contract for strategic task definitions.",
  category: "Strategic",
  status: "Defined",
  metadata: taskMetadata,
} as const satisfies TaskCapability);

export const ApprovalTaskContract = Object.freeze({
  id: "task-approval",
  name: "Approval Task",
  description: "Canonical metadata contract for approval-oriented task definitions.",
  category: "Approval",
  status: "Defined",
  metadata: taskMetadata,
} as const satisfies TaskCapability);

export const ReviewTaskContract = Object.freeze({
  id: "task-review",
  name: "Review Task",
  description: "Canonical metadata contract for review-oriented task definitions.",
  category: "Review",
  status: "Defined",
  metadata: taskMetadata,
} as const satisfies TaskCapability);

export const AutomatedTaskContract = Object.freeze({
  id: "task-automated",
  name: "Automated Task",
  description: "Canonical metadata contract for automated task definitions.",
  category: "Automated",
  status: "Defined",
  metadata: taskMetadata,
} as const satisfies TaskCapability);

export const ManualTaskContract = Object.freeze({
  id: "task-manual",
  name: "Manual Task",
  description: "Canonical metadata contract for manual task definitions.",
  category: "Manual",
  status: "Defined",
  metadata: taskMetadata,
} as const satisfies TaskCapability);

export const TaskIntelligenceContracts = Object.freeze({
  executive: ExecutiveTaskContract,
  operational: OperationalTaskContract,
  strategic: StrategicTaskContract,
  approval: ApprovalTaskContract,
  review: ReviewTaskContract,
  automated: AutomatedTaskContract,
  manual: ManualTaskContract,
  all: Object.freeze([
    ExecutiveTaskContract,
    OperationalTaskContract,
    StrategicTaskContract,
    ApprovalTaskContract,
    ReviewTaskContract,
    AutomatedTaskContract,
    ManualTaskContract,
  ]),
} as const);

export const TaskIntelligencePublicApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveTaskIntelligenceFoundation",
    exportPath: "./taskIntelligenceIndex.ts",
    kind: "Object",
    stability: "Stable",
    description: "Immutable namespace for task intelligence foundation.",
  } as const satisfies TaskPublicApi),
  Object.freeze({
    name: "buildTaskIntelligenceManifest",
    exportPath: "./taskIntelligenceIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Deterministic manifest builder for task intelligence metadata.",
  } as const satisfies TaskPublicApi),
  Object.freeze({
    name: "validateTaskIntelligenceFoundation",
    exportPath: "./taskIntelligenceIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Architectural integrity validator for task intelligence metadata.",
  } as const satisfies TaskPublicApi),
] as const);
