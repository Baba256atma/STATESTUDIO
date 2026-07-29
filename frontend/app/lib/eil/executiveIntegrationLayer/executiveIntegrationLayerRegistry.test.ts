/**
 * EIL-9:2 — Executive Integration Layer Registry Tests.
 *
 * Deterministic architectural coverage for the immutable Registry.
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
  ExecutiveIntegrationLayerFoundation,
  ExecutiveIntegrationLayerFoundationId,
} from "./executiveIntegrationLayerFoundation.ts";
import {
  ExecutiveIntegrationLayerCapabilityRegistry,
  ExecutiveIntegrationLayerCompositionRegistry,
  ExecutiveIntegrationLayerContractRegistry,
  ExecutiveIntegrationLayerDomainRegistry,
  ExecutiveIntegrationLayerLifecycleRegistry,
  ExecutiveIntegrationLayerModuleRegistry,
  ExecutiveIntegrationLayerRegistry,
  ExecutiveIntegrationLayerRegistryIdentity,
  ExecutiveIntegrationLayerRegistryInventory,
  ExecutiveIntegrationLayerRegistryReadiness,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL92_FILES = Object.freeze([
  "executiveIntegrationLayerRegistry.ts",
  "executiveIntegrationLayerModuleRegistry.ts",
  "executiveIntegrationLayerContractRegistry.ts",
  "executiveIntegrationLayerCapabilityRegistry.ts",
  "executiveIntegrationLayerDomainRegistry.ts",
  "executiveIntegrationLayerLifecycleRegistry.ts",
  "executiveIntegrationLayerCompositionRegistry.ts",
  "executiveIntegrationLayerRegistry.test.ts",
]);

const REQUIRED_REGISTRY_EXPORTS = Object.freeze([
  "ExecutiveIntegrationLayerRegistryIdentity",
  "ExecutiveIntegrationLayerRegistry",
  "ExecutiveIntegrationLayerModuleRegistry",
  "ExecutiveIntegrationLayerContractRegistry",
  "ExecutiveIntegrationLayerCapabilityRegistry",
  "ExecutiveIntegrationLayerDomainRegistry",
  "ExecutiveIntegrationLayerLifecycleRegistry",
  "ExecutiveIntegrationLayerCompositionRegistry",
  "ExecutiveIntegrationLayerRegistryInventory",
  "ExecutiveIntegrationLayerRegistryReadiness",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationLayer(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-9:2 Executive Integration Layer Registry", () => {
  it("creates exactly eight Registry files", () => {
    assert.equal(EIL92_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL92_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(present.includes("index.ts"), true);
  });

  it("has canonical identity, namespace, version, Registry status, and ReadyForModel", () => {
    assert.equal(ExecutiveIntegrationLayerRegistryIdentity.phaseId, "EIL-9:2");
    assert.equal(
      ExecutiveIntegrationLayerRegistryIdentity.canonicalId,
      "EIL-9:2/ExecutiveIntegrationLayerRegistry",
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistryIdentity.name,
      "Executive Integration Layer Registry",
    );
    assert.equal(ExecutiveIntegrationLayerRegistryIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationLayerRegistryIdentity.namespace,
      "nexora.eil.executive-integration-layer.registry",
    );
    assert.equal(ExecutiveIntegrationLayerRegistryIdentity.status, "Registry");
    assert.equal(
      ExecutiveIntegrationLayerRegistryIdentity.readiness,
      "ReadyForModel",
    );
    assert.equal(ExecutiveIntegrationLayerRegistryReadiness, "ReadyForModel");
    assert.equal(ExecutiveIntegrationLayerRegistry.readiness, "ReadyForModel");
    assert.equal(
      ExecutiveIntegrationLayerRegistryIdentity.upstreamPhase,
      "EIL-9:1",
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistryIdentity.upstreamCanonicalId,
      "EIL-9:1/ExecutiveIntegrationLayerFoundation",
    );
  });

  it("consumes Foundation aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationLayerRegistry.dependency.foundationOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistry.dependency.upstreamCanonicalId,
      ExecutiveIntegrationLayerFoundationId,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistry.foundation,
      ExecutiveIntegrationLayerFoundation,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistry.dependency.laterEil9PhaseImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistry.dependency.publicIndexDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistry.dependency.foundationInternalImport,
      false,
    );
  });

  it("registers exact Foundation collection counts totaling 34", () => {
    assert.equal(ExecutiveIntegrationLayerModuleRegistry.length, 1);
    assert.equal(ExecutiveIntegrationLayerContractRegistry.length, 8);
    assert.equal(ExecutiveIntegrationLayerCapabilityRegistry.length, 8);
    assert.equal(ExecutiveIntegrationLayerDomainRegistry.length, 8);
    assert.equal(ExecutiveIntegrationLayerLifecycleRegistry.length, 9);

    const derived =
      ExecutiveIntegrationLayerModuleRegistry.length +
      ExecutiveIntegrationLayerContractRegistry.length +
      ExecutiveIntegrationLayerCapabilityRegistry.length +
      ExecutiveIntegrationLayerDomainRegistry.length +
      ExecutiveIntegrationLayerLifecycleRegistry.length;

    assert.equal(
      ExecutiveIntegrationLayerRegistryInventory.totalRegistryRecordCount,
      derived,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistryInventory.totalRegistryRecordCount,
      34,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistryInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistryInventory.hardcodedTotals,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistryInventory.compositionExcludedFromInventory,
      true,
    );
  });

  it("preserves uniqueness, sequential order, and Foundation references", () => {
    const allIds = [
      ...ExecutiveIntegrationLayerModuleRegistry.map((item) => item.id),
      ...ExecutiveIntegrationLayerContractRegistry.map((item) => item.id),
      ...ExecutiveIntegrationLayerCapabilityRegistry.map((item) => item.id),
      ...ExecutiveIntegrationLayerDomainRegistry.map((item) => item.id),
      ...ExecutiveIntegrationLayerLifecycleRegistry.map((item) => item.id),
    ];
    assertUnique(allIds, "all Registry canonical IDs");

    assertUnique(
      ExecutiveIntegrationLayerModuleRegistry.map((item) => item.key),
      "module keys",
    );
    assertUnique(
      ExecutiveIntegrationLayerContractRegistry.map((item) => item.key),
      "contract keys",
    );
    assertUnique(
      ExecutiveIntegrationLayerCapabilityRegistry.map((item) => item.key),
      "capability keys",
    );
    assertUnique(
      ExecutiveIntegrationLayerDomainRegistry.map((item) => item.key),
      "domain keys",
    );
    assertUnique(
      ExecutiveIntegrationLayerLifecycleRegistry.map((item) => item.key),
      "lifecycle keys",
    );

    assertSequentialOrders(
      ExecutiveIntegrationLayerModuleRegistry.map((item) => item.order),
      "modules",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerContractRegistry.map((item) => item.order),
      "contracts",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerCapabilityRegistry.map((item) => item.order),
      "capabilities",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerDomainRegistry.map((item) => item.order),
      "domains",
    );
    assertSequentialOrders(
      ExecutiveIntegrationLayerLifecycleRegistry.map((item) => item.order),
      "lifecycle",
    );

    assert.deepEqual(
      ExecutiveIntegrationLayerModuleRegistry.map((item) => item.key),
      ExecutiveIntegrationLayerFoundation.modules.map((item) => item.moduleKey),
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerContractRegistry.map((item) => item.key),
      ExecutiveIntegrationLayerFoundation.contracts.map(
        (item) => item.contractKey,
      ),
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerCapabilityRegistry.map((item) => item.key),
      ExecutiveIntegrationLayerFoundation.capabilities.map(
        (item) => item.capabilityKey,
      ),
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerDomainRegistry.map((item) => item.key),
      ExecutiveIntegrationLayerFoundation.domains.map((item) => item.domainKey),
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerLifecycleRegistry.map((item) => item.key),
      ExecutiveIntegrationLayerFoundation.lifecycle.stages.map(
        (item) => item.stageKey,
      ),
    );

    const allRecords = [
      ...ExecutiveIntegrationLayerModuleRegistry,
      ...ExecutiveIntegrationLayerContractRegistry,
      ...ExecutiveIntegrationLayerCapabilityRegistry,
      ...ExecutiveIntegrationLayerDomainRegistry,
      ...ExecutiveIntegrationLayerLifecycleRegistry,
    ];
    assert.ok(
      allRecords.every(
        (item) =>
          item.status === "Registered" &&
          item.sourcePhase === "EIL-9:1" &&
          item.resolvesRuntime === false &&
          item.foundationReference !== undefined &&
          item.sourceCanonicalId.length > 0,
      ),
    );

    const suiteModuleRecord = ExecutiveIntegrationLayerModuleRegistry[0];
    assert.ok(suiteModuleRecord);
    assert.equal(suiteModuleRecord.id, "EIL-9:2/Module/ExecutiveIntegrationSuite");
    assert.equal(
      suiteModuleRecord.publicIndexId,
      "EIL-8:9/ExecutiveIntegrationSuitePublicIndex",
    );
    assert.equal(suiteModuleRecord.referencesPublicIndexOnly, true);
    assert.equal(suiteModuleRecord.bypassesPublicIndex, false);
    assert.equal(suiteModuleRecord.referencesEil1ThroughEil7Directly, false);
    assert.equal(
      suiteModuleRecord.publicIndexNamespace,
      suiteModuleRecord.foundationReference.publicIndexNamespace,
    );
    assert.equal(
      suiteModuleRecord.suiteLockId,
      suiteModuleRecord.foundationReference.suiteLockId,
    );
    assert.equal(
      suiteModuleRecord.suiteConsumerEntry,
      suiteModuleRecord.foundationReference.suiteConsumerEntry,
    );
    assert.equal(
      suiteModuleRecord.suiteReadiness,
      suiteModuleRecord.foundationReference.suiteReadiness,
    );
  });

  it("exposes composition registry integrity and package Registry surface", () => {
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerCompositionRegistry),
      true,
    );
    assert.equal(ExecutiveIntegrationLayerCompositionRegistry.moduleCount, 1);
    assert.equal(
      ExecutiveIntegrationLayerCompositionRegistry
        .foundationCompositionReference,
      ExecutiveIntegrationLayerFoundation.composition,
    );
    assert.equal(
      ExecutiveIntegrationLayerCompositionRegistry.publicIndexReferences.length,
      1,
    );
    assert.equal(
      ExecutiveIntegrationLayerCompositionRegistry.layerIdentity,
      ExecutiveIntegrationLayerFoundation.composition.layerIdentity,
    );
    assert.equal(
      ExecutiveIntegrationLayerCompositionRegistry.compositionOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerCompositionRegistry.introducesRuntimeBehavior,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerCompositionRegistry.duplicatesFoundationMetadata,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerCompositionRegistry.bypassesSuitePublicIndex,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerCompositionRegistry.exposesEil1ThroughEil7Directly,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerCompositionRegistry.dependencyDirection
        .directPublicIndexImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerRegistry.composition,
      ExecutiveIntegrationLayerCompositionRegistry,
    );

    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerRegistry), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerModuleRegistry), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerContractRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerCapabilityRegistry),
      true,
    );
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerDomainRegistry), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerLifecycleRegistry),
      true,
    );

    for (const exportName of REQUIRED_REGISTRY_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const registry = ExecutiveIntegrationLayerRegistry;
    assert.equal(registry.metadataOnly, true);
    assert.equal(registry.compositionOnly, true);
    assert.equal(registry.runtimeBehavior, false);
    assert.equal(registry.integrationRuntime, false);
    assert.equal(registry.orchestration, false);
    assert.equal(registry.routing, false);
    assert.equal(registry.governance, false);
    assert.equal(registry.observability, false);
    assert.equal(registry.networkingBehavior, false);
    assert.equal(registry.persistenceBehavior, false);
    assert.equal(registry.apiBehavior, false);
    assert.equal(registry.reactBehavior, false);
    assert.equal(registry.importsLaterEil9Phases, false);
  });

  it("has zero prohibited imports across registry sources", () => {
    const sources = EIL92_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationLayerFoundation\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for registry sources", () => {
    const sources = EIL92_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationLayer/executiveIntegrationLayerFoundation.ts",
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
