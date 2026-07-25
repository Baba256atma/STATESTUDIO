/** ASSISTANT-4:3 — Exactly 18 immutable descriptive Guidance relationships. */
import { AssistantExecutiveGuidanceRegistry } from "./assistantExecutiveGuidanceRegistry.ts";
import type { AssistantExecutiveGuidanceRelationshipMetadata } from "./assistantExecutiveGuidanceModel.types.ts";

const declarations = Object.freeze([
  ["Executive Guidance", "Guidance Session", "owns"],
  ["Guidance Session", "Guidance Context", "contains"],
  ["Guidance Session", "Guidance Objective", "targets"],
  ["Guidance Context", "Guidance Strategy", "determines"],
  ["Guidance Strategy", "Guidance Path", "defines"],
  ["Guidance Path", "Guidance Step", "contains"],
  ["Guidance Step", "Guidance Milestone", "reaches"],
  ["Guidance Milestone", "Guidance Outcome", "contributes to"],
  ["Guidance Recommendation", "Guidance Objective", "supports"],
  ["Guidance Recommendation", "Guidance Strategy", "follows"],
  ["Guidance Session", "Guidance Policy", "governed by"],
  ["Guidance Session", "Guidance Capability", "exposes"],
  ["Guidance Session", "Guidance Boundary", "constrained by"],
  ["Guidance Session", "Guidance Lifecycle", "follows"],
  ["Guidance Transition", "Guidance State", "updates"],
  ["Guidance Summary", "Guidance Session", "summarizes"],
  ["Guidance Metadata", "Executive Guidance", "describes"],
  ["Guidance Identity", "Executive Guidance", "owns"],
] as const);

export const AssistantExecutiveGuidanceModelRelationships:
readonly AssistantExecutiveGuidanceRelationshipMetadata[] = Object.freeze(
  declarations.map(([source, target, relationshipType], index) =>
    Object.freeze({
      identifier:
        `ASSISTANT-4:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      source,
      target,
      relationshipType,
      registryReference: AssistantExecutiveGuidanceRegistry.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
