/**
 * RTC-1:3 — Executive Pack Model.
 *
 * Pack entity structure. Pack content is not stored here.
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
    fieldId: `RTC-1:3/Pack/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Pack entity model. */
export const ExecutivePackModel: ExecutiveRuntimeEntityModel = Object.freeze({
  entityId: "RTC-1:3/Entity/Pack",
  entityName: "Pack",
  description:
    "Pack structure within Executive Context. Content is not stored here.",
  root: false,
  fields: Object.freeze([
    field("packId", "Pack identity.", 1),
    field("type", "Registered pack type reference.", 2, true, true),
    field(
      "lifecycleReference",
      "Pack lifecycle reference.",
      3,
      true,
      true,
    ),
    field(
      "workspaceReference",
      "Owning workspace identity reference.",
      4,
      true,
      true,
    ),
    field("metadata", "Pack metadata structure.", 5, false),
  ]),
  fieldCount: 5,
  stableIdentity: true as const,
  storesRuntimeValues: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministicOrder: 6,
});
