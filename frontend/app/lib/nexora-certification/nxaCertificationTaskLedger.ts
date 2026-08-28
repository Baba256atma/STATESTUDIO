/**
 * NXA:6-PREP — required/nonessential task accounting for certification.
 * Does not replace CI. Does not terminate unrelated processes.
 */

export const nxaCertificationTaskLedgerIdentity =
  "NXA:6-PREP/CertificationTaskLedger" as const;

export const NXA_TASK_STATUSES = Object.freeze([
  "PASSED",
  "FAILED",
  "CANCELLED",
  "BLOCKED",
  "NOT_RUN",
  "RUNNING",
] as const);

export type NxaTaskStatus = (typeof NXA_TASK_STATUSES)[number];

export type NxaCertificationTask = Readonly<{
  id: string;
  purpose: string;
  command: string;
  jobIdentity: string | null;
  required: boolean;
  startedAt: string | null;
  completedAt: string | null;
  durationMs: number | null;
  status: NxaTaskStatus;
  exitCode: number | null;
  artifact: string | null;
  inspected: boolean;
}>;

export type NxaCertificationLedger = Readonly<{
  identity: typeof nxaCertificationTaskLedgerIdentity;
  tasks: readonly NxaCertificationTask[];
}>;

export function emptyCertificationLedger(): NxaCertificationLedger {
  return Object.freeze({
    identity: nxaCertificationTaskLedgerIdentity,
    tasks: Object.freeze([]),
  });
}

export function recordTaskStart(
  ledger: NxaCertificationLedger,
  input: {
    readonly id: string;
    readonly purpose: string;
    readonly command: string;
    readonly required: boolean;
    readonly jobIdentity?: string | null;
    readonly startedAt?: string;
  },
): NxaCertificationLedger {
  if (ledger.tasks.some((task) => task.id === input.id && task.status === "RUNNING")) {
    return ledger;
  }
  const task: NxaCertificationTask = Object.freeze({
    id: input.id,
    purpose: input.purpose,
    command: input.command,
    jobIdentity: input.jobIdentity ?? null,
    required: input.required,
    startedAt: input.startedAt ?? new Date().toISOString(),
    completedAt: null,
    durationMs: null,
    status: "RUNNING",
    exitCode: null,
    artifact: null,
    inspected: false,
  });
  return Object.freeze({
    identity: ledger.identity,
    tasks: Object.freeze([...ledger.tasks.filter((item) => item.id !== input.id), task]),
  });
}

export function recordTaskCompletion(
  ledger: NxaCertificationLedger,
  input: {
    readonly id: string;
    readonly status: Exclude<NxaTaskStatus, "RUNNING">;
    readonly exitCode: number | null;
    readonly artifact?: string | null;
    readonly completedAt?: string;
  },
): NxaCertificationLedger {
  return Object.freeze({
    identity: ledger.identity,
    tasks: Object.freeze(
      ledger.tasks.map((task) => {
        if (task.id !== input.id) return task;
        const completedAt = input.completedAt ?? new Date().toISOString();
        const durationMs =
          task.startedAt != null
            ? Date.parse(completedAt) - Date.parse(task.startedAt)
            : null;
        return Object.freeze({
          ...task,
          status: input.status,
          exitCode: input.exitCode,
          artifact: input.artifact ?? task.artifact,
          completedAt,
          durationMs,
        });
      }),
    ),
  });
}

export function markTaskInspected(
  ledger: NxaCertificationLedger,
  id: string,
): NxaCertificationLedger {
  return Object.freeze({
    identity: ledger.identity,
    tasks: Object.freeze(
      ledger.tasks.map((task) =>
        task.id === id ? Object.freeze({ ...task, inspected: true }) : task,
      ),
    ),
  });
}

export type NxaCertificationBarrier = Readonly<{
  allowed: boolean;
  requiredStarted: number;
  requiredPassed: number;
  requiredFailed: number;
  requiredStillRunning: number;
  requiredUninspected: number;
  requiredNotRun: number;
  requiredCancelledOrBlocked: number;
  nonessentialStillRunning: number;
  blockers: readonly string[];
}>;

export function evaluateCertificationBarrier(
  ledger: NxaCertificationLedger,
): NxaCertificationBarrier {
  const required = ledger.tasks.filter((task) => task.required);
  const nonessential = ledger.tasks.filter((task) => !task.required);
  const blockers: string[] = [];
  const requiredStillRunning = required.filter((task) => task.status === "RUNNING").length;
  const requiredUninspected = required.filter(
    (task) => task.status !== "RUNNING" && !task.inspected,
  ).length;
  const requiredFailed = required.filter((task) => task.status === "FAILED").length;
  const requiredNotRun = required.filter((task) => task.status === "NOT_RUN").length;
  const requiredCancelledOrBlocked = required.filter(
    (task) => task.status === "CANCELLED" || task.status === "BLOCKED",
  ).length;
  if (requiredStillRunning) blockers.push("required-tasks-still-running");
  if (requiredUninspected) blockers.push("required-results-uninspected");
  if (requiredFailed) blockers.push("required-tasks-failed");
  if (requiredNotRun) blockers.push("required-tasks-not-run");
  if (requiredCancelledOrBlocked) blockers.push("required-tasks-cancelled-or-blocked");
  return Object.freeze({
    allowed: blockers.length === 0 && required.length > 0,
    requiredStarted: required.length,
    requiredPassed: required.filter((task) => task.status === "PASSED").length,
    requiredFailed,
    requiredStillRunning,
    requiredUninspected,
    requiredNotRun,
    requiredCancelledOrBlocked,
    nonessentialStillRunning: nonessential.filter((task) => task.status === "RUNNING").length,
    blockers: Object.freeze(blockers),
  });
}
