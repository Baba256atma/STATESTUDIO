/**
 * DKL-6:4 — Knowledge Repository Ownership Validation.
 *
 * Exactly four ownership integrity rules. Metadata evaluation only.
 *
 * Ownership: owned exclusively by DKL-6:4.
 */

import { KnowledgeRepositoryFoundation } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryModel } from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryRegistry } from "./knowledgeRepositoryRegistry.ts";
import type { KnowledgeRepositoryValidationRule } from "./knowledgeRepositoryValidationTypes.ts";

const rule = (
  id: string,
  name: string,
  description: string,
  subjectReference: string,
  expected: string,
  actual: string,
  status: KnowledgeRepositoryValidationRule["status"],
  severity: KnowledgeRepositoryValidationRule["severity"],
  deterministicOrder: number,
): KnowledgeRepositoryValidationRule =>
  Object.freeze({
    id,
    name,
    category: "Ownership" as const,
    description,
    subjectReference,
    expected,
    actual,
    status,
    severity,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder,
  });

const foundationOwnership = KnowledgeRepositoryFoundation.ownership;

const foundationOwnershipPass =
  foundationOwnership.immutable === true &&
  foundationOwnership.owner === "DKL-6 Knowledge Repository Foundation" &&
  foundationOwnership.ownsCount === 11 &&
  foundationOwnership.doesNotOwnCount === 19 &&
  KnowledgeRepositoryModel.ownership === foundationOwnership &&
  KnowledgeRepositoryRegistry.ownership === foundationOwnership;

const registryEntries = Object.freeze([
  ...KnowledgeRepositoryRegistry.repositoryTypes,
  ...KnowledgeRepositoryRegistry.components,
  ...KnowledgeRepositoryRegistry.knowledgeRecordTypes,
  ...KnowledgeRepositoryRegistry.versionTypes,
  ...KnowledgeRepositoryRegistry.snapshotTypes,
  ...KnowledgeRepositoryRegistry.historyEventTypes,
  ...KnowledgeRepositoryRegistry.archiveStates,
  ...KnowledgeRepositoryRegistry.retentionPolicies,
  ...KnowledgeRepositoryRegistry.indexDeclarations,
  ...KnowledgeRepositoryRegistry.retrievalDeclarations,
  ...KnowledgeRepositoryRegistry.capabilities,
  ...KnowledgeRepositoryRegistry.contracts,
  ...KnowledgeRepositoryRegistry.lifecycle,
  ...KnowledgeRepositoryRegistry.policies,
]);

const registryOwnershipPass = registryEntries.every(
  (entry) => entry.owner === "DKL-6",
);

const modelDescriptors = Object.freeze([
  KnowledgeRepositoryModel.repository.identityModel,
  KnowledgeRepositoryModel.repository.aggregate,
  ...KnowledgeRepositoryModel.recordModels,
  ...KnowledgeRepositoryModel.versionModels,
  ...KnowledgeRepositoryModel.snapshotModels,
  ...KnowledgeRepositoryModel.historyModels,
  KnowledgeRepositoryModel.archiveModel.model,
  ...KnowledgeRepositoryModel.retentionModels,
  ...KnowledgeRepositoryModel.indexModels,
  ...KnowledgeRepositoryModel.retrievalModels,
]);

const modelOwnershipPass =
  modelDescriptors.every((model) => model.owner === "DKL-6") &&
  KnowledgeRepositoryModel.relationships.every((rel) => rel.owner === "DKL-6");

const doesNotOwn = foundationOwnership.doesNotOwn;

const forbiddenOwnershipPass =
  doesNotOwn.includes("Database engines") &&
  foundationOwnership.noStorageEngineOwnership === true &&
  doesNotOwn.includes("Query execution") &&
  doesNotOwn.includes("Business Objects") &&
  doesNotOwn.includes("Knowledge Validation") &&
  doesNotOwn.includes("Engine reasoning") &&
  doesNotOwn.includes("Advisor") &&
  doesNotOwn.includes("Scene") &&
  doesNotOwn.includes("UI");

/** Exactly four Ownership validation rules. */
export const KnowledgeRepositoryOwnershipValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-OWN-001",
      "Foundation Ownership Preserved",
      "Foundation ownership remains canonical and immutable across Registry and Model.",
      foundationOwnership.ownershipId,
      "canonical-immutable-ownership",
      foundationOwnershipPass
        ? "canonical-immutable-ownership"
        : "ownership-diverged",
      foundationOwnershipPass ? "Pass" : "Fail",
      "Critical",
      1,
    ),
    rule(
      "DKL6-VAL-OWN-002",
      "Registry Ownership Alignment",
      "All Registry entries are owned by DKL-6.",
      "KnowledgeRepositoryRegistry#entries",
      "owner=DKL-6",
      registryOwnershipPass ? "owner=DKL-6" : "ownership-mismatch",
      registryOwnershipPass ? "Pass" : "Fail",
      "Critical",
      2,
    ),
    rule(
      "DKL6-VAL-OWN-003",
      "Model Ownership Alignment",
      "All models and relationships are owned by DKL-6.",
      "KnowledgeRepositoryModel#models+relationships",
      "owner=DKL-6",
      modelOwnershipPass ? "owner=DKL-6" : "ownership-mismatch",
      modelOwnershipPass ? "Pass" : "Fail",
      "Critical",
      3,
    ),
    rule(
      "DKL6-VAL-OWN-004",
      "Forbidden Ownership Exclusion",
      "DKL-6 does not claim ownership of databases, storage engines, query engines, Business Objects, Knowledge Validation, Executive Engine, Advisor, Scene, or UI.",
      foundationOwnership.ownershipId,
      "forbidden-ownership-excluded",
      forbiddenOwnershipPass
        ? "forbidden-ownership-excluded"
        : "forbidden-ownership-claimed",
      forbiddenOwnershipPass ? "Pass" : "Fail",
      "Critical",
      4,
    ),
  ]);

/** Ownership validation section. */
export const KnowledgeRepositoryOwnershipValidation = Object.freeze({
  category: "Ownership" as const,
  rules: KnowledgeRepositoryOwnershipValidationRules,
  ruleCount: KnowledgeRepositoryOwnershipValidationRules.length,
  passedRuleCount: KnowledgeRepositoryOwnershipValidationRules.filter(
    (item) => item.status === "Pass",
  ).length,
  failedRuleCount: KnowledgeRepositoryOwnershipValidationRules.filter(
    (item) => item.status === "Fail",
  ).length,
  metadataOnly: true as const,
  immutable: true as const,
});
