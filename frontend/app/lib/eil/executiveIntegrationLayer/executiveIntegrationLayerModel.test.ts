/**
 * EIL-9:3 — Executive Integration Layer Model Tests.
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
  ExecutiveIntegrationLayerRegistry,
  ExecutiveIntegrationLayerRegistryCanonicalId,
} from "./executiveIntegrationLayerRegistry.ts";
import {
  ExecutiveIntegrationLayerCapabilityModels,
  ExecutiveIntegrationLayerContractModels,
  ExecutiveIntegrationLayerDomainModels,
  ExecutiveIntegrationLayerLifecycleModels,
  ExecutiveIntegrationLayerModel,
  ExecutiveIntegrationLayerModelIdentity,
  ExecutiveIntegrationLayerModelInventory,
  ExecutiveIntegrationLayerModelReadiness,
  ExecutiveIntegrationLayerModuleModels,
  ExecutiveIntegrationLayerRelationshipModels,
  ExecutiveIntegrationLayerRelationshipTypes,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL93_FILES = Object.freeze([
  "executiveIntegrationLayerModel.ts",
  "executiveIntegrationLayerModuleModels.ts",
  "executiveIntegrationLayerContractModels.ts",
  "executiveIntegrationLayerCapabilityModels.ts",
  "executiveIntegrationLayerDomainModels.ts",
  "executiveIntegrationLayerLifecycleModels.ts",
  "executiveIntegrationLayerRelationshipModels.ts",
  "executiveIntegrationLayerModel.test.ts",
]);

const REQUIRED_MODEL_EXPORTS = Object.freeze([
  "ExecutiveIntegrationLayerModelIdentity",
  "ExecutiveIntegrationLayerModel",
  "ExecutiveIntegrationLayerModuleModels",
  "ExecutiveIntegrationLayerContractModels",
  "ExecutiveIntegrationLayerCapabilityModels",
  "ExecutiveIntegrationLayerDomainModels",
  "ExecutiveIntegrationLayerLifecycleModels",
  "ExecutiveIntegrationLayerRelationshipModels",
  "ExecutiveIntegrationLayerRelationshipTypes",
  "ExecutiveIntegrationLayerModelInventory",
  "ExecutiveIntegrationLayerModelReadiness",
  "ExecutiveIntegrationLayerModelCanonicalId",
] as const);

const EXPECTED_CONTRACT_KEYS = Object.freeze([
  "LayerContractModel",
  "LayerCompositionContractModel",
  "SuiteReferenceContractModel",
  "DependencyContractModel",
  "CompatibilityContractModel",
  "LayerIdentityContractModel",
  "LayerLifecycleContractModel",
  "LayerPublicationContractModel",
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
  /from ["']\.\/executiveIntegrationLayer(Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/executiveIntegrationLayerFoundation\.ts["']/,
  /from ["']\.\/executiveIntegrationLayer(Module|Contract|Capability|Domain|Lifecycle|Composition)Registry\.ts["']/,
  /from ["']\.\/executiveIntegrationLayer(Contracts|Capabilities|Domains|Lifecycle|Modules|Composition)\.ts["']/,
  /from ["']\.\.\/executiveIntegrationSuite/,
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

describe("EIL-9:3 Executive Integration Layer Model", () => {
  it("creates exactly eight Model files", () => {
    assert.equal(EIL93_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL93_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Model status, and ReadyForValidation", () => {
    assert.equal(ExecutiveIntegrationLayerModelIdentity.phaseId, "EIL-9:3");
    assert.equal(
      ExecutiveIntegrationLayerModelIdentity.canonicalId,
      "EIL-9:3/ExecutiveIntegrationLayerModel",
    );
    assert.equal(
      ExecutiveIntegrationLayerModelIdentity.name,
      "Executive Integration Layer Model",
    );
    assert.equal(ExecutiveIntegrationLayerModelIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationLayerModelIdentity.namespace,
      "nexora.eil.executive-integration-layer.model",
    );
    assert.equal(ExecutiveIntegrationLayerModelIdentity.status, "Model");
    assert.equal(
      ExecutiveIntegrationLayerModelIdentity.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveIntegrationLayerModelReadiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveIntegrationLayerModel.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveIntegrationLayerModelIdentity.registryDependency,
      ExecutiveIntegrationLayerRegistryCanonicalId,
    );
  });

  it("consumes Registry aggregate as the sole upstream dependency", () => {
    assert.equal(ExecutiveIntegrationLayerModel.dependency.registryOnly, true);
    assert.equal(
      ExecutiveIntegrationLayerModel.dependency.upstreamCanonicalId,
      ExecutiveIntegrationLayerRegistryCanonicalId,
    );
    assert.equal(
      ExecutiveIntegrationLayerModel.registry,
      ExecutiveIntegrationLayerRegistry,
    );
    assert.equal(
      ExecutiveIntegrationLayerModel.dependency.foundationDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerModel.dependency.laterEil9PhaseImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerModel.dependency.publicIndexDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerModel.dependency.eil8DirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerModel.dependency.registryInternalImport,
      false,
    );
  });

  it("publishes exactly 34 canonical model instances and 10 relationship types", () => {
    assert.equal(ExecutiveIntegrationLayerModuleModels.length, 1);
    assert.equal(ExecutiveIntegrationLayerContractModels.length, 8);
    assert.equal(ExecutiveIntegrationLayerCapabilityModels.length, 8);
    assert.equal(ExecutiveIntegrationLayerDomainModels.length, 8);
    assert.equal(ExecutiveIntegrationLayerLifecycleModels.length, 9);
    assert.equal(ExecutiveIntegrationLayerRelationshipModels.length, 10);

    const derived =
      ExecutiveIntegrationLayerModuleModels.length +
      ExecutiveIntegrationLayerContractModels.length +
      ExecutiveIntegrationLayerCapabilityModels.length +
      ExecutiveIntegrationLayerDomainModels.length +
      ExecutiveIntegrationLayerLifecycleModels.length;

    assert.equal(derived, 34);
    assert.equal(
      ExecutiveIntegrationLayerModelInventory.totalModelInstanceCount,
      derived,
    );
    assert.equal(
      ExecutiveIntegrationLayerModelInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerModelInventory.relationshipsExcludedFromInventory,
      true,
    );
    assert.deepEqual(
      [...ExecutiveIntegrationLayerRelationshipTypes],
      [...EXPECTED_RELATIONSHIP_TYPES],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerRelationshipModels.map(
        (item) => item.relationshipType,
      ),
      [...EXPECTED_RELATIONSHIP_TYPES],
    );
  });

  it("preserves Registry order, uniqueness, Public Index links, and source references", () => {
    assert.deepEqual(
      ExecutiveIntegrationLayerModuleModels.map(
        (item) => item.sourceRegistryKey,
      ),
      ExecutiveIntegrationLayerRegistry.modules.map((item) => item.key),
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerContractModels.map((item) => item.canonicalKey),
      [...EXPECTED_CONTRACT_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerCapabilityModels.map(
        (item) => item.sourceRegistryKey,
      ),
      ExecutiveIntegrationLayerRegistry.capabilities.map((item) => item.key),
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerDomainModels.map(
        (item) => item.sourceRegistryKey,
      ),
      ExecutiveIntegrationLayerRegistry.domains.map((item) => item.key),
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerLifecycleModels.map((item) => item.canonicalKey),
      ExecutiveIntegrationLayerRegistry.lifecycle.map((item) => item.key),
    );

    const suiteModuleModel = ExecutiveIntegrationLayerModuleModels[0];
    assert.ok(suiteModuleModel);
    assert.equal(suiteModuleModel.modelId, "EIL-9:3/Module/ExecutiveIntegrationSuite");
    assert.equal(
      suiteModuleModel.publicIndexId,
      "EIL-8:9/ExecutiveIntegrationSuitePublicIndex",
    );
    assert.equal(suiteModuleModel.registryRecord, ExecutiveIntegrationLayerRegistry.modules[0]);
    assert.equal(
      suiteModuleModel.foundationRecord,
      ExecutiveIntegrationLayerRegistry.modules[0]?.foundationReference,
    );
    assert.equal(
      suiteModuleModel.publicIndexId,
      ExecutiveIntegrationLayerRegistry.modules[0]?.publicIndexId,
    );

    assert.ok(
      ExecutiveIntegrationLayerContractModels.every(
        (item) => item.registryRecord !== undefined,
      ),
    );
    assert.ok(
      ExecutiveIntegrationLayerRelationshipModels.every(
        (item) =>
          item.resolvesRuntime === false &&
          item.sourceType.length > 0 &&
          item.targetType.length > 0,
      ),
    );

    assertUnique(
      ExecutiveIntegrationLayerModuleModels.map((item) => item.modelId),
      "module model IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerContractModels.map((item) => item.modelId),
      "contract model IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerRelationshipModels.map(
        (item) => item.relationshipId,
      ),
      "relationship IDs",
    );

    assertSequentialOrders(
      ExecutiveIntegrationLayerModuleModels.map((item) => item.order),
      "modules",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerContractModels.map((item) => item.order),
      "contracts",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerLifecycleModels.map((item) => item.order),
      "lifecycle",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerRelationshipModels.map((item) => item.order),
      "relationships",
    );
  });

  it("exposes immutable aggregate Model and package Model surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerModel), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerModelIdentity), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerModuleModels), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerRelationshipModels),
      true,
    );

    assert.equal(
      ExecutiveIntegrationLayerModel.modules,
      ExecutiveIntegrationLayerModuleModels,
    );
    assert.equal(
      ExecutiveIntegrationLayerModel.relationships,
      ExecutiveIntegrationLayerRelationshipModels,
    );
    assert.equal(
      ExecutiveIntegrationLayerModel.inventory,
      ExecutiveIntegrationLayerModelInventory,
    );

    for (const exportName of REQUIRED_MODEL_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const model = ExecutiveIntegrationLayerModel;
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
    assert.equal(model.importsLaterEil9Phases, false);
  });

  it("has zero prohibited imports across model sources", () => {
    const sources = EIL93_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationLayerRegistry\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for model sources", () => {
    const sources = EIL93_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil/executiveIntegrationLayer", name),
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
        "app/lib/eil/executiveIntegrationLayer/index.ts",
        "app/lib/eil/executiveIntegrationLayer/executiveIntegrationLayerRegistry.ts",
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
      [...sources, "app/lib/eil/executiveIntegrationLayer/index.ts"],
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
