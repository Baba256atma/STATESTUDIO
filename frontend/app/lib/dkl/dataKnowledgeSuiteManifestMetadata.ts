/**
 * DKL-9:5 — Data Knowledge Suite Manifest Metadata.
 *
 * Manifest release metadata and architecture phase declarations.
 * Derived through Validation identity chain.
 *
 * Ownership: owned exclusively by DKL-9:5.
 */

import { DataKnowledgeSuiteValidationPlatform } from "./dataKnowledgeSuiteValidation.ts";
import { DataKnowledgeSuiteManifestChainIds } from "./dataKnowledgeSuiteManifestInventory.ts";

const validation = DataKnowledgeSuiteValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phase = (
  phaseId: string,
  phaseName: string,
  stage: string,
  version: string,
  status: string,
  predecessor: string | null,
  successor: string | null,
  path: string,
  completed: boolean,
  order: number,
) =>
  Object.freeze({
    phaseId,
    phaseName,
    stage,
    version,
    status,
    directPredecessor: predecessor,
    directSuccessor: successor,
    canonicalReferencePath: path,
    runtimeBehavior: "None" as const,
    completed,
    deterministicOrder: order,
  });

/** Completed DKL-9 phases through Manifest; future Platform+ remain incomplete. */
export const DataKnowledgeSuiteManifestArchitecturePhases = Object.freeze([
  phase(
    foundation.identity.foundationId,
    foundation.identity.foundationName,
    "Foundation",
    foundation.identity.foundationVersion,
    foundation.status,
    null,
    registry.identity.registryId,
    "Validation.model.registry.foundation",
    true,
    1,
  ),
  phase(
    registry.identity.registryId,
    registry.identity.registryName,
    "Registry",
    registry.identity.registryVersion,
    registry.status,
    foundation.identity.foundationId,
    model.identity.modelId,
    "Validation.model.registry",
    true,
    2,
  ),
  phase(
    model.identity.modelId,
    model.identity.modelName,
    "Model",
    model.identity.modelVersion,
    model.status,
    registry.identity.registryId,
    validation.identity.validationId,
    "Validation.model",
    true,
    3,
  ),
  phase(
    validation.identity.validationId,
    validation.identity.validationName,
    "Validation",
    validation.identity.validationVersion,
    validation.status,
    model.identity.modelId,
    DataKnowledgeSuiteManifestChainIds.manifestId,
    "Validation",
    true,
    4,
  ),
  phase(
    DataKnowledgeSuiteManifestChainIds.manifestId,
    "Data Knowledge Suite Manifest",
    "Manifest",
    "1.0.0",
    "ManifestDefined",
    validation.identity.validationId,
    "DKL-9:6/DataKnowledgeSuitePlatform",
    "Manifest",
    true,
    5,
  ),
  phase(
    "DKL-9:6/DataKnowledgeSuitePlatform",
    "Data Knowledge Suite Platform",
    "Platform",
    "1.0.0",
    "Pending",
    DataKnowledgeSuiteManifestChainIds.manifestId,
    "DKL-9:7/DataKnowledgeSuiteCertification",
    "Future",
    false,
    6,
  ),
  phase(
    "DKL-9:7/DataKnowledgeSuiteCertification",
    "Data Knowledge Suite Certification",
    "Certification",
    "1.0.0",
    "Pending",
    "DKL-9:6/DataKnowledgeSuitePlatform",
    "DKL-9:8/DataKnowledgeSuiteFreeze",
    "Future",
    false,
    7,
  ),
  phase(
    "DKL-9:8/DataKnowledgeSuiteFreeze",
    "Data Knowledge Suite Freeze",
    "Freeze",
    "1.0.0",
    "Pending",
    "DKL-9:7/DataKnowledgeSuiteCertification",
    "DKL-9:9/DataKnowledgeSuitePublicIndex",
    "Future",
    false,
    8,
  ),
  phase(
    "DKL-9:9/DataKnowledgeSuitePublicIndex",
    "Data Knowledge Suite Public Index",
    "PublicIndex",
    "1.0.0",
    "Pending",
    "DKL-9:8/DataKnowledgeSuiteFreeze",
    null,
    "Future",
    false,
    9,
  ),
]);

/** Manifest release metadata. */
export const DataKnowledgeSuiteManifestMetadata = Object.freeze({
  metadataId: "DKL-9:5/DataKnowledgeSuiteManifestMetadata",
  suiteName: "Data Knowledge Suite" as const,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "Manifest" as const,
  architectureStatus: "CompleteThroughManifest" as const,
  validationOutcome: validation.validationOutcome,
  validationReadiness: validation.readiness,
  completedPhaseCount: DataKnowledgeSuiteManifestArchitecturePhases.filter(
    (item) => item.completed,
  ).length,
  futurePhaseCount: DataKnowledgeSuiteManifestArchitecturePhases.filter(
    (item) => !item.completed,
  ).length,
  totalDkl9PhaseCount: DataKnowledgeSuiteManifestArchitecturePhases.length,
  chainIds: DataKnowledgeSuiteManifestChainIds,
  releaseMetadataOnly: true as const,
  reconstructsUpstream: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
