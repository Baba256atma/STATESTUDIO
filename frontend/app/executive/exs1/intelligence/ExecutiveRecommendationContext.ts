/**
 * Phase B — Normalized recommendation context for Advisor (not raw Runtime).
 */

import type { ExecutiveMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import { resolveObjectDisplayName } from "../metadata/ExecutiveMetadataRegistry";
import type { ExecutiveRuntimeState } from "../runtime/ExecutiveRuntimeStore";
import type {
  ExecutiveRecommendationContext,
  ExecutiveSignal,
} from "./ExecutiveSignalTypes";

export function buildExecutiveRecommendationContext(
  signal: ExecutiveSignal | null,
  state: ExecutiveRuntimeState,
  catalog: ExecutiveMetadataCatalog,
): ExecutiveRecommendationContext {
  if (!signal) {
    return {
      signalId: null,
      type: "Idle",
      severity: "Low",
      focusObjectId: state.selection.selectedObjectId,
      focusObjectLabel: state.selection.selectedObjectId
        ? resolveObjectDisplayName(
            catalog,
            state.selection.selectedObjectId,
          )
        : null,
      domainNames: [],
      workspace: state.mode.activeMode,
      packTitle: "Production Delay",
      relatedDecisionId: state.decision.currentDecisionId,
      relatedDecisionName:
        state.decision.decisions.find(
          (d) => d.id === state.decision.currentDecisionId,
        )?.name ?? null,
      suggestedWorkspace: state.mode.activeMode,
      suggestedAction: "Continue executive review",
      why: "No active executive signal requires attention.",
      impact: "Runtime is stable for the current pack.",
      nextStep: "Select an object or open Intelligence when ready.",
    };
  }

  const focusObjectId = signal.relatedObjectIds[0] ?? null;
  const decisionId = state.decision.currentDecisionId;
  const decisionName =
    state.decision.decisions.find((d) => d.id === decisionId)?.name ?? null;

  return {
    signalId: signal.signalId,
    type: signal.type,
    severity: signal.severity,
    focusObjectId,
    focusObjectLabel: focusObjectId
      ? resolveObjectDisplayName(catalog, focusObjectId)
      : null,
    domainNames: signal.domainNames,
    workspace: state.mode.activeMode,
    packTitle: signal.relatedPackTitle,
    relatedDecisionId: decisionId,
    relatedDecisionName: decisionName,
    suggestedWorkspace: signal.suggestedWorkspace,
    suggestedAction: signal.suggestedAction,
    why: signal.sourceSummary,
    impact: `${signal.type} affects ${
      signal.relatedObjectIds.join(", ") || "the active pack"
    } in ${signal.domainNames.join(", ") || "the current domain"}.`,
    nextStep: `${signal.suggestedAction} · Suggested workspace ${signal.suggestedWorkspace}.`,
  };
}
