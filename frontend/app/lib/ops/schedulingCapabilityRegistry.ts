import { SchedulingPlatformMetadata } from "./schedulingMetadata.ts";

export interface SchedulingCapabilityRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly domainId: string;
  readonly phaseId: string;
  readonly releaseState: "Draft";
  readonly runtimeBehavior: false;
  readonly metadataOnly: true;
}

export const SchedulingCapabilityRegistry = Object.freeze([
  Object.freeze({
    id: "cap-schedule-metadata",
    name: "Schedule Metadata",
    description: "Descriptive registry entry for schedule metadata intelligence.",
    domainId: "schedule-metadata",
    phaseId: "OPS-6:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-timeline-metadata",
    name: "Timeline Metadata",
    description: "Descriptive registry entry for timeline metadata intelligence.",
    domainId: "timeline-metadata",
    phaseId: "OPS-6:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-calendar-metadata",
    name: "Calendar Metadata",
    description: "Descriptive registry entry for calendar metadata intelligence.",
    domainId: "calendar-metadata",
    phaseId: "OPS-6:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-execution-window-metadata",
    name: "Execution Window Metadata",
    description: "Descriptive registry entry for execution window metadata intelligence.",
    domainId: "execution-window-metadata",
    phaseId: "OPS-6:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-milestone-timing-metadata",
    name: "Milestone Timing Metadata",
    description: "Descriptive registry entry for milestone timing metadata intelligence.",
    domainId: "milestone-timing-metadata",
    phaseId: "OPS-6:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-dependency-timing-metadata",
    name: "Dependency Timing Metadata",
    description: "Descriptive registry entry for dependency timing metadata intelligence.",
    domainId: "dependency-timing-metadata",
    phaseId: "OPS-6:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-sequencing-metadata",
    name: "Sequencing Metadata",
    description: "Descriptive registry entry for sequencing metadata intelligence.",
    domainId: "sequencing-metadata",
    phaseId: "OPS-6:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-constraint-metadata",
    name: "Constraint Metadata",
    description: "Descriptive registry entry for constraint metadata intelligence.",
    domainId: "constraint-metadata",
    phaseId: "OPS-6:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-future-scheduling-extensions",
    name: "Future Scheduling Extensions",
    description: "Descriptive registry entry for future scheduling intelligence extensions.",
    domainId: "future-scheduling-extensions",
    phaseId: "OPS-6:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
] as const satisfies readonly SchedulingCapabilityRegistryEntry[]);

export const SchedulingCapabilityRegistryMetadata = Object.freeze({
  registryId: "ops.scheduling-intelligence.capability-registry",
  registryVersion: SchedulingPlatformMetadata.compatibilityVersion,
  platformId: SchedulingPlatformMetadata.platformId,
  capabilityCount: SchedulingCapabilityRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
