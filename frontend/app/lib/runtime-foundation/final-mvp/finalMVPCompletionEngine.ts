import { stableSignature } from "../../intelligence/shared/dedupe";
import {
  beginFinalMVPCompletionEvaluation,
  clampFinalMVPCompletionConfidence,
  endFinalMVPCompletionEvaluation,
  FINAL_MVP_COMPLETION_MAX_RISKS,
  preventFalsePublishReadyStatus,
  shouldEvaluateFinalMVPCompletion,
  shouldLogPublishReadyChange,
  stabilizePublishReadyOscillation,
  validateFinalMVPCompletionSnapshot,
} from "./finalMVPCompletionGuards";
import { getFinalMVPCompletionStore } from "./finalMVPCompletionStore";
import type {
  ExecutivePublishReadinessSummary,
  FinalLaunchRisk,
  FinalMVPCompletionHistoryEntry,
  FinalMVPCompletionInput,
  FinalMVPCompletionResult,
  FinalMVPCompletionSnapshot,
  MVPCompletionSignal,
  PublishReadyStatus,
} from "./finalMVPCompletionTypes";

const DEV_LOG_PREFIX = "[Nexora][FinalMVPCompletion]";
const FINAL_MVP_ID_PREFIX = "final_mvp_completion";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function collectBlockers(input: FinalMVPCompletionInput): string[] {
  const blockers: string[] = [];
  const hardening = input.finalHardeningSnapshot;
  const gate = input.productionReadinessGate;
  const demo = input.demoModeSnapshot;
  const smoke = input.smokeTestSuite;

  if (hardening?.releaseCandidateStatus === "blocked") {
    blockers.push("Final hardening checklist has blocking failures.");
  }
  for (const b of hardening?.blockedChecks ?? []) {
    blockers.push(`Hardening blocked: ${b}`);
  }
  if (gate?.decision === "no_go") {
    blockers.push("Production readiness gate is no-go.");
  }
  for (const b of gate?.blockers ?? []) {
    blockers.push(b.summary);
  }
  if (demo?.demoState === "blocked") {
    blockers.push("Executive demo mode is blocked.");
  }
  if (smoke?.status === "fail" || (smoke?.failed ?? 0) > 0) {
    blockers.push("MVP smoke test suite has failing scenarios.");
  }
  if ((smoke?.criticalFindings.length ?? 0) > 0) {
    blockers.push("Critical smoke findings block controlled MVP publish.");
  }
  if (input.operationalReliabilitySnapshot?.trustState === "untrusted") {
    blockers.push("Runtime trust is untrusted.");
  }
  if (input.executiveInteractionStabilitySnapshot?.uiState === "unstable") {
    blockers.push("Executive UI stability is unstable.");
  }

  return Array.from(new Set(blockers)).slice(0, 12);
}

function collectRisks(input: FinalMVPCompletionInput, now: number): FinalLaunchRisk[] {
  const risks: FinalLaunchRisk[] = [];
  const hardening = input.finalHardeningSnapshot;
  const gate = input.productionReadinessGate;
  const demo = input.demoModeSnapshot;
  const smoke = input.smokeTestSuite;
  const learning = input.pilotLearningSnapshot;

  for (const r of hardening?.hardeningRisks ?? []) {
    if (r.severity === "low") continue;
    risks.push({
      riskId: stableSignature(["final-mvp-risk", r.riskId]).slice(0, 48),
      category: "hardening",
      severity: r.severity === "critical" ? "high" : "moderate",
      summary: r.summary,
      generatedAt: now,
    });
  }
  for (const r of gate?.risks ?? []) {
    risks.push({
      riskId: stableSignature(["final-mvp-risk", r.riskId]).slice(0, 48),
      category: "launch_gate",
      severity: r.severity === "major" ? "high" : "moderate",
      summary: r.summary,
      generatedAt: now,
    });
  }
  for (const r of demo?.demoRisks ?? []) {
    if (!r.visibleToExecutive) continue;
    risks.push({
      riskId: stableSignature(["final-mvp-risk", r.riskId]).slice(0, 48),
      category: "demo_mode",
      severity: r.severity === "critical" ? "high" : r.severity === "moderate" ? "moderate" : "low",
      summary: r.summary,
      generatedAt: now,
    });
  }
  if (smoke && smoke.warned > 0) {
    risks.push({
      riskId: stableSignature(["final-mvp-risk", "smoke-warn"]).slice(0, 48),
      category: "smoke_tests",
      severity: "moderate",
      summary: "Smoke validation passed with warnings — confirm before publish.",
      generatedAt: now,
    });
  }
  if (input.executiveInteractionStabilitySnapshot?.panelRuntimeReliability.panelOscillationDetected) {
    risks.push({
      riskId: stableSignature(["final-mvp-risk", "panel-latency"]).slice(0, 48),
      category: "ui_stability",
      severity: "low",
      summary: "Monitor panel transition latency during first pilot.",
      generatedAt: now,
    });
  }
  if (learning && learning.severity !== "low") {
    risks.push({
      riskId: stableSignature(["final-mvp-risk", "pilot-feedback"]).slice(0, 48),
      category: "feedback_loop",
      severity: learning.severity === "critical" ? "high" : "moderate",
      summary: "Pilot feedback highlights improvement areas before wider release.",
      generatedAt: now,
    });
  }

  const byId = new Map<string, FinalLaunchRisk>();
  for (const r of risks) byId.set(r.riskId, r);
  return Array.from(byId.values()).slice(0, FINAL_MVP_COMPLETION_MAX_RISKS);
}

function collectCompletionSignals(
  input: FinalMVPCompletionInput,
  publishReadyStatus: PublishReadyStatus,
  now: number
): MVPCompletionSignal[] {
  const signals: MVPCompletionSignal[] = [];
  const hardening = input.finalHardeningSnapshot;
  const gate = input.productionReadinessGate;
  const demo = input.demoModeSnapshot;
  const smoke = input.smokeTestSuite;

  if (hardening) {
    signals.push({
      signalId: stableSignature(["completion-signal", "hardening", hardening.signature]).slice(0, 48),
      category: "hardening",
      summary: `Final hardening: ${hardening.releaseCandidateStatus}`,
      supportive: hardening.releaseCandidateStatus === "ready" || hardening.releaseCandidateStatus === "warn",
      generatedAt: now,
    });
  }
  if (gate) {
    signals.push({
      signalId: stableSignature(["completion-signal", "gate", gate.signature]).slice(0, 48),
      category: "launch_gate",
      summary: `Launch gate: ${gate.decision}`,
      supportive: gate.decision === "go_for_demo" || gate.decision === "go_for_controlled_pilot",
      generatedAt: now,
    });
  }
  if (demo) {
    signals.push({
      signalId: stableSignature(["completion-signal", "demo", demo.signature]).slice(0, 48),
      category: "demo_mode",
      summary: `Demo mode: ${demo.demoState}`,
      supportive: demo.demoState === "demo_ready" || demo.demoState === "pilot_ready",
      generatedAt: now,
    });
  }
  if (smoke) {
    signals.push({
      signalId: stableSignature(["completion-signal", "smoke", smoke.signature]).slice(0, 48),
      category: "smoke_tests",
      summary: `Smoke suite: ${smoke.status}`,
      supportive: smoke.failed === 0 && smoke.criticalFindings.length === 0,
      generatedAt: now,
    });
  }
  signals.push({
    signalId: stableSignature(["completion-signal", "publish", publishReadyStatus]).slice(0, 48),
    category: "publish_readiness",
    summary: `Publish posture: ${publishReadyStatus}`,
    supportive: publishReadyStatus === "publish_candidate" || publishReadyStatus === "pilot_ready",
    generatedAt: now,
  });

  return signals;
}

function derivePublishReadyStatus(
  input: FinalMVPCompletionInput,
  blockers: readonly string[]
): PublishReadyStatus {
  if (blockers.length > 0) return "blocked";

  const hardening = input.finalHardeningSnapshot;
  const gate = input.productionReadinessGate;
  const demo = input.demoModeSnapshot;
  const smoke = input.smokeTestSuite;
  const operational = input.operationalReliabilitySnapshot;
  const interaction = input.executiveInteractionStabilitySnapshot;

  if (!hardening || !gate || !demo) return "not_ready";

  const smokeClean =
    smoke &&
    smoke.failed === 0 &&
    smoke.criticalFindings.length === 0 &&
    smoke.status !== "fail";
  const trustOk =
    operational?.trustState !== "untrusted" &&
    operational?.trustState !== "monitored";
  const uiOk =
    interaction?.uiState !== "unstable" &&
    (interaction?.uiState === "stable" ||
      interaction?.uiState === "production_safe" ||
      interaction?.uiState === "mvp_ready");
  const evidenceComplete = hardening.hardeningSummary.evidenceComplete;
  const hardeningOk =
    hardening.releaseCandidateStatus === "ready" ||
    (hardening.releaseCandidateStatus === "warn" && hardening.blockedChecks.length === 0);

  if (
    hardeningOk &&
    smokeClean &&
    trustOk &&
    uiOk &&
    evidenceComplete &&
    gate.decision === "go_for_controlled_pilot" &&
    demo.demoState === "pilot_ready" &&
    hardening.failedChecks.length === 0
  ) {
    return "publish_candidate";
  }

  if (
    demo.demoState === "pilot_ready" ||
    gate.decision === "go_for_controlled_pilot"
  ) {
    return "pilot_ready";
  }

  if (
    demo.demoState === "demo_ready" ||
    gate.decision === "go_for_demo"
  ) {
    return "demo_ready";
  }

  if (
    hardening.releaseCandidateStatus === "not_ready" ||
    hardening.failedChecks.length > 0
  ) {
    return "not_ready";
  }

  return "not_ready";
}

function buildSummary(
  status: PublishReadyStatus,
  blockers: readonly string[],
  risks: readonly FinalLaunchRisk[]
): string {
  if (status === "blocked") {
    return blockers[0]
      ? `Controlled MVP publish is blocked. ${blockers[0]}`
      : "Controlled MVP publish is blocked until critical validation issues are resolved.";
  }
  if (status === "publish_candidate") {
    return "Nexora is ready as a controlled MVP publish candidate. Runtime, UI, smoke tests, demo mode, and launch gate show no critical blockers.";
  }
  if (status === "pilot_ready") {
    return "Nexora is ready for a controlled pilot presentation. Complete final hardening confirmations before publish candidate sign-off.";
  }
  if (status === "demo_ready") {
    return "Nexora is ready to be shown in a controlled executive MVP demo. Publish candidate review remains pending.";
  }
  if (risks.length > 0) {
    return "Nexora is not yet a controlled MVP publish candidate. Address stabilization and validation gaps before wider release.";
  }
  return "MVP completion runtime awaiting full validation depth across hardening, launch gate, and demo mode.";
}

function buildRecommendedNextAction(status: PublishReadyStatus, blockers: readonly string[]): string {
  if (status === "blocked") {
    return blockers[0] ? `Resolve blocker: ${blockers[0]}` : "Resolve launch blockers before MVP publish review.";
  }
  if (status === "publish_candidate") {
    return "Prepare controlled MVP demo/pilot release.";
  }
  if (status === "pilot_ready") {
    return "Run final hardening checklist and confirm smoke tests before publish candidate review.";
  }
  if (status === "demo_ready") {
    return "Conduct controlled executive demo; capture pilot feedback before publish candidate decision.";
  }
  return "Complete runtime foundation, smoke validation, and launch gate evaluation.";
}

function buildExecutivePublishSummary(
  status: PublishReadyStatus,
  blockers: readonly string[],
  risks: readonly FinalLaunchRisk[],
  input: FinalMVPCompletionInput
): ExecutivePublishReadinessSummary {
  return {
    headline:
      status === "publish_candidate"
        ? "Controlled MVP publish candidate"
        : status === "blocked"
          ? "MVP publish blocked"
          : status === "pilot_ready"
            ? "Controlled pilot ready"
            : status === "demo_ready"
              ? "Controlled demo ready"
              : "MVP not ready for publish review",
    launchPosture: status,
    blockerCount: blockers.length,
    riskCount: risks.length,
    evidenceComplete: input.finalHardeningSnapshot?.hardeningSummary.evidenceComplete === true,
    controlledMvpOnly: true,
  };
}

function computeConfidence(
  status: PublishReadyStatus,
  blockers: readonly string[],
  risks: readonly FinalLaunchRisk[],
  hardeningConfidence: number | undefined
): number {
  let score = 0.52;
  if (hardeningConfidence) score += hardeningConfidence / 5;
  if (status === "publish_candidate") score += 0.12;
  if (status === "pilot_ready") score += 0.08;
  if (status === "demo_ready") score += 0.05;
  if (status === "blocked" || status === "not_ready") score -= 0.15;
  score -= blockers.length * 0.06;
  score -= risks.filter((r) => r.severity === "high").length * 0.04;
  return clampFinalMVPCompletionConfidence(score);
}

export function evaluateFinalMVPCompletion(input: FinalMVPCompletionInput): FinalMVPCompletionResult {
  if (!beginFinalMVPCompletionEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getFinalMVPCompletionStore(organizationId);
    const prior = store.getState();

    const blockers = collectBlockers(input);
    const risks = collectRisks(input, now);
    let publishReadyStatus = derivePublishReadyStatus(input, blockers);

    const evidenceComplete = input.finalHardeningSnapshot?.hardeningSummary.evidenceComplete === true;
    const hardeningBlocked = input.finalHardeningSnapshot?.releaseCandidateStatus === "blocked";

    const prevented = preventFalsePublishReadyStatus(
      publishReadyStatus,
      blockers.length > 0,
      evidenceComplete,
      hardeningBlocked
    );
    publishReadyStatus = stabilizePublishReadyOscillation(
      prevented.status,
      prior.lastPublishReadyStatus
    );

    const summary = buildSummary(publishReadyStatus, blockers, risks);
    const recommendedNextAction = buildRecommendedNextAction(publishReadyStatus, blockers);
    const executivePublishReadiness = buildExecutivePublishSummary(
      publishReadyStatus,
      blockers,
      risks,
      input
    );
    const completionSignals = collectCompletionSignals(input, publishReadyStatus, now);
    const confidence = computeConfidence(
      publishReadyStatus,
      blockers,
      risks,
      input.finalHardeningSnapshot?.confidence
    );

    const evaluationSignature = stableSignature([
      "final-mvp-completion",
      organizationId,
      publishReadyStatus,
      blockers.join("|"),
      risks.map((r) => r.riskId).join(","),
      input.finalHardeningSnapshot?.signature ?? "no-hardening",
      input.productionReadinessGate?.signature ?? "no-gate",
      input.demoModeSnapshot?.signature ?? "no-demo",
      input.smokeTestSuite?.signature ?? "no-smoke",
    ]);

    if (
      !shouldEvaluateFinalMVPCompletion(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "deduped_or_paced",
        snapshot: prior.completionSnapshots[0] ?? null,
        storeSignature: prior.signature,
      };
    }

    const snapshot: FinalMVPCompletionSnapshot = {
      finalMVPId: `${FINAL_MVP_ID_PREFIX}_${stableSignature([organizationId, evaluationSignature]).slice(0, 8)}`,
      organizationId,
      signature: evaluationSignature,
      generatedAt: now,
      publishReadyStatus,
      summary,
      blockers: Object.freeze(blockers),
      risks: Object.freeze(risks.map((r) => r.summary)),
      recommendedNextAction,
      executivePublishReadiness,
      completionSignals: Object.freeze(completionSignals),
      confidence,
    };

    if (!validateFinalMVPCompletionSnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_completion_snapshot",
        snapshot: prior.completionSnapshots[0] ?? null,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: FinalMVPCompletionHistoryEntry = {
      entryId: stableSignature(["final-mvp-history", snapshot.signature]).slice(0, 48),
      publishReadyStatus,
      headline: executivePublishReadiness.headline,
      generatedAt: now,
    };

    store.upsertCompletionSnapshots([snapshot], now);
    store.upsertReadinessHistory([historyEntry], now);
    store.upsertBlockerHistory(blockers, now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastPublishReadyStatus(publishReadyStatus);

    if (prevented.prevented) {
      devLog("false publish-ready prevention — status downgraded");
    }
    if (blockers.length > 0) {
      devLog(`publish blocker — ${blockers.length} blocker(s) visible`);
    }
    if (shouldLogPublishReadyChange(organizationId, publishReadyStatus)) {
      devLog(`publish-ready transition — ${prior.lastPublishReadyStatus ?? "none"} → ${publishReadyStatus}`);
      if (publishReadyStatus === "publish_candidate") {
        devLog("controlled MVP publish candidate — executive readiness consolidated");
      }
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      storeSignature: store.getState().signature,
    };
  } finally {
    endFinalMVPCompletionEvaluation();
  }
}
