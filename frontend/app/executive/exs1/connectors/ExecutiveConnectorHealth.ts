/**
 * Phase C — Connector health helpers.
 */

import type {
  ConnectionLifecycle,
  ConnectorHealthReport,
  ConnectorHealthState,
  ConnectorValidationResult,
} from "./ExecutiveConnectorContracts";

export function healthFromLifecycle(
  lifecycle: ConnectionLifecycle,
  validation?: ConnectorValidationResult | null,
): ConnectorHealthReport {
  let state: ConnectorHealthState = "Disconnected";
  let detail = "Connector is disconnected.";

  switch (lifecycle) {
    case "Connecting":
      state = "Warning";
      detail = "Connection in progress.";
      break;
    case "Connected":
    case "Validating":
    case "Preview Ready":
    case "Mapped":
    case "Approved":
    case "Published":
      state = "Healthy";
      detail = `Lifecycle · ${lifecycle}`;
      break;
    case "Failed":
      state = "Validation Failed";
      detail = "Connection or validation failed.";
      break;
    default:
      break;
  }

  if (validation && !validation.ok) {
    state = "Validation Failed";
    detail = validation.messages[0]?.message ?? detail;
  } else if (
    validation?.messages.some((m) => m.severity === "warning") &&
    state === "Healthy"
  ) {
    state = "Warning";
    detail = validation.messages.find((m) => m.severity === "warning")!.message;
  }

  return { state, detail, checkedAt: Date.now() };
}

export function healthColor(state: ConnectorHealthState): string {
  switch (state) {
    case "Healthy":
      return "#12B76A";
    case "Warning":
      return "#FDB022";
    case "Authentication Failed":
    case "Validation Failed":
      return "#F97066";
    default:
      return "#667085";
  }
}
