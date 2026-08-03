/**
 * EXS-6 — Mock Executive Execution dataset.
 * Visual plan/task states only. No runtime / workflow / task engine.
 */

export type TaskStatus =
  | "Not Started"
  | "Ready"
  | "In Progress"
  | "Blocked"
  | "Waiting"
  | "Completed"
  | "Cancelled";

export type TaskHealth = "Healthy" | "Warning" | "Blocked" | "Completed";

export type TaskProgress = 0 | 25 | 50 | 75 | 100;

export type ExecutionRunStatus =
  | "Idle"
  | "Running"
  | "Paused"
  | "Completed"
  | "Cancelled";

export type ExecutionFilter =
  | "All"
  | "Blocked"
  | "In Progress"
  | "Completed"
  | "My Tasks";

export type ExecutionTask = {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly status: TaskStatus;
  readonly progress: TaskProgress;
  readonly health: TaskHealth;
  readonly dependsOn: readonly string[];
};

export type ExecutionPlan = {
  readonly id: string;
  readonly name: string;
  readonly decisionId: string;
  readonly decisionName: string;
  readonly owner: string;
  readonly status: ExecutionRunStatus;
  readonly summary: string;
  readonly tasks: readonly ExecutionTask[];
};

export type ExecutionJournalEntry = {
  readonly id: string;
  readonly planId: string;
  readonly planName: string;
  readonly decisionReference: string;
  readonly owner: string;
  readonly executionStatus: ExecutionRunStatus;
  readonly summary: string;
  readonly startedDate: string;
};

export type ExecutionTimelinePack = {
  readonly id: string;
  readonly title: string;
  readonly planId: string;
  readonly risk: "warning" | "risk" | "success";
};

export const EXECUTION_TRANSITION_MS = 250;

export const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  "Not Started": "#98A2B3",
  Ready: "#53B1FD",
  "In Progress": "#1570EF",
  Blocked: "#F04438",
  Waiting: "#FDB022",
  Completed: "#12B76A",
  Cancelled: "#667085",
};

export const TASK_HEALTH_COLOR: Record<TaskHealth, string> = {
  Healthy: "#12B76A",
  Warning: "#FDB022",
  Blocked: "#F04438",
  Completed: "#12B76A",
};

const initialExecutionTasks = [
  {
    id: "task-approve-budget",
    name: "Approve Budget",
    owner: "Finance",
    status: "Completed",
    progress: 100,
    health: "Completed",
    dependsOn: [],
  },
  {
    id: "task-purchase-equipment",
    name: "Purchase Equipment",
    owner: "Procurement",
    status: "In Progress",
    progress: 50,
    health: "Warning",
    dependsOn: ["task-approve-budget"],
  },
  {
    id: "task-install-equipment",
    name: "Install Equipment",
    owner: "Operations",
    status: "Blocked",
    progress: 25,
    health: "Blocked",
    dependsOn: ["task-purchase-equipment"],
  },
  {
    id: "task-train-team",
    name: "Train Team",
    owner: "Operations",
    status: "Waiting",
    progress: 0,
    health: "Warning",
    dependsOn: ["task-install-equipment"],
  },
  {
    id: "task-production-start",
    name: "Production Start",
    owner: "Factory",
    status: "Not Started",
    progress: 0,
    health: "Healthy",
    dependsOn: ["task-train-team"],
  },
] as const satisfies readonly ExecutionTask[];

const initialExecutionPlan = {
  id: "plan-capacity-expansion",
  name: "Capacity Expansion",
  decisionId: "decision-a",
  decisionName: "Increase Capacity",
  owner: "COO · Nova",
  status: "Idle",
  summary:
    "Execute Increase Capacity through budget, equipment, install, training, and production start.",
  tasks: initialExecutionTasks,
} as const satisfies ExecutionPlan;

export const INITIAL_EXECUTION_PLAN = Object.freeze(initialExecutionPlan);

export function overallProgress(tasks: readonly ExecutionTask[]): number {
  if (tasks.length === 0) return 0;
  const sum = tasks.reduce((acc, t) => acc + t.progress, 0);
  return Math.round(sum / tasks.length);
}

export function blockedTasks(tasks: readonly ExecutionTask[]): ExecutionTask[] {
  return tasks.filter((t) => t.status === "Blocked" || t.health === "Blocked");
}

export function filterTasks(
  tasks: readonly ExecutionTask[],
  filter: ExecutionFilter,
  myOwner = "Operations",
): ExecutionTask[] {
  switch (filter) {
    case "Blocked":
      return tasks.filter((t) => t.status === "Blocked");
    case "In Progress":
      return tasks.filter((t) => t.status === "In Progress");
    case "Completed":
      return tasks.filter((t) => t.status === "Completed");
    case "My Tasks":
      return tasks.filter((t) => t.owner === myOwner);
    default:
      return [...tasks];
  }
}

export function toExecutionJournalEntry(
  plan: ExecutionPlan,
): ExecutionJournalEntry {
  return {
    id: `journal-exec-${plan.id}`,
    planId: plan.id,
    planName: plan.name,
    decisionReference: plan.decisionName,
    owner: plan.owner,
    executionStatus: plan.status,
    summary: `Execution Started · ${plan.name} · ${plan.decisionName}`,
    startedDate: new Date().toISOString().slice(0, 10),
  };
}

export function toExecutionTimelinePack(
  plan: ExecutionPlan,
): ExecutionTimelinePack {
  return {
    id: `pack-execution-${plan.id}`,
    title: `Execution · ${plan.name}`,
    planId: plan.id,
    risk:
      plan.status === "Completed"
        ? "success"
        : plan.status === "Cancelled"
          ? "risk"
          : "warning",
  };
}
