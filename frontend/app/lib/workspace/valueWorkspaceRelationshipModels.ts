/** WS-9:3 — Descriptive Value Workspace relationship models. */
import { ValueWorkspaceRegistry } from "./valueWorkspaceRegistry.ts";

const relationships = Object.freeze([
  ["Value Workspace", "Business Value", "contains"],
  ["Business Value", "Value Dimension", "has dimension"],
  ["Business Value", "Value Outcome", "has outcome"],
  ["Business Value", "Value Evidence", "supported by"],
  ["Business Value", "Value Impact", "has impact"],
  ["Business Value", "Measurement", "described by measurement"],
  ["Business Value", "ROI", "references"],
  ["Business Value", "Executive Summary", "summarized by"],
  ["Business Value", "Timeline Input", "prepares"],
  ["Business Value", "Lifecycle", "governed by"],
  ["Business Value", "Readiness", "declares"],
  ["Business Value", "Metadata", "described by"],
] as const);

export const ValueWorkspaceRelationshipModels = Object.freeze(
  relationships.map(([source, target, relationshipType], index) =>
    Object.freeze({
      id: `WS-9:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      relationshipIdentity:
        `WS-9:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      source,
      target,
      relationshipType,
      metadata: Object.freeze({
        registry: ValueWorkspaceRegistry.identity.id,
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
