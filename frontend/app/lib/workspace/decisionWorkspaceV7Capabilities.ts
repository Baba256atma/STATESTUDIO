/** WS-7:1 — Immutable capabilities and responsibilities. */
const capabilityNames = Object.freeze([
  "Define Decision",
  "Register Decision Option",
  "Organize Decision Alternatives",
  "Declare Decision Constraints",
  "Declare Decision Assumptions",
  "Declare Decision Rationale",
  "Prepare Decision Comparison",
  "Prepare Decision Evaluation",
  "Prepare Scenario Inputs",
  "Prepare Executive Approval",
  "Maintain Executive Decision Model",
] as const);

export const DecisionWorkspaceV7Capabilities = Object.freeze(
  capabilityNames.map((name, index) =>
    Object.freeze({
      id: `WS-7:1/Capability/${String(index + 1).padStart(2, "0")}`,
      name,
      kind: "Architectural Capability",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

const responsibilityNames = Object.freeze([
  "Decision Identification",
  "Decision Definition",
  "Decision Option Declaration",
  "Decision Comparison Readiness",
  "Decision Evaluation Readiness",
  "Decision Prioritization Readiness",
  "Decision Rationale Declaration",
  "Decision Constraint Declaration",
  "Decision Assumption Declaration",
  "Decision Impact Declaration",
  "Executive Decision Representation",
  "Workspace Boundary Declaration",
] as const);

export const DecisionWorkspaceV7Responsibilities = Object.freeze(
  responsibilityNames.map((name, index) =>
    Object.freeze({
      id: `WS-7:1/Responsibility/${String(index + 1).padStart(2, "0")}`,
      name,
      kind: "Architectural Responsibility",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
