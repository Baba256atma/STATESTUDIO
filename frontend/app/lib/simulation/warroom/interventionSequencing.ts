/**
 * D7:1:8 — Executive intervention sequencing (ordered, causal, immutable history).
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { DecisionSimulationOutcome } from "../decision/strategicDecisionTypes.ts";
import { simulateStrategicDecision } from "../decision/strategicDecisionConsequenceEngine.ts";
import type {
  WarRoomInterventionHistoryEntry,
  WarRoomInterventionStep,
} from "./warRoomTypes.ts";
import { logWarRoomDev } from "./warRoomDevLog.ts";

export interface InterventionSequenceResult {
  timelinesByScenarioId: Readonly<Record<string, OperationalTimeline>>;
  outcomes: readonly DecisionSimulationOutcome[];
  historyEntries: readonly WarRoomInterventionHistoryEntry[];
  decisionChainsByScenarioId: Readonly<Record<string, readonly string[]>>;
}

export function applyWarRoomInterventionSequence(input: {
  interventions: readonly WarRoomInterventionStep[];
  timelinesByScenarioId: Readonly<Record<string, OperationalTimeline>>;
  resourceAvailability?: Readonly<Record<string, number>>;
  priorSimulationFingerprints?: readonly string[];
}): InterventionSequenceResult | { ok: false; message: string; decisionId?: string } {
  const sorted = [...input.interventions].sort((a, b) => {
    if (a.stepIndex !== b.stepIndex) return a.stepIndex - b.stepIndex;
    return a.decision.decisionId.localeCompare(b.decision.decisionId);
  });

  const working: Record<string, OperationalTimeline> = { ...input.timelinesByScenarioId };
  const outcomes: DecisionSimulationOutcome[] = [];
  const historyEntries: WarRoomInterventionHistoryEntry[] = [];
  const decisionChains: Record<string, string[]> = {};
  const fingerprints: string[] = [...(input.priorSimulationFingerprints ?? [])];

  for (const step of sorted) {
    const timeline = working[step.targetScenarioId];
    if (!timeline) {
      return {
        ok: false,
        message: `Missing timeline for scenario ${step.targetScenarioId}`,
        decisionId: step.decision.decisionId,
      };
    }

    const chain = decisionChains[step.targetScenarioId] ?? [];
    const result = simulateStrategicDecision({
      decision: step.decision,
      activeTimeline: timeline,
      resourceAvailability: input.resourceAvailability,
      decisionChain: chain,
      priorSimulationFingerprints: fingerprints,
    });

    if (!result.ok) {
      const message =
        result.guard.ok === false ? result.guard.message : "Decision simulation rejected";
      return {
        ok: false,
        message,
        decisionId: step.decision.decisionId,
      };
    }

    working[step.targetScenarioId] = result.outcome.projectedTimeline;
    outcomes.push(result.outcome);
    fingerprints.push(result.outcome.consequenceSnapshot.fingerprint);

    decisionChains[step.targetScenarioId] = [...chain, step.decision.decisionId];

    historyEntries.push(
      Object.freeze({
        stepIndex: step.stepIndex,
        decisionId: step.decision.decisionId,
        targetScenarioId: step.targetScenarioId,
        sourceTimelineId: result.outcome.sourceTimelineId,
        projectedTimelineId: result.outcome.projectedTimeline.timelineId,
        fingerprint: result.outcome.consequenceSnapshot.fingerprint,
      })
    );

    logWarRoomDev("InterventionSequence", {
      stepIndex: step.stepIndex,
      decisionId: step.decision.decisionId,
      scenarioId: step.targetScenarioId,
      projectedTick: result.outcome.consequenceSnapshot.projectedTick,
    });
  }

  return {
    timelinesByScenarioId: Object.freeze(working),
    outcomes: Object.freeze(outcomes),
    historyEntries: Object.freeze(historyEntries),
    decisionChainsByScenarioId: Object.freeze(
      Object.fromEntries(
        Object.entries(decisionChains).map(([k, v]) => [k, Object.freeze([...v])])
      )
    ),
  };
}
