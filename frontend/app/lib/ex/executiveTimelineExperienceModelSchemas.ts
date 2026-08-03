import type {
  ExecutiveTimelineExperienceModelSchema,
  ExecutiveTimelineExperienceModelSchemaKind,
} from "./executiveTimelineExperienceModelTypes.ts";

const schema = (
  kind: ExecutiveTimelineExperienceModelSchemaKind,
  order: number,
  statement: string,
): ExecutiveTimelineExperienceModelSchema =>
  Object.freeze({
    schemaId: `EX-3:3/Schema/${kind}`,
    kind,
    order,
    statement,
    metadataOnly: true as const,
    descriptiveOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceModelSchemas = Object.freeze([
  schema("Identity", 1, "Describes Timeline Experience identity structure."),
  schema("Structure", 2, "Describes entity and relationship structure."),
  schema("Lifecycle", 3, "Describes model lifecycle metadata posture."),
  schema("Navigation", 4, "Describes navigation structural metadata."),
  schema("Playback", 5, "Describes playback structural metadata."),
  schema(
    "Synchronization",
    6,
    "Describes synchronization structural metadata.",
  ),
  schema("Viewport", 7, "Describes viewport structural metadata."),
  schema("History", 8, "Describes history structural metadata."),
  schema("Snapshot", 9, "Describes snapshot structural metadata."),
  schema("Context", 10, "Describes executive context structural metadata."),
] as const);
