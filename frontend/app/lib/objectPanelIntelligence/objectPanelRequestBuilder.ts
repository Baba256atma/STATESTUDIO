/**
 * INT-4 — Object Panel Request Builder.
 * Sole creator of immutable ObjectPanelIntelligenceRequest objects.
 */

import {
  OBJECT_PANEL_CONSUMER,
  OBJECT_PANEL_INTELLIGENCE_SOURCE,
  OBJECT_PANEL_INTELLIGENCE_VERSION,
  type BuildObjectPanelIntelligenceInput,
  type ObjectPanelIntelligenceRequest,
  type ObjectPanelRequestBuildResult,
  type ObjectPanelSelection,
} from "./objectPanelIntelligenceContract.ts";
import { adaptObjectPanelContext } from "./objectPanelContextAdapter.ts";
import { buildExecutiveTimeContext } from "../dashboardIntelligence/executiveTimeContextBuilder.ts";
import { buildIntelligenceContext } from "../dashboardIntelligence/intelligenceContextBuilder.ts";

let objectPanelRequestSequence = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function nextObjectPanelRequestId(): string {
  objectPanelRequestSequence += 1;
  return `obj_panel_req_${objectPanelRequestSequence}_${Date.now()}`;
}

function normalizeSelection(
  input: Partial<ObjectPanelSelection> | null | undefined,
  objectId: string | null
): ObjectPanelSelection {
  const normalize = (value: unknown): string | null => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    return trimmed || null;
  };
  return Object.freeze({
    objectId,
    relationshipId: normalize(input?.relationshipId),
    kpiId: normalize(input?.kpiId),
    riskId: normalize(input?.riskId),
    scenarioId: normalize(input?.scenarioId),
    dataSourceId: normalize(input?.dataSourceId),
  });
}

export function buildObjectPanelIntelligenceRequest(
  input: BuildObjectPanelIntelligenceInput
): ObjectPanelRequestBuildResult {
  const adapted = adaptObjectPanelContext(input);

  if (!adapted.selectedObjectId) {
    return Object.freeze({
      success: false,
      request: null,
      reason: "object_selection_required",
      message: "Object Panel requires an active object selection.",
    });
  }

  if (!adapted.intelligenceContextInput.workspace) {
    return Object.freeze({
      success: false,
      request: null,
      reason: "workspace_required",
      message: "Object Panel requires a workspace context for the selected object.",
    });
  }

  const timeBuild = buildExecutiveTimeContext(adapted.executiveTimeInput);
  if (!timeBuild.success || !timeBuild.timeContext) {
    return Object.freeze({
      success: false,
      request: null,
      reason: "time_context_failed",
      message: timeBuild.message,
    });
  }

  const contextBuild = buildIntelligenceContext(adapted.intelligenceContextInput);
  if (!contextBuild.success || !contextBuild.context) {
    return Object.freeze({
      success: false,
      request: null,
      reason: "intelligence_context_failed",
      message: contextBuild.message,
    });
  }

  const request: ObjectPanelIntelligenceRequest = Object.freeze({
    contractVersion: OBJECT_PANEL_INTELLIGENCE_VERSION,
    objectPanelRequestId: nextObjectPanelRequestId(),
    requestId: contextBuild.context.requestId,
    workspace: contextBuild.context.workspace,
    selectedObjectId: adapted.selectedObjectId,
    consumer: OBJECT_PANEL_CONSUMER,
    panel: adapted.panel,
    dashboardMode: adapted.dashboardMode,
    selection: normalizeSelection(input.selection, adapted.selectedObjectId),
    executiveTime: adapted.executiveTimeInput,
    intelligenceContext: contextBuild.context,
    executiveTimeContext: timeBuild.timeContext,
    timestamp: nowIso(),
    source: OBJECT_PANEL_INTELLIGENCE_SOURCE,
  });

  return Object.freeze({
    success: true,
    request,
    reason: "built",
    message: "Object Panel intelligence request built.",
  });
}

export function resetObjectPanelRequestBuilderForTests(): void {
  objectPanelRequestSequence = 0;
}

export const ObjectPanelRequestBuilder = Object.freeze({
  buildObjectPanelIntelligenceRequest,
});
