import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveTypeCRuntimeIntegrationPlatform,
  ExecutiveTypeCRuntimeIntegrationPlatformFacade,
  buildExecutiveTypeCRuntimeManifest,
  getExecutiveTypeCRuntimeCompatibilityMatrix,
  getExecutiveTypeCRuntimeRegistry,
  validateExecutiveTypeCRuntimeIntegrationPlatform,
  validateExecutiveTypeCRuntimeManifest,
  validateExecutiveTypeCRuntimeRegistry,
} from "./executiveTypeCRuntimeIntegrationIndex.ts";
import type { ExecutiveTypeCRuntimeParticipantId, ExecutiveTypeCRuntimeRegistry } from "./executiveTypeCRuntimeIntegrationTypes.ts";

test("publishes immutable type c runtime integration contracts", () => {
  assert.equal(ExecutiveTypeCRuntimeIntegrationPlatform.platformId, "executive-type-c-runtime-integration-platform");
  assert.equal(ExecutiveTypeCRuntimeIntegrationPlatform.participants.length, 18);
  assert.equal(ExecutiveTypeCRuntimeIntegrationPlatform.capabilities.length, 3);
  assert.equal(ExecutiveTypeCRuntimeIntegrationPlatform.metadata.metadataOnly, true);
  assert.equal(ExecutiveTypeCRuntimeIntegrationPlatform.policy.runtimeBehaviorAllowed, false);
  assert.equal(Object.isFrozen(ExecutiveTypeCRuntimeIntegrationPlatform), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveTypeCRuntimeRegistry();

  assert.equal(registry.participants.length, 18);
  assert.equal(registry.providers.length, 10);
  assert.equal(registry.consumers.length, 2);
  assert.equal(registry.capabilities.length, 4);
  assert.equal(registry.publicApis.length, 7);
  assert.equal(validateExecutiveTypeCRuntimeRegistry(registry).valid, true);
});

test("generates manifest", () => {
  const manifest = buildExecutiveTypeCRuntimeManifest();

  assert.equal(manifest.platformId, "executive-type-c-runtime-integration-platform");
  assert.equal(manifest.platformVersion, "LAY-CONN-11");
  assert.equal(manifest.dependencies.some((entry) => entry.dependencyId === "LAY-CONN-10"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const validation = validateExecutiveTypeCRuntimeManifest(buildExecutiveTypeCRuntimeManifest());

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility including metadata participants", () => {
  const compatibility = getExecutiveTypeCRuntimeCompatibilityMatrix();

  assert.equal(compatibility.length, 17);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-10" && entry.mode === "certified"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "CORE" && entry.mode === "metadata-only"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "RUNTIME" && entry.mode === "metadata-only"), true);
});

test("validates dependency and boundary rules", () => {
  assert.equal(validateExecutiveTypeCRuntimeIntegrationPlatform().valid, true);

  const invalid = validateExecutiveTypeCRuntimeIntegrationPlatform(Object.freeze({
    ...ExecutiveTypeCRuntimeIntegrationPlatform,
    policy: Object.freeze({ ...ExecutiveTypeCRuntimeIntegrationPlatform.policy, runtimeBehaviorAllowed: true }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid participant and capability", () => {
  const invalid = validateExecutiveTypeCRuntimeIntegrationPlatform(Object.freeze({
    ...ExecutiveTypeCRuntimeIntegrationPlatform,
    participants: Object.freeze([
      Object.freeze({
        ...ExecutiveTypeCRuntimeIntegrationPlatform.participants[0],
        participantId: "BAD" as ExecutiveTypeCRuntimeParticipantId,
      }),
    ]),
    capabilities: Object.freeze([
      Object.freeze({ capabilityId: "bad-capability", name: "Bad Capability", participantId: "BAD" as ExecutiveTypeCRuntimeParticipantId, metadataOnly: true }),
    ]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-participant:BAD"), true);
  assert.equal(invalid.errors.includes("invalid-capability-participant:bad-capability"), true);
});

test("detects missing registry metadata", () => {
  const registry = getExecutiveTypeCRuntimeRegistry();
  const invalidRegistry: ExecutiveTypeCRuntimeRegistry = Object.freeze({
    ...registry,
    participants: Object.freeze([]),
    providers: Object.freeze([]),
    consumers: Object.freeze([]),
    capabilities: Object.freeze([]),
  });
  const validation = validateExecutiveTypeCRuntimeRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("missing-participants"), true);
  assert.equal(validation.errors.includes("missing-providers"), true);
  assert.equal(validation.errors.includes("missing-consumers"), true);
  assert.equal(validation.errors.includes("missing-capabilities"), true);
});

test("detects duplicate registrations", () => {
  const registry = getExecutiveTypeCRuntimeRegistry();
  const firstProvider = registry.providers[0];
  const firstParticipant = registry.participants[0];

  assert.ok(firstProvider);
  assert.ok(firstParticipant);

  const duplicateRegistry: ExecutiveTypeCRuntimeRegistry = Object.freeze({
    ...registry,
    participants: Object.freeze([firstParticipant, firstParticipant]),
    providers: Object.freeze([firstProvider, firstProvider]),
  });
  const validation = validateExecutiveTypeCRuntimeRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`duplicate-participant:${firstParticipant.participantId}`), true);
  assert.equal(validation.errors.includes("duplicate-provider:lay-conn-1-provider"), true);
});

test("detects invalid dependencies", () => {
  const registry = getExecutiveTypeCRuntimeRegistry();
  const invalidRegistry: ExecutiveTypeCRuntimeRegistry = Object.freeze({
    ...registry,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "bad-required-metadata", required: true, mode: "metadata-only" }),
    ]),
  });
  const validation = validateExecutiveTypeCRuntimeRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-dependencies"), true);
});

test("exports public type c runtime APIs", () => {
  assert.equal(typeof ExecutiveTypeCRuntimeIntegrationPlatformFacade.buildExecutiveTypeCRuntimeManifest, "function");
  assert.equal(typeof ExecutiveTypeCRuntimeIntegrationPlatformFacade.validateExecutiveTypeCRuntimeIntegrationPlatform, "function");
  assert.equal(typeof ExecutiveTypeCRuntimeIntegrationPlatformFacade.validateExecutiveTypeCRuntimeManifest, "function");
  assert.equal(typeof ExecutiveTypeCRuntimeIntegrationPlatformFacade.validateExecutiveTypeCRuntimeRegistry, "function");
  assert.equal(typeof ExecutiveTypeCRuntimeIntegrationPlatformFacade.getExecutiveTypeCRuntimeRegistry, "function");
  assert.equal(typeof ExecutiveTypeCRuntimeIntegrationPlatformFacade.getExecutiveTypeCRuntimeCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveTypeCRuntimeManifest();
  const second = buildExecutiveTypeCRuntimeManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.supportedParticipants, second.supportedParticipants);
});
