/** WS-7:1 — Immutable Decision Workspace Foundation contracts. */
const names = Object.freeze([
  "DecisionWorkspaceContract",
  "DecisionIdentityContract",
  "DecisionDefinitionContract",
  "DecisionOptionContract",
  "DecisionComparisonContract",
  "DecisionEvaluationContract",
  "DecisionPriorityContract",
  "DecisionConstraintContract",
  "DecisionAssumptionContract",
  "DecisionImpactContract",
  "DecisionRationaleContract",
  "DecisionWorkspaceFoundationContract",
] as const);

export const DecisionWorkspaceV7Contracts = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:1/Contract/${String(index + 1).padStart(2, "0")}`,
      name,
      kind: "Architectural Contract",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
