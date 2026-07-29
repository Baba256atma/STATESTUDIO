/**
 * EX-1:3 — Executive Stage Surface Model.
 *
 * StageSurface visual workspace structure. Does not contain business objects.
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
    fieldId: `EX-1:3/StageSurface/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** StageSurface entity model. */
export const ExecutiveStageSurfaceModel = Object.freeze({
  entityId: "EX-1:3/Entity/StageSurface",
  entityName: "StageSurface",
  description: "Visual workspace surface. Does not contain business objects.",
  root: false as const,
  fields: Object.freeze([
    field("identity", "Surface identity.", 1),
    field("bounds", "Surface bounds structure.", 2),
    field("viewportReference", "Viewport identity reference.", 3, true, true),
    field(
      "backgroundReference",
      "Background layer identity reference.",
      4,
      true,
      true,
    ),
    field(
      "runtimeContextId",
      "Immutable Runtime Context ID binding.",
      5,
      true,
      true,
    ),
    field("metadata", "Surface metadata structure.", 6, false),
  ]),
  fieldCount: 6 as const,
  stableIdentity: true as const,
  ownsBusinessState: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministicOrder: 2 as const,
});
