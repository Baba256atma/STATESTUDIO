/**
 * EX-1:3 — Executive Stage Interaction Model.
 *
 * StageInteraction boundary structure. Execution belongs to Platform.
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
    fieldId: `EX-1:3/StageInteraction/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** StageInteraction entity model. */
export const ExecutiveStageInteractionModel = Object.freeze({
  entityId: "EX-1:3/Entity/StageInteraction",
  entityName: "StageInteraction",
  description:
    "Interaction boundary structure. Execution logic belongs to Platform.",
  root: false as const,
  fields: Object.freeze([
    field("identity", "Interaction identity.", 1),
    field("interactionType", "Registered interaction type.", 2),
    field(
      "targetReference",
      "Interaction target identity reference.",
      3,
      true,
      true,
    ),
    field("availability", "Interaction availability structure.", 4),
    field("metadata", "Interaction metadata structure.", 5, false),
  ]),
  fieldCount: 5 as const,
  stableIdentity: true as const,
  ownsBusinessState: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministicOrder: 7 as const,
});
