"use client";

import { createContext, useMemo, type ReactNode } from "react";
import { useRuntimeDecision } from "../runtime";
import type {
  DecisionJournalEntry,
  DecisionStatus,
  DecisionTimelinePack,
  ExecutiveDecision,
} from "./ExecutiveDecisionConfig";

export type ExecutiveDecisionContextValue = {
  readonly decisions: readonly ExecutiveDecision[];
  readonly currentDecisionId: string | null;
  readonly currentDecision: ExecutiveDecision | null;
  readonly journalEntries: readonly DecisionJournalEntry[];
  readonly decisionPacks: readonly DecisionTimelinePack[];
  readonly previewOpen: boolean;
  readonly panelCollapsed: boolean;
  readonly panelWidth: number;
  readonly setCurrentDecision: (id: string) => void;
  readonly setPreviewOpen: (open: boolean) => void;
  readonly setPanelCollapsed: (collapsed: boolean) => void;
  readonly setPanelWidth: (width: number) => void;
  readonly setStatus: (id: string, status: DecisionStatus) => void;
  readonly approve: (id: string) => void;
  readonly reject: (id: string) => void;
  readonly returnForAnalysis: (id: string) => void;
  readonly duplicate: (id: string) => void;
  readonly combineFromScenarios: (
    scenarioIds: readonly string[],
    label: string,
  ) => void;
  readonly createFromScenario: (scenarioId: string, label: string) => void;
  readonly createManual: (name: string) => void;
  readonly archive: (id: string) => void;
};

export const ExecutiveDecisionContext =
  createContext<ExecutiveDecisionContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

/**
 * ExecutiveDecisionProvider — Runtime-backed decision commitment state.
 */
export function ExecutiveDecisionProvider({ children }: Props) {
  const runtime = useRuntimeDecision();
  const value = useMemo(() => runtime, [runtime]);

  return (
    <ExecutiveDecisionContext.Provider value={value}>
      {children}
    </ExecutiveDecisionContext.Provider>
  );
}
