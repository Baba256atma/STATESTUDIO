"use client";

import type { ExecutionTask } from "./ExecutionConfig";
import { TASK_STATUS_COLOR } from "./ExecutionConfig";
import { ExecutionHealthBadge } from "./ExecutionHealthBadge";
import { ExecutionProgressRing } from "./ExecutionProgressRing";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly task: ExecutionTask;
  readonly selected?: boolean;
  readonly onSelect?: () => void;
};

/**
 * ExecutionTaskCard — owner, status, progress, health.
 */
export function ExecutionTaskCard({
  task,
  selected = false,
  onSelect,
}: Props) {
  const accent = TASK_STATUS_COLOR[task.status];

  return (
    <button
      type="button"
      data-testid={`execution-task-card-${task.id}`}
      data-status={task.status}
      data-health={task.health}
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "0.55rem 0.6rem",
        borderRadius: "0.45rem",
        border: selected
          ? `1px solid ${accent}`
          : `1px solid ${cockpit.border}`,
        background: selected ? `${accent}14` : cockpit.panelSoft,
        color: cockpit.text,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        gap: "0.55rem",
        alignItems: "center",
        transition: "border-color 250ms ease, background 250ms ease",
      }}
    >
      <ExecutionProgressRing
        progress={task.progress}
        color={accent}
        size={34}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.35rem",
            alignItems: "center",
          }}
        >
          <strong
            style={{
              fontSize: "0.78rem",
              color: cockpit.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.name}
          </strong>
          <ExecutionHealthBadge health={task.health} compact />
        </div>
        <p
          style={{
            margin: "0.2rem 0 0",
            fontSize: "0.66rem",
            color: cockpit.muted,
          }}
        >
          {task.owner} · {task.status}
        </p>
      </div>
    </button>
  );
}
