import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveFinancePlatformFoundation } from "./financeIndex.ts";
import { ExecutiveFinanceRegistryFoundation } from "./financeRegistryIndex.ts";
import { ExecutiveFinanceModelFoundation } from "./financeModelIndex.ts";
import { ExecutiveFinanceValidationFoundation } from "./financeValidationIndex.ts";
import {
  ExecutiveFinanceManifestFoundation,
  FinanceCompatibility,
  FinanceDependencyMatrix,
  FinanceExtensionPolicy,
  FinanceManifest,
  buildFinanceManifest,
  getFinanceCompatibility,
  getFinanceDependencyMatrix,
  getFinanceExtensionPolicy,
  getFinanceManifest,
} from "./financeManifestIndex.ts";

test("consumes previous phases only through public APIs", () => {
  assert.equal(ExecutiveFinancePlatformFoundation.FinanceIdentity.platformId, "BUS-28");
  assert.equal(ExecutiveFinanceRegistryFoundation.FinanceObjectRegistry.objects.length, 16);
  assert.equal(ExecutiveFinanceModelFoundation.FinanceModelRegistry.entities.length, 16);
  assert.equal(typeof ExecutiveFinanceValidationFoundation.runFinanceValidation, "function");
});

test("manifest is immutable", () => {
  const manifest = getFinanceManifest();

  assert.equal(manifest, FinanceManifest);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.phaseRegistry), true);
});

test("compatibility matrix exists", () => {
  const compatibility = getFinanceCompatibility();

  assert.equal(compatibility, FinanceCompatibility);
  assert.equal(compatibility.entries.length, 6);
  assert.equal(compatibility.entries.every((entry) => entry.status === "Compatible"), true);
});

test("dependency matrix exists", () => {
  const dependencyMatrix = getFinanceDependencyMatrix();

  assert.equal(dependencyMatrix, FinanceDependencyMatrix);
  assert.equal(dependencyMatrix.entries.length, 4);
  assert.equal(
    dependencyMatrix.entries.every((entry) => entry.publicApiBoundary.endsWith("Index.ts")),
    true,
  );
});

test("extension policy exists", () => {
  const extensionPolicy = getFinanceExtensionPolicy();

  assert.equal(extensionPolicy, FinanceExtensionPolicy);
  assert.equal(extensionPolicy.allowedExtensions.length, 4);
  assert.equal(extensionPolicy.publicApiStability, "stable");
});

test("phase registry is complete", () => {
  const manifest = getFinanceManifest();

  assert.equal(manifest.phaseRegistry.length, 5);
  assert.deepEqual(
    manifest.phaseRegistry.map((phase) => phase.phaseId),
    ["BUS-28:1", "BUS-28:2", "BUS-28:3", "BUS-28:4", "BUS-28:5"],
  );
});

test("summary counts are correct", () => {
  const manifest = getFinanceManifest();

  assert.equal(manifest.summary.entityCount, 16);
  assert.equal(manifest.summary.registryCount, 4);
  assert.equal(manifest.summary.relationshipCount, 17);
  assert.equal(manifest.summary.validationCount, 6);
  assert.equal(manifest.summary.publicApiCount, 33);
  assert.equal(manifest.summary.dependencyCount, 4);
  assert.equal(manifest.summary.compatibilityStatus, "Compatible");
  assert.equal(manifest.summary.certificationReadiness, "Ready");
  assert.equal(manifest.summary.freezeReadiness, "Ready");
});

test("public APIs are exported", () => {
  assert.equal(typeof ExecutiveFinanceManifestFoundation.buildFinanceManifest, "function");
  assert.equal(typeof ExecutiveFinanceManifestFoundation.getFinanceManifest, "function");
  assert.equal(typeof ExecutiveFinanceManifestFoundation.getFinanceCompatibility, "function");
  assert.equal(typeof ExecutiveFinanceManifestFoundation.getFinanceDependencyMatrix, "function");
  assert.equal(typeof ExecutiveFinanceManifestFoundation.getFinanceExtensionPolicy, "function");
  assert.equal(Object.isFrozen(ExecutiveFinanceManifestFoundation), true);
});

test("manifest output is deterministic", () => {
  const first = buildFinanceManifest();
  const second = buildFinanceManifest();

  assert.deepEqual(first, second);
});

test("zero runtime side effects", () => {
  const manifest = getFinanceManifest();

  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.immutable, true);
  assert.equal(ExecutiveFinanceManifestFoundation.metadataOnly, true);
  assert.equal(ExecutiveFinanceManifestFoundation.immutable, true);
});
