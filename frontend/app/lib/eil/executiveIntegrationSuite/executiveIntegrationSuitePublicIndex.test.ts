/**
 * EIL-8:9 — Executive Integration Suite Public Index Tests.
 *
 * Deterministic coverage for the immutable Executive Integration Suite Public Index.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveIntegrationSuiteFreeze,
  ExecutiveIntegrationSuiteFreezeIdentity,
  ExecutiveIntegrationSuiteFreezeLockId,
} from "./executiveIntegrationSuiteFreeze.ts";
import * as PublicIndexModule from "./executiveIntegrationSuitePublicIndex.ts";
import {
  ExecutiveIntegrationSuiteConsumerEntry,
  ExecutiveIntegrationSuitePublicApiCount,
  ExecutiveIntegrationSuitePublicApiRegistry,
  ExecutiveIntegrationSuitePublicExports,
  ExecutiveIntegrationSuitePublicIndex,
  ExecutiveIntegrationSuitePublicIndexIdentity,
  ExecutiveIntegrationSuitePublicInventory,
  ExecutiveIntegrationSuitePublicMetadata,
  ExecutiveIntegrationSuitePublicNamespace,
  ExecutiveIntegrationSuitePublicReadiness,
  ExecutiveIntegrationSuitePublicRelease,
  ExecutiveIntegrationSuitePublicSummary,
} from "./executiveIntegrationSuitePublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL89_FILES = Object.freeze([
  "executiveIntegrationSuitePublicIndex.ts",
  "executiveIntegrationSuitePublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveIntegrationSuitePublicIndexIdentity",
  "ExecutiveIntegrationSuitePublicNamespace",
  "ExecutiveIntegrationSuitePublicApiRegistry",
  "ExecutiveIntegrationSuitePublicApiCount",
  "ExecutiveIntegrationSuitePublicInventory",
  "ExecutiveIntegrationSuitePublicRelease",
  "ExecutiveIntegrationSuitePublicReadiness",
  "ExecutiveIntegrationSuitePublicSummary",
  "ExecutiveIntegrationSuiteConsumerEntry",
  "ExecutiveIntegrationSuitePublicIndex",
  "ExecutiveIntegrationSuitePublicExports",
  "ExecutiveIntegrationSuitePublicMetadata",
] as const);

const EXPECTED_NAMESPACE_SECTIONS = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Certification",
  "Freeze",
  "Public Index",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationSuiteFreeze(?!\.ts["'])/,
  /from ["']\.\/executiveIntegrationSuite(Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Identity|Locks|Baselines|Compatibility|Extensions|Architecture|Criteria|Gates|Results|Dependencies|Readiness|Composition|Capabilities|Guarantees|Exports|Rules|Categories|Inventory|Report)\.ts["']/,
  /from ["']\.\/executiveIntegrationSuite(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\.\/integration/,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("EIL-8:9 Executive Integration Suite Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(EIL89_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EIL89_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    assert.deepEqual(
      [...ExecutiveIntegrationSuitePublicExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(ExecutiveIntegrationSuitePublicExports.length, 12);
  });

  it("has canonical identity, namespace, version, release states, and ReadyForConsumer", () => {
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.phaseId,
      "EIL-8:9",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.canonicalId,
      "EIL-8:9/ExecutiveIntegrationSuitePublicIndex",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.name,
      "Executive Integration Suite Public Index",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.version,
      "1.0.0",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.namespace,
      "nexora.eil.executive-integration-suite.public-index",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.status,
      "Released",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.release,
      "Released",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.certification,
      "Certified",
    );
    assert.equal(ExecutiveIntegrationSuitePublicIndexIdentity.freeze, "Frozen");
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.stability,
      "Stable",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicReadiness,
      "ReadyForConsumer",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.lockId,
      ExecutiveIntegrationSuiteFreezeLockId,
    );
    assert.equal(
      ExecutiveIntegrationSuiteFreezeLockId,
      "EIL-8-EXECUTIVE-INTEGRATION-SUITE-LOCKED",
    );
  });

  it("consumes Freeze aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationSuitePublicIndex.dependency.freezeOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndex.dependency.bypassesFreeze,
      false,
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndex.dependency.upstreamCanonicalId,
      ExecutiveIntegrationSuiteFreezeIdentity.canonicalId,
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndex.freezeReference.aggregate,
      ExecutiveIntegrationSuiteFreeze,
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndexIdentity.freezeDependency,
      ExecutiveIntegrationSuiteFreezeIdentity.canonicalId,
    );
  });

  it("publishes exactly nine namespace sections and one consumer entry", () => {
    assert.equal(ExecutiveIntegrationSuitePublicNamespace.sections.length, 9);
    assert.equal(ExecutiveIntegrationSuitePublicNamespace.sectionCount, 9);
    assert.deepEqual(
      ExecutiveIntegrationSuitePublicNamespace.sections.map(
        (item) => item.section,
      ),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuitePublicNamespace.sections.map(
        (item) => item.ordinal,
      ),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.equal(
      ExecutiveIntegrationSuiteConsumerEntry.entryPoint,
      "executiveIntegrationSuitePublicIndex.ts",
    );
    assert.equal(
      ExecutiveIntegrationSuiteConsumerEntry.soleSupportedEntry,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteConsumerEntry.mustImportPublicIndexOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteConsumerEntry.mayImportFreezeDirectly,
      false,
    );
  });

  it("derives a dynamic Public API Registry with unique IDs and deterministic order", () => {
    assert.equal(
      ExecutiveIntegrationSuitePublicApiCount,
      ExecutiveIntegrationSuitePublicApiRegistry.length,
    );
    assert.ok(ExecutiveIntegrationSuitePublicApiRegistry.length > 12);
    assertUnique(
      ExecutiveIntegrationSuitePublicApiRegistry.map((item) => item.apiId),
      "API IDs",
    );
    assertUnique(
      ExecutiveIntegrationSuitePublicApiRegistry.map((item) => item.exportName),
      "API export names",
    );
    assert.deepEqual(
      ExecutiveIntegrationSuitePublicApiRegistry.map((item) => item.ordinal),
      Array.from(
        { length: ExecutiveIntegrationSuitePublicApiRegistry.length },
        (_, index) => index + 1,
      ),
    );
    assert.ok(
      ExecutiveIntegrationSuitePublicApiRegistry.every(
        (item) =>
          item.status === "Released" &&
          item.exported === true &&
          item.derivedFromFreeze === true &&
          item.metadataOnly === true,
      ),
    );
    assert.ok(
      ExecutiveIntegrationSuitePublicExports.every((exportName) =>
        ExecutiveIntegrationSuitePublicApiRegistry.some(
          (api) =>
            api.exportName === exportName && api.sourcePhase === "EIL-8:9",
        ),
      ),
    );
  });

  it("derives inventory from Freeze and preserves release declaration", () => {
    const inventory = ExecutiveIntegrationSuitePublicInventory;
    assert.equal(inventory.countsDerivedFromFreeze, true);
    assert.equal(inventory.independentInventory, false);
    assert.equal(inventory.hardcodedTotals, false);
    assert.equal(
      inventory.certificationDerivedInventory,
      ExecutiveIntegrationSuiteFreeze.certificationDerivedInventory,
    );
    assert.equal(
      inventory.freezeLockCount,
      ExecutiveIntegrationSuiteFreeze.architecturalLocks.length,
    );
    assert.equal(
      inventory.freezeBaselineCount,
      ExecutiveIntegrationSuiteFreeze.frozenBaselines.length,
    );
    assert.equal(
      inventory.publicApiCount,
      ExecutiveIntegrationSuitePublicApiRegistry.length,
    );

    assert.equal(ExecutiveIntegrationSuitePublicRelease.release, "Released");
    assert.equal(
      ExecutiveIntegrationSuitePublicRelease.certification,
      "Certified",
    );
    assert.equal(ExecutiveIntegrationSuitePublicRelease.freeze, "Frozen");
    assert.equal(ExecutiveIntegrationSuitePublicRelease.stability, "Stable");
    assert.equal(
      ExecutiveIntegrationSuitePublicRelease.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicRelease.lockId,
      ExecutiveIntegrationSuiteFreezeLockId,
    );
    assert.equal(ExecutiveIntegrationSuitePublicSummary.release, "Released");
    assert.equal(ExecutiveIntegrationSuitePublicIndex.status, "Released");
    assert.equal(
      ExecutiveIntegrationSuitePublicIndex.certification,
      "Certified",
    );
    assert.equal(ExecutiveIntegrationSuitePublicIndex.freeze, "Frozen");
    assert.equal(ExecutiveIntegrationSuitePublicIndex.stability, "Stable");
  });

  it("exposes immutable aggregate Public Index metadata", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuitePublicIndex), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePublicIndexIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePublicNamespace),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePublicApiRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePublicExports),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePublicInventory),
      true,
    );
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuitePublicRelease), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuitePublicSummary), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteConsumerEntry),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuitePublicMetadata),
      true,
    );

    assert.equal(
      ExecutiveIntegrationSuitePublicIndex.identity,
      ExecutiveIntegrationSuitePublicIndexIdentity,
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndex.apiRegistry,
      ExecutiveIntegrationSuitePublicApiRegistry,
    );
    assert.equal(
      ExecutiveIntegrationSuitePublicIndex.lockId,
      ExecutiveIntegrationSuiteFreezeLockId,
    );
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const publicIndex = ExecutiveIntegrationSuitePublicIndex;
    assert.equal(publicIndex.metadataOnly, true);
    assert.equal(publicIndex.compositionOnly, true);
    assert.equal(publicIndex.runtimeBehavior, false);
    assert.equal(publicIndex.integrationRuntime, false);
    assert.equal(publicIndex.orchestration, false);
    assert.equal(publicIndex.routing, false);
    assert.equal(publicIndex.governance, false);
    assert.equal(publicIndex.observability, false);
    assert.equal(publicIndex.certificationEngine, false);
    assert.equal(publicIndex.runtimeValidation, false);
    assert.equal(publicIndex.dashboard, false);
    assert.equal(publicIndex.networkingBehavior, false);
    assert.equal(publicIndex.persistenceBehavior, false);
    assert.equal(publicIndex.reactBehavior, false);
    assert.equal(publicIndex.stateMutation, false);
  });

  it("has zero prohibited imports across public index source", () => {
    const source = readFileSync(
      join(HERE, "executiveIntegrationSuitePublicIndex.ts"),
      "utf8",
    );
    for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
      assert.doesNotMatch(
        source,
        pattern,
        `public index must not match ${pattern}`,
      );
    }
    assert.match(
      source,
      /from ["']\.\/executiveIntegrationSuiteFreeze\.ts["']/,
    );
    assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
    assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
  });

  it("passes strict TypeScript and ESLint for public index source", () => {
    const source = join(
      "app/lib/eil/executiveIntegrationSuite",
      "executiveIntegrationSuitePublicIndex.ts",
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
        source,
        "app/lib/eil/executiveIntegrationSuite/executiveIntegrationSuiteFreeze.ts",
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
      [source],
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
