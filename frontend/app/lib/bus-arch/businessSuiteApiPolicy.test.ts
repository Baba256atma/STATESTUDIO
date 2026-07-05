import assert from "node:assert/strict";
import test from "node:test";

import { buildBusinessSuiteArchitectureManifest } from "./businessSuiteArchitectureIndex.ts";
import { buildBusinessSuiteBoundaryManifest } from "./businessSuiteBoundaryIndex.ts";
import { buildBusinessSuiteDependencyManifest } from "./businessSuiteDependencyIndex.ts";
import {
  BusinessSuiteApiPolicyRegistry,
  buildBusinessSuiteApiPolicyManifest,
  validateBusinessSuiteApiPolicy,
} from "./businessSuiteApiPolicyIndex.ts";
import type { BusinessSuiteApiPolicyManifest } from "./businessSuiteApiPolicyTypes.ts";

test("API registry exists", () => {
  assert.equal(BusinessSuiteApiPolicyRegistry.metadata.apiPolicyId, "BUS-ARCH-4");
  assert.equal(BusinessSuiteApiPolicyRegistry.publicApiRegistry.length, 42);
  assert.equal(Object.isFrozen(BusinessSuiteApiPolicyRegistry), true);
});

test("extension registry exists", () => {
  const manifest = buildBusinessSuiteApiPolicyManifest();

  assert.equal(manifest.extensionCatalog.length, 14);
  assert.equal(manifest.extensionCatalog.every((extension) => extension.certificationRequired), true);
});

test("compatibility registry exists", () => {
  const manifest = buildBusinessSuiteApiPolicyManifest();

  assert.equal(manifest.compatibilityPolicy.length, 3);
  assert.equal(manifest.compatibilityPolicy.every((policy) => policy.certificationRequired), true);
});

test("version registry exists", () => {
  const manifest = buildBusinessSuiteApiPolicyManifest();

  assert.equal(manifest.versionPolicy.policyId, "business-suite-semver-policy");
  assert.equal(manifest.deprecationPolicy.policyId, "business-suite-deprecation-policy");
});

test("no duplicate APIs", () => {
  const manifest = buildBusinessSuiteApiPolicyManifest();
  const apiIds = manifest.publicApiCatalog.map((api) => api.apiId);

  assert.equal(new Set(apiIds).size, apiIds.length);
});

test("every API has exactly one owner", () => {
  const manifest = buildBusinessSuiteApiPolicyManifest();

  assert.equal(manifest.publicApiCatalog.every((api) => api.owningPlatformId.length > 0), true);
});

test("every extension point has exactly one owner", () => {
  const manifest = buildBusinessSuiteApiPolicyManifest();
  const extensionIds = manifest.extensionCatalog.map((extension) => extension.extensionPointId);

  assert.equal(new Set(extensionIds).size, extensionIds.length);
  assert.equal(manifest.extensionCatalog.every((extension) => extension.owningPlatformId.length > 0), true);
});

test("consumer permissions valid", () => {
  const manifest = buildBusinessSuiteApiPolicyManifest();

  assert.equal(manifest.consumerPermissionCatalog.length, 28);
  assert.equal(manifest.consumerPermissionCatalog.every((permission) => permission.permissionScope === "certified-public-api"), true);
});

test("compatibility policy valid", () => {
  const validation = validateBusinessSuiteApiPolicy();

  assert.equal(validation.errors.includes("compatibility-policy-incomplete"), false);
  assert.equal(validation.errors.includes("compatibility-policy-invalid"), false);
});

test("version policy valid", () => {
  const validation = validateBusinessSuiteApiPolicy();

  assert.equal(validation.errors.includes("version-policy-invalid"), false);
  assert.equal(validation.errors.includes("deprecation-policy-invalid"), false);
});

test("deterministic manifest", () => {
  const first = buildBusinessSuiteApiPolicyManifest();
  const second = buildBusinessSuiteApiPolicyManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("immutable metadata", () => {
  const manifest = buildBusinessSuiteApiPolicyManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.publicApiCatalog.every((api) => api.metadataOnly && api.immutable), true);
});

test("BUS-ARCH-1 compatibility", () => {
  assert.equal(buildBusinessSuiteArchitectureManifest().metadata.architectureId, "BUS-ARCH");
});

test("BUS-ARCH-2 compatibility", () => {
  assert.equal(buildBusinessSuiteBoundaryManifest().platformBoundaryCatalog.length, 14);
});

test("BUS-ARCH-3 compatibility", () => {
  assert.equal(buildBusinessSuiteDependencyManifest().dependencyCatalog.length, 28);
});

test("public API exports valid", () => {
  assert.equal(typeof buildBusinessSuiteApiPolicyManifest, "function");
  assert.equal(typeof validateBusinessSuiteApiPolicy, "function");
  assert.equal(Boolean(BusinessSuiteApiPolicyRegistry), true);
});

test("validation succeeds", () => {
  const validation = validateBusinessSuiteApiPolicy();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("duplicate APIs are rejected", () => {
  const base = buildBusinessSuiteApiPolicyManifest();
  const manifest: BusinessSuiteApiPolicyManifest = Object.freeze({
    ...base,
    publicApiCatalog: Object.freeze([base.publicApiCatalog[0], base.publicApiCatalog[0], ...base.publicApiCatalog.slice(1)]),
  });
  const validation = validateBusinessSuiteApiPolicy(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`duplicate-public-api:${base.publicApiCatalog[0].apiId}`), true);
});

test("unknown extension API is rejected", () => {
  const base = buildBusinessSuiteApiPolicyManifest();
  const extension = base.extensionCatalog[0];
  const manifest: BusinessSuiteApiPolicyManifest = Object.freeze({
    ...base,
    extensionCatalog: Object.freeze([
      Object.freeze({
        ...extension,
        supportedApiId: "unknown-suite:unknown.api",
      }),
      ...base.extensionCatalog.slice(1),
    ]),
  });
  const validation = validateBusinessSuiteApiPolicy(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`unknown-extension-api:${extension.extensionPointId}`), true);
});
