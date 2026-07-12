import { ExecutiveOperationsSuitePlatformNamespace, ExecutiveOperationsSuitePlatformVersion, getExecutiveOperationsSuitePlatformMetadata, getExecutiveOperationsSuitePlatformSummary } from "./executiveOperationsSuitePlatformIndex.ts";
import type { ExecutiveOperationsSuiteCertificationCategory, ExecutiveOperationsSuiteCertificationRegistryEntry, ExecutiveOperationsSuiteCertificationSeverity, ExecutiveOperationsSuiteCertificationStatusDescriptor } from "./executiveOperationsSuiteCertificationTypes.ts";

export const ExecutiveOperationsSuiteCertificationId = "executive-operations-suite-certification" as const;
export const ExecutiveOperationsSuiteCertificationName = "Executive Operations Suite Certification" as const;
export const ExecutiveOperationsSuiteCertificationDescription = "Immutable metadata-only certification gate catalog for the Executive Operations Suite." as const;
export const ExecutiveOperationsSuiteCertificationVersion = "1.0.0" as const;
export const ExecutiveOperationsSuiteCertificationNamespace = "nexora.ops.suite.certification" as const;
export const ExecutiveOperationsSuiteCertificationStatus = Object.freeze({
  metadataOnly: true, phase: "Certification", immutable: true, deterministic: true,
  visibility: "Public", releaseStatus: "Draft",
} as const satisfies ExecutiveOperationsSuiteCertificationStatusDescriptor);

const gate = (id: string, name: string, category: ExecutiveOperationsSuiteCertificationCategory, severity: ExecutiveOperationsSuiteCertificationSeverity, description: string, required = true) => Object.freeze({
  id, name, category, severity, description, required, status: "Satisfied",
  sourcePhase: "OPS-10:5", metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveOperationsSuiteCertificationRegistryEntry);

export const ExecutiveOperationsSuiteCertificationRegistry = Object.freeze([
  gate("suite-cert-foundation", "Foundation Complete", "foundation", "critical", "Describes availability of the suite foundation component."),
  gate("suite-cert-registry", "Registry Complete", "registry", "critical", "Describes availability of the suite registry component."),
  gate("suite-cert-validation", "Validation Complete", "validation", "critical", "Describes availability of the validation catalog."),
  gate("suite-cert-manifest", "Manifest Complete", "manifest", "critical", "Describes availability of the architectural manifest."),
  gate("suite-cert-platform", "Platform Complete", "platform", "critical", "Describes the complete six-section platform namespace."),
  gate("suite-cert-platform-count", "Platform Count", "inventory", "error", "Describes the canonical nine-platform count."),
  gate("suite-cert-phase-count", "Phase Count", "inventory", "error", "Describes the canonical nine-phase count."),
  gate("suite-cert-component-count", "Component Count", "inventory", "error", "Describes four platform components."),
  gate("suite-cert-validation-coverage", "Validation Coverage", "validation", "error", "Describes validation rule coverage inherited by the platform."),
  gate("suite-cert-metadata", "Metadata Completeness", "metadata", "critical", "Describes complete platform identity metadata."),
  gate("suite-cert-immutable", "Immutable Exports", "immutability", "critical", "Describes frozen platform exports."),
  gate("suite-cert-deterministic", "Deterministic Helpers", "determinism", "critical", "Describes deterministic helper references."),
  gate("suite-cert-public-api", "Public API Integrity", "publicApi", "critical", "Describes a restricted stable public API."),
  gate("suite-cert-architecture", "Architectural Compliance", "architecture", "critical", "Describes metadata-only architecture compliance."),
  gate("suite-cert-dependencies", "Dependency Integrity", "dependency", "error", "Describes canonical upstream dependency metadata."),
  gate("suite-cert-compatibility", "Compatibility Mappings", "compatibility", "error", "Describes dependency and monitoring compatibility mappings."),
  gate("suite-cert-namespace", "Namespace Integrity", "namespace", "critical", `Describes the canonical ${ExecutiveOperationsSuitePlatformNamespace} namespace.`),
  gate("suite-cert-platform-readiness", "Platform Readiness", "release", "critical", `Describes platform readiness ${getExecutiveOperationsSuitePlatformSummary().readiness}.`),
  gate("suite-cert-version", "Version Integrity", "metadata", "error", `Describes platform version ${ExecutiveOperationsSuitePlatformVersion}.`),
  gate("suite-cert-suite-complete", "Suite Completeness", "suite", "critical", "Describes complete suite aggregation readiness."),
] as const);

export const ExecutiveOperationsSuiteCertificationMetadata = Object.freeze({
  id: ExecutiveOperationsSuiteCertificationId, name: ExecutiveOperationsSuiteCertificationName,
  description: ExecutiveOperationsSuiteCertificationDescription, version: ExecutiveOperationsSuiteCertificationVersion,
  namespace: ExecutiveOperationsSuiteCertificationNamespace, status: ExecutiveOperationsSuiteCertificationStatus,
  sourcePlatformId: getExecutiveOperationsSuitePlatformMetadata().id,
  sourcePlatformVersion: getExecutiveOperationsSuitePlatformMetadata().version,
  platformReadiness: getExecutiveOperationsSuitePlatformSummary().readiness,
  gateCount: ExecutiveOperationsSuiteCertificationRegistry.length,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
