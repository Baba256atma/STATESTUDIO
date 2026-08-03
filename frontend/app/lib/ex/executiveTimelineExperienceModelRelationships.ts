import type {
  ExecutiveTimelineExperienceModelEntity,
  ExecutiveTimelineExperienceModelEntityName,
  ExecutiveTimelineExperienceModelRelationship,
  ExecutiveTimelineExperienceModelRelationshipKind,
} from "./executiveTimelineExperienceModelTypes.ts";

const entity = (
  name: ExecutiveTimelineExperienceModelEntityName,
  order: number,
  statement: string,
): ExecutiveTimelineExperienceModelEntity =>
  Object.freeze({
    entityId: `EX-3:3/Entity/${name}`,
    name,
    order,
    statement,
    metadataOnly: true as const,
    executable: false as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceModelEntities = Object.freeze([
  entity("Timeline", 1, "Root Timeline Experience structural entity."),
  entity("TimelineEvent", 2, "Discrete executive timeline event descriptor."),
  entity("TimelineMarker", 3, "Annotative marker on the timeline."),
  entity("TimelineSegment", 4, "Ordered temporal segment descriptor."),
  entity("TimelinePlayback", 5, "Playback posture metadata descriptor."),
  entity("TimelineCursor", 6, "Current temporal cursor descriptor."),
  entity("TimelineViewport", 7, "Visible temporal viewport descriptor."),
  entity("TimelineSnapshot", 8, "Frozen timeline state snapshot descriptor."),
  entity("TimelineNavigation", 9, "Navigation posture metadata descriptor."),
  entity(
    "TimelineSynchronization",
    10,
    "Synchronization posture metadata descriptor.",
  ),
  entity("TimelineHistory", 11, "Historical inspection metadata descriptor."),
  entity("TimelineContext", 12, "Executive timeline context descriptor."),
] as const);

const relationship = (
  from: ExecutiveTimelineExperienceModelEntityName,
  to: ExecutiveTimelineExperienceModelEntityName,
  kind: ExecutiveTimelineExperienceModelRelationshipKind,
  order: number,
  statement: string,
): ExecutiveTimelineExperienceModelRelationship =>
  Object.freeze({
    relationshipId: `EX-3:3/Relationship/${from}_${kind}_${to}`,
    order,
    from,
    to,
    kind,
    statement,
    descriptiveOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceModelRelationships = Object.freeze([
  relationship("Timeline", "TimelineEvent", "Contains", 1, "Timeline contains events."),
  relationship("Timeline", "TimelineMarker", "Contains", 2, "Timeline contains markers."),
  relationship("Timeline", "TimelineSegment", "Contains", 3, "Timeline contains segments."),
  relationship("Timeline", "TimelineCursor", "Has", 4, "Timeline has a cursor."),
  relationship("Timeline", "TimelineViewport", "Has", 5, "Timeline has a viewport."),
  relationship("Timeline", "TimelineHistory", "Has", 6, "Timeline has history."),
  relationship(
    "Timeline",
    "TimelineSynchronization",
    "Has",
    7,
    "Timeline has synchronization posture.",
  ),
  relationship(
    "Timeline",
    "TimelineNavigation",
    "Has",
    8,
    "Timeline has navigation posture.",
  ),
  relationship(
    "Timeline",
    "TimelinePlayback",
    "Has",
    9,
    "Timeline has playback posture.",
  ),
  relationship(
    "Timeline",
    "TimelineSnapshot",
    "Has",
    10,
    "Timeline has snapshots.",
  ),
  relationship(
    "Timeline",
    "TimelineContext",
    "Has",
    11,
    "Timeline has executive context.",
  ),
  relationship(
    "TimelinePlayback",
    "TimelineCursor",
    "Drives",
    12,
    "Playback drives the cursor.",
  ),
  relationship(
    "TimelineNavigation",
    "TimelineSegment",
    "Traverses",
    13,
    "Navigation traverses segments.",
  ),
  relationship(
    "TimelineCursor",
    "TimelineSegment",
    "PositionsIn",
    14,
    "Cursor positions within a segment.",
  ),
  relationship(
    "TimelineViewport",
    "TimelineSegment",
    "Frames",
    15,
    "Viewport frames segments.",
  ),
  relationship(
    "TimelineHistory",
    "TimelineSnapshot",
    "Records",
    16,
    "History records snapshots.",
  ),
  relationship(
    "TimelineSynchronization",
    "TimelineContext",
    "Aligns",
    17,
    "Synchronization aligns context.",
  ),
  relationship(
    "TimelineEvent",
    "TimelineMarker",
    "Annotates",
    18,
    "Events may annotate markers.",
  ),
] as const);
