"use client";

import { useContext } from "react";
import { useExecutiveMode } from "../../mode/hooks/useExecutiveMode";
import { ExecutiveExecutionContext } from "../ExecutiveExecutionProvider";
import { blockedTasks, filterTasks, overallProgress } from "../ExecutionConfig";

/**
 * Executive Execution hook — active only when Executive Mode = Execution.
 */
export function useExecutiveExecution() {
  const ctx = useContext(ExecutiveExecutionContext);
  if (!ctx) {
    throw new Error(
      "useExecutiveExecution must be used within ExecutiveExecutionProvider",
    );
  }
  const { activeMode } = useExecutiveMode();
  const isActive = activeMode === "Execution";
  const visibleTasks = filterTasks(ctx.tasks, ctx.filter);
  const blocked = blockedTasks(ctx.tasks);
  const progress = overallProgress(ctx.tasks);

  return {
    ...ctx,
    isActive,
    activeMode,
    visibleTasks,
    blockedTasks: blocked,
    overallProgress: progress,
  };
}
