import React from "react";
import { cardStyle, nx, primaryMetricStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { buildCanonicalRecommendation } from "../../lib/decision/recommendation/buildCanonicalRecommendation";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { RecommendationCard } from "../recommendation/RecommendationCard";
import { buildPanelResolvedData } from "../../lib/panels/buildPanelResolvedData";
import type { PanelSharedData } from "../../lib/panels/panelDataResolverTypes";
import type { AdviceAction, AdvicePanelData, SimulationPanelData } from "../../lib/panels/panelDataContract";
import { RightPanelFallback } from "../right-panel/RightPanelFallback";
import { dedupeNexoraDevLog, dedupePanelConsoleTrace } from "../../lib/debug/panelConsoleTraceDedupe";
import {
  buildAdviceWhyLines,
  extractNexoraB8FromSharedData,
  traceNexoraB9PanelMeaningEnriched,
} from "../../lib/panels/nexoraPanelMeaning";

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

function pickCompatibilityAdvice(value: AdvicePanelData | Record<string, unknown> | null | undefined) {
  const record = asRecord(value);
  if (!record) return null;

  // Compatibility only: some older callers still pass the advice slice nested once.
  const nestedAdvice = asRecord(record.strategic_advice);
  return nestedAdvice ?? record;
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
  const DEBUG_PANEL_TRACE = process.env.NODE_ENV !== "production";
  const resolved = buildPanelResolvedData("advice", panelData ?? null);
  const resolvedAdvice = asRecord(resolved.data as AdvicePanelData | null | undefined);
  const compatibilityAdvice = pickCompatibilityAdvice(advice);
  const normalizedAdvice = resolvedAdvice ?? compatibilityAdvice ?? {};
  const recommendation =
    canonicalRecommendation ??
    buildCanonicalRecommendation({
      strategicAdvice: normalizedAdvice,
    });
  const normalizedPrimaryRecommendation = asRecord(normalizedAdvice.primary_recommendation);
  const actions: AdviceAction[] = Array.isArray(normalizedAdvice.recommended_actions)
    ? normalizedAdvice.recommended_actions as AdviceAction[]
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

  const b8Attached = (panelData as { nexoraB8PanelContext?: unknown } | null | undefined)?.nexoraB8PanelContext;
  const nexoraB8 = React.useMemo(() => extractNexoraB8FromSharedData(panelData ?? null), [b8Attached]);
  const adviceWhyLines = React.useMemo(() => (nexoraB8 ? buildAdviceWhyLines(nexoraB8) : []), [nexoraB8]);

  React.useEffect(() => {
    if (!nexoraB8) return;
    traceNexoraB9PanelMeaningEnriched("advice", nexoraB8);
  }, [nexoraB8]);

  if (DEBUG_PANEL_TRACE) {
    dedupePanelConsoleTrace("PanelComponent", "advice", "main", {
      meaningfulData: Boolean(summary || primaryRecommendation || actions.length),
      hasSummary: Boolean(summary),
      hasRecommendation: Boolean(primaryRecommendation),
      actionsCount: actions.length,
      hasWhy: Boolean(why),
      hasSimulationContext: Boolean(simulationSummary || impactedNodes.length || riskDelta !== null),
    });
    dedupeNexoraDevLog("[Nexora][PanelResolver]", "strategic_advice", {
      panel: "strategic_advice",
      status: resolved.status,
      missingFields: resolved.missingFields,
    });
  }

  const hasThinRenderableAdvice = Boolean(summary || primaryRecommendation || actions.length || why || executiveSummary);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    console.warn("[Nexora][PanelLifecycle] mounted", {
      panel: "advice",
      readiness:
        resolved.status === "ready" ? "full" : resolved.status === "partial" ? "thin" : "empty",
      status: resolved.status,
      shape: {
        hasSummary: Boolean(summary),
        hasRecommendation: Boolean(primaryRecommendation),
        actionsCount: actions.length,
        hasWhy: Boolean(why),
        hasExecutiveSummary: Boolean(executiveSummary),
      },
    });
    return () => {
      console.warn("[Nexora][PanelLifecycle] unmounted", {
        panel: "advice",
      });
    };
  }, []);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!hasThinRenderableAdvice) return;
    console.warn("[Nexora][PanelLifecycle] thin_data_received", {
      panel: "advice",
      readiness: resolved.status === "ready" ? "full" : "thin",
      status: resolved.status,
      shape: {
        hasSummary: Boolean(summary),
        hasRecommendation: Boolean(primaryRecommendation),
        actionsCount: actions.length,
        hasWhy: Boolean(why),
        hasExecutiveSummary: Boolean(executiveSummary),
      },
    });
  }, [actions.length, executiveSummary, hasThinRenderableAdvice, primaryRecommendation, resolved.status, summary, why]);

  if (resolved.status === "fallback" || resolved.status === "empty_but_guided") {
    if (hasThinRenderableAdvice) {
      if (DEBUG_PANEL_TRACE) {
        dedupeNexoraDevLog("[Nexora][PanelRenderMismatch]", "advice_fallback", {
          panel: "advice",
          resolverStatus: resolved.status,
          reason: "component_kept_thin_render",
        });
        dedupePanelConsoleTrace("PanelThinRender", "advice", "fallback_thin", {
          hasSummary: Boolean(summary),
          hasRecommendation: Boolean(primaryRecommendation),
          actionsCount: actions.length,
        });
      }
    } else {
      if (DEBUG_PANEL_TRACE) {
        console.warn("[Nexora][PanelBlankGuard] triggered", {
          panel: "advice",
          reason: "resolver_fallback_and_no_thin_content",
        });
        console.warn("[Nexora][PanelLifecycle] blank_or_fallback_render", {
          panel: "advice",
          readiness: "empty",
          status: resolved.status,
          shape: {
            hasSummary: Boolean(summary),
            hasRecommendation: Boolean(primaryRecommendation),
            actionsCount: actions.length,
            hasWhy: Boolean(why),
            hasExecutiveSummary: Boolean(executiveSummary),
          },
        });
      }
      return (
        <RightPanelFallback
          title={resolved.title ?? "Strategic Advice"}
          message={resolved.message ?? "No strategic advice is available yet."}
          suggestedActionLabel={resolved.suggestedActionLabel ?? null}
          onSuggestedAction={null}
        />
      );
    }
  }

  if (DEBUG_PANEL_TRACE && hasThinRenderableAdvice && resolved.status === "partial") {
    dedupePanelConsoleTrace("PanelThinRender", "advice", "partial", {
      hasSummary: Boolean(summary),
      hasRecommendation: Boolean(primaryRecommendation),
      actionsCount: actions.length,
    });
  }

  if (DEBUG_PANEL_TRACE && !Array.isArray(normalizedAdvice.recommended_actions)) {
    console.warn("[Nexora] StrategicAdvicePanel received no recommended_actions", {
      source: resolvedAdvice ? "resolved" : compatibilityAdvice ? "compatibility" : "none",
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {adviceWhyLines.length > 0 ? (
        <div
          style={{
            ...softCardStyle,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            borderLeft: "3px solid rgba(96,165,250,0.45)",
          }}
        >
          <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Why this direction
          </div>
          {adviceWhyLines.map((line) => (
            <div key={line} style={{ color: nx.text, fontSize: 11, lineHeight: 1.45 }}>
              {line}
            </div>
          ))}
        </div>
      ) : null}
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
