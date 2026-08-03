/**
 * Phase D — Simulation session model.
 */

import type { ExecutiveImpactResult } from "./ExecutiveImpactEngine";
import type { ExecutiveFutureState } from "./ExecutiveFutureState";
import type { ExecutiveRiskResult } from "./ExecutiveRiskEngine";
import type {
  BaselineSnapshot,
  SimulationAssumptionId,
  SimulationStatus,
} from "./ExecutiveSimulationConfig";

export type SimulationResults = {
  readonly future: ExecutiveFutureState;
  readonly impact: ExecutiveImpactResult;
  readonly risk: ExecutiveRiskResult;
  readonly confidence: number;
  readonly executiveNotes: string;
};

export type ExecutiveSimulationSession = {
  readonly sessionId: string;
  readonly scenarioLabel: string;
  readonly baseline: BaselineSnapshot;
  readonly assumptionIds: readonly SimulationAssumptionId[];
  readonly status: SimulationStatus;
  readonly results: SimulationResults | null;
  readonly decisionCandidateId: string | null;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly completedAt: number | null;
};

export type SimulationJournalEntry = {
  readonly id: string;
  readonly sessionId: string;
  readonly summary: string;
  readonly scenario: string;
  readonly assumptions: string;
  readonly results: string;
  readonly impacts: string;
  readonly risks: string;
  readonly timestamp: string;
};

export function createDraftSession(input: {
  readonly scenarioLabel: string;
  readonly baseline: BaselineSnapshot;
  readonly assumptionIds?: readonly SimulationAssumptionId[];
}): ExecutiveSimulationSession {
  const now = Date.now();
  return {
    sessionId: `sim-${now.toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    scenarioLabel: input.scenarioLabel,
    baseline: input.baseline,
    assumptionIds: input.assumptionIds ?? ["increase-safety-stock"],
    status: "Draft",
    results: null,
    decisionCandidateId: null,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
}

export function toSimulationJournalEntry(
  session: ExecutiveSimulationSession,
): SimulationJournalEntry {
  const results = session.results;
  return {
    id: `journal-sim-${session.sessionId}`,
    sessionId: session.sessionId,
    summary: `[Simulation] ${session.scenarioLabel} · ${session.status}`,
    scenario: session.scenarioLabel,
    assumptions: session.assumptionIds.join(", "),
    results: results
      ? `${results.future.objects.length} object projections · confidence ${results.confidence}%`
      : "No results",
    impacts: results?.impact.summary ?? "—",
    risks: results?.risk.summary ?? "—",
    timestamp: new Date(session.completedAt ?? session.updatedAt).toISOString(),
  };
}
