/**
 * DKL-7:4 — Knowledge Services Validation Tests.
 *
 * Deterministic coverage for the immutable Knowledge Services Validation.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  KnowledgeServicesModel,
  KnowledgeServicesModelId,
  KnowledgeServicesModelVersion,
} from "./knowledgeServicesModel.ts";
import * as ValidationModule from "./knowledgeServicesValidation.ts";
import {
  getKnowledgeServicesValidationRuleCount,
  getKnowledgeServicesValidationSummary,
  KnowledgeServicesValidation,
  KnowledgeServicesValidationEvidence,
  KnowledgeServicesValidationGroups,
  KnowledgeServicesValidationId,
  KnowledgeServicesValidationName,
  KnowledgeServicesValidationNamespace,
  KnowledgeServicesValidationResults,
  KnowledgeServicesValidationRules,
  KnowledgeServicesValidationStatus,
  KnowledgeServicesValidationVersion,
} from "./knowledgeServicesValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL74_FILES = Object.freeze([
  "knowledgeServicesValidationTypes.ts",
  "knowledgeServicesValidationRules.ts",
  "knowledgeServicesValidationGroups.ts",
  "knowledgeServicesValidationEvidence.ts",
  "knowledgeServicesValidationResults.ts",
  "knowledgeServicesValidationSummary.ts",
  "knowledgeServicesValidation.ts",
  "knowledgeServicesValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeServicesValidation",
  "KnowledgeServicesValidationId",
  "KnowledgeServicesValidationName",
  "KnowledgeServicesValidationVersion",
  "KnowledgeServicesValidationNamespace",
  "KnowledgeServicesValidationStatus",
  "KnowledgeServicesValidationGroups",
  "KnowledgeServicesValidationRules",
  "KnowledgeServicesValidationEvidence",
  "KnowledgeServicesValidationResults",
  "getKnowledgeServicesValidationSummary",
  "getKnowledgeServicesValidationRuleCount",
] as const);

const REQUIRED_GROUP_ORDER = Object.freeze([
  "Identity",
  "Dependency",
  "Foundation",
  "Registry",
  "ModelStructure",
  "RequestModels",
  "ResponseModels",
  "ResultModels",
  "ContextAndReferenceModels",
  "Relationships",
  "Ownership",
  "Boundaries",
  "Immutability",
  "RuntimeProhibitions",
  "Readiness",
] as const);

const REQUIRED_GROUP_COUNTS = Object.freeze({
  Identity: 4,
  Dependency: 4,
  Foundation: 2,
  Registry: 5,
  ModelStructure: 4,
  RequestModels: 5,
  ResponseModels: 4,
  ResultModels: 5,
  ContextAndReferenceModels: 3,
  Relationships: 3,
  Ownership: 2,
  Boundaries: 2,
  Immutability: 2,
  RuntimeProhibitions: 2,
  Readiness: 1,
} as const);

const CANONICAL_SECTION_ORDER = Object.freeze([
  "identity",
  "metadata",
  "model",
  "groups",
  "rules",
  "evidence",
  "results",
  "findings",
  "inventory",
  "summary",
  "guarantees",
  "status",
  "readiness",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-7:4 Knowledge Services Validation", () => {
  it("creates exactly eight Validation files and twelve public exports", () => {
    assert.equal(DKL74_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL74_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 12);
  });

  it("has exact identity, version, status, Pass result, and ReadyForManifest", () => {
    assert.equal(
      KnowledgeServicesValidationId,
      "DKL-7:4/KnowledgeServicesValidation",
    );
    assert.equal(
      KnowledgeServicesValidationName,
      "Knowledge Services Validation",
    );
    assert.equal(KnowledgeServicesValidationVersion, "1.0.0");
    assert.equal(KnowledgeServicesValidationStatus, "ValidationComplete");
    assert.equal(
      KnowledgeServicesValidationNamespace,
      "nexora.dkl.knowledge-services.validation",
    );
    assert.equal(KnowledgeServicesValidation.identity.stage, "Validation");
    assert.equal(KnowledgeServicesValidation.status, "ValidationComplete");
    assert.equal(KnowledgeServicesValidation.overallResult, "Pass");
    assert.equal(KnowledgeServicesValidation.readiness, "ReadyForManifest");
    assert.equal(KnowledgeServicesValidation.identity.overallResult, "Pass");
  });

  it("depends only on Model and reaches Registry/Foundation through Model", () => {
    assert.equal(KnowledgeServicesValidation.model, KnowledgeServicesModel);
    assert.equal(
      KnowledgeServicesValidation.identity.modelId,
      KnowledgeServicesModelId,
    );
    assert.equal(
      KnowledgeServicesValidation.identity.modelVersion,
      KnowledgeServicesModelVersion,
    );
    assert.equal(
      KnowledgeServicesValidation.identity.registryId,
      KnowledgeServicesModel.registry.identity.registryId,
    );
    assert.equal(
      KnowledgeServicesValidation.identity.foundationId,
      KnowledgeServicesModel.registry.foundation.foundationId,
    );
    assert.equal(
      KnowledgeServicesValidation.dependency.directPreviousPhaseModule,
      "knowledgeServicesModel.ts",
    );
    assert.equal(
      KnowledgeServicesValidation.dependency.registryDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesValidation.dependency.foundationDirectImport,
      false,
    );
    assert.equal(KnowledgeServicesValidation.dependency.dkl6DirectImport, false);
    assert.equal(
      KnowledgeServicesValidation.dependency.registryReachedThroughModel,
      true,
    );
    assert.equal(
      KnowledgeServicesValidation.dependency.foundationReachedThroughRegistry,
      true,
    );
  });

  it("registers exactly 15 groups in exact order with required rule distribution", () => {
    assert.equal(KnowledgeServicesValidationGroups.length, 15);
    assert.deepEqual(
      KnowledgeServicesValidationGroups.map((g) => g.groupId),
      [...REQUIRED_GROUP_ORDER],
    );
    for (const group of KnowledgeServicesValidationGroups) {
      assert.equal(
        group.ruleCount,
        REQUIRED_GROUP_COUNTS[group.groupId],
      );
    }
    const counted = Object.fromEntries(
      REQUIRED_GROUP_ORDER.map((groupId) => [
        groupId,
        KnowledgeServicesValidationRules.filter((r) => r.group === groupId)
          .length,
      ]),
    );
    assert.deepEqual(counted, { ...REQUIRED_GROUP_COUNTS });
  });

  it("registers exactly 48 unique passing rules with evidence", () => {
    assert.equal(KnowledgeServicesValidationRules.length, 48);
    assert.equal(getKnowledgeServicesValidationRuleCount(), 48);
    assertUnique(
      KnowledgeServicesValidationRules.map((r) => r.ruleId),
      "rule IDs",
    );
    const groupIds = new Set(
      KnowledgeServicesValidationGroups.map((g) => g.groupId),
    );
    for (const rule of KnowledgeServicesValidationRules) {
      assert.ok(groupIds.has(rule.group));
      assert.ok(
        ["Critical", "High", "Medium", "Low", "Informational"].includes(
          rule.severity,
        ),
      );
      assert.ok(rule.evidenceReferences.length >= 1);
      assert.equal(rule.runtimeCallback, false);
      assert.equal(rule.executablePredicate, false);
      assert.equal(rule.status, "Pass");
      assert.equal(Object.isFrozen(rule), true);
    }
  });

  it("binds unique evidence and exactly 48 Pass results with zero findings", () => {
    assert.equal(KnowledgeServicesValidationEvidence.length, 48);
    assertUnique(
      KnowledgeServicesValidationEvidence.map((e) => e.evidenceId),
      "evidence IDs",
    );
    const evidenceIds = new Set(
      KnowledgeServicesValidationEvidence.map((e) => e.evidenceId),
    );
    for (const rule of KnowledgeServicesValidationRules) {
      for (const ref of rule.evidenceReferences) {
        assert.ok(evidenceIds.has(ref.evidenceId));
      }
    }
    assert.equal(KnowledgeServicesValidationResults.length, 48);
    const resultRuleIds = KnowledgeServicesValidationResults.map((r) => r.ruleId);
    assertUnique(resultRuleIds, "result rule IDs");
    assert.deepEqual(
      [...resultRuleIds].sort(),
      [...KnowledgeServicesValidationRules.map((r) => r.ruleId)].sort(),
    );
    assert.equal(
      KnowledgeServicesValidationResults.every((r) => r.status === "Pass"),
      true,
    );
    assert.equal(KnowledgeServicesValidation.findings.length, 0);
    assert.equal(KnowledgeServicesValidation.inventory.passCount, 48);
    assert.equal(KnowledgeServicesValidation.inventory.failCount, 0);
    assert.equal(KnowledgeServicesValidation.inventory.notApplicableCount, 0);
    assert.equal(KnowledgeServicesValidation.overallResult, "Pass");
  });

  it("preserves Foundation, Registry, and Model inventories", () => {
    const registry = KnowledgeServicesModel.registry;
    assert.equal(registry.ownership.ownedCount, 6);
    assert.equal(registry.ownership.nonOwnedCount, 24);
    assert.equal(registry.foundation.boundaries.prohibitedSurfaces.length, 29);
    assert.equal(registry.services.length, 12);
    assert.equal(registry.capabilities.length, 12);
    assert.equal(registry.contracts.length, 11);
    assert.equal(registry.requestCategories.length, 12);
    assert.equal(registry.responseCategories.length, 12);
    assert.equal(registry.accessModes.length, 10);
    assert.equal(
      registry.accessModes.every((m) => m.mutationAllowed === false),
      true,
    );
    assert.equal(KnowledgeServicesModel.inventory.totalEntryCount, 79);
    assert.equal(KnowledgeServicesModel.requests.length, 12);
    assert.equal(KnowledgeServicesModel.responses.length, 12);
    assert.equal(KnowledgeServicesModel.results.length, 12);
    assert.equal(KnowledgeServicesModel.contexts.models.length, 4);
    assert.equal(KnowledgeServicesModel.references.length, 8);
    assert.equal(KnowledgeServicesModel.contexts.graphModels.length, 3);
    assert.equal(KnowledgeServicesModel.relationships.length, 28);
    assert.equal(Object.keys(KnowledgeServicesModel.guarantees).length, 20);
  });

  it("preserves canonical Validation section order and sixteen guarantees", () => {
    const keys = Object.keys(KnowledgeServicesValidation);
    const indexes = CANONICAL_SECTION_ORDER.map((section) => keys.indexOf(section));
    for (let i = 1; i < indexes.length; i += 1) {
      assert.ok(
        indexes[i]! > indexes[i - 1]!,
        `${CANONICAL_SECTION_ORDER[i]} must follow ${CANONICAL_SECTION_ORDER[i - 1]}`,
      );
    }
    assert.equal(KnowledgeServicesValidation.guarantees.length, 16);
    assertUnique(
      KnowledgeServicesValidation.guarantees.map((g) => g.guaranteeId),
      "guarantee IDs",
    );
    for (const guarantee of KnowledgeServicesValidation.guarantees) {
      assert.equal(guarantee.status, true);
    }
  });

  it("is immutable, metadata-only, and free of runtime validation behavior", () => {
    assert.equal(KnowledgeServicesValidation.metadataOnly, true);
    assert.equal(KnowledgeServicesValidation.runtimeValidation, false);
    assert.equal(KnowledgeServicesValidation.runtimeBehavior, false);
    assert.equal(KnowledgeServicesValidation.serviceExecution, false);
    assert.equal(KnowledgeServicesValidation.repositoryAccess, false);
    assert.equal(KnowledgeServicesValidation.searchExecution, false);
    assert.equal(KnowledgeServicesValidation.graphTraversal, false);
    assert.equal(KnowledgeServicesValidation.aiBehavior, false);
    assert.equal(KnowledgeServicesValidation.sourceInspection, false);
    assert.equal(Object.isFrozen(KnowledgeServicesValidation), true);
    assert.equal(Object.isFrozen(KnowledgeServicesValidation.groups), true);
    assert.equal(Object.isFrozen(KnowledgeServicesValidation.rules), true);
    assert.equal(Object.isFrozen(KnowledgeServicesValidation.evidence), true);
    assert.equal(Object.isFrozen(KnowledgeServicesValidation.results), true);
    assert.equal(Object.isFrozen(KnowledgeServicesValidation.guarantees), true);
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeServicesValidation.status = "Mutated";
    });
    assert.equal("validateRequest" in KnowledgeServicesValidation, false);
    assert.equal("execute" in KnowledgeServicesValidation, false);
    assert.equal("dispatch" in KnowledgeServicesValidation, false);
  });

  it("returns deterministic summary and rule-count helpers", () => {
    const summary = getKnowledgeServicesValidationSummary();
    const again = getKnowledgeServicesValidationSummary();
    assert.deepEqual(summary, again);
    assert.equal(summary.validationId, KnowledgeServicesValidationId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.status, "ValidationComplete");
    assert.equal(summary.overallResult, "Pass");
    assert.equal(summary.readiness, "ReadyForManifest");
    assert.equal(summary.modelId, KnowledgeServicesModelId);
    assert.equal(
      summary.registryId,
      KnowledgeServicesModel.registry.identity.registryId,
    );
    assert.equal(
      summary.foundationId,
      KnowledgeServicesModel.registry.foundation.foundationId,
    );
    assert.equal(summary.groupCount, 15);
    assert.equal(summary.ruleCount, 48);
    assert.equal(summary.evidenceCount, 48);
    assert.equal(summary.resultCount, 48);
    assert.equal(summary.passCount, 48);
    assert.equal(summary.failCount, 0);
    assert.equal(summary.notApplicableCount, 0);
    assert.equal(summary.findingCount, 0);
    assert.equal(summary.guaranteeCount, 16);
    assert.equal(summary.modelInventoryCount, 79);
    assert.equal(summary.requestModelCount, 12);
    assert.equal(summary.responseModelCount, 12);
    assert.equal(summary.resultModelCount, 12);
    assert.equal(summary.contextModelCount, 4);
    assert.equal(summary.referenceModelCount, 8);
    assert.equal(summary.graphModelCount, 3);
    assert.equal(summary.relationshipCount, 28);
    assert.equal(summary.serviceCount, 12);
    assert.equal(summary.capabilityCount, 12);
    assert.equal(summary.contractCount, 11);
    assert.equal(summary.accessModeCount, 10);
    assert.equal(summary.mutationModeCount, 0);
    assert.equal(summary.prohibitedSurfaceCount, 29);
    assert.equal(getKnowledgeServicesValidationRuleCount(), 48);
    assert.equal(Object.isFrozen(summary), true);
  });
});
