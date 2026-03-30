import React from "react";
import { cardStyle, nx, primaryMetricStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { buildCanonicalRecommendation } from "../../lib/decision/recommendation/buildCanonicalRecommendation";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { RecommendationCard } from "../recommendation/RecommendationCard";
import { buildPanelResolvedData } from "../../lib/panels/buildPanelResolvedData";
import type { PanelSharedData } from "../../lib/panels/panelDataResolverTypes";
import type { AdviceAction, AdvicePanelData, SimulationPanelData } from "../../lib/panels/panelDataContract";
import { RightPanelFallback } from "../right-panel/RightPanelFallback";

type LooseRecord = Record<string, unknown>;

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" ? (value as LooseRecord) : null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length ? value : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export default function StrategicAdvicePanel({
  advice,
  canonicalRecommendation,
  data: panelData,
}: {
  advice: AdvicePanelData | Record<string, unknown> | null | undefined;
  canonicalRecommendation?: CanonicalRecommendation | null;
  data?: PanelSharedData | null;
}) {
  const resolved = buildPanelResolvedData("advice", panelData ?? null);
  const rawAdvice = asRecord(advice) ?? {};
  const sharedAdvice = asRecord(resolved.data as AdvicePanelData | null | undefined);
  const strategicAdvice = asRecord(rawAdvice.strategic_advice);
  const promptFeedback = asRecord(rawAdvice.prompt_feedback);
  const adviceFeedback = asRecord(promptFeedback?.advice_feedback);
  const normalizedAdvice = sharedAdvice ?? strategicAdvice ?? adviceFeedback ?? rawAdvice;
  const recommendation =
    canonicalRecommendation ??
    buildCanonicalRecommendation({
      strategicAdvice: normalizedAdvice,
    });
  const normalizedPrimaryRecommendation = asRecord(normalizedAdvice.primary_recommendation);
  const executiveSummarySurface = asRecord(rawAdvice.executive_summary_surface);
  const actions: AdviceAction[] = Array.isArray(normalizedAdvice.recommended_actions)
    ? normalizedAdvice.recommended_actions as AdviceAction[]
    : Array.isArray(strategicAdvice?.recommended_actions)
      ? strategicAdvice.recommended_actions as AdviceAction[]
      : Array.isArray(recommendation?.alternatives)
        ? recommendation.alternatives as AdviceAction[]
        : [];
  const primaryRecommendation =
    getString(normalizedPrimaryRecommendation?.action) ??
    getString(normalizedAdvice.recommendation) ??
    recommendation?.primary?.action ??
    null;
  const summary =
    getString(normalizedAdvice.summary) ??
    getString(executiveSummarySurface?.what_to_do) ??
    recommendation?.primary?.impact_summary ??
    "No strategic advice available yet.";
  const why =
    getString(normalizedAdvice.why) ??
    recommendation?.reasoning?.why ??
    null;
  const confidence = normalizedAdvice?.confidence ?? recommendation?.confidence?.level ?? recommendation?.confidence?.score ?? null;
  const executiveSummary = getString(normalizedAdvice.risk_summary) ?? recommendation?.reasoning?.risk_summary ?? null;
  const simulation = asRecord(panelData?.simulation as SimulationPanelData | null | undefined);
  const impactedNodes = Array.isArray(simulation?.impacted_nodes)
    ? simulation.impacted_nodes.map((value) => String(value)).filter(Boolean)
    : [];
  const relatedObjectIds = Array.isArray(normalizedAdvice.related_object_ids)
    ? normalizedAdvice.related_object_ids.map((value: unknown) => String(value)).filter(Boolean)
    : [];
  const supportingDriverLabels = Array.isArray(normalizedAdvice.supporting_driver_labels)
    ? normalizedAdvice.supporting_driver_labels.map((value: unknown) => String(value)).filter(Boolean)
    : [];
  const riskDelta = getNumber(simulation?.risk_delta);
  const simulationSummary = getString(simulation?.summary);

  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][PanelResolver]", {
      panel: "strategic_advice",
      status: resolved.status,
      missingFields: resolved.missingFields,
    });
  }

  if (resolved.status === "fallback" || resolved.status === "empty_but_guided") {
    return (
      <RightPanelFallback
        title={resolved.title ?? "Strategic Advice"}
        message={resolved.message ?? "No strategic advice is available yet."}
        suggestedActionLabel={resolved.suggestedActionLabel ?? null}
        onSuggestedAction={null}
      />
    );
  }

  if (process.env.NODE_ENV !== "production" && !Array.isArray(normalizedAdvice.recommended_actions)) {
    console.warn("[Nexora] StrategicAdvicePanel received no recommended_actions", rawAdvice);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {recommendation ? (
        <RecommendationCard rec={recommendation} />
      ) : (
        <div style={{ ...softCardStyle, color: nx.text, fontSize: 12 }}>
          No action is ready yet. Run a scan or scenario to surface the next move.
        </div>
      )}

      <div
        style={{
          ...cardStyle,
          border: "1px solid rgba(96,165,250,0.28)",
          boxShadow: "inset 0 0 0 1px rgba(96,165,250,0.08)",
        }}
      >
        <div style={sectionTitleStyle}>Do Now</div>
        <div style={primaryMetricStyle}>{primaryRecommendation ?? "No strategic advice available yet."}</div>
        <div style={{ color: nx.text, fontSize: 12 }}>{summary}</div>
        {confidence ? (
          <div style={{ color: "#93c5fd", fontSize: 12 }}>
            Confidence: {typeof confidence === "number" ? confidence.toFixed(2) : String(confidence)}
          </div>
        ) : null}
      </div>

      <div style={{ ...softCardStyle, color: nx.text, fontSize: 12 }}>
        {why ?? "No strategic rationale is available yet."}
      </div>
      {executiveSummary ? (
        <div style={{ ...softCardStyle, color: "#cbd5e1", fontSize: 12 }}>
          Executive summary: {executiveSummary}
        </div>
      ) : null}

      {simulationSummary || impactedNodes.length || riskDelta !== null ? (
        <div style={{ ...softCardStyle, padding: 10, gap: 6, display: "flex", flexDirection: "column" }}>
          <div style={{ color: nx.text, fontWeight: 700, fontSize: 13 }}>Expected Impact</div>
          <div style={{ color: "#cbd5e1", fontSize: 12 }}>
            {simulationSummary ?? "This action path already has a projected business effect."}
          </div>
          {impactedNodes.length ? (
            <div style={{ color: nx.muted, fontSize: 11 }}>
              Impacted objects: {impactedNodes.slice(0, 5).join(", ")}
            </div>
          ) : null}
          {riskDelta !== null ? (
            <div style={{ color: riskDelta <= 0 ? "#86efac" : "#fca5a5", fontSize: 11 }}>
              Risk change: {riskDelta > 0 ? "+" : ""}
              {riskDelta.toFixed(2)}
            </div>
          ) : null}
        </div>
      ) : supportingDriverLabels.length || relatedObjectIds.length ? (
          <div style={{ ...softCardStyle, padding: 10, gap: 6, display: "flex", flexDirection: "column" }}>
          <div style={{ color: nx.text, fontWeight: 700, fontSize: 13 }}>Why This Matters</div>
          {supportingDriverLabels.length ? (
            <div style={{ color: "#cbd5e1", fontSize: 12 }}>
              Active drivers: {supportingDriverLabels.slice(0, 4).join(", ")}
            </div>
          ) : null}
          {relatedObjectIds.length ? (
            <div style={{ color: nx.muted, fontSize: 11 }}>
              Related objects: {relatedObjectIds.slice(0, 5).join(", ")}
            </div>
          ) : null}
        </div>
      ) : (
          <div style={{ ...softCardStyle, padding: 10, color: nx.muted, fontSize: 12 }}>
          No additional operating context is available yet.
          </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {actions.length ? (
          actions.map((action, idx: number) => (
            <div
              key={idx}
              style={{
                ...softCardStyle,
                padding: 10,
              }}
            >
              <div style={{ color: nx.text, fontWeight: 700, fontSize: 13 }}>{action.action ?? "Suggested action"}</div>
              {action.tradeoff ? <div style={{ color: nx.muted, fontSize: 11 }}>Trade-off: {action.tradeoff}</div> : null}
              <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                {action.impact_summary ?? "Alternative path retained for comparison."}
              </div>
            </div>
          ))
        ) : (
          <div style={{ ...softCardStyle, padding: 10, color: nx.muted, fontSize: 12 }}>
            No action alternatives are available yet. Run a scan or scenario to build options.
          </div>
        )}
      </div>
    </div>
  );
}
