/**
 * DKL-5:5 — Knowledge Validation Manifest Compatibility.
 *
 * Aggregated immutable compatibility declarations for DKL-5. Declarative only —
 * no runtime compatibility negotiation.
 *
 * Ownership: owned exclusively by DKL-5:5.
 */

import type { ManifestCompatibilityEntry } from "./knowledgeValidationManifestTypes.ts";

const compat = (
  compatibilityId: string,
  subject: string,
  status: string,
  description: string,
): ManifestCompatibilityEntry =>
  Object.freeze({ compatibilityId, subject, status, description });

const ENTRIES: readonly ManifestCompatibilityEntry[] = Object.freeze([
  compat(
    "compat-dkl4-public-index",
    "DKL-4 upstream public index",
    "Compatible",
    "DKL-5 consumes DKL-4 only through the approved Knowledge Modeling Public Index.",
  ),
  compat(
    "compat-dkl-5-1-foundation",
    "DKL-5 Foundation",
    "Compatible",
    "Foundation contracts are stable and additive-compatible.",
  ),
  compat(
    "compat-dkl-5-2-registry",
    "DKL-5 Registry",
    "Compatible",
    "Registry identities and ordering are stable and additive-compatible.",
  ),
  compat(
    "compat-dkl-5-3-model",
    "DKL-5 Model",
    "Compatible",
    "Model contracts are stable and additive-compatible.",
  ),
  compat(
    "compat-dkl-5-4-validation",
    "DKL-5 Validation",
    "Compatible",
    "Validation rules and results are stable and additive-compatible.",
  ),
  compat(
    "compat-dkl-5-6-platform",
    "Future DKL-5:6 Platform",
    "ForwardCompatible",
    "Manifest metadata is forward-compatible with Platform composition.",
  ),
  compat(
    "compat-dkl-5-7-certification",
    "Future DKL-5:7 Certification",
    "ForwardCompatible",
    "Manifest metadata is forward-compatible with Certification.",
  ),
  compat(
    "compat-dkl-5-8-freeze",
    "Future DKL-5:8 Freeze",
    "ForwardCompatible",
    "Manifest metadata is forward-compatible with Freeze.",
  ),
  compat(
    "compat-dkl-5-9-public-index",
    "Future DKL-5:9 Public Index",
    "ForwardCompatible",
    "Manifest metadata is forward-compatible with the DKL-5 Public Index.",
  ),
  compat(
    "compat-downstream-consumer",
    "Approved downstream consumers",
    "Restricted",
    "Executive Engine and future services remain restricted downstream consumers.",
  ),
  compat(
    "compat-status-meanings",
    "Status meanings",
    "Stable",
    "Validation status meanings are stable across versions.",
  ),
  compat(
    "compat-severity-meanings",
    "Severity meanings",
    "Stable",
    "Severity meanings are stable across versions.",
  ),
  compat(
    "compat-quality-signal-meanings",
    "Quality-signal meanings",
    "Stable",
    "Quality-signal meanings are stable across versions.",
  ),
  compat(
    "compat-trust-level-meanings",
    "Trust-level meanings",
    "Stable",
    "Trust-level meanings are stable across versions.",
  ),
  compat(
    "compat-additive-extension",
    "Additive extension",
    "AdditiveAllowed",
    "Extensions remain additive and backward-compatible.",
  ),
  compat(
    "compat-public-api-stability",
    "Public API stability",
    "Stable",
    "Each DKL-5 phase publishes exactly eight stable public APIs.",
  ),
]);

/** Canonical immutable Manifest compatibility declarations for DKL-5. */
export const KnowledgeValidationManifestCompatibility = Object.freeze({
  compatibilityId: "DKL-5:5/ManifestCompatibility",
  sourcePhase: "DKL-5:5" as const,
  owner: "DKL-5 Knowledge Validation Manifest",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  subjects: Object.freeze(ENTRIES.map((entry) => entry.subject)),
  runtimeNegotiationForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
