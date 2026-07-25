/** ASSISTANT-7:3 — Exactly 18 immutable descriptive planning relationships. */
import { AssistantExecutiveActionPlanningRegistry } from "./assistantExecutiveActionPlanningRegistry.ts";
import type { AssistantExecutiveActionPlanningRelationshipMetadata } from "./assistantExecutiveActionPlanningModel.types.ts";

const declarations = Object.freeze([
  ["Executive Action Planning", "Action Plan", "owns"],
  ["Action Plan", "Action Plan Identity", "owns"],
  ["Action Plan", "Action Objective", "defines"],
  ["Action Plan", "Planned Action", "contains"],
  ["Planned Action", "Action Sequence", "participates in"],
  ["Planned Action", "Action Dependency", "references"],
  ["Planned Action", "Action Priority", "declares"],
  ["Planned Action", "Action Owner Reference", "references"],
  ["Planned Action", "Action Time Horizon", "references"],
  ["Planned Action", "Action Outcome", "produces"],
  ["Planned Action", "Action Milestone", "may define"],
  ["Planned Action", "Action Constraint", "may reference"],
  ["Action Plan", "Action Planning Lifecycle", "follows"],
  ["Action Plan", "Action Policy", "governed by"],
  ["Action Plan", "Action Planning Capability", "exposes"],
  ["Action Plan", "Action Planning Boundary", "constrained by"],
  ["Action Plan Summary", "Action Plan", "summarizes"],
  ["Action Planning Metadata", "Executive Action Planning", "describes"],
] as const);

export const AssistantExecutiveActionPlanningModelRelationships:
readonly AssistantExecutiveActionPlanningRelationshipMetadata[] =
  Object.freeze(
    declarations.map(([source, target, relationshipType], index) =>
      Object.freeze({
        identifier:
          `ASSISTANT-7:3/Relationship/${String(index + 1).padStart(2, "0")}`,
        source,
        target,
        relationshipType,
        registryReference:
          AssistantExecutiveActionPlanningRegistry.identity.id,
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );
