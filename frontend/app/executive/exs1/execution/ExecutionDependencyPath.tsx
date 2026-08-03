"use client";

import type { ExecutionTask } from "./ExecutionConfig";
import { TASK_STATUS_COLOR } from "./ExecutionConfig";

type Props = {
  readonly tasks: readonly ExecutionTask[];
};

/**
 * ExecutionDependencyPath — Task A → Task B → Task C arrows only.
 */
export function ExecutionDependencyPath({ tasks }: Props) {
  if (tasks.length === 0) return null;

  return (
    <div
      data-testid="execution-dependency-path"
      aria-label="Execution dependencies"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.25rem",
      }}
    >
      {tasks.map((task, index) => (
        <span
          key={task.id}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
        >
          <span
            data-testid={`execution-dependency-node-${task.id}`}
            style={{
              padding: "0.2rem 0.4rem",
              borderRadius: "0.3rem",
              border: `1px solid ${TASK_STATUS_COLOR[task.status]}66`,
              background: `${TASK_STATUS_COLOR[task.status]}14`,
              color: TASK_STATUS_COLOR[task.status],
              fontSize: "0.58rem",
              whiteSpace: "nowrap",
            }}
          >
            {task.name}
          </span>
          {index < tasks.length - 1 ? (
            <span
              aria-hidden
              style={{ color: "#667085", fontSize: "0.7rem" }}
            >
              ↓
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
