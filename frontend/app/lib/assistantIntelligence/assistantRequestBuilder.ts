/**
 * INT-2 — Assistant Request Builder.
 * Sole creator of immutable AssistantIntelligenceRequest objects.
 */

import {
  ASSISTANT_EXECUTIVE_REQUEST_TYPES,
  ASSISTANT_INTELLIGENCE_CONSUMER,
  ASSISTANT_INTELLIGENCE_SOURCE,
  ASSISTANT_INTELLIGENCE_VERSION,
  ASSISTANT_REQUEST_PANEL_MAP,
  type AssistantIntelligenceRequest,
  type AssistantIntelligenceSelection,
  type AssistantRequestBuildResult,
  type BuildAssistantIntelligenceInput,
} from "./assistantIntelligenceContract.ts";
import { adaptAssistantContext } from "./assistantContextAdapter.ts";
import type { ExecutiveTimeState } from "../dashboardIntelligence/executiveTimeContextContract.ts";
import { buildExecutiveTimeContext } from "../dashboardIntelligence/executiveTimeContextBuilder.ts";
import { buildIntelligenceContext } from "../dashboardIntelligence/intelligenceContextBuilder.ts";

let assistantRequestSequence = 0;
let conversationSequence = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function nextAssistantRequestId(): string {
  assistantRequestSequence += 1;
  return `asst_req_${assistantRequestSequence}_${Date.now()}`;
}

function nextConversationId(provided: string | null | undefined): string {
  const trimmed = typeof provided === "string" ? provided.trim() : "";
  if (trimmed) return trimmed;
  conversationSequence += 1;
  return `asst_conv_${conversationSequence}`;
}

function normalizeSelection(
  input: Partial<AssistantIntelligenceSelection> | null | undefined
): AssistantIntelligenceSelection {
  const normalize = (value: unknown): string | null => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    return trimmed || null;
  };
  return Object.freeze({
    objectId: normalize(input?.objectId),
    relationshipId: normalize(input?.relationshipId),
    kpiId: normalize(input?.kpiId),
    riskId: normalize(input?.riskId),
    scenarioId: normalize(input?.scenarioId),
    dataSourceId: normalize(input?.dataSourceId),
  });
}

/**
 * Maps manager tense cues to Executive Time Context input.
 * Executive Time Context builder remains the sole creator of time context.
 */
export function inferExecutiveTimeStateFromManagerPhrase(
  phrase: string | null | undefined
): ExecutiveTimeState | null {
  const normalized = typeof phrase === "string" ? phrase.toLowerCase().trim() : "";
  if (!normalized) return null;
  if (/\b(if|what if|would|will|could|hypothetical|simulate|prediction|predict|planned)\b/.test(normalized)) {
    return "future";
  }
  if (/\b(was|were|had been|previously|historically|completed|last quarter|last month|last week|last year)\b/.test(normalized)) {
    return "past";
  }
  if (/\b(is|are|currently|now|today|live|ongoing)\b/.test(normalized)) {
    return "now";
  }
  return null;
}

export function buildAssistantIntelligenceRequest(
  input: BuildAssistantIntelligenceInput
): AssistantRequestBuildResult {
  if (!ASSISTANT_EXECUTIVE_REQUEST_TYPES.includes(input.requestType)) {
    return Object.freeze({
      success: false,
      request: null,
      reason: "unsupported_request_type",
      message: `Request type "${String(input.requestType)}" is not supported in INT-2.`,
    });
  }

  const inferredTimeState = inferExecutiveTimeStateFromManagerPhrase(input.managerPhrase);
  const adapted = adaptAssistantContext({
    ...input,
    executiveTime: Object.freeze({
      ...input.executiveTime,
      timeState: input.executiveTime?.timeState ?? inferredTimeState ?? undefined,
      requestedTime: input.executiveTime?.requestedTime ?? input.managerPhrase ?? null,
    }),
  });

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

  const request: AssistantIntelligenceRequest = Object.freeze({
    contractVersion: ASSISTANT_INTELLIGENCE_VERSION,
    assistantRequestId: nextAssistantRequestId(),
    conversationId: nextConversationId(input.conversationId),
    requestId: contextBuild.context.requestId,
    requestType: input.requestType,
    managerPhrase: typeof input.managerPhrase === "string" ? input.managerPhrase.trim() || null : null,
    workspace: contextBuild.context.workspace,
    consumer: ASSISTANT_INTELLIGENCE_CONSUMER,
    panel: adapted.panel ?? ASSISTANT_REQUEST_PANEL_MAP[input.requestType],
    selection: normalizeSelection({
      objectId: contextBuild.context.selectedObject,
      relationshipId: contextBuild.context.selectedRelationship,
      kpiId: contextBuild.context.selectedKpi,
      riskId: contextBuild.context.selectedRisk,
      scenarioId: contextBuild.context.selectedScenario,
      dataSourceId: contextBuild.context.selectedDataSource,
    }),
    executiveTime: adapted.executiveTimeInput,
    intelligenceContext: contextBuild.context,
    executiveTimeContext: timeBuild.timeContext,
    timestamp: nowIso(),
    source: ASSISTANT_INTELLIGENCE_SOURCE,
  });

  return Object.freeze({
    success: true,
    request,
    reason: "built",
    message: "Assistant intelligence request built.",
  });
}

export function resetAssistantRequestBuilderForTests(): void {
  assistantRequestSequence = 0;
  conversationSequence = 0;
}

export const AssistantRequestBuilder = Object.freeze({
  buildAssistantIntelligenceRequest,
  inferExecutiveTimeStateFromManagerPhrase,
});
