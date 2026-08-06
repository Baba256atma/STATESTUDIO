import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  assertDirectorRuntimeAdapterInvariants,
  calculateDirectorRuntimeHealth,
  compareDirectorRuntimeSnapshots,
  createDirectorRuntimeAdapterContext,
  createDirectorRuntimeRequest,
  createDirectorRuntimeResponse,
  deserializeDirectorRuntimeContext,
  deserializeDirectorRuntimeRequest,
  deserializeDirectorRuntimeResponse,
  deserializeDirectorRuntimeSnapshot,
  directorRuntimeAdapterFoundationIdentity,
  directorRuntimeAdapterFoundationSchemaVersion,
  directorRuntimeAdapterFoundationUpstream,
  directorRuntimeAdapterFoundationVersion,
  negotiateRuntimeCapabilities,
  planDirectorRuntimeOperations,
  projectDirectorRuntime,
  serializeDirectorRuntimeContext,
  serializeDirectorRuntimeRequest,
  serializeDirectorRuntimeResponse,
  serializeDirectorRuntimeSnapshot,
  transitionDirectorRuntimeAdapterState,
  validateDirectorRuntimeAdapter,
  validateRuntimeRequest,
  validateRuntimeResponse,
  type NexoraDirectorRuntimeAdapterContext,
  type NexoraDirectorRuntimeAdapterRequest,
  type NexoraDirectorRuntimeCapabilities,
} from "./nexoraObjectDirectorRuntimeAdapterFoundation.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, "nexoraObjectDirectorRuntimeAdapterFoundation.ts"), "utf8");

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((item) => deeplyFrozen(item, seen));
}

const allCapabilities: NexoraDirectorRuntimeCapabilities = {
  cameraIntents: true, focus: true, interaction: true, animationHints: true,
  attention: true, labels: true, indicators: true, relationships: true,
  clustering: true, timelineReplay: true, operationOverlays: true,
  themeSwitching: true, reducedMotion: true, diagnostics: true,
};

function context(overrides: Partial<NexoraDirectorRuntimeAdapterContext> = {}) {
  return createDirectorRuntimeAdapterContext({
    runtimeId: "runtime-1", adapterVersion: "1.0.0", engineVersion: "7.2.0",
    runtimeState: "Ready", capabilities: allCapabilities,
    compatibility: {
      compatible: true, adapterVersion: "1.0.0", engineVersion: "7.2.0",
      schemaVersion: directorRuntimeAdapterFoundationSchemaVersion, warnings: [],
    },
    timestamp: "2026-08-05T00:00:00.000Z", diagnosticsEnabled: true,
    reducedMotion: false, metadata: { region: "test" }, ...overrides,
  });
}

function request(runtimeContext = context()): NexoraDirectorRuntimeAdapterRequest {
  return createDirectorRuntimeRequest({
    requestId: "request-1", mode: "Atomic", runtimeContext,
    synchronizationPlan: {
      requestId: "sync-1", accepted: true,
      projectedState: { revision: 11 },
      commands: [
        { commandId: "s1", type: "CreateSceneObject", order: 0, objectId: "a", sceneObjectId: "scene:a", revision: 11, payload: { label: "A" } },
        { commandId: "s2", type: "UpdateRelationships", order: 1, objectId: "a", sceneObjectId: "scene:a", payload: { related: ["b"] } },
      ],
    },
    routingPlans: [{ planId: "route-1", accepted: true, priority: 5, semanticAction: "FocusObject", interaction: { objectId: "a" } }],
    cameraFocusPlan: {
      requestId: "focus-1", accepted: true,
      commands: [{ commandId: "f1", type: "SetCameraIntent", order: 0, objectId: "a", payload: { intent: "Inspection" } }],
    },
  });
}

describe("NOL-4:1 Director Runtime Adapter Foundation", () => {
  it("1. exposes exact identity and versions", () => {
    assert.equal(directorRuntimeAdapterFoundationIdentity, "NOL-4:1/NexoraObjectDirectorRuntimeAdapterFoundation");
    assert.equal(directorRuntimeAdapterFoundationVersion, "1.0.0");
    assert.equal(directorRuntimeAdapterFoundationSchemaVersion, "1.0.0");
    assert.equal(directorRuntimeAdapterFoundationUpstream, "NOL-3:9/NexoraObjectDirectorIntegrationPublicIndex");
  });

  it("2. imports only the NOL-3:9 public index", () => {
    const imports = [...source.matchAll(/^import[\s\S]*?from\s+"([^"]+)";/gm)].map((match) => match[1]);
    assert.deepEqual(imports, ["../nexoraObjectDirectorIntegrationPublicIndex.ts"]);
  });

  it("3-4. enforces the runtime lifecycle", () => {
    assert.equal(transitionDirectorRuntimeAdapterState("Created", "Initializing"), "Initializing");
    assert.equal(transitionDirectorRuntimeAdapterState("Initializing", "Ready"), "Ready");
    assert.equal(transitionDirectorRuntimeAdapterState("Ready", "Busy"), "Busy");
    assert.equal(transitionDirectorRuntimeAdapterState("Busy", "Ready"), "Ready");
    assert.equal(transitionDirectorRuntimeAdapterState("Ready", "Paused"), "Paused");
    assert.equal(transitionDirectorRuntimeAdapterState("Paused", "Ready"), "Ready");
    assert.equal(transitionDirectorRuntimeAdapterState("Ready", "Stopped"), "Stopped");
    assert.equal(transitionDirectorRuntimeAdapterState("Stopped", "Failed"), "Failed");
    assert.throws(() => transitionDirectorRuntimeAdapterState("Created", "Ready"), /Illegal/);
    assert.throws(() => transitionDirectorRuntimeAdapterState("Stopped", "Ready"), /Illegal/);
  });

  it("5-7. creates deeply immutable context, request, and response", () => {
    const ctx = context();
    const req = request(ctx);
    const response = createDirectorRuntimeResponse({ request: req, runtimeRevision: 11 });
    assert.equal(deeplyFrozen(ctx), true);
    assert.equal(deeplyFrozen(req), true);
    assert.equal(deeplyFrozen(response), true);
    assert.equal(validateDirectorRuntimeAdapter(ctx).valid, true);
    assert.equal(validateRuntimeRequest(req).valid, true);
    assert.equal(validateRuntimeResponse(response).valid, true);
    assert.doesNotThrow(() => assertDirectorRuntimeAdapterInvariants(response));
  });

  it("8. plans deterministically while preserving order, identity, and revision", () => {
    const req = request();
    const first = planDirectorRuntimeOperations(req);
    const second = planDirectorRuntimeOperations(req);
    assert.deepEqual(first, second);
    assert.deepEqual(first.map(({ type }) => type), ["CreateRuntimeObject", "UpdateRelationships", "UpdateInteraction", "UpdateCameraIntent"]);
    assert.deepEqual(first.map(({ order }) => order), [0, 1, 2, 3]);
    assert.equal(first[0]?.objectId, "a");
    assert.equal(first[0]?.runtimeObjectId, "scene:a");
    assert.equal(first[0]?.revision, 11);
  });

  it("9-12. negotiates deterministically and derives immutable health/diagnostics", () => {
    const ctx = context({ capabilities: { ...allCapabilities, labels: false } });
    const first = negotiateRuntimeCapabilities(["labels", "focus", "labels"], ctx);
    assert.deepEqual(first, negotiateRuntimeCapabilities(["labels", "focus", "labels"], ctx));
    assert.deepEqual(first.supportedFeatures, ["focus"]);
    assert.deepEqual(first.unsupportedFeatures, ["labels"]);
    assert.equal(first.degraded, true);
    assert.equal(first.health, "Degraded");
    assert.equal(calculateDirectorRuntimeHealth("Ready", allCapabilities, context().compatibility), "Healthy");
    assert.equal(calculateDirectorRuntimeHealth("Failed", allCapabilities, context().compatibility), "Unavailable");
    const response = createDirectorRuntimeResponse({ request: request(ctx), runtimeRevision: 1 });
    assert.equal(deeplyFrozen(ctx.capabilities), true);
    assert.equal(deeplyFrozen(response.diagnostics), true);
    assert.equal(response.diagnostics.commandCount, 4);
  });

  it("13. compares snapshots and projects runtime state", () => {
    const req = request();
    const left = createDirectorRuntimeResponse({ request: req, runtimeRevision: 1 });
    const right = createDirectorRuntimeResponse({ request: req, runtimeRevision: 2 });
    const comparison = compareDirectorRuntimeSnapshots(left.snapshot, right.snapshot);
    assert.equal(comparison.equal, false);
    assert.equal(comparison.revisionChanged, true);
    assert.equal(comparison.revisionDelta, 1);
    assert.deepEqual(projectDirectorRuntime(right), {
      runtimeId: "runtime-1", state: "Ready", health: "Healthy",
      revision: 2, commandCount: 4, capabilities: allCapabilities,
    });
  });

  it("14. round-trips every versioned serialization", () => {
    const ctx = context();
    const req = request(ctx);
    const response = createDirectorRuntimeResponse({ request: req, runtimeRevision: 4 });
    assert.deepEqual(deserializeDirectorRuntimeContext(serializeDirectorRuntimeContext(ctx)), ctx);
    assert.deepEqual(deserializeDirectorRuntimeRequest(serializeDirectorRuntimeRequest(req)), req);
    assert.deepEqual(deserializeDirectorRuntimeResponse(serializeDirectorRuntimeResponse(response)), response);
    assert.deepEqual(deserializeDirectorRuntimeSnapshot(serializeDirectorRuntimeSnapshot(response.snapshot)), response.snapshot);
  });

  it("15. rejects unsupported schemas", () => {
    const serialized = JSON.parse(serializeDirectorRuntimeContext(context())) as Record<string, unknown>;
    serialized.schemaVersion = "2.0.0";
    assert.throws(() => deserializeDirectorRuntimeContext(JSON.stringify(serialized)), /Unsupported/);
  });

  it("16-17. rejects renderer objects and has no renderer/framework imports", () => {
    class Mesh {}
    assert.throws(() => context({ metadata: { illegal: new Mesh() } }), /Renderer/);
    assert.doesNotMatch(source, /from\s+["'](?:react|three|@react-three|[^"']*webgl|[^"']*webgpu)/i);
    assert.doesNotMatch(source, /\b(?:new\s+Mesh|new\s+Scene|new\s+Camera|new\s+Material|document\.|window\.)/);
  });

  it("18. never mutates NOL-3 input plans", () => {
    const req = request();
    const before = JSON.stringify(req);
    planDirectorRuntimeOperations(req);
    assert.equal(JSON.stringify(req), before);
  });
});
