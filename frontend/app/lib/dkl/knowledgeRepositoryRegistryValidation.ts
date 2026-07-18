/**
 * DKL-6:4 — Knowledge Repository Registry Validation.
 *
 * Exactly five Registry integrity rules. Metadata evaluation only.
 *
 * Ownership: owned exclusively by DKL-6:4.
 */

import {
  getKnowledgeRepositoryRegistryEntryCount,
  getKnowledgeRepositoryRegistrySummary,
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
  KnowledgeRepositoryRegistryStatus,
} from "./knowledgeRepositoryRegistry.ts";
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
    category: "Registry" as const,
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

const collectRegistryEntries = () =>
  Object.freeze([
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

const registryEntries = collectRegistryEntries();
const entryCount = getKnowledgeRepositoryRegistryEntryCount();
const summary = getKnowledgeRepositoryRegistrySummary();

const identityPass =
  KnowledgeRepositoryRegistryId === "DKL-6:2/KnowledgeRepositoryRegistry" &&
  KnowledgeRepositoryRegistry.identity.registryId ===
    KnowledgeRepositoryRegistryId;

const statusPass =
  KnowledgeRepositoryRegistryStatus === "Registered" &&
  KnowledgeRepositoryRegistry.identity.status === "Registered";

const entryCompletenessPass = entryCount === 103 && registryEntries.length === 103;

const groupCompletenessPass = summary.registryGroupCount === 16;

const entryIntegrityPass = registryEntries.every(
  (entry) =>
    entry.owner === "DKL-6" &&
    entry.status === "Registered" &&
    entry.runtimeBehavior === "None",
);

/** Exactly five Registry validation rules. */
export const KnowledgeRepositoryRegistryValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-REG-001",
      "Registry Identity",
      "Registry identity equals DKL-6:2/KnowledgeRepositoryRegistry.",
      KnowledgeRepositoryRegistryId,
      "DKL-6:2/KnowledgeRepositoryRegistry",
      KnowledgeRepositoryRegistryId,
      identityPass ? "Pass" : "Fail",
      "Critical",
      1,
    ),
    rule(
      "DKL6-VAL-REG-002",
      "Registry Status",
      "Registry status equals Registered.",
      KnowledgeRepositoryRegistryId,
      "Registered",
      KnowledgeRepositoryRegistry.identity.status,
      statusPass ? "Pass" : "Fail",
      "Critical",
      2,
    ),
    rule(
      "DKL6-VAL-REG-003",
      "Registry Entry Completeness",
      "Registry declares exactly 103 entries.",
      KnowledgeRepositoryRegistryId,
      "103",
      String(entryCount),
      entryCompletenessPass ? "Pass" : "Fail",
      "Critical",
      3,
    ),
    rule(
      "DKL6-VAL-REG-004",
      "Registry Group Completeness",
      "Registry declares exactly 16 ordered content groups.",
      KnowledgeRepositoryRegistryId,
      "16",
      String(summary.registryGroupCount),
      groupCompletenessPass ? "Pass" : "Fail",
      "Critical",
      4,
    ),
    rule(
      "DKL6-VAL-REG-005",
      "Registry Entry Integrity",
      "Every registry entry has owner DKL-6, status Registered, runtimeBehavior None.",
      KnowledgeRepositoryRegistryId,
      "owner=DKL-6;status=Registered;runtimeBehavior=None",
      entryIntegrityPass
        ? "owner=DKL-6;status=Registered;runtimeBehavior=None"
        : "integrity-breach",
      entryIntegrityPass ? "Pass" : "Fail",
      "Critical",
      5,
    ),
  ]);

/** Registry validation section. */
export const KnowledgeRepositoryRegistryValidation = Object.freeze({
  category: "Registry" as const,
  rules: KnowledgeRepositoryRegistryValidationRules,
  ruleCount: KnowledgeRepositoryRegistryValidationRules.length,
  passedRuleCount: KnowledgeRepositoryRegistryValidationRules.filter(
    (item) => item.status === "Pass",
  ).length,
  failedRuleCount: KnowledgeRepositoryRegistryValidationRules.filter(
    (item) => item.status === "Fail",
  ).length,
  entryCount,
  metadataOnly: true as const,
  immutable: true as const,
});
