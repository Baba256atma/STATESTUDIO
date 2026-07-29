/**
 * RTC-1:5 — Executive Context Manifest Guarantees.
 *
 * Explicit Runtime guarantees published by the Manifest.
 *
 * Ownership: owned exclusively by RTC-1:5.
 */

/** Guarantee declaration. */
export interface ExecutiveContextManifestGuarantee {
  readonly guaranteeId: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly enforceableAtManifest: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const guarantee = (
  name: string,
  description: string,
  order: number,
): ExecutiveContextManifestGuarantee =>
  Object.freeze({
    guaranteeId: `RTC-1:5/Guarantee/${String(order).padStart(2, "0")}`,
    name,
    description,
    order,
    enforceableAtManifest: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight Runtime guarantees. */
export const ExecutiveContextManifestGuarantees = Object.freeze([
  guarantee(
    "Single active Executive Context",
    "Exactly one Executive Context may be active.",
    1,
  ),
  guarantee(
    "Immutable identities",
    "Runtime identities never change after creation.",
    2,
  ),
  guarantee(
    "Deterministic model",
    "The Runtime Model is deterministic and immutable.",
    3,
  ),
  guarantee(
    "Deterministic validation",
    "Validation evaluation is deterministic for the same input.",
    4,
  ),
  guarantee(
    "Stable lifecycle",
    "Lifecycle vocabulary and transitions remain stable.",
    5,
  ),
  guarantee(
    "Structured metadata",
    "Runtime metadata remains structured and immutable.",
    6,
  ),
  guarantee(
    "Reproducible snapshots",
    "Context snapshots remain reproducible.",
    7,
  ),
  guarantee(
    "Forward-compatible extension",
    "Extension preserves existing identities and ownership hierarchy.",
    8,
  ),
] as const);

export const ExecutiveContextManifestGuaranteeNames = Object.freeze([
  "Single active Executive Context",
  "Immutable identities",
  "Deterministic model",
  "Deterministic validation",
  "Stable lifecycle",
  "Structured metadata",
  "Reproducible snapshots",
  "Forward-compatible extension",
] as const);
