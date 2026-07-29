/**
 * EX-1:3 — Executive Stage Relationship Model.
 *
 * StageRelationship visual connection structure. Geometry deferred.
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
    fieldId: `EX-1:3/StageRelationship/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** StageRelationship entity model. */
export const ExecutiveStageRelationshipModel = Object.freeze({
  entityId: "EX-1:3/Entity/StageRelationship",
  entityName: "StageRelationship",
  description:
    "Visual relationship connection structure. Geometry is defined later.",
  root: false as const,
  fields: Object.freeze([
    field("identity", "Relationship identity.", 1),
    field("sourceObject", "Source object identity reference.", 2, true, true),
    field("targetObject", "Target object identity reference.", 3, true, true),
    field("relationshipType", "Registered relationship type.", 4),
    field("visibility", "Relationship visibility structure.", 5),
  ]),
  fieldCount: 5 as const,
  stableIdentity: true as const,
  ownsBusinessState: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministicOrder: 5 as const,
});
