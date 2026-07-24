/** WS-9:4 — Immutable validation target declarations. */
import { ValueWorkspaceValidationCategories } from "./valueWorkspaceValidationCategories.ts";

export const ValueWorkspaceValidationTargets = Object.freeze(
  ValueWorkspaceValidationCategories.map((category, index) => Object.freeze({
    id: `WS-9:4/Target/${String(index + 1).padStart(2, "0")}`,
    name: category.name,
    category: category.id,
    declaredState: "Structurally Complete",
    order: index + 1,
    evaluatedAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
