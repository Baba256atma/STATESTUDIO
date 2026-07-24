/** WS-2:4 — Supported outcomes, severities, and result models. */
export const ExecutiveHomeWorkspaceValidationOutcomes = Object.freeze([
  "Pass", "Fail", "Warning", "NotApplicable",
] as const);
export const ExecutiveHomeWorkspaceValidationSeverities = Object.freeze([
  "Informational", "Low", "Medium", "High", "Critical",
] as const);
export const ExecutiveHomeWorkspaceValidationResultModels = Object.freeze([
  "Validation Rule", "Validation Category", "Validation Finding", "Validation Severity",
  "Validation Outcome", "Validation Gate", "Validation Report", "Validation Summary",
  "Validation Readiness",
] as const);

