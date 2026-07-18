/**
 * DKL-5:4 — Knowledge Validation Validation.
 *
 * Canonical immutable architectural validation for DKL-5:1–5:3.
 * Publishes exactly eight runtime exports. Validates platform structure only —
 * never live organizational knowledge, never scores, never remediates.
 *
 * Ownership: owned exclusively by DKL-5:4.
 */

import {
  KnowledgeValidationFoundationIdentity,
  KnowledgeValidationFoundationVersion,
} from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeValidationRegistryIdentity,
  KnowledgeValidationRegistryVersion,
} from "./knowledgeValidationRegistry.ts";
import {
  KnowledgeValidationModelIdentity,
  KnowledgeValidationModelVersion,
} from "./knowledgeValidationModel.ts";
import { evaluateFoundationValidationRules } from "./knowledgeValidationFoundationValidation.ts";
import { evaluateRegistryValidationRules } from "./knowledgeValidationRegistryValidation.ts";
import { evaluateModelValidationRules } from "./knowledgeValidationModelValidation.ts";
import { evaluateCrossPhaseValidationRules } from "./knowledgeValidationCrossPhaseValidation.ts";
import {
  KnowledgeValidationValidationCategories,
  KnowledgeValidationValidationRules,
} from "./knowledgeValidationValidationRules.ts";
import type {
  KnowledgeValidationCategoryResult,
  KnowledgeValidationManifestReadinessResult,
  KnowledgeValidationPhaseResult,
  KnowledgeValidationRuleResult,
  KnowledgeValidationValidationEvidence,
  KnowledgeValidationValidationFailure,
  KnowledgeValidationValidationIdentityDescriptor,
  KnowledgeValidationValidationRunResult,
  KnowledgeValidationValidationSummary,
  RuleEvaluationOutcome,
  ValidationResultStatus,
} from "./knowledgeValidationValidationTypes.ts";

export const KnowledgeValidationValidationVersion = "1.0.0";

export const KnowledgeValidationValidationNamespace =
  "nexora.dkl.knowledge-validation.validation";

export const KnowledgeValidationValidationIdentity: KnowledgeValidationValidationIdentityDescriptor =
  Object.freeze({
    validationId: "DKL-5:4/KnowledgeValidationValidation",
    validationVersion: KnowledgeValidationValidationVersion,
    validationName: "Knowledge Validation Validation",
    validationNamespace: KnowledgeValidationValidationNamespace,
    owner: "DKL-5 Knowledge Validation Validation",
    sourcePhase: "DKL-5:4",
    platformId: "DKL-5",
    platformVersion: KnowledgeValidationValidationVersion,
    status: "ValidationComplete",
    readiness: "ReadyForManifest",
  });

export {
  KnowledgeValidationValidationCategories,
  KnowledgeValidationValidationRules,
};

const mergeOutcomes = (): Readonly<Record<string, RuleEvaluationOutcome>> =>
  Object.freeze({
    ...evaluateFoundationValidationRules(),
    ...evaluateRegistryValidationRules(),
    ...evaluateModelValidationRules(),
    ...evaluateCrossPhaseValidationRules(),
  });

const buildEvidence = (
  ruleId: string,
  sourcePhase: string,
  target: string,
  expected: string,
  observed: string,
  result: ValidationResultStatus,
): KnowledgeValidationValidationEvidence =>
  Object.freeze({
    ruleId,
    sourcePhase,
    targetMetadata: target,
    expectedDeclaration: expected,
    observedDeclaration: observed,
    result,
    ownership: "DKL-5 Knowledge Validation Validation",
    runtimeDataUsed: false as const,
    immutable: true as const,
  });

const deriveOverall = (
  results: readonly KnowledgeValidationRuleResult[],
): ValidationResultStatus => {
  for (const result of results) {
    if (result.mandatory && result.status === "Fail") {
      return "Fail";
    }
  }
  return "Pass";
};

const buildCategoryResults = (
  results: readonly KnowledgeValidationRuleResult[],
): readonly KnowledgeValidationCategoryResult[] =>
  Object.freeze(
    KnowledgeValidationValidationCategories.map((category) => {
      const scoped = results.filter((result) => result.category === category);
      const passCount = scoped.filter((result) => result.status === "Pass").length;
      const failCount = scoped.filter((result) => result.status === "Fail").length;
      const notApplicableCount = scoped.filter(
        (result) => result.status === "NotApplicable",
      ).length;
      const status: ValidationResultStatus =
        failCount > 0 ? "Fail" : scoped.length === 0 ? "NotApplicable" : "Pass";
      return Object.freeze({
        category,
        ruleCount: scoped.length,
        passCount,
        failCount,
        notApplicableCount,
        status,
      });
    }),
  );

const phaseForRule = (
  sourcePhase: string,
): KnowledgeValidationPhaseResult["phase"] => {
  if (sourcePhase === "DKL-5:1") {
    return "DKL-5:1";
  }
  if (sourcePhase === "DKL-5:2") {
    return "DKL-5:2";
  }
  if (sourcePhase === "DKL-5:3") {
    return "DKL-5:3";
  }
  return "CrossPhase";
};

const buildPhaseResults = (
  results: readonly KnowledgeValidationRuleResult[],
): readonly KnowledgeValidationPhaseResult[] => {
  const phases = Object.freeze([
    "DKL-5:1",
    "DKL-5:2",
    "DKL-5:3",
    "CrossPhase",
  ] as const);
  return Object.freeze(
    phases.map((phase) => {
      const scoped = results.filter((result) => {
        const rule = KnowledgeValidationValidationRules.find(
          (candidate) => candidate.id === result.ruleId,
        );
        return rule !== undefined && phaseForRule(rule.sourcePhase) === phase;
      });
      const passCount = scoped.filter((result) => result.status === "Pass").length;
      const failCount = scoped.filter((result) => result.status === "Fail").length;
      return Object.freeze({
        phase,
        ruleCount: scoped.length,
        passCount,
        failCount,
        status: (failCount > 0 ? "Fail" : "Pass") as ValidationResultStatus,
      });
    }),
  );
};

/**
 * Deterministic architectural validation of DKL-5:1–5:3 public surfaces.
 * Pure, metadata-only, never mutates, never accepts live organizational data.
 */
export function runKnowledgeValidationValidation(): KnowledgeValidationValidationRunResult {
  const outcomes = mergeOutcomes();
  const ruleResults: readonly KnowledgeValidationRuleResult[] = Object.freeze(
    KnowledgeValidationValidationRules.map((rule) => {
      const outcome = outcomes[rule.id];
      const passed = outcome?.passed === true;
      const status: ValidationResultStatus = passed ? "Pass" : "Fail";
      const evidence = buildEvidence(
        rule.id,
        rule.sourcePhase,
        rule.target,
        rule.expectedCondition,
        outcome?.observedDeclaration ?? "missing evaluation outcome",
        status,
      );
      const failure: KnowledgeValidationValidationFailure | null = passed
        ? null
        : Object.freeze({
            ruleId: rule.id,
            category: rule.category,
            severity: rule.severity,
            failureMeaning: rule.failureMeaning,
            evidence,
          });
      return Object.freeze({
        ruleId: rule.id,
        name: rule.name,
        category: rule.category,
        severity: rule.severity,
        status,
        mandatory: true as const,
        evidence,
        failure,
      });
    }),
  );

  const passCount = ruleResults.filter((result) => result.status === "Pass").length;
  const failCount = ruleResults.filter((result) => result.status === "Fail").length;
  const notApplicableCount = ruleResults.filter(
    (result) => result.status === "NotApplicable",
  ).length;
  const overallStatus = deriveOverall(ruleResults);
  const readiness =
    overallStatus === "Pass"
      ? ("ReadyForManifest" as const)
      : ("NotReady" as const);
  const categoryResults = buildCategoryResults(ruleResults);
  const phaseResults = buildPhaseResults(ruleResults);
  const failures = Object.freeze(
    ruleResults
      .map((result) => result.failure)
      .filter(
        (failure): failure is KnowledgeValidationValidationFailure =>
          failure !== null,
      ),
  );
  const manifestReadiness: KnowledgeValidationManifestReadinessResult =
    Object.freeze({
      readiness,
      overallStatus,
      mandatoryPassCount: passCount,
      mandatoryFailCount: failCount,
      grantedOnlyWhenAllMandatoryPass: true as const,
    });
  const summary: KnowledgeValidationValidationSummary = Object.freeze({
    validationId: KnowledgeValidationValidationIdentity.validationId,
    overallStatus,
    readiness,
    ruleCount: ruleResults.length,
    passCount,
    failCount,
    notApplicableCount,
    categoryCount: KnowledgeValidationValidationCategories.length,
    categoryResults,
    phaseResults,
    manifestReadiness,
    metadataOnly: true as const,
    runtimeOrganizationalDataAccepted: false as const,
    sourceScanningUsed: false as const,
    scoringPerformed: false as const,
    trustCalculated: false as const,
    sideEffectsPerformed: false as const,
    immutable: true as const,
    deterministic: true as const,
  });

  return Object.freeze({
    validationId: KnowledgeValidationValidationIdentity.validationId,
    overallStatus,
    readiness,
    ruleResults,
    categoryResults,
    phaseResults,
    failures,
    summary,
    manifestReadiness,
    metadataOnly: true as const,
    inputMutated: false as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Pure deterministic summary helper over the architectural validation run. */
export function getKnowledgeValidationValidationSummary(): KnowledgeValidationValidationSummary {
  return runKnowledgeValidationValidation().summary;
}

const CANONICAL_RESULT = runKnowledgeValidationValidation();

/** Canonical immutable Knowledge Validation Validation aggregate. */
export const KnowledgeValidationValidation = Object.freeze({
  identity: KnowledgeValidationValidationIdentity,
  version: KnowledgeValidationValidationVersion,
  namespace: KnowledgeValidationValidationNamespace,
  rules: KnowledgeValidationValidationRules,
  categories: KnowledgeValidationValidationCategories,
  result: CANONICAL_RESULT,
  summary: CANONICAL_RESULT.summary,
  foundation: Object.freeze({
    identity: KnowledgeValidationFoundationIdentity,
    version: KnowledgeValidationFoundationVersion,
  }),
  registry: Object.freeze({
    identity: KnowledgeValidationRegistryIdentity,
    version: KnowledgeValidationRegistryVersion,
  }),
  model: Object.freeze({
    identity: KnowledgeValidationModelIdentity,
    version: KnowledgeValidationModelVersion,
  }),
  ownership: Object.freeze({
    ownershipId: "DKL-5:4/ValidationOwnership",
    owner: "DKL-5 Knowledge Validation Validation",
    sourcePhase: "DKL-5:4",
    owns: Object.freeze([
      "Architectural validation rules for DKL-5",
      "Validation categories",
      "Deterministic metadata checks",
      "Validation result models",
      "Validation evidence",
      "Cross-phase consistency checks",
      "Architectural prohibition checks",
      "Readiness determination for DKL-5:5",
    ]),
    doesNotOwn: Object.freeze([
      "Live knowledge validation",
      "Runtime Business Object validation",
      "Source-data validation",
      "Data cleansing",
      "Score calculation",
      "Trust calculation",
      "Entity resolution",
      "Semantic verification",
      "Conflict resolution",
      "Ambiguity resolution",
      "Remediation",
      "Persistence integrity",
      "Query correctness",
      "Executive decision validation",
      "Engine certification",
      "Advisor validation",
      "Scene validation",
      "UI validation",
      "Workflow execution",
    ]),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  dependencies: Object.freeze({
    dependencyId: "DKL-5:4/ValidationDependencies",
    approved: Object.freeze([
      Object.freeze({
        module: "knowledgeValidationFoundation.ts",
        required: true,
        publicEntryPointOnly: true,
      }),
      Object.freeze({
        module: "knowledgeValidationRegistry.ts",
        required: true,
        publicEntryPointOnly: true,
      }),
      Object.freeze({
        module: "knowledgeValidationModel.ts",
        required: true,
        publicEntryPointOnly: true,
      }),
    ]),
    approvedDependencyCount: 3,
    noDirectDkl4Dependency: true,
    noInternalPriorPhaseImports: true,
    noFutureDkl5Dependency: true,
    noSourceInspection: true,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  guarantees: Object.freeze({
    uniqueRuleIds: true,
    oneCategoryPerRule: true,
    everyCategoryHasAtLeastOneRule: true,
    deterministicOrdering: true,
    oneResultPerRule: true,
    evidenceForEveryMandatoryRule: true,
    accurateCategoryTotals: true,
    accurateSummaryTotals: true,
    overallStatusFromMandatoryResultsOnly: true,
    readinessOnlyWhenAllMandatoryPass: true,
    noHiddenRules: true,
    noRuntimeOrganizationalData: true,
    noSourceInspection: true,
    noMutation: true,
    noScoring: true,
    noTrustCalculation: true,
    noAi: true,
    noSideEffects: true,
  }),
  readiness: Object.freeze({
    ValidationComplete: true,
    ReadyForManifest: CANONICAL_RESULT.readiness === "ReadyForManifest",
    OverallPass: CANONICAL_RESULT.overallStatus === "Pass",
    MetadataOnly: true,
    LiveKnowledgeValidationForbidden: true,
    SourceScanningForbidden: true,
    ScoringForbidden: true,
    TrustCalculationForbidden: true,
    RemediationForbidden: true,
    MutationForbidden: true,
    AiForbidden: true,
    Deterministic: true,
    Immutable: true,
  }),
  completionStatus: Object.freeze([
    "ValidationComplete",
    "RulesCatalogued",
    "ArchitectureValidated",
    "OverallPass",
    "ReadyForManifest",
  ]),
  nextPhase: "DKL-5:5 — Knowledge Validation Manifest",
  metadataOnly: true,
  validationOnly: true,
  immutable: true,
  deterministic: true,
});
