import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logExecutiveObjectScaleDiagnostic(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:90][ObjectScale]", signature, payload, "info");
}

export function logExecutiveLabelScaleDiagnostic(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:90][LabelScale]", signature, payload, "debug");
}

export function logExecutiveDensityCompressionDiagnostic(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:90][DensityCompression]", signature, payload, "info");
}
