import { ExecutiveOperationsSuiteRegistryManifest, ExecutiveOperationsSuiteRegistryMetadata } from "./executiveOperationsSuiteRegistryIndex.ts";
import type { ExecutiveOperationsSuiteValidationCategory, ExecutiveOperationsSuiteValidationRegistryEntry, ExecutiveOperationsSuiteValidationSeverity, ExecutiveOperationsSuiteValidationStatusDescriptor } from "./executiveOperationsSuiteValidationTypes.ts";

export const ExecutiveOperationsSuiteValidationId = "executive-operations-suite-validation" as const;
export const ExecutiveOperationsSuiteValidationName = "Executive Operations Suite Validation" as const;
export const ExecutiveOperationsSuiteValidationDescription = "Metadata-only validation rule catalog for the complete Executive Operations Suite registry." as const;
export const ExecutiveOperationsSuiteValidationVersion = "1.0.0" as const;
export const ExecutiveOperationsSuiteValidationNamespace = "nexora.ops.suite.validation" as const;
export const ExecutiveOperationsSuiteValidationStatus = Object.freeze({
  metadataOnly: true, phase: "Validation", immutable: true, deterministic: true,
  visibility: "Public", releaseStatus: "Draft",
} as const satisfies ExecutiveOperationsSuiteValidationStatusDescriptor);

export const ExecutiveOperationsSuiteValidationCategories = Object.freeze([
  "registry", "platform", "phase", "foundation", "manifest", "metadata", "publicApi",
  "dependency", "compatibility", "immutability", "architecture",
] as const satisfies readonly ExecutiveOperationsSuiteValidationCategory[]);
export const ExecutiveOperationsSuiteValidationSeverities = Object.freeze(["info", "warning", "error", "critical"] as const satisfies readonly ExecutiveOperationsSuiteValidationSeverity[]);

const rule = (id: string, name: string, category: ExecutiveOperationsSuiteValidationCategory, severity: ExecutiveOperationsSuiteValidationSeverity, appliesTo: string, description: string) => Object.freeze({
  id, name, category, severity, appliesTo, description, status: "Defined", sourcePhase: "OPS-10:2",
  metadataOnly: true, deterministic: true, immutable: true,
} as const satisfies ExecutiveOperationsSuiteValidationRegistryEntry);

export const ExecutiveOperationsSuiteValidationRegistry = Object.freeze([
  rule("suite-platform-count", "Platform Count Equals Nine", "platform", "critical", "platform registry", "Describes the canonical nine-platform inventory requirement."),
  rule("suite-phase-count", "Phase Count Equals Nine", "phase", "critical", "phase registry", "Describes the canonical nine-phase inventory requirement."),
  rule("suite-platform-ids-unique", "Unique Platform IDs", "platform", "critical", "platform registry", "Describes unique canonical platform identifiers."),
  rule("suite-phase-ids-unique", "Unique Phase IDs", "phase", "critical", "phase registry", "Describes unique canonical phase identifiers."),
  rule("suite-phase-order", "Canonical Phase Ordering", "dependency", "error", "phase registry", "Describes OPS-1 through OPS-9 ordering."),
  rule("suite-platform-order", "Canonical Platform Ordering", "platform", "error", "platform registry", "Describes platform order aligned to phase order."),
  rule("suite-foundation-mappings", "Foundation Mapping Integrity", "foundation", "error", "foundation section map", "Describes registry-to-foundation section mappings."),
  rule("suite-registry-consistency", "Registry Consistency", "registry", "critical", "registry manifest", "Describes consistent platform and phase inventories."),
  rule("suite-public-api-complete", "Public API Completeness", "publicApi", "error", "registry public index", "Describes the approved stable registry surface."),
  rule("suite-metadata-complete", "Metadata Completeness", "metadata", "error", "registry metadata", "Describes complete registry identity and status metadata."),
  rule("suite-manifest-consistent", "Manifest Consistency", "manifest", "critical", "registry manifest", "Describes internally consistent manifest counts and maps."),
  rule("suite-boundary-compliance", "Architectural Boundary Compliance", "architecture", "critical", "suite architecture", "Describes metadata-only architectural boundaries."),
  rule("suite-registry-immutable", "Immutable Registry", "immutability", "critical", "registry exports", "Describes frozen registry structures and entries."),
  rule("suite-manifest-immutable", "Immutable Manifest", "immutability", "critical", "registry manifest", "Describes a frozen registry manifest."),
  rule("suite-public-dependencies", "Public-only Dependency Policy", "dependency", "critical", "OPS-10:2 imports", "Describes exclusive consumption through public indices."),
  rule("suite-duplicates-rejected", "Duplicate Registration Policy", "registry", "error", "registry policy", "Describes rejection of duplicate platform and phase IDs."),
  rule("suite-lookups-deterministic", "Deterministic Lookup Policy", "registry", "error", "lookup helpers", "Describes exact case-sensitive deterministic lookups."),
  rule("suite-missing-lookup", "Missing Lookup Returns Undefined", "registry", "warning", "lookup helpers", "Describes non-throwing missing lookup behavior."),
  rule("suite-compatibility-mappings", "Compatibility Mapping Integrity", "compatibility", "critical", "OPS-7 and OPS-9 mappings", "Describes canonical dependency and monitoring mappings."),
  rule("suite-public-exports-stable", "Public Export Stability", "publicApi", "error", "registry public index", "Describes a restricted stable public export surface."),
  rule("suite-no-mutation-api", "No Mutation APIs", "architecture", "critical", "registry public API", "Describes absence of registration mutation functions."),
  rule("suite-no-runtime-services", "No Runtime Services", "architecture", "critical", "suite validation layer", "Describes absence of operational runtime services."),
  rule("suite-release-prerequisite", "Release Readiness Prerequisite", "metadata", "info", "future suite phases", "Describes registry completeness as a release prerequisite."),
] as const);

export const ExecutiveOperationsSuiteValidationMetadata = Object.freeze({
  id: ExecutiveOperationsSuiteValidationId, name: ExecutiveOperationsSuiteValidationName,
  description: ExecutiveOperationsSuiteValidationDescription, version: ExecutiveOperationsSuiteValidationVersion,
  namespace: ExecutiveOperationsSuiteValidationNamespace, status: ExecutiveOperationsSuiteValidationStatus,
  sourceRegistryId: ExecutiveOperationsSuiteRegistryMetadata.id,
  sourceRegistryVersion: ExecutiveOperationsSuiteRegistryMetadata.version,
  coveredPlatformCount: ExecutiveOperationsSuiteRegistryManifest.platformCount,
  coveredPhaseCount: ExecutiveOperationsSuiteRegistryManifest.phaseCount,
  validationCount: ExecutiveOperationsSuiteValidationRegistry.length,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
