/**
 * APP-7:6 — Business Timeline consumer contracts.
 */

import {
  BUSINESS_TIMELINE_API_GROUP_KEYS,
  BUSINESS_TIMELINE_CONSUMER_KEYS,
  type BusinessTimelineConsumerContract,
  type BusinessTimelineConsumerId,
} from "./businessTimelineApiTypes.ts";

function contract(
  consumerId: BusinessTimelineConsumerId,
  allowedApiGroups: readonly BusinessTimelineConsumerContract["allowedApiGroups"][number][],
  forbiddenApiGroups: readonly BusinessTimelineConsumerContract["forbiddenApiGroups"][number][],
  readOnly: boolean,
  mutationAllowed: boolean,
  compatibilityStatus: BusinessTimelineConsumerContract["compatibilityStatus"],
  notes: string
): BusinessTimelineConsumerContract {
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

export const BUSINESS_TIMELINE_CONSUMER_CONTRACTS = Object.freeze({
  DashboardConsumer: contract(
    "DashboardConsumer",
    ["query", "lifecycle", "context"],
    ["events", "certification"],
    true,
    false,
    "compatible",
    "Dashboard consumers must use the APP-7:6 facade for read-only timeline views."
  ),
  AssistantConsumer: contract(
    "AssistantConsumer",
    ["query", "lifecycle", "context"],
    ["events", "certification"],
    true,
    false,
    "compatible",
    "Assistant consumers must use read-only API groups through the facade."
  ),
  WorkspaceConsumer: contract(
    "WorkspaceConsumer",
    ["events", "query", "lifecycle", "context"],
    ["certification"],
    false,
    true,
    "compatible",
    "Workspace consumers may use controlled event write APIs through the facade only."
  ),
  VisualizationConsumer: contract(
    "VisualizationConsumer",
    ["query", "context"],
    ["events", "lifecycle", "certification"],
    true,
    false,
    "compatible",
    "Visualization consumers are read-only and limited to query/context groups."
  ),
  ReportConsumer: contract(
    "ReportConsumer",
    ["query", "lifecycle", "context"],
    ["events", "certification"],
    true,
    false,
    "compatible",
    "Report consumers are read-only and may aggregate lifecycle/query/context data."
  ),
  ExportConsumer: contract(
    "ExportConsumer",
    ["query", "lifecycle", "context", "certification"],
    ["events"],
    true,
    false,
    "compatible",
    "Export consumers are read-only and may invoke certification for export validation."
  ),
  FutureAppConsumer: contract(
    "FutureAppConsumer",
    ["query", "lifecycle", "context", "certification"],
    ["events"],
    true,
    false,
    "restricted",
    "Future consumers must register compatibility before using write APIs."
  ),
} satisfies Readonly<Record<BusinessTimelineConsumerId, BusinessTimelineConsumerContract>>);

export function getBusinessTimelineConsumerContract(
  consumerId: BusinessTimelineConsumerId
): BusinessTimelineConsumerContract | null {
  return BUSINESS_TIMELINE_CONSUMER_CONTRACTS[consumerId] ?? null;
}

export function listBusinessTimelineConsumerContracts(): readonly BusinessTimelineConsumerContract[] {
  return Object.freeze(BUSINESS_TIMELINE_CONSUMER_KEYS.map((consumerId) => BUSINESS_TIMELINE_CONSUMER_CONTRACTS[consumerId]));
}

export const BusinessTimelineConsumerContracts = Object.freeze({
  contracts: BUSINESS_TIMELINE_CONSUMER_CONTRACTS,
  getBusinessTimelineConsumerContract,
  listBusinessTimelineConsumerContracts,
  apiGroups: BUSINESS_TIMELINE_API_GROUP_KEYS,
});
