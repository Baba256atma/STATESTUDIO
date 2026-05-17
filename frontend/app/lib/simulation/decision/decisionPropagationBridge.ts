/**
 * D7:1:7 — Consumer-only propagation bridge for decision consequences.
 */

import type { SimulationEvent, SimulationEventType } from "../simulationEventTypes.ts";
import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import {
  propagateSimulationEvent,
  type SimulationPropagationResult,
} from "../simulationEventPropagationEngine.ts";
import type {
  SimulationObjectGraph,
  SimulationPropagationEdge,
} from "../simulationPropagationGraph.ts";
import { propagationResultToEvolutionSignals } from "../simulationEventPropagationEngine.ts";
import type { PropagationEvolutionSignal } from "../propagationEvolutionSignals.ts";
import type { StrategicDecisionInput, StrategicDecisionType } from "./strategicDecisionTypes.ts";
import { logDecisionDev } from "./decisionDevLog.ts";

function eventTypeForDecision(type: StrategicDecisionType): SimulationEventType {
  switch (type) {
    case "risk_mitigation":
    case "stabilization":
    case "operational_pause":
      return "state_change";
    case "cost_reduction":
      return "risk_increase";
    default:
      return "resource_shift";
  }
}

export function buildDecisionSimulationEvent(
  decision: StrategicDecisionInput,
  tick: number,
  seedIntensity: number
): SimulationEvent {
  const sourceObjectId = decision.targetObjectIds[0] ?? "operations";
  const createdAt = new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
  return {
    id: `decision_evt::${decision.decisionId}`,
    type: eventTypeForDecision(decision.type),
    sourceObjectId,
    targetObjectIds: [...decision.targetObjectIds],
    createdAt,
    payload: {
      decisionId: decision.decisionId,
      decisionType: decision.type,
      intensity: seedIntensity,
      rationale: decision.rationale,
    },
  };
}

/** Minimal downstream graph when no scene graph is supplied. */
export function buildDecisionPropagationGraph(
  targetObjectIds: readonly string[],
  existingGraph?: SimulationObjectGraph
): SimulationObjectGraph {
  if (existingGraph) return existingGraph;
  const ids = [...new Set(targetObjectIds.map((id) => String(id).trim()).filter(Boolean))].sort();
  if (ids.length === 0) {
    return {
      nodes: { operations: { objectId: "operations" } },
      edges: [],
    };
  }
  const nodes: Record<string, import("../simulationPropagationGraph.ts").SimulationObjectGraphNode> = {};
  const edges: SimulationPropagationEdge[] = [];
  for (const id of ids) nodes[id] = { objectId: id };
  for (let i = 0; i < ids.length - 1; i += 1) {
    edges.push({
      from: ids[i]!,
      to: ids[i + 1]!,
      relationType: "decision_downstream",
      weight: 0.85,
    });
  }
  return { nodes, edges };
}

export function runDecisionPropagation(input: {
  decision: StrategicDecisionInput;
  snapshot: SimulationStateSnapshot;
  tick: number;
  seedIntensity: number;
  objectGraph?: SimulationObjectGraph;
}): {
  event: SimulationEvent;
  propagationResults: readonly SimulationPropagationResult[];
  evolutionSignals: readonly PropagationEvolutionSignal[];
} {
  const event = buildDecisionSimulationEvent(input.decision, input.tick, input.seedIntensity);
  const graph = buildDecisionPropagationGraph(input.decision.targetObjectIds, input.objectGraph);
  const propagation = propagateSimulationEvent({
    event,
    objectGraph: graph,
    currentSnapshot: input.snapshot,
    tick: input.tick + 1,
  });

  logDecisionDev("DecisionConsequence", {
    decisionId: input.decision.decisionId,
    propagationEvents: propagation.propagationEvents.length,
    chains: propagation.chains.length,
  });

  return {
    event,
    propagationResults: [propagation],
    evolutionSignals: propagationResultToEvolutionSignals(propagation),
  };
}
