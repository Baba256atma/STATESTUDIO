/** WS-7:3 — Canonical descriptive Decision relationships. */
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";

const definitions = Object.freeze([
  ["Workspace", "contains", "Decision"],
  ["Decision", "has", "Option"],
  ["Decision", "limited by", "Constraint"],
  ["Decision", "qualified by", "Assumption"],
  ["Decision", "declares", "Impact"],
  ["Decision", "assigned", "Priority"],
  ["Decision", "references", "Comparison"],
  ["Decision", "references", "Evaluation"],
  ["Decision", "documents", "Rationale"],
  ["Decision", "prepares", "Scenario Input"],
  ["Decision", "prepares", "Executive Approval"],
  ["Decision", "participates in", "Lifecycle"],
] as const);

export const DecisionWorkspaceV7RelationshipModels = Object.freeze(
  definitions.map(
    ([sourceModel, relationshipType, targetModel], index) =>
      Object.freeze({
        id: `WS-7:3/Relationship/${String(index + 1).padStart(2, "0")}`,
        identity:
          `WS-7:3/Relationship/${String(index + 1).padStart(2, "0")}`,
        name: `${sourceModel} ${relationshipType} ${targetModel}`,
        sourceModel,
        targetModel,
        relationshipType,
        relationshipMetadata: Object.freeze({
          descriptiveOnly: true,
          traversal: false,
          graphExecution: false,
        }),
        source: DecisionWorkspaceV7Registry,
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      }),
  ),
);
