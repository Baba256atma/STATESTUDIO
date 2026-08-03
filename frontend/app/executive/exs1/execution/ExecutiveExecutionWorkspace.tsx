"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { ExecutionDependencyPath } from "./ExecutionDependencyPath";
import { ExecutionFilterBar } from "./ExecutionFilterBar";
import { ExecutionPlanCard } from "./ExecutionPlanCard";
import { ExecutionTaskCard } from "./ExecutionTaskCard";
import { ExecutionToolbar } from "./ExecutionToolbar";
import { blockedTasks, overallProgress } from "./ExecutionConfig";
import { useExecutiveExecution } from "./hooks/useExecutiveExecution";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onOpenPanel: (
    kind:
      | "execution-new-task"
      | "execution-assign-owner"
      | "execution-change-status"
      | "execution-notes",
  ) => void;
};

/**
 * ExecutiveExecutionWorkspace — floating Execution Plan / Tasks / Progress / Health.
 */
export function ExecutiveExecutionWorkspace({ onOpenPanel }: Props) {
  const {
    isActive,
    plan,
    visibleTasks,
    selectedTaskId,
    setSelectedTask,
    panelCollapsed,
    panelWidth,
    setPanelCollapsed,
    setPanelWidth,
  } = useExecutiveExecution();

  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragRef.current = { startX: event.clientX, startWidth: panelWidth };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [panelWidth],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const delta = event.clientX - dragRef.current.startX;
      setPanelWidth(
        Math.min(440, Math.max(270, dragRef.current.startWidth + delta)),
      );
    },
    [setPanelWidth],
  );

  if (!isActive) return null;

  const progress = overallProgress(plan.tasks);
  const blocked = blockedTasks(plan.tasks);

  return (
    <aside
      data-testid="executive-execution-workspace"
      aria-label="Executive Execution Workspace"
      style={{
        position: "absolute",
        top: "3.5rem",
        left: "1rem",
        width: panelCollapsed ? "2.75rem" : panelWidth,
        maxHeight: "calc(100% - 5rem)",
        zIndex: 8,
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.55rem",
        border: "1px solid rgba(18, 183, 106, 0.45)",
        background: "rgba(10, 14, 20, 0.92)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        overflow: "hidden",
        transition: "width 250ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.4rem",
          padding: "0.55rem 0.65rem",
          borderBottom: `1px solid ${cockpit.border}`,
        }}
      >
        {!panelCollapsed ? (
          <strong
            data-testid="executive-execution-workspace-title"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Execution Workspace
          </strong>
        ) : (
          <span style={{ color: "#12B76A", fontSize: "0.7rem" }}>Ex</span>
        )}
        <button
          type="button"
          data-testid="executive-execution-workspace-collapse"
          aria-expanded={!panelCollapsed}
          onClick={() => setPanelCollapsed(!panelCollapsed)}
          style={{
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            borderRadius: "0.3rem",
            width: "1.6rem",
            height: "1.6rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {panelCollapsed ? "›" : "‹"}
        </button>
      </div>

      {!panelCollapsed ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            padding: "0.65rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem",
          }}
        >
          <section>
            <p style={labelStyle}>Execution Plan</p>
            <div style={{ marginTop: "0.35rem" }}>
              <ExecutionPlanCard plan={plan} />
            </div>
          </section>

          <section>
            <p style={labelStyle}>Execution Progress</p>
            <p
              data-testid="execution-progress-summary"
              style={{
                margin: "0.3rem 0 0",
                fontSize: "0.82rem",
                color: "#12B76A",
                fontWeight: 600,
              }}
            >
              {progress}% overall
            </p>
          </section>

          <section>
            <p style={labelStyle}>Execution Health</p>
            <p
              data-testid="execution-health-summary"
              style={{
                margin: "0.3rem 0 0",
                fontSize: "0.74rem",
                color: blocked.length ? "#F04438" : "#12B76A",
              }}
            >
              {blocked.length
                ? `${blocked.length} blocked · attention required`
                : "Healthy path · no blockers"}
            </p>
          </section>

          <ExecutionToolbar />
          <ExecutionFilterBar />

          <section>
            <p style={labelStyle}>Dependencies</p>
            <div style={{ marginTop: "0.35rem" }}>
              <ExecutionDependencyPath tasks={plan.tasks} />
            </div>
          </section>

          <section
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            <p style={labelStyle}>Execution Tasks</p>
            {visibleTasks.map((task) => (
              <ExecutionTaskCard
                key={task.id}
                task={task}
                selected={task.id === selectedTaskId}
                onSelect={() => setSelectedTask(task.id)}
              />
            ))}
          </section>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
            <MiniAction
              testId="execution-open-new-task"
              label="New Task"
              onClick={() => onOpenPanel("execution-new-task")}
            />
            <MiniAction
              testId="execution-open-assign"
              label="Assign Owner"
              onClick={() => onOpenPanel("execution-assign-owner")}
            />
            <MiniAction
              testId="execution-open-status"
              label="Change Status"
              onClick={() => onOpenPanel("execution-change-status")}
            />
            <MiniAction
              testId="execution-open-notes"
              label="Execution Notes"
              onClick={() => onOpenPanel("execution-notes")}
            />
          </div>
        </div>
      ) : null}

      {!panelCollapsed ? (
        <div
          role="separator"
          aria-orientation="vertical"
          data-testid="executive-execution-workspace-resize"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "4px",
            height: "100%",
            cursor: "col-resize",
          }}
        />
      ) : null}
    </aside>
  );
}

function MiniAction({
  testId,
  label,
  onClick,
}: {
  readonly testId: string;
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      style={{
        padding: "0.28rem 0.45rem",
        borderRadius: "999px",
        border: `1px solid ${cockpit.border}`,
        background: "transparent",
        color: cockpit.accent,
        fontSize: "0.58rem",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

const labelStyle = {
  margin: 0,
  fontSize: "0.56rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: cockpit.lowMuted,
};
