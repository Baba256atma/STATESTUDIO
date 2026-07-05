import assert from "node:assert/strict";
import test from "node:test";

import {
  BusinessSuiteArchitectureRegistry,
  buildBusinessSuiteArchitectureManifest,
  validateBusinessSuiteArchitecture,
} from "./businessSuiteArchitectureIndex.ts";
import type { BusinessSuiteArchitecture } from "./businessSuiteArchitectureTypes.ts";
import type { BusinessPlatformCategory } from "./businessSuiteArchitectureTypes.ts";

test("architecture registry exists", () => {
  assert.equal(BusinessSuiteArchitectureRegistry.metadata.architectureId, "BUS-ARCH");
  assert.equal(BusinessSuiteArchitectureRegistry.version.versionId, "BUS-ARCH-1");
  assert.equal(Object.isFrozen(BusinessSuiteArchitectureRegistry), true);
});

test("manifest deterministic and reproducible", () => {
  const first = buildBusinessSuiteArchitectureManifest();
  const second = buildBusinessSuiteArchitectureManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(first.metadata.certificationState, "Ready for BUS-ARCH-2");
});

test("validation passes", () => {
  const validation = validateBusinessSuiteArchitecture();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("platform registry immutable and unique", () => {
  const platforms = BusinessSuiteArchitectureRegistry.platforms;
  const ids = platforms.map((platform) => platform.platformId);

  assert.equal(platforms.length, 14);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(Object.isFrozen(platforms), true);
  assert.equal(platforms.every((platform) => platform.metadataOnly && platform.immutable), true);
});

test("layer registry immutable and unique", () => {
  const layers = BusinessSuiteArchitectureRegistry.layers;
  const ids = layers.map((layer) => layer.layerId);

  assert.equal(layers.length, 8);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(Object.isFrozen(layers), true);
});

test("categories complete and unique", () => {
  const categories = BusinessSuiteArchitectureRegistry.categories;

  assert.equal(categories.includes("Strategic"), true);
  assert.equal(categories.includes("Future"), true);
  assert.equal(new Set(categories).size, categories.length);
});

test("architecture principles complete", () => {
  const principleNames = BusinessSuiteArchitectureRegistry.principles.map((principle) => principle.principleName);

  assert.equal(principleNames.includes("Metadata First"), true);
  assert.equal(principleNames.includes("Backward Compatibility"), true);
  assert.equal(BusinessSuiteArchitectureRegistry.principles.every((principle) => principle.required && principle.metadataOnly), true);
});

test("detects duplicate platforms", () => {
  const manifest: BusinessSuiteArchitecture = Object.freeze({
    ...buildBusinessSuiteArchitectureManifest(),
    platforms: Object.freeze([
      BusinessSuiteArchitectureRegistry.platforms[0],
      BusinessSuiteArchitectureRegistry.platforms[0],
    ]),
  });
  const validation = validateBusinessSuiteArchitecture(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-platform:strategy-suite"), true);
});

test("detects duplicate layers", () => {
  const manifest: BusinessSuiteArchitecture = Object.freeze({
    ...buildBusinessSuiteArchitectureManifest(),
    layers: Object.freeze([
      BusinessSuiteArchitectureRegistry.layers[0],
      BusinessSuiteArchitectureRegistry.layers[0],
    ]),
  });
  const validation = validateBusinessSuiteArchitecture(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-layer:business-suite"), true);
});

test("detects duplicate categories", () => {
  const manifest: BusinessSuiteArchitecture = Object.freeze({
    ...buildBusinessSuiteArchitectureManifest(),
    categories: Object.freeze(["Strategic", "Strategic"] as readonly BusinessPlatformCategory[]),
  });
  const validation = validateBusinessSuiteArchitecture(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-category:Strategic"), true);
});

test("public API exports valid", () => {
  assert.equal(typeof buildBusinessSuiteArchitectureManifest, "function");
  assert.equal(typeof validateBusinessSuiteArchitecture, "function");
  assert.equal(Boolean(BusinessSuiteArchitectureRegistry), true);
});

test("version metadata valid", () => {
  const manifest = buildBusinessSuiteArchitectureManifest();

  assert.equal(manifest.version.version, "1.0.0");
  assert.equal(manifest.version.releaseState, "Architecture Foundation");
  assert.equal(manifest.version.deterministic, true);
});
