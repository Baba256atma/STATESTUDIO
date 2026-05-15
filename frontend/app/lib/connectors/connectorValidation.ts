import type { ConnectorKind, ConnectorStatus } from "./connectorTypes.ts";

export type ConnectorValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

const CONNECTOR_KINDS = new Set<ConnectorKind>(["file", "api", "webhook", "manual", "unknown"]);

const CONNECTOR_STATUSES = new Set<ConnectorStatus>(["idle", "configured", "running", "success", "failed", "disabled"]);

export function normalizeConnectorKind(kind: unknown): ConnectorKind {
  if (typeof kind !== "string") return "unknown";
  const trimmed = kind.trim();
  return CONNECTOR_KINDS.has(trimmed as ConnectorKind) ? (trimmed as ConnectorKind) : "unknown";
}

export function normalizeConnectorStatus(status: unknown): ConnectorStatus {
  if (typeof status !== "string") return "idle";
  const trimmed = status.trim();
  return CONNECTOR_STATUSES.has(trimmed as ConnectorStatus) ? (trimmed as ConnectorStatus) : "idle";
}

export function validateConnectorDefinition(definition: unknown): ConnectorValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (definition === null || definition === undefined || typeof definition !== "object") {
    errors.push("Connector definition must be a non-null object.");
    return { ok: false, errors, warnings };
  }

  const def = definition as Record<string, unknown>;

  if (typeof def.id !== "string" || !def.id.trim()) errors.push("Connector id is required.");
  if (typeof def.label !== "string" || !def.label.trim()) errors.push("Connector label is required.");
  if (typeof def.description !== "string") warnings.push("Connector description should be a string.");

  const kind = normalizeConnectorKind(def.kind);
  if (kind === "unknown" && def.kind !== undefined && def.kind !== "unknown") {
    warnings.push("Connector kind was unrecognized; treated as unknown.");
  }

  const status = normalizeConnectorStatus(def.status);
  if (status === "idle" && def.status !== undefined && def.status !== "" && def.status !== "idle") {
    warnings.push("Connector status was unrecognized; treated as idle.");
  }

  if (!Array.isArray(def.capabilities)) {
    errors.push("Connector capabilities must be an array.");
  } else {
    const allowed = new Set<string>(["read", "write", "poll", "push", "upload", "transform"]);
    for (const cap of def.capabilities) {
      if (typeof cap !== "string" || !allowed.has(cap)) {
        errors.push("Connector capabilities contains an invalid entry.");
        break;
      }
    }
  }

  if (def.isProductionSafe !== undefined && typeof def.isProductionSafe !== "boolean") {
    warnings.push("isProductionSafe should be a boolean.");
  }

  if (def.createdAt !== undefined && typeof def.createdAt !== "string") {
    warnings.push("createdAt should be an ISO string.");
  }
  if (def.updatedAt !== undefined && typeof def.updatedAt !== "string") {
    warnings.push("updatedAt should be an ISO string.");
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function validateConnectorRunInput(input: unknown): ConnectorValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (input === null || input === undefined || typeof input !== "object") {
    errors.push("Connector run input must be a non-null object.");
    return { ok: false, errors, warnings };
  }

  const run = input as Record<string, unknown>;

  if (typeof run.connectorId !== "string" || !run.connectorId.trim()) {
    errors.push("connectorId is required.");
  }

  if (typeof run.sourceType !== "string" || !run.sourceType.trim()) {
    warnings.push("sourceType is empty or missing.");
  }

  if (typeof run.requestedAt !== "string" || !run.requestedAt.trim()) {
    errors.push("requestedAt is required.");
  }

  if (!("payload" in run)) {
    warnings.push("payload field is missing.");
  }

  return { ok: errors.length === 0, errors, warnings };
}
