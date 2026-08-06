import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  assertRuntimeExecutionInvariants,
  cancelRuntimeCommand,
  clearRuntimeExecutionQueue,
  compareRuntimeExecutionSnapshots,
  createRuntimeExecutionQueue,
  createRuntimeExecutionSnapshot,
  dequeueRuntimeCommand,
  deserializeRuntimeExecutionQueue,
  deserializeRuntimeExecutionReport,
  deserializeRuntimeExecutionSnapshot,
  enqueueRuntimeCommand,
  executeRuntimeCommandBatch,
  peekRuntimeCommand,
  planRuntimeRollback,
  projectRuntimeExecution,
  reorderRuntimeExecutionQueue,
  retryRuntimeCommand,
  runtimeCommandExecutionModelIdentity,
  runtimeCommandExecutionModelSchemaVersion,
  runtimeCommandExecutionModelUpstream,
  runtimeCommandExecutionModelVersion,
  scheduleRuntimeExecution,
  serializeRuntimeExecutionQueue,
  serializeRuntimeExecutionReport,
  serializeRuntimeExecutionSnapshot,
  snapshotRuntimeExecutionQueue,
  transitionRuntimeExecutionState,
  validateExecutionQueue,
  validateExecutionReport,
  validateRuntimeExecutionModel,
  type NexoraDirectorRuntimeExecutionCommand,
} from "./nexoraObjectDirectorRuntimeCommandExecutionModel.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, "nexoraObjectDirectorRuntimeCommandExecutionModel.ts"), "utf8");

function frozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => frozen(child, seen));
}

function command(id: string, order: number, priority: number, dependencies: readonly string[] = []): NexoraDirectorRuntimeExecutionCommand {
  return Object.freeze({
    commandId: id, runtimeCommandType: "UpdateRuntimeObject", revision: 4,
    order, priority, dependencies: Object.freeze([...dependencies]), retryCount: 0,
    timeout: 1000, metadata: Object.freeze({ semantic: true }),
  });
}

describe("NOL-4:2 Director Runtime Command Execution Model", () => {
  it("1-2. exposes exact identity and imports only NOL-4:1", () => {
    assert.equal(runtimeCommandExecutionModelIdentity, "NOL-4:2/NexoraObjectDirectorRuntimeCommandExecutionModel");
    assert.equal(runtimeCommandExecutionModelVersion, "1.0.0");
    assert.equal(runtimeCommandExecutionModelSchemaVersion, "1.0.0");
    assert.equal(runtimeCommandExecutionModelUpstream, "NOL-4:1/NexoraObjectDirectorRuntimeAdapterFoundation");
    const imports = [...source.matchAll(/^import[\s\S]*?from\s+"([^"]+)";/gm)].map((match) => match[1]);
    assert.deepEqual(imports, ["./nexoraObjectDirectorRuntimeAdapterFoundation.ts"]);
  });

  it("3-4. enforces the exact execution lifecycle", () => {
    assert.equal(transitionRuntimeExecutionState("Pending", "Queued"), "Queued");
    assert.equal(transitionRuntimeExecutionState("Queued", "Running"), "Running");
    assert.equal(transitionRuntimeExecutionState("Running", "Completed"), "Completed");
    assert.equal(transitionRuntimeExecutionState("Running", "Failed"), "Failed");
    assert.equal(transitionRuntimeExecutionState("Running", "Cancelled"), "Cancelled");
    assert.equal(transitionRuntimeExecutionState("Failed", "RolledBack"), "RolledBack");
    assert.throws(() => transitionRuntimeExecutionState("Pending", "Completed"), /Illegal/);
    assert.equal(cancelRuntimeCommand(command("x", 0, 0)).state, "Cancelled");
  });

  it("5. supports immutable deterministic queue operations", () => {
    const queue = createRuntimeExecutionQueue([
      command("z", 2, 1), command("b", 0, 2), command("a", 0, 2),
    ]);
    assert.deepEqual(queue.commands.map(({ commandId }) => commandId), ["a", "b", "z"]);
    assert.equal(peekRuntimeCommand(queue)?.commandId, "a");
    const enriched = enqueueRuntimeCommand(queue, command("top", 0, 3));
    assert.equal(peekRuntimeCommand(enriched)?.commandId, "top");
    const [removed, remainder] = dequeueRuntimeCommand(enriched);
    assert.equal(removed?.commandId, "top");
    assert.equal(remainder.commands.length, 3);
    assert.deepEqual(reorderRuntimeExecutionQueue(queue), queue);
    assert.equal(clearRuntimeExecutionQueue(queue).commands.length, 0);
    assert.deepEqual(snapshotRuntimeExecutionQueue(queue), queue);
    assert.equal(frozen(queue), true);
  });

  it("6. schedules dependencies and priorities deterministically", () => {
    const queue = createRuntimeExecutionQueue([
      command("dependent", 0, 10, ["base"]), command("base", 5, 0), command("peer", 1, 5),
    ], 4);
    const first = scheduleRuntimeExecution(queue, { executionId: "e", mode: "Atomic", clockMs: 20 });
    assert.deepEqual(first, scheduleRuntimeExecution(queue, { executionId: "e", mode: "Atomic", clockMs: 20 }));
    assert.deepEqual(first.commands.map(({ commandId }) => commandId), ["peer", "base", "dependent"]);
    assert.deepEqual(first.commands.map(({ scheduledOrder }) => scheduledOrder), [0, 1, 2]);
    assert.equal(first.commands[0]?.timeoutAt, 1020);
  });

  it("7. atomic failure produces rollback for completed commands", () => {
    const queue = createRuntimeExecutionQueue([command("a", 0, 2), command("b", 1, 1), command("c", 2, 0)]);
    const report = executeRuntimeCommandBatch(queue, {
      executionId: "atomic", mode: "Atomic",
      outcomes: [{ commandId: "a", succeeded: true }, { commandId: "b", succeeded: false, error: "semantic failure" }],
    });
    assert.equal(report.accepted, false);
    assert.equal(report.completedCommands.length, 1);
    assert.equal(report.failedCommands.length, 1);
    assert.equal(report.rollbackPlan.required, true);
    assert.deepEqual(report.rollbackPlan.commands.map(({ sourceCommandId }) => sourceCommandId), ["a"]);
  });

  it("8. BestEffort isolates failures and continues", () => {
    const queue = createRuntimeExecutionQueue([command("a", 0, 2), command("b", 1, 1), command("c", 2, 0)]);
    const report = executeRuntimeCommandBatch(queue, {
      executionId: "best", mode: "BestEffort",
      outcomes: [{ commandId: "b", succeeded: false, error: "isolated" }],
    });
    assert.equal(report.completedCommands.length, 2);
    assert.equal(report.failedCommands.length, 1);
    assert.equal(report.rollbackPlan.required, false);
  });

  it("9. Simulation mutates no execution or NOL-4:1 state", () => {
    const queue = createRuntimeExecutionQueue([command("a", 0, 0)]);
    const before = JSON.stringify(queue);
    const report = executeRuntimeCommandBatch(queue, { executionId: "sim", mode: "Simulation" });
    assert.equal(JSON.stringify(queue), before);
    assert.match(report.warnings[0] ?? "", /Simulation/);
  });

  it("10. applies immediate, delayed, maximum, and disabled retry policy", () => {
    const original = command("retry", 0, 0);
    const immediate = retryRuntimeCommand(original, { strategy: "Immediate", maximumRetries: 2, delayMs: 0 });
    assert.equal(immediate.retryCount, 1);
    assert.equal(immediate.metadata.retryDelayMs, 0);
    const delayed = retryRuntimeCommand(original, { strategy: "Delayed", maximumRetries: 2, delayMs: 250 });
    assert.equal(delayed.metadata.retryDelayMs, 250);
    assert.throws(() => retryRuntimeCommand(original, { strategy: "Disabled", maximumRetries: 2, delayMs: 0 }), /unavailable/);
    assert.throws(() => retryRuntimeCommand({ ...original, retryCount: 2 }, { strategy: "Immediate", maximumRetries: 2, delayMs: 0 }), /unavailable/);
  });

  it("11. rollback planning is deterministic and reverses execution order", () => {
    const commands = [command("a", 0, 0), command("b", 1, 0)];
    const first = planRuntimeRollback(commands);
    assert.deepEqual(first, planRuntimeRollback(commands));
    assert.deepEqual(first.commands.map(({ sourceCommandId }) => sourceCommandId), ["b", "a"]);
  });

  it("12-13. diagnostics and reports are deeply immutable and valid", () => {
    const queue = createRuntimeExecutionQueue([command("a", 0, 0)]);
    const report = executeRuntimeCommandBatch(queue, { executionId: "report", mode: "Atomic", outcomes: [{ commandId: "a", succeeded: true, durationMs: 7 }] });
    assert.equal(frozen(report.diagnostics), true);
    assert.equal(frozen(report), true);
    assert.equal(report.diagnostics.executionDuration, 7);
    assert.equal(validateExecutionQueue(queue).valid, true);
    assert.equal(validateExecutionReport(report).valid, true);
    assert.equal(validateRuntimeExecutionModel(report).valid, true);
    assert.doesNotThrow(() => assertRuntimeExecutionInvariants(report));
    assert.deepEqual(projectRuntimeExecution(report), { executionId: "report", state: "Completed", revision: 0, completedCount: 1, failedCount: 0, rollbackRequired: false });
  });

  it("14. compares queue, revision, state, completion, and rollback", () => {
    const queue = createRuntimeExecutionQueue([command("a", 0, 0)]);
    const leftReport = executeRuntimeCommandBatch(queue, { executionId: "e", mode: "Atomic" });
    const rightQueue = enqueueRuntimeCommand(queue, command("b", 1, 0));
    const rightReport = executeRuntimeCommandBatch(rightQueue, { executionId: "e", mode: "Atomic" });
    const comparison = compareRuntimeExecutionSnapshots(createRuntimeExecutionSnapshot(leftReport, queue), createRuntimeExecutionSnapshot(rightReport, rightQueue));
    assert.equal(comparison.equal, false);
    assert.equal(comparison.queueChanged, true);
    assert.equal(comparison.revisionChanged, true);
    assert.equal(comparison.completedCommandsChanged, true);
  });

  it("15. round-trips queue, report, and snapshot serialization", () => {
    const queue = createRuntimeExecutionQueue([command("a", 0, 0)]);
    const report = executeRuntimeCommandBatch(queue, { executionId: "round", mode: "Atomic" });
    const snapshot = createRuntimeExecutionSnapshot(report, queue);
    assert.deepEqual(deserializeRuntimeExecutionQueue(serializeRuntimeExecutionQueue(queue)), queue);
    assert.deepEqual(deserializeRuntimeExecutionReport(serializeRuntimeExecutionReport(report)), report);
    assert.deepEqual(deserializeRuntimeExecutionSnapshot(serializeRuntimeExecutionSnapshot(snapshot)), snapshot);
  });

  it("16. rejects unsupported serialization schemas", () => {
    const envelope = JSON.parse(serializeRuntimeExecutionQueue(createRuntimeExecutionQueue())) as Record<string, unknown>;
    envelope.schemaVersion = "2.0.0";
    assert.throws(() => deserializeRuntimeExecutionQueue(JSON.stringify(envelope)), /Unsupported/);
  });

  it("17-18. rejects renderer objects and contains no renderer/framework dependency", () => {
    class Mesh {}
    assert.throws(() => createRuntimeExecutionQueue([{ ...command("bad", 0, 0), metadata: { value: new Mesh() } }]), /Renderer/);
    assert.doesNotMatch(source, /from\s+["'](?:react|three|@react-three|[^"']*webgl|[^"']*webgpu)/i);
    assert.doesNotMatch(source, /\b(?:new\s+Mesh|new\s+Scene|new\s+Camera|new\s+Material|document\.|window\.)/);
  });
});
