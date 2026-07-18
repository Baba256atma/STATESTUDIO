/**
 * DKL-6:4 — Knowledge Repository Foundation Validation.
 *
 * Exactly five Foundation integrity rules. Metadata evaluation only.
 *
 * Ownership: owned exclusively by DKL-6:4.
 */

import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
  KnowledgeRepositoryFoundationStatus,
} from "./knowledgeRepositoryFoundation.ts";
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
    category: "Foundation" as const,
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

const identityPass =
  KnowledgeRepositoryFoundationId ===
    "DKL-6:1/KnowledgeRepositoryFoundation" &&
  KnowledgeRepositoryFoundation.foundationId === KnowledgeRepositoryFoundationId;

const statusPass =
  KnowledgeRepositoryFoundationStatus === "Foundation" &&
  KnowledgeRepositoryFoundation.status === "Foundation";

const capabilityPass =
  KnowledgeRepositoryFoundation.contracts.capabilityCount === 9 &&
  KnowledgeRepositoryFoundation.contracts.capabilities.length === 9;

const contractPass =
  KnowledgeRepositoryFoundation.contracts.contractCount === 8 &&
  KnowledgeRepositoryFoundation.contracts.contracts.length === 8;

const lifecyclePolicyPass =
  KnowledgeRepositoryFoundation.lifecycle.stateCount === 7 &&
  KnowledgeRepositoryFoundation.lifecycle.states.length === 7 &&
  KnowledgeRepositoryFoundation.policies.policyCount === 6 &&
  KnowledgeRepositoryFoundation.policies.policies.length === 6;

/** Exactly five Foundation validation rules. */
export const KnowledgeRepositoryFoundationValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-FND-001",
      "Foundation Identity",
      "Foundation identity equals DKL-6:1/KnowledgeRepositoryFoundation.",
      KnowledgeRepositoryFoundationId,
      "DKL-6:1/KnowledgeRepositoryFoundation",
      KnowledgeRepositoryFoundationId,
      identityPass ? "Pass" : "Fail",
      "Critical",
      1,
    ),
    rule(
      "DKL6-VAL-FND-002",
      "Foundation Status",
      "Foundation status equals Foundation.",
      KnowledgeRepositoryFoundationId,
      "Foundation",
      KnowledgeRepositoryFoundation.status,
      statusPass ? "Pass" : "Fail",
      "Critical",
      2,
    ),
    rule(
      "DKL6-VAL-FND-003",
      "Foundation Capability Completeness",
      "Foundation declares exactly nine capabilities.",
      `${KnowledgeRepositoryFoundationId}#capabilities`,
      "9",
      String(KnowledgeRepositoryFoundation.contracts.capabilityCount),
      capabilityPass ? "Pass" : "Fail",
      "Critical",
      3,
    ),
    rule(
      "DKL6-VAL-FND-004",
      "Foundation Contract Completeness",
      "Foundation declares exactly eight contracts.",
      `${KnowledgeRepositoryFoundationId}#contracts`,
      "8",
      String(KnowledgeRepositoryFoundation.contracts.contractCount),
      contractPass ? "Pass" : "Fail",
      "Critical",
      4,
    ),
    rule(
      "DKL6-VAL-FND-005",
      "Foundation Policy and Lifecycle Completeness",
      "Foundation declares seven lifecycle states and six policies.",
      `${KnowledgeRepositoryFoundationId}#lifecycle+policies`,
      "lifecycle=7;policies=6",
      `lifecycle=${KnowledgeRepositoryFoundation.lifecycle.stateCount};policies=${KnowledgeRepositoryFoundation.policies.policyCount}`,
      lifecyclePolicyPass ? "Pass" : "Fail",
      "Critical",
      5,
    ),
  ]);

/** Foundation validation section. */
export const KnowledgeRepositoryFoundationValidation = Object.freeze({
  category: "Foundation" as const,
  rules: KnowledgeRepositoryFoundationValidationRules,
  ruleCount: KnowledgeRepositoryFoundationValidationRules.length,
  passedRuleCount: KnowledgeRepositoryFoundationValidationRules.filter(
    (item) => item.status === "Pass",
  ).length,
  failedRuleCount: KnowledgeRepositoryFoundationValidationRules.filter(
    (item) => item.status === "Fail",
  ).length,
  metadataOnly: true as const,
  immutable: true as const,
});
