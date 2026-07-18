/**
 * DKL-5:4 — Model architectural checks.
 *
 * Pure deterministic evaluations over KnowledgeValidationModel exports.
 * Ownership: owned exclusively by DKL-5:4.
 */

import { KnowledgeValidationModel } from "./knowledgeValidationModel.ts";
import type { RuleEvaluationOutcome } from "./knowledgeValidationValidationTypes.ts";

const unique = (values: readonly string[]): boolean =>
  new Set(values).size === values.length;

const hasField = (
  modelKind: keyof typeof KnowledgeValidationModel.catalog.byKind,
  fieldName: string,
  fieldKind?: string,
): boolean => {
  const model = KnowledgeValidationModel.catalog.byKind[modelKind];
  return model.fields.some(
    (field) =>
      field.fieldName === fieldName &&
      (fieldKind === undefined || field.fieldKind === fieldKind) &&
      field.readonly === true &&
      field.executableBehaviorImplied === false,
  );
};

const REQUIRED_AGGREGATE_FIELDS = Object.freeze([
  "validationId",
  "namespace",
  "version",
  "target",
  "scope",
  "lifecycleState",
  "status",
  "applicableDimensions",
  "ruleSet",
  "criteria",
  "evidenceSet",
  "findings",
  "issues",
  "conflicts",
  "ambiguities",
  "limitations",
  "qualitySignals",
  "trustDeclaration",
  "result",
  "summary",
  "consumerReadiness",
  "executiveUsability",
  "provenance",
  "ownership",
  "compatibility",
  "extensionMetadata",
  "sourceKnowledgeModelingReferences",
]);

/** Evaluate Model-scoped architectural rules. */
export const evaluateModelValidationRules = (): Readonly<
  Record<string, RuleEvaluationOutcome>
> => {
  const identity = KnowledgeValidationModel.identity;
  const catalog = KnowledgeValidationModel.catalog;
  const relationships = KnowledgeValidationModel.relationships;
  const ownership = KnowledgeValidationModel.ownership;
  const dependencies = KnowledgeValidationModel.dependencies;
  const byKind = catalog.byKind;

  const identityOk =
    identity.status === "ModelComplete" &&
    identity.readiness === "ReadyForValidation" &&
    identity.modelPhaseVersion.length > 0 &&
    identity.modelPhaseNamespace.includes("knowledge-validation");

  const catalogOk =
    catalog.modelCount === 30 &&
    unique(catalog.modelIds) &&
    unique(catalog.modelNames) &&
    catalog.modelKinds.length === 30;

  const aggregateOk = REQUIRED_AGGREGATE_FIELDS.every((name) =>
    byKind.KnowledgeValidation.fields.some((field) => field.fieldName === name),
  );

  const targetRuleCriterionOk =
    byKind.ValidationTarget.registryCategoryReferences.includes(
      "validationTargetTypes",
    ) &&
    byKind.ValidationRule.registryCategoryReferences.includes(
      "validationRuleCategories",
    ) &&
    byKind.ValidationRule.registryCategoryReferences.includes(
      "validationDimensions",
    ) &&
    hasField("ValidationRule", "executionImplemented", "false") &&
    hasField("ValidationCriterion", "comparisonModeDeclaration");

  const signalOk =
    byKind.KnowledgeQualitySignal.registryCategoryReferences.includes(
      "knowledgeQualitySignals",
    ) && hasField("KnowledgeQualitySignal", "numericScoreCalculated", "false");

  const trustOk =
    hasField("KnowledgeTrustDeclaration", "evidenceReferences") &&
    hasField("KnowledgeTrustDeclaration", "trustCalculated", "false") &&
    hasField("KnowledgeTrustDeclaration", "aiConfidenceUsed", "false");

  const evidenceOk =
    byKind.ValidationEvidence !== undefined &&
    byKind.EvidenceReference !== undefined &&
    hasField("ValidationEvidence", "sourceReference");

  const findingOk =
    hasField("ValidationFinding", "explanation") &&
    hasField("ValidationFinding", "runtimeRemediationImplemented", "false");

  const issueOk =
    byKind.ValidationIssue !== undefined &&
    byKind.ValidationIssue.fields.every(
      (field) => field.executableBehaviorImplied === false,
    );

  const conflictOk = hasField("ValidationConflict", "resolutionImplemented", "false");
  const ambiguityOk = hasField(
    "ValidationAmbiguity",
    "resolutionImplemented",
    "false",
  );
  const limitationOk = hasField(
    "ValidationLimitation",
    "partialUsabilityPreserved",
    "true",
  );

  const consumerOk =
    byKind.ValidationConsumerSuitability !== undefined &&
    catalog.consumerSuitabilityStates.states.length === 4 &&
    catalog.consumerSuitabilityStates.states.includes("ReadyForConsumer") &&
    catalog.consumerSuitabilityStates.states.includes("ReadyWithLimitations") &&
    catalog.consumerSuitabilityStates.states.includes("Restricted") &&
    catalog.consumerSuitabilityStates.states.includes("NotReadyForConsumer");

  const executiveOk =
    hasField("ValidationExecutiveUsability", "executiveAwareness") &&
    hasField("ValidationExecutiveUsability", "decisionCommitment") &&
    hasField(
      "ValidationExecutiveUsability",
      "awarenessVsDecisionDistinction",
      "true",
    ) &&
    hasField(
      "ValidationExecutiveUsability",
      "executiveEngineReasoningForbidden",
      "true",
    );

  const provenanceOk = hasField(
    "ValidationProvenance",
    "generatedTimestampProhibited",
    "true",
  );

  const relationshipsOk =
    relationships.declarationCount === 14 &&
    relationships.graphTraversalForbidden === true &&
    catalog.models.every((model) => model.factoryForbidden === true);

  const resultSummaryOk =
    hasField(
      "ValidationResult",
      "nonPerfectKnowledgeAutomaticallyUnusable",
      "false",
    ) && hasField("ValidationSummary", "countsCalculatedInPhase", "false");

  const ownershipOk =
    ownership.owns.length >= 1 &&
    ownership.doesNotOwn.includes("Executive reasoning") &&
    ownership.doesNotOwn.includes("UI");

  const dependencyOk =
    dependencies.approvedDependencyCount === 2 &&
    dependencies.approved[0]?.module === "knowledgeValidationFoundation.ts" &&
    dependencies.approved[1]?.module === "knowledgeValidationRegistry.ts" &&
    dependencies.noDirectDkl4Dependency === true &&
    dependencies.noFutureDkl5Dependency === true;

  return Object.freeze({
    "KV-VAL-ID-003": Object.freeze({
      passed: identityOk,
      observedDeclaration: `status=${identity.status}; readiness=${identity.readiness}; version=${identity.modelPhaseVersion}; namespace=${identity.modelPhaseNamespace}`,
    }),
    "KV-VAL-SIG-003": Object.freeze({
      passed: signalOk,
      observedDeclaration: `registryRefs=${byKind.KnowledgeQualitySignal.registryCategoryReferences.join(",")}; numericScoreCalculated=false`,
    }),
    "KV-VAL-TRU-003": Object.freeze({
      passed: trustOk,
      observedDeclaration: `evidenceReferences=${String(hasField("KnowledgeTrustDeclaration", "evidenceReferences"))}; trustCalculated=false; aiConfidenceUsed=false`,
    }),
    "KV-VAL-EVD-003": Object.freeze({
      passed: evidenceOk,
      observedDeclaration: `ValidationEvidence=${String(!!byKind.ValidationEvidence)}; EvidenceReference=${String(!!byKind.EvidenceReference)}; sourceReference=${String(hasField("ValidationEvidence", "sourceReference"))}`,
    }),
    "KV-VAL-FNDG-003": Object.freeze({
      passed: findingOk,
      observedDeclaration: `explanation=${String(hasField("ValidationFinding", "explanation"))}; runtimeRemediationImplemented=false`,
    }),
    "KV-VAL-ISS-002": Object.freeze({
      passed: issueOk,
      observedDeclaration: `ValidationIssue=${String(!!byKind.ValidationIssue)}; executableBehaviorImplied=false`,
    }),
    "KV-VAL-CNF-002": Object.freeze({
      passed: conflictOk,
      observedDeclaration: `resolutionImplemented=false`,
    }),
    "KV-VAL-AMB-003": Object.freeze({
      passed: ambiguityOk,
      observedDeclaration: `resolutionImplemented=false`,
    }),
    "KV-VAL-LIM-001": Object.freeze({
      passed: limitationOk,
      observedDeclaration: `partialUsabilityPreserved=true`,
    }),
    "KV-VAL-CON-001": Object.freeze({
      passed: consumerOk,
      observedDeclaration: `states=${catalog.consumerSuitabilityStates.states.join(",")}`,
    }),
    "KV-VAL-EXE-001": Object.freeze({
      passed: executiveOk,
      observedDeclaration: `executiveAwareness+decisionCommitment present; awarenessVsDecisionDistinction=true; executiveEngineReasoningForbidden=true`,
    }),
    "KV-VAL-PRV-001": Object.freeze({
      passed: provenanceOk,
      observedDeclaration: `generatedTimestampProhibited=true`,
    }),
    "KV-VAL-OWN-003": Object.freeze({
      passed: ownershipOk,
      observedDeclaration: `owns=${ownership.owns.length}; excludesExecutiveReasoning=${String(ownership.doesNotOwn.includes("Executive reasoning"))}; excludesUi=${String(ownership.doesNotOwn.includes("UI"))}`,
    }),
    "KV-VAL-DEP-003": Object.freeze({
      passed: dependencyOk,
      observedDeclaration: `approvedDependencyCount=${dependencies.approvedDependencyCount}; modules=${dependencies.approved.map((d) => d.module).join(",")}; noDirectDkl4Dependency=${String(dependencies.noDirectDkl4Dependency)}`,
    }),
    "KV-VAL-MDL-001": Object.freeze({
      passed: catalogOk,
      observedDeclaration: `modelCount=${catalog.modelCount}; uniqueIds=${String(unique(catalog.modelIds))}; uniqueNames=${String(unique(catalog.modelNames))}`,
    }),
    "KV-VAL-MDL-002": Object.freeze({
      passed: aggregateOk,
      observedDeclaration: `aggregateFieldCount=${byKind.KnowledgeValidation.fieldCount}; requiredFieldsPresent=${String(aggregateOk)}`,
    }),
    "KV-VAL-MDL-003": Object.freeze({
      passed: targetRuleCriterionOk,
      observedDeclaration: `targetRefs=${byKind.ValidationTarget.registryCategoryReferences.join(",")}; ruleRefs=${byKind.ValidationRule.registryCategoryReferences.join(",")}; executionImplemented=false`,
    }),
    "KV-VAL-MDL-004": Object.freeze({
      passed: relationshipsOk,
      observedDeclaration: `declarationCount=${relationships.declarationCount}; graphTraversalForbidden=${String(relationships.graphTraversalForbidden)}; factoryForbidden=${String(catalog.models.every((m) => m.factoryForbidden))}`,
    }),
    "KV-VAL-MDL-005": Object.freeze({
      passed: resultSummaryOk,
      observedDeclaration: `nonPerfectKnowledgeAutomaticallyUnusable=false; countsCalculatedInPhase=false`,
    }),
  });
};
