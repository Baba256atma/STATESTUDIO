/**
 * Phase D — Simulation runner / session manager (isolated from Runtime mutations).
 */

import type { ExecutiveMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import type { ExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore";
import {
  applyAssumptions,
  buildSimulationContext,
  runScenarioSimulation,
} from "./ExecutiveScenarioSimulationEngine";
import type { SimulationAssumptionId } from "./ExecutiveSimulationConfig";
import type {
  ExecutiveSimulationSession,
  SimulationJournalEntry,
} from "./ExecutiveSimulationSession";
import { toSimulationJournalEntry } from "./ExecutiveSimulationSession";

export type SimulationRunner = {
  readonly getSessions: () => readonly ExecutiveSimulationSession[];
  readonly getActive: () => ExecutiveSimulationSession | null;
  readonly getJournal: () => readonly SimulationJournalEntry[];
  createInventoryShortageSession: (
    store: ExecutiveRuntimeStore,
    catalog: ExecutiveMetadataCatalog | null,
  ) => ExecutiveSimulationSession;
  setAssumptions: (
    sessionId: string,
    assumptionIds: readonly SimulationAssumptionId[],
  ) => ExecutiveSimulationSession;
  run: (
    sessionId: string,
    catalog: ExecutiveMetadataCatalog | null,
    store: ExecutiveRuntimeStore,
  ) => ExecutiveSimulationSession;
  cancel: (sessionId: string) => ExecutiveSimulationSession | null;
  archive: (sessionId: string) => ExecutiveSimulationSession | null;
  setActive: (sessionId: string | null) => void;
  attachDecisionCandidate: (
    sessionId: string,
    decisionId: string,
  ) => ExecutiveSimulationSession | null;
};

export function createSimulationRunner(): SimulationRunner {
  let sessions: ExecutiveSimulationSession[] = [];
  let activeId: string | null = null;
  let journal: SimulationJournalEntry[] = [];

  function replace(session: ExecutiveSimulationSession) {
    sessions = [session, ...sessions.filter((s) => s.sessionId !== session.sessionId)];
    return session;
  }

  return {
    getSessions: () => sessions,
    getActive: () =>
      sessions.find((s) => s.sessionId === activeId) ?? sessions[0] ?? null,
    getJournal: () => journal,

    createInventoryShortageSession(store, catalog) {
      const session = buildSimulationContext({
        state: store.getState(),
        catalog,
        scenarioLabel: "Inventory Shortage",
        assumptionIds: ["increase-safety-stock"],
      });
      const ready = applyAssumptions(session, session.assumptionIds);
      replace(ready);
      activeId = ready.sessionId;
      return ready;
    },

    setAssumptions(sessionId, assumptionIds) {
      const current = sessions.find((s) => s.sessionId === sessionId);
      if (!current) throw new Error(`Unknown simulation session ${sessionId}`);
      const next = applyAssumptions(current, assumptionIds);
      return replace(next);
    },

    run(sessionId, catalog, store) {
      const current = sessions.find((s) => s.sessionId === sessionId);
      if (!current) throw new Error(`Unknown simulation session ${sessionId}`);
      const running: ExecutiveSimulationSession = {
        ...current,
        status: "Running",
        updatedAt: Date.now(),
      };
      replace(running);
      const completed = runScenarioSimulation(running, catalog);
      replace(completed);
      activeId = completed.sessionId;
      journal = [toSimulationJournalEntry(completed), ...journal].slice(0, 24);

      // Emit only — Runtime business slices remain unchanged.
      store.emit("SimulationCompleted", {
        sessionId: completed.sessionId,
        scenarioLabel: completed.scenarioLabel,
        assumptionIds: completed.assumptionIds,
        risk: completed.results?.risk.level ?? "Medium",
        affectedObjects: completed.results?.impact.affectedObjectIds ?? [],
        timestamp: completed.completedAt,
      });

      return completed;
    },

    cancel(sessionId) {
      const current = sessions.find((s) => s.sessionId === sessionId);
      if (!current) return null;
      return replace({
        ...current,
        status: "Cancelled",
        updatedAt: Date.now(),
      });
    },

    archive(sessionId) {
      const current = sessions.find((s) => s.sessionId === sessionId);
      if (!current) return null;
      return replace({
        ...current,
        status: "Archived",
        updatedAt: Date.now(),
      });
    },

    setActive(sessionId) {
      activeId = sessionId;
    },

    attachDecisionCandidate(sessionId, decisionId) {
      const current = sessions.find((s) => s.sessionId === sessionId);
      if (!current) return null;
      return replace({
        ...current,
        decisionCandidateId: decisionId,
        updatedAt: Date.now(),
      });
    },
  };
}
