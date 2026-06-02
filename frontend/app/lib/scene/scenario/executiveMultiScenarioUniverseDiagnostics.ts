import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logE296ScenarioLoaded(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:96][ScenarioLoaded]", signature, payload, "info");
}

export function logE296ComparisonStarted(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:96][ComparisonStarted]", signature, payload, "info");
}

export function logE296ScenarioDelta(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:96][ScenarioDelta]", signature, payload, "debug");
}

export function logE296ComparisonCompleted(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:96][ComparisonCompleted]", signature, payload, "info");
}
