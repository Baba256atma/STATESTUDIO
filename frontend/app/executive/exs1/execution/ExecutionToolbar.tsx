"use client";

import { useExecutiveExecution } from "./hooks/useExecutiveExecution";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ExecutionToolbar — Start / Pause / Resume / Complete / Cancel (UI only).
 */
export function ExecutionToolbar() {
  const {
    plan,
    started,
    startExecution,
    pauseExecution,
    resumeExecution,
    completeExecution,
    cancelExecution,
  } = useExecutiveExecution();

  const running = plan.status === "Running";
  const paused = plan.status === "Paused";
  const terminal =
    plan.status === "Completed" || plan.status === "Cancelled";

  return (
    <div
      data-testid="execution-toolbar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.35rem",
      }}
    >
      <Action
        testId="execution-start"
        label="Start Execution"
        color="#12B76A"
        disabled={started || terminal}
        onClick={startExecution}
      />
      <Action
        testId="execution-pause"
        label="Pause"
        color="#FDB022"
        disabled={!running}
        onClick={pauseExecution}
      />
      <Action
        testId="execution-resume"
        label="Resume"
        color="#1570EF"
        disabled={!paused}
        onClick={resumeExecution}
      />
      <Action
        testId="execution-complete"
        label="Complete"
        color="#12B76A"
        disabled={terminal || (!started && plan.status === "Idle")}
        onClick={completeExecution}
      />
      <Action
        testId="execution-cancel"
        label="Cancel"
        color="#F04438"
        disabled={terminal}
        onClick={cancelExecution}
      />
    </div>
  );
}

function Action({
  testId,
  label,
  color,
  disabled,
  onClick,
}: {
  readonly testId: string;
  readonly label: string;
  readonly color: string;
  readonly disabled?: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: "0.35rem 0.55rem",
        borderRadius: "0.35rem",
        border: `1px solid ${color}${disabled ? "44" : ""}`,
        background: disabled ? "transparent" : `${color}22`,
        color: disabled ? cockpit.lowMuted : color,
        fontSize: "0.66rem",
        fontWeight: 550,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        opacity: disabled ? 0.55 : 1,
        transition: "background 250ms ease, opacity 250ms ease",
      }}
    >
      {label}
    </button>
  );
}
