export type ScheduleIdentity = string;

export type ScheduleCategory =
  | "ExecutiveSchedule"
  | "ProjectSchedule"
  | "WorkflowSchedule"
  | "TaskSchedule"
  | "ResourceSchedule"
  | "MilestoneSchedule"
  | "CalendarSchedule"
  | "DependencySchedule";

export interface ScheduleWindow {
  readonly windowType: string;
  readonly boundaryMetadata: readonly string[];
  readonly timingMetadata: readonly string[];
}

export interface ScheduleTimeline {
  readonly timelineType: string;
  readonly sequenceMetadata: readonly string[];
  readonly milestoneMetadata: readonly string[];
}

export interface ScheduleCalendar {
  readonly calendarType: string;
  readonly calendarMetadata: readonly string[];
  readonly exceptionMetadata: readonly string[];
}

export interface ScheduleMilestone {
  readonly milestoneType: string;
  readonly milestoneTimingMetadata: readonly string[];
  readonly dependencyMetadata: readonly string[];
}

export interface ScheduleDependency {
  readonly dependencyType: string;
  readonly dependencyTimingMetadata: readonly string[];
  readonly sequencingMetadata: readonly string[];
}

export interface ScheduleSequence {
  readonly sequenceType: string;
  readonly sequenceOrderingMetadata: readonly string[];
  readonly coordinationMetadata: readonly string[];
}

export interface ScheduleConstraint {
  readonly constraintType: string;
  readonly constraintMetadata: readonly string[];
  readonly exceptionMetadata: readonly string[];
}

export interface ScheduleStatus {
  readonly lifecycleStatus: "Defined" | "Cataloged";
  readonly readinessMetadata: readonly string[];
}

export interface ScheduleCapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ScheduleCategory;
  readonly status: "Defined" | "Cataloged";
  readonly metadata: ScheduleMetadata;
}

export interface ScheduleMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly sourceDependencies: readonly [
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:9",
    "OPS-5:9",
  ];
  readonly tags: readonly string[];
}

export interface SchedulePublicApi {
  readonly name: string;
  readonly exportPath: string;
  readonly kind: "Type" | "Constant" | "Object" | "Function";
  readonly stability: "Stable";
  readonly description: string;
}

export interface PlatformMetadata {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly platformDescription: string;
  readonly platformArchitecturalLevel: string;
  readonly platformStatus: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface FoundationMetadata {
  readonly platformScope: string;
  readonly consumedPlatforms: readonly string[];
  readonly publicApiSurface: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ValidationMetadata {
  readonly totalChecks: number;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ManifestMetadata {
  readonly compatibilityVersion: string;
  readonly dependencyCount: number;
  readonly publicApiCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
