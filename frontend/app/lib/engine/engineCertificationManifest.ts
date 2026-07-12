import { ExecutiveEngineCertificationMetadata, ExecutiveEngineCertificationRegistry } from "./engineCertificationRegistry.ts";
import { ExecutiveEngineCertificationSummary } from "./engineCertificationSummary.ts";
import type { ExecutiveEngineCertificationManifestDescriptor } from "./engineCertificationTypes.ts";

export const ExecutiveEngineCertificationManifest = Object.freeze({
  artifactId: "ENG-CERT-MANIFEST-001",
  certificationRegistry: ExecutiveEngineCertificationRegistry,
  certificationGateResults: ExecutiveEngineCertificationRegistry,
  certificationCounts: Object.freeze({ total: ExecutiveEngineCertificationSummary.totalCertificationGates,
    passed: ExecutiveEngineCertificationSummary.passedGates, failed: ExecutiveEngineCertificationSummary.failedGates }),
  complianceSummaries: Object.freeze({ ownership: ExecutiveEngineCertificationSummary.ownershipCompliance,
    dependency: ExecutiveEngineCertificationSummary.dependencyCompliance,
    antiDuplication: ExecutiveEngineCertificationSummary.antiDuplicationCompliance,
    publicApi: ExecutiveEngineCertificationSummary.publicApiCompliance }),
  readinessStatus: ExecutiveEngineCertificationSummary.releaseReadiness,
  certificationMetadata: ExecutiveEngineCertificationMetadata,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineCertificationManifestDescriptor);

export const getExecutiveEngineCertificationManifest = () => ExecutiveEngineCertificationManifest;
