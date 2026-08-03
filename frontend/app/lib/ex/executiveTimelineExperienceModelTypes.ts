/** EX-3:3 closed metadata-only Model types. */

export type ExecutiveTimelineExperienceModelEntityName =
  | "Timeline"
  | "TimelineEvent"
  | "TimelineMarker"
  | "TimelineSegment"
  | "TimelinePlayback"
  | "TimelineCursor"
  | "TimelineViewport"
  | "TimelineSnapshot"
  | "TimelineNavigation"
  | "TimelineSynchronization"
  | "TimelineHistory"
  | "TimelineContext";

export type ExecutiveTimelineExperienceModelRelationshipKind =
  | "Contains"
  | "Has"
  | "Drives"
  | "Traverses"
  | "PositionsIn"
  | "Frames"
  | "Records"
  | "Aligns"
  | "Annotates";

export type ExecutiveTimelineExperienceModelSchemaKind =
  | "Identity"
  | "Structure"
  | "Lifecycle"
  | "Navigation"
  | "Playback"
  | "Synchronization"
  | "Viewport"
  | "History"
  | "Snapshot"
  | "Context";

export interface ExecutiveTimelineExperienceModelEntity {
  readonly entityId: `EX-3:3/Entity/${ExecutiveTimelineExperienceModelEntityName}`;
  readonly name: ExecutiveTimelineExperienceModelEntityName;
  readonly order: number;
  readonly statement: string;
  readonly metadataOnly: true;
  readonly executable: false;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceModelRelationship {
  readonly relationshipId: `EX-3:3/Relationship/${string}`;
  readonly order: number;
  readonly from: ExecutiveTimelineExperienceModelEntityName;
  readonly to: ExecutiveTimelineExperienceModelEntityName;
  readonly kind: ExecutiveTimelineExperienceModelRelationshipKind;
  readonly statement: string;
  readonly descriptiveOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceModelSchema {
  readonly schemaId: `EX-3:3/Schema/${ExecutiveTimelineExperienceModelSchemaKind}`;
  readonly kind: ExecutiveTimelineExperienceModelSchemaKind;
  readonly order: number;
  readonly statement: string;
  readonly metadataOnly: true;
  readonly descriptiveOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceModelSummary {
  readonly identity: "EX-3:3/ExecutiveTimelineExperienceModel";
  readonly namespace: "nexora.ex.executive.timeline.experience.model";
  readonly version: "1.0.0";
  readonly status: "Model";
  readonly readiness: "ReadyForValidation";
  readonly previousPhase: "EX-3:2 — Executive Timeline Experience Registry";
  readonly nextPhase: "EX-3:4 — Executive Timeline Experience Validation";
  readonly entityCount: 12;
  readonly relationshipCount: 18;
  readonly schemaCount: 10;
  readonly registryIdentity: "EX-3:2/ExecutiveTimelineExperienceRegistry";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly validationCreated: false;
  readonly validationAuthorized: false;
}
