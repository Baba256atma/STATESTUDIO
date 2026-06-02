import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logExecutiveCameraPreset(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:88][CameraPreset]", signature, payload, "info");
}

export function logExecutiveCameraTransition(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:88][CameraTransition]", signature, payload, "debug");
}

export function logExecutiveCameraFocus(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:88][CameraFocus]", signature, payload, "debug");
}

export function logExecutiveCameraMemory(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:88][CameraMemory]", signature, payload, "debug");
}
