/** WS-10:1 — Canonical Timeline Workspace terminology. */
const names = Object.freeze([
  "Timeline Identity",
  "Timeline Event",
  "Historical Record",
  "Executive Milestone",
  "Workspace Transition",
  "Executive History",
  "Business Chronology",
  "Timeline Navigation",
  "Historical Traceability",
  "Executive Activity History",
  "Timeline Metadata",
  "Timeline Boundary",
] as const);

export const TimelineWorkspaceTerminology = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-10:1/Term/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
