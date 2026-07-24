/** WS-7:4 — Immutable Validation outcome vocabulary. */
const definitions = Object.freeze([
  ["Pass", true, "Permits readiness"],
  ["PassWithWarnings", true, "Permits readiness with warnings"],
  ["Fail", true, "Blocks readiness"],
  ["Blocked", false, "Blocks readiness"],
] as const);

export const DecisionWorkspaceV7ValidationOutcomes = Object.freeze(
  definitions.map(([name, terminal, readinessEffect], index) =>
    Object.freeze({
      id: `WS-7:4/Outcome/${String(index + 1).padStart(2, "0")}`,
      name,
      description: `${name} architectural validation outcome.`,
      terminal,
      readinessEffect,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
