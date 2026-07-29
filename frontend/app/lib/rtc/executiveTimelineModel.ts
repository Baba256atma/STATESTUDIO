/**
 * RTC-1:3 — Executive Timeline Model.
 *
 * Timeline entity structure. Playback logic is excluded.
 *
 * Ownership: owned exclusively by RTC-1:3.
 */

import type { ExecutiveRuntimeEntityModel } from "./executiveContextModel.ts";

const field = (
  fieldName: string,
  description: string,
  order: number,
  required = true,
  isReference = false,
) =>
  Object.freeze({
    fieldId: `RTC-1:3/Timeline/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Timeline entity model. */
export const ExecutiveTimelineModel: ExecutiveRuntimeEntityModel = Object.freeze({
  entityId: "RTC-1:3/Entity/Timeline",
  entityName: "Timeline",
  description:
    "Timeline structure within Executive Context. Playback logic excluded.",
  root: false,
  fields: Object.freeze([
    field("timelineId", "Timeline identity.", 1),
    field("mode", "Registered timeline mode reference.", 2, true, true),
    field("position", "Timeline position structure.", 3),
    field(
      "snapshotReference",
      "Snapshot identity reference.",
      4,
      false,
      true,
    ),
    field("metadata", "Timeline metadata structure.", 5, false),
  ]),
  fieldCount: 5,
  stableIdentity: true as const,
  storesRuntimeValues: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministicOrder: 9,
});
