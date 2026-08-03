"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useExecutiveMetadata } from "../metadata";
import { useExecutiveRuntimeStoreApi } from "../runtime";
import type { SimulationAssumptionId } from "./ExecutiveSimulationConfig";
import { createSimulationRunner } from "./ExecutiveSimulationRunner";
import type {
  ExecutiveSimulationSession,
  SimulationJournalEntry,
} from "./ExecutiveSimulationSession";
import { publishSimulationInspectorSnapshot } from "./simulationInspectorBridge";

export type SimulationExplorerSection =
  | "Sessions"
  | "Results"
  | "Comparison"
  | "Archived";

export type ExecutiveSimulationContextValue = {
  readonly sessions: readonly ExecutiveSimulationSession[];
  readonly activeSession: ExecutiveSimulationSession | null;
  readonly journalEntries: readonly SimulationJournalEntry[];
  readonly section: SimulationExplorerSection;
  readonly setSection: (section: SimulationExplorerSection) => void;
  readonly setActiveSessionId: (id: string | null) => void;
  readonly overlayActive: boolean;
  readonly setOverlayActive: (active: boolean) => void;
  readonly busy: boolean;
  readonly error: string | null;
  readonly advisorFacts: readonly string[];
  readonly createInventoryShortage: () => void;
  readonly toggleAssumption: (id: SimulationAssumptionId) => void;
  readonly runActive: () => Promise<void>;
  readonly createDecisionCandidate: () => void;
  readonly archiveActive: () => void;
};

export const ExecutiveSimulationContext =
  createContext<ExecutiveSimulationContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

export function ExecutiveSimulationProvider({ children }: Props) {
  const store = useExecutiveRuntimeStoreApi();
  const { catalog } = useExecutiveMetadata();
  const runnerRef = useRef(createSimulationRunner());
  const runner = runnerRef.current;

  const [sessions, setSessions] = useState<ExecutiveSimulationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [journalEntries, setJournalEntries] = useState<
    SimulationJournalEntry[]
  >([]);
  const [section, setSection] =
    useState<SimulationExplorerSection>("Sessions");
  const [overlayActive, setOverlayActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advisorFacts, setAdvisorFacts] = useState<readonly string[]>([]);

  const sync = useCallback(() => {
    setSessions([...runner.getSessions()]);
    setJournalEntries([...runner.getJournal()]);
    const active = runner.getActive();
    setActiveSessionId(active?.sessionId ?? null);
  }, [runner]);

  const activeSession =
    sessions.find((s) => s.sessionId === activeSessionId) ?? null;

  useEffect(() => {
    publishSimulationInspectorSnapshot({
      activeScenario: activeSession?.scenarioLabel ?? null,
      status: activeSession?.status ?? null,
      sessionCount: sessions.length,
      overlayActive,
      lastRisk: activeSession?.results?.risk.level ?? null,
      decisionCandidateId: activeSession?.decisionCandidateId ?? null,
    });
  }, [activeSession, sessions.length, overlayActive]);

  const createInventoryShortage = useCallback(() => {
    setError(null);
    const session = runner.createInventoryShortageSession(store, catalog);
    sync();
    setSection("Sessions");
    setAdvisorFacts([
      `Simulation draft · ${session.scenarioLabel}`,
      "Assumption · Increase Safety Stock",
      "Runtime baseline captured — no Runtime mutation",
    ]);
  }, [runner, store, catalog, sync]);

  const toggleAssumption = useCallback(
    (id: SimulationAssumptionId) => {
      if (!activeSession) return;
      const next = activeSession.assumptionIds.includes(id)
        ? activeSession.assumptionIds.filter((x) => x !== id)
        : [...activeSession.assumptionIds, id];
      runner.setAssumptions(activeSession.sessionId, next);
      sync();
    },
    [activeSession, runner, sync],
  );

  const runActive = useCallback(async () => {
    if (!activeSession) return;
    setBusy(true);
    setError(null);
    try {
      const completed = runner.run(activeSession.sessionId, catalog, store);
      sync();
      setOverlayActive(true);
      setSection("Results");
      const inventory = completed.results?.future.objects.find(
        (o) => o.objectId === "inventory",
      );
      setAdvisorFacts([
        `Assumptions applied · ${completed.assumptionIds.join(", ")}`,
        `Changed · Inventory ${inventory?.current ?? "—"} → ${inventory?.future ?? "—"} (Δ ${inventory?.delta ?? 0})`,
        `Affected · ${completed.results?.impact.affectedObjectIds.join(", ") ?? "—"}`,
        `Major risk · ${completed.results?.risk.level ?? "—"}`,
        "Suggested focus · Review Decision Candidate after manager approval",
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setBusy(false);
    }
  }, [activeSession, runner, catalog, store, sync]);

  const createDecisionCandidate = useCallback(() => {
    if (!activeSession || activeSession.status !== "Completed") {
      setError("Complete a simulation before creating a Decision Candidate.");
      return;
    }
    // Draft only — Advisor/Manager never auto-approve from simulation.
    store.actions.createManualDecision(
      `Sim · ${activeSession.scenarioLabel} · Safety Stock`,
    );
    const created = store.getState().decision.currentDecisionId;
    if (created) {
      runner.attachDecisionCandidate(activeSession.sessionId, created);
      sync();
      setAdvisorFacts((prev) => [
        ...prev,
        `Decision Candidate created · ${created} (Draft — manager approval required)`,
      ]);
    }
  }, [activeSession, store, runner, sync]);

  const archiveActive = useCallback(() => {
    if (!activeSession) return;
    runner.archive(activeSession.sessionId);
    sync();
    setOverlayActive(false);
  }, [activeSession, runner, sync]);

  const setActive = useCallback(
    (id: string | null) => {
      runner.setActive(id);
      setActiveSessionId(id);
    },
    [runner],
  );

  const value = useMemo(
    () => ({
      sessions,
      activeSession,
      journalEntries,
      section,
      setSection,
      setActiveSessionId: setActive,
      overlayActive,
      setOverlayActive,
      busy,
      error,
      advisorFacts,
      createInventoryShortage,
      toggleAssumption,
      runActive,
      createDecisionCandidate,
      archiveActive,
    }),
    [
      sessions,
      activeSession,
      journalEntries,
      section,
      setActive,
      overlayActive,
      busy,
      error,
      advisorFacts,
      createInventoryShortage,
      toggleAssumption,
      runActive,
      createDecisionCandidate,
      archiveActive,
    ],
  );

  return (
    <ExecutiveSimulationContext.Provider value={value}>
      {children}
    </ExecutiveSimulationContext.Provider>
  );
}
