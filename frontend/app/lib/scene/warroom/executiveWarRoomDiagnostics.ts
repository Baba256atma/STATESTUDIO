import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logE297WarRoomInitialized(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:97][WarRoomInitialized]", signature, payload, "info");
}

export function logE297ContextChanged(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:97][ContextChanged]", signature, payload, "info");
}

export function logE297AlertRaised(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:97][AlertRaised]", signature, payload, "debug");
}

export function logE297RecommendationGenerated(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:97][RecommendationGenerated]", signature, payload, "info");
}

export function logE297SimulationStarted(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:97][SimulationStarted]", signature, payload, "info");
}
