/** WS-4:3 — Canonical structural Decision relationships. */
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Workspace", "contains", "Decisions"],
  ["Decision", "contains", "Decision Option"],
  ["Decision", "evaluated by", "Decision Criteria"],
  ["Decision", "belongs to", "Decision Context"],
  ["Decision", "exposed to", "Decision Risk"],
  ["Decision", "supported by", "Decision Assumption"],
  ["Decision", "limited by", "Decision Constraint"],
  ["Decision", "measured by", "Decision Confidence"],
  ["Decision", "owned by", "Decision Owner"],
  ["Decision", "produces", "Decision Outcome"],
  ["Decision", "described by", "Metadata"],
  ["Decision Option", "evaluated by", "Evaluation Criteria"],
] as const);

export const DecisionWorkspaceRelationshipModels = Object.freeze(
  definitions.map(
    ([sourceModel, relationshipType, targetModel], index) => Object.freeze({
      id: `WS-4:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      name: `${sourceModel} ${relationshipType} ${targetModel}`,
      sourceModel,
      targetModel,
      relationshipType,
      order: index + 1,
      source: DecisionWorkspaceRegistry,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
