"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_EXECUTION_PLAN,
  toExecutionJournalEntry,
  toExecutionTimelinePack,
  type ExecutionFilter,
  type ExecutionJournalEntry,
  type ExecutionPlan,
  type ExecutionRunStatus,
  type ExecutionTask,
  type ExecutionTimelinePack,
  type TaskStatus,
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
 * ExecutiveExecutionProvider — pure UI execution plan state.
 * Never touches Runtime, AI, workflow engines, or timeline lens.
 */
export function ExecutiveExecutionProvider({ children }: Props) {
  const [plan, setPlan] = useState<ExecutionPlan>(() => ({
    ...INITIAL_EXECUTION_PLAN,
    tasks: INITIAL_EXECUTION_PLAN.tasks.map((t) => ({
      ...t,
      dependsOn: [...t.dependsOn],
    })),
  }));
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    "task-install-equipment",
  );
  const [filter, setFilter] = useState<ExecutionFilter>("All");
  const [journalEntries, setJournalEntries] = useState<
    ExecutionJournalEntry[]
  >([]);
  const [executionPacks, setExecutionPacks] = useState<
    ExecutionTimelinePack[]
  >([]);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320);
  const [started, setStarted] = useState(false);
  const [notes, setNotes] = useState(
    "Focus blocked install path before training can begin.",
  );

  const selectedTask =
    plan.tasks.find((t) => t.id === selectedTaskId) ?? null;

  const setSelectedTask = useCallback((id: string | null) => {
    setSelectedTaskId(id);
  }, []);

  const setPlanStatus = useCallback((status: ExecutionRunStatus) => {
    setPlan((prev) => ({ ...prev, status }));
  }, []);

  const startExecution = useCallback(() => {
    setPlan((prev) => {
      const next: ExecutionPlan = {
        ...prev,
        status: "Running",
      };
      const journal = toExecutionJournalEntry(next);
      const pack = toExecutionTimelinePack(next);
      setJournalEntries((entries) => {
        if (entries.some((e) => e.planId === next.id)) {
          return entries.map((e) =>
            e.planId === next.id ? { ...journal, id: e.id } : e,
          );
        }
        return [...entries, journal];
      });
      setExecutionPacks((packs) => {
        if (packs.some((p) => p.planId === next.id)) {
          return packs.map((p) => (p.planId === next.id ? pack : p));
        }
        return [...packs, pack];
      });
      return next;
    });
    setStarted(true);
  }, []);

  const pauseExecution = useCallback(() => {
    setPlanStatus("Paused");
  }, [setPlanStatus]);

  const resumeExecution = useCallback(() => {
    setPlanStatus("Running");
  }, [setPlanStatus]);

  const completeExecution = useCallback(() => {
    setPlan((prev) => ({
      ...prev,
      status: "Completed",
      tasks: prev.tasks.map((t) =>
        t.status === "Cancelled"
          ? t
          : {
              ...t,
              status: "Completed" as const,
              progress: 100 as const,
              health: "Completed" as const,
            },
      ),
    }));
  }, []);

  const cancelExecution = useCallback(() => {
    setPlanStatus("Cancelled");
  }, [setPlanStatus]);

  const setTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setPlan((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const health =
          status === "Blocked"
            ? ("Blocked" as const)
            : status === "Completed"
              ? ("Completed" as const)
              : status === "Waiting" || status === "In Progress"
                ? ("Warning" as const)
                : ("Healthy" as const);
        const progress =
          status === "Completed"
            ? (100 as const)
            : status === "Not Started"
              ? (0 as const)
              : t.progress;
        return { ...t, status, health, progress };
      }),
    }));
  }, []);

  const assignOwner = useCallback((taskId: string, owner: string) => {
    setPlan((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, owner: owner.trim() || t.owner } : t,
      ),
    }));
  }, []);

  const addTask = useCallback((name: string, owner: string) => {
    setPlan((prev) => {
      const last = prev.tasks[prev.tasks.length - 1];
      const next: ExecutionTask = {
        id: `task-${Date.now().toString(36)}`,
        name: name.trim() || "New Task",
        owner: owner.trim() || "Operations",
        status: "Not Started",
        progress: 0,
        health: "Healthy",
        dependsOn: last ? [last.id] : [],
      };
      return { ...prev, tasks: [...prev.tasks, next] };
    });
  }, []);

  const value = useMemo(
    () => ({
      plan,
      tasks: plan.tasks,
      selectedTaskId,
      selectedTask,
      filter,
      journalEntries,
      executionPacks,
      panelCollapsed,
      panelWidth,
      started,
      setSelectedTask,
      setFilter,
      setPanelCollapsed,
      setPanelWidth,
      startExecution,
      pauseExecution,
      resumeExecution,
      completeExecution,
      cancelExecution,
      setTaskStatus,
      assignOwner,
      addTask,
      notes,
      setNotes,
    }),
    [
      plan,
      selectedTaskId,
      selectedTask,
      filter,
      journalEntries,
      executionPacks,
      panelCollapsed,
      panelWidth,
      started,
      setSelectedTask,
      startExecution,
      pauseExecution,
      resumeExecution,
      completeExecution,
      cancelExecution,
      setTaskStatus,
      assignOwner,
      addTask,
      notes,
    ],
  );

  return (
    <ExecutiveExecutionContext.Provider value={value}>
      {children}
    </ExecutiveExecutionContext.Provider>
  );
}
