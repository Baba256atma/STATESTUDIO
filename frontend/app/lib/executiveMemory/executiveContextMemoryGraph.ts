/**
 * APP-4:8 — Executive Context Memory graph utilities.
 */

import { listExecutiveContextMemoriesFromRegistry } from "./executiveContextMemoryRegistry.ts";
import type {
  ExecutiveContextMemoryGraph,
  ExecutiveContextMemoryId,
} from "./executiveContextMemoryTypes.ts";
import type { ExecutiveMemoryId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";

export function inspectExecutiveContextMemoryGraph(input: {
  memoryId?: ExecutiveContextMemoryId;
  workspaceId?: ExecutiveMemoryWorkspaceId;
}): ExecutiveContextMemoryGraph {
  const query = input.memoryId
    ? { memoryId: input.memoryId }
    : input.workspaceId
      ? { workspaceId: input.workspaceId }
      : {};
  const records = listExecutiveContextMemoriesFromRegistry(query);

  const linkedGoalIds = new Set<string>();
  const linkedIntentIds = new Set<string>();
  const linkedScenarioIds = new Set<string>();
  const linkedDecisionIds = new Set<string>();
  const linkedExecutiveMemoryIds = new Set<string>();
  const linkedBusinessContextIds = new Set<string>();
  const linkedStakeholderIds = new Set<string>();
  const linkedResourceIds = new Set<string>();
  const linkedRiskIds = new Set<string>();
  const linkedKpiIds = new Set<string>();
  const linkedExternalEventIds = new Set<string>();
  let directReferenceCount = 0;

  for (const memory of records) {
    if (memory.goalId) linkedGoalIds.add(memory.goalId);
    if (memory.intentId) linkedIntentIds.add(memory.intentId);
    if (memory.scenarioId) linkedScenarioIds.add(memory.scenarioId);
    if (memory.decisionId) linkedDecisionIds.add(memory.decisionId);
    linkedBusinessContextIds.add(memory.businessContext.contextId);
    for (const id of memory.executiveMemoryIds) linkedExecutiveMemoryIds.add(id);
    for (const stakeholder of memory.stakeholders) linkedStakeholderIds.add(stakeholder.stakeholderId);
    for (const resource of memory.resourceContext.resources) linkedResourceIds.add(resource.resourceId);
    for (const id of memory.riskIds) linkedRiskIds.add(id);
    for (const id of memory.kpiIds) linkedKpiIds.add(id);
    for (const event of memory.externalContext.events) linkedExternalEventIds.add(event.eventId);
    directReferenceCount += memory.references.length;
  }

  const sortIds = <T extends string>(values: Set<T>) =>
    Object.freeze([...values].sort((left, right) => left.localeCompare(right)));

  return Object.freeze({
    memoryId: input.memoryId ?? null,
    workspaceId: input.workspaceId ?? records[0]?.workspaceId ?? null,
    linkedGoalIds: sortIds(linkedGoalIds),
    linkedIntentIds: sortIds(linkedIntentIds),
    linkedScenarioIds: sortIds(linkedScenarioIds),
    linkedDecisionIds: sortIds(linkedDecisionIds),
    linkedExecutiveMemoryIds: sortIds(linkedExecutiveMemoryIds) as readonly ExecutiveMemoryId[],
    linkedBusinessContextIds: sortIds(linkedBusinessContextIds),
    linkedStakeholderIds: sortIds(linkedStakeholderIds),
    linkedResourceIds: sortIds(linkedResourceIds),
    linkedRiskIds: sortIds(linkedRiskIds),
    linkedKpiIds: sortIds(linkedKpiIds),
    linkedExternalEventIds: sortIds(linkedExternalEventIds),
    directReferenceCount,
    readOnly: true as const,
  });
}

export const ExecutiveContextMemoryGraphInspector = Object.freeze({
  inspectExecutiveContextMemoryGraph,
});
