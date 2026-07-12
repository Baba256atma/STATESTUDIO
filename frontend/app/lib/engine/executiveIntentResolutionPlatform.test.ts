import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveIntentResolutionFoundation } from "./executiveIntentResolutionIndex.ts";
import { ExecutiveIntentResolutionManifestPlatform } from "./executiveIntentResolutionManifestIndex.ts";
import { ExecutiveIntentResolutionModelPlatform } from "./executiveIntentResolutionModelIndex.ts";
import * as publicApi from "./executiveIntentResolutionPlatformIndex.ts";
import { ExecutiveIntentResolutionPlatform, ExecutiveIntentResolutionPlatformMetadata, ExecutiveIntentResolutionPlatformNamespace, ExecutiveIntentResolutionPlatformRegistry, getExecutiveIntentResolutionPlatform, getExecutiveIntentResolutionPlatformNamespace, getExecutiveIntentResolutionPlatformSummary } from "./executiveIntentResolutionPlatformIndex.ts";
import { ExecutiveIntentResolutionRegistryPlatform } from "./executiveIntentResolutionRegistryIndex.ts";
import { ExecutiveIntentResolutionValidationPlatform } from "./executiveIntentResolutionValidationIndex.ts";

test("platform and namespace exist and are deeply immutable", () => {
  assert.ok(ExecutiveIntentResolutionPlatform);
  assert.ok(ExecutiveIntentResolutionPlatformNamespace);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionPlatformNamespace), true);
  assert.equal(Object.values(ExecutiveIntentResolutionPlatformNamespace).every(Object.isFrozen), true);
});

test("namespace contains exactly six canonical sections", () => {
  assert.deepEqual(Object.keys(ExecutiveIntentResolutionPlatformNamespace), ["foundation", "registry", "model", "validation", "manifest", "metadata"]);
  assert.equal(ExecutiveIntentResolutionPlatformNamespace.foundation, ExecutiveIntentResolutionFoundation);
  assert.equal(ExecutiveIntentResolutionPlatformNamespace.registry, ExecutiveIntentResolutionRegistryPlatform);
  assert.equal(ExecutiveIntentResolutionPlatformNamespace.model, ExecutiveIntentResolutionModelPlatform);
  assert.equal(ExecutiveIntentResolutionPlatformNamespace.validation, ExecutiveIntentResolutionValidationPlatform);
  assert.equal(ExecutiveIntentResolutionPlatformNamespace.manifest, ExecutiveIntentResolutionManifestPlatform);
  assert.equal(ExecutiveIntentResolutionPlatformNamespace.metadata, ExecutiveIntentResolutionPlatformMetadata);
});

test("platform metadata is complete and immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionPlatformMetadata), true);
  assert.equal(ExecutiveIntentResolutionPlatformMetadata.platformIdentifier, "ENG-3:6");
  assert.equal(ExecutiveIntentResolutionPlatformMetadata.owner, "ENG-3");
  assert.equal(ExecutiveIntentResolutionPlatformMetadata.certificationState, "ReadyForCertification");
  assert.equal(ExecutiveIntentResolutionPlatformMetadata.metadataOnly, true);
});

test("platform registry publishes complete ownership and compatibility metadata", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionPlatformRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionPlatformRegistry.ownership), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionPlatformRegistry.compatibility), true);
  assert.equal(ExecutiveIntentResolutionPlatformRegistry.componentIdentifiers.length, 5);
  assert.equal(new Set(ExecutiveIntentResolutionPlatformRegistry.componentIdentifiers).size, 5);
  assert.equal(ExecutiveIntentResolutionPlatformRegistry.ownership.publicIndexOnly, true);
  assert.equal(ExecutiveIntentResolutionPlatformRegistry.releaseReadiness, "ReadyForCertification");
});

test("platform object contains canonical namespace, registry, and metadata", () => {
  assert.equal(ExecutiveIntentResolutionPlatform.namespace, ExecutiveIntentResolutionPlatformNamespace);
  assert.equal(ExecutiveIntentResolutionPlatform.registry, ExecutiveIntentResolutionPlatformRegistry);
  assert.equal(ExecutiveIntentResolutionPlatform.metadata, ExecutiveIntentResolutionPlatformMetadata);
  assert.equal(ExecutiveIntentResolutionPlatform.metadataOnly, true);
});

test("helpers return canonical immutable references and summary", () => {
  assert.equal(getExecutiveIntentResolutionPlatform(), ExecutiveIntentResolutionPlatform);
  assert.equal(getExecutiveIntentResolutionPlatformNamespace(), ExecutiveIntentResolutionPlatformNamespace);
  assert.equal(getExecutiveIntentResolutionPlatformSummary(), getExecutiveIntentResolutionPlatformSummary());
  assert.equal(getExecutiveIntentResolutionPlatformSummary().namespaceSectionCount, 6);
  assert.equal(Object.isFrozen(getExecutiveIntentResolutionPlatformSummary()), true);
});

test("public platform index exposes exactly seven approved APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveIntentResolutionPlatform", "ExecutiveIntentResolutionPlatformNamespace",
    "ExecutiveIntentResolutionPlatformRegistry", "ExecutiveIntentResolutionPlatformMetadata",
    "getExecutiveIntentResolutionPlatform", "getExecutiveIntentResolutionPlatformNamespace",
    "getExecutiveIntentResolutionPlatformSummary",
  ].sort());
});
