import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveAssistantDashboardConnectionApi,
  ExecutiveAssistantDashboardConnectionPlatform,
  buildExecutiveAssistantDashboardManifest,
  getExecutiveAssistantDashboardCompatibilityMatrix,
  getExecutiveAssistantDashboardRegistry,
  validateExecutiveAssistantDashboardConnectionApi,
  validateExecutiveAssistantDashboardManifest,
  validateExecutiveAssistantDashboardRegistry,
} from "./executiveAssistantDashboardConnectionIndex.ts";
import type { ExecutiveAssistantDashboardCategory, ExecutiveAssistantDashboardRegistry } from "./executiveAssistantDashboardConnectionTypes.ts";

test("publishes immutable assistant dashboard contracts", () => {
  assert.equal(ExecutiveAssistantDashboardConnectionApi.apiId, "executive-assistant-dashboard-connection-api");
  assert.equal(ExecutiveAssistantDashboardConnectionApi.requests.length, 2);
  assert.equal(ExecutiveAssistantDashboardConnectionApi.references.length, 10);
  assert.equal(ExecutiveAssistantDashboardConnectionApi.metadata.metadataOnly, true);
  assert.equal(ExecutiveAssistantDashboardConnectionApi.policy.dashboardRuntimeAllowed, false);
  assert.equal(Object.isFrozen(ExecutiveAssistantDashboardConnectionApi), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveAssistantDashboardRegistry();

  assert.equal(registry.providers.length, 12);
  assert.equal(registry.consumers.length, 3);
  assert.equal(registry.categories.length, 12);
  assert.equal(registry.apiTypes.length, 12);
  assert.equal(registry.publicApis.length, 8);
  assert.equal(validateExecutiveAssistantDashboardRegistry(registry).valid, true);
});

test("generates manifest", () => {
  const manifest = buildExecutiveAssistantDashboardManifest();

  assert.equal(manifest.platformId, "executive-assistant-dashboard-connection-api");
  assert.equal(manifest.platformVersion, "LAY-CONN-9");
  assert.equal(manifest.dependencies.some((entry) => entry.dependencyId === "LAY-CONN-8"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const validation = validateExecutiveAssistantDashboardManifest(buildExecutiveAssistantDashboardManifest());

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility including future providers", () => {
  const compatibility = getExecutiveAssistantDashboardCompatibilityMatrix();

  assert.equal(compatibility.length, 12);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-8" && entry.mode === "certified"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-JUDGE" && entry.required), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "ASS" && entry.mode === "future-compatible"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "DASHBOARD" && entry.mode === "future-compatible"), true);
});

test("validates dependency and boundary rules", () => {
  assert.equal(validateExecutiveAssistantDashboardConnectionApi().valid, true);

  const invalid = validateExecutiveAssistantDashboardConnectionApi(Object.freeze({
    ...ExecutiveAssistantDashboardConnectionApi,
    policy: Object.freeze({ ...ExecutiveAssistantDashboardConnectionApi.policy, dashboardRuntimeAllowed: true }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid category and type", () => {
  const invalid = validateExecutiveAssistantDashboardConnectionApi(Object.freeze({
    ...ExecutiveAssistantDashboardConnectionApi,
    identity: Object.freeze({
      connectionId: "bad-connection",
      name: "Bad Connection",
      category: "Invalid" as ExecutiveAssistantDashboardCategory,
      apiType: "invalid-api-type",
    }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-api-category:Invalid"), true);
  assert.equal(invalid.errors.includes("invalid-api-type:invalid-api-type"), true);
});

test("detects missing exchange metadata", () => {
  const invalid = validateExecutiveAssistantDashboardConnectionApi(Object.freeze({
    ...ExecutiveAssistantDashboardConnectionApi,
    requests: Object.freeze([]),
    responses: Object.freeze([]),
    references: Object.freeze([]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("missing-requests"), true);
  assert.equal(invalid.errors.includes("missing-responses"), true);
  assert.equal(invalid.errors.includes("missing-references"), true);
});

test("detects duplicate registrations", () => {
  const registry = getExecutiveAssistantDashboardRegistry();
  const firstProvider = registry.providers[0];

  assert.ok(firstProvider);

  const duplicateRegistry: ExecutiveAssistantDashboardRegistry = Object.freeze({
    ...registry,
    apiTypes: Object.freeze(["risk-dashboard-api", "risk-dashboard-api"] as const),
    providers: Object.freeze([firstProvider, firstProvider]),
  });
  const validation = validateExecutiveAssistantDashboardRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-api-type:risk-dashboard-api"), true);
  assert.equal(validation.errors.includes("duplicate-provider:lay-connection-provider"), true);
});

test("detects invalid dependencies", () => {
  const registry = getExecutiveAssistantDashboardRegistry();
  const invalidRegistry: ExecutiveAssistantDashboardRegistry = Object.freeze({
    ...registry,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "bad-required-future", required: true, mode: "future-compatible" }),
    ]),
  });
  const validation = validateExecutiveAssistantDashboardRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-dependencies"), true);
});

test("exports public assistant dashboard APIs", () => {
  assert.equal(typeof ExecutiveAssistantDashboardConnectionPlatform.buildExecutiveAssistantDashboardManifest, "function");
  assert.equal(typeof ExecutiveAssistantDashboardConnectionPlatform.validateExecutiveAssistantDashboardConnectionApi, "function");
  assert.equal(typeof ExecutiveAssistantDashboardConnectionPlatform.validateExecutiveAssistantDashboardManifest, "function");
  assert.equal(typeof ExecutiveAssistantDashboardConnectionPlatform.validateExecutiveAssistantDashboardRegistry, "function");
  assert.equal(typeof ExecutiveAssistantDashboardConnectionPlatform.getExecutiveAssistantDashboardRegistry, "function");
  assert.equal(typeof ExecutiveAssistantDashboardConnectionPlatform.getExecutiveAssistantDashboardCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveAssistantDashboardManifest();
  const second = buildExecutiveAssistantDashboardManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.supportedApiTypes, second.supportedApiTypes);
});
