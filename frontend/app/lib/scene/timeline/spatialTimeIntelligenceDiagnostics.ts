import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logE294TimelineEventAnchored(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:94][TimelineEventAnchored]", signature, payload, "debug");
}

export function logE294TimelineFocus(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:94][TimelineFocus]", signature, payload, "info");
}

export function logE294ScenarioStep(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:94][ScenarioStep]", signature, payload, "debug");
}

export function logE294RiskTimeline(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:94][RiskTimeline]", signature, payload, "debug");
}
