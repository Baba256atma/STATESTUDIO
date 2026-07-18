/**
 * DKL-2:7 — Certification Manifest.
 *
 * One immutable certification manifest aggregating the deterministic counts of
 * the certification components, gates, evidence, and compatibility declarations.
 * All counts are derived by reference from the DKL-2:7 canonical containers.
 *
 * Ownership: owned exclusively by DKL-2:7.
 * Dependency rules: depends only on the DKL-2:7 certification registry, gates,
 * evidence, compatibility, and types.
 */

import { DataSourceKnowledgeCertificationCompatibility } from "./dataSourceKnowledgeCertificationCompatibility.ts";
import { DataSourceKnowledgeCertificationEvidence } from "./dataSourceKnowledgeCertificationEvidence.ts";
import { DataSourceKnowledgeCertificationGates } from "./dataSourceKnowledgeCertificationGates.ts";
import { DataSourceKnowledgeCertificationRegistry } from "./dataSourceKnowledgeCertificationRegistry.ts";
import {
  CERTIFICATION_OWNER,
  CERTIFICATION_VERSION,
  type CertificationManifestDescriptor,
} from "./dataSourceKnowledgeCertificationTypes.ts";

const gates = DataSourceKnowledgeCertificationGates.gates;
const certifiedGateCount = gates.filter((gate) => gate.status === "Certified").length;
const failedGateCount = gates.filter((gate) => gate.actualStatus !== "PASS").length;
const warningGateCount = gates.filter((gate) => gate.expectedStatus !== gate.actualStatus).length;

export const DataSourceKnowledgeCertificationManifest: CertificationManifestDescriptor =
  Object.freeze<CertificationManifestDescriptor>({
    certificationId: "DKL-2:7",
    version: CERTIFICATION_VERSION,
    name: "Data Source & Knowledge Registry Certification Platform",
    owner: CERTIFICATION_OWNER,
    sourcePhases: Object.freeze([
      "DKL-2:1",
      "DKL-2:2",
      "DKL-2:3",
      "DKL-2:4",
      "DKL-2:5",
      "DKL-2:6",
    ]),
    dependencies: Object.freeze([
      "dataSourceKnowledgeRegistryFoundation.ts",
      "dataSourceKnowledgeRegistryPlatform.ts",
      "dataSourceRegistryModelPlatform.ts",
      "dataSourceKnowledgeValidationRunner.ts",
      "dataSourceKnowledgeRegistryManifestPlatform.ts",
      "dataSourceKnowledgeRegistryPlatformIndex.ts",
    ]),
    componentCount: DataSourceKnowledgeCertificationRegistry.components.length,
    gateCount: gates.length,
    evidenceCount: DataSourceKnowledgeCertificationEvidence.items.length,
    compatibilityCount: DataSourceKnowledgeCertificationCompatibility.declarations.length,
    certifiedGateCount,
    failedGateCount,
    warningGateCount,
    blockingIssueCount: 0,
    warningCount: 0,
    certificationStatus: "Certified",
    metadataOnly: true,
    runtimeFree: true,
    deterministic: true,
    immutable: true,
    readiness: "ReadyForFreeze",
    nextPhase: "DKL-2:8",
  });
