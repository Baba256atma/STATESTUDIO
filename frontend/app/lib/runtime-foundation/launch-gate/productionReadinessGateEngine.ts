import { stableSignature } from "../../intelligence/shared/dedupe";
import type { MVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardTypes";
import { deriveMVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardUtils";
import {
  beginProductionReadinessGateEvaluation,
  clampProductionReadinessGateConfidence,
  endProductionReadinessGateEvaluation,
  preventFalseProductionReadyClaim,
  PRODUCTION_READINESS_GATE_MAX_RECOMMENDATIONS,
  PRODUCTION_READINESS_GATE_MIN_INTERACTION_DEPTH,
  shouldEvaluateProductionReadinessGate,
  shouldLogLaunchDecisionChange,
  stabilizeLaunchDecisionOscillation,
  validateMVPProductionReadinessGate,
} from "./productionReadinessGateGuards";
import { getProductionReadinessGateStore } from "./productionReadinessGateStore";
import type {
  ExecutiveLaunchRecommendation,
  LaunchBlocker,
  LaunchReadinessDecision,
  LaunchRisk,
  MVPProductionReadinessGate,
  MVPProductionReadinessGateInput,
  MVPProductionReadinessGateResult,
  ProductionReadinessCategory,
  ProductionReadinessGateHistoryEntry,
  ProductionReadinessSummary,
} from "./productionReadinessGateTypes";

const DEV_LOG_PREFIX = "[Nexora][ProductionReadinessGate]";
const GATE_ID_PREFIX = "mvp_launch_gate";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function blocker(
  category: ProductionReadinessCategory,
  severity: LaunchBlocker["severity"],
  summary: string,
  remediation: string,
  now: number
): LaunchBlocker {
  return {
    blockerId: stableSignature(["launch-blocker", category, summary]).slice(0, 48),
    category,
    severity,
    summary,
    remediation,
    generatedAt: now,
  };
}

function risk(
  category: ProductionReadinessCategory,
  severity: LaunchRisk["severity"],
  summary: string,
  now: number
): LaunchRisk {
  return {
    riskId: stableSignature(["launch-risk", category, summary]).slice(0, 48),
    category,
    severity,
    summary,
    generatedAt: now,
  };
}

function resolveReadinessStatus(input: MVPProductionReadinessGateInput): MVPReadinessStatus {
  if (input.readinessDashboardStatus) return input.readinessDashboardStatus;
  return deriveMVPReadinessStatus({
    organizationId: input.organizationId,
    foundation: input.mvpStrategicReadinessSnapshot ?? null,
    operational: input.operationalReliabilitySnapshot ?? null,
    interaction: input.executiveInteractionStabilitySnapshot ?? null,
  });
}

function resolveEvidenceDepth(input: MVPProductionReadinessGateInput): ProductionReadinessSummary["evidenceDepth"] {
  const hasFoundation = Boolean(input.mvpStrategicReadinessSnapshot);
  const hasOperational = Boolean(input.operationalReliabilitySnapshot);
  const hasInteraction = Boolean(input.executiveInteractionStabilitySnapshot);
  const hasSmoke = Boolean(input.smokeTestSuite);

  if (hasFoundation && hasOperational && hasInteraction && hasSmoke) return "full";
  if (hasFoundation || hasOperational || hasInteraction) return "partial";
  return "none";
}

function buildCategoryPosture(
  input: MVPProductionReadinessGateInput,
  blockers: readonly LaunchBlocker[],
  risks: readonly LaunchRisk[]
): ProductionReadinessSummary["categoryPosture"] {
  const blocked = new Set(blockers.map((b) => b.category));
  const atRisk = new Set(risks.filter((r) => r.severity !== "minor").map((r) => r.category));

  const posture = (
    category: ProductionReadinessCategory
  ): ProductionReadinessSummary["categoryPosture"][ProductionReadinessCategory] => {
    if (blocked.has(category)) return "blocked";
    if (atRisk.has(category)) return "at_risk";
    return "acceptable";
  };

  const foundation = input.mvpStrategicReadinessSnapshot;
  const operational = input.operationalReliabilitySnapshot;
  const interaction = input.executiveInteractionStabilitySnapshot;
  const smoke = input.smokeTestSuite;

  const categories: ProductionReadinessCategory[] = [
    "runtime_stability",
    "ui_stability",
    "panel_stability",
    "scene_stability",
    "chat_pipeline_stability",
    "smoke_test_status",
    "executive_trust",
    "explainability",
    "fallback_safety",
  ];

  const result = {} as ProductionReadinessSummary["categoryPosture"];
  for (const category of categories) {
    if (!foundation && !operational && !interaction && category !== "fallback_safety") {
      result[category] = "unknown";
      continue;
    }
    if (category === "fallback_safety" && !foundation && !operational) {
      result[category] = "unknown";
      continue;
    }
    result[category] = posture(category);
  }

  if (!smoke && result.smoke_test_status !== "blocked") {
    result.smoke_test_status = "unknown";
  }
  if (!interaction && result.ui_stability !== "blocked") {
    result.ui_stability = "unknown";
    result.panel_stability = "unknown";
    result.scene_stability = "unknown";
    result.chat_pipeline_stability = "unknown";
  }

  return result;
}

function collectBlockersAndRisks(
  input: MVPProductionReadinessGateInput,
  readinessStatus: MVPReadinessStatus,
  now: number
): { blockers: LaunchBlocker[]; risks: LaunchRisk[] } {
  const blockers: LaunchBlocker[] = [];
  const risks: LaunchRisk[] = [];

  const foundation = input.mvpStrategicReadinessSnapshot;
  const operational = input.operationalReliabilitySnapshot;
  const interaction = input.executiveInteractionStabilitySnapshot;
  const smoke = input.smokeTestSuite;
  const evidenceDepth = resolveEvidenceDepth(input);

  if (evidenceDepth === "none") {
    blockers.push(
      blocker(
        "fallback_safety",
        "critical",
        "Insufficient runtime validation evidence for launch assessment.",
        "Allow governance cognition and smoke validation to complete before launch decision.",
        now
      )
    );
  }

  if (smoke) {
    const criticalCount = smoke.criticalFindings.length;
    if (smoke.status === "fail" || smoke.failed > 0) {
      blockers.push(
        blocker(
          "smoke_test_status",
          "critical",
          "MVP smoke validation reported failing scenarios.",
          "Resolve failing smoke scenarios before executive MVP launch.",
          now
        )
      );
    } else if (criticalCount > 0) {
      blockers.push(
        blocker(
          "smoke_test_status",
          "critical",
          `${criticalCount} critical smoke finding(s) detected.`,
          "Address critical smoke findings before demo or pilot.",
          now
        )
      );
    } else if (smoke.warned > 0) {
      risks.push(
        risk(
          "smoke_test_status",
          "moderate",
          "Smoke validation passed with warnings — review before MVP demo.",
          now
        )
      );
    }
  } else if (evidenceDepth !== "none") {
    risks.push(
      risk(
        "smoke_test_status",
        "moderate",
        "Smoke test suite not evaluated — launch evidence incomplete.",
        now
      )
    );
  }

  if (operational?.trustState === "untrusted") {
    blockers.push(
      blocker(
        "executive_trust",
        "critical",
        "Executive runtime trust is untrusted.",
        "Stabilize operational reliability and trust signals before launch.",
        now
      )
    );
  } else if (operational?.trustState === "monitored") {
    risks.push(
      risk(
        "executive_trust",
        "moderate",
        "Runtime trust remains under monitoring.",
        now
      )
    );
  }

  if (interaction?.panelRuntimeReliability.panelFlashDetected) {
    blockers.push(
      blocker(
        "panel_stability",
        "high",
        "Panel flash detected — executive panel stability at risk.",
        "Verify panel transitions and eliminate flash before demo.",
        now
      )
    );
  } else if (interaction?.panelRuntimeReliability.panelOscillationDetected) {
    risks.push(
      risk(
        "panel_stability",
        "minor",
        "Monitor panel transition latency during demo.",
        now
      )
    );
  }

  if (interaction?.sceneInteractionReliability.reactionWithoutContract) {
    blockers.push(
      blocker(
        "scene_stability",
        "high",
        "Scene reaction drift without valid contract.",
        "Confirm scene contract alignment before launch.",
        now
      )
    );
  }

  if (interaction?.chatInteractionReliability.chatPanelSceneLoopRisk) {
    blockers.push(
      blocker(
        "chat_pipeline_stability",
        "high",
        "Chat → panel → scene feedback loop risk detected.",
        "Validate chat pipeline dedupe and panel update contract.",
        now
      )
    );
  } else if (interaction?.chatInteractionReliability.duplicatePanelUpdateForSameInput) {
    blockers.push(
      blocker(
        "chat_pipeline_stability",
        "high",
        "Duplicate panel updates for the same chat input.",
        "Verify chat pipeline signature dedupe before launch.",
        now
      )
    );
  }

  if (foundation?.runtimeStatus === "unstable") {
    blockers.push(
      blocker(
        "runtime_stability",
        "critical",
        "Runtime foundation reports unstable posture.",
        "Stabilize enterprise runtime foundation before launch.",
        now
      )
    );
  }

  if (interaction?.uiState === "unstable") {
    blockers.push(
      blocker(
        "ui_stability",
        "high",
        "Executive UI stability is unstable.",
        "Resolve UI instability signals before MVP launch.",
        now
      )
    );
  }

  if (readinessStatus === "not_ready") {
    blockers.push(
      blocker(
        "fallback_safety",
        "high",
        "MVP readiness dashboard reports not ready.",
        "Improve runtime health until readiness reaches monitored or better.",
        now
      )
    );
  }

  const explainabilityAvailable =
    input.explainabilityAvailable ??
    Boolean(input.cognitionSnapshot?.organizationalLearningLine?.trim());
  if (!explainabilityAvailable && evidenceDepth !== "none") {
    risks.push(
      risk(
        "explainability",
        "moderate",
        "Explainability signals limited — executive rationale may be thin.",
        now
      )
    );
  }

  if (evidenceDepth === "partial") {
    risks.push(
      risk(
        "fallback_safety",
        "moderate",
        "Partial validation evidence — launch decision is conservative.",
        now
      )
    );
  }

  return { blockers, risks };
}

function deriveLaunchDecision(
  blockers: readonly LaunchBlocker[],
  risks: readonly LaunchRisk[],
  input: MVPProductionReadinessGateInput,
  readinessStatus: MVPReadinessStatus,
  evidenceDepth: ProductionReadinessSummary["evidenceDepth"]
): LaunchReadinessDecision {
  const criticalBlockers = blockers.filter((b) => b.severity === "critical");
  const smoke = input.smokeTestSuite;
  const smokeFailed = smoke?.status === "fail" || (smoke?.failed ?? 0) > 0;
  const smokeCritical = (smoke?.criticalFindings.length ?? 0) > 0;

  if (criticalBlockers.length > 0 || smokeFailed || smokeCritical) return "no_go";
  if (blockers.length > 0) return "no_go";

  if (evidenceDepth !== "full") return "conditional_go";
  if (readinessStatus === "not_ready" || readinessStatus === "monitored") return "conditional_go";

  const operational = input.operationalReliabilitySnapshot;
  const interaction = input.executiveInteractionStabilitySnapshot;

  const trustStable =
    operational?.trustState === "trusted" || operational?.trustState === "executive_grade";
  const uiStable =
    interaction?.uiState === "stable" ||
    interaction?.uiState === "production_safe" ||
    interaction?.uiState === "mvp_ready";
  const runtimeStable =
    input.mvpStrategicReadinessSnapshot?.runtimeStatus !== "unstable" &&
    input.mvpStrategicReadinessSnapshot?.runtimeStatus !== "stabilizing";
  const smokeClean = smoke?.status === "pass" && smoke.failed === 0 && smoke.criticalFindings.length === 0;
  const smokeAcceptable =
    smoke &&
    smoke.failed === 0 &&
    smoke.criticalFindings.length === 0 &&
    (smoke.status === "pass" || smoke.status === "warn");

  if (trustStable && uiStable && runtimeStable && smokeClean && risks.length === 0) {
    return "go_for_controlled_pilot";
  }

  if (smokeAcceptable && risks.filter((r) => r.severity === "major").length === 0) {
    return "go_for_demo";
  }

  return "conditional_go";
}

function buildLaunchSummary(decision: LaunchReadinessDecision, blockers: readonly LaunchBlocker[]): string {
  if (decision === "no_go") {
    return blockers[0]
      ? `Nexora is not ready for MVP launch. ${blockers[0].summary}`
      : "Nexora is not ready for MVP launch. Critical validation blockers must be resolved first.";
  }
  if (decision === "conditional_go") {
    return "Nexora may proceed with caution. Runtime validation is incomplete or elevated risks remain — executive review required before demo or pilot.";
  }
  if (decision === "go_for_demo") {
    return "Nexora is ready for a controlled MVP demo. Runtime behavior is stable, smoke tests show no critical blockers, and executive interaction reliability is acceptable.";
  }
  return "Nexora is ready for a controlled pilot. Runtime trust, UI stability, and smoke validation evidence support a bounded executive pilot.";
}

function buildLaunchRecommendation(
  decision: LaunchReadinessDecision,
  evidenceComplete: boolean,
  falseReadyPrevented: boolean
): ExecutiveLaunchRecommendation {
  const headlines: Record<LaunchReadinessDecision, string> = {
    no_go: "No-go — stabilize before launch",
    conditional_go: "Conditional go — executive review required",
    go_for_demo: "Go for controlled MVP demo",
    go_for_controlled_pilot: "Go for controlled pilot",
  };

  const rationales: Record<LaunchReadinessDecision, string> = {
    no_go: "Launch blockers or failed smoke validation prevent safe executive MVP exposure.",
    conditional_go: "Partial evidence or elevated risks require additional checks before launch commitment.",
    go_for_demo: "Validation evidence supports a bounded demo without claiming full production readiness.",
    go_for_controlled_pilot:
      "Trust, UI, and smoke signals are clean enough for a controlled pilot with continued monitoring.",
  };

  return {
    decision,
    headline: headlines[decision],
    rationale: rationales[decision],
    evidenceComplete,
    falseReadyPrevented,
  };
}

function buildRecommendedNextChecks(
  input: MVPProductionReadinessGateInput,
  decision: LaunchReadinessDecision,
  blockers: readonly LaunchBlocker[],
  risks: readonly LaunchRisk[]
): string[] {
  const checks: string[] = [];

  if (input.smokeTestSuite?.recommendations.length) {
    checks.push(...input.smokeTestSuite.recommendations.slice(0, 2));
  }

  if (decision === "no_go" && blockers[0]) {
    checks.push(blockers[0].remediation);
  }

  if (risks.some((r) => r.category === "panel_stability")) {
    checks.push("Verify no panel flash after next UI change.");
  }
  if (decision !== "no_go") {
    checks.push("Run repeat analyze flow before demo.");
  }
  if (!input.smokeTestSuite) {
    checks.push("Run MVP smoke validation suite before executive launch decision.");
  }
  if (decision === "go_for_controlled_pilot") {
    checks.push("Confirm readiness dashboard fallback behavior under missing signals.");
  }
  if (decision === "conditional_go") {
    checks.push("Complete smoke validation and resolve partial evidence gaps.");
  }

  return Array.from(new Set(checks)).slice(0, PRODUCTION_READINESS_GATE_MAX_RECOMMENDATIONS);
}

function computeGateConfidence(
  evidenceDepth: ProductionReadinessSummary["evidenceDepth"],
  decision: LaunchReadinessDecision,
  blockerCount: number,
  riskCount: number,
  foundationConfidence: number | undefined,
  operationalConfidence: number | undefined,
  interactionConfidence: number | undefined
): number {
  let score = 0.55;
  if (evidenceDepth === "full") score += 0.18;
  else if (evidenceDepth === "partial") score += 0.08;

  const confidences = [foundationConfidence, operationalConfidence, interactionConfidence].filter(
    (c): c is number => typeof c === "number"
  );
  if (confidences.length > 0) {
    score += confidences.reduce((a, b) => a + b, 0) / confidences.length / 10;
  }

  if (decision === "go_for_controlled_pilot") score += 0.06;
  if (decision === "go_for_demo") score += 0.04;
  if (decision === "conditional_go") score -= 0.06;
  if (decision === "no_go") score -= 0.12;
  score -= blockerCount * 0.08;
  score -= riskCount * 0.02;

  return clampProductionReadinessGateConfidence(score);
}

export function evaluateMVPProductionReadinessGate(
  input: MVPProductionReadinessGateInput
): MVPProductionReadinessGateResult {
  if (!beginProductionReadinessGateEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      gate: null,
      blockerCount: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getProductionReadinessGateStore(organizationId);
    const prior = store.getState();

    const interactionDepth = input.executiveInteractionStabilitySnapshot ? 1 : 0;
    if (interactionDepth < PRODUCTION_READINESS_GATE_MIN_INTERACTION_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_interaction_depth",
        gate: prior.readinessGates[0] ?? null,
        blockerCount: 0,
        storeSignature: prior.signature,
      };
    }

    const readinessStatus = resolveReadinessStatus(input);
    const evidenceDepth = resolveEvidenceDepth(input);
    const evidenceComplete = evidenceDepth === "full";

    const { blockers, risks } = collectBlockersAndRisks(input, readinessStatus, now);
    const dedupedBlockers = Array.from(
      new Map(blockers.map((b) => [b.blockerId, b])).values()
    ).slice(0, 12);
    const dedupedRisks = Array.from(new Map(risks.map((r) => [r.riskId, r])).values()).slice(0, 12);

    let proposedDecision = deriveLaunchDecision(
      dedupedBlockers,
      dedupedRisks,
      input,
      readinessStatus,
      evidenceDepth
    );

    const smokeFailed =
      input.smokeTestSuite?.status === "fail" || (input.smokeTestSuite?.failed ?? 0) > 0;
    const criticalBlockerCount = dedupedBlockers.filter((b) => b.severity === "critical").length;

    const falseReady = preventFalseProductionReadyClaim(
      proposedDecision,
      evidenceComplete,
      criticalBlockerCount,
      smokeFailed
    );
    proposedDecision = falseReady.decision;

    const decision = stabilizeLaunchDecisionOscillation(
      proposedDecision,
      prior.lastLaunchDecision
    );

    const launchRecommendation = buildLaunchRecommendation(
      decision,
      evidenceComplete,
      falseReady.falseReadyPrevented
    );

    const readinessSummary: ProductionReadinessSummary = {
      readinessStatus,
      smokeSuiteStatus: input.smokeTestSuite?.status ?? "not_evaluated",
      trustState: input.operationalReliabilitySnapshot?.trustState ?? "unknown",
      uiState: input.executiveInteractionStabilitySnapshot?.uiState ?? "unknown",
      foundationRuntimeStatus:
        input.mvpStrategicReadinessSnapshot?.runtimeStatus ?? "unknown",
      evidenceDepth,
      categoryPosture: buildCategoryPosture(input, dedupedBlockers, dedupedRisks),
    };

    const confidence = computeGateConfidence(
      evidenceDepth,
      decision,
      dedupedBlockers.length,
      dedupedRisks.length,
      input.mvpStrategicReadinessSnapshot?.confidence,
      input.operationalReliabilitySnapshot?.confidence,
      input.executiveInteractionStabilitySnapshot?.confidence
    );

    const summary = buildLaunchSummary(decision, dedupedBlockers);
    const recommendedNextChecks = buildRecommendedNextChecks(
      input,
      decision,
      dedupedBlockers,
      dedupedRisks
    );

    const evaluationSignature = stableSignature([
      "mvp-production-readiness-gate",
      organizationId,
      decision,
      dedupedBlockers.map((b) => b.blockerId).join(","),
      dedupedRisks.map((r) => r.riskId).join(","),
      input.smokeTestSuite?.signature ?? "no-smoke",
      readinessStatus,
      evidenceDepth,
    ]);

    if (
      !shouldEvaluateProductionReadinessGate(
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
        gate: prior.readinessGates[0] ?? null,
        blockerCount: dedupedBlockers.length,
        storeSignature: prior.signature,
      };
    }

    const gate: MVPProductionReadinessGate = {
      gateId: `${GATE_ID_PREFIX}_${stableSignature([organizationId, evaluationSignature]).slice(0, 8)}`,
      organizationId,
      signature: evaluationSignature,
      generatedAt: now,
      decision,
      summary,
      blockers: Object.freeze(dedupedBlockers),
      risks: Object.freeze(dedupedRisks),
      recommendedNextChecks: Object.freeze(recommendedNextChecks),
      launchRecommendation,
      readinessSummary,
      confidence,
    };

    if (!validateMVPProductionReadinessGate(gate)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_readiness_gate",
        gate: prior.readinessGates[0] ?? null,
        blockerCount: dedupedBlockers.length,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: ProductionReadinessGateHistoryEntry = {
      entryId: stableSignature(["launch-gate-history", gate.signature]).slice(0, 48),
      decision,
      blockerCount: dedupedBlockers.length,
      headline: launchRecommendation.headline,
      generatedAt: now,
    };

    store.upsertReadinessGates([gate], now);
    store.upsertBlockerHistory(dedupedBlockers, now);
    store.upsertLaunchRiskHistory(dedupedRisks, now);
    store.upsertGateHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastLaunchDecision(decision);

    if (falseReady.falseReadyPrevented) {
      devLog("false-ready prevention — inflated launch posture downgraded");
    }

    if (dedupedBlockers.length > 0) {
      devLog(`blocker detection — ${dedupedBlockers.length} launch blocker(s) active`);
    } else if (dedupedBlockers.length === 0 && prior.blockerHistory.length > 0) {
      devLog("blocker clearance — prior launch blockers no longer active");
    }

    if (shouldLogLaunchDecisionChange(organizationId, decision)) {
      devLog(`launch decision — ${prior.lastLaunchDecision ?? "none"} → ${decision}`);
      if (decision === "go_for_demo" || decision === "go_for_controlled_pilot") {
        devLog(`go-for-demo transition — executive launch posture ${decision}`);
      }
    }

    return {
      evaluated: true,
      skipped: false,
      gate,
      blockerCount: dedupedBlockers.length,
      storeSignature: store.getState().signature,
    };
  } finally {
    endProductionReadinessGateEvaluation();
  }
}
