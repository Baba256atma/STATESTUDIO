import type { LaunchReadinessDecision } from "../launch-gate/productionReadinessGateTypes";
import type { MVPDemoModeState, MVPDemoState } from "./demoModeTypes";

export const DEMO_MODE_MAX_SNAPSHOTS = 8;
export const DEMO_MODE_MAX_HISTORY = 10;
export const DEMO_MODE_MAX_RISKS = 12;
export const DEMO_MODE_MAX_GUARD_SIGNALS = 10;
export const DEMO_MODE_MAX_BLOCKED_PATHS = 8;
export const DEMO_MODE_MAX_DEMO_RISKS_DISPLAY = 6;
export const DEMO_MODE_MIN_EVAL_INTERVAL_MS = 500;
export const DEMO_MODE_MAX_RECURSION_DEPTH = 2;
export const DEMO_MODE_MIN_CONFIDENCE = 0.48;
export const DEMO_MODE_MAX_INFLATED_CONFIDENCE = 0.92;
export const DEMO_MODE_MIN_LAUNCH_GATE_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
const lastLoggedDemoStateByOrg = new Map<string, MVPDemoState>();
let demoModeEvaluationDepth = 0;

export function beginDemoModeEvaluation(): boolean {
  if (demoModeEvaluationDepth >= DEMO_MODE_MAX_RECURSION_DEPTH) return false;
  demoModeEvaluationDepth += 1;
  return true;
}

export function endDemoModeEvaluation(): void {
  demoModeEvaluationDepth = Math.max(0, demoModeEvaluationDepth - 1);
}

export function shouldEvaluateDemoMode(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < DEMO_MODE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampDemoModeConfidence(score: number): number {
  return Number(
    Math.min(
      DEMO_MODE_MAX_INFLATED_CONFIDENCE,
      Math.max(DEMO_MODE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function demoStateRank(state: MVPDemoState): number {
  const ranks: Record<MVPDemoState, number> = {
    disabled: 0,
    blocked: 1,
    monitored: 2,
    demo_ready: 3,
    pilot_ready: 4,
  };
  return ranks[state];
}

export function mapLaunchDecisionToDemoState(
  decision: LaunchReadinessDecision | "unknown",
  criticalSmoke: boolean,
  evidenceComplete: boolean
): MVPDemoState {
  if (criticalSmoke) return "blocked";
  if (decision === "no_go") return "blocked";
  if (!evidenceComplete) return "monitored";
  if (decision === "conditional_go") return "monitored";
  if (decision === "go_for_demo") return "demo_ready";
  if (decision === "go_for_controlled_pilot") return "pilot_ready";
  return "disabled";
}

export function preventDemoReadyWhileNoGo(
  proposed: MVPDemoState,
  launchDecision: LaunchReadinessDecision | "unknown"
): { demoState: MVPDemoState; downgraded: boolean } {
  if (launchDecision === "no_go" && (proposed === "demo_ready" || proposed === "pilot_ready")) {
    return { demoState: "blocked", downgraded: true };
  }
  return { demoState: proposed, downgraded: false };
}

export function preventHidingCriticalRisks<T extends { severity: string; visibleToExecutive: boolean }>(
  risks: readonly T[]
): T[] {
  return risks.map((risk) =>
    risk.severity === "critical" ? { ...risk, visibleToExecutive: true } : risk
  );
}

export function stabilizeDemoStateOscillation(
  proposed: MVPDemoState,
  prior: MVPDemoState | null
): MVPDemoState {
  if (!prior) return proposed;
  if (demoStateRank(proposed) - demoStateRank(prior) > 2) {
    if (prior === "blocked") return "monitored";
    return prior;
  }
  return proposed;
}

export function shouldLogDemoStateChange(organizationId: string, state: MVPDemoState): boolean {
  const prior = lastLoggedDemoStateByOrg.get(organizationId);
  if (prior === state) return false;
  lastLoggedDemoStateByOrg.set(organizationId, state);
  return true;
}

export function validateMVPDemoModeState(
  snapshot: MVPDemoModeState | null | undefined
): snapshot is MVPDemoModeState {
  if (!snapshot) return false;
  if (!snapshot.demoModeId.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.signature.trim() || !snapshot.summary.trim()) return false;
  if (!snapshot.executiveNarrative.headline.trim()) return false;
  if (snapshot.confidence < DEMO_MODE_MIN_CONFIDENCE) return false;
  if (snapshot.confidence > DEMO_MODE_MAX_INFLATED_CONFIDENCE) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function resetDemoModeGuards(): void {
  lastEvalAtByOrg.clear();
  lastLoggedDemoStateByOrg.clear();
  demoModeEvaluationDepth = 0;
}
