/**
 * RTC-1:3 — Executive Stage Model.
 *
 * Stage entity structure. Rendering belongs to EVE.
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
    fieldId: `RTC-1:3/Stage/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Stage entity model. */
export const ExecutiveStageModel: ExecutiveRuntimeEntityModel = Object.freeze({
  entityId: "RTC-1:3/Entity/Stage",
  entityName: "Stage",
  description:
    "Stage structure within Executive Context. Rendering belongs to EVE.",
  root: false,
  fields: Object.freeze([
    field("stageId", "Stage identity.", 1),
    field("visibleObjects", "Visible object identity references.", 2, false, true),
    field("selectedObject", "Selected object identity reference.", 3, false, true),
    field(
      "relationshipLayer",
      "Relationship layer structure.",
      4,
      false,
    ),
    field("metadata", "Stage metadata structure.", 5, false),
  ]),
  fieldCount: 5,
  stableIdentity: true as const,
  storesRuntimeValues: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministicOrder: 11,
});
