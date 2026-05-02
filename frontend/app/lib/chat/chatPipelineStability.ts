import type { RightPanelView } from "../ui/right-panel/rightPanelTypes";

export type ChatPipelineStabilityInput = {
  runId: string;
  intent: string;
  targetPanel: string;
  confidence: number;
  userInput: string;
  currentPanel?: string | null;
  lastAppliedSignature?: string | null;
};

export type ChatPipelineStabilityDecision = {
  shouldOpenPanel: boolean;
  shouldApplyScene: boolean;
  reason: string;
  signature: string;
};

const MEANINGFUL_PANELS = new Set<string>([
  "dashboard",
  "risk",
  "timeline",
  "war_room",
  "strategic_command",
  "executive_object",
  "compare",
  "decision_timeline",
  "confidence_calibration",
]);

function normalizeText(input: string): string {
  return String(input ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

export function isMeaningfulPanel(view: RightPanelView | string | null | undefined): boolean {
  const normalized = typeof view === "string" ? view.trim() : "";
  if (!normalized) return false;
  return MEANINGFUL_PANELS.has(normalized);
}

export function evaluateChatPipelineStability(
  input: ChatPipelineStabilityInput
): ChatPipelineStabilityDecision {
  const normalizedIntent = String(input.intent ?? "").trim().toLowerCase();
  const normalizedTarget = String(input.targetPanel ?? "").trim().toUpperCase();
  const normalizedPrompt = normalizeText(input.userInput);
  const signature = `${normalizedIntent}::${normalizedTarget}::${normalizedPrompt}`;
  const currentPanel = String(input.currentPanel ?? "").trim();
  const confidence = Number.isFinite(Number(input.confidence)) ? Number(input.confidence) : 0;

  if (input.lastAppliedSignature && input.lastAppliedSignature === signature) {
    return {
      shouldOpenPanel: false,
      shouldApplyScene: false,
      reason: "duplicate_signature",
      signature,
    };
  }

  if (normalizedTarget && currentPanel && normalizedTarget === currentPanel.toUpperCase()) {
    return {
      shouldOpenPanel: false,
      shouldApplyScene: false,
      reason: "same_target_panel",
      signature,
    };
  }

  if (confidence < 0.45 && isMeaningfulPanel(currentPanel)) {
    return {
      shouldOpenPanel: false,
      shouldApplyScene: false,
      reason: "low_confidence_preserve_meaningful_panel",
      signature,
    };
  }

  if (normalizedIntent === "open_panel") {
    return {
      shouldOpenPanel: true,
      shouldApplyScene: false,
      reason: "explicit_panel_open_intent",
      signature,
    };
  }

  if ((normalizedIntent === "decide" || normalizedIntent === "analyze") && confidence >= 0.55) {
    return {
      shouldOpenPanel: true,
      shouldApplyScene: true,
      reason: "high_confidence_decision_analysis",
      signature,
    };
  }

  return {
    shouldOpenPanel: false,
    shouldApplyScene: true,
    reason: "chat_only_scene_ack",
    signature,
  };
}

