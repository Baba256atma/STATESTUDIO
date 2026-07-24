/** WS-4:1 — Immutable Decision Workspace architectural contracts. */
import type { DecisionWorkspaceDeclaration } from "./decisionWorkspaceIdentity.ts";

const names = Object.freeze([
  "Decision Workspace",
  "Decision Object",
  "Decision Option",
  "Decision Criteria",
  "Decision Context",
  "Decision Risk",
  "Decision Assumption",
  "Decision Constraint",
  "Decision Confidence",
  "Decision Owner",
  "Decision Outcome",
  "Decision Metadata",
] as const);

export const DecisionWorkspaceContracts = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares the canonical ${name} metadata contract.`,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceDeclaration[],
);
