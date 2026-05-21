import { describe, expect, it, beforeEach } from "vitest";

import {
  deriveMVPReadinessStatus,
  formatRuntimeHealthLabel,
  getRecommendedNextCheck,
  resetMVPReadinessDashboardDevState,
  summarizeExecutiveReadiness,
} from "./mvpReadinessDashboardUtils";
import type { MVPReadinessRuntimeInput } from "./mvpReadinessDashboardTypes";

function baseInput(overrides?: Partial<MVPReadinessRuntimeInput>): MVPReadinessRuntimeInput {
  return {
    organizationId: "test-org",
    foundation: null,
    operational: null,
    interaction: null,
    ...overrides,
  };
}

function minimalSnapshots(): MVPReadinessRuntimeInput {
  return {
    organizationId: "test-org",
    foundation: {
      signature: "foundation-1",
      organizationId: "test-org",
      generatedAt: 1,
      runtimeFoundationId: "rf-1",
      runtimeStatus: "mvp_ready",
      reliabilityLevel: "stable",
      summary: "Foundation stable.",
      readinessSignals: ["executive_safe_outputs", "bounded_runtime_behavior"],
      operationalRisks: [],
      confidence: 0.9,
      activeFoundationCategories: ["runtime_stability"],
      reliabilityObservations: [],
      runtimeOperationalHealth: {
        level: "stable",
        integrityState: "mvp_runtime_ready",
        foundationHeadline: "Ready",
        readinessPosture: "high",
      },
      runtimeFoundationSummary: {
        singularityRuntimeState: "unified",
        institutionalRuntimeState: "operational",
        orchestrationState: "stable",
        governanceState: "aligned",
        explainabilityState: "active",
        executiveInteractionState: "ready",
        primaryOperationalRisk: "bounded_runtime_monitoring",
      },
      governanceSignals: [],
    },
    operational: {
      signature: "operational-1",
      organizationId: "test-org",
      generatedAt: 1,
      reliabilityId: "rel-1",
      trustState: "trusted",
      reliabilityLevel: "stable",
      summary: "Operational trust stable.",
      reliabilitySignals: ["bounded_runtime_behavior"],
      trustRisks: [],
      confidence: 0.88,
      activeReliabilityCategories: ["runtime_stability"],
      reliabilityObservations: [],
      runtimeTrustField: {
        level: "stable",
        trustState: "trusted",
        trustHeadline: "Trust stable",
        stabilizationPosture: "high",
      },
      operationalReliabilitySummary: {
        foundationRuntimeState: "mvp_ready",
        singularityRuntimeState: "unified",
        orchestrationState: "stable",
        metaCognitionState: "aligned",
        panelStabilityState: "stable",
        sceneStabilityState: "contract_aligned",
        primaryTrustRisk: "bounded_trust_monitoring",
      },
      runtimeTrustSignals: [],
      runtimeTrustRiskIndicators: [],
    },
    interaction: {
      signature: "interaction-1",
      organizationId: "test-org",
      generatedAt: 1,
      interactionStabilityId: "ui-1",
      uiState: "mvp_ready",
      reliabilityLevel: "stable",
      summary: "UI stable.",
      stabilitySignals: ["panel_state_stable", "scene_signature_consistent", "chat_pipeline_deduped"],
      uiRisks: ["minor_transition_latency"],
      confidence: 0.9,
      activeStabilityCategories: ["panel_stability"],
      stabilityObservations: [],
      panelRuntimeReliability: {
        panelStable: true,
        panelFlashDetected: false,
        panelOscillationDetected: false,
        rightRailViewStable: true,
        panelViewSignature: "panel-1",
      },
      sceneInteractionReliability: {
        sceneSignature: "scene-1",
        sceneContractValid: true,
        duplicateSceneReaction: false,
        reactionWithoutContract: false,
      },
      chatInteractionReliability: {
        chatPipelineSignature: "chat-1",
        chatPipelineDeduped: true,
        duplicatePanelUpdateForSameInput: false,
        chatPanelSceneLoopRisk: false,
      },
      productionSafeUISummary: {
        operationalTrustState: "trusted",
        foundationRuntimeState: "mvp_ready",
        panelState: "stable",
        sceneState: "contract_aligned",
        chatState: "deduped",
        selectionState: "preserved",
        rightRailState: "stable",
        primaryUIRisk: "minor_transition_latency",
      },
      uiStabilitySignals: [],
    },
  };
}

describe("mvpReadinessDashboardUtils D9:10:4", () => {
  beforeEach(() => {
    resetMVPReadinessDashboardDevState();
  });

  it("derives not_ready when runtime data is missing", () => {
    expect(deriveMVPReadinessStatus(baseInput())).toBe("not_ready");
    expect(formatRuntimeHealthLabel("not_ready")).toBe("Needs further stabilization");
  });

  it("derives mvp_ready from aligned runtime layers", () => {
    expect(deriveMVPReadinessStatus(minimalSnapshots())).toBe("mvp_ready");
  });

  it("derives monitored when panel flash is detected", () => {
    const input = minimalSnapshots();
    input.interaction = {
      ...input.interaction!,
      uiState: "monitored",
      panelRuntimeReliability: {
        ...input.interaction!.panelRuntimeReliability,
        panelStable: false,
        panelFlashDetected: true,
      },
    };
    expect(deriveMVPReadinessStatus(input)).toBe("monitored");
  });

  it("summarizes executive readiness with safe fallbacks", () => {
    const model = summarizeExecutiveReadiness(baseInput());
    expect(model.readinessStatus).toBe("not_ready");
    expect(model.recommendedNextCheck.length).toBeGreaterThan(0);
    expect(model.healthItems.length).toBeGreaterThanOrEqual(5);
    expect(model.overallHeadline).toContain("stabilization");
  });

  it("summarizes MVP-ready display model contract fields", () => {
    const model = summarizeExecutiveReadiness(minimalSnapshots());
    expect(model.readinessStatus).toBe("mvp_ready");
    expect(model.runtimeHealth).toBe("Ready for MVP smoke test");
    expect(model.uiStability).toBe("MVP ready");
    expect(model.trustLevel).toBe("Trusted");
    expect(model.currentRisk).not.toMatch(/AGI|self-aware|conscious/i);
    expect(model.recommendedNextCheck).toContain("analyze flow");
    expect(model.confidencePercent).toBe(90);
  });

  it("recommends panel checks when flash symptoms appear", () => {
    const input = minimalSnapshots();
    input.interaction = {
      ...input.interaction!,
      panelRuntimeReliability: {
        ...input.interaction!.panelRuntimeReliability,
        panelFlashDetected: true,
        panelStable: false,
      },
    };
    const check = getRecommendedNextCheck(input, "monitored");
    expect(check).toContain("panel");
  });
});
