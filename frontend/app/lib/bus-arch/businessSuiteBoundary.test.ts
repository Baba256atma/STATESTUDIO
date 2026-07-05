import assert from "node:assert/strict";
import test from "node:test";

import {
  BusinessSuiteBoundaryRegistry,
  buildBusinessSuiteBoundaryManifest,
  validateBusinessSuiteBoundary,
} from "./businessSuiteBoundaryIndex.ts";
import type { BusinessSuiteBoundaryManifest } from "./businessSuiteBoundaryTypes.ts";

test("boundary registry exists", () => {
  assert.equal(BusinessSuiteBoundaryRegistry.metadata.boundaryId, "BUS-ARCH-2");
  assert.equal(BusinessSuiteBoundaryRegistry.platformBoundaries.length, 14);
  assert.equal(Object.isFrozen(BusinessSuiteBoundaryRegistry), true);
});

test("ownership matrix valid", () => {
  const manifest = buildBusinessSuiteBoundaryManifest();

  assert.equal(manifest.ownershipMatrix.length, manifest.platformBoundaryCatalog.length);
  assert.equal(manifest.ownershipMatrix.every((ownership) => ownership.exclusive), true);
});

test("responsibility matrix valid", () => {
  const manifest = buildBusinessSuiteBoundaryManifest();

  assert.equal(manifest.responsibilityMatrix.length, manifest.platformBoundaryCatalog.length);
  assert.equal(manifest.responsibilityMatrix.every((entry) => entry.classification === "Responsibility"), true);
});

test("exposure matrix valid", () => {
  const manifest = buildBusinessSuiteBoundaryManifest();

  assert.equal(manifest.exposureMatrix.every((entry) => entry.publicApiBoundary === "Public API Only"), true);
  assert.equal(manifest.exposureMatrix.some((entry) => entry.exposedCapability.endsWith(".manifest")), true);
});

test("restriction matrix valid", () => {
  const manifest = buildBusinessSuiteBoundaryManifest();

  assert.equal(manifest.restrictionMatrix.length, manifest.platformBoundaryCatalog.length * 5);
  assert.equal(manifest.restrictionMatrix.every((entry) => entry.metadataOnly && entry.immutable), true);
});

test("no ownership conflicts", () => {
  const ownershipIds = BusinessSuiteBoundaryRegistry.ownershipRegistry.map((entry) => entry.platformId);

  assert.equal(new Set(ownershipIds).size, ownershipIds.length);
});

test("no duplicate boundaries", () => {
  const boundaryIds = BusinessSuiteBoundaryRegistry.platformBoundaries.map((entry) => entry.boundaryId);

  assert.equal(new Set(boundaryIds).size, boundaryIds.length);
});

test("deterministic manifest", () => {
  const first = buildBusinessSuiteBoundaryManifest();
  const second = buildBusinessSuiteBoundaryManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("immutable metadata", () => {
  const manifest = buildBusinessSuiteBoundaryManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.platformBoundaryCatalog.every((boundary) => boundary.metadataOnly && boundary.immutable), true);
});

test("public API exports valid", () => {
  assert.equal(typeof buildBusinessSuiteBoundaryManifest, "function");
  assert.equal(typeof validateBusinessSuiteBoundary, "function");
  assert.equal(Boolean(BusinessSuiteBoundaryRegistry), true);
});

test("validation succeeds", () => {
  const validation = validateBusinessSuiteBoundary();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate boundary ids", () => {
  const base = buildBusinessSuiteBoundaryManifest();
  const manifest: BusinessSuiteBoundaryManifest = Object.freeze({
    ...base,
    platformBoundaryCatalog: Object.freeze([
      base.platformBoundaryCatalog[0],
      base.platformBoundaryCatalog[0],
    ]),
  });
  const validation = validateBusinessSuiteBoundary(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-boundary:strategy-suite-boundary"), true);
});

test("detects missing ownership", () => {
  const base = buildBusinessSuiteBoundaryManifest();
  const manifest: BusinessSuiteBoundaryManifest = Object.freeze({
    ...base,
    ownershipMatrix: Object.freeze(base.ownershipMatrix.slice(1)),
  });
  const validation = validateBusinessSuiteBoundary(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("ownership-matrix-incomplete"), true);
});

test("detects forbidden exposure", () => {
  const base = buildBusinessSuiteBoundaryManifest();
  const manifest: BusinessSuiteBoundaryManifest = Object.freeze({
    ...base,
    exposureMatrix: Object.freeze([
      Object.freeze({
        ...base.exposureMatrix[0],
        internalImplementationExposed: true as false,
      }),
    ]),
  });
  const validation = validateBusinessSuiteBoundary(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`forbidden-exposure:${base.exposureMatrix[0].exposureId}`), true);
});
