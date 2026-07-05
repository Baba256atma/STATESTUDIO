import assert from "node:assert/strict";
import test from "node:test";

import { buildBusinessSuiteArchitectureManifest } from "./businessSuiteArchitectureIndex.ts";
import { buildBusinessSuiteBoundaryManifest } from "./businessSuiteBoundaryIndex.ts";
import {
  BusinessSuiteDependencyRegistry,
  buildBusinessSuiteDependencyManifest,
  validateBusinessSuiteDependencyMap,
} from "./businessSuiteDependencyIndex.ts";
import type { BusinessSuiteDependencyMap } from "./businessSuiteDependencyTypes.ts";

test("dependency registry exists", () => {
  assert.equal(BusinessSuiteDependencyRegistry.metadata.dependencyMapId, "BUS-ARCH-3");
  assert.equal(BusinessSuiteDependencyRegistry.dependencyMap.length, 28);
  assert.equal(Object.isFrozen(BusinessSuiteDependencyRegistry), true);
});

test("consumer registry exists", () => {
  const manifest = buildBusinessSuiteDependencyManifest();

  assert.equal(manifest.consumerCatalog.length, manifest.dependencyCatalog.length);
  assert.equal(manifest.consumerCatalog.every((consumer) => consumer.metadataOnly && consumer.immutable), true);
});

test("provider registry exists", () => {
  const manifest = buildBusinessSuiteDependencyManifest();

  assert.equal(manifest.providerCatalog.length, manifest.dependencyCatalog.length);
  assert.equal(manifest.providerCatalog.every((provider) => provider.metadataOnly && provider.immutable), true);
});

test("all platforms are known", () => {
  const manifest = buildBusinessSuiteDependencyManifest();
  const knownPlatformIds = new Set(manifest.knownPlatformIds);

  assert.equal(manifest.dependencyCatalog.every((dependency) => knownPlatformIds.has(dependency.sourcePlatformId)), true);
  assert.equal(manifest.dependencyCatalog.every((dependency) => knownPlatformIds.has(dependency.targetPlatformId)), true);
});

test("no duplicate dependency edges", () => {
  const manifest = buildBusinessSuiteDependencyManifest();
  const edges = manifest.dependencyCatalog.map((dependency) => `${dependency.sourcePlatformId}->${dependency.targetPlatformId}`);

  assert.equal(new Set(edges).size, edges.length);
});

test("no circular dependencies", () => {
  const validation = validateBusinessSuiteDependencyMap();

  assert.equal(validation.errors.includes("circular-dependency-detected"), false);
});

test("forbidden dependencies are rejected", () => {
  const base = buildBusinessSuiteDependencyManifest();
  const forbidden = base.forbiddenDependencies[0];
  const manifest: BusinessSuiteDependencyMap = Object.freeze({
    ...base,
    dependencyCatalog: Object.freeze([...base.dependencyCatalog, forbidden]),
    allowedDependencies: Object.freeze([...base.allowedDependencies, forbidden]),
    knownPlatformIds: Object.freeze([...base.knownPlatformIds, forbidden.targetPlatformId]),
  });
  const validation = validateBusinessSuiteDependencyMap(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`forbidden-dependency:${forbidden.dependencyId}`), true);
});

test("public API dependency rules are enforced", () => {
  const base = buildBusinessSuiteDependencyManifest();
  const dependency = base.dependencyCatalog[0];
  const manifest: BusinessSuiteDependencyMap = Object.freeze({
    ...base,
    dependencyCatalog: Object.freeze([
      Object.freeze({
        ...dependency,
        allowedPublicApiSurface: Object.freeze(["private-module-access"] as const),
      }),
      ...base.dependencyCatalog.slice(1),
    ]),
  });
  const validation = validateBusinessSuiteDependencyMap(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`private-module-dependency:${dependency.dependencyId}`), true);
});

test("BUS-ARCH-1 compatibility", () => {
  const architectureManifest = buildBusinessSuiteArchitectureManifest();
  const dependencyManifest = buildBusinessSuiteDependencyManifest();

  assert.equal(architectureManifest.metadata.architectureId, dependencyManifest.architectureId);
});

test("BUS-ARCH-2 compatibility", () => {
  const boundaryManifest = buildBusinessSuiteBoundaryManifest();
  const dependencyManifest = buildBusinessSuiteDependencyManifest();

  assert.equal(boundaryManifest.platformBoundaryCatalog.length, dependencyManifest.knownPlatformIds.length - 2);
});

test("deterministic manifest", () => {
  const first = buildBusinessSuiteDependencyManifest();
  const second = buildBusinessSuiteDependencyManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("immutable metadata", () => {
  const manifest = buildBusinessSuiteDependencyManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.dependencyCatalog.every((dependency) => dependency.metadataOnly && dependency.immutable), true);
});

test("public API exports valid", () => {
  assert.equal(typeof buildBusinessSuiteDependencyManifest, "function");
  assert.equal(typeof validateBusinessSuiteDependencyMap, "function");
  assert.equal(Boolean(BusinessSuiteDependencyRegistry), true);
});

test("validation succeeds", () => {
  const validation = validateBusinessSuiteDependencyMap();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});
