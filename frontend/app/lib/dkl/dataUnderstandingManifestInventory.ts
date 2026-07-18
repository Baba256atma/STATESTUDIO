/**
 * DKL-3:5 — Data Understanding Manifest Inventory.
 *
 * Immutable architectural inventory aggregating Foundation, Registry, Model,
 * and Validation metadata. Manifest only. No execution.
 *
 * Ownership: owned exclusively by DKL-3:5.
 */

import {
  DataUnderstandingContracts,
  DataUnderstandingLifecycle,
  DataUnderstandingOwnership,
  DataUnderstandingBoundaries,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingCandidateRegistry,
  DataUnderstandingClarificationRegistry,
  DataUnderstandingEvidenceRegistry,
  DataUnderstandingRegistry,
  DataUnderstandingSubjectRegistry,
} from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingCandidateModel,
  DataUnderstandingEvidenceModel,
  DataUnderstandingModel,
  DataUnderstandingRelationshipModel,
  DataUnderstandingSnapshotModel,
} from "./dataUnderstandingModel.ts";
import {
  DataUnderstandingValidation,
  DataUnderstandingValidationRules,
} from "./dataUnderstandingValidation.ts";
import type { ManifestComponentEntry } from "./dataUnderstandingManifestTypes.ts";

const OWNER = "DKL-3 Data Understanding Platform";

const component = (
  componentId: string,
  componentName: string,
  sourcePhase: string,
  kind: string,
): ManifestComponentEntry =>
  Object.freeze({
    componentId,
    componentName,
    sourcePhase,
    kind,
    metadataOnly: true as const,
    immutable: true as const,
  });

const COMPONENTS: readonly ManifestComponentEntry[] = Object.freeze([
  component("DKL-3:1/Foundation", "Data Understanding Foundation", "DKL-3:1", "Foundation"),
  component("DKL-3:2/Registry", "Data Understanding Registry", "DKL-3:2", "Registry"),
  component("DKL-3:3/Model", "Data Understanding Model", "DKL-3:3", "Model"),
  component("DKL-3:4/Validation", "Data Understanding Validation", "DKL-3:4", "Validation"),
  component("DKL-3:5/Manifest", "Data Understanding Manifest", "DKL-3:5", "Manifest"),
]);

/** Canonical immutable architectural inventory for DKL-3. */
export const DataUnderstandingManifestInventory = Object.freeze({
  inventoryId: "DKL-3:5/ManifestInventory",
  sourcePhase: "DKL-3:5",
  owner: OWNER,
  foundation: Object.freeze({
    foundationId: "DKL-3:1/DataUnderstandingFoundation",
    sourcePhase: "DKL-3:1",
    status: "FoundationComplete",
    readiness: "ReadyForRegistry",
    subjectKinds: DataUnderstandingContracts.subjectKinds,
    candidateTypes: DataUnderstandingContracts.candidateTypes,
    candidateStatuses: DataUnderstandingContracts.candidateStatuses,
    confidenceLevels: DataUnderstandingContracts.confidenceLevels,
    ambiguityLevels: DataUnderstandingContracts.ambiguityLevels,
    clarificationStatuses: DataUnderstandingContracts.clarificationStatuses,
    understandingScopes: DataUnderstandingContracts.understandingScopes,
    resultStatuses: DataUnderstandingContracts.resultStatuses,
    lifecycleStates: DataUnderstandingLifecycle.states,
    processingPolicies: DataUnderstandingContracts.processingPolicies,
    ownership: DataUnderstandingOwnership,
    boundaries: DataUnderstandingBoundaries,
  }),
  registry: Object.freeze({
    registryId: DataUnderstandingRegistry.identity.registryId,
    sourcePhase: "DKL-3:2",
    status: "RegistryComplete",
    readiness: "ReadyForModel",
    subjectCount: DataUnderstandingSubjectRegistry.entryCount,
    candidateTypeCount: DataUnderstandingCandidateRegistry.candidateTypeCount,
    candidateStatusCount: DataUnderstandingCandidateRegistry.candidateStatusCount,
    evidenceCategoryCount: DataUnderstandingEvidenceRegistry.entryCount,
    evidencePriorityTierCount: DataUnderstandingEvidenceRegistry.priorityTierCount,
    confidenceLevelCount: DataUnderstandingCandidateRegistry.confidenceLevelCount,
    clarificationTypeCount: DataUnderstandingClarificationRegistry.clarificationTypeCount,
    clarificationStatusCount: DataUnderstandingClarificationRegistry.clarificationStatusCount,
    ambiguityLevelCount: DataUnderstandingRegistry.ambiguityLevels.entryCount,
    lifecycleStateCount: DataUnderstandingRegistry.lifecycleStates.entryCount,
    processingPolicyCount: DataUnderstandingRegistry.processingPolicies.entryCount,
    publicApiCount: DataUnderstandingRegistry.publicApis.entryCount,
  }),
  model: Object.freeze({
    modelId: DataUnderstandingModel.identity.modelId,
    sourcePhase: "DKL-3:3",
    status: "ModelComplete",
    readiness: "ReadyForValidation",
    modelKinds: DataUnderstandingModel.modelKinds,
    modelKindCount: DataUnderstandingModel.modelKindCount,
    candidateFieldCount: DataUnderstandingCandidateModel.fieldCount,
    evidenceFieldCount: DataUnderstandingEvidenceModel.fieldCount,
    relationshipKindCount: DataUnderstandingRelationshipModel.relationshipKindCount,
    snapshotSectionCount: DataUnderstandingSnapshotModel.snapshotSectionCount,
    resultFieldCount: DataUnderstandingSnapshotModel.resultFieldCount,
    publicApiCount: DataUnderstandingModel.publicApiNames.length,
  }),
  validation: Object.freeze({
    validationId: DataUnderstandingValidation.identity.validationId,
    sourcePhase: "DKL-3:4",
    status: "ValidationComplete",
    readiness: "ReadyForManifest",
    ruleCount: DataUnderstandingValidationRules.length,
    rules: DataUnderstandingValidationRules,
    publicApiCount: DataUnderstandingValidation.publicApiNames.length,
  }),
  subjects: DataUnderstandingContracts.subjectKinds,
  candidateTypes: DataUnderstandingContracts.candidateTypes,
  evidenceCategories: Object.freeze(
    DataUnderstandingEvidenceRegistry.entries.map((e) => e.category),
  ),
  relationshipKinds: DataUnderstandingRelationshipModel.relationshipKinds,
  clarificationTypes: Object.freeze(
    DataUnderstandingClarificationRegistry.clarificationTypes.map(
      (e) => e.clarificationType,
    ),
  ),
  confidenceLevels: DataUnderstandingContracts.confidenceLevels,
  ambiguityLevels: DataUnderstandingContracts.ambiguityLevels,
  lifecycleStates: DataUnderstandingLifecycle.states,
  processingPolicies: DataUnderstandingContracts.processingPolicies,
  references: Object.freeze([
    "FoundationReference",
    "RegistryReference",
    "PipelineReference",
    "ValidationSummaryReference",
  ]),
  ownership: DataUnderstandingOwnership,
  boundaries: DataUnderstandingBoundaries,
  validationRules: DataUnderstandingValidationRules,
  publicApis: Object.freeze({
    foundation: Object.freeze([
      "DataUnderstandingFoundation",
      "DataUnderstandingContracts",
      "DataUnderstandingOwnership",
      "DataUnderstandingBoundaries",
      "DataUnderstandingLifecycle",
      "DataUnderstandingEvidenceCatalog",
      "DataUnderstandingFoundationVersion",
      "validateDataUnderstandingFoundationInput",
    ]),
    registry: Object.freeze(
      DataUnderstandingRegistry.publicApis.entries.map((e) => e.apiName),
    ),
    model: DataUnderstandingModel.publicApiNames,
    validation: DataUnderstandingValidation.publicApiNames,
    manifest: Object.freeze([
      "DataUnderstandingManifest",
      "DataUnderstandingManifestInventory",
      "DataUnderstandingManifestDependencies",
      "DataUnderstandingManifestCompatibility",
      "DataUnderstandingManifestReadiness",
      "DataUnderstandingManifestSummary",
      "DataUnderstandingManifestVersion",
      "DataUnderstandingManifestIdentity",
    ]),
  }),
  components: COMPONENTS,
  componentCount: COMPONENTS.length,
  metadataOnly: true,
  manifestOnly: true,
  immutable: true,
  deterministic: true,
});
