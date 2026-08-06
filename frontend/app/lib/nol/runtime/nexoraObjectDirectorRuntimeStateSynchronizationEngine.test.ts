import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  createDirectorRuntimeAdapterContext, createDirectorRuntimeRequest, createDirectorRuntimeResponse,
  directorRuntimeAdapterFoundationSchemaVersion, type NexoraDirectorRuntimeAdapterContext,
  type NexoraDirectorRuntimeAdapterRequest, type NexoraDirectorRuntimeCapabilities,
  type NexoraDirectorRuntimeCommand,
} from "./nexoraObjectDirectorRuntimeAdapterFoundation.ts";
import { createRuntimeExecutionQueue, executeRuntimeCommandBatch } from "./nexoraObjectDirectorRuntimeCommandExecutionModel.ts";
import {
  applyNexoraDirectorRuntimeStateSynchronization, assertNexoraDirectorRuntimeStateSynchronizationInvariants,
  compareNexoraDirectorRuntimeStateSnapshots, createNexoraDirectorRuntimeObjectId,
  createNexoraDirectorRuntimeState, createNexoraDirectorRuntimeStateCheckpoint,
  createNexoraDirectorRuntimeStateSnapshot, deserializeNexoraDirectorRuntimeState,
  deserializeNexoraDirectorRuntimeStateCheckpoint, deserializeNexoraDirectorRuntimeStateSnapshot,
  deserializeNexoraDirectorRuntimeStateSynchronizationPlan, deserializeNexoraDirectorRuntimeStateSynchronizationRecord,
  detectNexoraDirectorRuntimeStateDrift, evaluateNexoraDirectorRuntimeStateSynchronization,
  findStaleNexoraDirectorRuntimeObjects, mapNexoraDirectorRuntimeCommandToStateOperations,
  nexoraObjectDirectorRuntimeStateSynchronizationEngineIdentity,
  nexoraObjectDirectorRuntimeStateSynchronizationEngineVersion,
  nexoraObjectDirectorRuntimeStateSynchronizationSchemaVersion,
  reconcileNexoraDirectorRuntimeExecutionReport, resolveNexoraDirectorRuntimeStateHealth,
  resolveNexoraDirectorRuntimeStateOperationOrder, restoreNexoraDirectorRuntimeStateCheckpoint,
  serializeNexoraDirectorRuntimeState, serializeNexoraDirectorRuntimeStateCheckpoint,
  serializeNexoraDirectorRuntimeStateSnapshot, serializeNexoraDirectorRuntimeStateSynchronizationPlan,
  serializeNexoraDirectorRuntimeStateSynchronizationRecord, simulateNexoraDirectorRuntimeStateSynchronizationSequence,
  synchronizeNexoraDirectorRuntimeAttentionState, synchronizeNexoraDirectorRuntimeStateBatch,
  transitionNexoraDirectorRuntimeSynchronizationState, validateNexoraDirectorRuntimeObjectState,
  validateNexoraDirectorRuntimeState, validateNexoraDirectorRuntimeStateOperation,
  validateNexoraDirectorRuntimeStateSynchronizationPlan, validateNexoraDirectorRuntimeStateSynchronizationRequest,
  validateNexoraDirectorRuntimeStateSynchronizationResult,
  type NexoraDirectorRuntimeState,
  type NexoraDirectorRuntimeStateSynchronizationDependencies,
  type NexoraDirectorRuntimeStateSynchronizationRequest,
} from "./nexoraObjectDirectorRuntimeStateSynchronizationEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, "nexoraObjectDirectorRuntimeStateSynchronizationEngine.ts"), "utf8");
function deepFreeze<T>(value: T, seen = new Set<object>()): T { if (value === null || typeof value !== "object" || seen.has(value as object)) return value; seen.add(value as object); Object.values(value as Record<string, unknown>).forEach((x) => deepFreeze(x, seen)); return Object.freeze(value); }
function isFrozen(value: unknown, seen = new Set<object>()): boolean { if (value === null || typeof value !== "object" || seen.has(value as object)) return true; if (!Object.isFrozen(value)) return false; seen.add(value as object); return Object.values(value as Record<string, unknown>).every((x) => isFrozen(x, seen)); }
const capabilities: NexoraDirectorRuntimeCapabilities = { cameraIntents: true, focus: true, interaction: true, animationHints: true, attention: true, labels: true, indicators: true, relationships: true, clustering: true, timelineReplay: true, operationOverlays: true, themeSwitching: true, reducedMotion: true, diagnostics: true };
const deps: NexoraDirectorRuntimeStateSynchronizationDependencies = deepFreeze({
  now: () => "2026-08-05T01:00:00.000Z", createRuntimeObjectId: createNexoraDirectorRuntimeObjectId,
  createOperationId: (sync, type, objectId) => `${sync}:${type}:${objectId ?? "runtime"}`,
  createEventId: () => "event-fixed", createCheckpointId: () => "checkpoint-fixed", createSnapshotId: () => "snapshot-fixed",
});
function context(overrides: Partial<NexoraDirectorRuntimeAdapterContext> = {}) {
  return createDirectorRuntimeAdapterContext({ runtimeId: "runtime-1", adapterVersion: "1.0.0", engineVersion: "1.0.0", runtimeState: "Ready", capabilities,
    compatibility: { compatible: true, adapterVersion: "1.0.0", engineVersion: "1.0.0", schemaVersion: directorRuntimeAdapterFoundationSchemaVersion, warnings: [] }, timestamp: "2026-08-05T00:00:00.000Z", diagnosticsEnabled: true, reducedMotion: false, metadata: {}, ...overrides });
}
function adapterRequest(ctx: NexoraDirectorRuntimeAdapterContext, type = "CreateSceneObject"): NexoraDirectorRuntimeAdapterRequest {
  return createDirectorRuntimeRequest({ requestId: `request-${type}`, runtimeContext: ctx, mode: "Atomic",
    synchronizationPlan: { requestId: `sync-plan-${type}`, accepted: true, commands: [{ commandId: `source-${type}`, type, order: 0, objectId: "a", sceneObjectId: "scene:a", payload: type === "UpdateSceneObject" ? { renderingLevel: "Important" } : {} }] }, routingPlans: [], cameraFocusPlan: { requestId: "focus-none", accepted: true, commands: [] } });
}
function syncRequest(previous: NexoraDirectorRuntimeState, type = "CreateSceneObject", mode: "Atomic" | "BestEffort" | "Simulation" = "Atomic", failed = false, overrides: Partial<NexoraDirectorRuntimeStateSynchronizationRequest> = {}) {
  const ctx = context(); const adapter = adapterRequest(ctx, type); const response = createDirectorRuntimeResponse({ request: adapter, runtimeRevision: previous.revision + 1 });
  const queue = createRuntimeExecutionQueue(response.plannedCommands, previous.revision);
  const report = executeRuntimeCommandBatch(queue, { executionId: `execution-${type}`, mode, outcomes: failed ? [{ commandId: response.plannedCommands[0]!.commandId, succeeded: false, error: "failed" }] : undefined });
  return deepFreeze({ synchronizationId: `state-sync-${type}-${previous.revision}`, runtimeContext: ctx, previousRuntimeState: previous, adapterRequest: adapter, adapterResponse: response, executionReport: report, executionQueue: queue, mode, expectedRuntimeRevision: previous.revision,
    context: { source: "RuntimeAdapter" as const, occurredAt: "2026-08-05T01:00:00.000Z", correlationId: "correlation", causationId: "causation" }, ...overrides });
}

describe("NOL-4:3 Director Runtime State Synchronization Engine", () => {
  it("1-4. identity, dependencies, default revision, and immutability are exact", () => {
    assert.equal(nexoraObjectDirectorRuntimeStateSynchronizationEngineIdentity, "NOL-4:3/NexoraObjectDirectorRuntimeStateSynchronizationEngine");
    assert.equal(nexoraObjectDirectorRuntimeStateSynchronizationEngineVersion, "1.0.0"); assert.equal(nexoraObjectDirectorRuntimeStateSynchronizationSchemaVersion, "1.0.0");
    const imports = [...source.matchAll(/^import[\s\S]*?from\s+"([^"]+)";/gm)].map((x) => x[1]);
    assert.deepEqual(imports, ["./nexoraObjectDirectorRuntimeAdapterFoundation.ts", "./nexoraObjectDirectorRuntimeCommandExecutionModel.ts"]);
    const state = createNexoraDirectorRuntimeState(context()); assert.equal(state.revision, 0); assert.equal(isFrozen(state), true);
    assert.equal(transitionNexoraDirectorRuntimeSynchronizationState("Idle", "Evaluating"), "Evaluating");
    assert.throws(() => transitionNexoraDirectorRuntimeSynchronizationState("Idle", "Completed"), /Illegal/);
  });
  it("5-10. identity and create/update/reuse generations are deterministic", () => {
    assert.equal(createNexoraDirectorRuntimeObjectId("r", "a"), "nexora-runtime-object:r:a");
    assert.equal(createNexoraDirectorRuntimeObjectId("r", "a"), createNexoraDirectorRuntimeObjectId("r", "a"));
    const initial = createNexoraDirectorRuntimeState(context()); const created = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(initial), deps);
    assert.equal(created.nextRuntimeState.objects[0]?.lifecycle, "Active"); assert.equal(created.nextRuntimeState.objects[0]?.generation, 1);
    const updated = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(created.nextRuntimeState, "UpdateSceneObject"), deps);
    assert.equal(updated.nextRuntimeState.objects[0]?.generation, 2); assert.equal(updated.nextRuntimeState.objects[0]?.renderingLevel, "Important");
    const reused = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(updated.nextRuntimeState, "ReuseSceneObject"), deps);
    assert.equal(reused.nextRuntimeState.objects[0]?.generation, 2);
  });
  it("11-17. hide/show/remove and failed/cancelled/rollback semantics preserve invariants", () => {
    const initial = createNexoraDirectorRuntimeState(context()); const created = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(initial), deps).nextRuntimeState;
    const hidden = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(created, "HideSceneObject"), deps).nextRuntimeState;
    assert.equal(hidden.objects[0]?.visible, false); assert.equal(hidden.objects[0]?.focused, false);
    const shown = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(hidden, "ShowSceneObject"), deps).nextRuntimeState; assert.equal(shown.objects[0]?.visible, true);
    const removed = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(shown, "RemoveSceneObject"), deps).nextRuntimeState;
    assert.equal(removed.objects[0]?.lifecycle, "Removed"); assert.equal(removed.objects[0]?.focused, false);
    const failed = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(created, "UpdateSceneObject", "BestEffort", true), deps);
    assert.equal(failed.nextRuntimeState.objects[0]?.generation, 1);
    const rollback = evaluateNexoraDirectorRuntimeStateSynchronization(syncRequest(created, "UpdateSceneObject"), deps).rollbackOperations;
    assert.equal(rollback.some((x) => x.type === "UpdateRuntimeObject"), true);
  });
  it("18-20. reconciliation, mapping, and projection are deterministic", () => {
    const req = syncRequest(createNexoraDirectorRuntimeState(context()));
    assert.deepEqual(reconcileNexoraDirectorRuntimeExecutionReport(req.adapterResponse, req.executionReport, req.executionQueue), reconcileNexoraDirectorRuntimeExecutionReport(req.adapterResponse, req.executionReport, req.executionQueue));
    const command = req.adapterResponse.plannedCommands[0]!;
    assert.deepEqual(mapNexoraDirectorRuntimeCommandToStateOperations(command, req.synchronizationId, req.previousRuntimeState.runtimeId, deps), mapNexoraDirectorRuntimeCommandToStateOperations(command, req.synchronizationId, req.previousRuntimeState.runtimeId, deps));
    assert.deepEqual(evaluateNexoraDirectorRuntimeStateSynchronization(req, deps), evaluateNexoraDirectorRuntimeStateSynchronization(req, deps));
  });
  it("21-29. revision, no-op, simulation, rejection, Atomic, and BestEffort rules hold", () => {
    const state = createNexoraDirectorRuntimeState(context());
    const created = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(state), deps); assert.equal(created.nextRuntimeState.revision, 1);
    const simulation = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(state, "CreateSceneObject", "Simulation"), deps); assert.equal(simulation.nextRuntimeState.revision, 0); assert.equal(simulation.simulated, true);
    const conflict = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(state, "CreateSceneObject", "Atomic", false, { expectedRuntimeRevision: 9 }), deps);
    assert.equal(conflict.accepted, false); assert.equal(conflict.nextRuntimeState, state); assert.equal(conflict.errors[0]?.code, "RUNTIME_STATE_SYNC_REVISION_CONFLICT");
    const atomic = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(state, "CreateSceneObject", "Atomic", true), deps); assert.equal(atomic.accepted, false); assert.equal(atomic.nextRuntimeState, state);
    const best = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(created.nextRuntimeState, "UpdateSceneObject", "BestEffort", true), deps); assert.equal(best.nextRuntimeState.health, "Healthy"); assert.equal(best.changed, false);
    assert.equal(resolveNexoraDirectorRuntimeStateHealth({ accepted: true, mode: "BestEffort", lifecycleState: "Ready", failedCount: 1, drift: [], unsupportedCapabilityCount: 0 }), "Degraded");
  });
  it("30-33. capabilities skip/reject and preserve semantic state", () => {
    const state = createNexoraDirectorRuntimeState(context()); const ctx = context({ capabilities: { ...capabilities, cameraIntents: false } });
    const base = syncRequest(state); const command: NexoraDirectorRuntimeCommand = deepFreeze({ ...base.adapterResponse.plannedCommands[0]!, type: "UpdateCameraIntent", payload: { intent: "Inspection", objectId: "a" } });
    const response = createDirectorRuntimeResponse({ request: base.adapterRequest, runtimeRevision: 1, plannedCommands: [command] });
    const queue = createRuntimeExecutionQueue([command]); const report = executeRuntimeCommandBatch(queue, { executionId: "camera", mode: "BestEffort" });
    const optional = deepFreeze({ ...base, runtimeContext: ctx, adapterRequest: createDirectorRuntimeRequest({ ...base.adapterRequest, runtimeContext: ctx }), adapterResponse: response, executionQueue: queue, executionReport: report, mode: "BestEffort" as const, context: { ...base.context, strictCapabilities: false } });
    const plan = evaluateNexoraDirectorRuntimeStateSynchronization(optional, deps); assert.equal(plan.warnings.some((x) => x.code === "RUNTIME_STATE_SYNC_CAMERA_INTENT_PRESERVED"), true);
    const strict = evaluateNexoraDirectorRuntimeStateSynchronization(deepFreeze({ ...optional, mode: "Atomic" as const, context: { ...optional.context, strictCapabilities: true } }), deps); assert.equal(strict.accepted, false);
  });
  it("34-42. operation ordering, dependencies, removal, and rollback are deterministic", () => {
    const base = { synchronizationId: "s", reversible: true, nextValue: {}, objectId: "a", runtimeObjectId: "r:a" };
    const create = deepFreeze({ ...base, operationId: "create", type: "CreateRuntimeObject" as const, order: 9, dependencies: [] });
    const update = deepFreeze({ ...base, operationId: "update", type: "UpdateRuntimeObject" as const, order: 0, dependencies: ["create"] });
    const remove = deepFreeze({ ...base, operationId: "remove", type: "RemoveRuntimeObject" as const, order: 0, dependencies: ["update"], reversible: false });
    assert.deepEqual(resolveNexoraDirectorRuntimeStateOperationOrder([remove, update, create]).map((x) => x.operationId), ["create", "update", "remove"]);
    assert.throws(() => resolveNexoraDirectorRuntimeStateOperationOrder([{ ...update, dependencies: ["missing"] }]), /Missing/);
    assert.throws(() => resolveNexoraDirectorRuntimeStateOperationOrder([{ ...create, dependencies: ["update"] }, { ...update, dependencies: ["create"] }]), /cycle/);
    assert.equal(validateNexoraDirectorRuntimeStateOperation(create).valid, true);
  });
  it("43-49. drift and stale detection are deterministic", () => {
    const state = createNexoraDirectorRuntimeState(context()); const req = syncRequest(state, "UpdateSceneObject");
    const drift = detectNexoraDirectorRuntimeStateDrift(state, req.adapterResponse); assert.equal(drift[0]?.type, "MissingRuntimeObject"); assert.deepEqual(drift, detectNexoraDirectorRuntimeStateDrift(state, req.adapterResponse));
    const created = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(state), deps).nextRuntimeState;
    assert.equal(findStaleNexoraDirectorRuntimeObjects(created, req.adapterResponse, req.executionReport).length > 0, true);
  });
  it("50-60. focus, attention, diagnostics, and health invariants hold", () => {
    const state = createNexoraDirectorRuntimeState(context()); const createdResult = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(state), deps); const created = createdResult.nextRuntimeState;
    const invalidAttention = synchronizeNexoraDirectorRuntimeAttentionState(created.attention, created.objects, deepFreeze({ operationId: "att", synchronizationId: "s", type: "UpdateAttentionState", order: 0, reversible: true, dependencies: [], nextValue: { criticalObjectIds: ["missing", "a"], warningObjectIds: ["a", "a"] } }));
    assert.deepEqual(invalidAttention.criticalObjectIds, ["a"]); assert.deepEqual(invalidAttention.warningObjectIds, ["a"]);
    assert.equal(createdResult.nextRuntimeState.diagnostics.completedCommandCount, 1); assert.equal(createdResult.nextRuntimeState.health, "Healthy");
    assert.equal(resolveNexoraDirectorRuntimeStateHealth({ accepted: false, mode: "Atomic", lifecycleState: "Ready", failedCount: 1, drift: [], unsupportedCapabilityCount: 0 }), "Unavailable");
  });
  it("61-70. checkpoints, sequences, batches, events, and records preserve semantics", () => {
    const state = createNexoraDirectorRuntimeState(context()); const request = syncRequest(state); const checkpoint = createNexoraDirectorRuntimeStateCheckpoint(state, request.executionReport, deps);
    assert.equal(checkpoint.checkpointId, "checkpoint-fixed"); assert.deepEqual(restoreNexoraDirectorRuntimeStateCheckpoint(checkpoint), state); assert.notEqual(restoreNexoraDirectorRuntimeStateCheckpoint(checkpoint), state);
    const simulation = simulateNexoraDirectorRuntimeStateSynchronizationSequence([request], false, deps); assert.equal(simulation.results.length, 1); assert.equal(state.revision, 0);
    const batch = synchronizeNexoraDirectorRuntimeStateBatch({ requests: [request], mode: "BestEffort" }, deps); assert.equal(batch.accepted, true);
    assert.throws(() => synchronizeNexoraDirectorRuntimeStateBatch({ requests: [request, request], mode: "Atomic" }, deps), /Duplicate/);
    const result = applyNexoraDirectorRuntimeStateSynchronization(request, deps); assert.equal(result.events[0]?.correlationId, "correlation"); assert.equal(result.events[0]?.causationId, "causation"); assert.equal(result.record.revisionBefore, 0); assert.equal(result.record.revisionAfter, 1);
  });
  it("71-82. snapshots and validation detect changes and corruption", () => {
    const state = createNexoraDirectorRuntimeState(context()); const result = applyNexoraDirectorRuntimeStateSynchronization(syncRequest(state), deps); const left = createNexoraDirectorRuntimeStateSnapshot(state, undefined, deps); const right = createNexoraDirectorRuntimeStateSnapshot(result.nextRuntimeState, result.record, deps);
    const cmp = compareNexoraDirectorRuntimeStateSnapshots(left, right); assert.equal(cmp.revisionChanged, true); assert.deepEqual(cmp.addedObjectIds, ["a"]);
    assert.equal(validateNexoraDirectorRuntimeState(state).valid, true); assert.equal(validateNexoraDirectorRuntimeObjectState(result.nextRuntimeState.objects[0]).valid, true);
    assert.equal(validateNexoraDirectorRuntimeStateSynchronizationRequest(syncRequest(state)).valid, true); assert.equal(validateNexoraDirectorRuntimeStateSynchronizationPlan(result.plan).valid, true); assert.equal(validateNexoraDirectorRuntimeStateSynchronizationResult(result).valid, true); assert.doesNotThrow(() => assertNexoraDirectorRuntimeStateSynchronizationInvariants(result));
    assert.equal(validateNexoraDirectorRuntimeObjectState({ ...result.nextRuntimeState.objects[0], generation: 0 }).valid, false);
  });
  it("83-90. rejects renderer objects, deeply freezes artifacts, round-trips serialization, and mutates no input", () => {
    class Mesh {} const state = createNexoraDirectorRuntimeState(context()); assert.equal(validateNexoraDirectorRuntimeObjectState({ generation: 1, metadata: new Mesh() }).valid, false);
    const request = syncRequest(state); const before = JSON.stringify(request); const result = applyNexoraDirectorRuntimeStateSynchronization(request, deps); assert.equal(JSON.stringify(request), before); assert.equal(isFrozen(result), true);
    const checkpoint = createNexoraDirectorRuntimeStateCheckpoint(state, request.executionReport, deps); const snapshot = createNexoraDirectorRuntimeStateSnapshot(result.nextRuntimeState, result.record, deps);
    assert.deepEqual(deserializeNexoraDirectorRuntimeState(serializeNexoraDirectorRuntimeState(state)), state);
    assert.deepEqual(deserializeNexoraDirectorRuntimeStateSynchronizationPlan(serializeNexoraDirectorRuntimeStateSynchronizationPlan(result.plan)), result.plan);
    assert.deepEqual(deserializeNexoraDirectorRuntimeStateSynchronizationRecord(serializeNexoraDirectorRuntimeStateSynchronizationRecord(result.record)), result.record);
    assert.deepEqual(deserializeNexoraDirectorRuntimeStateCheckpoint(serializeNexoraDirectorRuntimeStateCheckpoint(checkpoint)), checkpoint);
    assert.deepEqual(deserializeNexoraDirectorRuntimeStateSnapshot(serializeNexoraDirectorRuntimeStateSnapshot(snapshot)), snapshot);
    const envelope = JSON.parse(serializeNexoraDirectorRuntimeState(state)); envelope.schemaVersion = "2.0.0"; assert.throws(() => deserializeNexoraDirectorRuntimeState(JSON.stringify(envelope)), /Unsupported/);
    assert.doesNotMatch(source, /from\s+["'](?:react|three|@react-three|[^"']*(?:webgl|webgpu|nol\/director|nol\/material))/i);
  });
});
