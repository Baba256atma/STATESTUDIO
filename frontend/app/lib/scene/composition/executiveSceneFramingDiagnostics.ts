import { devLogOnSignatureChange } from "../../runtime/diagnosticIdleGate";

export function logE91DensityCompression(
  signature: string,
  payload: Record<string, unknown>
): void {
  devLogOnSignatureChange("[E2:91][DensityCompression]", signature, payload, "info");
}

export function logE91SceneFraming(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:91][SceneFraming]", signature, payload, "info");
}

export function logE91FitScene(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:91][FitScene]", signature, payload, "debug");
}

export function logE91GlobalView(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:91][GlobalView]", signature, payload, "info");
}
