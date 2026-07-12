import type {
  ScheduleCapability,
  ScheduleMetadata,
  SchedulePublicApi,
} from "./schedulingIntelligenceTypes.ts";
import { SchedulingIntelligenceIdentity } from "./schedulingIntelligenceIdentity.ts";

const scheduleMetadata = Object.freeze({
  platformId: SchedulingIntelligenceIdentity.platformId,
  platformVersion: SchedulingIntelligenceIdentity.platformVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  sourceDependencies: Object.freeze([
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:9",
    "OPS-5:9",
  ]),
  tags: Object.freeze(["ops", "scheduling-intelligence", "metadata-only"]),
} as const satisfies ScheduleMetadata);

export const ExecutiveScheduleContract = Object.freeze({
  id: "schedule-executive",
  name: "Executive Schedule",
  description: "Canonical metadata contract for executive-level scheduling descriptors.",
  category: "ExecutiveSchedule",
  status: "Defined",
  metadata: scheduleMetadata,
} as const satisfies ScheduleCapability);

export const ProjectScheduleContract = Object.freeze({
  id: "schedule-project",
  name: "Project Schedule",
  description: "Canonical metadata contract for project schedule descriptors.",
  category: "ProjectSchedule",
  status: "Defined",
  metadata: scheduleMetadata,
} as const satisfies ScheduleCapability);

export const WorkflowScheduleContract = Object.freeze({
  id: "schedule-workflow",
  name: "Workflow Schedule",
  description: "Canonical metadata contract for workflow schedule descriptors.",
  category: "WorkflowSchedule",
  status: "Defined",
  metadata: scheduleMetadata,
} as const satisfies ScheduleCapability);

export const TaskScheduleContract = Object.freeze({
  id: "schedule-task",
  name: "Task Schedule",
  description: "Canonical metadata contract for task schedule descriptors.",
  category: "TaskSchedule",
  status: "Defined",
  metadata: scheduleMetadata,
} as const satisfies ScheduleCapability);

export const ResourceScheduleContract = Object.freeze({
  id: "schedule-resource",
  name: "Resource Schedule",
  description: "Canonical metadata contract for resource-aware scheduling descriptors.",
  category: "ResourceSchedule",
  status: "Defined",
  metadata: scheduleMetadata,
} as const satisfies ScheduleCapability);

export const MilestoneScheduleContract = Object.freeze({
  id: "schedule-milestone",
  name: "Milestone Schedule",
  description: "Canonical metadata contract for milestone timing descriptors.",
  category: "MilestoneSchedule",
  status: "Cataloged",
  metadata: scheduleMetadata,
} as const satisfies ScheduleCapability);

export const CalendarScheduleContract = Object.freeze({
  id: "schedule-calendar",
  name: "Calendar Schedule",
  description: "Canonical metadata contract for calendar coordination descriptors.",
  category: "CalendarSchedule",
  status: "Cataloged",
  metadata: scheduleMetadata,
} as const satisfies ScheduleCapability);

export const DependencyScheduleContract = Object.freeze({
  id: "schedule-dependency",
  name: "Dependency Schedule",
  description: "Canonical metadata contract for temporal dependency and sequencing descriptors.",
  category: "DependencySchedule",
  status: "Cataloged",
  metadata: scheduleMetadata,
} as const satisfies ScheduleCapability);

export const SchedulingIntelligenceContracts = Object.freeze({
  executive: ExecutiveScheduleContract,
  project: ProjectScheduleContract,
  workflow: WorkflowScheduleContract,
  task: TaskScheduleContract,
  resource: ResourceScheduleContract,
  milestone: MilestoneScheduleContract,
  calendar: CalendarScheduleContract,
  dependency: DependencyScheduleContract,
  all: Object.freeze([
    ExecutiveScheduleContract,
    ProjectScheduleContract,
    WorkflowScheduleContract,
    TaskScheduleContract,
    ResourceScheduleContract,
    MilestoneScheduleContract,
    CalendarScheduleContract,
    DependencyScheduleContract,
  ]),
} as const);

export const SchedulingIntelligencePublicApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveSchedulingIntelligenceFoundation",
    exportPath: "./schedulingIntelligenceIndex.ts",
    kind: "Object",
    stability: "Stable",
    description: "Immutable namespace for scheduling intelligence foundation.",
  } as const satisfies SchedulePublicApi),
  Object.freeze({
    name: "buildSchedulingIntelligenceManifest",
    exportPath: "./schedulingIntelligenceIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Deterministic manifest builder for scheduling intelligence metadata.",
  } as const satisfies SchedulePublicApi),
  Object.freeze({
    name: "validateSchedulingIntelligenceFoundation",
    exportPath: "./schedulingIntelligenceIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Architectural integrity validator for scheduling intelligence metadata.",
  } as const satisfies SchedulePublicApi),
] as const);
