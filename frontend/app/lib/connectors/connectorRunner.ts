import { getConnectorById, isKnownConnector } from "./connectorRegistry.ts";
import type { ConnectorRunInput, ConnectorRunResult, ConnectorStatus } from "./connectorTypes.ts";
import { validateConnectorRunInput } from "./connectorValidation.ts";

function nowIso(): string {
  return new Date().toISOString();
}

function baseResult(params: {
  connectorId: string;
  ok: boolean;
  status: ConnectorStatus;
  message: string;
  errors?: readonly string[];
  rawPayload?: unknown;
  normalizedPayload?: unknown;
}): ConnectorRunResult {
  return {
    connectorId: params.connectorId,
    ok: params.ok,
    status: params.status,
    message: params.message,
    completedAt: nowIso(),
    ...(params.errors !== undefined ? { errors: params.errors } : {}),
    ...(params.rawPayload !== undefined ? { rawPayload: params.rawPayload } : {}),
    ...(params.normalizedPayload !== undefined ? { normalizedPayload: params.normalizedPayload } : {}),
  };
}

export async function runConnector(input: ConnectorRunInput): Promise<ConnectorRunResult> {
  const validation = validateConnectorRunInput(input);
  const connectorId = typeof input.connectorId === "string" ? input.connectorId.trim() : "";

  if (!validation.ok) {
    return baseResult({
      connectorId: connectorId || "unknown",
      ok: false,
      status: "failed",
      message: "Invalid connector run input",
      errors: validation.errors,
      rawPayload: input.payload,
    });
  }

  if (!isKnownConnector(connectorId)) {
    return baseResult({
      connectorId,
      ok: false,
      status: "failed",
      message: "Unknown connector",
      rawPayload: input.payload,
    });
  }

  const definition = getConnectorById(connectorId);
  if (!definition) {
    return baseResult({
      connectorId,
      ok: false,
      status: "failed",
      message: "Unknown connector",
      rawPayload: input.payload,
    });
  }

  return baseResult({
    connectorId,
    ok: true,
    status: "success",
    message: "Connector foundation run completed",
    rawPayload: input.payload,
    normalizedPayload: { echo: input.payload, connectorLabel: definition.label },
  });
}
