/** WS-5:3 — Canonical structural Scenario relationships. */
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Workspace", "contains", "Scenarios"],
  ["Scenario", "contains", "Scenario Option"],
  ["Scenario", "branches into", "Scenario Branch"],
  ["Scenario", "references", "Scenario Timeline"],
  ["Scenario", "supported by", "Scenario Assumption"],
  ["Scenario", "exposed to", "Scenario Risk"],
  ["Scenario", "limited by", "Scenario Constraint"],
  ["Scenario", "produces", "Scenario Outcome"],
  ["Scenario", "measured by", "Scenario Confidence"],
  ["Scenario", "supports", "Scenario Recommendation"],
  ["Scenario", "described by", "Metadata"],
  ["Scenario Branch", "produces", "Scenario Outcome"],
] as const);

export const ScenarioWorkspaceRelationshipModels = Object.freeze(
  definitions.map(
    ([sourceModel, relationshipType, targetModel], index) => Object.freeze({
      id: `WS-5:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      name: `${sourceModel} ${relationshipType} ${targetModel}`,
      sourceModel,
      targetModel,
      relationshipType,
      order: index + 1,
      source: ScenarioWorkspaceRegistry,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
