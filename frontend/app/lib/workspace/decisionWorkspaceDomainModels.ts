/** WS-4:3 — Canonical Decision domain models. */
import type { DecisionWorkspaceModelDescriptor } from "./decisionWorkspaceIdentityModel.ts";
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";

const names = Object.freeze([
  "Decision Workspace Model",
  "Decision Model",
  "Decision Option Model",
  "Decision Criteria Model",
  "Decision Context Model",
  "Decision Risk Model",
  "Decision Assumption Model",
  "Decision Constraint Model",
  "Decision Confidence Model",
  "Decision Owner Model",
  "Decision Outcome Model",
  "Decision Metadata Model",
] as const);

export const DecisionWorkspaceDomainModels = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:3/DomainModel/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Defines the structural ${name} metadata.`,
    source: DecisionWorkspaceRegistry,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceModelDescriptor[],
);
