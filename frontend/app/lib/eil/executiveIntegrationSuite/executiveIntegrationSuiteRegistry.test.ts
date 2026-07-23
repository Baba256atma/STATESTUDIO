/**
 * EIL-8:2 — Executive Integration Suite Registry Tests.
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
  ExecutiveIntegrationSuiteFoundation,
  ExecutiveIntegrationSuiteFoundationId,
} from "./executiveIntegrationSuiteFoundation.ts";
import {
  ExecutiveIntegrationSuiteCapabilityRegistry,
  ExecutiveIntegrationSuiteCompositionRegistry,
  ExecutiveIntegrationSuiteContractRegistry,
  ExecutiveIntegrationSuiteDomainRegistry,
  ExecutiveIntegrationSuiteLifecycleRegistry,
  ExecutiveIntegrationSuiteModuleRegistry,
  ExecutiveIntegrationSuiteRegistry,
  ExecutiveIntegrationSuiteRegistryIdentity,
  ExecutiveIntegrationSuiteRegistryInventory,
  ExecutiveIntegrationSuiteRegistryReadiness,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL82_FILES = Object.freeze([
  "executiveIntegrationSuiteRegistry.ts",
  "executiveIntegrationSuiteModuleRegistry.ts",
  "executiveIntegrationSuiteContractRegistry.ts",
  "executiveIntegrationSuiteCapabilityRegistry.ts",
  "executiveIntegrationSuiteDomainRegistry.ts",
  "executiveIntegrationSuiteLifecycleRegistry.ts",
  "executiveIntegrationSuiteCompositionRegistry.ts",
  "executiveIntegrationSuiteRegistry.test.ts",
]);

const REQUIRED_REGISTRY_EXPORTS = Object.freeze([
  "ExecutiveIntegrationSuiteRegistryIdentity",
  "ExecutiveIntegrationSuiteRegistry",
  "ExecutiveIntegrationSuiteModuleRegistry",
  "ExecutiveIntegrationSuiteContractRegistry",
  "ExecutiveIntegrationSuiteCapabilityRegistry",
  "ExecutiveIntegrationSuiteDomainRegistry",
  "ExecutiveIntegrationSuiteLifecycleRegistry",
  "ExecutiveIntegrationSuiteCompositionRegistry",
  "ExecutiveIntegrationSuiteRegistryInventory",
  "ExecutiveIntegrationSuiteRegistryReadiness",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationSuite(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-8:2 Executive Integration Suite Registry", () => {
  it("creates exactly eight Registry files", () => {
    assert.equal(EIL82_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL82_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(present.includes("index.ts"), true);
  });

  it("has canonical identity, namespace, version, Registry status, and ReadyForModel", () => {
    assert.equal(ExecutiveIntegrationSuiteRegistryIdentity.phaseId, "EIL-8:2");
    assert.equal(
      ExecutiveIntegrationSuiteRegistryIdentity.canonicalId,
      "EIL-8:2/ExecutiveIntegrationSuiteRegistry",
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistryIdentity.name,
      "Executive Integration Suite Registry",
    );
    assert.equal(ExecutiveIntegrationSuiteRegistryIdentity.version, "1.0.0");
    assert.equal(
      ExecutiveIntegrationSuiteRegistryIdentity.namespace,
      "nexora.eil.executive-integration-suite.registry",
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistryIdentity.status,
      "Registry",
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistryIdentity.readiness,
      "ReadyForModel",
    );
    assert.equal(ExecutiveIntegrationSuiteRegistryReadiness, "ReadyForModel");
    assert.equal(ExecutiveIntegrationSuiteRegistry.readiness, "ReadyForModel");
    assert.equal(
      ExecutiveIntegrationSuiteRegistryIdentity.upstreamCanonicalId,
      "EIL-8:1/ExecutiveIntegrationSuiteFoundation",
    );
  });

  it("consumes Foundation aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationSuiteRegistry.dependency.foundationOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistry.dependency.upstreamCanonicalId,
      ExecutiveIntegrationSuiteFoundationId,
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistry.foundation,
      ExecutiveIntegrationSuiteFoundation,
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistry.dependency.laterEil8PhaseImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistry.dependency.publicIndexDirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistry.dependency.foundationInternalImport,
      false,
    );
  });

  it("registers exact Foundation collection counts totaling 40", () => {
    assert.equal(ExecutiveIntegrationSuiteModuleRegistry.length, 7);
    assert.equal(ExecutiveIntegrationSuiteContractRegistry.length, 8);
    assert.equal(ExecutiveIntegrationSuiteCapabilityRegistry.length, 8);
    assert.equal(ExecutiveIntegrationSuiteDomainRegistry.length, 8);
    assert.equal(ExecutiveIntegrationSuiteLifecycleRegistry.length, 9);

    const derived =
      ExecutiveIntegrationSuiteModuleRegistry.length +
      ExecutiveIntegrationSuiteContractRegistry.length +
      ExecutiveIntegrationSuiteCapabilityRegistry.length +
      ExecutiveIntegrationSuiteDomainRegistry.length +
      ExecutiveIntegrationSuiteLifecycleRegistry.length;

    assert.equal(
      ExecutiveIntegrationSuiteRegistryInventory.totalRegistryRecordCount,
      derived,
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistryInventory.totalRegistryRecordCount,
      40,
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistryInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistryInventory.hardcodedTotals,
      false,
    );
  });

  it("preserves uniqueness, sequential order, and Foundation references", () => {
    assertUnique(
      ExecutiveIntegrationSuiteModuleRegistry.map((item) => item.id),
      "module IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteContractRegistry.map((item) => item.id),
      "contract IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteCapabilityRegistry.map((item) => item.id),
      "capability IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteDomainRegistry.map((item) => item.id),
      "domain IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuiteLifecycleRegistry.map((item) => item.id),
      "lifecycle IDs",
    );

    assertSequentialOrders(
      ExecutiveIntegrationSuiteModuleRegistry.map((item) => item.order),
      "modules",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteContractRegistry.map((item) => item.order),
      "contracts",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteCapabilityRegistry.map((item) => item.order),
      "capabilities",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteDomainRegistry.map((item) => item.order),
      "domains",
    );
    assertSequentialOrders(
      ExecutiveIntegrationSuiteLifecycleRegistry.map((item) => item.order),
      "lifecycle",
    );

    assert.deepEqual(
      ExecutiveIntegrationSuiteModuleRegistry.map((item) => item.key),
      ExecutiveIntegrationSuiteFoundation.modules.map((item) => item.moduleKey),
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteContractRegistry.map((item) => item.key),
      ExecutiveIntegrationSuiteFoundation.contracts.map(
        (item) => item.contractKey,
      ),
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteCapabilityRegistry.map((item) => item.key),
      ExecutiveIntegrationSuiteFoundation.capabilities.map(
        (item) => item.capabilityKey,
      ),
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteDomainRegistry.map((item) => item.key),
      ExecutiveIntegrationSuiteFoundation.domains.map((item) => item.domainKey),
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteLifecycleRegistry.map((item) => item.key),
      ExecutiveIntegrationSuiteFoundation.lifecycle.stages.map(
        (item) => item.stageKey,
      ),
    );

    assert.ok(
      ExecutiveIntegrationSuiteModuleRegistry.every(
        (item) =>
          item.status === "Registered" &&
          item.foundationReference !== undefined,
      ),
    );
  });

  it("exposes composition registry integrity and package Registry surface", () => {
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteCompositionRegistry),
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCompositionRegistry.moduleCount,
      7,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCompositionRegistry.foundationCompositionReference,
      ExecutiveIntegrationSuiteFoundation.composition,
    );
    assert.equal(
      ExecutiveIntegrationSuiteCompositionRegistry.publicIndexReferences.length,
      7,
    );
    assert.equal(
      ExecutiveIntegrationSuiteRegistry.composition,
      ExecutiveIntegrationSuiteCompositionRegistry,
    );

    for (const exportName of REQUIRED_REGISTRY_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const registry = ExecutiveIntegrationSuiteRegistry;
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
    assert.equal(registry.importsLaterEil8Phases, false);
  });

  it("has zero prohibited imports across registry sources", () => {
    const sources = EIL82_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/executiveIntegrationSuiteFoundation\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for registry sources", () => {
    const sources = EIL82_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/executiveIntegrationSuite/executiveIntegrationSuiteFoundation.ts",
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
