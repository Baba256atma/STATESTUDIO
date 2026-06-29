/**
 * APP-4:6 — Executive Scenario Memory graph utilities.
 */

import { listExecutiveScenarioMemoriesFromRegistry } from "./executiveScenarioMemoryRegistry.ts";
import type {
  ExecutiveScenarioId,
  ExecutiveScenarioMemoryGraph,
  ExecutiveScenarioMemoryId,
} from "./executiveScenarioMemoryTypes.ts";

export function inspectExecutiveScenarioMemoryGraph(input: {
  memoryId?: ExecutiveScenarioMemoryId;
  scenarioId?: ExecutiveScenarioId;
}): ExecutiveScenarioMemoryGraph {
  const query = input.memoryId
    ? { memoryId: input.memoryId }
    : input.scenarioId
      ? { scenarioId: input.scenarioId }
      : {};
  const records = listExecutiveScenarioMemoriesFromRegistry(query);

  const relatedExecutiveMemoryIds = new Set<string>();
  const linkedScenarioIds = new Set<string>();
  const linkedGoalIds = new Set<string>();
  const linkedIntentIds = new Set<string>();
  const linkedDecisionIds = new Set<string>();
  const linkedRiskIds = new Set<string>();
  const linkedKpiIds = new Set<string>();
  let directReferenceCount = 0;

  for (const memory of records) {
    linkedScenarioIds.add(memory.scenarioId);
    if (memory.goalId) linkedGoalIds.add(memory.goalId);
    if (memory.intentId) linkedIntentIds.add(memory.intentId);
    if (memory.decisionId) linkedDecisionIds.add(memory.decisionId);
    for (const riskId of memory.riskIds) linkedRiskIds.add(riskId);
    for (const kpiId of memory.kpiIds) linkedKpiIds.add(kpiId);
    for (const executiveMemoryId of memory.executiveMemoryIds) relatedExecutiveMemoryIds.add(executiveMemoryId);
    directReferenceCount += memory.references.length;
  }

  const sortIds = <T extends string>(values: Set<T>) =>
    Object.freeze([...values].sort((left, right) => left.localeCompare(right)));

  return Object.freeze({
    memoryId: input.memoryId ?? null,
    scenarioId: input.scenarioId ?? records[0]?.scenarioId ?? null,
    relatedExecutiveMemoryIds: sortIds(relatedExecutiveMemoryIds),
    linkedScenarioIds: sortIds(linkedScenarioIds),
    linkedGoalIds: sortIds(linkedGoalIds),
    linkedIntentIds: sortIds(linkedIntentIds),
    linkedDecisionIds: sortIds(linkedDecisionIds),
    linkedRiskIds: sortIds(linkedRiskIds),
    linkedKpiIds: sortIds(linkedKpiIds),
    directReferenceCount,
    readOnly: true as const,
  });
}

export const ExecutiveScenarioMemoryGraphInspector = Object.freeze({
  inspectExecutiveScenarioMemoryGraph,
});
