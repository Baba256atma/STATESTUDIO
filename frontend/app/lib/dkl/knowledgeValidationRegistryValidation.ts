/**
 * DKL-5:4 — Registry architectural checks.
 *
 * Pure deterministic evaluations over KnowledgeValidationRegistry exports.
 * Ownership: owned exclusively by DKL-5:4.
 */

import { KnowledgeValidationRegistry } from "./knowledgeValidationRegistry.ts";
import type { RuleEvaluationOutcome } from "./knowledgeValidationValidationTypes.ts";

const unique = (values: readonly string[]): boolean =>
  new Set(values).size === values.length;

const namesUniqueWithinCollections = (): boolean => {
  for (const entries of Object.values(KnowledgeValidationRegistry.collections)) {
    const names = entries.map((entry: { readonly name: string }) => entry.name);
    if (!unique(names)) {
      return false;
    }
  }
  return true;
};

const allRegistryIds = (): readonly string[] =>
  Object.freeze(
    Object.values(KnowledgeValidationRegistry.collections).flatMap((entries) =>
      entries.map((entry: { readonly id: string }) => entry.id),
    ),
  );

const collectionsFrozen = (): boolean => {
  if (!Object.isFrozen(KnowledgeValidationRegistry.collections)) {
    return false;
  }
  for (const entries of Object.values(KnowledgeValidationRegistry.collections)) {
    if (!Object.isFrozen(entries)) {
      return false;
    }
    for (const entry of entries) {
      if (!Object.isFrozen(entry)) {
        return false;
      }
    }
  }
  return true;
};

/** Evaluate Registry-scoped architectural rules. */
export const evaluateRegistryValidationRules = (): Readonly<
  Record<string, RuleEvaluationOutcome>
> => {
  const identity = KnowledgeValidationRegistry.identity;
  const summary = KnowledgeValidationRegistry.summary;
  const collections = KnowledgeValidationRegistry.collections;
  const ownership = KnowledgeValidationRegistry.ownership;
  const dependencies = KnowledgeValidationRegistry.dependencies;
  const readiness = KnowledgeValidationRegistry.readiness;

  const identityOk =
    identity.status === "RegistryComplete" &&
    identity.readiness === "ReadyForModel" &&
    identity.registryVersion.length > 0 &&
    identity.registryNamespace.includes("knowledge-validation");

  const collectionsOk =
    Object.keys(collections).length === 24 &&
    summary.registryCategoryCount === 24 &&
    summary.totalEntryCount === 266 &&
    collectionsFrozen();

  const uniqueOk =
    summary.uniqueIdentifiersGuaranteed === true &&
    summary.uniqueNamesWithinRegistryGuaranteed === true &&
    summary.deterministicOrderingGuaranteed === true &&
    unique(allRegistryIds()) &&
    namesUniqueWithinCollections();

  const ownershipOk =
    ownership.owns.length >= 1 &&
    ownership.doesNotOwn.length >= 1 &&
    ownership.noDuplicateArchitecturalOwnership === true;

  const dependencyOk =
    dependencies.approvedFoundationDependency.module ===
      "knowledgeValidationFoundation.ts" &&
    dependencies.noDirectDkl4Dependency === true &&
    dependencies.noFutureDkl5Dependency === true;

  const forbidOk =
    readiness.RuntimeValidationForbidden === true &&
    readiness.ScoreCalculationForbidden === true &&
    readiness.TrustCalculationForbidden === true &&
    readiness.RemediationForbidden === true &&
    summary.mutableRegistrationForbidden === true;

  return Object.freeze({
    "KV-VAL-ID-002": Object.freeze({
      passed: identityOk,
      observedDeclaration: `status=${identity.status}; readiness=${identity.readiness}; version=${identity.registryVersion}; namespace=${identity.registryNamespace}`,
    }),
    "KV-VAL-TGT-002": Object.freeze({
      passed: summary.validationTargetCount === 19,
      observedDeclaration: `validationTargetCount=${summary.validationTargetCount}`,
    }),
    "KV-VAL-DIM-002": Object.freeze({
      passed: summary.validationDimensionCount === 20,
      observedDeclaration: `validationDimensionCount=${summary.validationDimensionCount}`,
    }),
    "KV-VAL-SIG-002": Object.freeze({
      passed: summary.qualitySignalCount === 20,
      observedDeclaration: `qualitySignalCount=${summary.qualitySignalCount}`,
    }),
    "KV-VAL-TRU-002": Object.freeze({
      passed: collections.trustLevels.length >= 1,
      observedDeclaration: `trustLevels.length=${collections.trustLevels.length}`,
    }),
    "KV-VAL-OUT-002": Object.freeze({
      passed: summary.outcomeCount === 11,
      observedDeclaration: `outcomeCount=${summary.outcomeCount}`,
    }),
    "KV-VAL-SEV-002": Object.freeze({
      passed: summary.severityCount === 6,
      observedDeclaration: `severityCount=${summary.severityCount}`,
    }),
    "KV-VAL-EVD-002": Object.freeze({
      passed: collections.evidenceTypes.length >= 1,
      observedDeclaration: `evidenceTypes.length=${collections.evidenceTypes.length}`,
    }),
    "KV-VAL-FNDG-002": Object.freeze({
      passed: collections.findingCategories.length >= 1,
      observedDeclaration: `findingCategories.length=${collections.findingCategories.length}`,
    }),
    "KV-VAL-ISS-001": Object.freeze({
      passed: collections.issueCategories.length >= 1,
      observedDeclaration: `issueCategories.length=${collections.issueCategories.length}`,
    }),
    "KV-VAL-CNF-001": Object.freeze({
      passed: collections.conflictTypes.length >= 1,
      observedDeclaration: `conflictTypes.length=${collections.conflictTypes.length}`,
    }),
    "KV-VAL-AMB-002": Object.freeze({
      passed: collections.ambiguityTypes.length >= 1,
      observedDeclaration: `ambiguityTypes.length=${collections.ambiguityTypes.length}`,
    }),
    "KV-VAL-OWN-002": Object.freeze({
      passed: ownershipOk,
      observedDeclaration: `owns=${ownership.owns.length}; doesNotOwn=${ownership.doesNotOwn.length}; noDuplicateArchitecturalOwnership=${String(ownership.noDuplicateArchitecturalOwnership)}`,
    }),
    "KV-VAL-DEP-002": Object.freeze({
      passed: dependencyOk,
      observedDeclaration: `module=${dependencies.approvedFoundationDependency.module}; noDirectDkl4Dependency=${String(dependencies.noDirectDkl4Dependency)}; noFutureDkl5Dependency=${String(dependencies.noFutureDkl5Dependency)}`,
    }),
    "KV-VAL-CMP-002": Object.freeze({
      passed: collections.compatibilityPolicies.length >= 1,
      observedDeclaration: `compatibilityPolicies.length=${collections.compatibilityPolicies.length}`,
    }),
    "KV-VAL-EXT-002": Object.freeze({
      passed: collections.extensionPolicies.length >= 1,
      observedDeclaration: `extensionPolicies.length=${collections.extensionPolicies.length}`,
    }),
    "KV-VAL-REG-001": Object.freeze({
      passed: collectionsOk,
      observedDeclaration: `collectionKeys=${Object.keys(collections).length}; registryCategoryCount=${summary.registryCategoryCount}; totalEntryCount=${summary.totalEntryCount}; collectionsFrozen=${String(collectionsFrozen())}`,
    }),
    "KV-VAL-REG-002": Object.freeze({
      passed: uniqueOk,
      observedDeclaration: `uniqueIds=${String(unique(allRegistryIds()))}; uniqueNamesWithinCollections=${String(namesUniqueWithinCollections())}; deterministicOrderingGuaranteed=${String(summary.deterministicOrderingGuaranteed)}`,
    }),
    "KV-VAL-REG-003": Object.freeze({
      passed:
        collections.validationStatuses.length === 11 &&
        collections.validationLifecycleStates.length >= 1,
      observedDeclaration: `validationStatuses=${collections.validationStatuses.length}; validationLifecycleStates=${collections.validationLifecycleStates.length}`,
    }),
    "KV-VAL-REG-004": Object.freeze({
      passed: forbidOk,
      observedDeclaration: `RuntimeValidationForbidden=${String(readiness.RuntimeValidationForbidden)}; ScoreCalculationForbidden=${String(readiness.ScoreCalculationForbidden)}; TrustCalculationForbidden=${String(readiness.TrustCalculationForbidden)}; RemediationForbidden=${String(readiness.RemediationForbidden)}; mutableRegistrationForbidden=${String(summary.mutableRegistrationForbidden)}`,
    }),
  });
};
