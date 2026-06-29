/**
 * APP-9:7 — Confidence Evolution consumer contracts.
 */

import {
  CONFIDENCE_EVOLUTION_API_GROUP_KEYS,
  CONFIDENCE_EVOLUTION_CONSUMER_KEYS,
  type ConfidenceEvolutionConsumerContract,
  type ConfidenceEvolutionConsumerId,
} from "./confidenceEvolutionApiTypes.ts";

function contract(
  consumerId: ConfidenceEvolutionConsumerId,
  allowedApiGroups: readonly ConfidenceEvolutionConsumerContract["allowedApiGroups"][number][],
  forbiddenApiGroups: readonly ConfidenceEvolutionConsumerContract["forbiddenApiGroups"][number][],
  readOnly: boolean,
  mutationAllowed: boolean,
  compatibilityStatus: ConfidenceEvolutionConsumerContract["compatibilityStatus"],
  notes: string
): ConfidenceEvolutionConsumerContract {
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

export const CONFIDENCE_EVOLUTION_CONSUMER_CONTRACTS = Object.freeze({
  WorkspaceConsumer: contract(
    "WorkspaceConsumer",
    ["records", "query", "trend", "evidenceReason", "calibration"],
    ["certification"],
    false,
    true,
    "compatible",
    "Workspace consumers may use controlled record write APIs through the facade only."
  ),
  DashboardConsumer: contract(
    "DashboardConsumer",
    ["query", "trend", "evidenceReason", "calibration"],
    ["records", "certification"],
    true,
    false,
    "compatible",
    "Dashboard consumers must use the APP-9:7 facade for read-only confidence views."
  ),
  AssistantConsumer: contract(
    "AssistantConsumer",
    ["query", "trend", "evidenceReason"],
    ["records", "calibration", "certification"],
    true,
    false,
    "compatible",
    "Assistant consumers must use read-only query, trend, and evidence/reason API groups through the facade."
  ),
  VisualizationConsumer: contract(
    "VisualizationConsumer",
    ["query", "trend"],
    ["records", "evidenceReason", "calibration", "certification"],
    true,
    false,
    "compatible",
    "Visualization consumers are read-only and limited to query and trend groups."
  ),
  ReportConsumer: contract(
    "ReportConsumer",
    ["query", "trend", "evidenceReason", "calibration"],
    ["records", "certification"],
    true,
    false,
    "compatible",
    "Report consumers are read-only and may aggregate query, trend, evidence/reason, and calibration data."
  ),
  ExportConsumer: contract(
    "ExportConsumer",
    ["query", "trend", "evidenceReason", "calibration", "certification"],
    ["records"],
    true,
    false,
    "compatible",
    "Export consumers are read-only and may invoke certification for export validation."
  ),
  FutureAppConsumer: contract(
    "FutureAppConsumer",
    ["query"],
    ["records", "trend", "evidenceReason", "calibration", "certification"],
    true,
    false,
    "restricted",
    "Future consumers must register compatibility before using write APIs."
  ),
} satisfies Readonly<Record<ConfidenceEvolutionConsumerId, ConfidenceEvolutionConsumerContract>>);

export function getConfidenceEvolutionConsumerContract(
  consumerId: ConfidenceEvolutionConsumerId
): ConfidenceEvolutionConsumerContract | null {
  return CONFIDENCE_EVOLUTION_CONSUMER_CONTRACTS[consumerId] ?? null;
}

export function listConfidenceEvolutionConsumerContracts(): readonly ConfidenceEvolutionConsumerContract[] {
  return Object.freeze(
    CONFIDENCE_EVOLUTION_CONSUMER_KEYS.map((consumerId) => CONFIDENCE_EVOLUTION_CONSUMER_CONTRACTS[consumerId])
  );
}

export const ConfidenceEvolutionConsumerContracts = Object.freeze({
  contracts: CONFIDENCE_EVOLUTION_CONSUMER_CONTRACTS,
  getConfidenceEvolutionConsumerContract,
  listConfidenceEvolutionConsumerContracts,
  apiGroups: CONFIDENCE_EVOLUTION_API_GROUP_KEYS,
});
