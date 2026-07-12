export interface SchedulingModelIdentity {
  readonly scheduleIdPattern: string;
  readonly displayName: string;
  readonly description: string;
  readonly supportedCategories: readonly string[];
  readonly sourcePlatform: string;
  readonly metadata: SchedulingModelMetadata;
}

export interface ScheduleTimelineDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly timelineTypes: readonly string[];
  readonly sequenceMetadata: readonly string[];
  readonly metadata: SchedulingModelMetadata;
}

export interface ScheduleCalendarDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly calendarTypes: readonly string[];
  readonly calendarMetadata: readonly string[];
  readonly metadata: SchedulingModelMetadata;
}

export interface ScheduleExecutionWindowDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly windowTypes: readonly string[];
  readonly timingMetadata: readonly string[];
  readonly metadata: SchedulingModelMetadata;
}

export interface ScheduleMilestoneDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly milestoneTypes: readonly string[];
  readonly milestoneTimingMetadata: readonly string[];
  readonly metadata: SchedulingModelMetadata;
}

export interface ScheduleDependencyDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly dependencyTypes: readonly string[];
  readonly dependencyTimingMetadata: readonly string[];
  readonly metadata: SchedulingModelMetadata;
}

export interface ScheduleSequenceDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly sequenceTypes: readonly string[];
  readonly sequenceOrderingMetadata: readonly string[];
  readonly metadata: SchedulingModelMetadata;
}

export interface ScheduleConstraintDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly constraintTypes: readonly string[];
  readonly constraintMetadata: readonly string[];
  readonly metadata: SchedulingModelMetadata;
}

export interface ScheduleLinkDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly linkedEntities: readonly string[];
  readonly compatibilityMetadata: readonly string[];
  readonly metadata: SchedulingModelMetadata;
}

export interface SchedulingModelMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly compatibilityVersion: string;
  readonly sourceDependencies: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
