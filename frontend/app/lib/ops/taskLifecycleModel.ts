import { TaskIdentityModel } from "./taskIdentityModel.ts";
import type { TaskLifecycleState } from "./taskModelTypes.ts";

const metadata = TaskIdentityModel.metadata;

export const TaskLifecycleModel = Object.freeze([
  Object.freeze({
    id: "proposed",
    name: "Proposed",
    description: "Task exists as proposed metadata only.",
    terminal: false,
    metadata,
  } as const satisfies TaskLifecycleState),
  Object.freeze({
    id: "approved",
    name: "Approved",
    description: "Task metadata has been approved for downstream planning.",
    terminal: false,
    metadata,
  } as const satisfies TaskLifecycleState),
  Object.freeze({
    id: "ready",
    name: "Ready",
    description: "Task metadata indicates readiness for execution planning.",
    terminal: false,
    metadata,
  } as const satisfies TaskLifecycleState),
  Object.freeze({
    id: "blocked",
    name: "Blocked",
    description: "Task metadata indicates blocking conditions are present.",
    terminal: false,
    metadata,
  } as const satisfies TaskLifecycleState),
  Object.freeze({
    id: "in-progress",
    name: "In Progress",
    description: "Task metadata indicates active operational handling.",
    terminal: false,
    metadata,
  } as const satisfies TaskLifecycleState),
  Object.freeze({
    id: "under-review",
    name: "Under Review",
    description: "Task metadata indicates review is in progress.",
    terminal: false,
    metadata,
  } as const satisfies TaskLifecycleState),
  Object.freeze({
    id: "completed",
    name: "Completed",
    description: "Task metadata indicates completion has been recorded.",
    terminal: true,
    metadata,
  } as const satisfies TaskLifecycleState),
  Object.freeze({
    id: "cancelled",
    name: "Cancelled",
    description: "Task metadata indicates cancellation has been recorded.",
    terminal: true,
    metadata,
  } as const satisfies TaskLifecycleState),
] as const);
