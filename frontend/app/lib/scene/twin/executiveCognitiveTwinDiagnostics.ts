import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logE298TwinInitialized(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:98][TwinInitialized]", signature, payload, "info");
}

export function logE298TwinStateChanged(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:98][TwinStateChanged]", signature, payload, "info");
}

export function logE298HealthUpdated(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:98][HealthUpdated]", signature, payload, "debug");
}

export function logE298RiskUpdated(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:98][RiskUpdated]", signature, payload, "debug");
}

export function logE298TwinSnapshotGenerated(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:98][TwinSnapshotGenerated]", signature, payload, "info");
}
