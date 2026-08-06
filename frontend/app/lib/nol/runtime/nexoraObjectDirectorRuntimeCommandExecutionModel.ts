/**
 * NOL-4:2 — deterministic semantic command execution state model.
 * Models scheduling and outcomes only; it performs no renderer work.
 */
import {
  directorRuntimeAdapterFoundationIdentity,
  type NexoraDirectorRuntimeCommand,
  type NexoraDirectorRuntimeCommandType,
  type NexoraDirectorRuntimeRequestMode,
} from "./nexoraObjectDirectorRuntimeAdapterFoundation.ts";

export * from "./nexoraObjectDirectorRuntimeAdapterFoundation.ts";

export const runtimeCommandExecutionModelIdentity =
  "NOL-4:2/NexoraObjectDirectorRuntimeCommandExecutionModel" as const;
export const runtimeCommandExecutionModelVersion = "1.0.0" as const;
export const runtimeCommandExecutionModelSchemaVersion = "1.0.0" as const;
export const runtimeCommandExecutionModelUpstream =
  directorRuntimeAdapterFoundationIdentity;

export type NexoraDirectorRuntimeExecutionState =
  | "Pending" | "Queued" | "Running" | "Completed" | "Failed"
  | "Cancelled" | "RolledBack";
export type NexoraDirectorRuntimeRetryStrategy =
  | "Immediate" | "Delayed" | "Disabled";

export interface NexoraDirectorRuntimeRetryPolicy {
  readonly strategy: NexoraDirectorRuntimeRetryStrategy;
  readonly maximumRetries: number;
  readonly delayMs: number;
}

export interface NexoraDirectorRuntimeExecutionCommand {
  readonly commandId: string;
  readonly runtimeCommandType: NexoraDirectorRuntimeCommandType;
  readonly revision: number;
  readonly order: number;
  readonly priority: number;
  readonly dependencies: readonly string[];
  readonly retryCount: number;
  readonly timeout: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorRuntimeExecutionQueue {
  readonly schemaVersion: typeof runtimeCommandExecutionModelSchemaVersion;
  readonly revision: number;
  readonly commands: readonly NexoraDirectorRuntimeExecutionCommand[];
}

export interface NexoraDirectorRuntimeScheduledCommand
  extends NexoraDirectorRuntimeExecutionCommand {
  readonly scheduledOrder: number;
  readonly timeoutAt: number;
  readonly retryAt?: number;
  readonly rollbackEligible: boolean;
}

export interface NexoraDirectorRuntimeExecutionSchedule {
  readonly executionId: string;
  readonly mode: NexoraDirectorRuntimeRequestMode;
  readonly revision: number;
  readonly commands: readonly NexoraDirectorRuntimeScheduledCommand[];
  readonly rollbackPlan: NexoraDirectorRuntimeRollbackPlan;
  readonly warnings: readonly string[];
}

export interface NexoraDirectorRuntimeExecutionRecord {
  readonly commandId: string;
  readonly state: NexoraDirectorRuntimeExecutionState;
  readonly attempt: number;
  readonly startedAt?: string;
  readonly completedAt?: string;
  readonly durationMs: number;
  readonly error?: string;
}

export interface NexoraDirectorRuntimeRollbackCommand {
  readonly commandId: string;
  readonly sourceCommandId: string;
  readonly runtimeCommandType: NexoraDirectorRuntimeCommandType;
  readonly order: number;
  readonly reason: string;
}

export interface NexoraDirectorRuntimeRollbackPlan {
  readonly required: boolean;
  readonly commands: readonly NexoraDirectorRuntimeRollbackCommand[];
}

export interface NexoraDirectorRuntimeExecutionDiagnostics {
  readonly queueLength: number;
  readonly completed: number;
  readonly failed: number;
  readonly retries: number;
  readonly rollbackCount: number;
  readonly executionDuration: number;
}

export interface NexoraDirectorRuntimeExecutionReport {
  readonly schemaVersion: typeof runtimeCommandExecutionModelSchemaVersion;
  readonly executionId: string;
  readonly accepted: boolean;
  readonly state: NexoraDirectorRuntimeExecutionState;
  readonly revision: number;
  readonly completedCommands: readonly NexoraDirectorRuntimeExecutionRecord[];
  readonly failedCommands: readonly NexoraDirectorRuntimeExecutionRecord[];
  readonly rollbackPlan: NexoraDirectorRuntimeRollbackPlan;
  readonly diagnostics: NexoraDirectorRuntimeExecutionDiagnostics;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
}

export interface NexoraDirectorRuntimeCommandOutcome {
  readonly commandId: string;
  readonly succeeded: boolean;
  readonly cancelled?: boolean;
  readonly durationMs?: number;
  readonly error?: string;
}

export interface NexoraDirectorRuntimeBatchOptions {
  readonly executionId: string;
  readonly mode: NexoraDirectorRuntimeRequestMode;
  readonly outcomes?: readonly NexoraDirectorRuntimeCommandOutcome[];
  readonly retryPolicy?: NexoraDirectorRuntimeRetryPolicy;
  readonly now?: string;
}

export interface NexoraDirectorRuntimeExecutionSnapshot {
  readonly schemaVersion: typeof runtimeCommandExecutionModelSchemaVersion;
  readonly executionId: string;
  readonly revision: number;
  readonly state: NexoraDirectorRuntimeExecutionState;
  readonly queue: NexoraDirectorRuntimeExecutionQueue;
  readonly completedCommands: readonly NexoraDirectorRuntimeExecutionRecord[];
  readonly rollbackPlan: NexoraDirectorRuntimeRollbackPlan;
}

export interface NexoraDirectorRuntimeExecutionProjection {
  readonly executionId: string;
  readonly state: NexoraDirectorRuntimeExecutionState;
  readonly revision: number;
  readonly completedCount: number;
  readonly failedCount: number;
  readonly rollbackRequired: boolean;
}

export interface NexoraDirectorRuntimeExecutionSnapshotComparison {
  readonly equal: boolean;
  readonly queueChanged: boolean;
  readonly revisionChanged: boolean;
  readonly stateChanged: boolean;
  readonly completedCommandsChanged: boolean;
  readonly rollbackStateChanged: boolean;
  readonly revisionDelta: number;
}

export interface NexoraDirectorRuntimeExecutionValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

const STATES = Object.freeze([
  "Pending", "Queued", "Running", "Completed", "Failed", "Cancelled", "RolledBack",
] as const);
const TRANSITIONS: Readonly<Record<NexoraDirectorRuntimeExecutionState, readonly NexoraDirectorRuntimeExecutionState[]>> = Object.freeze({
  Pending: Object.freeze(["Queued"] as const), Queued: Object.freeze(["Running"] as const),
  Running: Object.freeze(["Completed", "Failed", "Cancelled"] as const),
  Completed: Object.freeze([] as const), Failed: Object.freeze(["RolledBack"] as const),
  Cancelled: Object.freeze([] as const), RolledBack: Object.freeze([] as const),
});
const DEFAULT_RETRY_POLICY: NexoraDirectorRuntimeRetryPolicy = Object.freeze({
  strategy: "Disabled", maximumRetries: 0, delayMs: 0,
});

function deepFreeze<T>(value: T, seen = new Set<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return value;
  seen.add(value as object);
  Object.values(value as Record<string, unknown>).forEach((child) => deepFreeze(child, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
}
function frozenClone<T>(value: T): T { return deepFreeze(structuredClone(value)); }
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, seen));
}
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (record(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function rendererObject(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return false;
  seen.add(value as object);
  const name = (value as { constructor?: { name?: string } }).constructor?.name;
  if (name && /^(Mesh|Scene|Camera|Material|Geometry|WebGL|WebGPU|Object3D)/i.test(name)) return true;
  return Object.entries(value as Record<string, unknown>).some(([key, child]) =>
    /^(mesh|scene|camera|material|geometry|renderer|webgl|webgpu)$/i.test(key) || rendererObject(child, seen));
}
function compareCommands(left: NexoraDirectorRuntimeExecutionCommand, right: NexoraDirectorRuntimeExecutionCommand): number {
  return right.priority - left.priority || left.order - right.order || left.commandId.localeCompare(right.commandId);
}
function validResult(errors: string[], warnings: string[] = []): NexoraDirectorRuntimeExecutionValidationResult {
  return deepFreeze({ valid: errors.length === 0, errors, warnings });
}

export function transitionRuntimeExecutionState(from: NexoraDirectorRuntimeExecutionState, to: NexoraDirectorRuntimeExecutionState): NexoraDirectorRuntimeExecutionState {
  if (!TRANSITIONS[from].includes(to)) throw new Error(`Illegal runtime execution transition: ${from} -> ${to}`);
  return to;
}

function normalizeCommand(command: NexoraDirectorRuntimeExecutionCommand | NexoraDirectorRuntimeCommand): NexoraDirectorRuntimeExecutionCommand {
  if (rendererObject(command)) throw new Error("Renderer objects are forbidden in runtime execution commands");
  if ("runtimeCommandType" in command) return frozenClone(command);
  return deepFreeze({
    commandId: command.commandId, runtimeCommandType: command.type,
    revision: command.revision ?? 0, order: command.order, priority: 0,
    dependencies: [...command.dependsOnCommandIds], retryCount: 0, timeout: 0,
    metadata: frozenClone(command.payload),
  });
}

export function createRuntimeExecutionQueue(commands: readonly (NexoraDirectorRuntimeExecutionCommand | NexoraDirectorRuntimeCommand)[] = [], revision = 0): NexoraDirectorRuntimeExecutionQueue {
  const queue = deepFreeze({
    schemaVersion: runtimeCommandExecutionModelSchemaVersion, revision,
    commands: commands.map(normalizeCommand).sort(compareCommands),
  });
  const validation = validateExecutionQueue(queue);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  return queue;
}

export function enqueueRuntimeCommand(queue: NexoraDirectorRuntimeExecutionQueue, command: NexoraDirectorRuntimeExecutionCommand | NexoraDirectorRuntimeCommand): NexoraDirectorRuntimeExecutionQueue {
  return createRuntimeExecutionQueue([...queue.commands, normalizeCommand(command)], queue.revision + 1);
}
export function dequeueRuntimeCommand(queue: NexoraDirectorRuntimeExecutionQueue): readonly [NexoraDirectorRuntimeExecutionCommand | undefined, NexoraDirectorRuntimeExecutionQueue] {
  return deepFreeze([queue.commands[0], createRuntimeExecutionQueue(queue.commands.slice(1), queue.revision + (queue.commands.length ? 1 : 0))] as const);
}
export function peekRuntimeCommand(queue: NexoraDirectorRuntimeExecutionQueue): NexoraDirectorRuntimeExecutionCommand | undefined { return queue.commands[0]; }
export function reorderRuntimeExecutionQueue(queue: NexoraDirectorRuntimeExecutionQueue): NexoraDirectorRuntimeExecutionQueue { return createRuntimeExecutionQueue(queue.commands, queue.revision); }
export function clearRuntimeExecutionQueue(queue: NexoraDirectorRuntimeExecutionQueue): NexoraDirectorRuntimeExecutionQueue { return createRuntimeExecutionQueue([], queue.revision + (queue.commands.length ? 1 : 0)); }
export function snapshotRuntimeExecutionQueue(queue: NexoraDirectorRuntimeExecutionQueue): NexoraDirectorRuntimeExecutionQueue { return frozenClone(queue); }

function dependencyOrder(commands: readonly NexoraDirectorRuntimeExecutionCommand[]): NexoraDirectorRuntimeExecutionCommand[] {
  const byId = new Map(commands.map((command) => [command.commandId, command]));
  const pending = [...commands].sort(compareCommands);
  const scheduled: NexoraDirectorRuntimeExecutionCommand[] = [];
  const done = new Set<string>();
  while (pending.length) {
    const index = pending.findIndex((command) => command.dependencies.every((id) => done.has(id)));
    if (index < 0) throw new Error("Execution queue contains circular or unsatisfied dependencies");
    const command = pending.splice(index, 1)[0]!;
    const missing = command.dependencies.find((id) => !byId.has(id));
    if (missing) throw new Error(`Missing execution dependency: ${missing}`);
    scheduled.push(command); done.add(command.commandId);
  }
  return scheduled;
}

export function scheduleRuntimeExecution(
  queue: NexoraDirectorRuntimeExecutionQueue,
  options: { readonly executionId?: string; readonly mode?: NexoraDirectorRuntimeRequestMode; readonly retryPolicy?: NexoraDirectorRuntimeRetryPolicy; readonly clockMs?: number } = {},
): NexoraDirectorRuntimeExecutionSchedule {
  const validation = validateExecutionQueue(queue);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const policy = options.retryPolicy ?? DEFAULT_RETRY_POLICY;
  validateRetryPolicy(policy);
  const clock = options.clockMs ?? 0;
  const ordered = dependencyOrder(queue.commands);
  const commands = ordered.map((command, scheduledOrder) => deepFreeze({
    ...command, scheduledOrder, timeoutAt: clock + command.timeout,
    ...(policy.strategy === "Delayed" && command.retryCount < policy.maximumRetries ? { retryAt: clock + policy.delayMs } : {}),
    rollbackEligible: true,
  }));
  return deepFreeze({
    executionId: options.executionId ?? `execution:${queue.revision}`,
    mode: options.mode ?? "Atomic", revision: queue.revision, commands,
    rollbackPlan: planRuntimeRollback(commands), warnings: [],
  });
}

export function planRuntimeRollback(commands: readonly (NexoraDirectorRuntimeExecutionCommand | NexoraDirectorRuntimeScheduledCommand)[], reason = "Atomic execution failure"): NexoraDirectorRuntimeRollbackPlan {
  const rollback = [...commands].reverse().map((command, order) => deepFreeze({
    commandId: `rollback:${command.commandId}`, sourceCommandId: command.commandId,
    runtimeCommandType: command.runtimeCommandType, order, reason,
  }));
  return deepFreeze({ required: rollback.length > 0, commands: rollback });
}

export function retryRuntimeCommand(command: NexoraDirectorRuntimeExecutionCommand, policy: NexoraDirectorRuntimeRetryPolicy): NexoraDirectorRuntimeExecutionCommand {
  validateRetryPolicy(policy);
  if (policy.strategy === "Disabled" || command.retryCount >= policy.maximumRetries) throw new Error(`Retry unavailable for command ${command.commandId}`);
  return deepFreeze({ ...frozenClone(command), retryCount: command.retryCount + 1,
    metadata: deepFreeze({ ...frozenClone(command.metadata), retryStrategy: policy.strategy, retryDelayMs: policy.strategy === "Delayed" ? policy.delayMs : 0 }),
  });
}

export function cancelRuntimeCommand(command: NexoraDirectorRuntimeExecutionCommand, state: NexoraDirectorRuntimeExecutionState = "Running"): NexoraDirectorRuntimeExecutionRecord {
  transitionRuntimeExecutionState(state, "Cancelled");
  return deepFreeze({ commandId: command.commandId, state: "Cancelled", attempt: command.retryCount + 1, durationMs: 0 });
}

function validateRetryPolicy(policy: NexoraDirectorRuntimeRetryPolicy): void {
  if (!(["Immediate", "Delayed", "Disabled"] as const).includes(policy.strategy) || !Number.isInteger(policy.maximumRetries) || policy.maximumRetries < 0 || policy.delayMs < 0) throw new Error("Invalid runtime retry policy");
}

export function executeRuntimeCommandBatch(queue: NexoraDirectorRuntimeExecutionQueue, options: NexoraDirectorRuntimeBatchOptions): NexoraDirectorRuntimeExecutionReport {
  const schedule = scheduleRuntimeExecution(queue, options);
  const outcomes = new Map((options.outcomes ?? []).map((outcome) => [outcome.commandId, outcome]));
  const completed: NexoraDirectorRuntimeExecutionRecord[] = [];
  const failed: NexoraDirectorRuntimeExecutionRecord[] = [];
  let retries = 0;
  for (const command of schedule.commands) {
    const outcome = outcomes.get(command.commandId) ?? { commandId: command.commandId, succeeded: true };
    const base = { commandId: command.commandId, attempt: command.retryCount + 1, durationMs: outcome.durationMs ?? 0,
      ...(options.now ? { startedAt: options.now, completedAt: options.now } : {}) };
    if (outcome.succeeded) completed.push(deepFreeze({ ...base, state: "Completed" as const }));
    else {
      const policy = options.retryPolicy ?? DEFAULT_RETRY_POLICY;
      if (policy.strategy !== "Disabled" && command.retryCount < policy.maximumRetries) retries += 1;
      failed.push(deepFreeze({ ...base, state: outcome.cancelled ? "Cancelled" as const : "Failed" as const, ...(outcome.error ? { error: outcome.error } : {}) }));
      if (options.mode === "Atomic") break;
    }
  }
  const atomicFailure = options.mode === "Atomic" && failed.length > 0;
  const rollbackPlan = atomicFailure ? planRuntimeRollback(schedule.commands.slice(0, completed.length), "Atomic execution failure") : deepFreeze({ required: false, commands: [] });
  const executionDuration = [...completed, ...failed].reduce((sum, item) => sum + item.durationMs, 0);
  const report: NexoraDirectorRuntimeExecutionReport = deepFreeze({
    schemaVersion: runtimeCommandExecutionModelSchemaVersion,
    executionId: options.executionId, accepted: failed.length === 0,
    state: failed.length ? "Failed" : "Completed", revision: queue.revision,
    completedCommands: completed, failedCommands: failed, rollbackPlan,
    diagnostics: deepFreeze({ queueLength: queue.commands.length, completed: completed.length,
      failed: failed.length, retries, rollbackCount: rollbackPlan.commands.length, executionDuration }),
    warnings: options.mode === "Simulation" ? ["Simulation produced projected execution state only"] : [],
    errors: failed.flatMap((item) => item.error ? [item.error] : []),
  });
  return report;
}

export function createRuntimeExecutionSnapshot(report: NexoraDirectorRuntimeExecutionReport, queue: NexoraDirectorRuntimeExecutionQueue): NexoraDirectorRuntimeExecutionSnapshot {
  return deepFreeze({ schemaVersion: runtimeCommandExecutionModelSchemaVersion,
    executionId: report.executionId, revision: report.revision, state: report.state,
    queue: frozenClone(queue), completedCommands: frozenClone(report.completedCommands), rollbackPlan: frozenClone(report.rollbackPlan) });
}
export function projectRuntimeExecution(report: NexoraDirectorRuntimeExecutionReport): NexoraDirectorRuntimeExecutionProjection {
  return deepFreeze({ executionId: report.executionId, state: report.state, revision: report.revision,
    completedCount: report.completedCommands.length, failedCount: report.failedCommands.length,
    rollbackRequired: report.rollbackPlan.required });
}
export function compareRuntimeExecutionSnapshots(left: NexoraDirectorRuntimeExecutionSnapshot, right: NexoraDirectorRuntimeExecutionSnapshot): NexoraDirectorRuntimeExecutionSnapshotComparison {
  const queueChanged = stable(left.queue) !== stable(right.queue);
  const revisionChanged = left.revision !== right.revision;
  const stateChanged = left.state !== right.state;
  const completedCommandsChanged = stable(left.completedCommands) !== stable(right.completedCommands);
  const rollbackStateChanged = stable(left.rollbackPlan) !== stable(right.rollbackPlan);
  return deepFreeze({ equal: !queueChanged && !revisionChanged && !stateChanged && !completedCommandsChanged && !rollbackStateChanged,
    queueChanged, revisionChanged, stateChanged, completedCommandsChanged, rollbackStateChanged,
    revisionDelta: right.revision - left.revision });
}

function validateCommand(command: unknown): string[] {
  if (!record(command)) return ["Execution command must be an object"];
  const errors: string[] = [];
  if (typeof command.commandId !== "string" || !command.commandId) errors.push("commandId is required");
  if (typeof command.runtimeCommandType !== "string") errors.push("runtimeCommandType is required");
  for (const key of ["revision", "order", "priority", "retryCount", "timeout"] as const) if (!Number.isInteger(command[key]) || Number(command[key]) < 0) errors.push(`${key} must be a non-negative integer`);
  if (!Array.isArray(command.dependencies)) errors.push("dependencies must be an array");
  if (rendererObject(command)) errors.push("Renderer objects are forbidden");
  return errors;
}
export function validateExecutionQueue(queue: unknown): NexoraDirectorRuntimeExecutionValidationResult {
  if (!record(queue)) return validResult(["Execution queue must be an object"]);
  const errors: string[] = [];
  if (queue.schemaVersion !== runtimeCommandExecutionModelSchemaVersion) errors.push("Unsupported execution queue schema");
  if (!Array.isArray(queue.commands)) errors.push("Queue commands must be an array");
  else {
    queue.commands.forEach((command) => errors.push(...validateCommand(command)));
    const ids = queue.commands.map((item) => record(item) ? item.commandId : undefined);
    if (new Set(ids).size !== ids.length) errors.push("Execution command IDs must be unique");
    const sorted = [...queue.commands].sort((a, b) => compareCommands(a as unknown as NexoraDirectorRuntimeExecutionCommand, b as unknown as NexoraDirectorRuntimeExecutionCommand));
    if (stable(sorted) !== stable(queue.commands)) errors.push("Execution queue ordering is not deterministic");
  }
  if (rendererObject(queue)) errors.push("Renderer objects are forbidden");
  if (!deeplyFrozen(queue)) errors.push("Execution queue must be deeply immutable");
  return validResult(errors);
}
export function validateExecutionReport(report: unknown): NexoraDirectorRuntimeExecutionValidationResult {
  if (!record(report)) return validResult(["Execution report must be an object"]);
  const errors: string[] = [];
  if (report.schemaVersion !== runtimeCommandExecutionModelSchemaVersion) errors.push("Unsupported execution report schema");
  if (typeof report.executionId !== "string" || !report.executionId) errors.push("executionId is required");
  if (!STATES.includes(report.state as NexoraDirectorRuntimeExecutionState)) errors.push("Execution state is invalid");
  if (!Array.isArray(report.completedCommands) || !Array.isArray(report.failedCommands)) errors.push("Execution records are invalid");
  if (rendererObject(report)) errors.push("Renderer objects are forbidden");
  if (!deeplyFrozen(report)) errors.push("Execution report must be deeply immutable");
  return validResult(errors);
}
export function validateRuntimeExecutionModel(value: unknown): NexoraDirectorRuntimeExecutionValidationResult {
  if (record(value) && "commands" in value && "schemaVersion" in value && !("executionId" in value)) return validateExecutionQueue(value);
  if (record(value) && "executionId" in value && "diagnostics" in value) return validateExecutionReport(value);
  return validResult(["Unknown runtime execution model artifact"]);
}
export function assertRuntimeExecutionInvariants(value: unknown): void {
  const validation = validateRuntimeExecutionModel(value);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
}

type Kind = "Queue" | "Report" | "Snapshot";
function serialize(kind: Kind, payload: unknown): string {
  if (rendererObject(payload)) throw new Error("Renderer objects are forbidden");
  return JSON.stringify({ identity: runtimeCommandExecutionModelIdentity, schemaVersion: runtimeCommandExecutionModelSchemaVersion, kind, payload });
}
function deserialize<T>(json: string, kind: Kind): T {
  const parsed: unknown = JSON.parse(json);
  if (!record(parsed) || parsed.identity !== runtimeCommandExecutionModelIdentity || parsed.schemaVersion !== runtimeCommandExecutionModelSchemaVersion || parsed.kind !== kind) throw new Error("Unsupported or invalid runtime execution serialization envelope");
  if (rendererObject(parsed.payload)) throw new Error("Renderer objects are forbidden");
  return deepFreeze(parsed.payload as T);
}
export const serializeRuntimeExecutionQueue = (value: NexoraDirectorRuntimeExecutionQueue): string => serialize("Queue", value);
export const deserializeRuntimeExecutionQueue = (json: string): NexoraDirectorRuntimeExecutionQueue => {
  const value = deserialize<NexoraDirectorRuntimeExecutionQueue>(json, "Queue"); const validation = validateExecutionQueue(value); if (!validation.valid) throw new Error(validation.errors.join("; ")); return value;
};
export const serializeRuntimeExecutionReport = (value: NexoraDirectorRuntimeExecutionReport): string => serialize("Report", value);
export const deserializeRuntimeExecutionReport = (json: string): NexoraDirectorRuntimeExecutionReport => {
  const value = deserialize<NexoraDirectorRuntimeExecutionReport>(json, "Report"); const validation = validateExecutionReport(value); if (!validation.valid) throw new Error(validation.errors.join("; ")); return value;
};
export const serializeRuntimeExecutionSnapshot = (value: NexoraDirectorRuntimeExecutionSnapshot): string => serialize("Snapshot", value);
export const deserializeRuntimeExecutionSnapshot = (json: string): NexoraDirectorRuntimeExecutionSnapshot => {
  const value = deserialize<NexoraDirectorRuntimeExecutionSnapshot>(json, "Snapshot"); if (value.schemaVersion !== runtimeCommandExecutionModelSchemaVersion) throw new Error("Unsupported execution snapshot schema"); return value;
};
