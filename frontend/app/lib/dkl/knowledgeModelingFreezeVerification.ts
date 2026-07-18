/**
 * DKL-4:8 — Knowledge Modeling Freeze Verification.
 *
 * Deterministic metadata-only checks verifying Freeze integrity.
 * Pure evaluation. Frozen results. No side effects.
 *
 * Ownership: owned exclusively by DKL-4:8.
 */

import { KnowledgeModelingCertification } from "./knowledgeModelingCertification.ts";
import { KnowledgeModelingFreezeComponents } from "./knowledgeModelingFreezeComponents.ts";
import { KnowledgeModelingFreezeLocks } from "./knowledgeModelingFreezeLocks.ts";
import { KnowledgeModelingFreezeCompatibility } from "./knowledgeModelingFreezeCompatibility.ts";
import { KnowledgeModelingFreezeExtensions } from "./knowledgeModelingFreezeExtensions.ts";
import { KnowledgeModelingFreezeBaseline } from "./knowledgeModelingFreezeBaseline.ts";
import type { FreezeVerificationCheck } from "./knowledgeModelingFreezeTypes.ts";

const check = (
  checkId: string,
  name: string,
  pass: boolean,
  expected: string,
  observed: string,
): FreezeVerificationCheck =>
  Object.freeze({
    checkId,
    name,
    status: (pass ? "Pass" : "Fail") as "Pass" | "Fail",
    expected,
    observed,
  });

const evaluateChecks = (): readonly FreezeVerificationCheck[] => {
  const cert = KnowledgeModelingCertification;
  const platform = cert.certifiedPlatform;
  const components = KnowledgeModelingFreezeComponents;
  const locks = KnowledgeModelingFreezeLocks;
  const baseline = KnowledgeModelingFreezeBaseline;
  const lockIds = locks.lockIds;
  const uniqueLockIds = new Set(lockIds).size === lockIds.length;
  const lockTargets = locks.locks.map((l) => l.target);
  const uniqueLockTargets = new Set(lockTargets).size === lockTargets.length;

  return Object.freeze([
    check(
      "KM-FRZ-001",
      "Certification status is Certified",
      cert.result.status === "Certified",
      "Certified",
      cert.result.status,
    ),
    check(
      "KM-FRZ-002",
      "Certification readiness is ReadyForFreeze",
      cert.result.readiness === "ReadyForFreeze",
      "ReadyForFreeze",
      cert.result.readiness,
    ),
    check(
      "KM-FRZ-003",
      "All 50 mandatory gates pass",
      cert.result.allMandatoryGatesPass === true && cert.result.failCount === 0,
      "50/50 Pass",
      `${cert.result.passCount}/${cert.result.mandatoryGateCount} Pass`,
    ),
    check(
      "KM-FRZ-004",
      "All 15 regression checks pass",
      cert.result.allRegressionChecksPass === true &&
        cert.result.regressionPassCount === 15,
      "15/15 Pass",
      `${cert.result.regressionPassCount}/${cert.result.regressionCheckCount} Pass`,
    ),
    check(
      "KM-FRZ-005",
      "Seven frozen components exist",
      components.componentCount === 7,
      "7",
      String(components.componentCount),
    ),
    check(
      "KM-FRZ-006",
      "Component order is correct",
      components.dependencyOrder.join("→") ===
        "Foundation→Registry→Model→Validation→Manifest→Platform→Certification",
      "Foundation→Registry→Model→Validation→Manifest→Platform→Certification",
      components.dependencyOrder.join("→"),
    ),
    check(
      "KM-FRZ-007",
      "All components are included by reference",
      components.components.every((c) => c.includedByReference === true),
      "includedByReference=true",
      components.includedByReferenceOnly ? "true" : "false",
    ),
    check(
      "KM-FRZ-008",
      "No component is re-owned",
      components.noComponentReOwned === true &&
        components.components.every((c) => c.protectedFromReOwnership === true),
      "noComponentReOwned=true",
      String(components.noComponentReOwned),
    ),
    check(
      "KM-FRZ-009",
      "All required locks exist",
      locks.lockCount === 20,
      "20",
      String(locks.lockCount),
    ),
    check(
      "KM-FRZ-010",
      "Lock IDs are unique",
      uniqueLockIds,
      "unique",
      uniqueLockIds ? "unique" : "duplicate",
    ),
    check(
      "KM-FRZ-011",
      "Lock targets are unique where required",
      uniqueLockTargets,
      "unique targets",
      uniqueLockTargets ? "unique" : "duplicate",
    ),
    check(
      "KM-FRZ-012",
      "Compatibility protections are complete",
      KnowledgeModelingFreezeCompatibility.entryCount >= 16,
      ">=16",
      String(KnowledgeModelingFreezeCompatibility.entryCount),
    ),
    check(
      "KM-FRZ-013",
      "Extension locks are complete",
      KnowledgeModelingFreezeExtensions.entryCount >= 8,
      ">=8",
      String(KnowledgeModelingFreezeExtensions.entryCount),
    ),
    check(
      "KM-FRZ-014",
      "Baseline counts match certified metadata",
      baseline.counts.registryCategoryCount === 18 &&
        baseline.counts.registryEntryCount === 129 &&
        baseline.counts.businessObjectCategoryCount === 26 &&
        baseline.counts.relationshipCategoryCount === 20 &&
        baseline.counts.canonicalModelCount === 20 &&
        baseline.counts.validationRuleCount === 24 &&
        baseline.counts.certificationGateCount === 50 &&
        baseline.counts.regressionDeclarationCount === 15,
      "certified counts",
      "matched",
    ),
    check(
      "KM-FRZ-015",
      "Ownership conflicts are absent",
      platform.metadata.ownership.noDuplicatedOwnership === true,
      "true",
      String(platform.metadata.ownership.noDuplicatedOwnership),
    ),
    check(
      "KM-FRZ-016",
      "Dependency violations are absent",
      platform.dependencies.noCircularDependency === true &&
        platform.dependencies.publicEntryPointOnly === true,
      "no violations",
      "absent",
    ),
    check(
      "KM-FRZ-017",
      "Runtime prohibitions remain active",
      platform.metadata.guarantees.noRuntimeBehavior === true,
      "true",
      String(platform.metadata.guarantees.noRuntimeBehavior),
    ),
    check(
      "KM-FRZ-018",
      "Metadata-only guarantees remain active",
      platform.metadataOnly === true && cert.metadataOnly === true,
      "true",
      String(platform.metadataOnly && cert.metadataOnly),
    ),
    check(
      "KM-FRZ-019",
      "Freeze structures are immutable",
      Object.isFrozen(components) &&
        Object.isFrozen(locks) &&
        Object.isFrozen(baseline),
      "frozen",
      "frozen",
    ),
    check(
      "KM-FRZ-020",
      "Public Index prerequisites are satisfied",
      cert.result.readyForFreeze === true &&
        cert.result.status === "Certified" &&
        locks.allLocked === true,
      "ReadyForPublicIndex prerequisites",
      "satisfied",
    ),
  ]);
};

const CHECKS = evaluateChecks();
const PASS_COUNT = CHECKS.filter((c) => c.status === "Pass").length;
const FAIL_COUNT = CHECKS.filter((c) => c.status === "Fail").length;

/** Canonical immutable Freeze verification aggregate. */
export const KnowledgeModelingFreezeVerification = Object.freeze({
  verificationId: "DKL-4:8/FreezeVerification",
  sourcePhase: "DKL-4:8" as const,
  checks: CHECKS,
  checkCount: CHECKS.length,
  passCount: PASS_COUNT,
  failCount: FAIL_COUNT,
  allChecksPass: FAIL_COUNT === 0,
  status: FAIL_COUNT === 0 ? ("Frozen" as const) : ("NotReady" as const),
  readiness:
    FAIL_COUNT === 0
      ? ("ReadyForPublicIndex" as const)
      : ("NotReady" as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  pure: true,
  sideEffectFree: true,
});
