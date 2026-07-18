/**
 * DKL-5:4 — Foundation architectural checks.
 *
 * Pure deterministic evaluations over KnowledgeValidationFoundation exports.
 * Ownership: owned exclusively by DKL-5:4.
 */

import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";
import type { RuleEvaluationOutcome } from "./knowledgeValidationValidationTypes.ts";

const noOverlap = (owns: readonly string[], doesNotOwn: readonly string[]): boolean => {
  const set = new Set(owns.map((s) => s.toLowerCase()));
  for (const item of doesNotOwn) {
    if (set.has(item.toLowerCase())) {
      return false;
    }
  }
  return true;
};

/** Evaluate Foundation-scoped architectural rules. */
export const evaluateFoundationValidationRules = (): Readonly<
  Record<string, RuleEvaluationOutcome>
> => {
  const identity = KnowledgeValidationFoundation.identity;
  const contracts = KnowledgeValidationFoundation.contracts;
  const lifecycle = KnowledgeValidationFoundation.lifecycle;
  const boundaries = KnowledgeValidationFoundation.boundaries;
  const ownership = KnowledgeValidationFoundation.ownership;
  const dependencies = KnowledgeValidationFoundation.dependencies;
  const evidenceNotes = contracts.evidenceAndFindings.notes;

  const identityOk =
    identity.status === "FoundationComplete" &&
    identity.readiness === "ReadyForRegistry" &&
    identity.foundationVersion.length > 0 &&
    identity.foundationNamespace.includes("knowledge-validation");

  const contractsOk =
    contracts.contractKinds.length === 20 &&
    contracts.trustDeclaration !== undefined &&
    contracts.evidenceAndFindings.validationFinding.length > 0 &&
    contracts.ambiguityAndConflict !== undefined &&
    contracts.noScoreCalculation === true &&
    contracts.noTrustCalculation === true;

  const lifecycleOk =
    lifecycle.stateCount === 11 &&
    lifecycle.notes.metadataOnly === true &&
    lifecycle.notes.transitionExecutionForbidden === true;

  const boundariesOk =
    boundaries.dataCleansingExcluded === true &&
    boundaries.runtimeValidationExecutionExcluded === true &&
    boundaries.aiConfidenceGenerationExcluded === true &&
    boundaries.calculatesScores === false &&
    boundaries.calculatesTrustAutomatically === false &&
    boundaries.persistenceExcluded === true &&
    boundaries.engineReasoningExcluded === true;

  const ownershipOk =
    ownership.owns.length >= 1 &&
    ownership.doesNotOwn.length >= 1 &&
    noOverlap([...ownership.owns], [...ownership.doesNotOwn]);

  const dep = dependencies.allowed[0];
  const dependencyOk =
    dep !== undefined &&
    dep.module === "knowledgeModelingPublicIndex.ts" &&
    dep.publicEntryPointOnly === true;

  return Object.freeze({
    "KV-VAL-ID-001": Object.freeze({
      passed: identityOk,
      observedDeclaration: `status=${identity.status}; readiness=${identity.readiness}; version=${identity.foundationVersion}; namespace=${identity.foundationNamespace}`,
    }),
    "KV-VAL-FND-001": Object.freeze({
      passed: contractsOk,
      observedDeclaration: `contractKinds=${contracts.contractKinds.length}; trustDeclaration=${String(!!contracts.trustDeclaration)}; noScoreCalculation=${String(contracts.noScoreCalculation)}; noTrustCalculation=${String(contracts.noTrustCalculation)}`,
    }),
    "KV-VAL-FND-002": Object.freeze({
      passed: lifecycleOk,
      observedDeclaration: `stateCount=${lifecycle.stateCount}; transitionExecutionForbidden=${String(lifecycle.notes.transitionExecutionForbidden)}`,
    }),
    "KV-VAL-FND-003": Object.freeze({
      passed: boundariesOk,
      observedDeclaration: `dataCleansingExcluded=${String(boundaries.dataCleansingExcluded)}; runtimeValidationExecutionExcluded=${String(boundaries.runtimeValidationExecutionExcluded)}; calculatesScores=${String(boundaries.calculatesScores)}; calculatesTrustAutomatically=${String(boundaries.calculatesTrustAutomatically)}`,
    }),
    "KV-VAL-TGT-001": Object.freeze({
      passed: contracts.targetCategories.length === 19,
      observedDeclaration: `targetCategories.length=${contracts.targetCategories.length}`,
    }),
    "KV-VAL-DIM-001": Object.freeze({
      passed: contracts.dimensions.length === 20,
      observedDeclaration: `dimensions.length=${contracts.dimensions.length}`,
    }),
    "KV-VAL-SIG-001": Object.freeze({
      passed: contracts.qualitySignals.length === 20,
      observedDeclaration: `qualitySignals.length=${contracts.qualitySignals.length}`,
    }),
    "KV-VAL-TRU-001": Object.freeze({
      passed: contracts.trustDeclaration !== undefined && contracts.noTrustCalculation === true,
      observedDeclaration: `trustDeclaration=${String(!!contracts.trustDeclaration)}; noTrustCalculation=${String(contracts.noTrustCalculation)}`,
    }),
    "KV-VAL-OUT-001": Object.freeze({
      passed: contracts.outcomes.length === 11,
      observedDeclaration: `outcomes.length=${contracts.outcomes.length}`,
    }),
    "KV-VAL-SEV-001": Object.freeze({
      passed: contracts.severities.length === 6,
      observedDeclaration: `severities.length=${contracts.severities.length}`,
    }),
    "KV-VAL-EVD-001": Object.freeze({
      passed:
        contracts.evidenceAndFindings.validationEvidence.length > 0 &&
        evidenceNotes.evidenceReferencedNotCopied === true,
      observedDeclaration: `validationEvidenceFields=${contracts.evidenceAndFindings.validationEvidence.length}; evidenceReferencedNotCopied=${String(evidenceNotes.evidenceReferencedNotCopied)}`,
    }),
    "KV-VAL-FNDG-001": Object.freeze({
      passed:
        contracts.evidenceAndFindings.validationFinding.length > 0 &&
        evidenceNotes.findingsExplainable === true &&
        evidenceNotes.findingsTraceable === true,
      observedDeclaration: `validationFindingFields=${contracts.evidenceAndFindings.validationFinding.length}; findingsExplainable=${String(evidenceNotes.findingsExplainable)}; findingsTraceable=${String(evidenceNotes.findingsTraceable)}`,
    }),
    "KV-VAL-AMB-001": Object.freeze({
      passed: contracts.ambiguityAndConflict !== undefined,
      observedDeclaration: `ambiguityAndConflict=${String(!!contracts.ambiguityAndConflict)}`,
    }),
    "KV-VAL-OWN-001": Object.freeze({
      passed: ownershipOk,
      observedDeclaration: `owns=${ownership.owns.length}; doesNotOwn=${ownership.doesNotOwn.length}; intersectionEmpty=${String(ownershipOk)}`,
    }),
    "KV-VAL-DEP-001": Object.freeze({
      passed: dependencyOk,
      observedDeclaration: `module=${dep?.module ?? "missing"}; publicEntryPointOnly=${String(dep?.publicEntryPointOnly ?? false)}`,
    }),
    "KV-VAL-CMP-001": Object.freeze({
      passed: contracts.compatibilityPolicies.length >= 1,
      observedDeclaration: `compatibilityPolicies.length=${contracts.compatibilityPolicies.length}`,
    }),
    "KV-VAL-EXT-001": Object.freeze({
      passed: contracts.extensionPolicies.length >= 1,
      observedDeclaration: `extensionPolicies.length=${contracts.extensionPolicies.length}`,
    }),
  });
};
