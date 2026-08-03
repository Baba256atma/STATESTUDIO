/** EX-3:5 closed metadata-only Manifest types. */

export type ExecutiveTimelineExperienceManifestCapabilityName =
  | "TimelineNavigation"
  | "TimelinePositioning"
  | "TimelinePlaybackMetadata"
  | "TimelineHistoryMetadata"
  | "TimelineSnapshotMetadata"
  | "TimelineContextMetadata"
  | "TimelineSynchronizationMetadata"
  | "TimelineMarkerMetadata"
  | "TimelineEventMetadata"
  | "TimelineCursorMetadata"
  | "TimelineViewportMetadata"
  | "TimelineRelationshipMetadata"
  | "TimelineSchemaMetadata"
  | "TimelineValidationMetadata"
  | "TimelineAggregatePublication"
  | "TimelineConsumerPublication";

export interface ExecutiveTimelineExperienceManifestCapability {
  readonly capabilityId:
    `EX-3:5/Capability/${ExecutiveTimelineExperienceManifestCapabilityName}`;
  readonly name: ExecutiveTimelineExperienceManifestCapabilityName;
  readonly order: number;
  readonly statement: string;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceManifestDependencyRecord {
  readonly dependencyId: `EX-3:5/Dependency/${string}`;
  readonly order: number;
  readonly upstreamIdentity: string;
  readonly dependencyLevel: number;
  readonly dependencyStatus: string;
  readonly dependencyVersion: "1.0.0";
  readonly dependencyReadiness: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceManifestSummary {
  readonly identity: "EX-3:5/ExecutiveTimelineExperienceManifest";
  readonly namespace: "nexora.ex.executive.timeline.experience.manifest";
  readonly version: "1.0.0";
  readonly status: "Manifest";
  readonly readiness: "ReadyForPlatform";
  readonly previousPhase: "EX-3:4 — Executive Timeline Experience Validation";
  readonly nextPhase: "EX-3:6 — Executive Timeline Experience Platform";
  readonly upstreamDependency: "EX-3:4/ExecutiveTimelineExperienceValidation";
  readonly capabilityCount: 16;
  readonly dependencyCount: 4;
  readonly validationCategoryCount: 12;
  readonly validationRuleCount: 36;
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly platformCreated: false;
  readonly platformAuthorized: false;
}
