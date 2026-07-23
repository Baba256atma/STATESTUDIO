/**
 * EIL-9:9 — Executive Integration Layer Public Index Tests.
 *
 * Deterministic coverage for the immutable Executive Integration Layer Public Index.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveIntegrationLayerFreeze,
  ExecutiveIntegrationLayerFreezeIdentity,
  ExecutiveIntegrationLayerFreezeLockId,
} from "./executiveIntegrationLayerFreeze.ts";
import * as PublicIndexModule from "./executiveIntegrationLayerPublicIndex.ts";
import {
  ExecutiveIntegrationLayerConsumerEntry,
  ExecutiveIntegrationLayerPublicApiCount,
  ExecutiveIntegrationLayerPublicApiRegistry,
  ExecutiveIntegrationLayerPublicExports,
  ExecutiveIntegrationLayerPublicIndex,
  ExecutiveIntegrationLayerPublicIndexIdentity,
  ExecutiveIntegrationLayerPublicInventory,
  ExecutiveIntegrationLayerPublicMetadata,
  ExecutiveIntegrationLayerPublicNamespace,
  ExecutiveIntegrationLayerPublicReadiness,
  ExecutiveIntegrationLayerPublicRelease,
  ExecutiveIntegrationLayerPublicSummary,
} from "./executiveIntegrationLayerPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL99_FILES = Object.freeze([
  "executiveIntegrationLayerPublicIndex.ts",
  "executiveIntegrationLayerPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveIntegrationLayerPublicIndexIdentity",
  "ExecutiveIntegrationLayerPublicNamespace",
  "ExecutiveIntegrationLayerPublicApiRegistry",
  "ExecutiveIntegrationLayerPublicApiCount",
  "ExecutiveIntegrationLayerPublicInventory",
  "ExecutiveIntegrationLayerPublicRelease",
  "ExecutiveIntegrationLayerPublicReadiness",
  "ExecutiveIntegrationLayerPublicSummary",
  "ExecutiveIntegrationLayerConsumerEntry",
  "ExecutiveIntegrationLayerPublicIndex",
  "ExecutiveIntegrationLayerPublicExports",
  "ExecutiveIntegrationLayerPublicMetadata",
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
  /from ["']\.\/executiveIntegrationLayerFreeze(?!\.ts["'])/,
  /from ["']\.\/executiveIntegrationLayer(Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Identity|Locks|Baselines|Compatibility|Extensions|Architecture|Criteria|Gates|Results|Dependencies|Readiness|Composition|Capabilities|Guarantees|Exports|Rules|Categories|Inventory|Report)\.ts["']/,
  /from ["']\.\/executiveIntegrationLayer(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\.\/executiveIntegrationSuite/,
  /from ["']\.\.\/integration/,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("EIL-9:9 Executive Integration Layer Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(EIL99_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EIL99_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    assert.deepEqual(
      [...ExecutiveIntegrationLayerPublicExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(ExecutiveIntegrationLayerPublicExports.length, 12);
  });

  it("has canonical identity, namespace, version, release states, and ReadyForConsumer", () => {
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.phaseId,
      "EIL-9:9",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.canonicalId,
      "EIL-9:9/ExecutiveIntegrationLayerPublicIndex",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.name,
      "Executive Integration Layer Public Index",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.version,
      "1.0.0",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.namespace,
      "nexora.eil.executive-integration-layer.public-index",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.status,
      "Released",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.release,
      "Released",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.certification,
      "Certified",
    );
    assert.equal(ExecutiveIntegrationLayerPublicIndexIdentity.freeze, "Frozen");
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.stability,
      "Stable",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicReadiness,
      "ReadyForConsumer",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.lockId,
      ExecutiveIntegrationLayerFreezeLockId,
    );
    assert.equal(
      ExecutiveIntegrationLayerFreezeLockId,
      "EIL-9-EXECUTIVE-INTEGRATION-LAYER-LOCKED",
    );
  });

  it("consumes Freeze aggregate as the sole upstream dependency", () => {
    assert.equal(
      ExecutiveIntegrationLayerPublicIndex.dependency.freezeOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndex.dependency.bypassesFreeze,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndex.dependency.upstreamCanonicalId,
      ExecutiveIntegrationLayerFreezeIdentity.canonicalId,
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndex.freezeReference.aggregate,
      ExecutiveIntegrationLayerFreeze,
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndexIdentity.freezeDependency,
      ExecutiveIntegrationLayerFreezeIdentity.canonicalId,
    );
  });

  it("publishes exactly nine namespace sections and one consumer entry", () => {
    assert.equal(ExecutiveIntegrationLayerPublicNamespace.sections.length, 9);
    assert.equal(ExecutiveIntegrationLayerPublicNamespace.sectionCount, 9);
    assert.deepEqual(
      ExecutiveIntegrationLayerPublicNamespace.sections.map(
        (item) => item.section,
      ),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerPublicNamespace.sections.map(
        (item) => item.ordinal,
      ),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.equal(
      ExecutiveIntegrationLayerConsumerEntry.entryPoint,
      "executiveIntegrationLayerPublicIndex.ts",
    );
    assert.equal(
      ExecutiveIntegrationLayerConsumerEntry.soleSupportedEntry,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerConsumerEntry.mustImportPublicIndexOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerConsumerEntry.mayImportFreezeDirectly,
      false,
    );
  });

  it("derives a dynamic Public API Registry with unique IDs and deterministic order", () => {
    assert.equal(
      ExecutiveIntegrationLayerPublicApiCount,
      ExecutiveIntegrationLayerPublicApiRegistry.length,
    );
    assert.ok(ExecutiveIntegrationLayerPublicApiRegistry.length > 12);
    assertUnique(
      ExecutiveIntegrationLayerPublicApiRegistry.map((item) => item.apiId),
      "API IDs",
    );
    assertUnique(
      ExecutiveIntegrationLayerPublicApiRegistry.map((item) => item.exportName),
      "API export names",
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerPublicApiRegistry.map((item) => item.ordinal),
      Array.from(
        { length: ExecutiveIntegrationLayerPublicApiRegistry.length },
        (_, index) => index + 1,
      ),
    );
    assert.ok(
      ExecutiveIntegrationLayerPublicApiRegistry.every(
        (item) =>
          item.status === "Released" &&
          item.exported === true &&
          item.derivedFromFreeze === true &&
          item.metadataOnly === true,
      ),
    );
    assert.ok(
      ExecutiveIntegrationLayerPublicExports.every((exportName) =>
        ExecutiveIntegrationLayerPublicApiRegistry.some(
          (api) =>
            api.exportName === exportName && api.sourcePhase === "EIL-9:9",
        ),
      ),
    );
  });

  it("derives inventory from Freeze and preserves release declaration", () => {
    const inventory = ExecutiveIntegrationLayerPublicInventory;
    assert.equal(inventory.countsDerivedFromFreeze, true);
    assert.equal(inventory.independentInventory, false);
    assert.equal(inventory.hardcodedTotals, false);
    assert.equal(
      inventory.certificationDerivedInventory,
      ExecutiveIntegrationLayerFreeze.certificationDerivedInventory,
    );
    assert.equal(
      inventory.freezeLockCount,
      ExecutiveIntegrationLayerFreeze.architecturalLocks.length,
    );
    assert.equal(
      inventory.freezeBaselineCount,
      ExecutiveIntegrationLayerFreeze.frozenBaselines.length,
    );
    assert.equal(
      inventory.publicApiCount,
      ExecutiveIntegrationLayerPublicApiRegistry.length,
    );

    assert.equal(ExecutiveIntegrationLayerPublicRelease.release, "Released");
    assert.equal(
      ExecutiveIntegrationLayerPublicRelease.certification,
      "Certified",
    );
    assert.equal(ExecutiveIntegrationLayerPublicRelease.freeze, "Frozen");
    assert.equal(ExecutiveIntegrationLayerPublicRelease.stability, "Stable");
    assert.equal(
      ExecutiveIntegrationLayerPublicRelease.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicRelease.lockId,
      ExecutiveIntegrationLayerFreezeLockId,
    );
    assert.equal(ExecutiveIntegrationLayerPublicSummary.release, "Released");
    assert.equal(ExecutiveIntegrationLayerPublicIndex.status, "Released");
    assert.equal(
      ExecutiveIntegrationLayerPublicIndex.certification,
      "Certified",
    );
    assert.equal(ExecutiveIntegrationLayerPublicIndex.freeze, "Frozen");
    assert.equal(ExecutiveIntegrationLayerPublicIndex.stability, "Stable");
  });

  it("exposes immutable aggregate Public Index metadata", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerPublicIndex), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPublicIndexIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPublicNamespace),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPublicApiRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPublicExports),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPublicInventory),
      true,
    );
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerPublicRelease), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerPublicSummary), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerConsumerEntry),
      true,
    );
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerPublicMetadata),
      true,
    );

    assert.equal(
      ExecutiveIntegrationLayerPublicIndex.identity,
      ExecutiveIntegrationLayerPublicIndexIdentity,
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndex.apiRegistry,
      ExecutiveIntegrationLayerPublicApiRegistry,
    );
    assert.equal(
      ExecutiveIntegrationLayerPublicIndex.lockId,
      ExecutiveIntegrationLayerFreezeLockId,
    );
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const publicIndex = ExecutiveIntegrationLayerPublicIndex;
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
      join(HERE, "executiveIntegrationLayerPublicIndex.ts"),
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
      /from ["']\.\/executiveIntegrationLayerFreeze\.ts["']/,
    );
    assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
    assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
  });

  it("passes strict TypeScript and ESLint for public index source", () => {
    const source = join(
      "app/lib/eil/executiveIntegrationLayer",
      "executiveIntegrationLayerPublicIndex.ts",
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
        "app/lib/eil/executiveIntegrationLayer/executiveIntegrationLayerFreeze.ts",
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
