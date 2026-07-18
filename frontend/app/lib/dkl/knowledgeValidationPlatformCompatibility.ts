/**
 * DKL-5:6 — Knowledge Validation Platform Compatibility & Extensions.
 *
 * Immutable compatibility and controlled extension declarations.
 * Metadata only. No negotiation, no version resolution, no mutation.
 *
 * Ownership: owned exclusively by DKL-5:6.
 */

import type {
  PlatformCompatibilityEntry,
  PlatformExtensionEntry,
} from "./knowledgeValidationPlatformTypes.ts";

const compat = (
  compatibilityId: string,
  subject: string,
  status: PlatformCompatibilityEntry["status"],
  description: string,
): PlatformCompatibilityEntry =>
  Object.freeze({ compatibilityId, subject, status, description });

const extension = (
  extensionId: string,
  subject: string,
  ownedBy: string,
): PlatformExtensionEntry =>
  Object.freeze({
    extensionId,
    subject,
    ownedBy,
    additive: true as const,
    explicit: true as const,
    versioned: true as const,
    backwardCompatible: true as const,
    mutableRuntimeRegistrationForbidden: true as const,
  });

const COMPATIBILITY: readonly PlatformCompatibilityEntry[] = Object.freeze([
  compat(
    "compat-dkl4-public-index",
    "DKL-4 Knowledge Modeling Public Index",
    "Compatible",
    "DKL-5 reaches DKL-4 only through the approved Knowledge Modeling Public Index.",
  ),
  compat(
    "compat-dkl-5-1-foundation",
    "DKL-5:1 Foundation",
    "Compatible",
    "Platform foundation section references DKL-5:1 public entry by identity.",
  ),
  compat(
    "compat-dkl-5-2-registry",
    "DKL-5:2 Registry",
    "Compatible",
    "Platform registry section references DKL-5:2 public entry by identity.",
  ),
  compat(
    "compat-dkl-5-3-model",
    "DKL-5:3 Model",
    "Compatible",
    "Platform model section references DKL-5:3 public entry by identity.",
  ),
  compat(
    "compat-dkl-5-4-validation",
    "DKL-5:4 Validation",
    "Compatible",
    "Platform validation section references DKL-5:4 public entry by identity.",
  ),
  compat(
    "compat-dkl-5-5-manifest",
    "DKL-5:5 Manifest",
    "Compatible",
    "Platform manifest section references DKL-5:5 public entry by identity.",
  ),
  compat(
    "compat-dkl-5-7-certification",
    "DKL-5:7 Certification",
    "ForwardCompatible",
    "Platform metadata is intended for Certification without schema rename.",
  ),
  compat(
    "compat-dkl-5-8-freeze",
    "DKL-5:8 Freeze",
    "ForwardCompatible",
    "Platform composition is freeze-ready after Certification.",
  ),
  compat(
    "compat-dkl-5-9-public-index",
    "DKL-5:9 Public Index",
    "ForwardCompatible",
    "Platform public surface is intended for Public Index publication.",
  ),
  compat(
    "compat-future-repository",
    "Future Knowledge Repository",
    "ForwardCompatible",
    "Platform metadata may be consumed by future repository layers.",
  ),
  compat(
    "compat-future-services",
    "Future Knowledge Services",
    "ForwardCompatible",
    "Platform metadata may be consumed by future knowledge services.",
  ),
  compat(
    "compat-executive-engine",
    "Executive Engine restricted consumption",
    "Restricted",
    "Executive Engine may consume Platform metadata only; no runtime APIs exist.",
  ),
  compat(
    "compat-advisor-contracts",
    "Advisor integration contracts",
    "Restricted",
    "Advisor may consume declarations later; Advisor behavior is not owned here.",
  ),
  compat(
    "compat-scene-contracts",
    "Scene integration contracts",
    "Restricted",
    "Scene may consume declarations later; Scene rendering is not owned here.",
  ),
  compat(
    "compat-status-meanings",
    "Stable validation status meanings",
    "Compatible",
    "Validation status meanings remain stable across versions.",
  ),
  compat(
    "compat-severity-meanings",
    "Stable severity meanings",
    "Compatible",
    "Severity meanings remain stable across versions.",
  ),
  compat(
    "compat-quality-signal-meanings",
    "Stable quality-signal meanings",
    "Compatible",
    "Quality-signal meanings remain stable across versions.",
  ),
  compat(
    "compat-trust-level-meanings",
    "Stable trust-level meanings",
    "Compatible",
    "Trust-level meanings remain stable across versions.",
  ),
  compat(
    "compat-additive-extension",
    "Additive extension compatibility",
    "Compatible",
    "Extensions remain additive and backward-compatible.",
  ),
  compat(
    "compat-public-api-stability",
    "Public API stability",
    "Compatible",
    "Each DKL-5 phase publishes exactly eight stable public APIs.",
  ),
]);

const EXTENSIONS: readonly PlatformExtensionEntry[] = Object.freeze([
  extension("ext-validation-targets", "Validation targets", "DKL-5:1"),
  extension("ext-validation-dimensions", "Validation dimensions", "DKL-5:1"),
  extension("ext-quality-signals", "Quality signals", "DKL-5:1"),
  extension("ext-statuses-outcomes", "Statuses and outcomes", "DKL-5:1"),
  extension("ext-severities", "Severities", "DKL-5:1"),
  extension("ext-evidence-types", "Evidence types", "DKL-5:2"),
  extension("ext-finding-categories", "Finding categories", "DKL-5:2"),
  extension("ext-issue-categories", "Issue categories", "DKL-5:2"),
  extension("ext-conflict-types", "Conflict types", "DKL-5:2"),
  extension("ext-ambiguity-types", "Ambiguity types", "DKL-5:2"),
  extension("ext-limitation-types", "Limitation types", "DKL-5:2"),
  extension("ext-trust-levels", "Trust levels", "DKL-5:2"),
  extension("ext-model-descriptors", "Model descriptors", "DKL-5:3"),
  extension("ext-validation-rules", "Validation rules", "DKL-5:4"),
  extension("ext-consumer-readiness", "Consumer-readiness states", "DKL-5:3"),
  extension(
    "ext-executive-usability",
    "Executive-usability capabilities",
    "DKL-5:3",
  ),
  extension("ext-compatibility-declarations", "Compatibility declarations", "DKL-5:1"),
  extension(
    "ext-manifest-inventory-categories",
    "Manifest inventory categories",
    "DKL-5:5",
  ),
]);

/** Canonical immutable Platform compatibility declarations. */
export const KnowledgeValidationPlatformCompatibility = Object.freeze({
  compatibilityId: "DKL-5:6/PlatformCompatibility",
  sourcePhase: "DKL-5:6" as const,
  owner: "DKL-5 Knowledge Validation Platform",
  entries: COMPATIBILITY,
  entryCount: COMPATIBILITY.length,
  subjects: Object.freeze(COMPATIBILITY.map((entry) => entry.subject)),
  runtimeNegotiationForbidden: true,
  versionResolutionForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Canonical immutable Platform extension declarations. */
export const KnowledgeValidationPlatformExtensions = Object.freeze({
  extensionId: "DKL-5:6/PlatformExtensions",
  sourcePhase: "DKL-5:6" as const,
  owner: "DKL-5 Knowledge Validation Platform",
  entries: EXTENSIONS,
  entryCount: EXTENSIONS.length,
  subjects: Object.freeze(EXTENSIONS.map((entry) => entry.subject)),
  policy: Object.freeze({
    additive: true,
    explicit: true,
    versioned: true,
    backwardCompatible: true,
    ownedByOriginatingPhase: true,
    registeredThroughCorrectRegistry: true,
    revalidatedBeforeRelease: true,
    recertifiedBeforeRelease: true,
    refrozenBeforePublicRelease: true,
    mutableRuntimeRegistrationForbidden: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
