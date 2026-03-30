"use client";

import React from "react";

import { nx, sectionTitleStyle, softCardStyle, primaryButtonStyle, secondaryButtonStyle } from "../ui/nexoraTheme";
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from "../ui/panelStates";
import type { CompareFocusDimension, CompareResult } from "../../lib/compare/compareTypes";
import type { WarRoomController } from "../../lib/warroom/warRoomTypes";
import { CompareSummaryView } from "./CompareSummaryView";
import { TradeoffList } from "./TradeoffList";
import { ObjectDeltaList } from "./ObjectDeltaList";
import { PathDeltaList } from "./PathDeltaList";
import { StrategicNarrativeBlock } from "./StrategicNarrativeBlock";
import { DecisionTimeline } from "./DecisionTimeline";
import type { DecisionTimelineStage } from "./TimelineNode";
import type { DecisionTimelineTransitionData } from "./TimelineTransition";

type ComparePanelProps = {
  controller: WarRoomController;
};

const FOCUS_DIMENSIONS: CompareFocusDimension[] = ["balanced", "risk", "efficiency", "stability", "growth"];

export function ComparePanel({ controller }: ComparePanelProps) {
  const [activeTimelineStageId, setActiveTimelineStageId] = React.useState<string | null>(null);
  const scenarios = controller.availableScenarios;
  const compare = controller.state.compare;
  const scenarioA = scenarios.find((scenario) => scenario.id === compare.scenarioAId) ?? null;
  const scenarioB = scenarios.find((scenario) => scenario.id === compare.scenarioBId) ?? null;
  const comparison = controller.comparison;
  const comparisonMetrics = comparison ? buildComparisonMetrics(comparison) : [];
  const recommendedOption = comparison ? resolveRecommendedOption(comparison) : "tie";
  const recommendedTitle =
    recommendedOption === "A"
      ? scenarioA?.title ?? "Option A"
      : recommendedOption === "B"
      ? scenarioB?.title ?? "Option B"
      : "No dominant option";
  const primaryAdvice = comparison?.advice[0] ?? null;
  const confidenceLabel = comparison ? formatConfidenceLabel(primaryAdvice?.confidence ?? comparison.summary.confidence) : "Low";
  const keyTradeoffSummary =
    comparison?.summary.keyTradeoffs.slice(0, 2).join(" · ") ||
    primaryAdvice?.explanation ||
    "Run compare mode to see where one option improves outcomes and where it introduces tradeoffs.";
  const hasBothScenarios = Boolean(compare.scenarioAId && compare.scenarioBId);
  const hasSingleScenario = Boolean(compare.scenarioAId || compare.scenarioBId) && !hasBothScenarios;
  const recommendationReasons = comparison
    ? buildRecommendationReasons(comparison, recommendedOption, compare.focusDimension)
    : [];
  const impactHighlights = comparison ? buildImpactHighlights(comparison) : [];
  const whyNotOthers = comparison
    ? buildAlternativeExplanations(comparison, recommendedOption, scenarioA?.title ?? "Option A", scenarioB?.title ?? "Option B")
    : [];
  const narrative = comparison
    ? buildStrategicNarrative({
        result: comparison,
        focusDimension: compare.focusDimension,
        recommendedOption,
        recommendedTitle,
        primaryAdviceTitle: primaryAdvice?.title ?? null,
        keyTradeoffSummary,
      })
    : null;
  const timeline = comparison
    ? buildDecisionTimelineData({
        result: comparison,
        focusDimension: compare.focusDimension,
        recommendedOption,
        scenarioA,
        scenarioB,
      })
    : null;

  React.useEffect(() => {
    setActiveTimelineStageId(timeline?.stages[1]?.id ?? timeline?.stages[0]?.id ?? null);
  }, [timeline?.stages]);

  const handleSelectTimelineStage = React.useCallback(
    (stage: DecisionTimelineStage) => {
      setActiveTimelineStageId(stage.id);
      controller.updateFocus(stage.focusObjectId ?? null);
    },
    [controller]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={sectionTitleStyle}>Compare Mode</div>
      <div style={{ ...softCardStyle, padding: 12, gap: 12, border: "1px solid rgba(96,165,250,0.18)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: nx.text, fontSize: 14, fontWeight: 800 }}>
            {comparison?.summary.headline ?? "Which option is better and why?"}
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
            {comparison?.summary.reasoning ??
              "Choose two scenarios, focus the comparison lens, and let Nexora show the strongest option and its tradeoffs."}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <select
            value={compare.scenarioAId ?? ""}
            onChange={(event) => controller.setCompareScenarioA(event.target.value || null)}
            style={{ borderRadius: 10, border: `1px solid ${nx.border}`, background: "rgba(2,6,23,0.5)", color: nx.text, padding: "10px 12px", fontSize: 12 }}
          >
            <option value="">Scenario A</option>
            {scenarios.map((scenario) => (
              <option key={`A:${scenario.id}`} value={scenario.id}>
                {scenario.title}
              </option>
            ))}
          </select>
          <select
            value={compare.scenarioBId ?? ""}
            onChange={(event) => controller.setCompareScenarioB(event.target.value || null)}
            style={{ borderRadius: 10, border: `1px solid ${nx.border}`, background: "rgba(2,6,23,0.5)", color: nx.text, padding: "10px 12px", fontSize: 12 }}
          >
            <option value="">Scenario B</option>
            {scenarios.map((scenario) => (
              <option key={`B:${scenario.id}`} value={scenario.id}>
                {scenario.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 6 }}>
          {FOCUS_DIMENSIONS.map((dimension) => {
            const active = compare.focusDimension === dimension;
            return (
              <button
                key={dimension}
                type="button"
                onClick={() => controller.setCompareFocusDimension(dimension)}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${active ? nx.borderStrong : nx.border}`,
                  background: active ? "rgba(59,130,246,0.16)" : "rgba(2,6,23,0.42)",
                  color: active ? "#dbeafe" : nx.text,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "8px 6px",
                  cursor: "pointer",
                }}
              >
                {dimension === "balanced" ? "Balanced" : dimension[0].toUpperCase() + dimension.slice(1)}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 6 }}>
          {(["summary", "deep", "paths"] as const).map((mode) => {
            const active = compare.mode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => controller.setCompareViewMode(mode)}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${active ? nx.borderStrong : nx.border}`,
                  background: active ? "rgba(59,130,246,0.16)" : "rgba(2,6,23,0.42)",
                  color: active ? "#dbeafe" : nx.text,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "8px 6px",
                  cursor: "pointer",
                }}
              >
                {mode === "summary" ? "Summary" : mode === "deep" ? "Objects" : "Paths"}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button type="button" onClick={() => void controller.runCompare()} style={primaryButtonStyle}>
            Compare
          </button>
          <button type="button" onClick={() => controller.clearCompare()} style={secondaryButtonStyle}>
            Clear Compare
          </button>
        </div>
      </div>

      {controller.comparisonLoading ? <LoadingStateCard text="Evaluating tradeoffs across both strategies…" /> : null}
      {controller.comparisonError ? <ErrorStateCard text={controller.comparisonError} /> : null}

      {!controller.comparisonLoading && !controller.comparisonError && !controller.comparison && hasBothScenarios ? (
        <EmptyStateCard text="No comparison yet. Run compare mode to see which option leads and where the tradeoffs sit." />
      ) : null}

      {!controller.comparisonLoading && !controller.comparisonError && !controller.comparison && hasSingleScenario ? (
        <EmptyStateCard text="No alternative to compare yet. Select a second scenario to see a side-by-side decision view." />
      ) : null}

      {controller.comparison ? (
        <>
          {(() => {
            const comparisonResult = controller.comparison;
            if (!comparisonResult) return null;
            return (
          <div style={{ ...softCardStyle, padding: 12, gap: 12, border: recommendedOption === "tie" ? `1px solid ${nx.border}` : "1px solid rgba(96,165,250,0.24)" }}>
            <DecisionTimeline
              stages={timeline?.stages ?? []}
              transitions={timeline?.transitions ?? []}
              activeStageId={activeTimelineStageId}
              onSelectStage={handleSelectTimelineStage}
              emptyText="No timeline available. Run a simulation to see how the system evolves."
            />
            {narrative ? (
              <StrategicNarrativeBlock
                title="Strategic View"
                context={narrative.context}
                insight={narrative.insight}
                decision={narrative.decision}
                consequence={narrative.consequence}
                keyTakeaway={narrative.keyTakeaway}
                caution={narrative.caution}
              />
            ) : null}
            <RecommendationCard
              recommendedTitle={recommendedTitle}
              recommendedOption={recommendedOption}
              confidenceLabel={confidenceLabel}
              summary={keyTradeoffSummary}
              reasons={recommendationReasons}
              impactHighlights={impactHighlights}
              tradeoffs={comparisonResult.summary.keyTradeoffs.slice(0, 3)}
              whyNotOthers={whyNotOthers}
              onApply={() => void controller.runCompare()}
              onSimulateDeeper={() => void controller.runCompare()}
              onCompareAgain={() => controller.clearCompare()}
            />

            <CompareDecisionGrid
              scenarioALabel={scenarioA?.title ?? "Option A"}
              scenarioBLabel={scenarioB?.title ?? "Option B"}
              metrics={comparisonMetrics}
              recommendedOption={recommendedOption}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 10 }}>
              <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
                <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Key Trade-offs
                </div>
                {comparisonResult.summary.keyTradeoffs.length ? (
                  comparisonResult.summary.keyTradeoffs.slice(0, 3).map((tradeoff) => (
                    <div key={tradeoff} style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>
                      {tradeoff}
                    </div>
                  ))
                ) : (
                  <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                    No dominant trade-off signal yet.
                  </div>
                )}
              </div>

              <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
                <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Recommended Next Action
                </div>
                <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>
                  {primaryAdvice?.title ?? "Run a deeper simulation"}
                </div>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                  {primaryAdvice?.explanation ?? "Inspect object and path deltas to confirm the strongest option before acting."}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 2 }}>
                  <button type="button" onClick={() => void controller.runCompare()} style={primaryButtonStyle}>
                    Simulate Deeper
                  </button>
                  <button
                    type="button"
                    onClick={() => controller.setCompareViewMode(compare.mode === "paths" ? "deep" : "paths")}
                    style={secondaryButtonStyle}
                  >
                    {compare.mode === "paths" ? "Inspect Objects" : "View Risk Flow"}
                  </button>
                </div>
              </div>
            </div>
          </div>
            );
          })()}

          <CompareSummaryView result={controller.comparison} />
          <TradeoffList items={controller.comparison.tradeoffs} />
          {compare.mode !== "paths" ? <ObjectDeltaList items={controller.comparison.object_deltas} /> : null}
          {compare.mode !== "deep" ? <PathDeltaList items={controller.comparison.path_deltas} /> : null}
        </>
      ) : null}
    </div>
  );
}

function CompareDecisionGrid(props: {
  scenarioALabel: string;
  scenarioBLabel: string;
  metrics: ComparisonMetric[];
  recommendedOption: "A" | "B" | "tie";
}) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 0 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr minmax(0, 0.95fr) minmax(0, 0.95fr)",
          gap: 10,
          paddingBottom: 10,
          marginBottom: 8,
          borderBottom: `1px solid ${nx.border}`,
          alignItems: "end",
        }}
      >
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Decision Dimension
        </div>
        <CompareColumnHeader label={props.scenarioALabel} active={props.recommendedOption === "A"} />
        <CompareColumnHeader label={props.scenarioBLabel} active={props.recommendedOption === "B"} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {props.metrics.map((metric, index) => (
          <div
            key={metric.label}
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr minmax(0, 0.95fr) minmax(0, 0.95fr)",
              gap: 10,
              alignItems: "center",
              padding: "10px 0",
              borderBottom: index === props.metrics.length - 1 ? "none" : `1px solid rgba(148,163,184,0.12)`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{metric.label}</div>
              {metric.note ? <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.35 }}>{metric.note}</div> : null}
            </div>
            <CompareMetricCell value={metric.valueA} tone={metric.toneA} winner={metric.winner === "A"} />
            <CompareMetricCell value={metric.valueB} tone={metric.toneB} winner={metric.winner === "B"} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationCard(props: {
  recommendedTitle: string;
  recommendedOption: "A" | "B" | "tie";
  confidenceLabel: string;
  summary: string;
  reasons: string[];
  impactHighlights: ImpactHighlight[];
  tradeoffs: string[];
  whyNotOthers: AlternativeExplanation[];
  onApply: () => void;
  onSimulateDeeper: () => void;
  onCompareAgain: () => void;
}) {
  return (
    <div style={{ ...softCardStyle, padding: 14, gap: 12, border: props.recommendedOption === "tie" ? `1px solid ${nx.border}` : "1px solid rgba(96,165,250,0.24)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Recommended Decision
          </div>
          <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 800, lineHeight: 1.3 }}>
            {props.recommendedOption === "tie" ? "No dominant option yet" : props.recommendedTitle}
          </div>
          <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700 }}>
            {props.recommendedOption === "tie" ? "Trade-off decision" : "Best overall outcome"}
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.summary}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Badge
            label={props.recommendedOption === "tie" ? "No dominant option" : "Recommended"}
            tone={props.recommendedOption === "tie" ? "neutral" : "info"}
          />
          <Badge
            label={`Confidence ${props.confidenceLabel}`}
            tone={props.confidenceLabel === "High" ? "positive" : props.confidenceLabel === "Medium" ? "warning" : "neutral"}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ExplainabilityBlock
          title="Why this option?"
          items={props.reasons.length ? props.reasons : ["No recommendation yet. Run a simulation or comparison to generate guidance."]}
        />
        <ImpactSummaryBlock items={props.impactHighlights} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ExplainabilityBlock
          title="Trade-offs"
          items={props.tradeoffs.length ? props.tradeoffs : ["No dominant trade-off signal yet."]}
        />
        <AlternativeRejectionBlock items={props.whyNotOthers} />
      </div>

      <details
        style={{
          ...softCardStyle,
          padding: 12,
          border: `1px solid ${nx.border}`,
          background: "rgba(2,6,23,0.28)",
        }}
      >
        <summary style={{ color: nx.text, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>View reasoning details</summary>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            Nexora is prioritizing the option that best aligns with the current comparison focus while still exposing the main visible trade-offs.
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            Use the comparison grid below to verify the leading dimensions, then inspect object or path deltas if you need deeper supporting evidence.
          </div>
        </div>
      </details>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 2, borderTop: `1px solid ${nx.border}` }}>
        <button type="button" onClick={props.onApply} style={primaryButtonStyle}>
          Apply This Decision
        </button>
        <button type="button" onClick={props.onSimulateDeeper} style={secondaryButtonStyle}>
          Simulate Deeper
        </button>
        <button type="button" onClick={props.onCompareAgain} style={secondaryButtonStyle}>
          Compare Again
        </button>
      </div>
    </div>
  );
}

function ExplainabilityBlock(props: { title: string; items: string[] }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
      <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.title}
      </div>
      {props.items.slice(0, 4).map((item) => (
        <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 800, lineHeight: 1.4 }}>•</span>
          <span style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

type ImpactHighlight = {
  label: string;
  value: string;
  tone: MetricTone;
};

function ImpactSummaryBlock(props: { items: ImpactHighlight[] }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
      <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Expected Impact
      </div>
      {props.items.length ? (
        props.items.map((item) => {
          const toneColor = item.tone === "positive" ? nx.success : item.tone === "negative" ? nx.risk : "#cbd5e1";
          const direction = item.tone === "positive" ? "↑" : item.tone === "negative" ? "↓" : "•";
          return (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{item.label}</div>
              <div style={{ color: toneColor, fontSize: 12, fontWeight: 800 }}>
                {direction} {item.value}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
          No clear impact shift is visible yet.
        </div>
      )}
    </div>
  );
}

type AlternativeExplanation = {
  label: string;
  reason: string;
};

function AlternativeRejectionBlock(props: { items: AlternativeExplanation[] }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
      <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Why not others?
      </div>
      {props.items.length ? (
        props.items.map((item) => (
          <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{item.label}</div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{item.reason}</div>
          </div>
        ))
      ) : (
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
          No alternative explanation available yet.
        </div>
      )}
    </div>
  );
}

function Badge(props: { label: string; tone: "positive" | "warning" | "info" | "neutral" }) {
  const toneMap = {
    positive: { color: "#dcfce7", border: "rgba(34,197,94,0.28)", background: "rgba(34,197,94,0.12)" },
    warning: { color: "#fef3c7", border: "rgba(245,158,11,0.28)", background: "rgba(245,158,11,0.12)" },
    info: { color: "#dbeafe", border: "rgba(96,165,250,0.28)", background: "rgba(59,130,246,0.14)" },
    neutral: { color: "#cbd5e1", border: nx.border, background: "rgba(15,23,42,0.58)" },
  } as const;
  const tone = toneMap[props.tone];
  return (
    <div
      style={{
        borderRadius: 999,
        border: `1px solid ${tone.border}`,
        background: tone.background,
        color: tone.color,
        fontSize: 11,
        fontWeight: 800,
        padding: "6px 10px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {props.label}
    </div>
  );
}

function CompareColumnHeader(props: { label: string; active: boolean }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${props.active ? "rgba(96,165,250,0.32)" : nx.border}`,
        background: props.active ? "rgba(59,130,246,0.14)" : "rgba(2,6,23,0.3)",
        color: props.active ? "#dbeafe" : nx.text,
        fontSize: 12,
        fontWeight: 800,
        padding: "9px 10px",
        minWidth: 0,
      }}
    >
      {props.label}
    </div>
  );
}

function CompareMetricCell(props: { value: string; tone: MetricTone; winner: boolean }) {
  const toneColor = props.tone === "positive" ? nx.success : props.tone === "negative" ? nx.risk : "#cbd5e1";
  const toneBackground =
    props.tone === "positive"
      ? "rgba(34,197,94,0.08)"
      : props.tone === "negative"
      ? "rgba(248,113,113,0.08)"
      : "rgba(15,23,42,0.42)";
  const direction = props.tone === "positive" ? "↑" : props.tone === "negative" ? "↓" : "•";

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${props.winner ? "rgba(96,165,250,0.26)" : "rgba(148,163,184,0.14)"}`,
        background: props.winner ? "rgba(59,130,246,0.08)" : toneBackground,
        padding: "10px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        minWidth: 0,
      }}
    >
      <span style={{ color: toneColor, fontSize: 12, fontWeight: 800 }}>{direction}</span>
      <span
        style={{
          color: props.winner ? "#f8fafc" : nx.text,
          fontSize: 12,
          fontWeight: props.winner ? 800 : 700,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.value}
      </span>
    </div>
  );
}

type MetricTone = "positive" | "negative" | "neutral";

type ComparisonMetric = {
  label: string;
  valueA: string;
  valueB: string;
  toneA: MetricTone;
  toneB: MetricTone;
  winner: "A" | "B" | "tie";
  note?: string;
};

function buildComparisonMetrics(result: CompareResult): ComparisonMetric[] {
  const riskTradeoff = result.tradeoffs.find((item) => item.dimension === "risk") ?? null;
  const efficiencyTradeoff = result.tradeoffs.find((item) => item.dimension === "efficiency") ?? null;
  const stabilityTradeoff = result.tradeoffs.find((item) => item.dimension === "stability") ?? null;
  const growthTradeoff = result.tradeoffs.find((item) => item.dimension === "growth") ?? null;
  const criticalPath = result.path_deltas.find((item) => item.strategicRole === "critical") ?? result.path_deltas[0] ?? null;
  const topObject = result.object_deltas
    .slice()
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0] ?? null;

  return [
    createTradeoffMetric("Impact Score", riskTradeoff, "Lower visible risk wins here."),
    createTradeoffMetric("Execution Speed", efficiencyTradeoff, "Faster operational effect is favored."),
    createTradeoffMetric("System Stability", stabilityTradeoff, "More stable outcome reduces fragility."),
    createTradeoffMetric("Growth Flexibility", growthTradeoff, "Higher upside without excessive downside."),
    criticalPath
      ? {
          label: "Critical Path",
          valueA: formatSignedScore(criticalPath.strengthA),
          valueB: formatSignedScore(criticalPath.strengthB),
          toneA: criticalPath.interpretation === "weaker" ? "positive" : criticalPath.interpretation === "stronger" ? "negative" : "neutral",
          toneB: criticalPath.interpretation === "weaker" ? "negative" : criticalPath.interpretation === "stronger" ? "positive" : "neutral",
          winner: criticalPath.interpretation === "equal" ? "tie" : criticalPath.interpretation === "weaker" ? "A" : "B",
          note: criticalPath.rationale,
        }
      : null,
    topObject
      ? {
          label: "Top Object Shift",
          valueA: formatSignedScore(topObject.impactA),
          valueB: formatSignedScore(topObject.impactB),
          toneA: topObject.delta < 0 ? "positive" : topObject.delta > 0 ? "negative" : "neutral",
          toneB: topObject.delta > 0 ? "positive" : topObject.delta < 0 ? "negative" : "neutral",
          winner: topObject.interpretation === "neutral" ? "tie" : topObject.delta < 0 ? "A" : "B",
          note: topObject.rationale,
        }
      : null,
  ].filter((metric): metric is ComparisonMetric => Boolean(metric)).slice(0, 6);
}

function buildRecommendationReasons(
  result: CompareResult,
  recommendedOption: "A" | "B" | "tie",
  focusDimension: CompareFocusDimension
) {
  const reasons = result.tradeoffs
    .filter((item) => item.winner === recommendedOption || (recommendedOption === "tie" && item.winner === "tie"))
    .slice(0, 3)
    .map((item) => item.explanation);

  if (reasons.length) return reasons;

  const fallbackReason = result.summary.reasoning || "This option is currently the strongest overall fit.";
  const focusReason =
    focusDimension === "balanced"
      ? "It provides the most balanced outcome across the current comparison dimensions."
      : `It aligns best with the current ${focusDimension} priority.`;

  return [fallbackReason, focusReason].slice(0, 2);
}

function buildImpactHighlights(result: CompareResult): ImpactHighlight[] {
  return buildComparisonMetrics(result)
    .slice(0, 4)
    .map((metric) => {
      const winnerValue =
        metric.winner === "A" ? metric.valueA : metric.winner === "B" ? metric.valueB : "Balanced";
      const tone =
        metric.winner === "tie"
          ? "neutral"
          : metric.winner === "A"
          ? metric.toneA
          : metric.toneB;
      return {
        label: metric.label,
        value: winnerValue,
        tone,
      };
    });
}

function buildAlternativeExplanations(
  result: CompareResult,
  recommendedOption: "A" | "B" | "tie",
  scenarioALabel: string,
  scenarioBLabel: string
): AlternativeExplanation[] {
  if (recommendedOption === "tie") {
    return [
      {
        label: scenarioALabel,
        reason: "It leads on some dimensions, but not enough to create a clear overall advantage.",
      },
      {
        label: scenarioBLabel,
        reason: "It preserves upside, but its trade-offs remain too close to call decisively.",
      },
    ];
  }

  const rejectedLabel = recommendedOption === "A" ? scenarioBLabel : scenarioALabel;
  const contraryTradeoffs = result.tradeoffs.filter((item) => item.winner !== recommendedOption && item.winner !== "tie");
  const reason =
    contraryTradeoffs[0]?.explanation ||
    result.summary.keyTradeoffs[0] ||
    "It introduces a weaker overall outcome against the current priority.";

  return [
    {
      label: rejectedLabel,
      reason,
    },
  ];
}

function createTradeoffMetric(
  label: string,
  tradeoff: CompareResult["tradeoffs"][number] | null,
  note: string
): ComparisonMetric | null {
  if (!tradeoff) return null;
  const winner = tradeoff.winner === "tie" ? "tie" : tradeoff.winner;
  return {
    label,
    valueA: winner === "A" ? "Leading" : winner === "tie" ? "Balanced" : "Trailing",
    valueB: winner === "B" ? "Leading" : winner === "tie" ? "Balanced" : "Trailing",
    toneA: winner === "A" ? "positive" : winner === "tie" ? "neutral" : "negative",
    toneB: winner === "B" ? "positive" : winner === "tie" ? "neutral" : "negative",
    winner,
    note: tradeoff.explanation || note,
  };
}

function resolveRecommendedOption(result: CompareResult): "A" | "B" | "tie" {
  const recommendation = result.advice[0]?.recommendation ?? null;
  if (recommendation === "choose_A") return "A";
  if (recommendation === "choose_B") return "B";
  if (result.summary.winner === "A" || result.summary.winner === "B") return result.summary.winner;
  return "tie";
}

function formatSignedScore(value: number) {
  if (!Number.isFinite(value)) return "0.00";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}

function formatConfidenceLabel(value: number) {
  if (!Number.isFinite(value)) return "Low";
  if (value >= 0.75) return "High";
  if (value >= 0.45) return "Medium";
  return "Low";
}

function buildDecisionTimelineData(input: {
  result: CompareResult;
  focusDimension: CompareFocusDimension;
  recommendedOption: "A" | "B" | "tie";
  scenarioA: { title: string; trigger: { targetId: string } } | null;
  scenarioB: { title: string; trigger: { targetId: string } } | null;
}): {
  stages: DecisionTimelineStage[];
  transitions: DecisionTimelineTransitionData[];
} {
  const metrics = buildComparisonMetrics(input.result);
  const topObject = input.result.object_deltas
    .slice()
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0] ?? null;
  const beforeFocusId = topObject?.object_id ?? input.scenarioA?.trigger.targetId ?? input.scenarioB?.trigger.targetId ?? null;
  const chosenScenario = input.recommendedOption === "B" ? input.scenarioB : input.scenarioA;
  const whatIfScenario = input.recommendedOption === "A" ? input.scenarioB : input.scenarioA;
  const chosenFocusId = chosenScenario?.trigger.targetId ?? topObject?.object_id ?? null;
  const whatIfFocusId = whatIfScenario?.trigger.targetId ?? topObject?.object_id ?? null;
  const primaryTradeoff = input.result.tradeoffs[0]?.explanation ?? "Current pressure is building across the compared system paths.";

  return {
    stages: [
      {
        id: "before",
        label: "Before",
        title: "Current state",
        narrative: "System under active decision pressure before a new move is applied.",
        focusObjectId: beforeFocusId,
        metrics: [
          { label: "Focus", value: input.focusDimension === "balanced" ? "Balanced" : capitalize(input.focusDimension), tone: "neutral" },
          { label: "Risk", value: inferRiskLabel(input.result), tone: "negative" },
          { label: "Pressure", value: "Active", tone: "negative" },
          { label: "Snapshot", value: summarizeMetric(metrics[0]), tone: "neutral" },
        ],
      },
      {
        id: "after",
        label: "After",
        title: input.recommendedOption === "tie" ? "Chosen decision" : chosenScenario?.title ?? "Chosen decision",
        narrative:
          input.recommendedOption === "tie"
            ? "This path shows the strongest current improvement if you commit to the leading signal."
            : "Expected outcome after applying the recommended path.",
        focusObjectId: chosenFocusId,
        metrics: buildStageMetrics(metrics, input.recommendedOption === "B" ? "B" : "A"),
      },
      {
        id: "what_if",
        label: "What-if",
        title: whatIfScenario?.title ?? "Alternative path",
        narrative: "Alternative outcome if you choose the other path instead.",
        focusObjectId: whatIfFocusId,
        metrics: buildStageMetrics(metrics, input.recommendedOption === "A" ? "B" : "A"),
      },
    ],
    transitions: [
      {
        id: "before_to_after",
        label: "Decision",
        summary: primaryTradeoff,
        tone: input.recommendedOption === "tie" ? "neutral" : "positive",
      },
      {
        id: "after_to_what_if",
        label: "What-if",
        summary: input.result.summary.keyTradeoffs[0] ?? "Alternative path shifts the decision balance.",
        tone: input.recommendedOption === "tie" ? "neutral" : "negative",
      },
    ],
  };
}

function buildStageMetrics(metrics: ComparisonMetric[], option: "A" | "B"): Array<{ label: string; value: string; tone: MetricTone }> {
  return metrics.slice(0, 4).map((metric) => ({
    label: metric.label,
    value: option === "A" ? metric.valueA : metric.valueB,
    tone: option === "A" ? metric.toneA : metric.toneB,
  }));
}

function inferRiskLabel(result: CompareResult) {
  const riskTradeoff = result.tradeoffs.find((item) => item.dimension === "risk");
  if (!riskTradeoff) return "Mixed";
  if (riskTradeoff.winner === "tie") return "Balanced";
  return "Elevated";
}

function summarizeMetric(metric?: ComparisonMetric) {
  if (!metric) return "No change";
  return metric.winner === "tie" ? "Balanced" : metric.winner === "A" ? metric.valueA : metric.valueB;
}

function capitalize(value: string) {
  return value.length ? value[0].toUpperCase() + value.slice(1) : value;
}

function buildStrategicNarrative(input: {
  result: CompareResult;
  focusDimension: CompareFocusDimension;
  recommendedOption: "A" | "B" | "tie";
  recommendedTitle: string;
  primaryAdviceTitle: string | null;
  keyTradeoffSummary: string;
}) {
  const focusLabel =
    input.focusDimension === "balanced"
      ? "overall decision balance"
      : input.focusDimension;
  const topTradeoff = input.result.tradeoffs[0]?.explanation ?? input.result.summary.reasoning;
  const leadingImpact = buildImpactHighlights(input.result)[0] ?? null;
  const caution = input.result.summary.keyTradeoffs[1] ?? input.result.summary.keyTradeoffs[0] ?? null;

  if (input.recommendedOption === "tie") {
    return {
      context: `The current comparison is centered on ${focusLabel}, but neither option has established a decisive lead.`,
      insight: `What matters most is the unresolved trade-off between the current options: ${topTradeoff}.`,
      decision: "The best move is to investigate one layer deeper before committing to a single path.",
      consequence: "That will clarify which option creates a stronger operational advantage without overcommitting too early.",
      keyTakeaway: "treat this as a trade-off decision and use deeper evidence before choosing.",
      caution,
    };
  }

  return {
    context: `The current comparison is centered on ${focusLabel}, and ${input.recommendedTitle} is emerging as the stronger move.`,
    insight: `The main issue is not raw option count, but which path creates the clearest advantage against the current priority. ${topTradeoff}`,
    decision: `${
      input.primaryAdviceTitle ?? input.recommendedTitle
    } is the best next decision because it creates the strongest overall outcome with the clearest strategic fit.`,
    consequence: leadingImpact
      ? `If executed, the system should improve most visibly through ${leadingImpact.label.toLowerCase()} while keeping the broader decision posture more stable.`
      : "If executed, the system should become more predictable around the current pressure point.",
    keyTakeaway: `prioritize ${input.recommendedTitle.toLowerCase()} over the weaker alternative while the current recommendation remains strong.`,
    caution,
  };
}
