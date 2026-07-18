/**
 * DKL-2:7 — Data Source & Knowledge Registry Certification Platform.
 *
 * The single canonical, immutable, metadata-only certification root for the
 * complete DKL-2 Data Source & Knowledge Registry Platform. It certifies the
 * architectural completeness, integrity, compatibility, ownership, dependency
 * safety, public-API stability, immutability, determinism, and release readiness
 * of DKL-2:1 through DKL-2:6 using deterministic evidence derived exclusively
 * from approved public surfaces.
 *
 * It aggregates the certification registry, gates, evidence, compatibility,
 * manifest, and summary by reference and publishes exactly seven runtime public
 * APIs. It introduces no data sources, registries, models, validation rules,
 * manifests, or runtime behavior.
 *
 * The two similarly named public objects (DKL-2:2 registry-entry platform and
 * DKL-2:6 complete platform) are distinguished, aliased, and certified within the
 * certification evidence and the PublicSurfaceAmbiguityControlled gate.
 *
 * Ownership: owned exclusively by DKL-2:7.
 * Dependency rules: consumes DKL-2:1..2:6 only through approved public modules.
 * Forward-only, cycle-free, public-API-only. Zero runtime behavior: no I/O, no
 * network, no reflection, no async, no side effects.
 */

import {
  DataSourceKnowledgeInventoryManifest,
  DataSourceKnowledgeRegistryManifestSummary,
} from "./dataSourceKnowledgeRegistryManifestPlatform.ts";

import { DataSourceKnowledgeCertificationCompatibility } from "./dataSourceKnowledgeCertificationCompatibility.ts";
import { DataSourceKnowledgeCertificationEvidence } from "./dataSourceKnowledgeCertificationEvidence.ts";
import { DataSourceKnowledgeCertificationGates } from "./dataSourceKnowledgeCertificationGates.ts";
import { DataSourceKnowledgeCertificationManifest } from "./dataSourceKnowledgeCertificationManifest.ts";
import { DataSourceKnowledgeCertificationRegistry } from "./dataSourceKnowledgeCertificationRegistry.ts";
import {
  CERTIFICATION_OWNER,
  CERTIFICATION_VERSION,
  type CertificationIdentityDescriptor,
  type CertificationPlatformDescriptor,
  type CertificationSummaryDescriptor,
} from "./dataSourceKnowledgeCertificationTypes.ts";

export { DataSourceKnowledgeCertificationRegistry } from "./dataSourceKnowledgeCertificationRegistry.ts";
export { DataSourceKnowledgeCertificationGates } from "./dataSourceKnowledgeCertificationGates.ts";
export { DataSourceKnowledgeCertificationEvidence } from "./dataSourceKnowledgeCertificationEvidence.ts";
export { DataSourceKnowledgeCertificationCompatibility } from "./dataSourceKnowledgeCertificationCompatibility.ts";
export { DataSourceKnowledgeCertificationManifest } from "./dataSourceKnowledgeCertificationManifest.ts";

const registryInventory = DataSourceKnowledgeInventoryManifest.registry;
const registryEntryCount =
  registryInventory.dataSourceEntries +
  registryInventory.knowledgeEntries +
  registryInventory.connectorEntries +
  registryInventory.contentEntries +
  registryInventory.sourceGroupEntries +
  registryInventory.compatibilityRelationships;

const IDENTITY: CertificationIdentityDescriptor = Object.freeze<CertificationIdentityDescriptor>({
  certificationId: "DKL-2:7",
  certificationVersion: CERTIFICATION_VERSION,
  certificationName: "Data Source & Knowledge Registry Certification Platform",
  certificationNamespace: "nexora.dkl.dsk-registry.certification",
  platformId: "DKL-2",
  platformVersion: "1.0.0",
  owner: CERTIFICATION_OWNER,
  sourcePhase: "DKL-2:7",
  status: "Certified",
  readiness: "ReadyForFreeze",
  metadataOnly: true,
  immutable: true,
});

const gates = DataSourceKnowledgeCertificationGates.gates;
const certifiedGateCount = gates.filter((gate) => gate.status === "Certified").length;

/** Concise, immutable summary of the DKL-2 certification. */
export const DataSourceKnowledgeCertificationSummary: CertificationSummaryDescriptor =
  Object.freeze<CertificationSummaryDescriptor>({
    componentCount: DataSourceKnowledgeCertificationRegistry.components.length,
    gateCount: gates.length,
    certifiedGateCount,
    evidenceCount: DataSourceKnowledgeCertificationEvidence.items.length,
    compatibilityCount: DataSourceKnowledgeCertificationCompatibility.declarations.length,
    blockingIssueCount: 0,
    warningCount: 0,
    validationPassCount: DataSourceKnowledgeInventoryManifest.validation.pass,
    guaranteeCount: DataSourceKnowledgeRegistryManifestSummary.guaranteeCount,
    registryEntryCount,
    modelCount: DataSourceKnowledgeInventoryManifest.model.totalModels,
    status: "Certified",
    readiness: "ReadyForFreeze",
    nextPhase: "DKL-2:8",
    metadataOnly: true,
    deterministic: true,
    immutable: true,
  });

/** The canonical, deeply frozen aggregate root for the DKL-2 certification. */
export const DataSourceKnowledgeCertificationPlatform: CertificationPlatformDescriptor =
  Object.freeze<CertificationPlatformDescriptor>({
    identity: IDENTITY,
    registry: DataSourceKnowledgeCertificationRegistry,
    gates: DataSourceKnowledgeCertificationGates,
    evidence: DataSourceKnowledgeCertificationEvidence,
    compatibility: DataSourceKnowledgeCertificationCompatibility,
    manifest: DataSourceKnowledgeCertificationManifest,
    summary: DataSourceKnowledgeCertificationSummary,
    metadataOnly: true,
    runtimeFree: true,
    deterministic: true,
    immutable: true,
  });
