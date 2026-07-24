/** WS-5:7 — Immutable Certification result vocabulary. */
const definitions = Object.freeze([
  ["Pass", true, "Permits readiness"],
  ["Fail", true, "Blocks readiness"],
  ["Warning", false, "Requires review"],
  ["NotApplicable", true, "No readiness effect"],
] as const);

export const ScenarioWorkspaceCertificationResults = Object.freeze(
  definitions.map(
    ([name, terminalState, readinessEffect], index) => Object.freeze({
      id: `WS-5:7/Result/${String(index + 1).padStart(2, "0")}`,
      name,
      description: `${name} certification result.`,
      terminalState,
      readinessEffect,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
