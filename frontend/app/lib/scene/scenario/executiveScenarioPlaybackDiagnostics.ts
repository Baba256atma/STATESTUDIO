import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logE295PlaybackStarted(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:95][PlaybackStarted]", signature, payload, "info");
}

export function logE295PlaybackStep(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:95][PlaybackStep]", signature, payload, "debug");
}

export function logE295Propagation(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:95][Propagation]", signature, payload, "debug");
}

export function logE295PlaybackCompleted(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:95][PlaybackCompleted]", signature, payload, "info");
}
