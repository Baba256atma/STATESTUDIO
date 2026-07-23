/**
 * EIL-1:4 — Integration Validation Tests.
 *
 * Deterministic coverage for the immutable Integration Validation phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationModelIdentity,
  IntegrationModelPlatform,
} from "./integrationModel.ts";
import * as ValidationModule from "./integrationValidation.ts";
import {
  IntegrationValidationCategories,
  IntegrationValidationCollections,
  IntegrationValidationFindings,
  IntegrationValidationIdentity,
  IntegrationValidationPlatform,
  IntegrationValidationReadiness,
  IntegrationValidationRules,
  IntegrationValidationSummary,
} from "./integrationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL14_FILES = Object.freeze([
  "integrationValidationTypes.ts",
  "integrationValidationIdentity.ts",
  "integrationValidationRules.ts",
  "integrationValidationCategories.ts",
  "integrationValidationFindings.ts",
  "integrationValidationReadiness.ts",
  "integrationValidation.ts",
  "integrationValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationValidationIdentity",
  "IntegrationValidationRules",
  "IntegrationValidationCategories",
  "IntegrationValidationFindings",
  "IntegrationValidationReadiness",
  "IntegrationValidationCollections",
  "IntegrationValidationSummary",
  "IntegrationValidationPlatform",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "Identity",
  "Namespace",
  "Dependency",
  "Registry",
  "Model",
  "Contract",
  "Capability",
  "Responsibility",
  "Topology",
  "Lifecycle",
  "Compatibility",
  "Boundary",
  "Inventory",
  "Export",
  "Immutability",
  "Determinism",
] as const);

const EXPECTED_FINDINGS = Object.freeze([
  "Pass",
  "Warning",
  "Error",
  "Skipped",
  "NotApplicable",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationModel(?!\.ts["'])/,
  /from ["']\.\/integration(Model|Registry|Foundation)(Types|Identity|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|Contracts|Capabilities|Responsibilities|Lifecycle|TypeRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry)\.ts["']/,
  /from ["']\.\/integration(Registry|Foundation)\.ts["']/,
  /from ["']\.\.\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const assertAscending = (ordinals: readonly number[], label: string): void => {
  assert.deepEqual(
    ordinals,
    [...ordinals].sort((a, b) => a - b),
    `${label} ordinals must be ascending`,
  );
};

describe("EIL-1:4 Integration Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(EIL14_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL14_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical identity, namespace, version, Validation status, and ReadyForManifest", () => {
    assert.equal(IntegrationValidationIdentity.phaseId, "EIL-1:4");
    assert.equal(
      IntegrationValidationIdentity.canonicalId,
      "EIL-1:4/IntegrationValidation",
    );
    assert.equal(IntegrationValidationIdentity.name, "Integration Validation");
    assert.equal(IntegrationValidationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationValidationIdentity.namespace,
      "nexora.eil.integration.validation",
    );
    assert.equal(IntegrationValidationIdentity.layer, "EIL");
    assert.equal(IntegrationValidationIdentity.platform, "EIL-1");
    assert.equal(IntegrationValidationIdentity.phaseType, "Validation");
    assert.equal(IntegrationValidationIdentity.status, "Validation");
    assert.equal(IntegrationValidationIdentity.readiness, "ReadyForManifest");
    assert.equal(IntegrationValidationPlatform.status, "Validation");
    assert.equal(
      IntegrationValidationPlatform.readiness.readinessState,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationValidationPlatform.nextPhase,
      "EIL-1:5 — Integration Manifest",
    );
  });

  it("declares Model aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationValidationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.modelOnly, true);
    assert.equal(dependency.modelId, IntegrationModelIdentity.canonicalId);
    assert.equal(dependency.directPreviousPhaseModule, "integrationModel.ts");
    assert.equal(
      IntegrationValidationIdentity.modelDependency,
      "EIL-1:3/IntegrationModel",
    );
    assert.equal(
      IntegrationValidationIdentity.modelEntryPoint,
      "integrationModel.ts",
    );
    assert.equal(dependency.modelInternalImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.foundationInternalImport, false);
    assert.equal(dependency.laterEilPhaseImport, false);
    assert.equal(
      IntegrationValidationPlatform.modelPlatform,
      IntegrationModelPlatform,
    );
  });

  it("freezes categories, rules, findings, readiness, and aggregates", () => {
    assert.equal(Object.isFrozen(IntegrationValidationIdentity), true);
    assert.equal(Object.isFrozen(IntegrationValidationCategories), true);
    assert.equal(Object.isFrozen(IntegrationValidationRules), true);
    assert.equal(Object.isFrozen(IntegrationValidationFindings), true);
    assert.equal(Object.isFrozen(IntegrationValidationReadiness), true);
    assert.equal(Object.isFrozen(IntegrationValidationCollections), true);
    assert.equal(Object.isFrozen(IntegrationValidationSummary), true);
    assert.equal(Object.isFrozen(IntegrationValidationPlatform), true);

    for (const entry of IntegrationValidationCategories) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.executesValidation, false);
    }
    for (const entry of IntegrationValidationRules) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
      assert.equal(entry.executesValidation, false);
    }
    for (const entry of IntegrationValidationFindings) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.executesValidation, false);
    }
    assert.equal(IntegrationValidationReadiness.executesGates, false);
  });

  it("enforces unique IDs and deterministic ordinals", () => {
    assertUnique(
      IntegrationValidationCategories.map((item) => item.categoryId),
      "category IDs",
    );
    assertUnique(
      IntegrationValidationCategories.map((item) => item.key),
      "category keys",
    );
    assertAscending(
      IntegrationValidationCategories.map((item) => item.ordinal),
      "category",
    );

    assertUnique(
      IntegrationValidationRules.map((item) => item.ruleId),
      "rule IDs",
    );
    assertUnique(
      IntegrationValidationRules.map((item) => item.canonicalKey),
      "rule keys",
    );
    assertAscending(
      IntegrationValidationRules.map((item) => item.ordinal),
      "rule",
    );

    assertUnique(
      IntegrationValidationFindings.map((item) => item.findingId),
      "finding IDs",
    );
    assertAscending(
      IntegrationValidationFindings.map((item) => item.ordinal),
      "finding",
    );
  });

  it("declares complete categories and finding states", () => {
    assert.deepEqual(
      IntegrationValidationCategories.map((item) => item.key),
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      IntegrationValidationFindings.map((item) => item.state),
      [...EXPECTED_FINDINGS],
    );
    assert.ok(IntegrationValidationRules.length >= 24);
    assert.ok(
      IntegrationValidationRules.every((item) =>
        EXPECTED_CATEGORIES.includes(item.category),
      ),
    );
  });

  it("derives inventory counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationValidationCollections.validationRuleCount,
      IntegrationValidationRules.length,
    );
    assert.equal(
      IntegrationValidationCollections.categoryCount,
      IntegrationValidationCategories.length,
    );
    assert.equal(
      IntegrationValidationCollections.findingStateCount,
      IntegrationValidationFindings.length,
    );
    assert.equal(
      IntegrationValidationCollections.totalValidationEntryCount,
      IntegrationValidationRules.length +
        IntegrationValidationCategories.length +
        IntegrationValidationFindings.length,
    );
    assert.equal(
      IntegrationValidationSummary.validationRuleCount,
      IntegrationValidationCollections.validationRuleCount,
    );
    assert.equal(
      IntegrationValidationSummary.categoryCount,
      IntegrationValidationCollections.categoryCount,
    );
    assert.equal(
      IntegrationValidationSummary.findingStateCount,
      IntegrationValidationCollections.findingStateCount,
    );
    assert.equal(
      IntegrationValidationPlatform.inventory.countsDerivedFromCollections,
      true,
    );
  });

  it("is metadata-only with zero runtime validation behavior", () => {
    const platform = IntegrationValidationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.runtimeValidation, false);
    assert.equal(platform.ruleExecution, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.serviceBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.visualizationBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEilPhases, false);
    assert.equal(platform.result.runtimeExecuted, false);
  });

  it("has zero prohibited imports and no later EIL phase dependencies", () => {
    const sources = EIL14_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(
        source,
        /from ["'][^"']*integrationManifest[^"']*["']/,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*EIL-1:[5-9][^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationValidation.ts", import.meta.url),
      "utf8",
    );
    assert.match(aggregate, /from ["']\.\/integrationModel\.ts["']/);
    assert.equal(
      IntegrationValidationPlatform.dependency.laterEilPhaseImport,
      false,
    );
  });

  it("is ready for the Manifest phase with stable summary", () => {
    assert.equal(IntegrationValidationSummary.readiness, "ReadyForManifest");
    assert.equal(IntegrationValidationSummary.status, "Validation");
    assert.equal(
      IntegrationValidationSummary.nextPhase,
      "EIL-1:5 — Integration Manifest",
    );
    assert.equal(
      IntegrationValidationSummary.modelId,
      "EIL-1:3/IntegrationModel",
    );
    assert.equal(Object.isFrozen(IntegrationValidationSummary), true);
    assert.equal(IntegrationValidationSummary.categoryCount, 16);
    assert.equal(IntegrationValidationSummary.findingStateCount, 5);
    assert.ok(IntegrationValidationSummary.validationRuleCount >= 24);
    assert.ok(IntegrationValidationSummary.totalValidationEntryCount > 30);
    assert.equal(
      IntegrationValidationReadiness.readinessState,
      "ReadyForManifest",
    );
  });
});
