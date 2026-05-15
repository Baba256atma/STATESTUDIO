import type { NexoraDomainId } from "../domain/domainTypes.ts";
import type { ExternalSignalSourceType } from "./externalSignalTypes.ts";

export interface NexoraConnector {
  id: string;
  name: string;
  sourceType: ExternalSignalSourceType;
  domainHints?: NexoraDomainId[];
  enabled: boolean;
}

export const NEXORA_CONNECTOR_REGISTRY: NexoraConnector[] = [
  {
    id: "jira",
    name: "Jira",
    sourceType: "api",
    domainHints: ["pmo"],
    enabled: false,
  },
  {
    id: "datadog",
    name: "Datadog",
    sourceType: "stream",
    domainHints: ["saas_devops"],
    enabled: false,
  },
  {
    id: "erp",
    name: "ERP",
    sourceType: "api",
    domainHints: ["supply_chain"],
    enabled: false,
  },
  {
    id: "crm",
    name: "CRM",
    sourceType: "api",
    domainHints: ["retail"],
    enabled: false,
  },
  {
    id: "finance_api",
    name: "Finance API",
    sourceType: "api",
    domainHints: ["finance"],
    enabled: false,
  },
  {
    id: "manual_ingest",
    name: "Manual Ingestion",
    sourceType: "manual",
    domainHints: ["general"],
    enabled: true,
  },
];

export function listNexoraConnectors(): NexoraConnector[] {
  return NEXORA_CONNECTOR_REGISTRY.map((connector) => ({
    ...connector,
    domainHints: [...(connector.domainHints ?? [])],
  }));
}

export function getNexoraConnector(id: string): NexoraConnector | null {
  const normalized = String(id ?? "").trim().toLowerCase();
  return listNexoraConnectors().find((connector) => connector.id === normalized) ?? null;
}

export function isKnownConnector(id: string): boolean {
  return getNexoraConnector(id) !== null;
}
