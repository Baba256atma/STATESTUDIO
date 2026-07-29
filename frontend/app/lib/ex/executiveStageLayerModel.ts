/**
 * EX-1:3 — Executive Stage Layer Model.
 *
 * Six canonical layers with immutable ordering.
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
    fieldId: `EX-1:3/StageLayers/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Canonical layer names in fixed order.
 * Background → Relationship → Object → Focus → Interaction → Overlay
 */
export const ExecutiveStageCanonicalLayers = Object.freeze([
  "Background",
  "Relationship",
  "Object",
  "Focus",
  "Interaction",
  "Overlay",
] as const);

/** Stage Layers entity model. */
export const ExecutiveStageLayerModel = Object.freeze({
  entityId: "EX-1:3/Entity/Layers",
  entityName: "Layers",
  description: "Canonical Stage visual layers. Ordering is immutable.",
  root: false as const,
  fields: Object.freeze([
    field("identity", "Layers container identity.", 1),
    field("background", "Background layer structure.", 2),
    field("relationship", "Relationship layer structure.", 3),
    field("object", "Object layer structure.", 4),
    field("focus", "Focus layer structure.", 5),
    field("interaction", "Interaction layer structure.", 6),
    field("overlay", "Overlay layer structure.", 7),
    field(
      "layerOrder",
      "Immutable canonical layer order reference.",
      8,
      true,
      true,
    ),
  ]),
  fieldCount: 8 as const,
  stableIdentity: true as const,
  ownsBusinessState: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministicOrder: 3 as const,
});


/** Layer order is fixed by the Model and aligned with the Registry. */
export const ExecutiveStageLayerOrder = Object.freeze({
  orderId: "EX-1:3/LayerOrder",
  layers: ExecutiveStageCanonicalLayers,
  layerCount: ExecutiveStageCanonicalLayers.length,
  reorderable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});
