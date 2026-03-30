import type { DecisionExecutionResult } from "../../executive/decisionExecutionTypes";
import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import type { AuditEvent, TrustProvenance } from "../../governance/governanceTrustAuditContract";

export type DecisionTrustTimelineItem = {
  id: string;
  title: string;
  explanation: string;
  confidence?: number | null;
  source: "AI" | "Simulation" | "User" | "System";
  timestamp?: string | null;
};

export type DecisionTrustTimelineModel = {
  items: DecisionTrustTimelineItem[];
  summary: string;
};

type BuildDecisionTrustTimelineModelParams = {
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
  memoryEntry?: DecisionMemoryEntry | null;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function cleanText(value: unknown): string | null {
  const text = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text : null;
}

function limitSentence(value: string | null | undefined): string | null {
  const text = cleanText(value);
  if (!text) return null;
  const trimmed = text.split(/(?<=[.!?])\s+/)[0]?.trim() ?? text;
  return trimmed.length > 160 ? `${trimmed.slice(0, 157).trim()}...` : trimmed;
}

function normalizeConfidence(value: unknown): number | null {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.max(0, Math.min(1, num));
}

function mapSource(originType?: string | null, provenance?: TrustProvenance | null): DecisionTrustTimelineItem["source"] {
  if (originType === "user") return "User";
  if (originType === "agent") return "AI";
  if (originType === "scanner" || originType === "integration") return "System";
  if (provenance?.kind === "simulation_output") return "Simulation";
  if (provenance?.kind === "recommendation_output" || provenance?.kind === "explainability_output") return "AI";
  if (provenance?.kind === "multi_agent_output") return "AI";
  return "System";
}

function mapAuditTitle(eventType: string): string {
  switch (eventType) {
    case "prompt_submitted":
      return "Prompt submitted";
    case "reasoning_generated":
      return "Reasoning generated";
    case "simulation_run":
      return "Simulation run";
    case "scenario_compared":
      return "Comparison reviewed";
    case "recommendation_generated":
      return "Recommendation created";
    case "memory_updated":
      return "Decision saved";
    default:
      return "Decision update";
  }
}

function fallbackAuditExplanation(params: {
  event: AuditEvent;
  provenance?: TrustProvenance | null;
  recommendation?: CanonicalRecommendation | null;
  memoryEntry?: DecisionMemoryEntry | null;
  responseData?: any;
  decisionResult?: DecisionExecutionResult | null;
}): string {
  const note = limitSentence(asArray<string>(params.event.explanation_notes).join(" "));
  if (note) return note;

  switch (params.event.event_type) {
    case "prompt_submitted":
      return limitSentence(
        params.memoryEntry?.prompt ??
          params.responseData?.prompt_feedback?.prompt ??
          params.responseData?.prompt ??
          "A new decision question was submitted for review."
      ) ?? "A new decision question was submitted for review.";
    case "reasoning_generated":
      return (
        limitSentence(
          params.responseData?.executive_summary_surface?.why_it_matters ??
            params.recommendation?.reasoning?.why ??
            params.responseData?.analysis_summary
        ) ?? "Nexora interpreted the situation and identified the key decision pressure."
      );
    case "simulation_run":
      return (
        limitSentence(
          params.responseData?.decision_simulation?.impact?.summary ??
            params.recommendation?.simulation?.summary ??
            params.memoryEntry?.impact_summary
        ) ?? "A simulation estimated how the system could change if the move is executed."
      );
    case "scenario_compared":
      return (
        limitSentence(
          params.responseData?.decision_comparison?.summary ??
            params.memoryEntry?.compare_summary
        ) ?? "Alternative paths were reviewed to clarify the trade-offs."
      );
    case "recommendation_generated":
      return (
        limitSentence(
          params.recommendation?.reasoning?.why ??
            params.memoryEntry?.recommendation_summary
        ) ?? "A recommended move was created from the available signals."
      );
    case "memory_updated":
      return (
        limitSentence(
          params.memoryEntry?.impact_summary ??
            params.memoryEntry?.recommendation_summary
        ) ?? "The decision snapshot was stored for future replay and review."
      );
    default:
      return (
        limitSentence(params.event.after_hint ?? params.event.before_hint ?? params.provenance?.uncertainty_notes?.[0]) ??
        "This decision step was recorded for auditability."
      );
  }
}

function sortByTimestamp(items: DecisionTrustTimelineItem[]): DecisionTrustTimelineItem[] {
  return [...items].sort((a, b) => {
    const aTs = a.timestamp ? Date.parse(a.timestamp) : 0;
    const bTs = b.timestamp ? Date.parse(b.timestamp) : 0;
    return aTs - bTs;
  });
}

export function buildDecisionTrustTimelineModel(
  params: BuildDecisionTrustTimelineModelParams
): DecisionTrustTimelineModel {
  const auditEvents = asArray<AuditEvent>(params.responseData?.audit_events);
  const provenance = asArray<TrustProvenance>(params.responseData?.trust_provenance);
  const provenanceById = new Map(provenance.map((item) => [item.id, item]));
  const items: DecisionTrustTimelineItem[] = [];

  auditEvents.forEach((event) => {
    if (
      ![
        "prompt_submitted",
        "reasoning_generated",
        "simulation_run",
        "scenario_compared",
        "recommendation_generated",
        "memory_updated",
      ].includes(event.event_type)
    ) {
      return;
    }

    const linkedProvenance = event.provenance_ref_id ? provenanceById.get(event.provenance_ref_id) ?? null : null;
    items.push({
      id: event.id,
      title: mapAuditTitle(event.event_type),
      explanation: fallbackAuditExplanation({
        event,
        provenance: linkedProvenance,
        recommendation: params.canonicalRecommendation ?? null,
        memoryEntry: params.memoryEntry ?? null,
        responseData: params.responseData ?? null,
        decisionResult: params.decisionResult ?? null,
      }),
      confidence:
        normalizeConfidence(linkedProvenance?.confidence) ??
        (event.event_type === "recommendation_generated"
          ? normalizeConfidence(params.canonicalRecommendation?.confidence?.score)
          : event.event_type === "simulation_run"
          ? normalizeConfidence(params.responseData?.decision_simulation?.confidence ?? params.decisionResult?.simulation_result?.impact_score)
          : null),
      source: mapSource(event.origin_type ?? null, linkedProvenance),
      timestamp: event.timestamp,
    });
  });

  if (!items.some((item) => item.title === "Prompt submitted") && cleanText(params.memoryEntry?.prompt)) {
    items.push({
      id: `prompt_${params.memoryEntry?.id ?? "current"}`,
      title: "Prompt submitted",
      explanation: limitSentence(params.memoryEntry?.prompt) ?? "A decision question was submitted for review.",
      source: "User",
      timestamp: params.memoryEntry ? new Date(params.memoryEntry.created_at).toISOString() : null,
    });
  }

  if (!items.some((item) => item.title === "Recommendation created") && params.canonicalRecommendation?.primary?.action) {
    items.push({
      id: `recommendation_${params.canonicalRecommendation.id}`,
      title: "Recommendation created",
      explanation:
        limitSentence(params.canonicalRecommendation.reasoning.why) ??
        `Nexora recommended ${params.canonicalRecommendation.primary.action}.`,
      confidence: normalizeConfidence(params.canonicalRecommendation.confidence?.score),
      source:
        params.canonicalRecommendation.source === "simulation"
          ? "Simulation"
          : params.canonicalRecommendation.source === "ai_reasoning" ||
              params.canonicalRecommendation.source === "multi_agent"
            ? "AI"
            : "System",
      timestamp: params.canonicalRecommendation.created_at
        ? new Date(params.canonicalRecommendation.created_at).toISOString()
        : null,
    });
  }

  if (
    !items.some((item) => item.title === "Simulation run") &&
    (params.responseData?.decision_simulation || params.decisionResult?.simulation_result)
  ) {
    items.push({
      id: `simulation_${params.canonicalRecommendation?.id ?? params.memoryEntry?.id ?? "current"}`,
      title: "Simulation run",
      explanation:
        limitSentence(
          params.responseData?.decision_simulation?.impact?.summary ??
            params.canonicalRecommendation?.simulation?.summary ??
            params.memoryEntry?.impact_summary
        ) ?? "A simulation estimated the impact of the recommended move.",
      confidence: normalizeConfidence(params.responseData?.decision_simulation?.confidence),
      source: "Simulation",
      timestamp: params.memoryEntry ? new Date(params.memoryEntry.created_at).toISOString() : null,
    });
  }

  if (!items.some((item) => item.title === "Decision saved") && params.memoryEntry) {
    items.push({
      id: `memory_${params.memoryEntry.id}`,
      title: "Decision saved",
      explanation:
        limitSentence(params.memoryEntry.impact_summary ?? params.memoryEntry.recommendation_summary) ??
        "This recommendation and its expected impact were saved for later replay.",
      confidence: normalizeConfidence(params.memoryEntry.recommendation_confidence?.score),
      source:
        params.memoryEntry.source === "chat"
          ? "User"
          : params.memoryEntry.source === "simulation"
            ? "Simulation"
            : "System",
      timestamp: new Date(params.memoryEntry.created_at).toISOString(),
    });
  }

  const normalizedItems = sortByTimestamp(items)
    .filter((item, index, array) => array.findIndex((candidate) => candidate.title === item.title) === index)
    .slice(-6);

  const summary =
    limitSentence(
      params.canonicalRecommendation?.reasoning?.why ??
        params.responseData?.executive_summary_surface?.why_it_matters ??
        params.memoryEntry?.recommendation_summary
    ) ?? "Trace how the recommendation was formed, supported, and saved for review.";

  return {
    items: normalizedItems,
    summary,
  };
}
