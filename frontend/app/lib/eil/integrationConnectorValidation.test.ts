/**
 * EIL-2:4 — Integration Connector Validation Tests.
 *
 * Deterministic coverage for the immutable Integration Connector Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationConnectorModelIdentity,
  IntegrationConnectorModelPlatform,
} from "./integrationConnectorModel.ts";
import * as ValidationModule from "./integrationConnectorValidation.ts";
import {
  IntegrationConnectorValidationCategories,
  IntegrationConnectorValidationCollections,
  IntegrationConnectorValidationFindings,
  IntegrationConnectorValidationIdentity,
  IntegrationConnectorValidationPlatform,
  IntegrationConnectorValidationReadiness,
  IntegrationConnectorValidationRules,
  IntegrationConnectorValidationSummary,
} from "./integrationConnectorValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL24_FILES = Object.freeze([
  "integrationConnectorValidationTypes.ts",
  "integrationConnectorValidationIdentity.ts",
  "integrationConnectorValidationRules.ts",
  "integrationConnectorValidationCategories.ts",
  "integrationConnectorValidationFindings.ts",
  "integrationConnectorValidationReadiness.ts",
  "integrationConnectorValidation.ts",
  "integrationConnectorValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorValidationIdentity",
  "IntegrationConnectorValidationRules",
  "IntegrationConnectorValidationCategories",
  "IntegrationConnectorValidationFindings",
  "IntegrationConnectorValidationReadiness",
  "IntegrationConnectorValidationCollections",
  "IntegrationConnectorValidationSummary",
  "IntegrationConnectorValidationPlatform",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "Identity",
  "Namespace",
  "Registry",
  "DomainModel",
  "EndpointModel",
  "ProtocolModel",
  "Relationship",
  "Dependency",
  "Compatibility",
  "Lifecycle",
  "Inventory",
  "Export",
  "Immutability",
  "Determinism",
  "Readiness",
  "Architecture",
] as const);

const EXPECTED_FINDINGS = Object.freeze([
  "Pass",
  "Warning",
  "Error",
  "Skipped",
  "NotApplicable",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationConnectorModel(?!\.ts["'])/,
  /from ["']\.\/integrationConnector(Model|Registry|Foundation)(Types|Identity|DomainModels|RelationshipModels|EndpointModels|ProtocolModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationConnector(Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Connector)/,
  /from ["']\.\/integrationPublicIndex/,
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

describe("EIL-2:4 Integration Connector Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(EIL24_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL24_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical identity, namespace, version, Validation status, and ReadyForManifest", () => {
    assert.equal(IntegrationConnectorValidationIdentity.phaseId, "EIL-2:4");
    assert.equal(
      IntegrationConnectorValidationIdentity.canonicalId,
      "EIL-2:4/IntegrationConnectorValidation",
    );
    assert.equal(
      IntegrationConnectorValidationIdentity.name,
      "Integration Connector Validation",
    );
    assert.equal(IntegrationConnectorValidationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationConnectorValidationIdentity.namespace,
      "nexora.eil.integration-connector.validation",
    );
    assert.equal(IntegrationConnectorValidationIdentity.layer, "EIL");
    assert.equal(IntegrationConnectorValidationIdentity.platform, "EIL-2");
    assert.equal(
      IntegrationConnectorValidationIdentity.phaseType,
      "Validation",
    );
    assert.equal(
      IntegrationConnectorValidationIdentity.status,
      "Validation",
    );
    assert.equal(
      IntegrationConnectorValidationIdentity.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationConnectorValidationPlatform.status,
      "Validation",
    );
    assert.equal(
      IntegrationConnectorValidationReadiness.readinessState,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationConnectorValidationPlatform.nextPhase,
      "EIL-2:5 — Integration Connector Manifest",
    );
  });

  it("declares Model as the sole phase dependency via aggregate entry point", () => {
    const { dependency } = IntegrationConnectorValidationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.modelId,
      IntegrationConnectorModelIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationConnectorModel.ts",
    );
    assert.equal(
      IntegrationConnectorValidationIdentity.modelDependency,
      "EIL-2:3/IntegrationConnectorModel",
    );
    assert.equal(
      IntegrationConnectorValidationIdentity.modelEntryPoint,
      "integrationConnectorModel.ts",
    );
    assert.equal(dependency.modelInternalImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.foundationInternalImport, false);
    assert.equal(dependency.eil1Dependency, false);
    assert.equal(dependency.laterEil2PhaseImport, false);
    assert.equal(
      IntegrationConnectorValidationPlatform.modelPlatform,
      IntegrationConnectorModelPlatform,
    );
  });

  it("freezes all exported collections and validation entries", () => {
    assert.equal(
      Object.isFrozen(IntegrationConnectorValidationIdentity),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorValidationRules), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorValidationCategories),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorValidationFindings),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorValidationReadiness),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorValidationCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorValidationSummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorValidationPlatform),
      true,
    );

    for (const entry of [
      ...IntegrationConnectorValidationRules,
      ...IntegrationConnectorValidationCategories,
      ...IntegrationConnectorValidationFindings,
    ]) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
      assert.equal(entry.executesValidation, false);
      assert.equal(entry.metadataOnly, true);
    }
  });

  it("declares exactly sixteen categories, rules, and five finding states", () => {
    assert.equal(IntegrationConnectorValidationCategories.length, 16);
    assert.deepEqual(
      IntegrationConnectorValidationCategories.map((item) => item.key),
      [...EXPECTED_CATEGORIES],
    );

    assert.ok(IntegrationConnectorValidationRules.length >= 26);
    assert.equal(IntegrationConnectorValidationFindings.length, 5);
    assert.deepEqual(
      IntegrationConnectorValidationFindings.map((item) => item.state),
      [...EXPECTED_FINDINGS],
    );
  });

  it("enforces unique IDs and deterministic ordinals", () => {
    assertUnique(
      IntegrationConnectorValidationRules.map((item) => item.ruleId),
      "rule IDs",
    );
    assertUnique(
      IntegrationConnectorValidationRules.map((item) => item.canonicalKey),
      "rule keys",
    );
    assertUnique(
      IntegrationConnectorValidationCategories.map((item) => item.categoryId),
      "category IDs",
    );
    assertUnique(
      IntegrationConnectorValidationFindings.map((item) => item.findingId),
      "finding IDs",
    );

    assertAscending(
      IntegrationConnectorValidationRules.map((item) => item.ordinal),
      "rule",
    );
    assertAscending(
      IntegrationConnectorValidationCategories.map((item) => item.ordinal),
      "category",
    );
    assertAscending(
      IntegrationConnectorValidationFindings.map((item) => item.ordinal),
      "finding",
    );
  });

  it("derives inventory counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationConnectorValidationCollections.validationRuleCount,
      IntegrationConnectorValidationRules.length,
    );
    assert.equal(
      IntegrationConnectorValidationCollections.categoryCount,
      IntegrationConnectorValidationCategories.length,
    );
    assert.equal(
      IntegrationConnectorValidationCollections.findingStateCount,
      IntegrationConnectorValidationFindings.length,
    );
    assert.equal(
      IntegrationConnectorValidationCollections.totalValidationEntryCount,
      IntegrationConnectorValidationRules.length +
        IntegrationConnectorValidationCategories.length +
        IntegrationConnectorValidationFindings.length,
    );
    assert.equal(
      IntegrationConnectorValidationSummary.validationRuleCount,
      IntegrationConnectorValidationCollections.validationRuleCount,
    );
    assert.equal(
      IntegrationConnectorValidationPlatform.inventory
        .countsDerivedFromCollections,
      true,
    );
    assert.equal(
      IntegrationConnectorValidationSummary.totalValidationEntryCount,
      47,
    );
  });

  it("is metadata-only with zero runtime validation behavior", () => {
    const platform = IntegrationConnectorValidationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.runtimeValidation, false);
    assert.equal(platform.ruleExecution, false);
    assert.equal(platform.connectorRuntime, false);
    assert.equal(platform.endpointExecution, false);
    assert.equal(platform.protocolExecution, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.httpClientBehavior, false);
    assert.equal(platform.messageBrokerBehavior, false);
    assert.equal(platform.eventBus, false);
    assert.equal(platform.authenticationLogic, false);
    assert.equal(platform.authorizationLogic, false);
    assert.equal(platform.encryptionBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.eil1Dependency, false);
    assert.equal(platform.importsLaterEil2Phases, false);
    assert.equal(platform.result.runtimeExecuted, false);
    assert.equal(IntegrationConnectorValidationReadiness.executesGates, false);
  });

  it("has zero prohibited imports and Model as sole module dependency", () => {
    const sources = EIL24_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["'][^"']*integrationConnectorManifest[^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationConnectorValidation.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregate,
      /from ["']\.\/integrationConnectorModel\.ts["']/,
    );
    assert.equal(
      IntegrationConnectorValidationPlatform.dependency.laterEil2PhaseImport,
      false,
    );
  });

  it("is ready for Manifest with stable summary", () => {
    assert.equal(
      IntegrationConnectorValidationSummary.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationConnectorValidationSummary.status,
      "Validation",
    );
    assert.equal(
      IntegrationConnectorValidationSummary.nextPhase,
      "EIL-2:5 — Integration Connector Manifest",
    );
    assert.equal(
      IntegrationConnectorValidationSummary.modelId,
      "EIL-2:3/IntegrationConnectorModel",
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorValidationSummary),
      true,
    );
    assert.equal(
      IntegrationConnectorValidationSummary.validationRuleCount,
      26,
    );
    assert.equal(IntegrationConnectorValidationSummary.categoryCount, 16);
    assert.equal(IntegrationConnectorValidationSummary.findingStateCount, 5);
    assert.equal(
      IntegrationConnectorValidationSummary.totalValidationEntryCount,
      47,
    );
  });
});
