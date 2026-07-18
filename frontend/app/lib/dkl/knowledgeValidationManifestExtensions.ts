/**
 * DKL-5:5 — Knowledge Validation Manifest Extensions.
 *
 * Aggregated immutable controlled extension declarations for DKL-5. Additive,
 * explicit, versioned, backward-compatible. No mutable runtime registration.
 *
 * Ownership: owned exclusively by DKL-5:5.
 */

import type { ManifestExtensionEntry } from "./knowledgeValidationManifestTypes.ts";

const extension = (
  extensionId: string,
  subject: string,
): ManifestExtensionEntry =>
  Object.freeze({
    extensionId,
    subject,
    additive: true as const,
    explicit: true as const,
    versioned: true as const,
    backwardCompatible: true as const,
    mutableRuntimeRegistrationForbidden: true as const,
  });

const ENTRIES: readonly ManifestExtensionEntry[] = Object.freeze([
  extension("ext-validation-targets", "Validation targets"),
  extension("ext-validation-dimensions", "Validation dimensions"),
  extension("ext-quality-signals", "Quality signals"),
  extension("ext-statuses-outcomes", "Statuses and outcomes"),
  extension("ext-severities", "Severities"),
  extension("ext-evidence-types", "Evidence types"),
  extension("ext-finding-categories", "Finding categories"),
  extension("ext-issue-categories", "Issue categories"),
  extension("ext-conflict-types", "Conflict types"),
  extension("ext-ambiguity-types", "Ambiguity types"),
  extension("ext-limitation-types", "Limitation types"),
  extension("ext-trust-levels", "Trust levels"),
  extension("ext-model-descriptors", "Model descriptors"),
  extension("ext-validation-rules", "Validation rules"),
  extension("ext-consumer-readiness", "Consumer-readiness declarations"),
  extension("ext-executive-usability", "Executive-usability declarations"),
  extension("ext-compatibility-metadata", "Compatibility metadata"),
  extension("ext-manifest-inventory-categories", "Manifest inventory categories"),
]);

/** Canonical immutable Manifest extension declarations for DKL-5. */
export const KnowledgeValidationManifestExtensions = Object.freeze({
  extensionId: "DKL-5:5/ManifestExtensions",
  sourcePhase: "DKL-5:5" as const,
  owner: "DKL-5 Knowledge Validation Manifest",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  subjects: Object.freeze(ENTRIES.map((entry) => entry.subject)),
  policy: Object.freeze({
    additive: true,
    explicit: true,
    versioned: true,
    backwardCompatible: true,
    correctlyOwned: true,
    registered: true,
    revalidatedBeforeRelease: true,
    recertifiedBeforeRelease: true,
    mutableRuntimeRegistrationForbidden: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
