"use client";

import { createContext, useMemo, type ReactNode } from "react";
import { useRuntimeExecution } from "../runtime";
import type {
  ExecutionFilter,
  ExecutionJournalEntry,
  ExecutionPlan,
  ExecutionTask,
  ExecutionTimelinePack,
  TaskStatus,
} from "./ExecutionConfig";

export type ExecutiveExecutionContextValue = {
  readonly plan: ExecutionPlan;
  readonly tasks: readonly ExecutionTask[];
  readonly selectedTaskId: string | null;
  readonly selectedTask: ExecutionTask | null;
  readonly filter: ExecutionFilter;
  readonly journalEntries: readonly ExecutionJournalEntry[];
  readonly executionPacks: readonly ExecutionTimelinePack[];
  readonly panelCollapsed: boolean;
  readonly panelWidth: number;
  readonly started: boolean;
  readonly setSelectedTask: (id: string | null) => void;
  readonly setFilter: (filter: ExecutionFilter) => void;
  readonly setPanelCollapsed: (collapsed: boolean) => void;
  readonly setPanelWidth: (width: number) => void;
  readonly startExecution: () => void;
  readonly pauseExecution: () => void;
  readonly resumeExecution: () => void;
  readonly completeExecution: () => void;
  readonly cancelExecution: () => void;
  readonly setTaskStatus: (taskId: string, status: TaskStatus) => void;
  readonly assignOwner: (taskId: string, owner: string) => void;
  readonly addTask: (name: string, owner: string) => void;
  readonly notes: string;
  readonly setNotes: (notes: string) => void;
};

export const ExecutiveExecutionContext =
  createContext<ExecutiveExecutionContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

/**
 * ExecutiveExecutionProvider — Runtime-backed execution plan state.
 */
export function ExecutiveExecutionProvider({ children }: Props) {
  const runtime = useRuntimeExecution();
  const value = useMemo(() => runtime, [runtime]);

  return (
    <ExecutiveExecutionContext.Provider value={value}>
      {children}
    </ExecutiveExecutionContext.Provider>
  );
}
