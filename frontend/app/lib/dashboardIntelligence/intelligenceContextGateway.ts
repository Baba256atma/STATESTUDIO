/**
 * INT-1.2 — Intelligence Context gateway bridge.
 * Unified context → Single Intelligence Gateway → Dashboard Intelligence Runtime.
 */

import {
  buildIntelligenceContext,
  updateIntelligenceContext,
} from "./intelligenceContextBuilder.ts";
import type {
  BuildIntelligenceContextInput,
  IntelligenceContextBuildResult,
  UnifiedIntelligenceContext,
} from "./intelligenceContextContract.ts";
import {
  recordIntelligenceContextEvent,
} from "./intelligenceContextDiagnostics.ts";
import {
  getCurrentIntelligenceContext,
  restoreIntelligenceContext,
} from "./intelligenceContextRegistry.ts";
import {
  createIntelligenceContextSnapshot,
  getIntelligenceContextSnapshotById,
} from "./intelligenceContextSnapshot.ts";
import {
  buildIntelligenceGatewayRequest,
  requestIntelligence,
} from "./singleIntelligenceSourceGateway.ts";
import type { IntelligenceGatewayResult } from "./singleIntelligenceSourceContract.ts";
import { attachExecutiveTimeContextToGatewayRequest } from "./executiveTimeContextGateway.ts";

export type IntelligenceContextRequestResult = Readonly<{
  build: IntelligenceContextBuildResult;
  gateway: IntelligenceGatewayResult | null;
}>;

function toGatewayRequest(context: UnifiedIntelligenceContext) {
  const request = buildIntelligenceGatewayRequest({
    consumer: context.consumer,
    panel: context.panel,
    mode: context.dashboardMode,
    workspaceId: context.workspace,
    context: {
      selectionLabel: context.selectionPath.at(-1) ?? null,
      contextLabel: context.viewMode,
      metadata: Object.freeze({
        selectedKpi: context.selectedKpi,
        selectedRisk: context.selectedRisk,
        timelineIndex:
          context.timelinePosition.index == null
            ? null
            : String(context.timelinePosition.index),
      }),
    },
    selection: {
      objectId: context.selectedObject,
      scenarioId: context.selectedScenario,
      relationshipId: context.selectedRelationship,
      dataSourceId: context.selectedDataSource,
    },
  });
  return attachExecutiveTimeContextToGatewayRequest(request, context.executiveTimeContext);
}

export function requestIntelligenceWithContext(
  input: BuildIntelligenceContextInput
): IntelligenceContextRequestResult {
  const build = buildIntelligenceContext(input);
  if (!build.success || !build.context) {
    return Object.freeze({ build, gateway: null });
  }

  const gateway = requestIntelligence(toGatewayRequest(build.context));
  return Object.freeze({ build, gateway });
}

export function requestIntelligenceFromCurrentContext(): IntelligenceContextRequestResult | null {
  const context = getCurrentIntelligenceContext();
  if (!context) return null;
  const gateway = requestIntelligence(toGatewayRequest(context));
  return Object.freeze({
    build: Object.freeze({
      success: true,
      context,
      validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
      reason: "existing",
      message: "Using current intelligence context.",
    }),
    gateway,
  });
}

export function updateAndRequestIntelligence(
  patch: BuildIntelligenceContextInput
): IntelligenceContextRequestResult {
  const current = getCurrentIntelligenceContext();
  const build = current ? updateIntelligenceContext(current, patch) : buildIntelligenceContext(patch);
  if (!build.success || !build.context) {
    return Object.freeze({ build, gateway: null });
  }
  const gateway = requestIntelligence(toGatewayRequest(build.context));
  return Object.freeze({ build, gateway });
}

export function restoreIntelligenceContextFromSnapshot(snapshotId: string): UnifiedIntelligenceContext | null {
  const snapshot = getIntelligenceContextSnapshotById(snapshotId);
  if (!snapshot) return null;
  restoreIntelligenceContext(snapshot.context);
  createIntelligenceContextSnapshot({
    context: snapshot.context,
    reason: "restored",
  });
  recordIntelligenceContextEvent({
    type: "ContextRestored",
    contextId: snapshot.context.contextId,
    consumer: snapshot.context.consumer,
    workspace: snapshot.context.workspace,
  });
  recordIntelligenceContextEvent({
    type: "ContextSnapshotCreated",
    contextId: snapshot.context.contextId,
    consumer: snapshot.context.consumer,
    workspace: snapshot.context.workspace,
  });
  return snapshot.context;
}

export const IntelligenceContextGateway = Object.freeze({
  requestIntelligenceWithContext,
  requestIntelligenceFromCurrentContext,
  updateAndRequestIntelligence,
  restoreIntelligenceContextFromSnapshot,
});
