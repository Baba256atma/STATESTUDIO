import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createDirectorRuntimeAdapterContext, directorRuntimeAdapterFoundationSchemaVersion, type NexoraDirectorRuntimeCapabilities } from "./nexoraObjectDirectorRuntimeAdapterFoundation.ts";
import { createNexoraDirectorRuntimeState } from "./nexoraObjectDirectorRuntimeStateSynchronizationEngine.ts";
import {
  acknowledgeNexoraDirectorRuntimeFeedback, aggregateNexoraDirectorRuntimeFeedback,
  applyNexoraDirectorRuntimeEventFeedbackCoordination, assertNexoraDirectorRuntimeEventFeedbackInvariants,
  classifyNexoraDirectorRuntimeFeedback, clearNexoraDirectorRuntimeEventQueue, clearNexoraDirectorRuntimeFeedbackQueue,
  compareNexoraDirectorRuntimeEventFeedbackSnapshots, compareNexoraDirectorRuntimeFeedbackWindows,
  coordinateNexoraDirectorRuntimeEventFeedbackBatch, createNexoraDirectorRuntimeEventFeedbackSnapshot,
  createNexoraDirectorRuntimeEventFeedbackState, createNexoraDirectorRuntimeEventQueue,
  createNexoraDirectorRuntimeFeedbackAcknowledgment, createNexoraDirectorRuntimeFeedbackQueue,
  createNexoraDirectorRuntimeFeedbackWindow, deduplicateNexoraDirectorRuntimeEvents,
  deduplicateNexoraDirectorRuntimeFeedback, dequeueNexoraDirectorRuntimeEvent, dequeueNexoraDirectorRuntimeFeedback,
  deserializeNexoraDirectorRuntimeEvent, deserializeNexoraDirectorRuntimeEventFeedbackPlan,
  deserializeNexoraDirectorRuntimeEventFeedbackSnapshot, deserializeNexoraDirectorRuntimeEventFeedbackState,
  deserializeNexoraDirectorRuntimeEventRecord, deserializeNexoraDirectorRuntimeFeedback,
  deserializeNexoraDirectorRuntimeFeedbackAcknowledgment, deserializeNexoraDirectorRuntimeFeedbackRecord,
  detectNexoraDirectorRuntimeFeedbackConflicts, dismissNexoraDirectorRuntimeFeedback,
  enqueueNexoraDirectorRuntimeEvent, enqueueNexoraDirectorRuntimeFeedback,
  evaluateNexoraDirectorRuntimeEventFeedbackCoordination, expireNexoraDirectorRuntimeFeedbackAcknowledgment,
  findStaleNexoraDirectorRuntimeEvents, nexoraObjectDirectorRuntimeEventFeedbackCoordinationEngineIdentity,
  nexoraObjectDirectorRuntimeEventFeedbackCoordinationEngineVersion,
  nexoraObjectDirectorRuntimeEventFeedbackCoordinationSchemaVersion,
  normalizeNexoraDirectorRuntimeEvent, normalizeNexoraDirectorRuntimeFeedback,
  peekNexoraDirectorRuntimeEvent, peekNexoraDirectorRuntimeFeedback,
  planNexoraDirectorRuntimeFeedbackActions, projectNexoraDirectorRuntimeEventHistory,
  projectNexoraDirectorRuntimeFeedbackHistory, resolveNexoraDirectorRuntimeCorrelation,
  resolveNexoraDirectorRuntimeEventPriority, resolveNexoraDirectorRuntimeFeedbackPriority,
  serializeNexoraDirectorRuntimeEvent, serializeNexoraDirectorRuntimeEventFeedbackPlan,
  serializeNexoraDirectorRuntimeEventFeedbackSnapshot, serializeNexoraDirectorRuntimeEventFeedbackState,
  serializeNexoraDirectorRuntimeEventRecord, serializeNexoraDirectorRuntimeFeedback,
  serializeNexoraDirectorRuntimeFeedbackAcknowledgment, serializeNexoraDirectorRuntimeFeedbackRecord,
  simulateNexoraDirectorRuntimeEventFeedbackSequence, validateNexoraDirectorRuntimeEvent,
  validateNexoraDirectorRuntimeEventFeedbackPlan, validateNexoraDirectorRuntimeEventFeedbackRequest,
  validateNexoraDirectorRuntimeEventFeedbackResult, validateNexoraDirectorRuntimeEventFeedbackState,
  validateNexoraDirectorRuntimeFeedback, validateNexoraDirectorRuntimeFeedbackAcknowledgment,
  validateNexoraDirectorRuntimeFeedbackAction,
  type NexoraDirectorRuntimeEvent, type NexoraDirectorRuntimeEventFeedbackDependencies,
  type NexoraDirectorRuntimeEventFeedbackRequest, type NexoraDirectorRuntimeFeedback,
} from "./nexoraObjectDirectorRuntimeEventFeedbackCoordinationEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, "nexoraObjectDirectorRuntimeEventFeedbackCoordinationEngine.ts"), "utf8");
function freeze<T>(value: T, seen = new Set<object>()): T { if (value === null || typeof value !== "object" || seen.has(value as object)) return value; seen.add(value as object); Object.values(value as Record<string, unknown>).forEach((x) => freeze(x, seen)); return Object.freeze(value); }
function isFrozen(value: unknown, seen = new Set<object>()): boolean { if (value === null || typeof value !== "object" || seen.has(value as object)) return true; if (!Object.isFrozen(value)) return false; seen.add(value as object); return Object.values(value as Record<string, unknown>).every((x) => isFrozen(x, seen)); }
const capabilities: NexoraDirectorRuntimeCapabilities = { cameraIntents: true, focus: true, interaction: true, animationHints: true, attention: true, labels: true, indicators: true, relationships: true, clustering: true, timelineReplay: true, operationOverlays: true, themeSwitching: true, reducedMotion: true, diagnostics: true };
const deps: NexoraDirectorRuntimeEventFeedbackDependencies = freeze({ now: () => "2026-08-05T01:00:00.000Z", createStateId: () => "state-fixed", createActionId: (id, type) => `${id}:${type}`, createConflictId: (ids) => `conflict:${[...ids].sort().join(":")}`, createRecordId: () => "record-fixed", createAggregateId: (key) => `aggregate:${key}`, createWindowId: () => "window-fixed", createSnapshotId: () => "snapshot-fixed" });
function runtimeContext() { return createDirectorRuntimeAdapterContext({ runtimeId: "runtime-1", adapterVersion: "1.0.0", engineVersion: "1.0.0", runtimeState: "Ready", capabilities, compatibility: { compatible: true, adapterVersion: "1.0.0", engineVersion: "1.0.0", schemaVersion: directorRuntimeAdapterFoundationSchemaVersion, warnings: [] }, timestamp: "2026-08-05T00:00:00.000Z", diagnosticsEnabled: true, reducedMotion: false, metadata: {} }); }
function event(overrides: Partial<NexoraDirectorRuntimeEvent> = {}): NexoraDirectorRuntimeEvent { return freeze({ eventId: "event-1", eventType: "CommandCompleted", runtimeId: "runtime-1", runtimeRevision: 0, commandId: "command-1", executionId: "execution-1", source: "ExecutionModel", priority: 30, occurredAt: "2026-08-05T00:00:00.000Z", correlationId: "correlation-1", causationId: "cause-1", payload: {}, ...overrides }); }
function feedback(overrides: Partial<NexoraDirectorRuntimeFeedback> = {}): NexoraDirectorRuntimeFeedback { return freeze({ feedbackId: "feedback-1", feedbackType: "Completed", severity: "Info", runtimeId: "runtime-1", runtimeRevision: 0, commandId: "command-1", executionId: "execution-1", source: "ExecutionModel", message: "Completed", retryable: false, recoverable: true, requiresAcknowledgment: false, occurredAt: "2026-08-05T00:00:00.000Z", correlationId: "correlation-1", causationId: "cause-1", payload: {}, ...overrides }); }
function request(overrides: Partial<NexoraDirectorRuntimeEventFeedbackRequest> = {}): NexoraDirectorRuntimeEventFeedbackRequest { const ctx = runtimeContext(); const state = createNexoraDirectorRuntimeState(ctx); return freeze({ requestId: "request-1", events: [event()], feedback: [feedback()], context: { runtimeContext: ctx, runtimeState: state, source: "RuntimeAdapter", mode: "Atomic", occurredAt: "2026-08-05T01:00:00.000Z", deduplicationWindowMs: 1000, staleEventToleranceMs: Number.POSITIVE_INFINITY }, ...overrides }); }

describe("NOL-4:4 Director Runtime Event & Feedback Coordination Engine", () => {
  it("1-6. identity, imports, defaults, and normalization are deterministic and JSON-safe", () => {
    assert.equal(nexoraObjectDirectorRuntimeEventFeedbackCoordinationEngineIdentity, "NOL-4:4/NexoraObjectDirectorRuntimeEventFeedbackCoordinationEngine"); assert.equal(nexoraObjectDirectorRuntimeEventFeedbackCoordinationEngineVersion, "1.0.0"); assert.equal(nexoraObjectDirectorRuntimeEventFeedbackCoordinationSchemaVersion, "1.0.0");
    const imports = [...source.matchAll(/^import[\s\S]*?from\s+"([^"]+)";/gm)].map((x) => x[1]); assert.deepEqual(imports, ["./nexoraObjectDirectorRuntimeAdapterFoundation.ts", "./nexoraObjectDirectorRuntimeCommandExecutionModel.ts", "./nexoraObjectDirectorRuntimeStateSynchronizationEngine.ts"]);
    const state = createNexoraDirectorRuntimeEventFeedbackState("runtime-1", "2026-08-05T00:00:00.000Z", deps); assert.equal(state.status, "Idle"); assert.equal(state.revision, 0); assert.equal(isFrozen(state), true);
    assert.deepEqual(normalizeNexoraDirectorRuntimeEvent(event()), normalizeNexoraDirectorRuntimeEvent(event())); assert.deepEqual(normalizeNexoraDirectorRuntimeFeedback(feedback()), normalizeNexoraDirectorRuntimeFeedback(feedback())); assert.doesNotThrow(() => JSON.stringify(normalizeNexoraDirectorRuntimeEvent(event())));
  });
  it("7-12. classification covers success, retry, permanence, partial, degradation, acknowledgment", () => {
    assert.equal(classifyNexoraDirectorRuntimeFeedback(feedback()), "Success");
    assert.equal(classifyNexoraDirectorRuntimeFeedback(feedback({ feedbackType: "TimedOut", severity: "Warning", retryable: true })), "TransientFailure");
    assert.equal(classifyNexoraDirectorRuntimeFeedback(feedback({ feedbackType: "Failed", severity: "Error", recoverable: false })), "PermanentFailure");
    assert.equal(classifyNexoraDirectorRuntimeFeedback(feedback({ payload: { partial: true } }), "BestEffort", true), "PartialSuccess");
    assert.equal(classifyNexoraDirectorRuntimeFeedback(feedback({ feedbackType: "Unsupported" })), "CapabilityDegradation");
    assert.equal(classifyNexoraDirectorRuntimeFeedback(feedback({ severity: "Critical", requiresAcknowledgment: true })), "UserAcknowledgmentRequired");
  });
  it("13-16. event and feedback priority ordering is deterministic", () => {
    assert.ok(resolveNexoraDirectorRuntimeEventPriority("RuntimeFailed") > resolveNexoraDirectorRuntimeEventPriority("RuntimeDiagnostic"));
    assert.ok(resolveNexoraDirectorRuntimeFeedbackPriority(feedback({ severity: "Critical", feedbackType: "Failed", recoverable: false })) > resolveNexoraDirectorRuntimeFeedbackPriority(feedback({ feedbackType: "Diagnostic" })));
    const queue = createNexoraDirectorRuntimeEventQueue([event({ eventId: "b", occurredAt: "2026-08-05T00:00:01.000Z" }), event({ eventId: "a" })]); assert.deepEqual(queue.events.map((x) => x.eventId), ["a", "b"]);
  });
  it("17-20. deduplication suppresses only equivalent causation and protects acknowledgment", () => {
    const a = event(), b = event({ eventId: "event-2" }); const dedup = deduplicateNexoraDirectorRuntimeEvents([b, a]); assert.deepEqual(dedup.events.map((x) => x.eventId), ["event-1"]); assert.deepEqual(dedup.suppressedEvents.map((x) => x.eventId), ["event-2"]);
    assert.equal(deduplicateNexoraDirectorRuntimeEvents([a, event({ eventId: "event-3", causationId: "other" })]).events.length, 2);
    assert.equal(deduplicateNexoraDirectorRuntimeFeedback([feedback(), feedback({ feedbackId: "feedback-2" })]).suppressedFeedback.length, 1);
    assert.equal(deduplicateNexoraDirectorRuntimeFeedback([feedback({ requiresAcknowledgment: true }), feedback({ feedbackId: "feedback-2", requiresAcknowledgment: true })]).feedback.length, 2);
  });
  it("21-27. stale events and conflicts support Atomic and BestEffort semantics", () => {
    const state = freeze({ ...createNexoraDirectorRuntimeState(runtimeContext()), revision: 2 }); assert.equal(findStaleNexoraDirectorRuntimeEvents([event()], state, Number.POSITIVE_INFINITY)[0]?.reason, "OlderRuntimeRevision");
    assert.equal(findStaleNexoraDirectorRuntimeEvents([event({ eventType: "CommandCompleted", runtimeRevision: 2, payload: { rolledBack: true } })], state, Number.POSITIVE_INFINITY)[0]?.reason, "SupersededByRollback");
    const success = feedback({ feedbackId: "success", feedbackType: "Applied" }), failure = feedback({ feedbackId: "failure", feedbackType: "Failed", severity: "Error", recoverable: false }); const conflicts = detectNexoraDirectorRuntimeFeedbackConflicts([success, failure], deps); assert.equal(conflicts[0]?.type, "SuccessAndFailure");
    assert.equal(detectNexoraDirectorRuntimeFeedbackConflicts([success, feedback({ feedbackId: "rollback", feedbackType: "RolledBack" })], deps)[0]?.type, "AppliedAndRolledBack");
    const atomic = evaluateNexoraDirectorRuntimeEventFeedbackCoordination(request({ feedback: [success, failure] }), deps); assert.equal(atomic.accepted, false);
    const best = evaluateNexoraDirectorRuntimeEventFeedbackCoordination(request({ feedback: [success, failure], context: { ...request().context, mode: "BestEffort" } }), deps); assert.equal(best.accepted, true); assert.equal(best.warnings.some((x) => x.code === "RUNTIME_FEEDBACK_PARTIAL_COORDINATION"), true);
  });
  it("28-34. correlations and recommendation actions preserve references", () => {
    const groups = resolveNexoraDirectorRuntimeCorrelation([event()], [feedback()]); assert.deepEqual(groups[0]?.eventIds, ["event-1"]); assert.deepEqual(groups[0]?.feedbackIds, ["feedback-1"]);
    assert.equal(planNexoraDirectorRuntimeFeedbackActions([feedback({ feedbackType: "TimedOut", retryable: true })], deps)[0]?.type, "RetryCommand");
    assert.equal(planNexoraDirectorRuntimeFeedbackActions([feedback({ feedbackType: "Failed", severity: "Error", recoverable: false })], deps).some((x) => x.type === "PreservePreviousState"), true);
    assert.equal(planNexoraDirectorRuntimeFeedbackActions([feedback({ feedbackType: "RolledBack" })], deps)[0]?.type, "RequestResynchronization");
    assert.equal(planNexoraDirectorRuntimeFeedbackActions([feedback({ feedbackType: "Unsupported" })], deps)[0]?.type, "DegradeRuntimeHealth");
    assert.equal(planNexoraDirectorRuntimeFeedbackActions([feedback({ severity: "Critical", requiresAcknowledgment: true })], deps)[0]?.type, "Acknowledge");
    assert.equal(planNexoraDirectorRuntimeFeedbackActions([feedback()], deps)[0]?.type, "NoAction");
  });
  it("35-37. immutable queue operations use deterministic priority", () => {
    const low = event({ eventId: "low", eventType: "RuntimeDiagnostic", priority: 10 }), high = event({ eventId: "high", eventType: "RuntimeFailed", priority: 100 }); const queue = createNexoraDirectorRuntimeEventQueue([low]); const added = enqueueNexoraDirectorRuntimeEvent(queue, high); assert.equal(peekNexoraDirectorRuntimeEvent(added)?.eventId, "high"); assert.equal(queue.events.length, 1); const [removed, remainder] = dequeueNexoraDirectorRuntimeEvent(added); assert.equal(removed?.eventId, "high"); assert.equal(remainder.events.length, 1); assert.equal(clearNexoraDirectorRuntimeEventQueue().events.length, 0);
    const fq = enqueueNexoraDirectorRuntimeFeedback(createNexoraDirectorRuntimeFeedbackQueue([feedback({ feedbackId: "low", feedbackType: "Diagnostic" })]), feedback({ feedbackId: "high", severity: "Critical", feedbackType: "Failed", recoverable: false })); assert.equal(peekNexoraDirectorRuntimeFeedback(fq)?.feedbackId, "high"); assert.equal(dequeueNexoraDirectorRuntimeFeedback(fq)[1].feedback.length, 1); assert.equal(clearNexoraDirectorRuntimeFeedbackQueue().feedback.length, 0);
  });
  it("38-43. acknowledgment transitions are immutable and auditable", () => {
    const required = feedback({ requiresAcknowledgment: true }); const pending = createNexoraDirectorRuntimeFeedbackAcknowledgment(required); assert.equal(pending.state, "Pending"); const acknowledged = acknowledgeNexoraDirectorRuntimeFeedback(pending, "actor", "2026-08-05T01:00:00.000Z"); assert.equal(acknowledged.state, "Acknowledged"); assert.equal(pending.state, "Pending"); assert.equal(dismissNexoraDirectorRuntimeFeedback(pending, "actor", "2026-08-05T01:00:00.000Z").state, "Dismissed"); assert.equal(expireNexoraDirectorRuntimeFeedbackAcknowledgment(pending).state, "Expired");
    const optional = createNexoraDirectorRuntimeFeedbackAcknowledgment(feedback()); assert.equal(optional.state, "NotRequired"); assert.throws(() => acknowledgeNexoraDirectorRuntimeFeedback(optional, "actor", "2026-08-05T01:00:00.000Z"), /Pending/); assert.throws(() => acknowledgeNexoraDirectorRuntimeFeedback(acknowledged, "actor", "2026-08-05T01:00:00.000Z"), /Pending/);
  });
  it("44-47. aggregates and caller-supplied feedback windows are deterministic", () => {
    const values = [feedback({ feedbackId: "info" }), feedback({ feedbackId: "critical", severity: "Critical", feedbackType: "Failed", recoverable: false })]; const aggregate = aggregateNexoraDirectorRuntimeFeedback(values, () => "all", deps); assert.deepEqual(aggregate, aggregateNexoraDirectorRuntimeFeedback(values, () => "all", deps)); assert.equal(aggregate[0]?.highestSeverity, "Critical");
    const left = createNexoraDirectorRuntimeFeedbackWindow("2026-08-05T00:00:00.000Z", "2026-08-05T02:00:00.000Z", [event()], [feedback()], aggregate, deps); assert.equal(left.startedAt, "2026-08-05T00:00:00.000Z"); const right = createNexoraDirectorRuntimeFeedbackWindow(left.startedAt, left.endedAt, [event()], [], aggregate, deps); assert.equal(compareNexoraDirectorRuntimeFeedbackWindows(left, right).feedbackChanged, true);
  });
  it("48-53. evaluation is immutable with simulation, no-op, revision, and rejection rules", () => {
    const input = request(); const before = JSON.stringify(input); const applied = applyNexoraDirectorRuntimeEventFeedbackCoordination(input, deps); assert.equal(JSON.stringify(input), before); assert.equal(applied.nextState.revision, 1);
    const simulation = applyNexoraDirectorRuntimeEventFeedbackCoordination(request({ context: { ...input.context, mode: "Simulation" } }), deps); assert.equal(simulation.nextState.revision, 0); assert.equal(simulation.eventRecords.length, 0);
    const noOp = applyNexoraDirectorRuntimeEventFeedbackCoordination(request({ events: [], feedback: [] }), deps); assert.equal(noOp.nextState.revision, 0);
    const conflict = applyNexoraDirectorRuntimeEventFeedbackCoordination(request({ expectedCoordinationRevision: 9 }), deps); assert.equal(conflict.accepted, false); assert.equal(conflict.nextState.revision, 0); assert.equal(conflict.errors[0]?.code, "RUNTIME_FEEDBACK_COORDINATION_REVISION_CONFLICT");
  });
  it("54-58. batch and sequence coordination preserve order and isolation", () => {
    const valid = request(), invalid = request({ requestId: "bad", expectedCoordinationRevision: 9 }); const atomic = coordinateNexoraDirectorRuntimeEventFeedbackBatch({ requests: [valid, invalid], mode: "Atomic" }, deps); assert.equal(atomic.accepted, false); assert.equal(atomic.finalState.revision, 0); assert.deepEqual(atomic.acceptedRequestIds, []);
    const best = coordinateNexoraDirectorRuntimeEventFeedbackBatch({ requests: [valid, invalid], mode: "BestEffort" }, deps); assert.equal(best.finalState.revision, 1);
    assert.throws(() => coordinateNexoraDirectorRuntimeEventFeedbackBatch({ requests: [valid, valid], mode: "Atomic" }, deps), /Duplicate/);
    const sequence = simulateNexoraDirectorRuntimeEventFeedbackSequence([valid, invalid], false, deps); assert.deepEqual(sequence.plans.map((x) => x.requestId), ["request-1", "bad"]); assert.equal(sequence.firstFailureRequestId, "bad");
  });
  it("59-63. records, histories, and snapshots are immutable and comparable", () => {
    const coordinated = applyNexoraDirectorRuntimeEventFeedbackCoordination(request(), deps); assert.equal(isFrozen(coordinated.eventRecords[0]), true); assert.equal(isFrozen(coordinated.feedbackRecords[0]), true); assert.deepEqual(projectNexoraDirectorRuntimeEventHistory(coordinated.eventRecords), coordinated.eventRecords); assert.deepEqual(projectNexoraDirectorRuntimeFeedbackHistory(coordinated.feedbackRecords), coordinated.feedbackRecords);
    const left = createNexoraDirectorRuntimeEventFeedbackSnapshot(coordinated.previousState, createNexoraDirectorRuntimeEventQueue(), createNexoraDirectorRuntimeFeedbackQueue(), [], deps); const ack = createNexoraDirectorRuntimeFeedbackAcknowledgment(feedback({ requiresAcknowledgment: true })); const right = createNexoraDirectorRuntimeEventFeedbackSnapshot(coordinated.nextState, createNexoraDirectorRuntimeEventQueue(), createNexoraDirectorRuntimeFeedbackQueue([feedback()]), [ack], deps); const cmp = compareNexoraDirectorRuntimeEventFeedbackSnapshots(left, right); assert.equal(cmp.acknowledgmentsChanged, true); assert.equal(cmp.correlationsChanged, true); assert.equal(cmp.feedbackChanged, true);
  });
  it("64-71. validation rejects duplicates, malformed values, missing references, and renderer objects", () => {
    assert.equal(validateNexoraDirectorRuntimeEventFeedbackRequest(request({ events: [event(), event()] })).errors.some((x) => x.code === "RUNTIME_FEEDBACK_DUPLICATE_EVENT_ID"), true);
    assert.equal(validateNexoraDirectorRuntimeEventFeedbackRequest(request({ feedback: [feedback(), feedback()] })).errors.some((x) => x.code === "RUNTIME_FEEDBACK_DUPLICATE_FEEDBACK_ID"), true);
    assert.equal(validateNexoraDirectorRuntimeEvent({ ...event(), priority: -1 }).valid, false); assert.equal(validateNexoraDirectorRuntimeEvent({ ...event(), occurredAt: "invalid" }).valid, false);
    assert.equal(validateNexoraDirectorRuntimeFeedbackAcknowledgment({ feedbackId: "x", state: "Bad" }).valid, false); assert.equal(validateNexoraDirectorRuntimeFeedback({ ...feedback(), feedbackType: "Failed", commandId: undefined }).valid, false);
    class Mesh {} assert.equal(validateNexoraDirectorRuntimeFeedback({ ...feedback(), payload: { mesh: new Mesh() } }).errors.some((x) => x.code === "RUNTIME_FEEDBACK_RENDERER_OBJECT_FORBIDDEN"), true);
    const coordinated = applyNexoraDirectorRuntimeEventFeedbackCoordination(request(), deps); assert.equal(validateNexoraDirectorRuntimeEventFeedbackState(coordinated.nextState).valid, true); assert.equal(validateNexoraDirectorRuntimeEventFeedbackPlan(coordinated.plan).valid, true); assert.equal(validateNexoraDirectorRuntimeEventFeedbackResult(coordinated).valid, true); assert.equal(validateNexoraDirectorRuntimeFeedbackAction(coordinated.plan.actions[0]).valid, true); assert.doesNotThrow(() => assertNexoraDirectorRuntimeEventFeedbackInvariants(coordinated)); assert.equal(isFrozen(coordinated), true);
  });
  it("72-80. serialization round-trips and no dispatch, execution, or mutation dependency exists", () => {
    const coordinated = applyNexoraDirectorRuntimeEventFeedbackCoordination(request(), deps), ack = createNexoraDirectorRuntimeFeedbackAcknowledgment(feedback()), snapshot = createNexoraDirectorRuntimeEventFeedbackSnapshot(coordinated.nextState, createNexoraDirectorRuntimeEventQueue([event()]), createNexoraDirectorRuntimeFeedbackQueue([feedback()]), [ack], deps);
    assert.deepEqual(deserializeNexoraDirectorRuntimeEvent(serializeNexoraDirectorRuntimeEvent(event())), event()); assert.deepEqual(deserializeNexoraDirectorRuntimeFeedback(serializeNexoraDirectorRuntimeFeedback(feedback())), feedback()); assert.deepEqual(deserializeNexoraDirectorRuntimeFeedbackAcknowledgment(serializeNexoraDirectorRuntimeFeedbackAcknowledgment(ack)), ack); assert.deepEqual(deserializeNexoraDirectorRuntimeEventFeedbackState(serializeNexoraDirectorRuntimeEventFeedbackState(coordinated.nextState)), coordinated.nextState); assert.deepEqual(deserializeNexoraDirectorRuntimeEventFeedbackPlan(serializeNexoraDirectorRuntimeEventFeedbackPlan(coordinated.plan)), coordinated.plan); assert.deepEqual(deserializeNexoraDirectorRuntimeEventRecord(serializeNexoraDirectorRuntimeEventRecord(coordinated.eventRecords[0]!)), coordinated.eventRecords[0]); assert.deepEqual(deserializeNexoraDirectorRuntimeFeedbackRecord(serializeNexoraDirectorRuntimeFeedbackRecord(coordinated.feedbackRecords[0]!)), coordinated.feedbackRecords[0]); assert.deepEqual(deserializeNexoraDirectorRuntimeEventFeedbackSnapshot(serializeNexoraDirectorRuntimeEventFeedbackSnapshot(snapshot)), snapshot);
    const envelope = JSON.parse(serializeNexoraDirectorRuntimeEvent(event())); envelope.schemaVersion = "2.0.0"; assert.throws(() => deserializeNexoraDirectorRuntimeEvent(JSON.stringify(envelope)), /Unsupported/);
    assert.doesNotMatch(source, /\b(?:dispatchEvent|addEventListener|setTimeout|setInterval|requestAnimationFrame|executeRuntimeCommandBatch|applyNexoraDirectorRuntimeStateSynchronization)\s*\(/); assert.doesNotMatch(source, /from\s+["'](?:react|three|@react-three|[^"']*(?:webgl|webgpu|nol\/director|nol\/material))/i);
  });
});
