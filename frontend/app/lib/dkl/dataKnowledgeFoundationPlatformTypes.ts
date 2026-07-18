/**
 * DKL-1:6 — Data Knowledge Foundation Platform.
 *
 * Metadata-only type definitions for the canonical DKL Foundation platform.
 * The platform aggregates the official public artifacts of DKL-1:1 through
 * DKL-1:5. It owns no new metadata and defines no new architecture.
 *
 * Section reference types are derived (via `typeof`) from the official public
 * artifacts so the platform can only ever reference — never redefine — them.
 */

import { DataKnowledgeFoundation } from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationManifest } from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationModel } from "./dataKnowledgeFoundationModel.ts";
import { DataKnowledgeFoundationRegistry } from "./dataKnowledgeFoundationRegistryIndex.ts";
import { DataKnowledgeFoundationValidation } from "./dataKnowledgeFoundationValidation.ts";

export interface DataKnowledgePlatformGuarantees {
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deepFrozen: true;
  readonly deterministic: true;
  readonly publicApiStable: true;
  readonly manifestDriven: true;
  readonly ownershipProtected: true;
  readonly dependencyProtected: true;
}

export interface DataKnowledgePlatformMetadataDescriptor {
  readonly platformId: "DKL-1:6";
  readonly name: "Data Knowledge Foundation Platform";
  readonly namespace: "nexora.dkl.foundation.platform";
  readonly version: "1.0.0";
  readonly stability: "STABLE";
  readonly certification: "CERTIFIED";
  readonly buildStatus: "CERTIFIED";
  readonly readiness: "ReadyForCertification";
  readonly guarantees: DataKnowledgePlatformGuarantees;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgePlatformRegistryDescriptor {
  readonly registeredPhases: number;
  readonly registeredSections: number;
  readonly totalPublicApis: number;
  readonly totalValidationRules: number;
  readonly totalModels: number;
  readonly totalComponents: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgePlatformSummaryDescriptor {
  readonly platformId: "DKL-1:6";
  readonly version: "1.0.0";
  readonly phaseCount: number;
  readonly sectionCount: number;
  readonly publicApiCount: number;
  readonly validationRuleCount: number;
  readonly modelCount: number;
  readonly readiness: "ReadyForCertification";
  readonly certification: "CERTIFIED";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeFoundationPlatformDescriptor {
  readonly metadata: DataKnowledgePlatformMetadataDescriptor;
  readonly registry: DataKnowledgePlatformRegistryDescriptor;
  readonly foundation: typeof DataKnowledgeFoundation;
  readonly registrySection: typeof DataKnowledgeFoundationRegistry;
  readonly model: typeof DataKnowledgeFoundationModel;
  readonly validation: typeof DataKnowledgeFoundationValidation;
  readonly manifest: typeof DataKnowledgeFoundationManifest;
  readonly summary: DataKnowledgePlatformSummaryDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
