import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveLayerConnectionContractPlatform,
  ExecutiveLayerConnectionContracts,
  buildExecutiveConnectionManifest,
  getExecutiveConnectionCompatibilityMatrix,
  getExecutiveConnectionRegistry,
  listExecutiveConnectionCapabilities,
  listExecutiveConnectionCategories,
  listExecutiveConnectionDirections,
  validateExecutiveConnectionManifest,
  validateExecutiveConnectionRegistry,
  validateExecutiveLayerConnection,
} from "./executiveLayerConnectionIndex.ts";
import type { ExecutiveConnectionRegistry } from "./executiveLayerConnectionTypes.ts";

test("preserves contract integrity for required connection domains", () => {
  const domains = ExecutiveLayerConnectionContracts.map((contract) => contract.identity.domain);

  assert.equal(ExecutiveLayerConnectionContracts.length, 15);
  assert.equal(domains.includes("context"), true);
  assert.equal(domains.includes("signal"), true);
  assert.equal(domains.includes("decision"), true);
  assert.equal(domains.includes("recommendation"), true);
  assert.equal(domains.includes("runtime"), true);
  assert.equal(ExecutiveLayerConnectionContracts.every((contract) => contract.payload.metadataOnly), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveConnectionRegistry();

  assert.equal(registry.categories.length, 14);
  assert.equal(registry.directions.length, 6);
  assert.equal(registry.contracts.length, 15);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(validateExecutiveConnectionRegistry(registry).valid, true);
});

test("generates deterministic manifest", () => {
  const first = buildExecutiveConnectionManifest();
  const second = buildExecutiveConnectionManifest();

  assert.equal(first.platformId, "nexora-executive-layer-connection-contracts");
  assert.equal(first.platformVersion, "LAY-CONN-1");
  assert.equal(first.registryFingerprint, second.registryFingerprint);
  assert.equal(Object.isFrozen(first), true);
});

test("validates manifest", () => {
  const manifest = buildExecutiveConnectionManifest();
  const validation = validateExecutiveConnectionManifest(manifest);

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("publishes compatibility matrix", () => {
  const compatibility = getExecutiveConnectionCompatibilityMatrix();

  assert.equal(compatibility.length, 14);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.layerId === "LAY"), true);
  assert.equal(compatibility.some((entry) => entry.layerId === "Runtime" && entry.mode === "future"), true);
});

test("validates providers and consumers", () => {
  const registry = getExecutiveConnectionRegistry();
  const contract = registry.contracts[0];

  assert.ok(contract);
  assert.equal(validateExecutiveLayerConnection(contract, registry).valid, true);

  const invalidContract = Object.freeze({ ...contract, providerId: "missing-provider" });
  const invalid = validateExecutiveLayerConnection(invalidContract, registry);

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-provider:missing-provider"), true);
});

test("validates dependency integrity", () => {
  const registry = getExecutiveConnectionRegistry();
  const contract = registry.contracts[0];

  assert.ok(contract);

  const invalidContract = Object.freeze({ ...contract, dependencies: Object.freeze(["missing-dependency"] as const) });
  const invalid = validateExecutiveLayerConnection(invalidContract, registry);

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("missing-dependency:missing-dependency"), true);
});

test("detects boundary violations", () => {
  const registry = getExecutiveConnectionRegistry();
  const contract = registry.contracts[0];

  assert.ok(contract);

  const invalidContract = Object.freeze({
    ...contract,
    boundary: Object.freeze({ ...contract.boundary, allowsRuntime: true }),
  });
  const invalid = validateExecutiveLayerConnection(invalidContract, registry);

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects duplicate connection identifiers", () => {
  const registry = getExecutiveConnectionRegistry();
  const duplicateRegistry: ExecutiveConnectionRegistry = Object.freeze({
    ...registry,
    contracts: Object.freeze([registry.contracts[0], registry.contracts[0], ...registry.contracts.slice(1)]),
  });
  const validation = validateExecutiveConnectionRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-connection-id:executive-context"), true);
});

test("publishes public API exports", () => {
  assert.equal(typeof ExecutiveLayerConnectionContractPlatform.buildExecutiveConnectionManifest, "function");
  assert.equal(typeof ExecutiveLayerConnectionContractPlatform.validateExecutiveConnectionManifest, "function");
  assert.equal(typeof ExecutiveLayerConnectionContractPlatform.validateExecutiveLayerConnection, "function");
  assert.equal(typeof ExecutiveLayerConnectionContractPlatform.getExecutiveConnectionRegistry, "function");
  assert.equal(typeof listExecutiveConnectionCategories, "function");
  assert.equal(typeof listExecutiveConnectionCapabilities, "function");
  assert.equal(typeof listExecutiveConnectionDirections, "function");
});

test("preserves immutable architecture", () => {
  const registry = getExecutiveConnectionRegistry();
  const manifest = buildExecutiveConnectionManifest();

  assert.equal(Object.isFrozen(registry.contracts), true);
  assert.equal(Object.isFrozen(registry.contracts[0]), true);
  assert.equal(Object.isFrozen(manifest.registeredProviders), true);
  assert.equal(registry.extensionPolicy.runtimeBehaviorAllowed, false);
  assert.equal(registry.contracts.every((contract) => contract.metadata.immutable), true);
});

test("preserves deterministic category and direction APIs", () => {
  assert.deepEqual(listExecutiveConnectionDirections(), ["Inbound", "Outbound", "Bidirectional", "Broadcast", "Internal", "External"]);
  assert.equal(listExecutiveConnectionCategories().includes("Judgment"), true);
  assert.equal(listExecutiveConnectionCapabilities().some((capability) => capability.capabilityId === "blind-spot"), true);
});
