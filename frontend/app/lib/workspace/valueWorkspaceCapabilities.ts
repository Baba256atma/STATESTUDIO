/** WS-9:1 — Immutable capabilities and responsibilities. */
const capabilityNames = Object.freeze([
  "Define Business Value",
  "Declare Value Dimensions",
  "Organize Value Evidence",
  "Organize Value Outcomes",
  "Declare Value Impacts",
  "Prepare ROI Representation",
  "Prepare Executive Value Summary",
  "Prepare Timeline Value Inputs",
  "Maintain Executive Value Model",
  "Maintain Business Value Metadata",
  "Maintain Executive Value Workspace",
] as const);

export const ValueWorkspaceCapabilities = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `WS-9:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    kind: "Architectural Capability",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const responsibilityNames = Object.freeze([
  "Executive Value Declaration",
  "Business Value Definition",
  "Value Dimension Declaration",
  "Value Outcome Declaration",
  "Value Evidence Declaration",
  "Value Impact Declaration",
  "Value Measurement Readiness",
  "ROI Readiness Declaration",
  "Executive Value Representation",
  "Executive Value Communication Readiness",
  "Workspace Boundary Declaration",
] as const);

export const ValueWorkspaceResponsibilities = Object.freeze(
  responsibilityNames.map((name, index) => Object.freeze({
    id: `WS-9:1/Responsibility/${String(index + 1).padStart(2, "0")}`,
    name,
    kind: "Architectural Responsibility",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
