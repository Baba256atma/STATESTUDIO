/**
 * Nexora Chat Prompt System
 * Modular, deterministic contracts for classifier/router/engines/formatter.
 */

export type NexoraChatIntent =
  | "explain"
  | "analyze"
  | "decide"
  | "open_panel"
  | "ask_context";

export type NexoraTargetPanel = "SCN" | "RSK" | "SIM_TIMELINE" | "SIM_WAR_ROOM" | "EXE";
export type NexoraTargetEngine = "explain_engine" | "analysis_engine" | "decision_engine" | "panel_routing" | "context_builder";

export type NexoraActionImpact = "high" | "medium" | "low";

export type NexoraCoreAction = {
  title: string;
  impact: NexoraActionImpact;
  confidence: number;
};

export type NexoraCoreResponse = {
  insight: string;
  actions: NexoraCoreAction[];
  confidence: number;
  recommended_panel: string;
  reason: string;
};

export type NexoraExplainResponse = {
  explanation: string;
  related_panel: string;
};

export type NexoraAnalysisDecisionRaw = {
  insight: string;
  options: Array<{ title: string; risk: string; impact: string }>;
  recommended: string;
  confidence: number;
};

export type NexoraGuidanceResponse = {
  next_steps: string[];
};

export type NexoraJustificationResponse = {
  why: string;
  evidence: string;
  risk_if_ignored: string;
};

export type NexoraContextBuilderResponse = {
  missing: string[];
  questions: string[];
};

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function normalizeText(input: string): string {
  return String(input ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

function sanitizeInsight(input: string): string {
  const cleaned = String(input ?? "")
    .replace(/^[\s\-*•]+/gm, "")
    .replace(/\bopen (the )?(panel|dashboard|timeline|view)\b/gi, "review this surface")
    .trim();
  if (!cleaned) return "Insufficient data";
  const lines = cleaned.split(/\n+/).map((line) => line.trim()).filter(Boolean).slice(0, 2);
  const joined = lines.join(" ");
  return joined.length > 180 ? `${joined.slice(0, 179)}…` : joined;
}

function includesAny(text: string, parts: readonly string[]): boolean {
  return parts.some((p) => text.includes(p));
}

const OPEN_PANEL_KEYWORDS = ["open ", "show ", "go to ", "panel", "dashboard", "timeline", "war room", "risk"];
const ASK_CONTEXT_KEYWORDS = ["missing", "need data", "not enough data", "which object", "what context", "clarify"];
const DECIDE_KEYWORDS = ["decide", "decision", "choose", "approve", "reject", "go or no-go", "recommend"];
const ANALYZE_KEYWORDS = ["analyze", "analysis", "impact", "tradeoff", "risk propagation", "what if"];
const EXPLAIN_KEYWORDS = ["explain", "why", "what is", "how does", "tell me about"];

export function classifyIntentDeterministic(input: string): { intent: NexoraChatIntent } {
  const text = normalizeText(input);
  if (!text) return { intent: "ask_context" };
  if (includesAny(text, OPEN_PANEL_KEYWORDS)) return { intent: "open_panel" };
  if (includesAny(text, ASK_CONTEXT_KEYWORDS)) return { intent: "ask_context" };
  if (includesAny(text, DECIDE_KEYWORDS)) return { intent: "decide" };
  if (includesAny(text, ANALYZE_KEYWORDS)) return { intent: "analyze" };
  if (includesAny(text, EXPLAIN_KEYWORDS)) return { intent: "explain" };
  return { intent: "analyze" };
}

function inferPanelFromText(input: string): NexoraTargetPanel {
  const text = normalizeText(input);
  if (text.includes("risk") || text.includes("fragility") || text.includes("conflict")) return "RSK";
  if (text.includes("timeline")) return "SIM_TIMELINE";
  if (text.includes("war room") || text.includes("simulate")) return "SIM_WAR_ROOM";
  if (text.includes("scene") || text.includes("object")) return "SCN";
  if (text.includes("dashboard") || text.includes("executive")) return "EXE";
  return "EXE";
}

export function routeIntentDeterministic(args: {
  intent: NexoraChatIntent;
  user_input: string;
}): { target_engine: NexoraTargetEngine; target_panel: NexoraTargetPanel } {
  const panel = inferPanelFromText(args.user_input);
  switch (args.intent) {
    case "explain":
      return { target_engine: "explain_engine", target_panel: panel };
    case "analyze":
      return { target_engine: "analysis_engine", target_panel: panel };
    case "decide":
      return { target_engine: "decision_engine", target_panel: panel };
    case "open_panel":
      return { target_engine: "panel_routing", target_panel: panel };
    case "ask_context":
      return { target_engine: "context_builder", target_panel: panel };
    default:
      return { target_engine: "context_builder", target_panel: "EXE" };
  }
}

export function formatCoreResponse(input: Partial<NexoraCoreResponse>): NexoraCoreResponse {
  const actions = Array.isArray(input.actions) ? input.actions.slice(0, 3) : [];
  return {
    insight: sanitizeInsight(String(input.insight ?? "Insufficient data")),
    actions: actions.map((a) => ({
      title: String(a.title ?? "").trim() || "Review current context",
      impact: a.impact === "high" || a.impact === "medium" ? a.impact : "low",
      confidence: clamp01(Number(a.confidence ?? 0.5)),
    })),
    confidence: clamp01(Number(input.confidence ?? 0.3)),
    recommended_panel: String(input.recommended_panel ?? "SCN"),
    reason: String(input.reason ?? "Need more context"),
  };
}

export function buildFailureResponse(): NexoraCoreResponse {
  return {
    insight: "Insufficient data",
    actions: [],
    confidence: 0.3,
    recommended_panel: "SCN",
    reason: "Need more context",
  };
}

/**
 * Prompt modules (to send into model layers if/when external LLM is used).
 */
export const NEXORA_PROMPT_MODULES = {
  core_system: `Role: Decision Assistant.
Tone: Executive, risk-aware, concise.
Output JSON only:
{
  "insight": "...",
  "actions": [{"title":"...","impact":"high|medium|low","confidence":0.0}],
  "confidence": 0.0,
  "recommended_panel": "string",
  "reason": "short explanation"
}
Rules:
- Always include insight
- Max 3 actions
- No hallucinated data
- If missing context ask targeted questions via context builder.`,

  intent_classifier: `Classify user input into one:
"explain" | "analyze" | "decide" | "open_panel" | "ask_context"
Output JSON only:
{"intent":"..."}`,

  router: `Map intent to engine/panel.
Engine mapping:
explain->Explain Engine
analyze->Analysis Engine
decide->Decision Engine
open_panel->Panel Routing
ask_context->Context Builder
Panel mapping hints:
risk->RSK
timeline->SIM_TIMELINE
war->SIM_WAR_ROOM
dashboard->EXE
scene->SCN
Output JSON only:
{"target_engine":"...","target_panel":"..."}`,

  explain: `Explain panel, metric, or decision in max 3 lines.
Output JSON only:
{"explanation":"...","related_panel":"..."}`,

  analysis_decision: `Given system state, objects, and question:
Output JSON only:
{
  "insight":"...",
  "options":[{"title":"...","risk":"...","impact":"..."}],
  "recommended":"...",
  "confidence":0.0
}
Rules: cause->effect, highlight risk propagation, max 3 options.`,

  follow_up_guidance: `Output JSON only:
{"next_steps":["...","..."]}
Rules: practical, concrete steps only.`,

  justification: `Output JSON only:
{"why":"...","evidence":"...","risk_if_ignored":"..."}`,

  context_builder: `Output JSON only:
{"missing":["..."],"questions":["...?","...?"]}
Rules: ask minimum necessary questions only.`,
} as const;

