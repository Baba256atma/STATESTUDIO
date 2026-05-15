import type { ConnectorCapability, ConnectorDefinition, ConnectorKind, ConnectorStatus } from "./connectorTypes.ts";

const FOUNDATION_CONNECTOR_UPDATED_AT = "2026-01-01T00:00:00.000Z";

const DEFAULT_CONNECTORS: readonly ConnectorDefinition[] = [
  {
    id: "manual_json_input",
    label: "Manual JSON input",
    kind: "manual",
    description: "Paste or supply JSON for operational intelligence without external calls.",
    capabilities: ["read", "upload", "transform"],
    status: "configured",
    isProductionSafe: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: FOUNDATION_CONNECTOR_UPDATED_AT,
  },
  {
    id: "csv_upload",
    label: "CSV upload",
    kind: "file",
    description: "CSV ingestion placeholder; configuration only until parsing is implemented.",
    capabilities: ["read", "upload", "transform"],
    status: "idle",
    isProductionSafe: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: FOUNDATION_CONNECTOR_UPDATED_AT,
  },
  {
    id: "spreadsheet_upload",
    label: "Spreadsheet upload",
    kind: "file",
    description: "Spreadsheet ingestion placeholder; configuration only until parsing is implemented.",
    capabilities: ["read", "upload", "transform"],
    status: "idle",
    isProductionSafe: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: FOUNDATION_CONNECTOR_UPDATED_AT,
  },
  {
    id: "api_json_placeholder",
    label: "API JSON (placeholder)",
    kind: "api",
    description: "REST-style JSON placeholder; no outbound network in foundation mode.",
    capabilities: ["read", "poll"],
    status: "idle",
    isProductionSafe: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: FOUNDATION_CONNECTOR_UPDATED_AT,
  },
  {
    id: "webhook_placeholder",
    label: "Webhook (placeholder)",
    kind: "webhook",
    description: "Inbound webhook placeholder; no listener or push handling in foundation mode.",
    capabilities: ["read", "push"],
    status: "idle",
    isProductionSafe: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: FOUNDATION_CONNECTOR_UPDATED_AT,
  },
] as const;

const CONNECTOR_BY_ID: ReadonlyMap<string, ConnectorDefinition> = new Map(
  DEFAULT_CONNECTORS.map((definition) => [definition.id, definition]),
);

export function getConnectorDefinitions(): ConnectorDefinition[] {
  return DEFAULT_CONNECTORS.map((definition) => ({ ...definition, capabilities: [...definition.capabilities] }));
}

export function getConnectorById(id: string): ConnectorDefinition | null {
  const key = String(id ?? "").trim();
  if (!key) return null;
  const found = CONNECTOR_BY_ID.get(key);
  return found ? { ...found, capabilities: [...found.capabilities] } : null;
}

export function isKnownConnector(id: string): boolean {
  const key = String(id ?? "").trim();
  return key.length > 0 && CONNECTOR_BY_ID.has(key);
}

export function getConnectorCapabilities(id: string): readonly ConnectorCapability[] {
  const caps = getConnectorById(id)?.capabilities;
  return caps ? [...caps] : [];
}
