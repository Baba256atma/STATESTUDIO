/**
 * RTC-1:3 — Executive Workspace Model.
 *
 * Workspace entity structure. Behaviour is defined in later phases.
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
    fieldId: `RTC-1:3/Workspace/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Workspace entity model. */
export const ExecutiveWorkspaceModel: ExecutiveRuntimeEntityModel = Object.freeze({
  entityId: "RTC-1:3/Entity/Workspace",
  entityName: "Workspace",
  description:
    "Workspace structure within Executive Context. Behaviour deferred.",
  root: false,
  fields: Object.freeze([
    field("workspaceId", "Workspace identity.", 1),
    field("type", "Registered workspace type reference.", 2, true, true),
    field("status", "Workspace status structure.", 3),
    field("origin", "Workspace origin structure.", 4, false),
    field("metadata", "Workspace metadata structure.", 5, false),
  ]),
  fieldCount: 5,
  stableIdentity: true as const,
  storesRuntimeValues: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministicOrder: 5,
});
