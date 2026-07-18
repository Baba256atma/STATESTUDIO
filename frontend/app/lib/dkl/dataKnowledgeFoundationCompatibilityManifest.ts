/**
 * DKL-1:5 — Compatibility Manifest.
 *
 * Immutable compatibility declaration for the DKL Foundation manifest. Declares
 * compatibility with every earlier phase and the architectural guarantees the
 * manifest certifies. Metadata only — no runtime behavior.
 */

import type { DataKnowledgeCompatibilityManifestDescriptor } from "./dataKnowledgeFoundationManifestTypes.ts";

export const DataKnowledgeFoundationCompatibilityManifest = Object.freeze({
  compatibleWith: Object.freeze({
    foundation: true,
    registry: true,
    model: true,
    validation: true,
  }),
  guarantees: Object.freeze({
    metadataOnly: true,
    runtimeFree: true,
    deepFrozen: true,
    deterministic: true,
    publicApiStable: true,
    ownershipProtected: true,
    dependencyProtected: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgeCompatibilityManifestDescriptor);
