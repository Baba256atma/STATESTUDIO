/**
 * DKL-6:4 — Knowledge Repository Validation Tests.
 *
 * Deterministic coverage for architectural validation of DKL-6:1–6:3.
 * No mocks. No randomness. No network. No filesystem IO.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
} from "./knowledgeRepositoryFoundation.ts";
import {
  getKnowledgeRepositoryModelCount,
  KnowledgeRepositoryModel,
  KnowledgeRepositoryModelId,
} from "./knowledgeRepositoryModel.ts";
import {
  getKnowledgeRepositoryRegistryEntryCount,
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
} from "./knowledgeRepositoryRegistry.ts";
import * as ValidationModule from "./knowledgeRepositoryValidation.ts";
import {
  getKnowledgeRepositoryValidationRuleCount,
  getKnowledgeRepositoryValidationSummary,
  KnowledgeRepositoryValidation,
  KnowledgeRepositoryValidationId,
  KnowledgeRepositoryValidationName,
  KnowledgeRepositoryValidationNamespace,
  KnowledgeRepositoryValidationStatus,
  KnowledgeRepositoryValidationVersion,
} from "./knowledgeRepositoryValidation.ts";

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeRepositoryValidation",
  "KnowledgeRepositoryValidationId",
  "KnowledgeRepositoryValidationVersion",
  "KnowledgeRepositoryValidationName",
  "KnowledgeRepositoryValidationNamespace",
  "KnowledgeRepositoryValidationStatus",
  "getKnowledgeRepositoryValidationSummary",
  "getKnowledgeRepositoryValidationRuleCount",
] as const);

const CATEGORY_ORDER = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Ownership",
  "Boundaries",
  "Dependencies",
  "Traceability",
  "Immutability",
  "Determinism",
  "RuntimeProhibition",
] as const);

const GATE_NAMES = Object.freeze([
  "FoundationIntegrityGate",
  "RegistryIntegrityGate",
  "ModelIntegrityGate",
  "OwnershipIntegrityGate",
  "BoundaryIntegrityGate",
  "DependencyIntegrityGate",
  "TraceabilityIntegrityGate",
  "ImmutabilityIntegrityGate",
  "DeterminismIntegrityGate",
  "RuntimeProhibitionGate",
] as const);

const PHYSICAL_STORAGE_TOKENS = Object.freeze([
  "elasticsearch",
  "postgresql",
  "neo4j",
  "mongodb",
  "dynamodb",
] as const);

const RUNTIME_EXECUTOR_TOKENS = Object.freeze([
  "executeQuery",
  "createConnection",
  "storageAdapter",
  "queryExecutor",
] as const);

describe("DKL-6:4 Knowledge Repository Validation", () => {
  it("exposes exactly eight public exports", () => {
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical validation identity", () => {
    assert.equal(
      KnowledgeRepositoryValidationId,
      "DKL-6:4/KnowledgeRepositoryValidation",
    );
    assert.equal(
      KnowledgeRepositoryValidation.identity.validationId,
      KnowledgeRepositoryValidationId,
    );
    assert.equal(KnowledgeRepositoryValidation.identity.phase, "DKL-6:4");
    assert.equal(KnowledgeRepositoryValidation.identity.owner, "DKL-6");
  });

  it("has version 1.0.0", () => {
    assert.equal(KnowledgeRepositoryValidationVersion, "1.0.0");
    assert.equal(
      KnowledgeRepositoryValidation.identity.validationVersion,
      "1.0.0",
    );
  });

  it("has correct name", () => {
    assert.equal(
      KnowledgeRepositoryValidationName,
      "Knowledge Repository Validation",
    );
    assert.equal(
      KnowledgeRepositoryValidation.identity.validationName,
      KnowledgeRepositoryValidationName,
    );
  });

  it("has correct namespace", () => {
    assert.equal(
      KnowledgeRepositoryValidationNamespace,
      "nexora.dkl.repository.validation",
    );
    assert.equal(
      KnowledgeRepositoryValidation.identity.validationNamespace,
      KnowledgeRepositoryValidationNamespace,
    );
  });

  it("has Validated status", () => {
    assert.equal(KnowledgeRepositoryValidationStatus, "Validated");
    assert.equal(KnowledgeRepositoryValidation.identity.status, "Validated");
    assert.equal(KnowledgeRepositoryValidation.result.status, "Validated");
  });

  it("has readiness ReadyForDKL6Manifest", () => {
    assert.equal(
      KnowledgeRepositoryValidation.readiness,
      "ReadyForDKL6Manifest",
    );
    assert.equal(
      KnowledgeRepositoryValidation.identity.readiness,
      "ReadyForDKL6Manifest",
    );
    assert.equal(
      KnowledgeRepositoryValidation.result.readiness,
      "ReadyForDKL6Manifest",
    );
  });

  it("declares exactly ten validation categories in order", () => {
    assert.equal(KnowledgeRepositoryValidation.categories.length, 10);
    assert.deepEqual(
      KnowledgeRepositoryValidation.categories.map((item) => item.category),
      [...CATEGORY_ORDER],
    );
  });

  it("declares exactly forty validation rules", () => {
    assert.equal(KnowledgeRepositoryValidation.rules.length, 40);
    assert.equal(getKnowledgeRepositoryValidationRuleCount(), 40);
  });

  it("declares exactly ten gates", () => {
    assert.equal(KnowledgeRepositoryValidation.gates.length, 10);
    assert.deepEqual(
      KnowledgeRepositoryValidation.gates.map((gate) => gate.name),
      [...GATE_NAMES],
    );
  });

  it("ensures every category contains at least one rule with expected counts", () => {
    const expectedCounts: Record<string, number> = {
      Foundation: 5,
      Registry: 5,
      Model: 5,
      Ownership: 4,
      Boundaries: 4,
      Dependencies: 4,
      Traceability: 4,
      Immutability: 3,
      Determinism: 3,
      RuntimeProhibition: 3,
    };
    for (const category of CATEGORY_ORDER) {
      const scoped = KnowledgeRepositoryValidation.rules.filter(
        (rule) => rule.category === category,
      );
      assert.ok(scoped.length > 0, `${category} empty`);
      assert.equal(scoped.length, expectedCounts[category]);
    }
  });

  it("ensures Foundation category contains five rules", () => {
    assert.equal(KnowledgeRepositoryValidation.foundationValidation.ruleCount, 5);
  });

  it("ensures Registry category contains five rules", () => {
    assert.equal(KnowledgeRepositoryValidation.registryValidation.ruleCount, 5);
  });

  it("ensures Model category contains five rules", () => {
    assert.equal(KnowledgeRepositoryValidation.modelValidation.ruleCount, 5);
  });

  it("ensures Ownership category contains four rules", () => {
    assert.equal(KnowledgeRepositoryValidation.ownershipValidation.ruleCount, 4);
  });

  it("ensures Boundaries category contains four rules", () => {
    assert.equal(KnowledgeRepositoryValidation.boundaryValidation.ruleCount, 4);
  });

  it("ensures Dependencies category contains four rules", () => {
    assert.equal(KnowledgeRepositoryValidation.dependencyValidation.ruleCount, 4);
  });

  it("ensures Traceability category contains four rules", () => {
    assert.equal(
      KnowledgeRepositoryValidation.traceabilityValidation.ruleCount,
      4,
    );
  });

  it("ensures Immutability category contains three rules", () => {
    assert.equal(
      KnowledgeRepositoryValidation.immutabilityValidation.ruleCount,
      3,
    );
  });

  it("ensures Determinism category contains three rules", () => {
    assert.equal(KnowledgeRepositoryValidation.determinismValidation.ruleCount, 3);
  });

  it("ensures Runtime Prohibition category contains three rules", () => {
    assert.equal(
      KnowledgeRepositoryValidation.runtimeProhibitionValidation.ruleCount,
      3,
    );
  });

  it("ensures every rule and gate has a unique ID", () => {
    const ruleIds = KnowledgeRepositoryValidation.rules.map((rule) => rule.id);
    const gateIds = KnowledgeRepositoryValidation.gates.map((gate) => gate.id);
    assert.equal(new Set(ruleIds).size, ruleIds.length);
    assert.equal(new Set(gateIds).size, gateIds.length);
  });

  it("ensures every rule and gate is owned by DKL-6 with runtime None", () => {
    for (const rule of KnowledgeRepositoryValidation.rules) {
      assert.equal(rule.owner, "DKL-6");
      assert.equal(rule.runtimeBehavior, "None");
    }
    for (const gate of KnowledgeRepositoryValidation.gates) {
      assert.equal(gate.owner, "DKL-6");
      assert.equal(gate.runtimeBehavior, "None");
    }
  });

  it("passes all forty rules and all ten gates", () => {
    for (const rule of KnowledgeRepositoryValidation.rules) {
      assert.equal(rule.status, "Pass", rule.id);
    }
    for (const gate of KnowledgeRepositoryValidation.gates) {
      assert.equal(gate.status, "Pass", gate.id);
      assert.equal(gate.failedRuleCount, 0);
    }
    assert.equal(KnowledgeRepositoryValidation.result.passedRules, 40);
    assert.equal(KnowledgeRepositoryValidation.result.failedRules, 0);
    assert.equal(KnowledgeRepositoryValidation.result.passedGates, 10);
    assert.equal(KnowledgeRepositoryValidation.result.failedGates, 0);
    assert.equal(KnowledgeRepositoryValidation.result.gateStatus, "Pass");
  });

  it("matches Foundation counts", () => {
    assert.equal(KnowledgeRepositoryFoundationId, "DKL-6:1/KnowledgeRepositoryFoundation");
    assert.equal(KnowledgeRepositoryFoundation.contracts.capabilityCount, 9);
    assert.equal(KnowledgeRepositoryFoundation.contracts.contractCount, 8);
    assert.equal(KnowledgeRepositoryFoundation.lifecycle.stateCount, 7);
    assert.equal(KnowledgeRepositoryFoundation.policies.policyCount, 6);
  });

  it("matches Registry counts", () => {
    assert.equal(KnowledgeRepositoryRegistryId, "DKL-6:2/KnowledgeRepositoryRegistry");
    assert.equal(getKnowledgeRepositoryRegistryEntryCount(), 103);
    assert.equal(
      getKnowledgeRepositoryValidationSummary().registryDependencyId,
      KnowledgeRepositoryRegistryId,
    );
  });

  it("matches Model counts", () => {
    assert.equal(KnowledgeRepositoryModelId, "DKL-6:3/KnowledgeRepositoryModel");
    assert.equal(getKnowledgeRepositoryModelCount(), 52);
    assert.equal(KnowledgeRepositoryModel.relationships.length, 13);
    assert.equal(KnowledgeRepositoryModel.registryTraceability.length, 14);
  });

  it("confirms registry traceability is fourteen and relationships are thirteen", () => {
    assert.equal(KnowledgeRepositoryModel.registryTraceability.length, 14);
    assert.equal(KnowledgeRepositoryModel.relationships.length, 13);
  });

  it("confirms Foundation lifecycle and policy counts", () => {
    assert.equal(KnowledgeRepositoryFoundation.lifecycle.stateCount, 7);
    assert.equal(KnowledgeRepositoryFoundation.policies.policyCount, 6);
  });

  it("confirms Registry total entry count is 103 and Model total is 52", () => {
    assert.equal(getKnowledgeRepositoryRegistryEntryCount(), 103);
    assert.equal(getKnowledgeRepositoryModelCount(), 52);
  });

  it("confirms imported public aggregates are frozen", () => {
    assert.equal(Object.isFrozen(KnowledgeRepositoryFoundation), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryRegistry), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryModel), true);
  });

  it("freezes the validation aggregate and nested structures", () => {
    assert.equal(Object.isFrozen(KnowledgeRepositoryValidation), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryValidation.identity), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryValidation.categories), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryValidation.rules), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryValidation.gates), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryValidation.result), true);
    for (const category of KnowledgeRepositoryValidation.categories) {
      assert.equal(Object.isFrozen(category), true);
    }
    for (const rule of KnowledgeRepositoryValidation.rules) {
      assert.equal(Object.isFrozen(rule), true);
    }
    for (const gate of KnowledgeRepositoryValidation.gates) {
      assert.equal(Object.isFrozen(gate), true);
      assert.equal(Object.isFrozen(gate.ruleReferences), true);
    }
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeRepositoryValidation.identity.status = "Mutated";
    });
  });

  it("returns deterministic summary and rule count", () => {
    const summary = getKnowledgeRepositoryValidationSummary();
    assert.deepEqual(summary, getKnowledgeRepositoryValidationSummary());
    assert.equal(getKnowledgeRepositoryValidationRuleCount(), 40);
    assert.equal(getKnowledgeRepositoryValidationRuleCount(), 40);
    assert.equal(summary.validationId, KnowledgeRepositoryValidationId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.name, KnowledgeRepositoryValidationName);
    assert.equal(summary.namespace, KnowledgeRepositoryValidationNamespace);
    assert.equal(summary.status, "Validated");
    assert.equal(summary.foundationDependencyId, KnowledgeRepositoryFoundationId);
    assert.equal(summary.registryDependencyId, KnowledgeRepositoryRegistryId);
    assert.equal(summary.modelDependencyId, KnowledgeRepositoryModelId);
    assert.equal(summary.categoryCount, 10);
    assert.equal(summary.ruleCount, 40);
    assert.equal(summary.passedRuleCount, 40);
    assert.equal(summary.failedRuleCount, 0);
    assert.equal(summary.gateCount, 10);
    assert.equal(summary.passedGateCount, 10);
    assert.equal(summary.failedGateCount, 0);
    assert.equal(summary.criticalRuleCount + summary.requiredRuleCount, 40);
    assert.equal(summary.overallGateStatus, "Pass");
    assert.equal(summary.readiness, "ReadyForDKL6Manifest");
    assert.equal(Object.isFrozen(summary), true);
  });

  it("contains no physical storage technology in validation metadata", () => {
    const haystack = [
      ...KnowledgeRepositoryValidation.rules.map((rule) =>
        [rule.id, rule.name, rule.description, rule.expected, rule.actual].join(
          " ",
        ),
      ),
      ...KnowledgeRepositoryValidation.gates.map((gate) => gate.name),
    ]
      .join(" ")
      .toLowerCase();
    for (const token of PHYSICAL_STORAGE_TOKENS) {
      assert.equal(haystack.includes(token), false, token);
    }
  });

  it("contains no runtime executor declarations", () => {
    const haystack = KnowledgeRepositoryValidation.rules
      .map((rule) => [rule.description, rule.expected, rule.actual].join(" "))
      .join(" ");
    for (const token of RUNTIME_EXECUTOR_TOKENS) {
      assert.equal(haystack.includes(token), false, token);
    }
    assert.equal(KnowledgeRepositoryValidation.guarantees.runtimeFree, true);
    assert.equal(KnowledgeRepositoryValidation.guarantees.noPersistence, true);
  });

  it("contains no environment-dependent values", () => {
    const summary = getKnowledgeRepositoryValidationSummary();
    assert.equal("timestamp" in summary, false);
    assert.equal("generatedAt" in summary, false);
    assert.equal("randomSeed" in summary, false);
    assert.equal(KnowledgeRepositoryValidation.deterministic, true);
    assert.equal(
      KnowledgeRepositoryValidation.guarantees.noFilesystemInspection,
      true,
    );
    assert.equal(KnowledgeRepositoryValidation.guarantees.noNetworkAccess, true);
  });

  it("declares final readiness ReadyForDKL6Manifest", () => {
    assert.equal(
      getKnowledgeRepositoryValidationSummary().readiness,
      "ReadyForDKL6Manifest",
    );
  });

  it("declares dependency closure over Foundation, Registry, and Model only", () => {
    assert.equal(
      KnowledgeRepositoryValidation.dependencies.foundationId,
      KnowledgeRepositoryFoundationId,
    );
    assert.equal(
      KnowledgeRepositoryValidation.dependencies.registryId,
      KnowledgeRepositoryRegistryId,
    );
    assert.equal(
      KnowledgeRepositoryValidation.dependencies.modelId,
      KnowledgeRepositoryModelId,
    );
    assert.equal(
      KnowledgeRepositoryValidation.dependencies.consumesPublicSurfacesOnly,
      true,
    );
    assert.equal(
      KnowledgeRepositoryValidation.dependencies.consumesDkl5Directly,
      false,
    );
  });
});
