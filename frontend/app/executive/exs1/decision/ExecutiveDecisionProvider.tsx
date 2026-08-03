"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_DECISIONS,
  createDecisionFromScenarios,
  createManualDecision,
  toDecisionTimelinePack,
  toJournalEntry,
  type DecisionJournalEntry,
  type DecisionStatus,
  type DecisionTimelinePack,
  type ExecutiveDecision,
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
 * ExecutiveDecisionProvider — pure UI decision commitment state.
 * Never touches Runtime, AI, or timeline position (lens).
 */
export function ExecutiveDecisionProvider({ children }: Props) {
  const [decisions, setDecisions] = useState<ExecutiveDecision[]>(() => [
    ...INITIAL_DECISIONS,
  ]);
  const [currentDecisionId, setCurrentDecisionId] = useState<string | null>(
    "decision-a",
  );
  const [journalEntries, setJournalEntries] = useState<DecisionJournalEntry[]>(
    [],
  );
  const [decisionPacks, setDecisionPacks] = useState<DecisionTimelinePack[]>(
    [],
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState(300);

  const currentDecision =
    decisions.find((d) => d.id === currentDecisionId) ?? null;

  const setCurrentDecision = useCallback((id: string) => {
    setCurrentDecisionId(id);
  }, []);

  const patchDecision = useCallback(
    (id: string, patch: Partial<ExecutiveDecision>) => {
      setDecisions((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      );
    },
    [],
  );

  const setStatus = useCallback(
    (id: string, status: DecisionStatus) => {
      patchDecision(id, {
        status,
        locked: status === "Approved",
      });
    },
    [patchDecision],
  );

  const approve = useCallback(
    (id: string) => {
      setDecisions((prev) => {
        const target = prev.find((d) => d.id === id);
        if (!target) return prev;
        const approved: ExecutiveDecision = {
          ...target,
          status: "Approved",
          locked: true,
        };
        const journal = toJournalEntry(approved);
        const pack = toDecisionTimelinePack(approved);
        setJournalEntries((entries) => {
          if (entries.some((e) => e.decisionId === id)) {
            return entries.map((e) =>
              e.decisionId === id
                ? { ...journal, id: e.id }
                : e,
            );
          }
          return [...entries, journal];
        });
        setDecisionPacks((packs) => {
          if (packs.some((p) => p.decisionId === id)) {
            return packs.map((p) => (p.decisionId === id ? pack : p));
          }
          return [...packs, pack];
        });
        return prev.map((d) => (d.id === id ? approved : d));
      });
      setCurrentDecisionId(id);
    },
    [],
  );

  const reject = useCallback(
    (id: string) => {
      patchDecision(id, { status: "Rejected", locked: false });
    },
    [patchDecision],
  );

  const returnForAnalysis = useCallback(
    (id: string) => {
      patchDecision(id, { status: "Under Review", locked: false });
    },
    [patchDecision],
  );

  const archive = useCallback(
    (id: string) => {
      patchDecision(id, { status: "Archived", locked: false });
    },
    [patchDecision],
  );

  const duplicate = useCallback((id: string) => {
    setDecisions((prev) => {
      const source = prev.find((d) => d.id === id);
      if (!source) return prev;
      const copy: ExecutiveDecision = {
        ...source,
        id: `decision-${Date.now().toString(36)}`,
        name: `${source.name} · Copy`,
        status: "Draft",
        locked: false,
        createdDate: new Date().toISOString().slice(0, 10),
      };
      setCurrentDecisionId(copy.id);
      return [...prev, copy];
    });
  }, []);

  const createFromScenario = useCallback(
    (scenarioId: string, label: string) => {
      const next = createDecisionFromScenarios({
        name: `Decision · ${label}`,
        scenarioIds: [scenarioId],
        scenarioLabel: label,
        sourceKind: "single-scenario",
      });
      setDecisions((prev) => [...prev, next]);
      setCurrentDecisionId(next.id);
    },
    [],
  );

  const combineFromScenarios = useCallback(
    (scenarioIds: readonly string[], label: string) => {
      const next = createDecisionFromScenarios({
        name: `Decision · ${label}`,
        scenarioIds,
        scenarioLabel: label,
        sourceKind: "scenario-combination",
      });
      setDecisions((prev) => [...prev, next]);
      setCurrentDecisionId(next.id);
    },
    [],
  );

  const createManual = useCallback((name: string) => {
    const next = createManualDecision(name);
    setDecisions((prev) => [...prev, next]);
    setCurrentDecisionId(next.id);
  }, []);

  const value = useMemo(
    () => ({
      decisions,
      currentDecisionId,
      currentDecision,
      journalEntries,
      decisionPacks,
      previewOpen,
      panelCollapsed,
      panelWidth,
      setCurrentDecision,
      setPreviewOpen,
      setPanelCollapsed,
      setPanelWidth,
      setStatus,
      approve,
      reject,
      returnForAnalysis,
      duplicate,
      combineFromScenarios,
      createFromScenario,
      createManual,
      archive,
    }),
    [
      decisions,
      currentDecisionId,
      currentDecision,
      journalEntries,
      decisionPacks,
      previewOpen,
      panelCollapsed,
      panelWidth,
      setCurrentDecision,
      setStatus,
      approve,
      reject,
      returnForAnalysis,
      duplicate,
      combineFromScenarios,
      createFromScenario,
      createManual,
      archive,
    ],
  );

  return (
    <ExecutiveDecisionContext.Provider value={value}>
      {children}
    </ExecutiveDecisionContext.Provider>
  );
}
