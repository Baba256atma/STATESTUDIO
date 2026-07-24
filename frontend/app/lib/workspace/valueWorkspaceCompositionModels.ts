/** WS-9:3 — Structural Value Workspace composition declarations. */
const definitions = Object.freeze([
  ["Business Value", [
    "Value Identity", "Value Category", "Business Area", "Related Goals",
    "Related KPIs", "Related Decisions", "Related Scenarios",
    "Related War Room Activities", "Metadata",
  ]],
  ["Value Dimension", [
    "Dimension Identity", "Dimension Type", "Dimension Description",
    "Measurement Type", "Metadata",
  ]],
  ["Value Outcome", [
    "Outcome Identity", "Outcome Category", "Outcome Description",
    "Related Evidence", "Metadata",
  ]],
  ["Value Evidence", [
    "Evidence Identity", "Evidence Type", "Source Reference",
    "Confidence Declaration", "Metadata",
  ]],
  ["Value Impact", [
    "Impact Identity", "Impact Domain", "Impact Description",
    "Related Outcomes", "Metadata",
  ]],
  ["Value Measurement", [
    "Measurement Identity", "Measurement Type", "Unit", "Reference", "Metadata",
  ]],
  ["Return On Investment", [
    "ROI Identity", "ROI Category", "ROI Reference", "Related Value", "Metadata",
  ]],
  ["Executive Value Summary", [
    "Summary Identity", "Related Value References",
    "Related Outcome References", "Metadata",
  ]],
  ["Value Readiness", [
    "ReadyForValidation", "ReadyForTimelineWorkspace",
    "ReadyForExecutiveReview", "ReadyForPublication", "Incomplete",
  ]],
] as const);

export const ValueWorkspaceCompositionModels = Object.freeze(
  definitions.map(([name, fields], index) => Object.freeze({
    id: `WS-9:3/Composition/${String(index + 1).padStart(2, "0")}`,
    name,
    fields: Object.freeze(fields),
    order: index + 1,
    computed: false,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
