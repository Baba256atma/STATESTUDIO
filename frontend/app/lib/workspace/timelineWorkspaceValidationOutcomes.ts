/** WS-10:4 — Immutable validation outcome vocabulary. */
export const TimelineWorkspaceValidationOutcomes = Object.freeze([
  "Pass",
  "PassWithWarnings",
  "Fail",
  "Blocked",
].map((name, index) => Object.freeze({
  id: `WS-10:4/Outcome/${String(index + 1).padStart(2, "0")}`,
  name,
  order: index + 1,
  runtimeEvaluation: false,
  metadataOnly: true,
  immutable: true,
})));
