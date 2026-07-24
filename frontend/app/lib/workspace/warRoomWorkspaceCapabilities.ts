/** WS-8:1 — Immutable capabilities and responsibilities. */
const capabilityNames = Object.freeze([
  "Declare Operational Status",
  "Register Executive Event",
  "Register Executive Alert",
  "Register Executive Incident",
  "Organize Operational Activities",
  "Declare Executive Coordination",
  "Prepare Executive Monitoring",
  "Prepare Executive Response",
  "Prepare Value Inputs",
  "Prepare Timeline Inputs",
  "Maintain Executive War Room Model",
] as const);

export const WarRoomWorkspaceCapabilities = Object.freeze(
  capabilityNames.map((name, index) =>
    Object.freeze({
      id: `WS-8:1/Capability/${String(index + 1).padStart(2, "0")}`,
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
  "Executive Operational Coordination",
  "Execution Supervision Declaration",
  "Operational Status Declaration",
  "Executive Alert Declaration",
  "Executive Event Declaration",
  "Incident Declaration",
  "Executive Activity Declaration",
  "Executive Monitoring Readiness",
  "Executive Response Readiness",
  "Cross-Workspace Operational Visibility",
  "Executive Collaboration Declaration",
  "Workspace Boundary Declaration",
] as const);

export const WarRoomWorkspaceResponsibilities = Object.freeze(
  responsibilityNames.map((name, index) =>
    Object.freeze({
      id: `WS-8:1/Responsibility/${String(index + 1).padStart(2, "0")}`,
      name,
      kind: "Architectural Responsibility",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
