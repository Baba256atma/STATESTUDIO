import type { NexoraDomainId } from "../domain/domainTypes.ts";
import { getNexoraConnector } from "./connectorRegistry.ts";

const CONNECTOR_DOMAIN_MAP: Record<string, NexoraDomainId[]> = {
  jira: ["pmo"],
  datadog: ["saas_devops"],
  erp: ["supply_chain"],
  crm: ["retail"],
  finance_api: ["finance"],
  manual_ingest: ["general"],
};

const DOMAIN_ALIASES: Record<string, NexoraDomainId> = {
  operations: "supply_chain",
  delivery: "pmo",
  devops: "saas_devops",
  security: "security",
  finance: "finance",
  pmo: "pmo",
  retail: "retail",
  healthcare: "healthcare_ops",
  healthcare_ops: "healthcare_ops",
  supply_chain: "supply_chain",
  general: "general",
};

export function normalizeConnectorDomainHint(value: unknown): NexoraDomainId {
  const normalized = String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return DOMAIN_ALIASES[normalized] ?? "general";
}

export function resolveConnectorDomainHints(params: {
  connectorId?: string | null;
  domainHints?: unknown[] | null;
}): NexoraDomainId[] {
  const explicit = (params.domainHints ?? []).map(normalizeConnectorDomainHint);
  const connector = getNexoraConnector(params.connectorId ?? "");
  const mapped = CONNECTOR_DOMAIN_MAP[String(params.connectorId ?? "").trim().toLowerCase()] ?? connector?.domainHints ?? [];
  const result = [...explicit, ...mapped];
  return Array.from(new Set(result.length ? result : ["general"]));
}

export function listConnectorDomainMappings(): Array<{ connectorId: string; domainIds: NexoraDomainId[] }> {
  return Object.entries(CONNECTOR_DOMAIN_MAP).map(([connectorId, domainIds]) => ({
    connectorId,
    domainIds: [...domainIds],
  }));
}
