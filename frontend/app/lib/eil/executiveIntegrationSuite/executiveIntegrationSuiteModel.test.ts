/**
 * EIL-8:3 — Executive Integration Suite Model Tests.
 *
 * Deterministic architectural coverage for the immutable Model phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as PackageModule from "./index.ts";
import {
  ExecutiveIntegrationSuiteRegistry,
  ExecutiveIntegrationSuiteRegistryCanonicalId,
} from "./executiveIntegrationSuiteRegistry.ts";
import {
  ExecutiveIntegrationSuiteCapabilityModels,
  ExecutiveIntegrationSuiteContractModels,
  ExecutiveIntegrationSuiteDomainModels,
  ExecutiveIntegrationSuiteLifecycleModels,
  ExecutiveIntegrationSuiteModel,
  ExecutiveIntegrationSuiteModelIdentity,
  ExecutiveIntegrationSuiteModelInventory,
  ExecutiveIntegrationSuiteModelReadiness,
  ExecutiveIntegrationSuiteModuleModels,
  ExecutiveIntegrationSuiteRelationshipModels,
  ExecutiveIntegrationSuiteRelationshipTypes,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL83_FILES = Object.freeze([
  "executiveIntegrationSuiteModel.ts",
  "executiveIntegrationSuiteModuleModels.ts",
  "executiveIntegrationSuiteContractModels.ts",
  "executiveIntegrationSuiteCapabilityModels.ts",
  "executiveIntegrationSuiteDomainModels.ts",
  "executiveIntegrationSuiteLifecycleModels.ts",
  "executiveIntegrationSuiteRelationshipModels.ts",
  "executiveIntegrationSuiteModel.test.ts",
]);

const REQUIRED_MODEL_EXPORTS = Object.freeze([
  "ExecutiveIntegrationSuiteModelIdentity",
  "ExecutiveIntegrationSuiteModel",
  "ExecutiveIntegrationSuiteModuleModels",
  "ExecutiveIntegrationSuiteContractModels",
  "ExecutiveIntegrationSuiteCapabilityModels",
  "ExecutiveIntegrationSuiteDomainModels",
  "ExecutiveIntegrationSuiteLifecycleModels",
  "ExecutiveIntegrationSuiteRelationshipModels",
  "ExecutiveIntegrationSuiteRelationshipTypes",
  "ExecutiveIntegrationSuiteModelInventory",
  "ExecutiveIntegrationSuiteModelReadiness",
  "ExecutiveIntegrationSuiteModelCanonicalId",
] as const);

const EXPECTED_CONTRACT_KEYS = Object.freeze([
  "SuiteContractModel",
  "ModuleCompositionContractModel",
  "PublicIndexContractModel",
  "DependencyContractModel",
  "CompatibilityContractModel",
  "SuiteIdentityContractModel",
  "SuiteLifecycleContractModel",
  "SuitePublicationContractModel",
] as const);

const EXPECTED_RELATIONSHIP_TYPES = Object.freeze([
  "owns",
  "references",
  "contains",
  "dependsOn",
  "composedOf",
  "aggregates",
  "publishes",
  "validatedBy",
  "certifiedBy",
  "sourcedFrom",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationSuite(Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationSuiteFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationSuite(Module|Contract|Capability|Domain|Lifecycle|Composition)Registry\.ts["']/,
  /from ["']\.\/executiveIntegrationSuite(Contracts|Capabilities|Domains|Lifecycle|Modules|Composition)\.ts["']/,
  /from ["']\.\.\/integration/,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const assertSequentialOrders = (
  orders: readonly number[],
  label: string,
): void => {
  assert.deepEqual(
    orders,
    Array.from({ length: orders.length }, (_, index) => index + 1),
    `${label} orders must be sequential starting at 1`,
  );
};

describe("EIL-8:3 Executive Integration Suite Model", () => {
  it("creates exactly eight Model files", () => {
    assert.equal(EIL83_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL83_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Model status, and ReadyForValidation", () => {
    assert.equal(ExecutiveIntegrationSuiteModelIdentity.phaseId, "EIL-8:3");
    assert.equal(
      ExecutiveIntegrationSuiteModelIdentity.canonicalId,
      "EIL-8:3/ExecutiveIntegrationSuiteModel",
    );
    assert.equal(
      ExecutiveIntegrationSuiteModelIdentity.name,
      "Executive Integration Suite Model",
    );
    assert.equal(ExecutiveIntegrationSuiteModelIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationSuiteModelIdentity.namespace,
      "nexora.eil.executive-integration-suite.model",
    );
    assert.equal(ExecutiveIntegrationSuiteModelIdentity.status, "Model");
    assert.equal(
      ExecutiveIntegrationSuiteModelIdentity.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteModelReadiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteModel.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteModelIdentity.registryDependency,
      ExecutiveIntegrationSuiteRegistryCanonicalId,
    );
  });

  it("consumes Registry aggregate as the sole upstream dependency", () => {
    assert.equal(ExecutiveIntegrationSuiteModel.dependency.registryOnly, true);
    assert.equal(
      ExecutiveIntegrationSuiteModel.dependency.upstreamCanonicalId,
      ExecutiveIntegrationSuiteRegistryCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationSuiteModel.registry,
      ExecutiveIntegrationSuiteRegistry,
    );
    assert.equal(
      ExecutiveIntegrationSuiteModel.dependency.foundationDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteModel.dependency.laterEil8PhaseImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteModel.dependency.registryInternalImport,
      false,
    );
  });

  it("publishes exactly 40 canonical model instances and 10 relationship types", () => {
    assert.equal(ExecutiveIntegrationSuiteModuleModels.length, 7);
    assert.equal(ExecutiveIntegrationSuiteContractModels.length, 8);
    assert.equal(ExecutiveIntegrationSuiteCapabilityModels.length, 8);
    assert.equal(ExecutiveIntegrationSuiteDomainModels.length, 8);
    assert.equal(ExecutiveIntegrationSuiteLifecycleModels.length, 9);
    assert.equal(ExecutiveIntegrationSuiteRelationshipModels.length, 10);

    const derived =
      ExecutiveIntegrationSuiteModuleModels.length +
      ExecutiveIntegrationSuiteContractModels.length +
      ExecutiveIntegrationSuiteCapabilityModels.length +
      ExecutiveIntegrationSuiteDomainModels.length +
      ExecutiveIntegrationSuiteLifecycleModels.length;

    assert.equal(derived, 40);
    assert.equal(
      ExecutiveIntegrationSuiteModelInventory.totalModelInstanceCount,
      derived,
    );
    assert.equal(
      ExecutiveIntegrationSuiteModelInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteModelInventory.relationshipsExcludedFromInventory,
      true,
    );
    assert.deepEqual(
      [...ExecutiveIntegrationSuiteRelationshipTypes],
      [...EXPECTED_RELATIONSHIP_TYPES],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteRelationshipModels.map(
        (item) => item.relationshipType,
      ),
      [...EXPECTED_RELATIONSHIP_TYPES],
    );
  });

  it("preserves Registry order, uniqueness, Public Index links, and source references", () => {
    assert.deepEqual(
      ExecutiveIntegrationSuiteModuleModels.map((item) => item.sourceRegistryKey),
      ExecutiveIntegrationSuiteRegistry.modules.map((item) => item.key),
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteContractModels.map((item) => item.canonicalKey),
      [...EXPECTED_CONTRACT_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteCapabilityModels.map(
        (item) => item.sourceRegistryKey,
      ),
      ExecutiveIntegrationSuiteRegistry.capabilities.map((item) => item.key),
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteDomainModels.map(
        (item) => item.sourceRegistryKey,
      ),
      ExecutiveIntegrationSuiteRegistry.domains.map((item) => item.key),
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteLifecycleModels.map((item) => item.canonicalKey),
      ExecutiveIntegrationSuiteRegistry.lifecycle.map((item) => item.key),
    );

    assert.ok(
      ExecutiveIntegrationSuiteModuleModels.every(
        (item, index) =>
          item.publicIndexId ===
            ExecutiveIntegrationSuiteRegistry.modules[index]!.publicIndexId &&
          item.publicIndexModule ===
            ExecutiveIntegrationSuiteRegistry.modules[index]!.publicIndexModule,
      ),
    );

    assertUnique(
      ExecutiveIntegrationSuiteModuleModels.map((item) => item.modelId),
      "module model IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteContractModels.map((item) => item.modelId),
      "contract model IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteRelationshipModels.map(
        (item) => item.relationshipId,
      ),
      "relationship IDs",
    );

    assertSequentialOrders(
      ExecutiveIntegrationSuiteModuleModels.map((item) => item.order),
      "modules",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteContractModels.map((item) => item.order),
      "contracts",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteLifecycleModels.map((item) => item.order),
      "lifecycle",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteRelationshipModels.map((item) => item.order),
      "relationships",
    );
  });

  it("exposes immutable aggregate Model and package Model surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteModel), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteModelIdentity), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteModuleModels), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteRelationshipModels),
      true,
    );

    assert.equal(
      ExecutiveIntegrationSuiteModel.modules,
      ExecutiveIntegrationSuiteModuleModels,
    );
    assert.equal(
      ExecutiveIntegrationSuiteModel.relationships,
      ExecutiveIntegrationSuiteRelationshipModels,
    );
    assert.equal(
      ExecutiveIntegrationSuiteModel.inventory,
      ExecutiveIntegrationSuiteModelInventory,
    );

    for (const exportName of REQUIRED_MODEL_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const model = ExecutiveIntegrationSuiteModel;
    assert.equal(model.metadataOnly, true);
    assert.equal(model.compositionOnly, true);
    assert.equal(model.runtimeBehavior, false);
    assert.equal(model.integrationRuntime, false);
    assert.equal(model.orchestration, false);
    assert.equal(model.routing, false);
    assert.equal(model.governance, false);
    assert.equal(model.observability, false);
    assert.equal(model.networkingBehavior, false);
    assert.equal(model.persistenceBehavior, false);
    assert.equal(model.apiBehavior, false);
    assert.equal(model.reactBehavior, false);
    assert.equal(model.importsLaterEil8Phases, false);
  });

  it("has zero prohibited imports across model sources", () => {
    const sources = EIL83_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(join(HERE, file), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
      assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
      assert.match(
        source,
        /from ["']\.\/executiveIntegrationSuiteRegistry\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for model sources", () => {
    const sources = EIL83_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil/executiveIntegrationSuite", name),
    );

    const tsc = spawnSync(
      join(FRONTEND_ROOT, "node_modules/.bin/tsc"),
      [
        "--strict",
        "--noEmit",
        "--pretty",
        "false",
        "--allowImportingTsExtensions",
        "--module",
        "esnext",
        "--moduleResolution",
        "bundler",
        "--target",
        "ES2021",
        "--esModuleInterop",
        "--skipLibCheck",
        "--types",
        "node",
        ...sources,
        "app/lib/eil/executiveIntegrationSuite/index.ts",
        "app/lib/eil/executiveIntegrationSuite/executiveIntegrationSuiteRegistry.ts",
      ],
      {
        cwd: FRONTEND_ROOT,
        encoding: "utf8",
      },
    );
    assert.equal(
      tsc.status,
      0,
      `TypeScript failed:\n${tsc.stdout}\n${tsc.stderr}`,
    );

    const eslint = spawnSync(
      join(FRONTEND_ROOT, "node_modules/.bin/eslint"),
      [...sources, "app/lib/eil/executiveIntegrationSuite/index.ts"],
      {
        cwd: FRONTEND_ROOT,
        encoding: "utf8",
      },
    );
    assert.equal(
      eslint.status,
      0,
      `ESLint failed:\n${eslint.stdout}\n${eslint.stderr}`,
    );
  });
});
