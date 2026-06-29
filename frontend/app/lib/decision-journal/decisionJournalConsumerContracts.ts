/**
 * APP-8:7 — Decision Journal consumer contracts.
 */

import {
  DECISION_JOURNAL_API_GROUP_KEYS,
  DECISION_JOURNAL_CONSUMER_KEYS,
  type DecisionJournalConsumerContract,
  type DecisionJournalConsumerId,
} from "./decisionJournalApiTypes.ts";

function contract(
  consumerId: DecisionJournalConsumerId,
  allowedApiGroups: readonly DecisionJournalConsumerContract["allowedApiGroups"][number][],
  forbiddenApiGroups: readonly DecisionJournalConsumerContract["forbiddenApiGroups"][number][],
  readOnly: boolean,
  mutationAllowed: boolean,
  compatibilityStatus: DecisionJournalConsumerContract["compatibilityStatus"],
  notes: string
): DecisionJournalConsumerContract {
  return Object.freeze({
    consumerId,
    allowedApiGroups: Object.freeze([...allowedApiGroups]),
    forbiddenApiGroups: Object.freeze([...forbiddenApiGroups]),
    readOnly,
    mutationAllowed,
    compatibilityStatus,
    notes,
  });
}

export const DECISION_JOURNAL_CONSUMER_CONTRACTS = Object.freeze({
  WorkspaceConsumer: contract(
    "WorkspaceConsumer",
    ["entries", "query", "reflection", "quality", "retrospective"],
    ["certification"],
    false,
    true,
    "compatible",
    "Workspace consumers may use controlled entry write APIs through the facade only."
  ),
  DashboardConsumer: contract(
    "DashboardConsumer",
    ["query", "reflection", "quality", "retrospective"],
    ["entries", "certification"],
    true,
    false,
    "compatible",
    "Dashboard consumers must use the APP-8:7 facade for read-only journal views."
  ),
  AssistantConsumer: contract(
    "AssistantConsumer",
    ["query", "reflection"],
    ["entries", "quality", "retrospective", "certification"],
    true,
    false,
    "compatible",
    "Assistant consumers must use read-only query and reflection API groups through the facade."
  ),
  VisualizationConsumer: contract(
    "VisualizationConsumer",
    ["query", "reflection"],
    ["entries", "quality", "retrospective", "certification"],
    true,
    false,
    "compatible",
    "Visualization consumers are read-only and limited to query/reflection groups."
  ),
  ReportConsumer: contract(
    "ReportConsumer",
    ["query", "reflection", "quality", "retrospective"],
    ["entries", "certification"],
    true,
    false,
    "compatible",
    "Report consumers are read-only and may aggregate query, reflection, quality, and retrospective data."
  ),
  ExportConsumer: contract(
    "ExportConsumer",
    ["query", "reflection", "quality", "retrospective", "certification"],
    ["entries"],
    true,
    false,
    "compatible",
    "Export consumers are read-only and may invoke certification for export validation."
  ),
  FutureAppConsumer: contract(
    "FutureAppConsumer",
    ["query"],
    ["entries", "reflection", "quality", "retrospective", "certification"],
    true,
    false,
    "restricted",
    "Future consumers must register compatibility before using write APIs."
  ),
} satisfies Readonly<Record<DecisionJournalConsumerId, DecisionJournalConsumerContract>>);

export function getDecisionJournalConsumerContract(
  consumerId: DecisionJournalConsumerId
): DecisionJournalConsumerContract | null {
  return DECISION_JOURNAL_CONSUMER_CONTRACTS[consumerId] ?? null;
}

export function listDecisionJournalConsumerContracts(): readonly DecisionJournalConsumerContract[] {
  return Object.freeze(
    DECISION_JOURNAL_CONSUMER_KEYS.map((consumerId) => DECISION_JOURNAL_CONSUMER_CONTRACTS[consumerId])
  );
}

export const DecisionJournalConsumerContracts = Object.freeze({
  contracts: DECISION_JOURNAL_CONSUMER_CONTRACTS,
  getDecisionJournalConsumerContract,
  listDecisionJournalConsumerContracts,
  apiGroups: DECISION_JOURNAL_API_GROUP_KEYS,
});
