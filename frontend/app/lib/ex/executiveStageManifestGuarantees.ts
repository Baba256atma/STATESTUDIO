/**
 * EX-1:5 — Executive Stage Manifest Guarantees.
 *
 * Explicit Stage guarantees published by the Manifest.
 *
 * Ownership: owned exclusively by EX-1:5.
 */

/** Guarantee declaration. */
export interface ExecutiveStageManifestGuarantee {
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
): ExecutiveStageManifestGuarantee =>
  Object.freeze({
    guaranteeId: `EX-1:5/Guarantee/${String(order).padStart(2, "0")}`,
    name,
    description,
    order,
    enforceableAtManifest: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight Stage guarantees. */
export const ExecutiveStageManifestGuarantees = Object.freeze([
  guarantee(
    "Runtime-driven projection",
    "The Stage projects Runtime state and never owns business state.",
    1,
  ),
  guarantee(
    "Immutable visual identities",
    "Visual identities never change after registration.",
    2,
  ),
  guarantee(
    "Canonical layer ordering",
    "Canonical Stage layer order remains fixed.",
    3,
  ),
  guarantee(
    "Deterministic structure",
    "Stage structure is deterministic and immutable.",
    4,
  ),
  guarantee(
    "Runtime compatibility",
    "Stage remains compatible with the Executive Context Runtime.",
    5,
  ),
  guarantee(
    "Accessibility foundation",
    "Stage architecture preserves an accessibility foundation.",
    6,
  ),
  guarantee(
    "Responsive architecture",
    "Stage architecture supports responsive presentation.",
    7,
  ),
  guarantee(
    "Forward-compatible extension",
    "Extension preserves existing identities and ownership hierarchy.",
    8,
  ),
] as const);

export const ExecutiveStageManifestGuaranteeNames = Object.freeze([
  "Runtime-driven projection",
  "Immutable visual identities",
  "Canonical layer ordering",
  "Deterministic structure",
  "Runtime compatibility",
  "Accessibility foundation",
  "Responsive architecture",
  "Forward-compatible extension",
] as const);
