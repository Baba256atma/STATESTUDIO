/** WS-10:7 — Immutable Certification outcome vocabulary. */
const names = Object.freeze([
  "Certified",
  "CertifiedWithWarnings",
  "NotCertified",
  "Blocked",
] as const);

export const TimelineWorkspaceCertificationOutcomes = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-10:7/Outcome/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
