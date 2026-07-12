import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveOperationsSuiteFoundation, ExecutiveOperationsSuiteFoundationManifest, ExecutiveOperationsSuiteFoundationNamespace, ExecutiveOperationsSuiteFoundationStatus, getExecutiveOperationsSuiteFoundation, getExecutiveOperationsSuiteManifest, getExecutiveOperationsSuiteMetadata } from "./executiveOperationsSuiteFoundationIndex.ts";
import * as publicApi from "./executiveOperationsSuiteFoundationIndex.ts";

const platformSections = ["execution", "task", "workflow", "project", "resource", "scheduling", "monitoring", "automation", "dashboard"] as const;

test("foundation contains exactly nine platforms and metadata", () => {
  assert.deepEqual(Object.keys(ExecutiveOperationsSuiteFoundation), [...platformSections, "metadata"]);
  assert.equal(ExecutiveOperationsSuiteFoundation.metadata.platformCount, 9);
  assert.equal(platformSections.every((section) => Object.isFrozen(ExecutiveOperationsSuiteFoundation[section])), true);
});

test("exports and helper results are immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteFoundationManifest), true);
  assert.equal(getExecutiveOperationsSuiteFoundation(), ExecutiveOperationsSuiteFoundation);
  assert.equal(getExecutiveOperationsSuiteManifest(), ExecutiveOperationsSuiteFoundationManifest);
  assert.equal(Object.isFrozen(getExecutiveOperationsSuiteMetadata()), true);
});

test("metadata identity and namespace are consistent", () => {
  const metadata = getExecutiveOperationsSuiteMetadata();
  assert.equal(metadata.id, "OPS-10:1");
  assert.equal(metadata.version, "1.0.0");
  assert.equal(metadata.namespace, ExecutiveOperationsSuiteFoundationNamespace);
  assert.equal(metadata.status, ExecutiveOperationsSuiteFoundationStatus);
  assert.equal(metadata.status.releaseStatus, "Draft");
});

test("manifest has nine unique platform registrations", () => {
  const registrations = ExecutiveOperationsSuiteFoundationManifest.consumedPlatforms;
  assert.equal(registrations.length, 9);
  assert.equal(new Set(registrations.map((entry) => entry.phaseId)).size, 9);
  assert.equal(new Set(registrations.map((entry) => entry.section)).size, 9);
  assert.equal(new Set(registrations.map((entry) => entry.publicFoundationExport)).size, 9);
});

test("manifest dependency order is canonical", () => {
  assert.deepEqual(ExecutiveOperationsSuiteFoundationManifest.dependencyOrder, ["OPS-1", "OPS-2", "OPS-3", "OPS-4", "OPS-5", "OPS-6", "OPS-7", "OPS-8", "OPS-9"]);
  assert.deepEqual(ExecutiveOperationsSuiteFoundationManifest.consumedPlatforms.map((entry) => entry.dependencyOrder), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test("manifest preserves architectural boundaries and public API policy", () => {
  assert.equal(ExecutiveOperationsSuiteFoundationManifest.metadataOnly, true);
  assert.equal(ExecutiveOperationsSuiteFoundationManifest.publicApiPolicy.publicIndicesOnly, true);
  assert.equal(ExecutiveOperationsSuiteFoundationManifest.publicApiPolicy.internalImportsAllowed, false);
  assert.equal(ExecutiveOperationsSuiteFoundationManifest.foundationNamespace, ExecutiveOperationsSuiteFoundationNamespace);
});

test("manifest and helpers are deterministic", () => {
  assert.deepEqual(getExecutiveOperationsSuiteFoundation(), getExecutiveOperationsSuiteFoundation());
  assert.deepEqual(getExecutiveOperationsSuiteMetadata(), getExecutiveOperationsSuiteMetadata());
  assert.deepEqual(getExecutiveOperationsSuiteManifest(), getExecutiveOperationsSuiteManifest());
});

test("public index exposes only stable OPS-10:1 APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveOperationsSuiteFoundation", "ExecutiveOperationsSuiteFoundationDescription",
    "ExecutiveOperationsSuiteFoundationId", "ExecutiveOperationsSuiteFoundationManifest",
    "ExecutiveOperationsSuiteFoundationName", "ExecutiveOperationsSuiteFoundationNamespace",
    "ExecutiveOperationsSuiteFoundationStatus", "ExecutiveOperationsSuiteFoundationVersion",
    "getExecutiveOperationsSuiteFoundation", "getExecutiveOperationsSuiteManifest", "getExecutiveOperationsSuiteMetadata",
  ].sort());
});
