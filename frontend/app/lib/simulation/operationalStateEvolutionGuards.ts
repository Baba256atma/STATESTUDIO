/**
 * D7:1:2 — Operational state evolution guard rails.
 */

import type { OperationalSimulationState, SimulatedObjectState } from "./operationalStateTypes.ts";
import {
  isDirectTransitionAllowed,
  ladderDistance,
  OPERATIONAL_ESCALATION_LADDER,
} from "./operationalStateTransitionRules.ts";
import type { OperationalTransitionRejection } from "./simulationTransitions.ts";
import { logOperationalEvolutionDev } from "./operationalStateEvolutionDevLog.ts";

const MAX_SEVERITY_DELTA_PER_TICK = 0.35;
const MAX_HISTORY = 48;

export function capTransitionHistory(
  history: readonly import("./simulationTransitions.ts").SimulationStateTransition[]
): import("./simulationTransitions.ts").SimulationStateTransition[] {
  if (history.length <= MAX_HISTORY) return [...history];
  return history.slice(history.length - MAX_HISTORY);
}

export function hasEscalationPathInHistory(
  state: SimulatedObjectState,
  required: OperationalSimulationState[]
): boolean {
  const seen = new Set<OperationalSimulationState>([state.operationalState]);
  for (const t of state.transitionHistory) {
    seen.add(t.from);
    seen.add(t.to);
  }
  return required.some((s) => seen.has(s));
}

export function validateOperationalTransition(input: {
  objectId: string;
  from: OperationalSimulationState;
  to: OperationalSimulationState;
  tick: number;
  lastUpdatedTick: number;
  previousSeverity: number;
  nextSeverity: number;
  history: SimulatedObjectState["transitionHistory"];
  lastTransitionKey?: string | null;
}): OperationalTransitionRejection | null {
  const { objectId, from, to, tick, lastUpdatedTick } = input;

  if (tick < lastUpdatedTick) {
    const rejection: OperationalTransitionRejection = {
      objectId,
      from,
      attemptedTo: to,
      reason: `Stale tick ${tick} < lastUpdatedTick ${lastUpdatedTick}`,
      code: "stale_tick",
    };
    logOperationalEvolutionDev("StateEvolution", { guard: rejection.code, objectId });
    return rejection;
  }

  if (from === to) return null;

  const transitionKey = `${tick}|${from}|${to}`;
  if (input.lastTransitionKey === transitionKey) {
    return {
      objectId,
      from,
      attemptedTo: to,
      reason: "Duplicate transition in same tick",
      code: "duplicate_transition",
    };
  }

  const severityDelta = input.nextSeverity - input.previousSeverity;
  if (severityDelta > MAX_SEVERITY_DELTA_PER_TICK) {
    return {
      objectId,
      from,
      attemptedTo: to,
      reason: `Severity spike ${severityDelta.toFixed(3)} exceeds per-tick cap`,
      code: "severity_spike",
    };
  }

  if (from === "critical" && to === "stable") {
    return {
      objectId,
      from,
      attemptedTo: to,
      reason: "Critical cannot jump directly to stable",
      code: "impossible_transition",
    };
  }

  if (from === "stable" && to === "critical") {
    const pathOk = hasEscalationPathInHistory(
      { objectId, operationalState: from, metadata: { severity: 0.1 }, lastUpdatedTick, transitionHistory: input.history },
      ["strained", "degraded", "monitoring"]
    );
    if (!pathOk && ladderDistance(from, to) > 2) {
      return {
        objectId,
        from,
        attemptedTo: to,
        reason: "Stable → critical requires escalation path (monitoring/strained/degraded)",
        code: "escalation_path_required",
      };
    }
  }

  if (!isDirectTransitionAllowed(from, to) && ladderDistance(from, to) > 2) {
    return {
      objectId,
      from,
      attemptedTo: to,
      reason: `Transition not allowed: ${from} → ${to}`,
      code: "impossible_transition",
    };
  }

  const last = input.history[input.history.length - 1];
  if (last && last.from === to && last.to === from && last.tick === tick) {
    return {
      objectId,
      from,
      attemptedTo: to,
      reason: "Oscillating transition loop detected",
      code: "transition_loop",
    };
  }

  if (
    from === "recovering" &&
    to === "critical" &&
    !OPERATIONAL_ESCALATION_LADDER.includes(to as (typeof OPERATIONAL_ESCALATION_LADDER)[number])
  ) {
    return {
      objectId,
      from,
      attemptedTo: to,
      reason: "Recovering cannot jump to critical without degradation path",
      code: "escalation_path_required",
    };
  }

  return null;
}
