import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { stableSignature } from "../intelligence/shared/dedupe";
import { selectLatestMVPStrategicReadinessSnapshot } from "./enterpriseRuntimeFoundationSelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "./operationalReliabilitySelectors";
import { evaluateExecutiveInteractionStability } from "./executiveInteractionStabilityEngine";
import type { ExecutiveInteractionStabilityResult } from "./executiveInteractionStabilityTypes";

/**
 * D9:10:3 — Passive MVP executive interaction stability + production-safe UI runtime.
 * Operational Reliability → Executive Interaction Stability → Production-Safe UI Runtime
 */
export function integrateExecutiveInteractionStabilityWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  operationalTopologyStressed?: boolean;
  cognitionConverged?: boolean;
  runtimeStable?: boolean;
  sessionHydrated?: boolean;
  selectedObjectId?: string | null;
  rightPanelView?: string | null;
  now?: number;
}): ExecutiveInteractionStabilityResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;
  const runtimeStable = params.runtimeStable ?? true;
  const sessionHydrated = params.sessionHydrated ?? true;
  const cognitionSig = cognition?.signature ?? "no-cognition";
  const operational = selectLatestExecutiveOperationalReliabilitySnapshot(organizationId);

  return evaluateExecutiveInteractionStability({
    organizationId,
    cognitionSnapshot: cognition,
    mvpStrategicReadinessSnapshot: selectLatestMVPStrategicReadinessSnapshot(organizationId),
    operationalReliabilitySnapshot: operational,
    panelRuntimeReliability: {
      panelStable: runtimeStable && sessionHydrated && !params.fragilityElevated,
      panelFlashDetected: !runtimeStable || params.fragilityElevated === true,
      panelOscillationDetected: params.fragilityElevated === true && !runtimeStable,
      rightRailViewStable: runtimeStable && Boolean(params.rightPanelView?.trim() || true),
      panelViewSignature: stableSignature([
        "right-panel-view",
        params.rightPanelView ?? "default",
        cognitionSig,
      ]).slice(0, 48),
    },
    sceneInteractionReliability: {
      sceneSignature: stableSignature(["scene-render", cognitionSig]).slice(0, 48),
      sceneContractValid:
        params.continuityPreserved !== false && runtimeStable && params.cognitionConverged !== false,
      duplicateSceneReaction: false,
      reactionWithoutContract:
        params.continuityPreserved === false || (params.fragilityElevated === true && !runtimeStable),
    },
    chatInteractionReliability: {
      chatPipelineSignature: stableSignature(["chat-pipeline", cognitionSig]).slice(0, 48),
      chatPipelineDeduped: true,
      duplicatePanelUpdateForSameInput: false,
      chatPanelSceneLoopRisk:
        params.fragilityElevated === true && params.operationalTopologyStressed === true,
    },
    selectionInteraction: {
      selectionContextPreserved: params.continuityPreserved !== false,
      selectedObjectId: params.selectedObjectId ?? null,
      selectionLostDuringAnalysis:
        params.continuityPreserved === false && Boolean(params.selectedObjectId),
    },
    commandInteraction: {
      commandInteractionStable: runtimeStable,
      duplicateCommandReaction: false,
      transitionOscillation: params.operationalTopologyStressed ?? params.fragilityElevated ?? false,
    },
    operationalTopologyStressed: params.operationalTopologyStressed ?? params.fragilityElevated ?? false,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    cognitionConverged: params.continuityPreserved ?? true,
    runtimeStable,
    sessionHydrated,
    now: params.now,
  });
}
