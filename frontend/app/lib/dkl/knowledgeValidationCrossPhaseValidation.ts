/**
 * DKL-5:4 — Cross-phase, prohibition, immutability, and readiness checks.
 *
 * Pure deterministic evaluations over Foundation, Registry, and Model exports.
 * Ownership: owned exclusively by DKL-5:4.
 */

import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";
import { KnowledgeValidationRegistry } from "./knowledgeValidationRegistry.ts";
import { KnowledgeValidationModel } from "./knowledgeValidationModel.ts";
import type { RuleEvaluationOutcome } from "./knowledgeValidationValidationTypes.ts";

const unique = (values: readonly string[]): boolean =>
  new Set(values).size === values.length;

const registryCollectionKeys = Object.freeze(
  Object.keys(KnowledgeValidationRegistry.collections),
);

const modelCategoryRefsAlign = (): boolean => {
  for (const model of KnowledgeValidationModel.catalog.models) {
    for (const ref of model.registryCategoryReferences) {
      if (!registryCollectionKeys.includes(ref)) {
        return false;
      }
    }
  }
  return true;
};

/** Evaluate cross-phase architectural rules. */
export const evaluateCrossPhaseValidationRules = (): Readonly<
  Record<string, RuleEvaluationOutcome>
> => {
  const foundation = KnowledgeValidationFoundation;
  const registry = KnowledgeValidationRegistry;
  const model = KnowledgeValidationModel;

  const phaseIds = Object.freeze([
    foundation.identity.foundationId,
    registry.identity.registryId,
    model.identity.modelPhaseId,
  ]);

  const identityNamespaceOk =
    unique(phaseIds) &&
    foundation.version === "1.0.0" &&
    registry.version === "1.0.0" &&
    model.version === "1.0.0" &&
    foundation.identity.foundationNamespace.startsWith(
      "nexora.dkl.knowledge-validation",
    ) &&
    registry.identity.registryNamespace.startsWith(
      "nexora.dkl.knowledge-validation",
    ) &&
    model.identity.modelPhaseNamespace.startsWith(
      "nexora.dkl.knowledge-validation",
    );

  const lifecycleReadinessOk =
    foundation.identity.status === "FoundationComplete" &&
    registry.identity.status === "RegistryComplete" &&
    model.identity.status === "ModelComplete" &&
    foundation.identity.readiness === "ReadyForRegistry" &&
    registry.identity.readiness === "ReadyForModel" &&
    model.identity.readiness === "ReadyForValidation";

  const vocabularyOk =
    foundation.contracts.targetCategories.length ===
      registry.summary.validationTargetCount &&
    foundation.contracts.dimensions.length ===
      registry.summary.validationDimensionCount &&
    foundation.contracts.qualitySignals.length ===
      registry.summary.qualitySignalCount &&
    foundation.contracts.outcomes.length === registry.summary.outcomeCount &&
    foundation.contracts.severities.length === registry.summary.severityCount &&
    modelCategoryRefsAlign() &&
    model.catalog.byKind.KnowledgeQualitySignal.registryCategoryReferences.includes(
      "knowledgeQualitySignals",
    ) &&
    model.catalog.byKind.KnowledgeTrustDeclaration.registryCategoryReferences.includes(
      "trustLevels",
    ) &&
    model.catalog.byKind.ValidationEvidence.registryCategoryReferences.includes(
      "evidenceTypes",
    );

  const ownershipDupOk =
    foundation.guarantees.noDuplicateKnowledgeModelingOwnership === true &&
    registry.ownership.noDuplicateArchitecturalOwnership === true &&
    foundation.ownership.doesNotOwn.some((item) =>
      /executive|engine/i.test(item),
    ) &&
    model.ownership.doesNotOwn.includes("Executive reasoning") &&
    !model.ownership.owns.some((item) => /executive engine/i.test(item));

  const prohibitionsOk =
    foundation.boundaries.performsDataCleansing === false &&
    foundation.boundaries.executesValidationRules === false &&
    foundation.boundaries.calculatesScores === false &&
    foundation.boundaries.calculatesTrustAutomatically === false &&
    foundation.boundaries.generatesAiConfidence === false &&
    foundation.boundaries.performsEntityResolution === false &&
    foundation.boundaries.performsSemanticInference === false &&
    foundation.boundaries.remediatesAutomatically === false &&
    foundation.boundaries.persistsResults === false &&
    foundation.boundaries.traversesGraphs === false &&
    foundation.boundaries.executesEngineReasoning === false &&
    foundation.boundaries.makesDecisions === false &&
    foundation.boundaries.rendersUi === false &&
    foundation.boundaries.narratesAdvisor === false &&
    foundation.boundaries.rendersScene === false &&
    foundation.boundaries.sendsNotifications === false &&
    foundation.boundaries.orchestratesWorkflows === false &&
    foundation.boundaries.createsKnowledgeModels === false &&
    foundation.boundaries.createsBusinessObjects === false &&
    registry.readiness.RuntimeValidationForbidden === true &&
    registry.readiness.ScoreCalculationForbidden === true &&
    registry.readiness.TrustCalculationForbidden === true &&
    registry.readiness.RemediationForbidden === true &&
    registry.readiness.ConflictResolutionForbidden === true &&
    registry.readiness.AmbiguityResolutionForbidden === true &&
    model.guarantees.noNumericScoring === true &&
    model.guarantees.noTrustCalculation === true &&
    model.guarantees.noAiConfidence === true &&
    model.guarantees.noRuntimeRuleExecution === true &&
    model.guarantees.noAmbiguityResolution === true &&
    model.guarantees.noConflictResolution === true &&
    model.guarantees.noRemediation === true &&
    model.guarantees.noPersistenceCoupling === true &&
    model.guarantees.noEngineBehavior === true &&
    model.relationships.graphTraversalForbidden === true &&
    model.readiness.AiForbidden === true &&
    foundation.guarantees.noHiddenRuntimeBehavior === true;

  const immutabilityOk =
    foundation.metadataOnly === true &&
    foundation.immutable === true &&
    registry.metadataOnly === true &&
    registry.immutable === true &&
    model.metadataOnly === true &&
    model.immutable === true &&
    Object.isFrozen(foundation) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(model) &&
    model.catalog.models.every((descriptor) =>
      descriptor.fields.every(
        (field) =>
          field.readonly === true && field.executableBehaviorImplied === false,
      ),
    );

  const readinessOk =
    foundation.readiness.ReadyForRegistry === true &&
    registry.readiness.ReadyForModel === true &&
    model.readiness.ReadyForValidation === true;

  return Object.freeze({
    "KV-VAL-XPH-001": Object.freeze({
      passed: identityNamespaceOk,
      observedDeclaration: `phaseIds=${phaseIds.join("|")}; versions=${foundation.version}/${registry.version}/${model.version}`,
    }),
    "KV-VAL-XPH-002": Object.freeze({
      passed: lifecycleReadinessOk,
      observedDeclaration: `statuses=${foundation.identity.status}→${registry.identity.status}→${model.identity.status}; readiness=${foundation.identity.readiness}→${registry.identity.readiness}→${model.identity.readiness}`,
    }),
    "KV-VAL-XPH-003": Object.freeze({
      passed: vocabularyOk,
      observedDeclaration: `targets=${foundation.contracts.targetCategories.length}/${registry.summary.validationTargetCount}; dimensions=${foundation.contracts.dimensions.length}/${registry.summary.validationDimensionCount}; signals=${foundation.contracts.qualitySignals.length}/${registry.summary.qualitySignalCount}; modelCategoryRefsAlign=${String(modelCategoryRefsAlign())}`,
    }),
    "KV-VAL-XPH-004": Object.freeze({
      passed: ownershipDupOk,
      observedDeclaration: `noDuplicateKnowledgeModelingOwnership=${String(foundation.guarantees.noDuplicateKnowledgeModelingOwnership)}; noDuplicateArchitecturalOwnership=${String(registry.ownership.noDuplicateArchitecturalOwnership)}; modelExcludesExecutiveReasoning=${String(model.ownership.doesNotOwn.includes("Executive reasoning"))}`,
    }),
    "KV-VAL-PRH-001": Object.freeze({
      passed: prohibitionsOk,
      observedDeclaration: `foundationBoundariesExcludeRuntime=true; registryReadinessForbidsRuntime=true; modelGuaranteesForbidScoringTrustAiResolutionRemediationEngine=true`,
    }),
    "KV-VAL-IMM-001": Object.freeze({
      passed: immutabilityOk,
      observedDeclaration: `foundation.metadataOnly=${String(foundation.metadataOnly)}; registry.metadataOnly=${String(registry.metadataOnly)}; model.metadataOnly=${String(model.metadataOnly)}; frozen=${String(Object.isFrozen(foundation) && Object.isFrozen(registry) && Object.isFrozen(model))}`,
    }),
    "KV-VAL-RDY-001": Object.freeze({
      passed: readinessOk,
      observedDeclaration: `ReadyForRegistry=${String(foundation.readiness.ReadyForRegistry)}; ReadyForModel=${String(registry.readiness.ReadyForModel)}; ReadyForValidation=${String(model.readiness.ReadyForValidation)}`,
    }),
  });
};
