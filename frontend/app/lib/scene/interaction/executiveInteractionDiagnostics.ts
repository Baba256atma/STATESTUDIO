import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logExecutiveOrbit(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:89][Orbit]", signature, payload, "debug");
}

export function logExecutivePan(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:89][Pan]", signature, payload, "debug");
}

export function logExecutiveZoom(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:89][Zoom]", signature, payload, "debug");
}

export function logExecutiveInteractionFocus(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:89][Focus]", signature, payload, "debug");
}

export function logExecutiveInteractionSelection(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:89][Selection]", signature, payload, "debug");
}

export function resetExecutiveInteractionDiagnosticsForTests(): void {
  // devLogOnSignatureChange keeps module-level state in diagnosticIdleGate
}
