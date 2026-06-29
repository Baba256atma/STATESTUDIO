/**
 * APP-4:7 — Executive Decision Memory graph utilities.
 */

import { listExecutiveDecisionMemoriesFromRegistry } from "./executiveDecisionMemoryRegistry.ts";
import type {
  ExecutiveDecisionId,
  ExecutiveDecisionMemoryGraph,
  ExecutiveDecisionMemoryId,
} from "./executiveDecisionMemoryTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";

export function inspectExecutiveDecisionMemoryGraph(input: {
  memoryId?: ExecutiveDecisionMemoryId;
  decisionId?: ExecutiveDecisionId;
}): ExecutiveDecisionMemoryGraph {
  const query = input.memoryId
    ? { memoryId: input.memoryId }
    : input.decisionId
      ? { decisionId: input.decisionId }
      : {};
  const records = listExecutiveDecisionMemoriesFromRegistry(query);

  const linkedGoalIds = new Set<string>();
  const linkedIntentIds = new Set<string>();
  const linkedScenarioIds = new Set<string>();
  const linkedExecutiveMemoryIds = new Set<string>();
  const linkedRiskIds = new Set<string>();
  const linkedKpiIds = new Set<string>();
  const linkedEvidenceIds = new Set<string>();
  const linkedOutcomeIds = new Set<string>();
  let directReferenceCount = 0;

  for (const memory of records) {
    if (memory.goalId) linkedGoalIds.add(memory.goalId);
    if (memory.intentId) linkedIntentIds.add(memory.intentId);
    if (memory.scenarioId) linkedScenarioIds.add(memory.scenarioId);
    for (const id of memory.executiveMemoryIds) linkedExecutiveMemoryIds.add(id);
    for (const id of memory.riskIds) linkedRiskIds.add(id);
    for (const id of memory.kpiIds) linkedKpiIds.add(id);
    for (const evidence of memory.evidence) linkedEvidenceIds.add(evidence.evidenceId);
    for (const outcome of memory.expectedOutcomes) linkedOutcomeIds.add(outcome.outcomeId);
    for (const outcome of memory.actualOutcomes) linkedOutcomeIds.add(outcome.outcomeId);
    directReferenceCount += memory.references.length;
  }

  const sortIds = <T extends string>(values: Set<T>) =>
    Object.freeze([...values].sort((left, right) => left.localeCompare(right)));

  return Object.freeze({
    memoryId: input.memoryId ?? null,
    decisionId: input.decisionId ?? records[0]?.decisionId ?? null,
    linkedGoalIds: sortIds(linkedGoalIds),
    linkedIntentIds: sortIds(linkedIntentIds),
    linkedScenarioIds: sortIds(linkedScenarioIds),
    linkedExecutiveMemoryIds: sortIds(linkedExecutiveMemoryIds) as readonly ExecutiveMemoryId[],
    linkedRiskIds: sortIds(linkedRiskIds),
    linkedKpiIds: sortIds(linkedKpiIds),
    linkedEvidenceIds: sortIds(linkedEvidenceIds),
    linkedOutcomeIds: sortIds(linkedOutcomeIds),
    directReferenceCount,
    readOnly: true as const,
  });
}

export const ExecutiveDecisionMemoryGraphInspector = Object.freeze({
  inspectExecutiveDecisionMemoryGraph,
});
