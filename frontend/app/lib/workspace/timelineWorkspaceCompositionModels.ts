/** WS-10:3 — Structural Timeline Workspace composition declarations. */
const definitions = Object.freeze([
  ["Timeline Event", [
    "Event Identity", "Event Category", "Event Description",
    "Event Timestamp Reference", "Related Workspace",
    "Related Business Object", "Metadata",
  ]],
  ["Historical Record", [
    "Record Identity", "Record Type", "Related Event", "Related Workspace",
    "Historical References", "Metadata",
  ]],
  ["Executive Milestone", [
    "Milestone Identity", "Milestone Category", "Milestone Description",
    "Related Timeline Events", "Metadata",
  ]],
  ["Workspace Transition", [
    "Transition Identity", "Source Workspace", "Target Workspace",
    "Transition Category", "Metadata",
  ]],
  ["Executive History", [
    "History Identity", "History Scope", "Related Records",
    "Related Milestones", "Metadata",
  ]],
  ["Business Chronology", [
    "Chronology Identity", "Chronology Scope",
    "Related Historical Records", "Metadata",
  ]],
  ["Historical Traceability", [
    "Trace Identity", "Source Reference", "Target Reference",
    "Relationship Description", "Metadata",
  ]],
  ["Timeline Navigation", [
    "Navigation Identity", "Navigation Scope", "Navigation Granularity",
    "Metadata",
  ]],
  ["Timeline Readiness", [
    "ReadyForValidation", "ReadyForExecutiveReview",
    "ReadyForPublication", "ReadyForConsumer", "Incomplete",
  ]],
] as const);

export const TimelineWorkspaceCompositionModels = Object.freeze(
  definitions.map(([name, fields], index) => Object.freeze({
    id: `WS-10:3/Composition/${String(index + 1).padStart(2, "0")}`,
    name,
    fields: Object.freeze(fields),
    order: index + 1,
    computed: false,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
