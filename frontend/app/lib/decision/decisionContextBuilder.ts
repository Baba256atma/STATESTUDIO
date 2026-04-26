import type { DecisionContext, DecisionHorizon, DecisionUrgency, ScenarioDomain } from "./decisionAssistantTypes.ts";
import { resolveScenarioDomain } from "./scenarioPresetCatalog.ts";

export type BuildDecisionContextInput = {
  domainId?: string;
  userIntent?: string;
  selectedObjectId?: string;
  activePanel?: string;
  riskLevel?: string;
  fragileObjectIds?: string[];
  highlightedDriverIds?: string[];
  systemSummary?: string;
  metrics?: Record<string, number>;
};

function dedupeIds(ids: string[] | undefined): string[] {
  if (!Array.isArray(ids)) return [];
  return Array.from(
    new Set(ids.map((id) => String(id ?? "").trim()).filter((id) => id.length > 0))
  );
}

function normalizeUrgency(raw: string | undefined): DecisionUrgency {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (s.includes("critical") || s === "crit") return "critical";
  if (s.includes("high") || s === "severe") return "high";
  if (s.includes("medium") || s.includes("moderate") || s === "med") return "medium";
  return "low";
}

function inferHorizon(risk: DecisionUrgency, userIntent: string | undefined): DecisionHorizon {
  const blob = String(userIntent ?? "").toLowerCase();
  if (risk === "critical" || blob.includes("now") || blob.includes("immediate")) return "immediate";
  if (risk === "high" || blob.includes("quarter") || blob.includes("short")) return "short";
  return "mid";
}

export function buildDecisionContext(input: BuildDecisionContextInput): DecisionContext {
  const domainResolved: ScenarioDomain = resolveScenarioDomain(input.domainId);
  const domainId = String(input.domainId ?? domainResolved).trim() || domainResolved;
  const riskLevel = normalizeUrgency(input.riskLevel);
  const fragileObjectIds = dedupeIds(input.fragileObjectIds);
  const highlightedDriverIds = dedupeIds(input.highlightedDriverIds);
  const selected =
    typeof input.selectedObjectId === "string" && input.selectedObjectId.trim()
      ? input.selectedObjectId.trim()
      : undefined;
  const metrics =
    input.metrics && typeof input.metrics === "object" && !Array.isArray(input.metrics)
      ? { ...input.metrics }
      : undefined;

  return {
    domainId,
    systemSummary: typeof input.systemSummary === "string" ? input.systemSummary.trim() || undefined : undefined,
    riskLevel,
    fragileObjectIds,
    highlightedDriverIds,
    selectedObjectId: selected,
    userIntent: typeof input.userIntent === "string" ? input.userIntent.trim() || undefined : undefined,
    activePanel: typeof input.activePanel === "string" ? input.activePanel.trim() || undefined : undefined,
    timeHorizon: inferHorizon(riskLevel, input.userIntent),
    metrics,
  };
}
