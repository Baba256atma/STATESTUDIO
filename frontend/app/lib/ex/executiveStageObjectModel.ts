/**
 * EX-1:3 — Executive Stage Object Model.
 *
 * StageObject visual structure. Business data remains inside Runtime.
 *
 * Ownership: owned exclusively by EX-1:3.
 */

const field = (
  fieldName: string,
  description: string,
  order: number,
  required = true,
  isReference = false,
) =>
  Object.freeze({
    fieldId: `EX-1:3/StageObject/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** StageObject entity model. */
export const ExecutiveStageObjectModel = Object.freeze({
  entityId: "EX-1:3/Entity/StageObject",
  entityName: "StageObject",
  description:
    "Visual object structure. Business data remains inside Runtime.",
  root: false as const,
  fields: Object.freeze([
    field("identity", "Object identity.", 1),
    field(
      "runtimeReference",
      "Immutable Runtime Object ID binding.",
      2,
      true,
      true,
    ),
    field("visibility", "Object visibility structure.", 3),
    field("selectionState", "Object selection state structure.", 4),
    field("positionReference", "Position reference structure.", 5, true, true),
    field("metadata", "Object metadata structure.", 6, false),
  ]),
  fieldCount: 6 as const,
  stableIdentity: true as const,
  ownsBusinessState: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministicOrder: 4 as const,
});
