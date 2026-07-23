/**
 * EIL-6:9 — Integration Observability Public Index Tests.
 *
 * Deterministic coverage for the immutable Integration Observability Public Index.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationObservabilityFreeze,
  IntegrationObservabilityFreezeIdentity,
  IntegrationObservabilityFreezeLockId,
} from "./integrationObservabilityFreeze.ts";
import * as PublicIndexModule from "./integrationObservabilityPublicIndex.ts";
import {
  IntegrationObservabilityConsumerEntry,
  IntegrationObservabilityPublicApiCount,
  IntegrationObservabilityPublicApiRegistry,
  IntegrationObservabilityPublicExports,
  IntegrationObservabilityPublicIndex,
  IntegrationObservabilityPublicIndexIdentity,
  IntegrationObservabilityPublicInventory,
  IntegrationObservabilityPublicMetadata,
  IntegrationObservabilityPublicNamespace,
  IntegrationObservabilityPublicReadiness,
  IntegrationObservabilityPublicRelease,
  IntegrationObservabilityPublicSummary,
} from "./integrationObservabilityPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL69_FILES = Object.freeze([
  "integrationObservabilityPublicIndex.ts",
  "integrationObservabilityPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationObservabilityPublicIndexIdentity",
  "IntegrationObservabilityPublicNamespace",
  "IntegrationObservabilityPublicApiRegistry",
  "IntegrationObservabilityPublicApiCount",
  "IntegrationObservabilityPublicInventory",
  "IntegrationObservabilityPublicRelease",
  "IntegrationObservabilityPublicReadiness",
  "IntegrationObservabilityPublicSummary",
  "IntegrationObservabilityConsumerEntry",
  "IntegrationObservabilityPublicIndex",
  "IntegrationObservabilityPublicExports",
  "IntegrationObservabilityPublicMetadata",
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
  /from ["']\.\/integrationObservabilityFreeze(?!\.ts["'])/,
  /from ["']\.\/integrationObservability(Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Identity|Locks|Baselines|Compatibility|Extensions|Architecture|Criteria|Gates|Results|Dependencies|Readiness|Composition|Capabilities|Guarantees|Exports|Rules|Categories|Inventory|Report|DomainModels|ContractModels|CapabilityModels|MetricModels|EventModels|LifecycleModels|DomainRegistry|ContractRegistry|CapabilityRegistry|MetricRegistry|EventRegistry|LifecycleRegistry|Capabilities|Contracts|Domains|Lifecycle|MetricCategories|EventCategories)\.ts["']/,
  /from ["']\.\/integrationObservability(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\.\/integration(?!Observability)/,
  /from ["']\.\.\/integrationPolicyGovernance/,
  /from ["']\.\.\/integrationOrchestration/,
  /from ["']@opentelemetry\//,
  /from ["']prom-client["']/,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("EIL-6:9 Integration Observability Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(EIL69_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EIL69_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    assert.deepEqual(
      [...IntegrationObservabilityPublicExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(IntegrationObservabilityPublicExports.length, 12);
  });

  it("has canonical identity, namespace, version, release states, and ReadyForConsumer", () => {
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.phaseId,
      "EIL-6:9",
    );
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.canonicalId,
      "EIL-6:9/IntegrationObservabilityPublicIndex",
    );
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.name,
      "Integration Observability Public Index",
    );
    assert.equal(IntegrationObservabilityPublicIndexIdentity.version, "1.0.0");
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.namespace,
      "nexora.eil.integration-observability.public-index",
    );
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.status,
      "Released",
    );
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.release,
      "Released",
    );
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.certification,
      "Certified",
    );
    assert.equal(IntegrationObservabilityPublicIndexIdentity.freeze, "Frozen");
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.stability,
      "Stable",
    );
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      IntegrationObservabilityPublicReadiness,
      "ReadyForConsumer",
    );
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.lockId,
      IntegrationObservabilityFreezeLockId,
    );
    assert.equal(
      IntegrationObservabilityFreezeLockId,
      "EIL-6-INTEGRATION-OBSERVABILITY-LOCKED",
    );
  });

  it("consumes Freeze aggregate as the sole upstream dependency", () => {
    assert.equal(IntegrationObservabilityPublicIndex.dependency.freezeOnly, true);
    assert.equal(
      IntegrationObservabilityPublicIndex.dependency.bypassesFreeze,
      false,
    );
    assert.equal(
      IntegrationObservabilityPublicIndex.dependency.upstreamCanonicalId,
      IntegrationObservabilityFreezeIdentity.canonicalId,
    );
    assert.equal(
      IntegrationObservabilityPublicIndex.freezeReference.aggregate,
      IntegrationObservabilityFreeze,
    );
    assert.equal(
      IntegrationObservabilityPublicIndexIdentity.freezeDependency,
      IntegrationObservabilityFreezeIdentity.canonicalId,
    );
  });

  it("publishes exactly nine namespace sections and one consumer entry", () => {
    assert.equal(IntegrationObservabilityPublicNamespace.sections.length, 9);
    assert.equal(IntegrationObservabilityPublicNamespace.sectionCount, 9);
    assert.deepEqual(
      IntegrationObservabilityPublicNamespace.sections.map(
        (item) => item.section,
      ),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assert.deepEqual(
      IntegrationObservabilityPublicNamespace.sections.map(
        (item) => item.ordinal,
      ),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.equal(
      IntegrationObservabilityConsumerEntry.entryPoint,
      "integrationObservabilityPublicIndex.ts",
    );
    assert.equal(IntegrationObservabilityConsumerEntry.soleSupportedEntry, true);
    assert.equal(
      IntegrationObservabilityConsumerEntry.mustImportPublicIndexOnly,
      true,
    );
    assert.equal(
      IntegrationObservabilityConsumerEntry.mayImportFreezeDirectly,
      false,
    );
  });

  it("derives a dynamic Public API Registry with unique IDs and deterministic order", () => {
    assert.equal(
      IntegrationObservabilityPublicApiCount,
      IntegrationObservabilityPublicApiRegistry.length,
    );
    assert.ok(IntegrationObservabilityPublicApiRegistry.length > 12);
    assertUnique(
      IntegrationObservabilityPublicApiRegistry.map((item) => item.apiId),
      "API IDs",
    );
    assertUnique(
      IntegrationObservabilityPublicApiRegistry.map((item) => item.exportName),
      "API export names",
    );
    assert.deepEqual(
      IntegrationObservabilityPublicApiRegistry.map((item) => item.ordinal),
      Array.from(
        { length: IntegrationObservabilityPublicApiRegistry.length },
        (_, index) => index + 1,
      ),
    );
    assert.ok(
      IntegrationObservabilityPublicApiRegistry.every(
        (item) =>
          item.status === "Released" &&
          item.exported === true &&
          item.derivedFromFreeze === true &&
          item.metadataOnly === true,
      ),
    );
    assert.ok(
      IntegrationObservabilityPublicExports.every((exportName) =>
        IntegrationObservabilityPublicApiRegistry.some(
          (api) =>
            api.exportName === exportName && api.sourcePhase === "EIL-6:9",
        ),
      ),
    );
  });

  it("derives inventory from Freeze and preserves release declaration", () => {
    const inventory = IntegrationObservabilityPublicInventory;
    assert.equal(inventory.countsDerivedFromFreeze, true);
    assert.equal(inventory.independentInventory, false);
    assert.equal(inventory.hardcodedTotals, false);
    assert.equal(
      inventory.certificationDerivedInventory,
      IntegrationObservabilityFreeze.certificationDerivedInventory,
    );
    assert.equal(
      inventory.freezeLockCount,
      IntegrationObservabilityFreeze.architecturalLocks.length,
    );
    assert.equal(
      inventory.freezeBaselineCount,
      IntegrationObservabilityFreeze.frozenBaselines.length,
    );
    assert.equal(
      inventory.publicApiCount,
      IntegrationObservabilityPublicApiRegistry.length,
    );

    assert.equal(IntegrationObservabilityPublicRelease.release, "Released");
    assert.equal(
      IntegrationObservabilityPublicRelease.certification,
      "Certified",
    );
    assert.equal(IntegrationObservabilityPublicRelease.freeze, "Frozen");
    assert.equal(IntegrationObservabilityPublicRelease.stability, "Stable");
    assert.equal(
      IntegrationObservabilityPublicRelease.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      IntegrationObservabilityPublicRelease.lockId,
      IntegrationObservabilityFreezeLockId,
    );
    assert.equal(IntegrationObservabilityPublicSummary.release, "Released");
    assert.equal(IntegrationObservabilityPublicIndex.status, "Released");
    assert.equal(IntegrationObservabilityPublicIndex.certification, "Certified");
    assert.equal(IntegrationObservabilityPublicIndex.freeze, "Frozen");
    assert.equal(IntegrationObservabilityPublicIndex.stability, "Stable");
  });

  it("exposes immutable aggregate Public Index metadata", () => {
    assert.equal(Object.isFrozen(IntegrationObservabilityPublicIndex), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityPublicIndexIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityPublicNamespace),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationObservabilityPublicApiRegistry),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationObservabilityPublicExports), true);
    assert.equal(
      Object.isFrozen(IntegrationObservabilityPublicInventory),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationObservabilityPublicRelease), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityPublicSummary), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityConsumerEntry), true);
    assert.equal(Object.isFrozen(IntegrationObservabilityPublicMetadata), true);

    assert.equal(
      IntegrationObservabilityPublicIndex.identity,
      IntegrationObservabilityPublicIndexIdentity,
    );
    assert.equal(
      IntegrationObservabilityPublicIndex.apiRegistry,
      IntegrationObservabilityPublicApiRegistry,
    );
    assert.equal(
      IntegrationObservabilityPublicIndex.lockId,
      IntegrationObservabilityFreezeLockId,
    );
  });

  it("is metadata-only with zero runtime observability behavior", () => {
    const publicIndex = IntegrationObservabilityPublicIndex;
    assert.equal(publicIndex.metadataOnly, true);
    assert.equal(publicIndex.runtimeBehavior, false);
    assert.equal(publicIndex.monitoringEngine, false);
    assert.equal(publicIndex.telemetryPipeline, false);
    assert.equal(publicIndex.openTelemetry, false);
    assert.equal(publicIndex.prometheus, false);
    assert.equal(publicIndex.grafana, false);
    assert.equal(publicIndex.loggingFramework, false);
    assert.equal(publicIndex.tracingRuntime, false);
    assert.equal(publicIndex.metricsEngine, false);
    assert.equal(publicIndex.alertEngine, false);
    assert.equal(publicIndex.healthEngine, false);
    assert.equal(publicIndex.dashboard, false);
    assert.equal(publicIndex.networkingBehavior, false);
    assert.equal(publicIndex.persistenceBehavior, false);
    assert.equal(publicIndex.reactBehavior, false);
    assert.equal(publicIndex.stateMutation, false);
  });

  it("has zero prohibited imports across public index source", () => {
    const source = readFileSync(
      join(HERE, "integrationObservabilityPublicIndex.ts"),
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
      /from ["']\.\/integrationObservabilityFreeze\.ts["']/,
    );
    assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
    assert.doesNotMatch(source, /\b(setTimeout|setInterval|Promise)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
  });

  it("passes strict TypeScript and ESLint for public index source", () => {
    const source = join(
      "app/lib/eil/integrationObservability",
      "integrationObservabilityPublicIndex.ts",
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
        "ES2017",
        "--esModuleInterop",
        "--skipLibCheck",
        "--types",
        "node",
        source,
        "app/lib/eil/integrationObservability/integrationObservabilityFreeze.ts",
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
