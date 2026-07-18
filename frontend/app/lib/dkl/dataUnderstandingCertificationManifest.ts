/**
 * DKL-3:7 — Data Understanding Certification Manifest.
 *
 * Immutable certification manifest: identity, counts, and readiness.
 * Metadata only.
 *
 * Ownership: owned exclusively by DKL-3:7.
 */

import { DataUnderstandingCertificationRegistry } from "./dataUnderstandingCertificationRegistry.ts";
import { DataUnderstandingCertificationCompatibility } from "./dataUnderstandingCertificationCompatibility.ts";
import { DataUnderstandingCertificationEvidence } from "./dataUnderstandingCertificationEvidence.ts";
import { DataUnderstandingPlatformDependencies } from "./dataUnderstandingPlatform.ts";
import type { CertificationCounts, CertificationReadinessDescriptor } from "./dataUnderstandingCertificationTypes.ts";
import {
  DATA_UNDERSTANDING_CERTIFICATION_IDENTITY,
  DATA_UNDERSTANDING_CERTIFICATION_VERSION,
} from "./dataUnderstandingCertificationRegistry.ts";

const COUNTS: CertificationCounts = Object.freeze({
  gateCount: DataUnderstandingCertificationRegistry.gateCount,
  certifiedGateCount: DataUnderstandingCertificationRegistry.certifiedGateCount,
  evidenceCount: DataUnderstandingCertificationEvidence.entryCount,
  compatibilityCount: DataUnderstandingCertificationCompatibility.entryCount,
  componentCount: DataUnderstandingCertificationRegistry.componentCount,
  dependencyCount: DataUnderstandingPlatformDependencies.entryCount,
  publicApiCount: 8,
  phasesCertified: 6,
});

const READINESS: CertificationReadinessDescriptor = Object.freeze({
  FoundationCertified: true,
  RegistryCertified: true,
  ModelCertified: true,
  ValidationCertified: true,
  ManifestCertified: true,
  PlatformCertified: true,
  DependenciesCertified: true,
  CompatibilityCertified: true,
  OwnershipCertified: true,
  BoundaryCertified: true,
  PublicApiCertified: true,
  DeterministicCertified: true,
  ImmutableCertified: true,
  ReadyForFreeze: true,
  Certified: true,
  MetadataOnly: true,
  CertificationOnly: true,
  UnderstandingForbidden: true,
  ValidationExecutionForbidden: true,
  BusinessObjectCreationForbidden: true,
  KnowledgeGraphForbidden: true,
  PersistenceForbidden: true,
  AIFree: true,
  EngineFree: true,
});

/** Canonical immutable certification manifest. */
export const DataUnderstandingCertificationManifest = Object.freeze({
  manifestId: "DKL-3:7/CertificationManifest",
  identity: DATA_UNDERSTANDING_CERTIFICATION_IDENTITY,
  version: DATA_UNDERSTANDING_CERTIFICATION_VERSION,
  sourcePhase: "DKL-3:7",
  counts: COUNTS,
  readiness: READINESS,
  status: "Certified" as const,
  nextPhase: "DKL-3:8",
  metadata: Object.freeze({
    metadataOnly: true,
    certificationOnly: true,
    deterministic: true,
    immutable: true,
    semanticUnderstandingPerformed: false,
    validationExecuted: false,
    businessObjectsCreated: false,
    knowledgeGraphCreated: false,
    persistencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
  }),
  metadataOnly: true,
  certificationOnly: true,
  immutable: true,
  deterministic: true,
});
