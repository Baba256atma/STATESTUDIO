import {
  buildFailureResponse,
  classifyIntentDeterministic,
  formatCoreResponse,
  routeIntentDeterministic,
  type NexoraAnalysisDecisionRaw,
  type NexoraChatIntent,
  type NexoraContextBuilderResponse,
  type NexoraCoreResponse,
  type NexoraExplainResponse,
  type NexoraGuidanceResponse,
  type NexoraJustificationResponse,
  type NexoraTargetPanel,
} from "./nexoraChatPromptSystem";
import type { RightPanelView } from "../ui/right-panel/rightPanelTypes";

export type ChatRequestLifecycleStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "aborted"
  | "stale_ignored";

export const DEFAULT_CHAT_REQUEST_TIMEOUT_MS = 14_000;

export function isAbortLikeError(error: unknown): boolean {
  return !!error && typeof error === "object" && (error as { name?: string }).name === "AbortError";
}

export function getChatLifecycleErrorMessage(error: unknown, timedOut: boolean): string {
  if (timedOut) return "Request timed out. Please try again.";
  if (isAbortLikeError(error)) return "Request canceled.";
  const raw = error instanceof Error && error.message.trim() ? error.message.trim().toLowerCase() : "";
  if (/failed to fetch|networkerror|network request failed|load failed|econnrefused|socket hang up/i.test(raw)) {
    return "System temporarily unavailable.";
  }
  if (error instanceof Error && error.message.trim()) return error.message.trim();
  return "Sorry, I couldn't reach the server.";
}

export type NexoraChatPipelineInput = {
  userInput: string;
  context?: {
    selectedObjectId?: string | null;
    focusedObjectId?: string | null;
    rightPanelContextId?: string | null;
  };
  engines?: {
    runExplainEngine?: () => Promise<Partial<NexoraExplainResponse> | null> | Partial<NexoraExplainResponse> | null;
    runAnalysisEngine?: () => Promise<Partial<NexoraAnalysisDecisionRaw> | null> | Partial<NexoraAnalysisDecisionRaw> | null;
    runDecisionEngine?: () => Promise<Partial<NexoraAnalysisDecisionRaw> | null> | Partial<NexoraAnalysisDecisionRaw> | null;
    runContextBuilder?: () => Promise<Partial<NexoraContextBuilderResponse> | null> | Partial<NexoraContextBuilderResponse> | null;
    runGuidanceEngine?: () => Promise<Partial<NexoraGuidanceResponse> | null> | Partial<NexoraGuidanceResponse> | null;
    runJustificationEngine?: () => Promise<Partial<NexoraJustificationResponse> | null> | Partial<NexoraJustificationResponse> | null;
  };
};

export type NexoraChatPipelineResult = {
  intent: NexoraChatIntent;
  routing: ReturnType<typeof routeIntentDeterministic>;
  coreResponse: NexoraCoreResponse;
};

function mapPanelToReason(panel: NexoraTargetPanel): string {
  switch (panel) {
    case "RSK":
      return "Risk exposure is the dominant signal.";
    case "SIM_TIMELINE":
      return "Timeline sequencing is the dominant signal.";
    case "SIM_WAR_ROOM":
      return "Scenario simulation is the dominant signal.";
    case "SCN":
      return "Scene context is required for safe action.";
    case "EXE":
    default:
      return "Executive decision context is the closest fit.";
  }
}

function panelToDefaultInsight(intent: NexoraChatIntent): string {
  switch (intent) {
    case "explain":
      return "Primary metric and panel context are now clarified.";
    case "analyze":
      return "Primary pressure path is identified with actionable trade-offs.";
    case "decide":
      return "A recommended decision path is available with explicit risk trade-offs.";
    case "open_panel":
      return "Requested decision surface is ready.";
    case "ask_context":
      return "More context is required before making a reliable recommendation.";
    default:
      return "Insufficient data";
  }
}

export function mapNexoraTargetPanelToRightPanelView(panel: NexoraTargetPanel): RightPanelView {
  switch (panel) {
    case "RSK":
      return "risk";
    case "SIM_TIMELINE":
      return "timeline";
    case "SIM_WAR_ROOM":
      return "war_room";
    case "SCN":
      return "workspace";
    case "EXE":
    default:
      return "dashboard";
  }
}

export async function runNexoraChatPromptPipeline(
  input: NexoraChatPipelineInput
): Promise<NexoraChatPipelineResult> {
  const intent = classifyIntentDeterministic(input.userInput).intent;
  const routing = routeIntentDeterministic({
    intent,
    user_input: input.userInput,
  });

  try {
    let raw: Record<string, unknown> | null = null;
    if (routing.target_engine === "explain_engine") {
      const explain = await input.engines?.runExplainEngine?.();
      raw = {
        insight: explain?.explanation ?? panelToDefaultInsight(intent),
        actions: [],
      };
    } else if (routing.target_engine === "analysis_engine") {
      const analysis = await input.engines?.runAnalysisEngine?.();
      raw = {
        insight: analysis?.insight ?? panelToDefaultInsight(intent),
        actions: Array.isArray(analysis?.options)
          ? analysis.options.slice(0, 3).map((option) => ({
              title: String(option?.title ?? "Review analysis path"),
              impact: "medium",
              confidence: clampActionConfidence(analysis?.confidence),
            }))
          : [],
        confidence: clampActionConfidence(analysis?.confidence),
      };
    } else if (routing.target_engine === "decision_engine") {
      const decision = await input.engines?.runDecisionEngine?.();
      const guidance = await input.engines?.runGuidanceEngine?.();
      const justification = await input.engines?.runJustificationEngine?.();
      raw = {
        insight: decision?.insight ?? panelToDefaultInsight(intent),
        actions: [
          ...(Array.isArray(decision?.options)
            ? decision.options.slice(0, 2).map((option) => ({
                title: String(option?.title ?? "Evaluate decision branch"),
                impact: "high" as const,
                confidence: clampActionConfidence(decision?.confidence),
              }))
            : []),
          ...(Array.isArray(guidance?.next_steps)
            ? guidance.next_steps.slice(0, 1).map((step) => ({
                title: String(step ?? "Run next step"),
                impact: "medium" as const,
                confidence: clampActionConfidence(decision?.confidence),
              }))
            : []),
        ],
        confidence: clampActionConfidence(decision?.confidence),
        reason:
          typeof justification?.why === "string" && justification.why.trim().length > 0
            ? justification.why.trim()
            : mapPanelToReason(routing.target_panel),
      };
    } else if (routing.target_engine === "context_builder") {
      const context = await input.engines?.runContextBuilder?.();
      raw = {
        insight: panelToDefaultInsight(intent),
        actions: Array.isArray(context?.questions)
          ? context.questions.slice(0, 2).map((question) => ({
              title: String(question ?? "Provide missing context"),
              impact: "low",
              confidence: 0.5,
            }))
          : [],
        confidence: 0.4,
      };
    } else if (routing.target_engine === "panel_routing") {
      raw = {
        insight: panelToDefaultInsight(intent),
        actions: [],
        confidence: 0.8,
      };
    }

    const coreResponse = raw
      ? formatCoreResponse({
          ...raw,
          recommended_panel: routing.target_panel,
          reason:
            typeof raw.reason === "string" && raw.reason.trim().length > 0
              ? raw.reason
              : mapPanelToReason(routing.target_panel),
        })
      : buildFailureResponse();

    return { intent, routing, coreResponse };
  } catch {
    return {
      intent,
      routing,
      coreResponse: buildFailureResponse(),
    };
  }
}

function clampActionConfidence(value: unknown): number {
  const n = Number(value ?? 0.6);
  if (!Number.isFinite(n)) return 0.6;
  return Math.max(0, Math.min(1, n));
}
