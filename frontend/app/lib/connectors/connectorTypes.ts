export type ConnectorKind = "file" | "api" | "webhook" | "manual" | "unknown";

export type ConnectorStatus = "idle" | "configured" | "running" | "success" | "failed" | "disabled";

export type ConnectorCapability = "read" | "write" | "poll" | "push" | "upload" | "transform";

/**
 * Immutable connector catalog entry (D3.1 foundation).
 *
 * ARCHITECTURE CONTRACT:
 * Connectors are lower-level ingress mechanisms. Canonical source registration,
 * lifecycle, health, and dashboard routing live in
 * ../source-management/sourceManagementContract.ts.
 */
export type ConnectorDefinition = Readonly<{
  id: string;
  label: string;
  kind: ConnectorKind;
  description: string;
  capabilities: readonly ConnectorCapability[];
  status: ConnectorStatus;
  isProductionSafe: boolean;
  createdAt: string;
  updatedAt: string;
}>;

export type ConnectorRunInput = Readonly<{
  connectorId: string;
  sourceType: string;
  payload: unknown;
  requestedAt: string;
}>;

export type ConnectorRunResult = Readonly<{
  connectorId: string;
  ok: boolean;
  status: ConnectorStatus;
  message: string;
  rawPayload?: unknown;
  normalizedPayload?: unknown;
  errors?: readonly string[];
  completedAt: string;
}>;
