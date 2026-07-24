/** WS-4:4 — Immutable outcomes and severities. */
const outcomeDefinitions = Object.freeze([
  ["Pass", true, "Permits readiness"],
  ["Fail", true, "Blocks readiness"],
  ["Warning", false, "Requires review"],
  ["NotApplicable", true, "No readiness effect"],
  ["NotEvaluated", false, "Blocks readiness"],
] as const);

export const DecisionWorkspaceValidationOutcomes = Object.freeze(
  outcomeDefinitions.map(
    ([name, terminal, readinessEffect], index) => Object.freeze({
      id: `WS-4:4/Outcome/${String(index + 1).padStart(2, "0")}`,
      name,
      meaning: `${name} validation outcome.`,
      terminal,
      readinessEffect,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const DecisionWorkspaceValidationSeverities = Object.freeze(
  ["Informational", "Low", "Medium", "High", "Critical"].map(
    (name, index) => Object.freeze({
      id: `WS-4:4/Severity/${String(index + 1).padStart(2, "0")}`,
      name,
      meaning: `Describes ${name.toLowerCase()} architectural importance.`,
      blocksReadiness: name === "Critical",
      order: index + 1,
      executableErrorHandling: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
