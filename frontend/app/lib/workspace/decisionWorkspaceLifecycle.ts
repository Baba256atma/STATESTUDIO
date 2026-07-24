/** WS-4:1 — Declarative Decision lifecycle vocabulary. */
export const DecisionWorkspaceLifecycle = Object.freeze([
  "Draft",
  "UnderReview",
  "UnderAnalysis",
  "Approved",
  "Rejected",
  "Active",
  "Completed",
  "Archived",
] as const);
