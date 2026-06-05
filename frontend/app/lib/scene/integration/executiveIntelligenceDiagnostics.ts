import { devLogOnSignatureChange, devLogOncePermanent } from "../../runtime/diagnosticIdleGate.ts";
import { devLogThrottled, resetDiagnosticThrottleForTests } from "../../runtime/diagnosticThrottle.ts";

type AcceptanceGateAuditInput = {
  inputSignature?: string | null;
  acceptanceGates?: readonly {
    gateId: string;
    passed: boolean;
    blockers: readonly string[];
  }[];
  sourceAction?: string | null;
  sourceObjectId?: string | null;
  sceneId?: string | null;
  sceneObjectCount?: number | null;
  validationFailedCount?: number | null;
  runtimeHealthFailedCount?: number | null;
  storeWillNotify?: boolean;
};

const acceptanceFailureTimestamps: number[] = [];
const acceptanceSelectionFailureCounts = new Map<string, number>();
const acceptanceGateFailedOneShotSignatures = new Set<string>();
const acceptanceGateFailedRepeatCounts = new Map<string, number>();
let acceptanceSceneLoadFailureCount = 0;

function rollingCount(now: number, windowMs: number): number {
  const cutoff = now - windowMs;
  return acceptanceFailureTimestamps.filter((timestamp) => timestamp >= cutoff).length;
}

function classifyBlocker(blocker: string): "informational" | "validation" | "business-rule" | "runtime-expensive" | "critical" {
  const normalized = blocker.toLowerCase();
  if (normalized.includes("react loop") || normalized.includes("idle loop") || normalized.includes("heartbeat")) {
    return "runtime-expensive";
  }
  if (normalized.includes("failed runtime") || normalized.includes("critical")) return "critical";
  if (normalized.includes("incomplete") || normalized.includes("validation")) return "validation";
  if (normalized.includes("acceptance") || normalized.includes("mvp")) return "business-rule";
  return "informational";
}

function strongestClassification(
  classifications: readonly ReturnType<typeof classifyBlocker>[]
): ReturnType<typeof classifyBlocker> {
  const rank: Record<ReturnType<typeof classifyBlocker>, number> = {
    informational: 0,
    validation: 1,
    "business-rule": 2,
    "runtime-expensive": 3,
    critical: 4,
  };
  return classifications.reduce(
    (best, next) => (rank[next] > rank[best] ? next : best),
    "informational" as ReturnType<typeof classifyBlocker>
  );
}

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
  if (acceptanceGateFailedOneShotSignatures.has(stableSignature)) {
    const repeatCount = (acceptanceGateFailedRepeatCounts.get(stableSignature) ?? 0) + 1;
    acceptanceGateFailedRepeatCounts.set(stableSignature, repeatCount);
    if (repeatCount === 1 || repeatCount % 25 === 0) {
      devLogThrottled({
        key: `${stableSignature}:summary`,
        label: "[E2:100][AcceptanceGateFailedSummary]",
        severity: "debug",
        intervalMs: 30_000,
        payload: {
          count: repeatCount,
          lastSignature: stableSignature,
          blockerCount: blockers.length,
          repeatedAcceptanceGateFailedSuppressed: true,
          reason: "Duplicate AcceptanceGateFailed diagnostic suppressed for unchanged blockers/input signature.",
        },
      });
    }
    return;
  }
  acceptanceGateFailedOneShotSignatures.add(stableSignature);
  acceptanceGateFailedRepeatCounts.set(stableSignature, 0);
  devLogThrottled({
    key: stableSignature,
    label: "[E2:100][AcceptanceGateFailed]",
    severity: "debug",
    payload: { ...payload, blockers, signature: stableSignature },
    intervalMs: Number.MAX_SAFE_INTEGER,
  });
}

export function logNexoraAcceptanceGateAudit(input: AcceptanceGateAuditInput): void {
  const failedGates = (input.acceptanceGates ?? []).filter((gate) => !gate.passed);
  if (!failedGates.length) return;
  const now = Date.now();
  acceptanceFailureTimestamps.push(now);
  const cutoff = now - 60_000;
  while (acceptanceFailureTimestamps.length > 0 && acceptanceFailureTimestamps[0] < cutoff) {
    acceptanceFailureTimestamps.shift();
  }
  const sourceObjectId = input.sourceObjectId?.trim() || "none";
  acceptanceSelectionFailureCounts.set(
    sourceObjectId,
    (acceptanceSelectionFailureCounts.get(sourceObjectId) ?? 0) + 1
  );
  if (acceptanceFailureTimestamps.length === 1) {
    acceptanceSceneLoadFailureCount += 1;
  }

  const blockers = failedGates.flatMap((gate) => gate.blockers.map((blocker) => String(blocker)));
  const classifications = blockers.map(classifyBlocker);
  const classification = strongestClassification(classifications);
  const failuresLast10s = rollingCount(now, 10_000);
  const failuresLast60s = rollingCount(now, 60_000);
  const downstreamEffects = {
    reactRender: Boolean(input.storeWillNotify),
    panelUpdate: false,
    sceneUpdate: Boolean(input.storeWillNotify),
    topologyRebuild: false,
    scenarioRecompute: false,
    recommendationRecompute: false,
    decisionRecompute: false,
    executiveIntelligenceStoreNotify: Boolean(input.storeWillNotify),
  };

  for (const gate of failedGates) {
    devLogThrottled({
      key: [
        input.inputSignature ?? "unknown",
        gate.gateId,
        buildExecutiveAcceptanceGateBlockerSignature(gate.blockers),
      ].join("|"),
      label: "[NEXORA_ACCEPTANCE_GATE_AUDIT]",
      scope: "acceptanceGate",
      severity: classification === "runtime-expensive" || classification === "critical" ? "warn" : "debug",
      intervalMs: 1000,
      payload: {
        gateId: gate.gateId,
        subsystem: "E2:100 Executive Intelligence Completion Layer",
        reason: gate.blockers[0] ?? "Acceptance gate failed.",
        blockers: gate.blockers,
        inputSignature: input.inputSignature ?? null,
        sourceAction: input.sourceAction ?? "executive_intelligence_refresh",
        sourceObjectId: input.sourceObjectId ?? null,
        sceneId: input.sceneId ?? null,
        sceneObjectCount: input.sceneObjectCount ?? null,
        validationFailedCount: input.validationFailedCount ?? null,
        runtimeHealthFailedCount: input.runtimeHealthFailedCount ?? null,
        failuresLast10s,
        failuresLast60s,
        failuresPerSelection: acceptanceSelectionFailureCounts.get(sourceObjectId) ?? 0,
        failuresPerSceneLoad: acceptanceSceneLoadFailureCount,
        downstreamEffects,
        classification,
        causesRerenders: downstreamEffects.reactRender,
        causesExpensiveComputation: classification === "runtime-expensive" || classification === "critical",
      },
    });
  }
}

export function logNexoraAcceptanceGateSuppression(input: {
  suppressed: boolean;
  reason: string;
  bootstrapState?: unknown;
  interactionState?: unknown;
}): void {
  devLogThrottled({
    key: `acceptance-suppression:${input.reason}`,
    label: "[NEXORA_ACCEPTANCE_GATE_SUPPRESSION]",
    intervalMs: Number.MAX_SAFE_INTEGER,
    payload: input,
  });
}

export function getAcceptanceGateFailedDiagnosticCount(): number {
  return acceptanceGateFailedOneShotSignatures.size;
}

export function logNexoraAcceptanceGateCache(input: {
  reusedEvaluation: boolean;
  evaluationSkipped: boolean;
  signature: string;
}): void {
  devLogThrottled({
    key: `acceptance-cache:${input.signature}`,
    label: "[NEXORA_ACCEPTANCE_GATE_CACHE]",
    intervalMs: Number.MAX_SAFE_INTEGER,
    payload: input,
  });
}

export function resetExecutiveIntelligenceDiagnosticsForTests(): void {
  resetDiagnosticThrottleForTests();
  acceptanceFailureTimestamps.length = 0;
  acceptanceSelectionFailureCounts.clear();
  acceptanceGateFailedOneShotSignatures.clear();
  acceptanceGateFailedRepeatCounts.clear();
  acceptanceSceneLoadFailureCount = 0;
}

export function logE2100MVPReady(signature: string, payload: Record<string, unknown>): void {
  devLogOnSignatureChange("[E2:100][MVPReady]", signature, payload, "info");
}
