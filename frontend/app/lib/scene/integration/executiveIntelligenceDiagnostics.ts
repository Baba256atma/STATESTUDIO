import { devLogOnSignatureChange, devLogOncePermanent } from "../../runtime/diagnosticIdleGate";

export function logE2100ReadinessStarted(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:100][ReadinessStarted]", signature, payload, "info");
}

export function logE2100ValidationCompleted(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:100][ValidationCompleted]", signature, payload, "info");
}

export function logE2100AcceptanceGatePassed(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:100][AcceptanceGatePassed]", signature, payload, "info");
}

export function buildExecutiveAcceptanceGateBlockerSignature(blockers: readonly string[]): string {
  return blockers
    .map((blocker) => (typeof blocker === "string" ? blocker : JSON.stringify(blocker)))
    .sort()
    .join("|");
}

const emittedAcceptanceGateFailureSignatures = new Set<string>();

export function logE2100AcceptanceGateFailed(
  blockers: readonly string[],
  payload: Record<string, unknown>,
  options?: { sceneReady?: boolean; inputSignature?: string }
): void {
  if (options?.sceneReady === false) return;
  if (!blockers.length) return;
  const blockerSignature = buildExecutiveAcceptanceGateBlockerSignature(blockers);
  const stableSignature = [
    blockerSignature,
    `sceneReady:${options?.sceneReady ?? true}`,
    `hydrated:${options?.sceneReady ?? true}`,
    options?.inputSignature ?? "unknown",
  ].join("|");
  if (emittedAcceptanceGateFailureSignatures.has(stableSignature)) return;
  emittedAcceptanceGateFailureSignatures.add(stableSignature);
  devLogOncePermanent("[E2:100][AcceptanceGateFailed]", stableSignature, payload, "warn");
}

export function resetExecutiveIntelligenceDiagnosticsForTests(): void {
  emittedAcceptanceGateFailureSignatures.clear();
}

export function logE2100MVPReady(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:100][MVPReady]", signature, payload, "info");
}
