import {
  ExecutiveOperationsPublicIndexId,
} from "./executiveOperationsPublicIndex.ts";
import {
  SchedulingIntelligenceArchitecturalLevel,
  SchedulingIntelligenceIdentity,
  SchedulingIntelligencePlatformId,
  SchedulingIntelligencePlatformVersion,
} from "./schedulingIntelligenceIndex.ts";

export interface SchedulingDomainDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface SchedulingPlatformMetadataDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly schedulingIntelligenceScope: string;
  readonly architecturalLevel: string;
  readonly supportedSchedulingDomains: readonly SchedulingDomainDescriptor[];
  readonly releaseStatus: string;
  readonly compatibilityVersion: string;
  readonly certificationState: string;
  readonly dependencySource: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const SchedulingSupportedDomains = Object.freeze([
  Object.freeze({
    id: "schedule-metadata",
    name: "Schedule Metadata",
    description: "Metadata domain for canonical schedule descriptors.",
  }),
  Object.freeze({
    id: "timeline-metadata",
    name: "Timeline Metadata",
    description: "Metadata domain for timeline sequencing descriptors.",
  }),
  Object.freeze({
    id: "calendar-metadata",
    name: "Calendar Metadata",
    description: "Metadata domain for calendar coordination descriptors.",
  }),
  Object.freeze({
    id: "execution-window-metadata",
    name: "Execution Window Metadata",
    description: "Metadata domain for execution window descriptors.",
  }),
  Object.freeze({
    id: "milestone-timing-metadata",
    name: "Milestone Timing Metadata",
    description: "Metadata domain for milestone timing descriptors.",
  }),
  Object.freeze({
    id: "dependency-timing-metadata",
    name: "Dependency Timing Metadata",
    description: "Metadata domain for temporal dependency descriptors.",
  }),
  Object.freeze({
    id: "sequencing-metadata",
    name: "Sequencing Metadata",
    description: "Metadata domain for sequencing and ordering descriptors.",
  }),
  Object.freeze({
    id: "constraint-metadata",
    name: "Constraint Metadata",
    description: "Metadata domain for schedule constraint descriptors.",
  }),
  Object.freeze({
    id: "future-scheduling-extensions",
    name: "Future Scheduling Extensions",
    description: "Metadata domain for future scheduling intelligence extensions.",
  }),
] as const);

export const SchedulingPlatformMetadata = Object.freeze({
  platformId: SchedulingIntelligencePlatformId,
  platformName: SchedulingIntelligenceIdentity.platformName,
  platformNamespace: SchedulingIntelligenceIdentity.platformNamespace,
  platformVersion: SchedulingIntelligencePlatformVersion,
  schedulingIntelligenceScope: "Executive scheduling intelligence architecture",
  architecturalLevel: SchedulingIntelligenceArchitecturalLevel,
  supportedSchedulingDomains: SchedulingSupportedDomains,
  releaseStatus: "Draft",
  compatibilityVersion: "1.0.0",
  certificationState: "Pending",
  dependencySource: ExecutiveOperationsPublicIndexId,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies SchedulingPlatformMetadataDescriptor);
