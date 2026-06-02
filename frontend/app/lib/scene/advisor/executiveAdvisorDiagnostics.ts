import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logE299AdvisorInitialized(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:99][AdvisorInitialized]", signature, payload, "info");
}

export function logE299OpportunityDetected(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:99][OpportunityDetected]", signature, payload, "debug");
}

export function logE299RiskDetected(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:99][RiskDetected]", signature, payload, "debug");
}

export function logE299RecommendationGenerated(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:99][RecommendationGenerated]", signature, payload, "info");
}

export function logE299StrategicQuestionGenerated(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:99][StrategicQuestionGenerated]", signature, payload, "info");
}
