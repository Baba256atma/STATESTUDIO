/** WS-10:4 — Immutable validation target declarations. */
import { TimelineWorkspaceValidationCategories } from "./timelineWorkspaceValidationCategories.ts";

export const TimelineWorkspaceValidationTargets = Object.freeze(
  TimelineWorkspaceValidationCategories.map((category, index) =>
    Object.freeze({
      id: `WS-10:4/Target/${String(index + 1).padStart(2, "0")}`,
      name: category.name,
      category: category.id,
      declaredState: "Structurally Complete",
      order: index + 1,
      evaluatedAtRuntime: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
