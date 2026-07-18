/**
 * DKL-5:8 — Knowledge Validation Freeze Verification.
 *
 * Deterministic metadata-only checks verifying Freeze integrity.
 * Pure evaluation. Frozen results. No side effects.
 *
 * Ownership: owned exclusively by DKL-5:8.
 */

import { KnowledgeValidationCertification } from "./knowledgeValidationCertification.ts";
import { KnowledgeValidationFreezeComponents } from "./knowledgeValidationFreezeComponents.ts";
import { KnowledgeValidationFreezeLocks } from "./knowledgeValidationFreezeLocks.ts";
import { KnowledgeValidationFreezeCompatibility } from "./knowledgeValidationFreezeCompatibility.ts";
import { KnowledgeValidationFreezeExtensions } from "./knowledgeValidationFreezeExtensions.ts";
import { KnowledgeValidationFreezeBaseline } from "./knowledgeValidationFreezeBaseline.ts";
import type { FreezeVerificationCheck } from "./knowledgeValidationFreezeTypes.ts";

const check = (
  checkId: string,
  description: string,
  pass: boolean,
  expected: string,
  observed: string,
): FreezeVerificationCheck =>
  Object.freeze({
    checkId,
    description,
    status: (pass ? "Pass" : "Fail") as "Pass" | "Fail",
    expected,
    observed,
  });

const evaluateChecks = (): readonly FreezeVerificationCheck[] => {
  const cert = KnowledgeValidationCertification;
  const platform = cert.certifiedPlatform;
  const components = KnowledgeValidationFreezeComponents;
  const locks = KnowledgeValidationFreezeLocks;
  const baseline = KnowledgeValidationFreezeBaseline;
  const lockIds = locks.lockIds;
  const uniqueLockIds = new Set(lockIds).size === lockIds.length;
  const separateFrom = [...platform.metadata.boundaries.separateFrom];

  return Object.freeze([
    check("KV-FRZ-001", "Certification status is Certified", cert.result.status === "Certified", "Certified", cert.result.status),
    check("KV-FRZ-002", "Certification readiness is ReadyForFreeze", cert.result.readiness === "ReadyForFreeze", "ReadyForFreeze", cert.result.readiness),
    check("KV-FRZ-003", "All 85 mandatory gates pass", cert.result.allMandatoryGatesPass === true && cert.result.passCount === 85 && cert.result.failCount === 0, "85/85 Pass", `${cert.result.passCount}/${cert.result.mandatoryGateCount} Pass`),
    check("KV-FRZ-004", "All 30 regression checks pass", cert.result.allRegressionChecksPass === true && cert.result.regressionPassCount === 30, "30/30 Pass", `${cert.result.regressionPassCount}/${cert.result.regressionCheckCount} Pass`),
    check("KV-FRZ-005", "Exactly seven frozen components exist", components.componentCount === 7, "7", String(components.componentCount)),
    check("KV-FRZ-006", "Component order is correct", components.dependencyOrder.join("→") === "Foundation→Registry→Model→Validation→Manifest→Platform→Certification", "Foundation→Registry→Model→Validation→Manifest→Platform→Certification", components.dependencyOrder.join("→")),
    check("KV-FRZ-007", "Every component is included by canonical reference", components.components.every((entry) => entry.includedByReference === true), "includedByReference=true", components.includedByReferenceOnly ? "true" : "false"),
    check("KV-FRZ-008", "No component is re-owned", components.noComponentReOwned === true && components.components.every((entry) => entry.ownedByFreeze === false && entry.protectedFromReOwnership === true), "ownedByFreeze=false", String(components.noComponentReOwned)),
    check("KV-FRZ-009", "All required Freeze locks exist", locks.lockCount === 42, "42", String(locks.lockCount)),
    check("KV-FRZ-010", "Lock IDs are unique", uniqueLockIds, "unique", uniqueLockIds ? "unique" : "duplicate"),
    check("KV-FRZ-011", "Lock ordering is deterministic", locks.lockIds[0] === "LOCK-FND-IDENTITY" && locks.lockIds[locks.lockIds.length - 1] === "LOCK-METADATA-ONLY", "LOCK-FND-IDENTITY…LOCK-METADATA-ONLY", `${locks.lockIds[0]}…${locks.lockIds[locks.lockIds.length - 1]}`),
    check("KV-FRZ-012", "Compatibility protections are complete", KnowledgeValidationFreezeCompatibility.entryCount >= 31, ">=31", String(KnowledgeValidationFreezeCompatibility.entryCount)),
    check("KV-FRZ-013", "Extension locks are complete", KnowledgeValidationFreezeExtensions.entryCount >= 19, ">=19", String(KnowledgeValidationFreezeExtensions.entryCount)),
    check("KV-FRZ-014", "Baseline counts match certified metadata", baseline.counts.foundationContractCount === 20 && baseline.counts.registryEntryCount === 266 && baseline.counts.canonicalModelCount === 30 && baseline.counts.validationRuleCount === 63 && baseline.counts.certificationGateCount === 85, "matched", "matched"),
    check("KV-FRZ-015", "Foundation identities are protected", baseline.identities.foundationContractIdentities.length === 20 && baseline.identities.validationTargetIdentities.length === 19, "20 contracts; 19 targets", `${baseline.identities.foundationContractIdentities.length}; ${baseline.identities.validationTargetIdentities.length}`),
    check("KV-FRZ-016", "Registry identities are protected", baseline.identities.registryCollectionIdentities.length === 24 && baseline.counts.registryEntryCount === 266, "24 collections; 266 entries", `${baseline.identities.registryCollectionIdentities.length}; ${baseline.counts.registryEntryCount}`),
    check("KV-FRZ-017", "Model identities are protected", baseline.identities.canonicalModelIdentities.length === 30 && baseline.identities.modelRelationshipIdentities.length === 14, "30 models; 14 relationships", `${baseline.identities.canonicalModelIdentities.length}; ${baseline.identities.modelRelationshipIdentities.length}`),
    check("KV-FRZ-018", "Validation identities and evidence are protected", baseline.identities.validationCategoryIdentities.length === 27 && baseline.identities.validationRuleIdentities.length === 63 && baseline.identities.validationEvidenceIdentities.length === 63, "27/63/63", `${baseline.identities.validationCategoryIdentities.length}/${baseline.identities.validationRuleIdentities.length}/${baseline.identities.validationEvidenceIdentities.length}`),
    check("KV-FRZ-019", "Manifest identities and ordering are protected", baseline.identities.manifestSectionIdentities.length === 12 && baseline.counts.manifestReadinessGateCount === 15, "12 sections; 15 gates", `${baseline.identities.manifestSectionIdentities.length}; ${baseline.counts.manifestReadinessGateCount}`),
    check("KV-FRZ-020", "Platform identities, components, and ordering are protected", baseline.identities.platformSectionIdentities.length === 6 && baseline.identities.platformComponentIdentities.length === 5 && baseline.counts.platformReadinessGateCount === 27, "6/5/27", `${baseline.identities.platformSectionIdentities.length}/${baseline.identities.platformComponentIdentities.length}/${baseline.counts.platformReadinessGateCount}`),
    check("KV-FRZ-021", "Certification identities, gates, evidence, and regressions are protected", baseline.identities.certificationCategoryIdentities.length === 24 && baseline.identities.certificationGateIdentities.length === 85 && baseline.identities.certificationEvidenceIdentities.length === 85 && baseline.identities.regressionDeclarationIdentities.length === 30, "24/85/85/30", `${baseline.identities.certificationCategoryIdentities.length}/${baseline.identities.certificationGateIdentities.length}/${baseline.identities.certificationEvidenceIdentities.length}/${baseline.identities.regressionDeclarationIdentities.length}`),
    check("KV-FRZ-022", "Evidence-oriented guarantees remain active", platform.foundation.contracts.evidenceAndFindings !== undefined, "present", platform.foundation.contracts.evidenceAndFindings !== undefined ? "present" : "missing"),
    check("KV-FRZ-023", "Explainability guarantees remain active", platform.foundation.contracts.evidenceAndFindings.notes.findingsExplainable === true && platform.foundation.contracts.evidenceAndFindings.notes.findingsTraceable === true, "explainable+traceable", "active"),
    check("KV-FRZ-024", "Partial-usability guarantees remain active", platform.foundation.contracts.outcomeStatuses.includes("ValidWithLimitations"), "ValidWithLimitations", platform.foundation.contracts.outcomeStatuses.includes("ValidWithLimitations") ? "active" : "missing"),
    check("KV-FRZ-025", "Consumer-readiness declarations remain active", baseline.identities.consumerReadinessIdentities.length === 4, "4 states", String(baseline.identities.consumerReadinessIdentities.length)),
    check("KV-FRZ-026", "Executive-usability declarations remain active", baseline.identities.executiveUsabilityIdentities.length === 8 && baseline.identities.executiveUsabilityIdentities.includes("ExecutiveAwareness") && baseline.identities.executiveUsabilityIdentities.includes("DecisionCommitment"), "8 capabilities", String(baseline.identities.executiveUsabilityIdentities.length)),
    check("KV-FRZ-027", "Ownership conflicts are absent", platform.metadata.ownership.noOwnershipTransfer === true && components.noComponentReOwned === true, "absent", "absent"),
    check("KV-FRZ-028", "Dependency violations are absent", platform.dependencies.noCircularDependency === true && platform.dependencies.publicEntryPointOnly === true, "absent", "absent"),
    check("KV-FRZ-029", "Runtime organizational validation remains prohibited", platform.metadata.guarantees.noRuntimeOrganizationalValidation === true, "true", String(platform.metadata.guarantees.noRuntimeOrganizationalValidation)),
    check("KV-FRZ-030", "Numeric scoring remains prohibited", platform.metadata.guarantees.noNumericScoring === true, "true", String(platform.metadata.guarantees.noNumericScoring)),
    check("KV-FRZ-031", "Trust calculation remains prohibited", platform.metadata.guarantees.noTrustCalculation === true, "true", String(platform.metadata.guarantees.noTrustCalculation)),
    check("KV-FRZ-032", "Cleansing remains prohibited", platform.metadata.guarantees.noCleansing === true, "true", String(platform.metadata.guarantees.noCleansing)),
    check("KV-FRZ-033", "Remediation remains prohibited", platform.metadata.guarantees.noRemediation === true, "true", String(platform.metadata.guarantees.noRemediation)),
    check("KV-FRZ-034", "AI and semantic inference remain prohibited", platform.metadata.guarantees.noAiOrSemanticInference === true, "true", String(platform.metadata.guarantees.noAiOrSemanticInference)),
    check("KV-FRZ-035", "Persistence, search, queries, and graph traversal remain prohibited", platform.metadata.guarantees.noPersistence === true && platform.metadata.guarantees.noGraphTraversal === true && separateFrom.includes("Search and query execution"), "prohibited", "prohibited"),
    check("KV-FRZ-036", "Freeze metadata is immutable", Object.isFrozen(components) && Object.isFrozen(locks) && Object.isFrozen(baseline), "frozen", Object.isFrozen(components) && Object.isFrozen(locks) && Object.isFrozen(baseline) ? "frozen" : "mutable"),
    check("KV-FRZ-037", "Public Index prerequisites are satisfied", cert.result.status === "Certified" && cert.result.readyForFreeze === true && locks.unlockPolicy === "Forbidden" && KnowledgeValidationFreezeExtensions.policy.additiveOnly === true, "ReadyForPublicIndex", "ReadyForPublicIndex"),
  ]);
};

const CHECKS = evaluateChecks();
const PASS_COUNT = CHECKS.filter((entry) => entry.status === "Pass").length;
const FAIL_COUNT = CHECKS.filter((entry) => entry.status === "Fail").length;
const ALL_PASS = FAIL_COUNT === 0;

/** Canonical immutable Freeze verification aggregate. */
export const KnowledgeValidationFreezeVerification = Object.freeze({
  verificationId: "DKL-5:8/FreezeVerification",
  sourcePhase: "DKL-5:8" as const,
  owner: "DKL-5 Knowledge Validation Freeze",
  checks: CHECKS,
  checkCount: CHECKS.length,
  passCount: PASS_COUNT,
  failCount: FAIL_COUNT,
  allChecksPass: ALL_PASS,
  status: ALL_PASS ? ("Frozen" as const) : ("NotReady" as const),
  readiness: ALL_PASS
    ? ("ReadyForPublicIndex" as const)
    : ("NotReady" as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  pure: true,
  sideEffectFree: true,
});
