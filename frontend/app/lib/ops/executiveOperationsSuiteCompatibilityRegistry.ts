import { ExecutiveOperationsSuiteCertificationVersion, getExecutiveOperationsSuiteCertificationMetadata, getExecutiveOperationsSuiteCertificationSummary } from "./executiveOperationsSuiteCertificationIndex.ts";
import type { ExecutiveOperationsSuiteCompatibilityMatrixEntry, ExecutiveOperationsSuiteCompatibilityRegistryEntry, ExecutiveOperationsSuiteCompatibilityStatusDescriptor, ExecutiveOperationsSuiteRegressionEntry } from "./executiveOperationsSuiteCompatibilityTypes.ts";

export const ExecutiveOperationsSuiteCompatibilityId = "executive-operations-suite-compatibility" as const;
export const ExecutiveOperationsSuiteCompatibilityName = "Executive Operations Suite Compatibility & Regression" as const;
export const ExecutiveOperationsSuiteCompatibilityDescription = "Immutable compatibility and regression coverage metadata for the Executive Operations Suite." as const;
export const ExecutiveOperationsSuiteCompatibilityVersion = "1.0.0" as const;
export const ExecutiveOperationsSuiteCompatibilityNamespace = "nexora.ops.suite.compatibility" as const;
export const ExecutiveOperationsSuiteCompatibilityStatus = Object.freeze({
  metadataOnly: true, phase: "Compatibility", immutable: true, deterministic: true,
  visibility: "Public", releaseStatus: "Draft",
} as const satisfies ExecutiveOperationsSuiteCompatibilityStatusDescriptor);

const compatibility = (id: string, name: string, category: string, description: string) => Object.freeze({
  id, name, category, description, status: "Compatible", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveOperationsSuiteCompatibilityRegistryEntry);
export const ExecutiveOperationsSuiteCompatibilityRegistry = Object.freeze([
  compatibility("suite-compat-foundation", "Foundation Compatibility", "Foundation", "Describes stable foundation compatibility."),
  compatibility("suite-compat-registry", "Registry Compatibility", "Registry", "Describes stable registry compatibility."),
  compatibility("suite-compat-validation", "Validation Compatibility", "Validation", "Describes stable validation metadata compatibility."),
  compatibility("suite-compat-manifest", "Manifest Compatibility", "Manifest", "Describes stable manifest compatibility."),
  compatibility("suite-compat-platform", "Platform Compatibility", "Platform", "Describes stable platform namespace compatibility."),
  compatibility("suite-compat-certification", "Certification Compatibility", "Certification", `Describes OPS-10:6 version ${ExecutiveOperationsSuiteCertificationVersion} compatibility.`),
  compatibility("suite-compat-public-api", "Public API Compatibility", "PublicApi", "Describes stable public API compatibility."),
  compatibility("suite-compat-dependencies", "Dependency Compatibility", "Dependencies", "Describes canonical dependency compatibility."),
  compatibility("suite-compat-namespaces", "Namespace Compatibility", "Namespaces", "Describes stable namespace compatibility."),
  compatibility("suite-compat-release", "Release Metadata Compatibility", "ReleaseMetadata", "Describes compatible release metadata."),
] as const);

const matrix = (id: string, source: string, target: string, order: number) => Object.freeze({
  id, source, target, order, relationship: "CompatibleWith", status: "Compatible", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveOperationsSuiteCompatibilityMatrixEntry);
export const ExecutiveOperationsSuiteCompatibilityMatrix = Object.freeze([
  matrix("ops-1-ops-2", "OPS-1", "OPS-2", 1), matrix("ops-2-ops-3", "OPS-2", "OPS-3", 2),
  matrix("ops-3-ops-4", "OPS-3", "OPS-4", 3), matrix("ops-4-ops-5", "OPS-4", "OPS-5", 4),
  matrix("ops-5-ops-6", "OPS-5", "OPS-6", 5), matrix("ops-6-ops-7", "OPS-6", "OPS-7", 6),
  matrix("ops-7-ops-8", "OPS-7", "OPS-8", 7), matrix("ops-8-ops-9", "OPS-8", "OPS-9", 8),
  matrix("ops-suite-public-api", "OPS Suite", "Public API", 9),
] as const);

const regression = (id: string, name: string, scope: string) => Object.freeze({
  id, name, scope, description: `Describes ${name.toLowerCase()} regression coverage.`,
  coverageStatus: "Covered", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveOperationsSuiteRegressionEntry);
export const ExecutiveOperationsSuiteRegressionInventory = Object.freeze([
  regression("suite-reg-foundation", "Foundation Stability", "Foundation"),
  regression("suite-reg-registry", "Registry Stability", "Registry"),
  regression("suite-reg-validation", "Validation Stability", "Validation"),
  regression("suite-reg-manifest", "Manifest Stability", "Manifest"),
  regression("suite-reg-platform", "Platform Stability", "Platform"),
  regression("suite-reg-certification", "Certification Stability", "Certification"),
  regression("suite-reg-public-api", "Public API Stability", "PublicApi"),
  regression("suite-reg-namespace", "Namespace Stability", "Namespace"),
  regression("suite-reg-dependency", "Dependency Stability", "Dependency"),
  regression("suite-reg-metadata", "Metadata Stability", "Metadata"),
  regression("suite-reg-compatibility", "Compatibility Stability", "Compatibility"),
  regression("suite-reg-release", "Release Stability", "Release"),
] as const);

export const ExecutiveOperationsSuiteCompatibilityMetadata = Object.freeze({
  id: ExecutiveOperationsSuiteCompatibilityId, name: ExecutiveOperationsSuiteCompatibilityName,
  description: ExecutiveOperationsSuiteCompatibilityDescription, version: ExecutiveOperationsSuiteCompatibilityVersion,
  namespace: ExecutiveOperationsSuiteCompatibilityNamespace, status: ExecutiveOperationsSuiteCompatibilityStatus,
  sourceCertificationId: getExecutiveOperationsSuiteCertificationMetadata().id,
  sourceCertificationStatus: getExecutiveOperationsSuiteCertificationSummary().certificationStatus,
  compatibilityEntryCount: ExecutiveOperationsSuiteCompatibilityRegistry.length,
  matrixEntryCount: ExecutiveOperationsSuiteCompatibilityMatrix.length,
  regressionEntryCount: ExecutiveOperationsSuiteRegressionInventory.length,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
