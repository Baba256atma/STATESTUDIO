/** WS-7:7 — Immutable Certification outcome vocabulary. */
const names = Object.freeze([
  "Certified",
  "CertifiedWithWarnings",
  "NotCertified",
  "Blocked",
] as const);

export const DecisionWorkspaceV7CertificationOutcomes = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:7/Outcome/${String(index + 1).padStart(2, "0")}`,
      name,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
