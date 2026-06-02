import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logE92ModeSwitch(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:92][ModeSwitch]", signature, payload, "info");
}

export function logE92CameraMode(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:92][CameraMode]", signature, payload, "debug");
}

export function logE92FitScene(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:92][FitScene]", signature, payload, "debug");
}

export function logE92GlobalView(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:92][GlobalView]", signature, payload, "info");
}
