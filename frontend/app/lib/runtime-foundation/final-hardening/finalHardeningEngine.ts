import { stableSignature } from "../../intelligence/shared/dedupe";
import { FINAL_STABILIZATION_CHECKLIST_DEFINITIONS } from "./finalStabilizationChecklist";
import {
  beginFinalHardeningEvaluation,
  clampFinalHardeningConfidence,
  endFinalHardeningEvaluation,
  FINAL_HARDENING_MAX_RECOMMENDATIONS,
  preventFalseReleaseCandidateStatus,
  shouldEvaluateFinalHardening,
  shouldLogReleaseCandidateChange,
  stabilizeReleaseCandidateOscillation,
  validateMVPFinalHardeningSnapshot,
} from "./finalHardeningGuards";
import { getFinalHardeningStore } from "./finalHardeningStore";
import type {
  FinalHardeningHistoryEntry,
  FinalHardeningSummary,
  FinalStabilizationChecklist,
  HardeningCheckStatus,
  HardeningRisk,
  MVPFinalHardeningInput,
  MVPFinalHardeningResult,
  MVPFinalHardeningSnapshot,
  MVPReleaseCandidateStatus,
  ProductionCandidateCheck,
} from "./finalStabilizationChecklistTypes";

const DEV_LOG_PREFIX = "[Nexora][FinalHardening]";
const HARDENING_ID_PREFIX = "mvp_final_hardening";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function manualStatus(
  input: MVPFinalHardeningInput,
  key: keyof NonNullable<MVPFinalHardeningInput["manualValidation"]>
): HardeningCheckStatus {
  return input.manualValidation?.[key] ?? "not_checked";
}

function evaluateCheck(
  definitionId: string,
  input: MVPFinalHardeningInput
): { status: HardeningCheckStatus; summary: string } {
  const interaction = input.executiveInteractionStabilitySnapshot;
  const operational = input.operationalReliabilitySnapshot;
  const smoke = input.smokeTestSuite;
  const gate = input.productionReadinessGate;
  const demo = input.demoModeSnapshot;
  const learning = input.pilotLearningSnapshot;
  const readiness = input.readinessDashboardStatus;

  switch (definitionId) {
    case "lint_validation": {
      const status = manualStatus(input, "lintValidation");
      return {
        status,
        summary:
          status === "pass"
            ? "Lint validation reported passing."
            : status === "fail"
              ? "Lint validation reported failures — resolve before release candidate."
              : "Run npm run lint and confirm no blocking errors.",
      };
    }
    case "type_validation": {
      const status = manualStatus(input, "typeValidation");
      return {
        status,
        summary:
          status === "pass"
            ? "Type validation reported passing."
            : status === "fail"
              ? "Type validation reported errors — resolve before release candidate."
              : "Run npx tsc --noEmit and confirm no new errors.",
      };
    }
    case "build_validation": {
      const status = manualStatus(input, "buildValidation");
      return {
        status,
        summary:
          status === "pass"
            ? "Build validation reported passing."
            : status === "not_checked"
              ? "Confirm frontend build before wider release."
              : "Build validation requires attention.",
      };
    }
    case "no_panel_flash": {
      if (!interaction) return { status: "not_checked", summary: "Interaction stability depth required." };
      if (interaction.panelRuntimeReliability.panelFlashDetected) {
        return { status: "fail", summary: "Panel flash detected — stabilize before MVP candidate." };
      }
      if (interaction.panelRuntimeReliability.panelOscillationDetected) {
        return { status: "warn", summary: "Panel transition latency should be monitored." };
      }
      return { status: "pass", summary: "No panel flash detected." };
    }
    case "scene_contract_aligned": {
      if (!interaction) return { status: "not_checked", summary: "Interaction stability depth required." };
      if (interaction.sceneInteractionReliability.reactionWithoutContract) {
        return { status: "fail", summary: "Scene contract mismatch detected." };
      }
      if (!interaction.sceneInteractionReliability.sceneContractValid) {
        return { status: "warn", summary: "Scene contract validity should be confirmed." };
      }
      return { status: "pass", summary: "Scene contract aligned." };
    }
    case "chat_pipeline_deduped": {
      if (!interaction) return { status: "not_checked", summary: "Interaction stability depth required." };
      if (
        interaction.chatInteractionReliability.duplicatePanelUpdateForSameInput ||
        !interaction.chatInteractionReliability.chatPipelineDeduped
      ) {
        return { status: "fail", summary: "Duplicate chat pipeline reaction detected." };
      }
      if (interaction.chatInteractionReliability.chatPanelSceneLoopRisk) {
        return { status: "warn", summary: "Chat → panel → scene loop risk — verify dedupe." };
      }
      return { status: "pass", summary: "Chat pipeline dedupe stable." };
    }
    case "selection_context_persists": {
      if (!interaction) return { status: "not_checked", summary: "Interaction stability depth required." };
      const selectionOk = interaction.productionSafeUISummary.selectionState === "preserved";
      if (interaction.productionSafeUISummary.selectionState === "at_risk") {
        return { status: "fail", summary: "Selection context at risk during analysis." };
      }
      return selectionOk
        ? { status: "pass", summary: "Selection context persists." }
        : { status: "warn", summary: "Selection context should be verified manually." };
    }
    case "readiness_dashboard_operational": {
      if (!readiness) return { status: "not_checked", summary: "Readiness dashboard status unavailable." };
      if (readiness === "not_ready") {
        return { status: "fail", summary: "Readiness dashboard reports not ready." };
      }
      return readiness === "mvp_ready" || readiness === "stable"
        ? { status: "pass", summary: "Readiness dashboard operational." }
        : { status: "warn", summary: "Readiness dashboard monitored — confirm fallback behavior." };
    }
    case "smoke_tests_no_critical": {
      if (!smoke) return { status: "not_checked", summary: "Run MVP smoke test suite." };
      if (smoke.status === "fail" || smoke.failed > 0) {
        return { status: "blocked", summary: "Smoke test suite has failing scenarios." };
      }
      if (smoke.criticalFindings.length > 0) {
        return { status: "blocked", summary: "Critical smoke findings block release candidate." };
      }
      if (smoke.warned > 0) return { status: "warn", summary: "Smoke tests passed with warnings." };
      return { status: "pass", summary: "Smoke tests clean." };
    }
    case "launch_gate_demo_ready": {
      if (!gate) return { status: "not_checked", summary: "Production readiness gate not evaluated." };
      if (gate.decision === "no_go") {
        return { status: "blocked", summary: "Launch gate no-go blocks release candidate." };
      }
      if (gate.decision === "conditional_go") {
        return { status: "warn", summary: "Launch gate conditional — executive review required." };
      }
      if (gate.decision === "go_for_demo" || gate.decision === "go_for_controlled_pilot") {
        return { status: "pass", summary: `Launch gate ${gate.decision} supports MVP candidate.` };
      }
      return { status: "warn", summary: "Launch gate posture unclear." };
    }
    case "demo_mode_ready": {
      if (!demo) return { status: "not_checked", summary: "Demo mode snapshot unavailable." };
      if (demo.demoState === "blocked") {
        return { status: "blocked", summary: "Demo mode blocked — not safe for executive presentation." };
      }
      if (demo.demoState === "monitored" || demo.demoState === "disabled") {
        return { status: "warn", summary: "Demo mode monitored only — not demo_ready." };
      }
      if (demo.demoState === "demo_ready" || demo.demoState === "pilot_ready") {
        return { status: "pass", summary: `Demo mode ${demo.demoState}.` };
      }
      return { status: "warn", summary: "Demo mode posture needs review." };
    }
    case "feedback_loop_safe": {
      if (!learning) {
        return { status: "warn", summary: "Pilot feedback loop not evaluated — capture remains optional." };
      }
      if (learning.severity === "critical") {
        return { status: "fail", summary: "Pilot feedback indicates critical improvement areas." };
      }
      return { status: "pass", summary: "Feedback loop operating safely with bounded capture." };
    }
    case "fallback_no_crash": {
      const gateEvidence = gate?.readinessSummary.evidenceDepth;
      if (gateEvidence === "none") {
        return { status: "warn", summary: "Insufficient evidence — fallback monitored, not falsely ready." };
      }
      if (readiness === "not_ready" && !interaction) {
        return { status: "pass", summary: "Missing signals fallback to not_ready without crash." };
      }
      return { status: "pass", summary: "Fallback states avoid false ready claims." };
    }
    case "no_false_production_ready": {
      if (!gate) return { status: "not_checked", summary: "Launch gate required for false-ready check." };
      const falseReady =
        gate.launchRecommendation.falseReadyPrevented ||
        (gate.decision === "go_for_controlled_pilot" && gate.readinessSummary.evidenceDepth !== "full");
      if (falseReady) {
        return { status: "pass", summary: "False production-ready claim prevented." };
      }
      if (gate.decision === "go_for_controlled_pilot" && gate.blockers.length === 0) {
        return { status: "pass", summary: "Release posture backed by evidence." };
      }
      if (demo?.demoState === "pilot_ready" && gate.decision === "no_go") {
        return { status: "fail", summary: "Demo pilot_ready conflicts with launch gate no_go." };
      }
      return { status: "warn", summary: "Verify launch and demo posture alignment." };
    }
    case "runtime_stability": {
      if (!operational) return { status: "not_checked", summary: "Operational reliability depth required." };
      if (operational.reliabilityLevel === "weak") {
        return { status: "fail", summary: "Operational reliability weak." };
      }
      return operational.reliabilityLevel === "stable" ||
        operational.reliabilityLevel === "production_ready"
        ? { status: "pass", summary: "Runtime stability acceptable." }
        : { status: "warn", summary: "Runtime stability monitored." };
    }
    case "ui_stability": {
      if (!interaction) return { status: "not_checked", summary: "UI stability depth required." };
      if (interaction.uiState === "unstable") {
        return { status: "fail", summary: "Executive UI unstable." };
      }
      return ["stable", "production_safe", "mvp_ready"].includes(interaction.uiState)
        ? { status: "pass", summary: "UI stability acceptable for MVP candidate." }
        : { status: "warn", summary: "UI stability monitored." };
    }
    case "trust_readiness": {
      if (!operational) return { status: "not_checked", summary: "Trust signals unavailable." };
      if (operational.trustState === "untrusted") {
        return { status: "fail", summary: "Runtime trust untrusted." };
      }
      return operational.trustState === "trusted" || operational.trustState === "executive_grade"
        ? { status: "pass", summary: "Trust readiness acceptable." }
        : { status: "warn", summary: "Trust under monitoring." };
    }
    case "explainability_available": {
      const available = input.explainabilityAvailable === true;
      return available
        ? { status: "pass", summary: "Explainability signals available." }
        : { status: "warn", summary: "Explainability limited — executive rationale may be thin." };
    }
    case "manual_smoke_confirmation":
      return {
        status: "not_checked",
        summary: "Manually verify repeat analyze and panel transitions before release.",
      };
    case "panel_transition_latency": {
      if (!interaction) return { status: "not_checked", summary: "Panel stability depth required." };
      return interaction.panelRuntimeReliability.panelOscillationDetected
        ? { status: "warn", summary: "Monitor panel transition latency during executive analyze flow." }
        : { status: "pass", summary: "Panel transitions within acceptable bounds." };
    }
    default:
      return { status: "not_checked", summary: "Check not evaluated." };
  }
}

function buildProductionChecks(input: MVPFinalHardeningInput): ProductionCandidateCheck[] {
  return FINAL_STABILIZATION_CHECKLIST_DEFINITIONS.map((def) => {
    const result = evaluateCheck(def.checkId, input);
    return {
      checkId: def.checkId,
      category: def.category,
      title: def.title,
      status: result.status,
      summary: result.summary,
      required: def.required,
    };
  });
}

function buildChecklist(checks: readonly ProductionCandidateCheck[]): FinalStabilizationChecklist {
  return {
    checklistId: stableSignature(["final-stabilization-checklist", checks.map((c) => `${c.checkId}:${c.status}`).join(",")]).slice(
      0,
      48
    ),
    checks: Object.freeze(checks),
    passedCount: checks.filter((c) => c.status === "pass").length,
    warningCount: checks.filter((c) => c.status === "warn").length,
    failedCount: checks.filter((c) => c.status === "fail").length,
    blockedCount: checks.filter((c) => c.status === "blocked").length,
    notCheckedCount: checks.filter((c) => c.status === "not_checked").length,
  };
}

function deriveReleaseCandidateStatus(
  checklist: FinalStabilizationChecklist,
  checks: readonly ProductionCandidateCheck[]
): MVPReleaseCandidateStatus {
  const requiredChecks = checks.filter((c) => c.required);
  if (requiredChecks.some((c) => c.status === "blocked")) return "blocked";
  if (requiredChecks.some((c) => c.status === "fail")) return "not_ready";
  if (checks.every((c) => c.status === "not_checked")) return "not_checked";

  const requiredPass = requiredChecks.every(
    (c) => c.status === "pass" || (!c.required && c.status === "warn")
  );
  const allRequiredGreen = requiredChecks.every((c) => c.status === "pass");
  const hasWarn =
    checks.some((c) => c.status === "warn" || c.status === "not_checked") ||
    checklist.notCheckedCount > 0;

  if (allRequiredGreen && !hasWarn) return "ready";
  if (requiredPass && hasWarn) return "warn";
  if (requiredChecks.some((c) => c.status === "warn" || c.status === "not_checked")) return "warn";
  return "not_ready";
}

function collectOutputKeys(
  checks: readonly ProductionCandidateCheck[]
): {
  passed: string[];
  warning: string[];
  blocked: string[];
  failed: string[];
} {
  const passed: string[] = [];
  const warning: string[] = [];
  const blocked: string[] = [];
  const failed: string[] = [];

  for (const check of checks) {
    const def = FINAL_STABILIZATION_CHECKLIST_DEFINITIONS.find((d) => d.checkId === check.checkId);
    const key = def?.outputKey ?? check.checkId;
    if (check.status === "pass") passed.push(key);
    else if (check.status === "warn" || check.status === "not_checked") warning.push(key);
    else if (check.status === "blocked") blocked.push(key);
    else if (check.status === "fail") failed.push(key);
  }

  return {
    passed: Array.from(new Set(passed)),
    warning: Array.from(new Set(warning)),
    blocked: Array.from(new Set(blocked)),
    failed: Array.from(new Set(failed)),
  };
}

function collectHardeningRisks(
  checks: readonly ProductionCandidateCheck[],
  now: number
): HardeningRisk[] {
  const risks: HardeningRisk[] = [];
  for (const check of checks) {
    if (check.status === "pass") continue;
    const severity =
      check.status === "blocked" || check.status === "fail"
        ? check.status === "blocked"
          ? "critical"
          : "high"
        : check.status === "warn"
          ? "moderate"
          : "low";
    risks.push({
      riskId: stableSignature(["hardening-risk", check.checkId, check.summary]).slice(0, 48),
      category: check.category,
      severity,
      summary: check.summary,
      generatedAt: now,
    });
  }
  return risks.slice(0, 12);
}

function buildRecommendedNextChecks(
  checks: readonly ProductionCandidateCheck[],
  output: ReturnType<typeof collectOutputKeys>
): string[] {
  const recommendations: string[] = [];

  if (output.warning.includes("lint_validation") || checks.find((c) => c.checkId === "lint_validation")?.status === "not_checked") {
    recommendations.push("Run npm run lint.");
  }
  if (output.warning.includes("type_validation") || checks.find((c) => c.checkId === "type_validation")?.status === "not_checked") {
    recommendations.push("Run npx tsc --noEmit.");
  }
  if (output.warning.includes("smoke_tests") || output.blocked.includes("smoke_tests")) {
    recommendations.push("Run MVP smoke test suite.");
  }
  if (output.warning.includes("panel_transition_latency") || output.failed.includes("no_panel_flash")) {
    recommendations.push("Verify no panel flash during executive analyze flow.");
  }
  if (output.blocked.includes("launch_gate")) {
    recommendations.push("Resolve launch gate blockers before MVP production candidate review.");
  }
  if (output.warning.includes("manual_smoke_test_confirmation")) {
    recommendations.push("Confirm repeat analyze flow manually after next UI change.");
  }

  const fromGate = checks.find((c) => c.checkId === "launch_gate_demo_ready");
  if (fromGate?.status === "warn") {
    recommendations.push("Complete executive launch review before production candidate sign-off.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Re-run MVP smoke validation and final hardening before wider release.");
  }

  return Array.from(new Set(recommendations)).slice(0, FINAL_HARDENING_MAX_RECOMMENDATIONS);
}

function buildSummary(
  status: MVPReleaseCandidateStatus,
  checklist: FinalStabilizationChecklist
): string {
  if (status === "blocked") {
    return `MVP production candidate blocked. ${checklist.blockedCount} blocking check(s) must be resolved before release.`;
  }
  if (status === "ready") {
    return "Nexora meets MVP production candidate hardening checks. No critical blockers detected — proceed with controlled release review.";
  }
  if (status === "warn") {
    return "Nexora is close to MVP production candidate status. No critical blockers found, but final panel stability and smoke test confirmation are still required.";
  }
  if (status === "not_ready") {
    return "Nexora is not yet an MVP production candidate. Stabilization failures must be addressed before wider release.";
  }
  return "Final hardening checklist awaiting validation signals and manual confirmations.";
}

function buildHardeningSummary(
  checklist: FinalStabilizationChecklist,
  risks: readonly HardeningRisk[],
  gate: MVPFinalHardeningInput["productionReadinessGate"]
): FinalHardeningSummary {
  return {
    headline:
      checklist.blockedCount > 0
        ? "Release blockers detected"
        : checklist.failedCount > 0
          ? "Stabilization gaps remain"
          : checklist.warningCount > 0
            ? "Approaching MVP production candidate"
            : "MVP hardening checks satisfied",
    releaseBlockerCount: checklist.blockedCount,
    stabilizationWarningCount: checklist.warningCount + checklist.notCheckedCount,
    productionCandidateGapCount: checklist.failedCount,
    evidenceComplete: gate?.readinessSummary.evidenceDepth === "full",
  };
}

function computeConfidence(
  checklist: FinalStabilizationChecklist,
  status: MVPReleaseCandidateStatus
): number {
  let score = 0.5 + (checklist.passedCount / Math.max(checklist.checks.length, 1)) * 0.35;
  if (status === "ready") score += 0.08;
  if (status === "warn") score += 0.02;
  if (status === "blocked" || status === "not_ready") score -= 0.15;
  score -= checklist.blockedCount * 0.08;
  score -= checklist.failedCount * 0.05;
  score -= checklist.notCheckedCount * 0.02;
  return clampFinalHardeningConfidence(score);
}

export function evaluateMVPFinalHardening(input: MVPFinalHardeningInput): MVPFinalHardeningResult {
  if (!beginFinalHardeningEvaluation()) {
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
    const store = getFinalHardeningStore(organizationId);
    const prior = store.getState();

    const checks = buildProductionChecks(input);
    const checklist = buildChecklist(checks);
    let releaseCandidateStatus = deriveReleaseCandidateStatus(checklist, checks);
    const output = collectOutputKeys(checks);
    const hardeningRisks = collectHardeningRisks(checks, now);

    const hasCriticalBlocker = checklist.blockedCount > 0;
    const requiredFailures = checks.filter((c) => c.required && c.status === "fail").length;
    const falseReadyRisk =
      input.demoModeSnapshot?.demoState === "pilot_ready" &&
      input.productionReadinessGate?.decision === "no_go";

    const prevented = preventFalseReleaseCandidateStatus(
      releaseCandidateStatus,
      hasCriticalBlocker,
      falseReadyRisk,
      requiredFailures
    );
    releaseCandidateStatus = stabilizeReleaseCandidateOscillation(
      prevented.status,
      prior.lastReleaseCandidateStatus
    );

    const summary = buildSummary(releaseCandidateStatus, checklist);
    const hardeningSummary = buildHardeningSummary(checklist, hardeningRisks, input.productionReadinessGate);
    const recommendedNextChecks = buildRecommendedNextChecks(checks, output);
    const confidence = computeConfidence(checklist, releaseCandidateStatus);

    const evaluationSignature = stableSignature([
      "mvp-final-hardening",
      organizationId,
      releaseCandidateStatus,
      output.passed.join(","),
      output.blocked.join(","),
      output.failed.join(","),
      input.productionReadinessGate?.signature ?? "no-gate",
      input.demoModeSnapshot?.signature ?? "no-demo",
      input.smokeTestSuite?.signature ?? "no-smoke",
    ]);

    if (
      !shouldEvaluateFinalHardening(
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
        snapshot: prior.hardeningSnapshots[0] ?? null,
        storeSignature: prior.signature,
      };
    }

    const snapshot: MVPFinalHardeningSnapshot = {
      hardeningId: `${HARDENING_ID_PREFIX}_${stableSignature([organizationId, evaluationSignature]).slice(0, 8)}`,
      organizationId,
      signature: evaluationSignature,
      generatedAt: now,
      releaseCandidateStatus,
      summary,
      checklist,
      hardeningSummary,
      passedChecks: Object.freeze(output.passed),
      warningChecks: Object.freeze(output.warning),
      blockedChecks: Object.freeze(output.blocked),
      failedChecks: Object.freeze(output.failed),
      hardeningRisks: Object.freeze(hardeningRisks),
      recommendedNextChecks: Object.freeze(recommendedNextChecks),
      confidence,
    };

    if (!validateMVPFinalHardeningSnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_hardening_snapshot",
        snapshot: prior.hardeningSnapshots[0] ?? null,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: FinalHardeningHistoryEntry = {
      entryId: stableSignature(["final-hardening-history", snapshot.signature]).slice(0, 48),
      releaseCandidateStatus,
      headline: hardeningSummary.headline,
      generatedAt: now,
    };

    store.upsertHardeningSnapshots([snapshot], now);
    store.upsertChecklistHistory([checklist], now);
    store.upsertBlockerHistory(hardeningRisks.filter((r) => r.severity === "critical" || r.severity === "high"), now);
    store.upsertReleaseCandidateHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastReleaseCandidateStatus(releaseCandidateStatus);

    if (prevented.prevented) {
      devLog("false-ready prevention — release candidate status downgraded");
    }
    if (hasCriticalBlocker) {
      devLog(`release blocker — ${checklist.blockedCount} blocked check(s)`);
    }
    if (shouldLogReleaseCandidateChange(organizationId, releaseCandidateStatus)) {
      devLog(`release candidate status — ${prior.lastReleaseCandidateStatus ?? "none"} → ${releaseCandidateStatus}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      storeSignature: store.getState().signature,
    };
  } finally {
    endFinalHardeningEvaluation();
  }
}
