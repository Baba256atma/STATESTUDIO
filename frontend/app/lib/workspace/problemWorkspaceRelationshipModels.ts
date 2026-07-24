/** WS-6:3 — Canonical descriptive Problem relationships. */
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Workspace", "contains", "Problem"],
  ["Problem", "has", "Context"],
  ["Problem", "supported by", "Evidence"],
  ["Problem", "limited by", "Constraint"],
  ["Problem", "qualified by", "Assumption"],
  ["Problem", "declares", "Impact"],
  ["Problem", "belongs to", "Classification"],
  ["Problem", "participates in", "Lifecycle"],
  ["Problem", "proposes", "Hypothesis"],
  ["Problem", "references", "Root Cause Domain"],
  ["Problem", "prepares", "Decision Input"],
  ["Problem", "prepares", "Scenario Input"],
] as const);

export const ProblemWorkspaceRelationshipModels = Object.freeze(
  definitions.map(
    ([sourceModel, relationshipType, targetModel], index) => Object.freeze({
      id: `WS-6:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      identity: `WS-6:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      name: `${sourceModel} ${relationshipType} ${targetModel}`,
      sourceModel,
      targetModel,
      relationshipType,
      relationshipMetadata: Object.freeze({
        descriptiveOnly: true,
        traversal: false,
        graphExecution: false,
      }),
      source: ProblemWorkspaceRegistry,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
