import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_BRAIN_CONTRACTS,
  EXECUTIVE_BRAIN_ENGINE_REGISTRY,
  EXECUTIVE_BRAIN_PHASE_REGISTRY,
  ExecutiveBrainFoundation,
  buildExecutiveBrainManifest,
  getExecutiveBrainCapabilities,
  getExecutiveBrainConfiguration,
  getExecutiveBrainPlatform,
  getExecutiveBrainRegistry,
  validateExecutiveBrainFoundation,
} from "./executiveBrainFoundation.ts";

test("publishes platform metadata", () => {
  const platform = getExecutiveBrainPlatform();

  assert.equal(platform.platformId, "nexora-executive-brain-platform");
  assert.equal(platform.platformName, "Nexora Executive Brain Platform");
  assert.equal(platform.version, "LAY-1");
  assert.equal(platform.releaseStage, "foundation");
  assert.equal(platform.layerIdentity, "LAY");
  assert.equal(Object.isFrozen(platform), true);
});

test("publishes capability registry", () => {
  const capabilities = getExecutiveBrainCapabilities();

  assert.equal(capabilities.length, 10);
  assert.deepEqual(capabilities.map((capability) => capability.id), [
    "reasoning",
    "judgment",
    "planning",
    "coaching",
    "thoughtPartner",
    "visualReasoning",
    "communication",
    "negotiation",
    "creativity",
    "learning",
  ]);
  assert.equal(capabilities.every((capability) => capability.futureOwnerPhase.startsWith("LAY-")), true);
});

test("publishes phase registry", () => {
  assert.equal(EXECUTIVE_BRAIN_PHASE_REGISTRY.length, 12);
  assert.deepEqual(EXECUTIVE_BRAIN_PHASE_REGISTRY.map((phase) => phase.order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(EXECUTIVE_BRAIN_PHASE_REGISTRY[0].status, "current");
  assert.equal(EXECUTIVE_BRAIN_PHASE_REGISTRY.slice(1).every((phase) => phase.status === "future"), true);
});

test("builds immutable manifest", () => {
  const manifest = buildExecutiveBrainManifest();

  assert.equal(manifest.platform.version, "LAY-1");
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.runtimeIntelligence, false);
  assert.equal(manifest.readyFor, "LAY-2 Executive Reasoning Engine");
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.registry), true);
});

test("publishes default configuration", () => {
  const configuration = getExecutiveBrainConfiguration();

  assert.equal(configuration.enabled, true);
  assert.equal(configuration.strictMode, true);
  assert.equal(configuration.validation, true);
  assert.equal(configuration.diagnostics, false);
  assert.equal(configuration.debug, false);
  assert.equal(configuration.runtimeIntelligence, false);
});

test("validates foundation integrity", () => {
  const validation = validateExecutiveBrainFoundation();

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
  assert.equal(Object.isFrozen(validation), true);
});

test("exports public API surface", () => {
  assert.equal(typeof ExecutiveBrainFoundation.getExecutiveBrainPlatform, "function");
  assert.equal(typeof ExecutiveBrainFoundation.getExecutiveBrainCapabilities, "function");
  assert.equal(typeof ExecutiveBrainFoundation.getExecutiveBrainConfiguration, "function");
  assert.equal(typeof ExecutiveBrainFoundation.buildExecutiveBrainManifest, "function");
  assert.equal(typeof ExecutiveBrainFoundation.validateExecutiveBrainFoundation, "function");
  assert.equal(Object.isFrozen(ExecutiveBrainFoundation), true);
});

test("keeps registry ids unique", () => {
  const registry = getExecutiveBrainRegistry();
  const phaseIds = registry.phases.map((phase) => phase.id);
  const capabilityIds = registry.capabilities.map((capability) => capability.id);
  const engineIds = registry.engines.map((engine) => engine.id);

  assert.equal(new Set(phaseIds).size, phaseIds.length);
  assert.equal(new Set(capabilityIds).size, capabilityIds.length);
  assert.equal(new Set(engineIds).size, engineIds.length);
});

test("keeps registries immutable", () => {
  const registry = getExecutiveBrainRegistry();

  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.phases), true);
  assert.equal(Object.isFrozen(registry.capabilities), true);
  assert.equal(Object.isFrozen(registry.engines), true);
  assert.equal(Object.isFrozen(registry.extensions), true);
});

test("does not implement runtime executive intelligence", () => {
  assert.equal(EXECUTIVE_BRAIN_ENGINE_REGISTRY.every((engine) => engine.implemented === false), true);
  assert.equal(EXECUTIVE_BRAIN_CONTRACTS.every((contract) => contract.runtimeIntelligence === false), true);
  assert.equal(buildExecutiveBrainManifest().runtimeIntelligence, false);
});
