"use client";

import { TASK_HEALTH_COLOR, TASK_STATUS_COLOR } from "./ExecutionConfig";
import { ExecutionHealthBadge } from "./ExecutionHealthBadge";
import { ExecutionProgressRing } from "./ExecutionProgressRing";
import { useExecutiveExecution } from "./hooks/useExecutiveExecution";

/**
 * ExecutionTaskGraph — connected task objects on Stage.
 */
export function ExecutionTaskGraph() {
  const { isActive, visibleTasks, selectedTaskId, setSelectedTask, plan } =
    useExecutiveExecution();

  if (!isActive) return null;

  return (
    <div
      data-testid="execution-task-graph"
      data-plan={plan.id}
      style={{
        position: "absolute",
        left: "50%",
        top: "52%",
        transform: "translate(-50%, -50%)",
        width: "min(42rem, calc(100% - 2rem))",
        zIndex: 5,
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.35rem",
      }}
    >
      <div
        data-testid="execution-plan-object"
        style={{
          padding: "0.45rem 0.85rem",
          borderRadius: "0.5rem",
          border: "1.5px solid #12B76A",
          background: "linear-gradient(165deg, rgba(18,183,106,0.28), rgba(12,16,24,0.95))",
          boxShadow: "0 0 28px rgba(18,183,106,0.28)",
          color: "#E8EEF6",
          textAlign: "center",
          minWidth: "11rem",
          transition: "box-shadow 250ms ease, transform 250ms ease",
        }}
      >
        <div
          style={{
            fontSize: "0.52rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#98A2B3",
          }}
        >
          Decision → Execution Plan
        </div>
        <div
          style={{
            marginTop: "0.2rem",
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "#12B76A",
          }}
        >
          {plan.name}
        </div>
        <div style={{ marginTop: "0.15rem", fontSize: "0.62rem", color: "#C5D0DE" }}>
          {plan.decisionName} · {plan.status}
        </div>
      </div>

      <div aria-hidden style={{ color: "#667085", fontSize: "0.85rem" }}>
        ↓
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.45rem",
          width: "100%",
        }}
      >
        {visibleTasks.map((task, index) => {
          const selected = task.id === selectedTaskId;
          const accent = TASK_STATUS_COLOR[task.status];
          const glow =
            task.health === "Blocked"
              ? TASK_HEALTH_COLOR.Blocked
              : task.status === "Completed"
                ? TASK_HEALTH_COLOR.Completed
                : accent;

          return (
            <div
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <button
                type="button"
                data-testid={`execution-task-object-${task.id}`}
                data-status={task.status}
                data-health={task.health}
                onClick={() => setSelectedTask(task.id)}
                style={{
                  width: "8.6rem",
                  padding: "0.55rem 0.5rem",
                  borderRadius: "0.5rem",
                  border: `1.25px solid ${glow}`,
                  background: selected
                    ? `linear-gradient(165deg, ${glow}40, rgba(12,16,24,0.96))`
                    : `linear-gradient(165deg, ${glow}22, rgba(12,16,24,0.92))`,
                  boxShadow: selected
                    ? `0 0 24px ${glow}44`
                    : `0 0 12px ${glow}22`,
                  color: "#E8EEF6",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "center",
                  transition:
                    "transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
                  transform: selected ? "scale(1.04)" : "scale(1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "0.3rem",
                  }}
                >
                  <ExecutionProgressRing
                    progress={task.progress}
                    color={glow}
                    size={32}
                  />
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: glow,
                    lineHeight: 1.25,
                  }}
                >
                  {task.name}
                </div>
                <div
                  style={{
                    marginTop: "0.2rem",
                    fontSize: "0.58rem",
                    color: "#98A2B3",
                  }}
                >
                  {task.owner}
                </div>
                <div
                  style={{
                    marginTop: "0.3rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ExecutionHealthBadge
                    health={task.health}
                    status={task.status}
                    compact
                  />
                </div>
              </button>
              {index < visibleTasks.length - 1 ? (
                <span
                  aria-hidden
                  data-testid={`execution-dependency-arrow-${task.id}`}
                  style={{
                    color: "#667085",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  →
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
