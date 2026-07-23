/**
 * EIL-9:1 — Executive Integration Layer Foundation Tests.
 *
 * Deterministic architectural coverage for the immutable Layer Foundation.
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
  ExecutiveIntegrationLayerCapabilities,
  ExecutiveIntegrationLayerComposition,
  ExecutiveIntegrationLayerContracts,
  ExecutiveIntegrationLayerDomains,
  ExecutiveIntegrationLayerFoundation,
  ExecutiveIntegrationLayerFoundationIdentity,
  ExecutiveIntegrationLayerFoundationInventory,
  ExecutiveIntegrationLayerFoundationReadinessValue,
  ExecutiveIntegrationLayerLifecycleStages,
  ExecutiveIntegrationLayerModules,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL91_FILES = Object.freeze([
  "executiveIntegrationLayerFoundation.ts",
  "executiveIntegrationLayerContracts.ts",
  "executiveIntegrationLayerCapabilities.ts",
  "executiveIntegrationLayerDomains.ts",
  "executiveIntegrationLayerLifecycle.ts",
  "executiveIntegrationLayerModules.ts",
  "executiveIntegrationLayerComposition.ts",
  "index.ts",
]);

const EXPECTED_CONTRACT_KEYS = Object.freeze([
  "LayerContract",
  "LayerCompositionContract",
  "SuiteReferenceContract",
  "DependencyContract",
  "CompatibilityContract",
  "LayerIdentityContract",
  "LayerLifecycleContract",
  "LayerPublicationContract",
] as const);

const EXPECTED_CAPABILITY_KEYS = Object.freeze([
  "LayerComposition",
  "SuiteAggregation",
  "PublicSurfacePublication",
  "DependencyPublication",
  "CompatibilityPublication",
  "LayerIdentity",
  "LayerMetadataPublication",
  "LayerReadiness",
] as const);

const EXPECTED_DOMAIN_KEYS = Object.freeze([
  "Foundation",
  "Layer",
  "Suite",
  "Composition",
  "Dependencies",
  "Compatibility",
  "Publication",
  "Metadata",
] as const);

const EXPECTED_LIFECYCLE_KEYS = Object.freeze([
  "Declared",
  "Registered",
  "Modeled",
  "Validated",
  "Manifested",
  "Platform",
  "Certified",
  "Frozen",
  "PublicIndex",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationLayer(Registry|Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\.\/executiveIntegrationSuite\/executiveIntegrationSuite(?!PublicIndex\.ts["'])/,
  /from ["']\.\.\/executiveIntegrationSuite\/(?!executiveIntegrationSuitePublicIndex\.ts["'])/,
  /from ["']\.\.\/integration/,
  /from ["']react["']/,
  /from ["']next\//,
]);

describe("EIL-9:1 Executive Integration Layer Foundation", () => {
  it("creates exactly eight Foundation package files", () => {
    assert.equal(EIL91_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL91_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Foundation status, and ReadyForRegistry", () => {
    assert.equal(
      ExecutiveIntegrationLayerFoundationIdentity.phaseId,
      "EIL-9:1",
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundationIdentity.canonicalId,
      "EIL-9:1/ExecutiveIntegrationLayerFoundation",
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundationIdentity.name,
      "Executive Integration Layer Foundation",
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundationIdentity.namespace,
      "nexora.eil.executive-integration-layer.foundation",
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundationIdentity.status,
      "Foundation",
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundationIdentity.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundationReadinessValue,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundation.readiness,
      "ReadyForRegistry",
    );
  });

  it("publishes exactly 8 contracts, 8 capabilities, 8 domains, 9 lifecycle stages, and 1 module", () => {
    assert.equal(ExecutiveIntegrationLayerContracts.length, 8);
    assert.equal(ExecutiveIntegrationLayerCapabilities.length, 8);
    assert.equal(ExecutiveIntegrationLayerDomains.length, 8);
    assert.equal(ExecutiveIntegrationLayerLifecycleStages.length, 9);
    assert.equal(ExecutiveIntegrationLayerModules.length, 1);

    assert.deepEqual(
      ExecutiveIntegrationLayerContracts.map((item) => item.contractKey),
      [...EXPECTED_CONTRACT_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerCapabilities.map((item) => item.capabilityKey),
      [...EXPECTED_CAPABILITY_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerDomains.map((item) => item.domainKey),
      [...EXPECTED_DOMAIN_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerLifecycleStages.map((item) => item.stageKey),
      [...EXPECTED_LIFECYCLE_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationLayerModules.map((item) => item.moduleKey),
      ["ExecutiveIntegrationSuite"],
    );
    assert.equal(
      ExecutiveIntegrationLayerModules[0]?.moduleId,
      "EIL-9:1/Module/ExecutiveIntegrationSuite",
    );
  });

  it("derives inventory dynamically and totals exactly 34", () => {
    const inventory = ExecutiveIntegrationLayerFoundationInventory;
    const derived =
      ExecutiveIntegrationLayerContracts.length +
      ExecutiveIntegrationLayerCapabilities.length +
      ExecutiveIntegrationLayerDomains.length +
      ExecutiveIntegrationLayerLifecycleStages.length +
      ExecutiveIntegrationLayerModules.length;

    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(inventory.hardcodedTotals, false);
    assert.equal(inventory.contractCount, 8);
    assert.equal(inventory.capabilityCount, 8);
    assert.equal(inventory.domainCount, 8);
    assert.equal(inventory.lifecycleStageCount, 9);
    assert.equal(inventory.layerModuleCount, 1);
    assert.equal(inventory.totalFoundationEntryCount, derived);
    assert.equal(inventory.totalFoundationEntryCount, 34);
  });

  it("depends only on EIL-8 Public Index", () => {
    assert.equal(
      ExecutiveIntegrationLayerFoundation.dependency.publicIndexOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundation.dependency.eil8PublicIndexOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundation.dependency
        .eil8FoundationThroughFreezeImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerFoundation.dependency.eil1ThroughEil7DirectImport,
      false,
    );
    assert.equal(
      ExecutiveIntegrationLayerComposition.dependencyDirection
        .eil8PublicIndexOnly,
      true,
    );
    assert.ok(
      ExecutiveIntegrationLayerModules.every(
        (item) =>
          item.referencesPublicIndexOnly === true &&
          item.bypassesPublicIndex === false &&
          item.referencesEil1ThroughEil7Directly === false &&
          item.publicIndexId ===
            "EIL-8:9/ExecutiveIntegrationSuitePublicIndex" &&
          item.publicIndexModule ===
            "executiveIntegrationSuitePublicIndex.ts",
      ),
    );
    assert.deepEqual(
      [
        ...ExecutiveIntegrationLayerComposition.canonicalComposition
          .publicIndexIds,
      ],
      ["EIL-8:9/ExecutiveIntegrationSuitePublicIndex"],
    );
  });

  it("exposes immutable aggregate Foundation and package surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerFoundation), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerFoundationIdentity),
      true,
    );
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerContracts), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerCapabilities), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerDomains), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationLayerLifecycleStages),
      true,
    );
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerModules), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationLayerComposition), true);

    assert.ok("ExecutiveIntegrationLayerFoundation" in PackageModule);
    assert.ok("ExecutiveIntegrationLayerModules" in PackageModule);
    assert.ok("ExecutiveIntegrationLayerComposition" in PackageModule);
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const foundation = ExecutiveIntegrationLayerFoundation;
    assert.equal(foundation.metadataOnly, true);
    assert.equal(foundation.compositionOnly, true);
    assert.equal(foundation.runtimeBehavior, false);
    assert.equal(foundation.integrationRuntime, false);
    assert.equal(foundation.orchestration, false);
    assert.equal(foundation.routing, false);
    assert.equal(foundation.governance, false);
    assert.equal(foundation.observability, false);
    assert.equal(foundation.networkingBehavior, false);
    assert.equal(foundation.persistenceBehavior, false);
    assert.equal(foundation.apiBehavior, false);
    assert.equal(foundation.reactBehavior, false);
    assert.equal(foundation.importsLaterEil9Phases, false);
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = EIL91_FILES.filter((name) => name !== "index.ts");
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
    }

    const modulesSource = readFileSync(
      join(HERE, "executiveIntegrationLayerModules.ts"),
      "utf8",
    );
    assert.match(
      modulesSource,
      /from ["']\.\.\/executiveIntegrationSuite\/executiveIntegrationSuitePublicIndex\.ts["']/,
    );
    assert.doesNotMatch(
      modulesSource,
      /from ["']\.\.\/executiveIntegrationSuite\/executiveIntegrationSuite(Foundation|Registry|Model|Validation|Manifest|Platform|Certification|Freeze)\.ts["']/,
    );
  });

  it("passes strict TypeScript and ESLint for foundation sources", () => {
    const sources = EIL91_FILES.map((name) =>
      join("app/lib/eil/executiveIntegrationLayer", name),
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
      sources,
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
