/** WS-10:3 — Descriptive Timeline Workspace relationship models. */
import { TimelineWorkspaceRegistry } from "./timelineWorkspaceRegistry.ts";

const relationships = Object.freeze([
  ["Timeline", "Timeline Event", "contains"],
  ["Timeline", "Historical Record", "contains"],
  ["Timeline", "Executive Milestone", "contains"],
  ["Timeline", "Workspace Transition", "contains"],
  ["Timeline", "Executive History", "represents"],
  ["Timeline", "Business Chronology", "represents"],
  ["Timeline", "Historical Traceability", "provides"],
  ["Timeline", "Timeline Navigation", "describes"],
  ["Timeline", "Value Workspace Reference", "references"],
  ["Timeline", "Lifecycle", "governed by"],
  ["Timeline", "Readiness", "declares"],
  ["Timeline", "Metadata", "described by"],
] as const);

export const TimelineWorkspaceRelationshipModels = Object.freeze(
  relationships.map(([source, target, relationshipType], index) =>
    Object.freeze({
      id: `WS-10:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      relationshipIdentity:
        `WS-10:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      source,
      target,
      relationshipType,
      metadata: Object.freeze({
        registry: TimelineWorkspaceRegistry.identity.id,
        descriptiveOnly: true,
      }),
      order: index + 1,
      traversable: false,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
