import { buildBusinessSuiteApiPolicyManifest } from "./businessSuiteApiPolicyIndex.ts";
import { buildBusinessSuiteArchitectureManifest } from "./businessSuiteArchitectureIndex.ts";
import { BusinessSuiteArchitectureCompatibility } from "./businessSuiteArchitectureCompatibility.ts";
import type {
  BusinessArchitectureCertification,
  BusinessArchitectureFreezeMetadata,
  BusinessArchitectureRelease,
} from "./businessSuiteArchitectureFreezeTypes.ts";

const architectureManifest = buildBusinessSuiteArchitectureManifest();

export const BUSINESS_ARCHITECTURE_FREEZE_METADATA: BusinessArchitectureFreezeMetadata = Object.freeze({
  freezePhaseId: "BUS-ARCH-6",
  architectureId: "BUS-ARCH",
  version: "1.0.0",
  purpose: "Immutable certification and freeze metadata for the Business Suite Architecture platform.",
  metadataOnly: true,
  immutable: true,
});

export const BUSINESS_ARCHITECTURE_IDENTITY = Object.freeze({
  architectureId: "BUS-ARCH" as const,
  architectureName: architectureManifest.metadata.architectureName,
  version: "1.0.0" as const,
});

export const BUSINESS_ARCHITECTURE_CERTIFIED_PHASES: readonly string[] = Object.freeze([
  "BUS-ARCH-1",
  "BUS-ARCH-2",
  "BUS-ARCH-3",
  "BUS-ARCH-4",
  "BUS-ARCH-5",
] as const);

export const BUSINESS_ARCHITECTURE_PUBLIC_API_REGISTRY: readonly string[] = Object.freeze([
  "BusinessSuiteArchitectureRegistry",
  "buildBusinessSuiteArchitectureManifest",
  "validateBusinessSuiteArchitecture",
  "BusinessSuiteBoundaryRegistry",
  "buildBusinessSuiteBoundaryManifest",
  "validateBusinessSuiteBoundary",
  "BusinessSuiteDependencyRegistry",
  "buildBusinessSuiteDependencyManifest",
  "validateBusinessSuiteDependencyMap",
  "BusinessSuiteApiPolicyRegistry",
  "buildBusinessSuiteApiPolicyManifest",
  "validateBusinessSuiteApiPolicy",
  "BusinessSuiteRoadmapRegistry",
  "buildBusinessSuiteRoadmapManifest",
  "validateBusinessSuiteRoadmap",
  "buildBusinessSuiteArchitectureFreezeManifest",
  "runBusinessSuiteArchitectureCertification",
  "runBusinessSuiteArchitectureRegression",
  "runBusinessSuiteArchitectureFreeze",
  "getBusinessSuiteArchitectureState",
  "BusinessSuiteArchitectureCompatibility",
] as const);

export const BUSINESS_ARCHITECTURE_EXTENSION_POLICY_REGISTRY: readonly string[] = Object.freeze(
  buildBusinessSuiteApiPolicyManifest().extensionPolicy.rules
);

export const BUSINESS_ARCHITECTURE_RELEASE_METADATA: BusinessArchitectureRelease = Object.freeze({
  releaseId: "bus-arch-certified-freeze",
  architectureId: "BUS-ARCH",
  architectureName: architectureManifest.metadata.architectureName,
  version: "1.0.0",
  releaseState: "Certified, Frozen, Released",
  releaseDateMetadata: "release-metadata-only",
  metadataOnly: true,
  immutable: true,
});

export const BUSINESS_ARCHITECTURE_CERTIFICATION_METADATA: BusinessArchitectureCertification = Object.freeze({
  certificationId: "bus-arch-certification-baseline",
  status: "PASS",
  gates: Object.freeze([
    "Architecture Identity",
    "Platform Registry",
    "Boundary Registry",
    "Dependency Registry",
    "Public API Registry",
    "Roadmap Registry",
    "Compatibility Matrix",
    "Extension Policy",
    "Manifest Integrity",
    "Public API Integrity",
    "Metadata Immutability",
    "Deterministic Fingerprint",
    "Regression Status",
    "Certification Status",
    "Freeze Status",
    "Release Metadata",
  ]),
  diagnostics: Object.freeze([]),
  metadataOnly: true,
  immutable: true,
});

export const BusinessSuiteArchitectureFreezeRegistry = Object.freeze({
  metadata: BUSINESS_ARCHITECTURE_FREEZE_METADATA,
  architectureIdentity: BUSINESS_ARCHITECTURE_IDENTITY,
  certifiedPhases: BUSINESS_ARCHITECTURE_CERTIFIED_PHASES,
  certificationMetadata: BUSINESS_ARCHITECTURE_CERTIFICATION_METADATA,
  releaseMetadata: BUSINESS_ARCHITECTURE_RELEASE_METADATA,
  publicApiRegistry: BUSINESS_ARCHITECTURE_PUBLIC_API_REGISTRY,
  extensionPolicyRegistry: BUSINESS_ARCHITECTURE_EXTENSION_POLICY_REGISTRY,
  compatibilityRegistry: BusinessSuiteArchitectureCompatibility,
});
