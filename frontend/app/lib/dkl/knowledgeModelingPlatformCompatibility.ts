/**
 * DKL-4:6 — Knowledge Modeling Platform Compatibility & Extensions.
 *
 * Immutable compatibility and controlled extension declarations.
 * Metadata only. No negotiation, no version resolution, no mutation.
 *
 * Ownership: owned exclusively by DKL-4:6.
 */

import type {
  PlatformCompatibilityEntry,
  PlatformExtensionEntry,
} from "./knowledgeModelingPlatformTypes.ts";

const compat = (
  compatibilityId: string,
  name: string,
  status: PlatformCompatibilityEntry["status"],
  description: string,
): PlatformCompatibilityEntry =>
  Object.freeze({ compatibilityId, name, status, description });

const ext = (
  extensionId: string,
  name: string,
  ownedBy: string,
  description: string,
): PlatformExtensionEntry =>
  Object.freeze({
    extensionId,
    name,
    status: "AdditiveAllowed" as const,
    ownedBy,
    description,
    platformMutableRegistration: false as const,
  });

const COMPATIBILITY: readonly PlatformCompatibilityEntry[] = Object.freeze([
  compat(
    "COMPAT-FND",
    "DKL-4:1 Foundation Compatibility",
    "Compatible",
    "Platform foundation section references DKL-4:1 public entry by identity.",
  ),
  compat(
    "COMPAT-REG",
    "DKL-4:2 Registry Compatibility",
    "Compatible",
    "Platform registry section references DKL-4:2 public entry by identity.",
  ),
  compat(
    "COMPAT-MDL",
    "DKL-4:3 Model Compatibility",
    "Compatible",
    "Platform model section references DKL-4:3 public entry by identity.",
  ),
  compat(
    "COMPAT-VAL",
    "DKL-4:4 Validation Compatibility",
    "Compatible",
    "Platform validation section references DKL-4:4 public entry by identity.",
  ),
  compat(
    "COMPAT-MNF",
    "DKL-4:5 Manifest Compatibility",
    "Compatible",
    "Platform manifest section references DKL-4:5 public entry by identity.",
  ),
  compat(
    "COMPAT-DKL3-UPSTREAM",
    "DKL-3 Upstream-Reference Compatibility",
    "Compatible",
    "DKL-3 is reached only through Foundation upstream metadata; never imported directly.",
  ),
  compat(
    "COMPAT-CERT",
    "Future DKL-4:7 Certification Compatibility",
    "ForwardCompatible",
    "Platform metadata is intended for Certification without schema rename.",
  ),
  compat(
    "COMPAT-FREEZE",
    "Future DKL-4:8 Freeze Compatibility",
    "ForwardCompatible",
    "Platform composition is freeze-ready after Certification.",
  ),
  compat(
    "COMPAT-PUBLIC-INDEX",
    "Future DKL-4:9 Public Index Compatibility",
    "ForwardCompatible",
    "Platform public surface is intended for Public Index publication.",
  ),
  compat(
    "COMPAT-ENGINE",
    "Executive Engine Consumer Compatibility",
    "Restricted",
    "Engine may consume Platform metadata only; no runtime modeling APIs exist.",
  ),
  compat(
    "COMPAT-RUNTIME-FORBIDDEN",
    "Runtime Behavior Compatibility Forbidden",
    "Forbidden",
    "Platform must never claim runtime Knowledge Object or Business Object construction.",
  ),
]);

const EXTENSIONS: readonly PlatformExtensionEntry[] = Object.freeze([
  ext(
    "EXT-MODEL-DESCRIPTORS",
    "New Knowledge Model descriptors",
    "DKL-4:3",
    "Additive model descriptors owned by the Model phase.",
  ),
  ext(
    "EXT-BO-CATEGORIES",
    "New registered Business Object categories",
    "DKL-4:2",
    "Additive Business Object categories owned by the Registry phase.",
  ),
  ext(
    "EXT-REL-CATEGORIES",
    "New registered relationship categories",
    "DKL-4:2",
    "Additive relationship categories owned by the Registry phase.",
  ),
  ext(
    "EXT-SEMANTIC-STRUCTURE",
    "New semantic structure descriptors",
    "DKL-4:3",
    "Additive semantic structure descriptors owned by the Model phase.",
  ),
  ext(
    "EXT-COMPAT-DECLS",
    "New compatibility declarations",
    "DKL-4:1",
    "Additive compatibility declarations owned by the Foundation phase.",
  ),
  ext(
    "EXT-VALIDATION-RULES",
    "New validation rules",
    "DKL-4:4",
    "Additive validation rules owned by the Validation phase.",
  ),
  ext(
    "EXT-MANIFEST-INVENTORY",
    "New manifest inventory categories",
    "DKL-4:5",
    "Additive inventory categories owned by the Manifest phase.",
  ),
]);

/** Canonical immutable Platform compatibility declarations. */
export const KnowledgeModelingPlatformCompatibility = Object.freeze({
  compatibilityId: "DKL-4:6/PlatformCompatibility",
  sourcePhase: "DKL-4:6" as const,
  entries: COMPATIBILITY,
  entryCount: COMPATIBILITY.length,
  runtimeCompatibilityLogic: false,
  versionNegotiationForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Canonical immutable Platform extension declarations. */
export const KnowledgeModelingPlatformExtensions = Object.freeze({
  extensionId: "DKL-4:6/PlatformExtensions",
  sourcePhase: "DKL-4:6" as const,
  entries: EXTENSIONS,
  entryCount: EXTENSIONS.length,
  additiveOnly: true,
  explicitOwnershipRequired: true,
  versioned: true,
  mutableRegistrationForbidden: true,
  platformDoesNotOwnUpstreamExtensions: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
