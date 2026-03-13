"use client";

import React, { useMemo, useState } from "react";
import { useTimelineSimulator } from "../../hooks/useTimelineSimulator";
import { buildScenarioPresets } from "./scenarioPresets";
import { mapScenarioDeltaToObjects } from "./objectScenarioMap";
import {
  cardStyle,
  inputStyle,
  nx,
  primaryButtonStyle,
  sectionTitleStyle,
  secondaryButtonStyle,
  softCardStyle,
} from "../ui/nexoraTheme";
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from "../ui/panelStates";

type TimelinePanelProps = {
  backendBase: string;
  episodeId: string | null;
  onSceneUpdate?: (payload: any) => void;
};

function inferTimelineDomain(result: any): "business" | "politics" | "strategy" | "generic" {
  const text = JSON.stringify(result ?? {}).toLowerCase();

  if (
    text.includes("inventory") ||
    text.includes("delivery") ||
    text.includes("throughput") ||
    text.includes("cashflow")
  ) {
    return "business";
  }

  if (
    text.includes("diplomatic") ||
    text.includes("escalation") ||
    text.includes("retaliation") ||
    text.includes("coalition") ||
    text.includes("sanction") ||
    text.includes("geopolit")
  ) {
    return "politics";
  }

  if (
    text.includes("competitor") ||
    text.includes("pricing") ||
    text.includes("market") ||
    text.includes("rival")
  ) {
    return "strategy";
  }

  return "generic";
}

const TIMELINE_LABELS = {
  business: {
    panelSubtitle: "Operational timeline simulation",
    bestScenario: "Best Scenario",
    comparisonTitle: "Scenario Comparison",
    baselineVsBest: "Baseline vs Best",
    interpretationPositive: "Best scenario reduces fragility compared to baseline.",
    interpretationNeutral: "Best scenario does not materially improve fragility.",
    summaryWord: "resilience",
  },
  politics: {
    panelSubtitle: "Strategic timeline simulation",
    bestScenario: "Best Path",
    comparisonTitle: "Strategic Comparison",
    baselineVsBest: "Baseline vs Best Path",
    interpretationPositive: "Best path reduces escalation pressure compared to baseline.",
    interpretationNeutral: "Best path does not materially reduce strategic fragility.",
    summaryWord: "stability",
  },
  strategy: {
    panelSubtitle: "Competitive timeline simulation",
    bestScenario: "Best Strategy",
    comparisonTitle: "Strategic Comparison",
    baselineVsBest: "Baseline vs Best Strategy",
    interpretationPositive: "Best strategy improves resilience compared to baseline.",
    interpretationNeutral: "Best strategy does not materially improve resilience.",
    summaryWord: "resilience",
  },
  generic: {
    panelSubtitle: "Timeline simulation",
    bestScenario: "Best Scenario",
    comparisonTitle: "Scenario Comparison",
    baselineVsBest: "Baseline vs Best",
    interpretationPositive: "Best scenario reduces fragility compared to baseline.",
    interpretationNeutral: "Best scenario does not materially improve fragility.",
    summaryWord: "stability",
  },
} as const;

export function TimelinePanel({ backendBase, episodeId, onSceneUpdate }: TimelinePanelProps) {
  const { loading, error, result, runTimeline } = useTimelineSimulator({ backendBase, episodeId });
  const [steps, setSteps] = useState(3);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [scenarioEditorOpen, setScenarioEditorOpen] = useState(false);

  const handleApplyBest = async () => {
    setApplyError(null);
    setApplySuccess(null);
    if (!episodeId) {
      setApplyError("Send one chat message first so Nexora can create an episode.");
      return;
    }
    const bestName = String(result?.best_scenario ?? "").trim();
    if (!bestName) {
      setApplyError("No best scenario available yet.");
      return;
    }
    const bestScenario = scenarioInputs.find((s) => s.name === bestName);
    if (!bestScenario) {
      setApplyError(`Best scenario '${bestName}' not found in v0 presets.`);
      return;
    }

    setApplyLoading(true);
    try {
      const res = await fetch(`${backendBase}/scenario/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episode_id: episodeId,
          branch: false,
          delta: bestScenario.delta,
          absolute: {},
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.detail?.error?.message ||
          data?.detail?.message ||
          data?.error?.message ||
          "Apply best scenario failed";
        throw new Error(String(msg));
      }

      const payload = data?.data ?? data;
      onSceneUpdate?.(payload);
      const impacts = mapScenarioDeltaToObjects(bestScenario.delta || {});
      if (impacts.length) {
        setApplySuccess(`Applied: ${bestScenario.name} → ${impacts.map((x) => x.label).join(", ")}`);
      } else {
        setApplySuccess(`Applied: ${bestScenario.name}`);
      }
    } catch (e: any) {
      setApplyError(String(e?.message || "Apply best scenario failed"));
    } finally {
      setApplyLoading(false);
    }
  };

  const scenarios = Array.isArray(result?.scenarios) ? (result.scenarios as any[]) : [];
  const bestScenarioName = String(result?.best_scenario ?? "").trim();
  const inferredDomain = inferTimelineDomain(result);
  const [scenarioInputs, setScenarioInputs] = useState(() =>
    buildScenarioPresets(inferredDomain)
  );
  React.useEffect(() => {
    setScenarioInputs(buildScenarioPresets(inferredDomain));
  }, [inferredDomain]);
  const hasScenarioInputs = useMemo(() => scenarioInputs.length > 0, [scenarioInputs]);
  const labels = TIMELINE_LABELS[inferredDomain];
  const bestScenario = scenarios.find((s) => String(s?.name ?? "").trim() === bestScenarioName) ?? null;
  const baselineScenario = scenarios.find((s) => String(s?.name ?? "").trim() === "Baseline") ?? scenarios[0] ?? null;
  const fmt = (x: number) => (Number.isFinite(x) ? x.toFixed(2) : "-");
  const levelColor = (level: string) => {
    const v = String(level || "").toLowerCase();
    if (v === "low") return "#86efac";
    if (v === "medium") return "#fde68a";
    if (v === "high") return "#fca5a5";
    return "#cbd5e1";
  };
  const ranking = scenarios
    .map((s) => {
      const finalScore = Number(s?.final_fragility?.score ?? 0);
      const finalLevel = String(s?.final_fragility?.level ?? "-");
      const mcMean = Number(s?.montecarlo?.result?.stats?.mean ?? 0);
      const mcP90 = Number(s?.montecarlo?.result?.stats?.p90 ?? 0);
      return { scenario: s, finalScore, finalLevel, mcMean, mcP90 };
    })
    .sort((a, b) => a.finalScore - b.finalScore || a.mcMean - b.mcMean);
  const bestFinalScore = Number(bestScenario?.final_fragility?.score ?? 0);
  const baselineFinalScore = Number(baselineScenario?.final_fragility?.score ?? 0);
  const bestMcMean = Number(bestScenario?.montecarlo?.result?.stats?.mean ?? 0);
  const baselineMcMean = Number(baselineScenario?.montecarlo?.result?.stats?.mean ?? 0);
  const deltaFinal = bestFinalScore - baselineFinalScore;
  const deltaMcMean = bestMcMean - baselineMcMean;
  const interpretation =
    bestFinalScore < baselineFinalScore
      ? labels.interpretationPositive
      : labels.interpretationNeutral;
  const bestScenarioDelta =
    scenarioInputs.find((x) => x.name === bestScenarioName)?.delta ?? {};
  const bestScenarioImpacts = mapScenarioDeltaToObjects(bestScenarioDelta);

  const rootStyle: React.CSSProperties = {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    overflow: "hidden",
    padding: 12,
    borderRadius: 16,
    background: nx.bgPanel,
    border: `1px solid ${nx.border}`,
    color: nx.text,
    boxSizing: "border-box",
    backdropFilter: "blur(8px)",
  };
  const headerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingBottom: 10,
    flex: "0 0 auto",
  };
  const bodyScrollStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingRight: 4,
    paddingBottom: 96,
    fontSize: 12,
  };
  const footerStyle: React.CSSProperties = {
    position: "sticky",
    bottom: 0,
    zIndex: 2,
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingTop: 10,
    marginTop: 10,
    borderTop: "1px solid rgba(148,163,184,0.14)",
    background: "linear-gradient(180deg, rgba(7,16,25,0) 0%, rgba(7,16,25,0.92) 22%, rgba(7,16,25,0.98) 100%)",
    backdropFilter: "blur(8px)",
  };

  return (
    <div style={rootStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Timeline Simulator</div>
          <div style={{ color: nx.muted, fontSize: 12 }}>{labels.panelSubtitle}</div>
        </div>

        <div style={{ ...softCardStyle, flexDirection: "row", alignItems: "center", gap: 8, fontSize: 12 }}>
          <label htmlFor="timeline-steps">Steps</label>
          <input
            id="timeline-steps"
            type="number"
            min={1}
            max={12}
            value={steps}
            onChange={(e) => setSteps(Math.max(1, Math.min(12, Number(e.target.value || 3))))}
            style={{
              width: 70,
              ...inputStyle,
              padding: "4px 6px",
            }}
          />
        </div>
      </div>

      <div style={bodyScrollStyle}>
        {result ? (
          <div
            style={{
              ...cardStyle,
              background: nx.bgPanelSoft,
              backdropFilter: "blur(4px)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  ...sectionTitleStyle,
                }}
              >
                {labels.bestScenario}
              </div>
              <div style={{ color: nx.text, fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>
                {bestScenarioName || "-"}
              </div>
              {bestScenarioImpacts.length ? (
                <div style={{ color: "#93c5fd", fontSize: 12 }}>
                  Primary objects: {bestScenarioImpacts.map((x) => x.label).join(", ")}
                </div>
              ) : null}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ color: nx.muted }}>Horizon</span>
              <span style={{ color: nx.text, fontWeight: 700 }}>{Number(result?.timeline_horizon ?? 0)} steps</span>
            </div>
            <span
              style={{
                alignSelf: "flex-start",
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 999,
                border: `1px solid ${nx.border}`,
                background: nx.bgPanel,
                color: nx.text,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              {inferredDomain}
            </span>
            {result?.manager_report?.insight ? (
              <div style={{ color: "#cbd5e1" }}>
                Insight: <span style={{ color: nx.text }}>{String(result.manager_report.insight)}</span>
              </div>
            ) : null}
            {result?.manager_report?.warning ? (
              <div style={{ color: "#fca5a5" }}>
                Warning: <span style={{ color: "#fecaca" }}>{String(result.manager_report.warning)}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        {result && bestScenarioName ? (
          <button
            type="button"
            onClick={() => void handleApplyBest()}
            disabled={applyLoading || !episodeId}
            style={{
              ...primaryButtonStyle,
              cursor: applyLoading || !episodeId ? "default" : "pointer",
              opacity: applyLoading || !episodeId ? 0.7 : 1,
            }}
          >
            {applyLoading ? "Applying…" : "Apply best to scene"}
          </button>
        ) : null}
        {result && applySuccess ? <div style={{ color: "#86efac" }}>{applySuccess}</div> : null}
        {result && applyError ? <ErrorStateCard text={applyError} /> : null}

        {result ? (
          <>
            <div
              style={{
                ...sectionTitleStyle,
              }}
            >
              {labels.comparisonTitle}
            </div>

            <div
              style={{
                ...softCardStyle,
                padding: 12,
                gap: 8,
              }}
            >
              <div style={{ fontWeight: 700, color: nx.text }}>{labels.comparisonTitle}</div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ color: "#94a3b8" }}>{labels.bestScenario}</span>
                <span style={{ color: nx.text, fontWeight: 600 }}>
                  {String(bestScenario?.name ?? (bestScenarioName || "-"))}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <span style={{ color: "#94a3b8" }}>
                  {labels.baselineVsBest} ({String(baselineScenario?.name ?? "-")} → {String(bestScenario?.name ?? "-")})
                </span>
                <span style={{ color: nx.text }}>
                  Fragility Δ {deltaFinal >= 0 ? "+" : ""}
                  {fmt(deltaFinal)} · MC mean Δ {deltaMcMean >= 0 ? "+" : ""}
                  {fmt(deltaMcMean)}
                </span>
              </div>
              <div style={{ color: nx.text }}>{interpretation}</div>
              <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                Timeline impact: {deltaFinal < 0
                  ? `${labels.bestScenario} is expected to stabilize fragility over the next ${Number(result?.timeline_horizon ?? 0)} steps.`
                  : `${labels.bestScenario} may not reduce fragility over the next ${Number(result?.timeline_horizon ?? 0)} steps.`}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
                {ranking.map((row, idx) => {
                  const name = String(row.scenario?.name ?? "Scenario");
                  const isBest = name === bestScenarioName;
                  const isBaseline = baselineScenario ? name === String(baselineScenario?.name ?? "") : false;
                  return (
                    <div
                      key={`${name}-${idx}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: isBest
                          ? "1px solid rgba(59,130,246,0.7)"
                          : "1px solid rgba(148, 163, 184, 0.14)",
                        boxShadow: isBest ? "0 0 0 1px rgba(59,130,246,0.25)" : "none",
                        background: "rgba(15, 23, 42, 0.6)",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ color: "#94a3b8", minWidth: 24 }}>#{idx + 1}</div>
                      <div style={{ color: nx.text, fontWeight: 600, minWidth: 110 }}>{name}</div>
                      {isBaseline ? (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 999,
                            border: "1px solid rgba(148, 163, 184, 0.30)",
                            color: nx.text,
                            background: "rgba(30, 41, 59, 0.7)",
                          }}
                        >
                          BASELINE
                        </span>
                      ) : null}
                      <div style={{ color: "#cbd5e1" }}>Fragility {fmt(row.finalScore)}</div>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 999,
                          border: "1px solid rgba(148, 163, 184, 0.24)",
                          background: "rgba(2, 6, 23, 0.55)",
                          color: levelColor(row.finalLevel),
                        }}
                      >
                        {row.finalLevel}
                      </span>
                      <div style={{ color: "#cbd5e1" }}>MC mean {fmt(row.mcMean)}</div>
                      <div style={{ color: nx.muted }}>P90 {fmt(row.mcP90)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                ...sectionTitleStyle,
              }}
            >
              Timeline View
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {scenarios.map((s: any, idx: number) => {
                const name = String(s?.name ?? "Scenario");
                const isBest = name === bestScenarioName;
                const timeline = Array.isArray(s?.timeline) ? s.timeline : [];
                const finalScore = Number(s?.final_fragility?.score ?? 0);
                const finalLevel = String(s?.final_fragility?.level ?? "-");
                const impacts = mapScenarioDeltaToObjects(
                  scenarioInputs.find((x) => x.name === name)?.delta ?? {}
                );

                return (
                  <div
                    key={idx}
                    style={{
                      border: isBest
                        ? "1px solid rgba(59,130,246,0.7)"
                        : "1px solid rgba(148, 163, 184, 0.14)",
                      boxShadow: isBest ? "0 0 0 1px rgba(59,130,246,0.25)" : "none",
                      borderRadius: 12,
                      padding: 12,
                      background: "rgba(2, 6, 23, 0.45)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      transition: "border-color 120ms ease, box-shadow 120ms ease",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 13, letterSpacing: 0.2 }}>{name}</div>
                      {isBest ? (
                        <div
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 999,
                            border: "1px solid rgba(59,130,246,0.7)",
                            color: "#bfdbfe",
                            background: "rgba(30,64,175,0.20)",
                          }}
                        >
                          BEST
                        </div>
                      ) : null}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ color: "#94a3b8" }}>Final fragility:</span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          border: "1px solid rgba(148, 163, 184, 0.24)",
                          background: "rgba(15, 23, 42, 0.78)",
                          color: "#e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Score {finalScore.toFixed(2)}
                      </span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          border: "1px solid rgba(148, 163, 184, 0.24)",
                          background: "rgba(15, 23, 42, 0.78)",
                          color: "#e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Level {finalLevel}
                      </span>
                    </div>

                    {impacts.length ? (
                      <>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {impacts.map((impact) => (
                            <div
                              key={impact.objectId}
                              style={{
                                padding: "2px 8px",
                                borderRadius: 999,
                                border: `1px solid ${nx.border}`,
                                background: nx.bgPanel,
                                color: "#cbd5e1",
                                fontSize: 11,
                              }}
                              title={impact.reason}
                            >
                              {impact.label}
                            </div>
                          ))}
                        </div>
                        {isBest ? (
                          <div style={{ color: "#93c5fd", fontSize: 11 }}>
                            This scenario primarily affects: {impacts.map((x) => x.label).join(", ")}
                          </div>
                        ) : null}
                      </>
                    ) : null}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 0,
                        overflowX: "auto",
                        paddingBottom: 4,
                        scrollbarWidth: "thin",
                      }}
                    >
                      {timeline.length ? (
                        timeline.map((pt: any, stepIdx: number) => {
                          const stepNo = Number(pt?.step ?? stepIdx);
                          const score = Number(pt?.fragility?.score ?? 0);
                          return (
                            <React.Fragment key={`${name}-step-${stepIdx}`}>
                              <div
                                style={{
                                  minWidth: 56,
                                  padding: "6px 8px",
                                  borderRadius: 999,
                                  border: isBest
                                    ? "1px solid rgba(59,130,246,0.7)"
                                    : "1px solid rgba(148, 163, 184, 0.24)",
                                  boxShadow: isBest ? "0 0 0 1px rgba(59,130,246,0.25)" : "none",
                                  background: "rgba(15, 23, 42, 0.78)",
                                  color: "#e2e8f0",
                                  fontSize: 11,
                                  textAlign: "center",
                                  lineHeight: 1.2,
                                  flex: "0 0 auto",
                                }}
                              >
                                <div style={{ color: "#94a3b8" }}>s{stepNo}</div>
                                <div>{score.toFixed(2)}</div>
                              </div>
                              {stepIdx < timeline.length - 1 ? (
                                <div
                                  style={{
                                    height: 2,
                                    minWidth: 18,
                                    flex: "0 0 18px",
                                    background: isBest
                                      ? "rgba(59,130,246,0.25)"
                                      : "rgba(148,163,184,0.2)",
                                    borderRadius: 999,
                                  }}
                                />
                              ) : null}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            color: "#94a3b8",
                            padding: "6px 8px",
                            borderRadius: 8,
                            border: "1px solid rgba(148,163,184,0.14)",
                            background: "rgba(15, 23, 42, 0.55)",
                          }}
                        >
                          No timeline steps returned.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div
            style={{
              ...sectionTitleStyle,
            }}
          >
            Scenario Editor
          </div>

          <button
            type="button"
            onClick={() => setScenarioEditorOpen((v) => !v)}
            aria-label={scenarioEditorOpen ? "Hide Scenario Editor" : "Show Scenario Editor"}
            title={scenarioEditorOpen ? "Hide Scenario Editor" : "Show Scenario Editor"}
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.28)",
              background: nx.bgPanel,
              color: nx.text,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flex: "0 0 auto",
              fontSize: 12,
              lineHeight: 1,
            }}
          >
            <span
              style={{
                transform: scenarioEditorOpen ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 160ms ease",
                display: "inline-block",
              }}
            >
              +
            </span>
          </button>
        </div>
        {scenarioEditorOpen ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: 8,
              borderRadius: 10,
              border: `1px solid ${nx.border}`,
              background: nx.bgPanelSoft,
            }}
          >
              <div style={{ fontWeight: 600, fontSize: 12, color: "#cbd5e1" }}>
                Scenario Editor (Advanced)
              </div>

              {scenarioInputs.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    value={s.name}
                    onChange={(e) => {
                      const next = [...scenarioInputs];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setScenarioInputs(next);
                    }}
                    style={{
                      width: 140,
                      padding: "4px 6px",
                      borderRadius: 6,
                      border: "1px solid rgba(148,163,184,0.28)",
                      background: "rgba(15,23,42,0.7)",
                      color: "#e2e8f0",
                    }}
                  />

                  {Object.keys(s.delta).map((k) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{k}</span>
                      <input
                        type="number"
                        step="0.01"
                        value={s.delta[k]}
                        onChange={(e) => {
                          const next = [...scenarioInputs];
                          next[idx] = {
                            ...next[idx],
                            delta: {
                              ...next[idx].delta,
                              [k]: Number(e.target.value),
                            },
                          };
                          setScenarioInputs(next);
                        }}
                        style={{
                          width: 70,
                          padding: "3px 5px",
                          borderRadius: 6,
                          border: "1px solid rgba(148,163,184,0.28)",
                          background: "rgba(15,23,42,0.7)",
                          color: "#e2e8f0",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setScenarioInputs([
                    ...scenarioInputs,
                    { name: "New Scenario", delta: { risk: 0 } },
                  ]);
                }}
                style={{
                  ...secondaryButtonStyle,
                  padding: "4px 8px",
                  fontSize: 11,
                }}
              >
                Add Scenario
              </button>
          </div>
        ) : null}
        {!scenarioEditorOpen && hasScenarioInputs ? (
          <div
            id="timeline-scenario-editor-collapsed-hint"
            style={{ marginTop: -4 }}
          />
        ) : null}
        {loading ? <LoadingStateCard text="Running timeline simulation…" /> : null}
        {!episodeId ? (
          <EmptyStateCard text="Send one chat message first so Nexora can create an episode." />
        ) : null}
        {!result && !loading ? (
          <EmptyStateCard text="Timeline impact will appear after you run a disruption prompt." />
        ) : null}
        {error ? <ErrorStateCard text={error} /> : null}
      </div>

      <div style={footerStyle}>
        <button
          type="button"
          onClick={() =>
            void runTimeline({
              steps,
              scenarios: scenarioInputs,
              montecarlo: { n: 150, sigma: 0.08 },
            })
          }
          disabled={loading}
          style={{
            ...primaryButtonStyle,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Running…" : "Run Simulation"}
        </button>
      </div>
    </div>
  );
}
