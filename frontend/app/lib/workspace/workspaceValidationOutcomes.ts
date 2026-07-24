/** WS-1:4 — Supported outcomes, severities, and result model kinds. */
export const WorkspaceValidationOutcomes = Object.freeze(["Pass", "Fail", "Warning", "Not Applicable"] as const);
export const WorkspaceValidationSeverities = Object.freeze(["Informational", "Low", "Medium", "High", "Critical"] as const);
export const WorkspaceValidationResultModels = Object.freeze([
  "Validation Rule", "Validation Input Reference", "Validation Finding", "Validation Severity",
  "Validation Outcome", "Validation Category Result", "Validation Gate Result",
  "Validation Summary", "Validation Report", "Validation Readiness",
] as const);

