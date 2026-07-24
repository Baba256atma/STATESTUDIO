/** WS-9:1 — Immutable Value Workspace Foundation contracts. */
const names = Object.freeze([
  "ValueWorkspaceContract",
  "ValueIdentityContract",
  "BusinessValueContract",
  "ValueDimensionContract",
  "ValueOutcomeContract",
  "ValueEvidenceContract",
  "ValueImpactContract",
  "ValueMeasurementContract",
  "ReturnOnInvestmentContract",
  "ExecutiveValueRepresentationContract",
  "ValueBoundaryContract",
  "ValueWorkspaceFoundationContract",
] as const);

export const ValueWorkspaceContracts = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    kind: "Architectural Contract",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
