"use client";

import type { ExecutiveFloatingPanelKind } from "../shell/executiveCockpitTypes";
import { ExecutiveExecutionWorkspace } from "./ExecutiveExecutionWorkspace";
import { ExecutionOverlay } from "./ExecutionOverlay";
import { ExecutionTaskGraph } from "./ExecutionTaskGraph";
import { useExecutiveExecution } from "./hooks/useExecutiveExecution";

type Props = {
  readonly onOpenPanel: (
    kind: Extract<
      ExecutiveFloatingPanelKind,
      | "execution-new-task"
      | "execution-assign-owner"
      | "execution-change-status"
      | "execution-notes"
    >,
  ) => void;
};

/**
 * ExecutiveExecutionExperienceLayer — Stage chrome for Execution mode only.
 */
export function ExecutiveExecutionExperienceLayer({ onOpenPanel }: Props) {
  const { isActive } = useExecutiveExecution();
  if (!isActive) return null;

  return (
    <div
      data-testid="executive-execution-experience-layer"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 7,
        pointerEvents: "none",
      }}
    >
      <ExecutionOverlay />
      <div style={{ pointerEvents: "auto" }}>
        <ExecutionTaskGraph />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <ExecutiveExecutionWorkspace onOpenPanel={onOpenPanel} />
      </div>
    </div>
  );
}
