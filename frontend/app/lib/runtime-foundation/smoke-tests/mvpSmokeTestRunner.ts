import { stableSignature } from "../../intelligence/shared/dedupe";
import { selectLatestExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilitySelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationSelectors";
import { selectExecutiveInteractionStabilitySnapshots } from "../executiveInteractionStabilitySelectors";
import { selectMVPStrategicReadinessSnapshots } from "../enterpriseRuntimeFoundationSelectors";
import { selectExecutiveOperationalReliabilitySnapshots } from "../operationalReliabilitySelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilitySelectors";
import { MVP_SMOKE_TEST_SCENARIOS } from "./mvpSmokeTestScenarios";
import { summarizeMVPSmokeTestResults } from "./mvpSmokeTestSummary";
import type {
  MVPSmokeTestResult,
  MVPSmokeTestRuntimeContext,
  MVPSmokeTestScenario,
  MVPSmokeTestStatus,
  MVPSmokeTestSuiteInput,
  MVPSmokeTestSuiteResult,
  SmokeTestFinding,
} from "./mvpSmokeTestTypes";

const DEV_LOG_PREFIX = "[Nexora][MVPSmokeTest]";
const SUITE_ID = "mvp_runtime_smoke_suite";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

export function buildMVPSmokeTestRuntimeContext(organizationId: string): MVPSmokeTestRuntimeContext {
  const key = organizationId.trim() || "nexora-default";
  return {
    organizationId: key,
    foundation: selectLatestMVPStrategicReadinessSnapshot(key),
    operational: selectLatestExecutiveOperationalReliabilitySnapshot(key),
    interaction: selectLatestExecutiveInteractionStabilitySnapshot(key),
    foundationSnapshotCount: selectMVPStrategicReadinessSnapshots(key).length,
    operationalSnapshotCount: selectExecutiveOperationalReliabilitySnapshots(key).length,
    interactionSnapshotCount: selectExecutiveInteractionStabilitySnapshots(key).length,
  };
}

function hasOperationalDepth(ctx: MVPSmokeTestRuntimeContext): boolean {
  return Boolean(ctx.operational && ctx.interaction);
}

function finding(
  scenarioId: string,
  severity: SmokeTestFinding["severity"],
  summary: string,
  now: number
): SmokeTestFinding {
  return {
    findingId: stableSignature(["smoke-finding", scenarioId, summary]).slice(0, 48),
    scenarioId,
    severity,
    summary,
    generatedAt: now,
  };
}

function result(
  scenario: MVPSmokeTestScenario,
  status: MVPSmokeTestStatus,
  headline: string,
  detail: string,
  findings: SmokeTestFinding[],
  now: number
): MVPSmokeTestResult {
  return {
    scenarioId: scenario.id,
    status,
    headline,
    detail,
    findings: Object.freeze(findings),
    evaluatedAt: now,
  };
}

function skipped(scenario: MVPSmokeTestScenario, reason: string, now: number): MVPSmokeTestResult {
  return result(scenario, "skipped", "Skipped — insufficient runtime depth", reason, [], now);
}

function evaluateRepeatAnalyzeSameObject(
  scenario: MVPSmokeTestScenario,
  ctx: MVPSmokeTestRuntimeContext,
  now: number
): MVPSmokeTestResult {
  if (!hasOperationalDepth(ctx)) return skipped(scenario, "Operational reliability depth required.", now);

  const panel = ctx.interaction!.panelRuntimeReliability;
  const scene = ctx.interaction!.sceneInteractionReliability;
  const selectionOk = ctx.interaction!.productionSafeUISummary.selectionState === "preserved";
  const findings: SmokeTestFinding[] = [];

  if (panel.panelFlashDetected) {
    findings.push(finding(scenario.id, "critical", "Panel flash detected during analyze flow.", now));
  }
  if (scene.duplicateSceneReaction) {
    findings.push(finding(scenario.id, "critical", "Duplicate scene reaction detected.", now));
  }
  if (!selectionOk) {
    findings.push(finding(scenario.id, "moderate", "Selection context may not persist through analyze.", now));
  }

  if (findings.some((f) => f.severity === "critical")) {
    return result(scenario, "fail", "Analyze flow unstable", "Panel or scene instability detected.", findings, now);
  }
  if (findings.length > 0) {
    return result(scenario, "warn", "Analyze flow monitored", "Minor analyze-flow risks mapped.", findings, now);
  }
  return result(
    scenario,
    "pass",
    "Analyze flow stable",
    "Selection, panel, and scene signals remain bounded for repeat analyze.",
    [],
    now
  );
}

function evaluateRapidPanelSwitch(
  scenario: MVPSmokeTestScenario,
  ctx: MVPSmokeTestRuntimeContext,
  now: number
): MVPSmokeTestResult {
  if (!ctx.interaction) return skipped(scenario, "Interaction stability snapshot required.", now);

  const panel = ctx.interaction.panelRuntimeReliability;
  const findings: SmokeTestFinding[] = [];

  if (panel.panelFlashDetected || panel.panelOscillationDetected) {
    findings.push(finding(scenario.id, "critical", "Panel flash or disappearance during switch.", now));
  }
  if (!panel.rightRailViewStable) {
    findings.push(finding(scenario.id, "moderate", "Right rail transition instability detected.", now));
  }
  if (!panel.panelViewSignature.trim()) {
    findings.push(finding(scenario.id, "moderate", "Invalid panel route signature.", now));
  }

  if (findings.some((f) => f.severity === "critical")) {
    return result(scenario, "fail", "Panel switch unstable", "Rapid panel switch risks detected.", findings, now);
  }
  if (findings.length > 0) {
    return result(scenario, "warn", "Panel switch monitored", "Minor panel transition latency.", findings, now);
  }
  return result(scenario, "pass", "Panel switch stable", "Panel and right rail remain coherent.", [], now);
}

function evaluateChatToPanelToScene(
  scenario: MVPSmokeTestScenario,
  ctx: MVPSmokeTestRuntimeContext,
  now: number
): MVPSmokeTestResult {
  if (!ctx.interaction) return skipped(scenario, "Interaction stability snapshot required.", now);

  const chat = ctx.interaction.chatInteractionReliability;
  const scene = ctx.interaction.sceneInteractionReliability;
  const findings: SmokeTestFinding[] = [];

  if (chat.chatPanelSceneLoopRisk) {
    findings.push(finding(scenario.id, "critical", "Chat-panel-scene feedback loop risk.", now));
  }
  if (!scene.sceneContractValid) {
    findings.push(finding(scenario.id, "critical", "Scene contract mismatch on chat pathway.", now));
  }
  if (chat.duplicatePanelUpdateForSameInput) {
    findings.push(finding(scenario.id, "moderate", "Chat updated panel repeatedly for same input.", now));
  }

  if (findings.some((f) => f.severity === "critical")) {
    return result(scenario, "fail", "Chat pathway unstable", "Chat-panel-scene loop or contract issue.", findings, now);
  }
  if (findings.length > 0) return result(scenario, "warn", "Chat pathway monitored", "Minor chat pathway risks.", findings, now);
  return result(scenario, "pass", "Chat pathway stable", "Chat, panel, and scene remain contract-aligned.", [], now);
}

function evaluateDuplicateChatInput(
  scenario: MVPSmokeTestScenario,
  ctx: MVPSmokeTestRuntimeContext,
  now: number
): MVPSmokeTestResult {
  if (!ctx.interaction) return skipped(scenario, "Interaction stability snapshot required.", now);

  const chat = ctx.interaction.chatInteractionReliability;
  const findings: SmokeTestFinding[] = [];

  if (!chat.chatPipelineDeduped) {
    findings.push(finding(scenario.id, "critical", "Chat pipeline not deduped for duplicate input.", now));
  }
  if (chat.duplicatePanelUpdateForSameInput) {
    findings.push(finding(scenario.id, "critical", "Duplicate panel update for same chat input.", now));
  }
  if (sceneDuplicate(ctx)) {
    findings.push(finding(scenario.id, "moderate", "Repeated scene reaction on duplicate input.", now));
  }

  if (findings.some((f) => f.severity === "critical")) {
    return result(scenario, "fail", "Duplicate chat input failed", "Dedupe or duplicate output detected.", findings, now);
  }
  if (findings.length > 0) return result(scenario, "warn", "Duplicate chat input monitored", "Minor dedupe risks.", findings, now);
  return result(
    scenario,
    "pass",
    "Duplicate chat input handled",
    "Pipeline signatures dedupe without repeated scene mutation.",
    [],
    now
  );
}

function sceneDuplicate(ctx: MVPSmokeTestRuntimeContext): boolean {
  return ctx.interaction?.sceneInteractionReliability.duplicateSceneReaction === true;
}

function evaluateSelectedObjectPersistence(
  scenario: MVPSmokeTestScenario,
  ctx: MVPSmokeTestRuntimeContext,
  now: number
): MVPSmokeTestResult {
  if (!ctx.interaction) return skipped(scenario, "Interaction stability snapshot required.", now);

  const preserved = ctx.interaction.productionSafeUISummary.selectionState === "preserved";
  const atRisk = ctx.interaction.uiRisks.includes("context_persistence_risk");

  if (!preserved || atRisk) {
    return result(
      scenario,
      "fail",
      "Selection context at risk",
      "Selected object context may be lost during analysis lifecycle.",
      [finding(scenario.id, "critical", "Selection context persistence risk.", now)],
      now
    );
  }
  return result(scenario, "pass", "Selection context preserved", "Object context remains locked.", [], now);
}

function evaluateSceneContractConsistency(
  scenario: MVPSmokeTestScenario,
  ctx: MVPSmokeTestRuntimeContext,
  now: number
): MVPSmokeTestResult {
  if (!ctx.interaction) return skipped(scenario, "Interaction stability snapshot required.", now);

  const scene = ctx.interaction.sceneInteractionReliability;
  const findings: SmokeTestFinding[] = [];

  if (!scene.sceneContractValid || scene.reactionWithoutContract) {
    findings.push(finding(scenario.id, "critical", "Scene reaction without valid contract.", now));
  }
  if (!scene.sceneSignature.trim()) {
    findings.push(finding(scenario.id, "moderate", "Scene signature missing.", now));
  }

  if (findings.some((f) => f.severity === "critical")) {
    return result(scenario, "fail", "Scene contract violated", "Scene instability detected.", findings, now);
  }
  if (findings.length > 0) return result(scenario, "warn", "Scene contract monitored", "Minor scene contract risks.", findings, now);
  return result(scenario, "pass", "Scene contract consistent", "Scene reactions remain contract-aligned.", [], now);
}

function deriveReadinessStatusFromContext(ctx: MVPSmokeTestRuntimeContext): string {
  if (!ctx.foundation && !ctx.operational && !ctx.interaction) return "not_ready";
  const panelFlash = ctx.interaction?.panelRuntimeReliability.panelFlashDetected === true;
  const trust = ctx.operational?.trustState;
  const ui = ctx.interaction?.uiState;
  if (panelFlash && ctx.interaction?.sceneInteractionReliability.reactionWithoutContract) return "not_ready";
  if (trust === "untrusted") return "not_ready";
  if (ui === "mvp_ready") return "mvp_ready";
  if (ctx.foundation?.runtimeStatus === "mvp_ready" && (trust === "trusted" || trust === "executive_grade")) {
    return "mvp_ready";
  }
  if (ui === "stable" || ui === "production_safe" || trust === "trusted") return "stable";
  return "monitored";
}

function evaluateReadinessDashboardFallback(
  scenario: MVPSmokeTestScenario,
  _ctx: MVPSmokeTestRuntimeContext,
  now: number
): MVPSmokeTestResult {
  const emptyCtx: MVPSmokeTestRuntimeContext = {
    organizationId: "smoke-empty",
    foundation: null,
    operational: null,
    interaction: null,
    foundationSnapshotCount: 0,
    operationalSnapshotCount: 0,
    interactionSnapshotCount: 0,
  };
  const emptyStatus = deriveReadinessStatusFromContext(emptyCtx);
  if (emptyStatus === "mvp_ready") {
    return result(
      scenario,
      "fail",
      "False MVP ready on empty data",
      "Readiness dashboard would falsely report MVP ready without runtime signals.",
      [finding(scenario.id, "critical", "False MVP ready fallback.", now)],
      now
    );
  }
  return result(
    scenario,
    "pass",
    "Readiness fallback safe",
    `Missing runtime signals fall back to ${emptyStatus} without crash.`,
    [],
    now
  );
}

function evaluateRuntimeTrustStability(
  scenario: MVPSmokeTestScenario,
  ctx: MVPSmokeTestRuntimeContext,
  now: number
): MVPSmokeTestResult {
  if (!ctx.operational) return skipped(scenario, "Operational reliability snapshot required.", now);

  const findings: SmokeTestFinding[] = [];
  const trust = ctx.operational.trustState;

  if (trust === "untrusted") {
    findings.push(finding(scenario.id, "critical", "Runtime trust untrusted.", now));
  }
  if (ctx.foundationSnapshotCount > 8 || ctx.operationalSnapshotCount > 8 || ctx.interactionSnapshotCount > 8) {
    findings.push(finding(scenario.id, "critical", "Unbounded reliability snapshots detected.", now));
  }
  if (trust === "monitored" && ctx.operational.reliabilityLevel === "production_ready") {
    findings.push(finding(scenario.id, "moderate", "Trust mismatch — production ready with monitored trust.", now));
  }

  if (findings.some((f) => f.severity === "critical")) {
    return result(scenario, "fail", "Runtime trust unstable", "Trust degradation or unbounded store.", findings, now);
  }
  if (findings.length > 0) {
    return result(scenario, "warn", "Runtime trust monitored", "Minor trust stability warnings.", findings, now);
  }
  return result(
    scenario,
    "pass",
    "Runtime trust stable",
    "Trust state remains bounded without rapid oscillation.",
    [],
    now
  );
}

const EVALUATORS: Record<
  string,
  (scenario: MVPSmokeTestScenario, ctx: MVPSmokeTestRuntimeContext, now: number) => MVPSmokeTestResult
> = {
  repeat_analyze_same_object: evaluateRepeatAnalyzeSameObject,
  rapid_panel_switch: evaluateRapidPanelSwitch,
  chat_to_panel_to_scene: evaluateChatToPanelToScene,
  duplicate_chat_input: evaluateDuplicateChatInput,
  selected_object_persistence: evaluateSelectedObjectPersistence,
  scene_contract_consistency: evaluateSceneContractConsistency,
  readiness_dashboard_fallback: evaluateReadinessDashboardFallback,
  runtime_trust_stability: evaluateRuntimeTrustStability,
};

/**
 * D9:10:5 — Deterministic MVP smoke test suite (readonly runtime signals, no UI/scene mutation).
 */
export function runMVPSmokeTestSuite(input: MVPSmokeTestSuiteInput = {}): MVPSmokeTestSuiteResult {
  const organizationId = input.organizationId?.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const ctx = input.context ?? buildMVPSmokeTestRuntimeContext(organizationId);

  const results = MVP_SMOKE_TEST_SCENARIOS.map((scenario) => {
    const evaluate = EVALUATORS[scenario.id];
    if (!evaluate) {
      return result(scenario, "skipped", "Unknown scenario", "No evaluator registered.", [], now);
    }
    return evaluate(scenario, ctx, now);
  });

  const summary = summarizeMVPSmokeTestResults(organizationId, results);

  if (summary.failed > 0) {
    devLog(`suite result — fail (${summary.passed} pass, ${summary.warned} warn, ${summary.failed} fail)`);
    const failedScenario = results.find((r) => r.status === "fail");
    if (failedScenario) {
      devLog(`failed scenario — ${failedScenario.scenarioId}: ${failedScenario.headline}`);
    }
  } else if (summary.status === "warn") {
    devLog(`suite result — warn (${summary.passed} pass, ${summary.warned} warn)`);
    if (summary.criticalFindings.length > 0) {
      devLog(`critical warning — ${summary.criticalFindings[0]?.summary ?? "see findings"}`);
    }
  } else if (summary.status === "pass") {
    devLog(`suite result — pass (${summary.passed}/${results.length} scenarios)`);
  }

  return {
    suiteId: SUITE_ID,
    organizationId,
    status: summary.status,
    passed: summary.passed,
    warned: summary.warned,
    failed: summary.failed,
    skipped: summary.skipped,
    results: Object.freeze(results),
    validationSummary: summary.validationSummary,
    criticalFindings: summary.criticalFindings,
    recommendations: summary.recommendations,
    generatedAt: now,
    signature: summary.signature,
  };
}
