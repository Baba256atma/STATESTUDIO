/**
 * Phase D — Scenario Simulation Engine (deterministic executive simulation).
 */

import type { ExecutiveMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import type { ExecutiveRuntimeState } from "../runtime/ExecutiveRuntimeStore";
import { runImpactEngine } from "./ExecutiveImpactEngine";
import { buildFutureState } from "./ExecutiveFutureState";
import { runRiskEngine } from "./ExecutiveRiskEngine";
import type {
  BaselineSnapshot,
  SimulationAssumptionId,
} from "./ExecutiveSimulationConfig";
import {
  INVENTORY_SHORTAGE_BASELINE,
  STATIC_CONFIDENCE,
  getAssumption,
} from "./ExecutiveSimulationConfig";
import type {
  ExecutiveSimulationSession,
  SimulationResults,
} from "./ExecutiveSimulationSession";
import { createDraftSession } from "./ExecutiveSimulationSession";

export function captureBaselineSnapshot(
  state: ExecutiveRuntimeState,
  packTitle = "Production Delay",
): BaselineSnapshot {
  return {
    ...INVENTORY_SHORTAGE_BASELINE,
    capturedAt: Date.now(),
    mode: state.mode.activeMode,
    packId: state.pack.selectedPackId,
    packTitle,
    selectedObjectId: state.selection.selectedObjectId,
    scenarioId: state.scenario.currentScenarioId,
  };
}

export function buildSimulationContext(input: {
  readonly state: ExecutiveRuntimeState;
  readonly catalog: ExecutiveMetadataCatalog | null;
  readonly scenarioLabel?: string;
  readonly assumptionIds?: readonly SimulationAssumptionId[];
}): ExecutiveSimulationSession {
  void input.catalog;
  const baseline = captureBaselineSnapshot(input.state);
  return createDraftSession({
    scenarioLabel: input.scenarioLabel ?? "Inventory Shortage",
    baseline,
    assumptionIds: input.assumptionIds ?? ["increase-safety-stock"],
  });
}

export function applyAssumptions(
  session: ExecutiveSimulationSession,
  assumptionIds: readonly SimulationAssumptionId[],
): ExecutiveSimulationSession {
  return {
    ...session,
    assumptionIds: [...assumptionIds],
    status: assumptionIds.length > 0 ? "Ready" : "Draft",
    results: null,
    updatedAt: Date.now(),
  };
}

export function produceSimulationResults(
  session: ExecutiveSimulationSession,
  catalog: ExecutiveMetadataCatalog | null,
): SimulationResults {
  const future = buildFutureState({
    baseline: session.baseline,
    scenarioLabel: session.scenarioLabel,
    assumptionIds: session.assumptionIds,
  });
  const impact = runImpactEngine(future, catalog);
  const risk = runRiskEngine(session.assumptionIds, future);
  const labels = session.assumptionIds
    .map((id) => getAssumption(id)?.label ?? id)
    .join(", ");
  return {
    future,
    impact,
    risk,
    confidence: STATIC_CONFIDENCE,
    executiveNotes: `Assumptions · ${labels}. ${risk.drivers[0] ?? ""}`.trim(),
  };
}

export function runScenarioSimulation(
  session: ExecutiveSimulationSession,
  catalog: ExecutiveMetadataCatalog | null,
): ExecutiveSimulationSession {
  const results = produceSimulationResults(session, catalog);
  const now = Date.now();
  return {
    ...session,
    status: "Completed",
    results,
    updatedAt: now,
    completedAt: now,
  };
}

export type ExecutiveScenarioSimulationEngine = {
  readonly buildContext: typeof buildSimulationContext;
  readonly applyAssumptions: typeof applyAssumptions;
  readonly run: typeof runScenarioSimulation;
  readonly captureBaseline: typeof captureBaselineSnapshot;
};

export const executiveScenarioSimulationEngine: ExecutiveScenarioSimulationEngine =
  {
    buildContext: buildSimulationContext,
    applyAssumptions,
    run: runScenarioSimulation,
    captureBaseline: captureBaselineSnapshot,
  };
