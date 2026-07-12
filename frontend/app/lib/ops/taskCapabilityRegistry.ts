import { TaskPlatformMetadata } from "./taskMetadata.ts";

export interface TaskCapabilityRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly domainId: string;
  readonly phaseId: string;
  readonly releaseState: "Draft";
  readonly runtimeBehavior: false;
  readonly metadataOnly: true;
}

export const TaskCapabilityRegistry = Object.freeze([
  Object.freeze({
    id: "cap-executive-tasks",
    name: "Executive Tasks",
    description: "Descriptive registry entry for executive task intelligence.",
    domainId: "executive-tasks",
    phaseId: "OPS-2:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-operational-tasks",
    name: "Operational Tasks",
    description: "Descriptive registry entry for operational task intelligence.",
    domainId: "operational-tasks",
    phaseId: "OPS-2:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-strategic-tasks",
    name: "Strategic Tasks",
    description: "Descriptive registry entry for strategic task intelligence.",
    domainId: "strategic-tasks",
    phaseId: "OPS-2:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-approval-tasks",
    name: "Approval Tasks",
    description: "Descriptive registry entry for approval task intelligence.",
    domainId: "approval-tasks",
    phaseId: "OPS-2:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-review-tasks",
    name: "Review Tasks",
    description: "Descriptive registry entry for review task intelligence.",
    domainId: "review-tasks",
    phaseId: "OPS-2:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-manual-tasks",
    name: "Manual Tasks",
    description: "Descriptive registry entry for manual task intelligence.",
    domainId: "manual-tasks",
    phaseId: "OPS-2:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-automated-tasks",
    name: "Automated Tasks",
    description: "Descriptive registry entry for automated task intelligence.",
    domainId: "automated-tasks",
    phaseId: "OPS-2:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-future-task-extensions",
    name: "Future Task Extensions",
    description: "Descriptive registry entry for future task intelligence extensions.",
    domainId: "future-task-extensions",
    phaseId: "OPS-2:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
] as const satisfies readonly TaskCapabilityRegistryEntry[]);

export const TaskCapabilityRegistryMetadata = Object.freeze({
  registryId: "ops.task-intelligence.capability-registry",
  registryVersion: TaskPlatformMetadata.compatibilityVersion,
  platformId: TaskPlatformMetadata.platformId,
  capabilityCount: TaskCapabilityRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
