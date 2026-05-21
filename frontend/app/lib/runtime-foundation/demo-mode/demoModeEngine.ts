import { stableSignature } from "../../intelligence/shared/dedupe";
import type { MVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardTypes";
import { deriveMVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardUtils";
import {
  beginDemoModeEvaluation,
  clampDemoModeConfidence,
  DEMO_MODE_MAX_BLOCKED_PATHS,
  DEMO_MODE_MAX_DEMO_RISKS_DISPLAY,
  DEMO_MODE_MAX_GUARD_SIGNALS,
  endDemoModeEvaluation,
  mapLaunchDecisionToDemoState,
  preventDemoReadyWhileNoGo,
  preventHidingCriticalRisks,
  shouldEvaluateDemoMode,
  shouldLogDemoStateChange,
  stabilizeDemoStateOscillation,
  validateMVPDemoModeState,
} from "./demoModeGuards";
import { getDemoModeStore } from "./demoModeStore";
import type {
  ControlledPilotPresentationSnapshot,
  DemoModeCategory,
  DemoModeGuardSignal,
  DemoModeHistoryEntry,
  DemoRiskIndicator,
  ExecutiveDemoNarrative,
  ExecutiveDemoReadiness,
  MVPDemoModeInput,
  MVPDemoModeResult,
  MVPDemoModeState,
  MVPDemoState,
} from "./demoModeTypes";

const DEV_LOG_PREFIX = "[Nexora][DemoMode]";
const DEMO_MODE_ID_PREFIX = "mvp_demo_mode";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function demoRisk(
  category: DemoModeCategory,
  severity: DemoRiskIndicator["severity"],
  summary: string,
  visibleToExecutive: boolean,
  now: number
): DemoRiskIndicator {
  return {
    riskId: stableSignature(["demo-risk", category, summary]).slice(0, 48),
    category,
    severity,
    summary,
    visibleToExecutive,
    generatedAt: now,
  };
}

function guardSignal(
  category: DemoModeCategory,
  summary: string,
  blocksDemo: boolean,
  now: number
): DemoModeGuardSignal {
  return {
    signalId: stableSignature(["demo-guard", category, summary]).slice(0, 48),
    category,
    summary,
    blocksDemo,
    generatedAt: now,
  };
}

function resolveReadinessStatus(input: MVPDemoModeInput): MVPReadinessStatus | "unknown" {
  if (input.readinessDashboardStatus) return input.readinessDashboardStatus;
  if (
    !input.mvpStrategicReadinessSnapshot &&
    !input.operationalReliabilitySnapshot &&
    !input.executiveInteractionStabilitySnapshot
  ) {
    return "unknown";
  }
  return deriveMVPReadinessStatus({
    organizationId: input.organizationId,
    foundation: input.mvpStrategicReadinessSnapshot ?? null,
    operational: input.operationalReliabilitySnapshot ?? null,
    interaction: input.executiveInteractionStabilitySnapshot ?? null,
  });
}

function resolveEvidenceComplete(gate: MVPDemoModeInput["productionReadinessGate"]): boolean {
  return gate?.readinessSummary.evidenceDepth === "full";
}

function buildExecutiveNarrative(demoState: MVPDemoState): ExecutiveDemoNarrative {
  return {
    headline: "Nexora turns operational signals into executive decision intelligence.",
    flow: Object.freeze([
      "Input operational data",
      "Detect fragility and pressure",
      "Explain strategic risk",
      "Show recommended focus",
      "Validate runtime readiness",
    ]),
    caution:
      demoState === "pilot_ready"
        ? "This is a controlled MVP pilot presentation, not autonomous enterprise execution."
        : "This is a controlled MVP demo, not autonomous enterprise execution.",
  };
}

function buildDemoReadinessHeadline(demoState: MVPDemoState): string {
  switch (demoState) {
    case "demo_ready":
      return "Ready for controlled demo";
    case "pilot_ready":
      return "Ready for controlled pilot";
    case "monitored":
      return "Pilot readiness monitored";
    case "blocked":
      return "Critical issue blocks demo";
    case "disabled":
    default:
      return "Demo mode disabled";
  }
}

function buildSummary(demoState: MVPDemoState, risks: readonly DemoRiskIndicator[]): string {
  if (demoState === "blocked") {
    return "Executive demo is blocked until critical runtime validation issues are resolved. Risks remain visible.";
  }
  if (demoState === "monitored") {
    return "Nexora supports monitored executive presentation only. Complete validation before claiming demo readiness.";
  }
  if (demoState === "demo_ready") {
    return risks.length > 0
      ? "Nexora is ready for a controlled executive MVP demo with monitored runtime risks and stable interaction flow."
      : "Nexora is ready for a controlled executive MVP demo with stable runtime, panels, and scene interaction.";
  }
  if (demoState === "pilot_ready") {
    return "Nexora is ready for a controlled pilot presentation with executive-grade trust signals and visible risk monitoring.";
  }
  return "Executive demo mode is disabled until runtime validation completes.";
}

function collectDemoRisksAndGuards(
  input: MVPDemoModeInput,
  launchDecision: MVPDemoModeState["executiveDemoReadiness"]["launchDecision"],
  now: number
): { risks: DemoRiskIndicator[]; guards: DemoModeGuardSignal[] } {
  const risks: DemoRiskIndicator[] = [];
  const guards: DemoModeGuardSignal[] = [];
  const gate = input.productionReadinessGate;
  const smoke = input.smokeTestSuite;
  const interaction = input.executiveInteractionStabilitySnapshot;
  const operational = input.operationalReliabilitySnapshot;

  if (gate) {
    for (const blocker of gate.blockers) {
      risks.push(
        demoRisk(
          "launch_gate",
          blocker.severity === "critical" ? "critical" : "moderate",
          blocker.summary,
          true,
          now
        )
      );
    }
    for (const launchRisk of gate.risks) {
      risks.push(
        demoRisk(
          "launch_gate",
          launchRisk.severity === "major" ? "moderate" : "low",
          launchRisk.summary,
          true,
          now
        )
      );
    }
  }

  if (smoke) {
    for (const finding of smoke.criticalFindings) {
      risks.push(
        demoRisk("smoke_test", "critical", finding.summary, true, now)
      );
      guards.push(
        guardSignal("smoke_test", `Critical smoke finding: ${finding.summary}`, true, now)
      );
    }
    if (smoke.warned > 0) {
      risks.push(
        demoRisk(
          "smoke_test",
          "moderate",
          "Smoke validation passed with warnings — review before demo.",
          true,
          now
        )
      );
    }
  }

  if (interaction?.panelRuntimeReliability.panelOscillationDetected) {
    risks.push(
      demoRisk(
        "panel_readiness",
        "low",
        "Monitor panel transition latency.",
        true,
        now
      )
    );
  }
  if (interaction?.panelRuntimeReliability.panelFlashDetected) {
    risks.push(
      demoRisk("panel_readiness", "critical", "Panel flash detected — avoid rapid panel demo paths.", true, now)
    );
    guards.push(guardSignal("panel_readiness", "Panel flash blocks stable demo flow", true, now));
  }

  if (interaction?.sceneInteractionReliability.reactionWithoutContract) {
    risks.push(
      demoRisk("scene_readiness", "critical", "Scene contract drift — avoid scene mutation demos.", true, now)
    );
    guards.push(guardSignal("scene_readiness", "Unstable scene contract", true, now));
  }

  if (interaction?.chatInteractionReliability.chatPanelSceneLoopRisk) {
    risks.push(
      demoRisk("ui_stability", "moderate", "Chat → panel → scene loop risk — use bounded chat demo.", true, now)
    );
  }

  if (operational?.trustState === "monitored" || operational?.trustState === "conditionally_trusted") {
    risks.push(
      demoRisk("trust_readiness", "moderate", "Runtime trust under monitoring during presentation.", true, now)
    );
  }

  if (launchDecision === "no_go") {
    guards.push(guardSignal("launch_gate", "Launch gate no-go blocks executive demo", true, now));
  }

  if (!resolveEvidenceComplete(gate)) {
    guards.push(
      guardSignal("runtime_health", "Incomplete validation evidence — monitored presentation only", true, now)
    );
  }

  return { risks, guards };
}

function collectBlockedPaths(
  demoState: MVPDemoState,
  guards: readonly DemoModeGuardSignal[],
  interaction: MVPDemoModeInput["executiveInteractionStabilitySnapshot"]
): string[] {
  const paths: string[] = [];

  if (demoState === "blocked" || demoState === "monitored") {
    paths.push("unvalidated_executive_launch_path");
  }
  if (guards.some((g) => g.category === "smoke_test" && g.blocksDemo)) {
    paths.push("repeat_analyze_without_smoke_clearance");
  }
  if (guards.some((g) => g.category === "panel_readiness" && g.blocksDemo)) {
    paths.push("rapid_panel_switch_demo");
  }
  if (guards.some((g) => g.category === "scene_readiness" && g.blocksDemo)) {
    paths.push("scene_mutation_demo");
  }
  if (interaction?.chatInteractionReliability.chatPanelSceneLoopRisk) {
    paths.push("chat_panel_scene_feedback_loop_demo");
  }

  return Array.from(new Set(paths)).slice(0, DEMO_MODE_MAX_BLOCKED_PATHS);
}

function computeConfidence(
  demoState: MVPDemoState,
  gateConfidence: number | undefined,
  riskCount: number,
  evidenceComplete: boolean
): number {
  let score = 0.52;
  if (gateConfidence) score += gateConfidence / 5;
  if (evidenceComplete) score += 0.1;
  if (demoState === "demo_ready") score += 0.08;
  if (demoState === "pilot_ready") score += 0.1;
  if (demoState === "monitored") score -= 0.05;
  if (demoState === "blocked") score -= 0.2;
  score -= riskCount * 0.03;
  return clampDemoModeConfidence(score);
}

export function formatDemoStateLabel(demoState: MVPDemoState): string {
  return buildDemoReadinessHeadline(demoState);
}

export function evaluateMVPDemoMode(input: MVPDemoModeInput): MVPDemoModeResult {
  if (!beginDemoModeEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      demoMode: null,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getDemoModeStore(organizationId);
    const prior = store.getState();

    const gate = input.productionReadinessGate;
    if (!gate) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_launch_gate_depth",
        demoMode: prior.demoModeSnapshots[0] ?? null,
        storeSignature: prior.signature,
      };
    }

    const launchDecision = gate.decision;
    const criticalSmoke = (input.smokeTestSuite?.criticalFindings.length ?? 0) > 0;
    const evidenceComplete = resolveEvidenceComplete(gate);
    const readinessStatus = resolveReadinessStatus(input);

    let proposedState = mapLaunchDecisionToDemoState(launchDecision, criticalSmoke, evidenceComplete);

    const noGoGuard = preventDemoReadyWhileNoGo(proposedState, launchDecision);
    proposedState = noGoGuard.demoState;

    if (readinessStatus === "not_ready" && proposedState !== "blocked") {
      proposedState = "monitored";
    }

    if (!evidenceComplete && (proposedState === "demo_ready" || proposedState === "pilot_ready")) {
      proposedState = "monitored";
    }

    const demoState = stabilizeDemoStateOscillation(proposedState, prior.lastDemoState);

    const { risks: rawRisks, guards } = collectDemoRisksAndGuards(input, launchDecision, now);
    const visibleRisks = preventHidingCriticalRisks(rawRisks);
    const dedupedRisks = Array.from(new Map(visibleRisks.map((r) => [r.riskId, r])).values()).slice(
      0,
      DEMO_MODE_MAX_DEMO_RISKS_DISPLAY
    );
    const dedupedGuards = Array.from(new Map(guards.map((g) => [g.signalId, g])).values()).slice(
      0,
      DEMO_MODE_MAX_GUARD_SIGNALS
    );

    const blockedPaths = collectBlockedPaths(
      demoState,
      dedupedGuards,
      input.executiveInteractionStabilitySnapshot
    );

    const executiveDemoReadiness: ExecutiveDemoReadiness = {
      demoState,
      launchDecision,
      readinessDashboardStatus: readinessStatus,
      evidenceComplete,
      criticalRiskCount: dedupedRisks.filter((r) => r.severity === "critical").length,
      headline: buildDemoReadinessHeadline(demoState),
    };

    const controlledPilotPresentation: ControlledPilotPresentationSnapshot = {
      presentationId: stableSignature(["pilot-presentation", organizationId, demoState]).slice(0, 48),
      pilotState: demoState,
      summary:
        demoState === "pilot_ready"
          ? "Controlled pilot presentation is approved with visible runtime risks and executive monitoring."
          : demoState === "demo_ready"
            ? "Controlled demo presentation is approved — pilot expansion requires additional validation."
            : "Controlled pilot presentation is not approved for this runtime posture.",
      visibleRisks: Object.freeze(
        dedupedRisks.filter((r) => r.visibleToExecutive).map((r) => r.summary)
      ),
      recommendedFocus: Object.freeze(
        gate.recommendedNextChecks.slice(0, 4).length > 0
          ? gate.recommendedNextChecks.slice(0, 4)
          : ["Validate runtime readiness", "Confirm scene and panels stable"]
      ),
      generatedAt: now,
    };

    const executiveNarrative = buildExecutiveNarrative(demoState);
    const summary = buildSummary(demoState, dedupedRisks);
    const confidence = computeConfidence(demoState, gate.confidence, dedupedRisks.length, evidenceComplete);

    const evaluationSignature = stableSignature([
      "mvp-demo-mode",
      organizationId,
      demoState,
      launchDecision,
      dedupedRisks.map((r) => r.riskId).join(","),
      blockedPaths.join(","),
      gate.signature,
    ]);

    if (
      !shouldEvaluateDemoMode(organizationId, evaluationSignature, prior.lastEvaluationSignature, now)
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "deduped_or_paced",
        demoMode: prior.demoModeSnapshots[0] ?? null,
        storeSignature: prior.signature,
      };
    }

    const demoMode: MVPDemoModeState = {
      demoModeId: `${DEMO_MODE_ID_PREFIX}_${stableSignature([organizationId, evaluationSignature]).slice(0, 8)}`,
      organizationId,
      signature: evaluationSignature,
      generatedAt: now,
      demoState,
      summary,
      executiveNarrative,
      executiveDemoReadiness,
      controlledPilotPresentation,
      demoRisks: Object.freeze(dedupedRisks),
      demoGuardSignals: Object.freeze(dedupedGuards),
      blockedPaths: Object.freeze(blockedPaths),
      confidence,
    };

    if (!validateMVPDemoModeState(demoMode)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_demo_mode_snapshot",
        demoMode: prior.demoModeSnapshots[0] ?? null,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: DemoModeHistoryEntry = {
      entryId: stableSignature(["demo-mode-history", demoMode.signature]).slice(0, 48),
      demoState,
      headline: executiveDemoReadiness.headline,
      generatedAt: now,
    };

    store.upsertDemoModeSnapshots([demoMode], now);
    store.upsertDemoRiskHistory(dedupedRisks, now);
    store.upsertPilotObservations([controlledPilotPresentation], now);
    store.upsertDemoHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastDemoState(demoState);

    if (noGoGuard.downgraded) {
      devLog("blocked demo path — launch gate no-go prevented demo-ready posture");
    }

    if (dedupedGuards.some((g) => g.blocksDemo)) {
      devLog(`blocked demo path — ${dedupedGuards.filter((g) => g.blocksDemo).length} guard signal(s) active`);
    }

    if (dedupedRisks.some((r) => r.severity === "critical")) {
      devLog(`critical demo risk — ${dedupedRisks.filter((r) => r.severity === "critical").length} visible risk(s)`);
    }

    if (shouldLogDemoStateChange(organizationId, demoState)) {
      devLog(`demo state transition — ${prior.lastDemoState ?? "none"} → ${demoState}`);
      if (demoState === "pilot_ready") {
        devLog("pilot readiness transition — controlled pilot presentation approved");
      }
      if (demoState === "demo_ready") {
        devLog("demo readiness transition — controlled executive demo approved");
      }
    }

    return {
      evaluated: true,
      skipped: false,
      demoMode,
      storeSignature: store.getState().signature,
    };
  } finally {
    endDemoModeEvaluation();
  }
}
