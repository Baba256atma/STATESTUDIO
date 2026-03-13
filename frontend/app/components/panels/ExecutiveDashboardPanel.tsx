import React from "react";

type ExecutiveDashboardPanelProps = {
  sceneJson?: any;
  responseData?: any;
};

function fmt(x: number) {
  return Number.isFinite(x) ? x.toFixed(2) : "-";
}

function levelColor(level: string) {
  if (level === "low") return "#86efac";
  if (level === "medium") return "#fde68a";
  if (level === "high") return "#fca5a5";
  if (level === "critical") return "#f87171";
  return "#cbd5e1";
}

function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function objectName(id: string) {
  return String(id || "")
    .replace(/^obj_/, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function ExecutiveDashboardPanel({ sceneJson, responseData }: ExecutiveDashboardPanelProps) {
  const executiveSurface =
    sceneJson?.executive_summary_surface ??
    responseData?.executive_summary_surface ??
    responseData?.decision_cockpit?.executive ??
    null;

  const fragility =
    sceneJson?.scene?.fragility ??
    responseData?.fragility ??
    null;

  const strategicAdvice =
    sceneJson?.strategic_advice ??
    responseData?.strategic_advice ??
    null;

  const opponentModel =
    sceneJson?.opponent_model ??
    responseData?.opponent_model ??
    null;

  const strategicPatterns =
    sceneJson?.strategic_patterns ??
    responseData?.strategic_patterns ??
    null;

  const riskPropagation =
    sceneJson?.risk_propagation ??
    responseData?.risk_propagation ??
    null;

  const objectSelection =
    sceneJson?.object_selection ??
    responseData?.object_selection ??
    null;

  const memoryV2 =
    sceneJson?.memory_v2 ??
    responseData?.memory_v2 ??
    null;

  const kpi =
    sceneJson?.scene?.kpi ??
    responseData?.scene_json?.scene?.kpi ??
    null;

  const sceneMeta =
    sceneJson?.scene?.scene ??
    responseData?.scene_json?.scene?.scene ??
    null;

  const timelineImpact =
    sceneJson?.timeline_impact ??
    responseData?.timeline_impact ??
    null;

  const conflicts: any[] =
    safeArray(sceneJson?.conflicts).length > 0
      ? safeArray(sceneJson?.conflicts)
      : safeArray(responseData?.conflicts);

  const fragilityScore = Number(fragility?.score ?? 0);
  const fragilityLevel = String(fragility?.level ?? "-");
  const volatility = Number(sceneMeta?.volatility ?? sceneJson?.state_vector?.volatility ?? 0);
  const driverCount = Object.keys(fragility?.drivers ?? {}).length;

  const topRiskEdge =
    Array.isArray(riskPropagation?.edges) && riskPropagation.edges.length
      ? [...riskPropagation.edges].sort((a, b) => Number(b?.weight ?? 0) - Number(a?.weight ?? 0))[0]
      : null;

  const primaryAdvice = strategicAdvice?.primary_recommendation ?? null;
  const actions = safeArray(strategicAdvice?.recommended_actions);
  const bestResponse = opponentModel?.best_response ?? null;
  const strategicRisk = Number(opponentModel?.strategic_risk ?? 0);
  const topPattern = strategicPatterns?.top_pattern ?? null;
  const topFocusedObjects: any[] = safeArray(objectSelection?.rankings).slice(0, 3);
  const similarPatterns: any[] = safeArray(memoryV2?.similar_patterns);
  const objectBias: any[] = safeArray(memoryV2?.object_bias);
  const repeatedConflicts: any[] = safeArray(memoryV2?.repeated_conflicts);
  const topMove =
    Array.isArray(opponentModel?.possible_moves) && opponentModel.possible_moves.length
      ? opponentModel.possible_moves[0]
      : null;

  const strongestConflict: any =
    conflicts.length > 0
      ? [...conflicts].sort((a: any, b: any) => Number(b?.score ?? 0) - Number(a?.score ?? 0))[0]
      : null;

  const dominantSource = String(
    topRiskEdge?.from ??
      topFocusedObjects?.[0]?.id ??
      strongestConflict?.a ??
      "No dominant source"
  );

  const riskPath = topRiskEdge
    ? `${String(topRiskEdge?.from ?? "-")} → ${String(topRiskEdge?.to ?? "-")}`
    : strongestConflict
    ? `${String(strongestConflict?.a ?? "-")} ↔ ${String(strongestConflict?.b ?? "-")}`
    : "No active cascade";

  const bestResponseText = String(
    primaryAdvice?.action ??
      bestResponse?.label ??
      "No best response available"
  );

  const expectedDirection = String(
    timelineImpact?.follow_up ??
    strategicAdvice?.summary ??
      strategicPatterns?.summary ??
      (Number(kpi?.risk ?? 0.5) > 0.55 ? "Risk containment should be prioritized." : "Stabilization path available")
  );

  const confidence = Number(strategicAdvice?.confidence ?? 0);
  const heroSummary = String(
    executiveSurface?.summary ??
      strategicAdvice?.summary ??
      strategicPatterns?.summary ??
      "Strategic summary will appear after analysis runs."
  );

  const happenedText = String(
    executiveSurface?.happened ??
      riskPropagation?.summary ??
      "A system event has created pressure across connected objects."
  );
  const whyItMattersText = String(
    executiveSurface?.why_it_matters ??
      timelineImpact?.follow_up ??
      "The disruption is becoming a broader system issue rather than an isolated event."
  );
  const whatToDoText = String(
    executiveSurface?.what_to_do ??
      primaryAdvice?.action ??
      "Stabilize the exposed node and protect critical commitments."
  );

  const memoryInsight = similarPatterns[0]
    ? String(similarPatterns[0]?.description ?? similarPatterns[0]?.label ?? "Similar pattern detected.")
    : objectBias[0]
    ? `Bias: ${String(objectBias[0]?.id ?? "-")} (${fmt(Number(objectBias[0]?.boost ?? 0))})`
    : repeatedConflicts[0]
    ? `Repeated conflict: ${safeArray(repeatedConflicts[0]?.pair).join(" ↔ ")}`
    : "";

  const hasMeaningfulData =
    Boolean(fragility) ||
    Boolean(primaryAdvice) ||
    Boolean(topRiskEdge) ||
    Boolean(strongestConflict) ||
    Boolean(topPattern) ||
    topFocusedObjects.length > 0 ||
    Boolean(opponentModel) ||
    Boolean(memoryInsight);

  const shellStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minHeight: 0,
    overflow: "auto",
  };

  const cardStyle: React.CSSProperties = {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.78)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const secondaryCardStyle: React.CSSProperties = {
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.12)",
    background: "rgba(2,6,23,0.45)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const sectionTitleStyle: React.CSSProperties = {
    color: "#94a3b8",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: 700,
  };

  const heroMetricStyle: React.CSSProperties = {
    color: "#e2e8f0",
    fontSize: 20,
    fontWeight: 800,
    lineHeight: 1.2,
  };

  const primaryTextStyle: React.CSSProperties = {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: 700,
  };

  const bodyTextStyle: React.CSSProperties = {
    color: "#cbd5e1",
    fontSize: 12,
  };

  const mutedTextStyle: React.CSSProperties = {
    color: "#64748b",
    fontSize: 11,
  };

  if (!hasMeaningfulData) {
    return (
      <div style={shellStyle}>
        <div style={cardStyle}>
          <div style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 800 }}>Executive Dashboard</div>
          <div style={bodyTextStyle}>
            Run a scenario or send a chat message to generate executive insights.
          </div>
          <div style={mutedTextStyle}>
            Quick path: 1) Send a chat command 2) Open Timeline 3) Compare scenarios
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <div style={{ ...cardStyle, border: "1px solid rgba(96,165,250,0.35)", background: "rgba(15,23,42,0.82)" }}>
        <div style={{ color: "#e2e8f0", fontSize: 19, fontWeight: 800 }}>Executive Dashboard</div>
        <div style={{ color: "#94a3b8", fontSize: 12 }}>Manager summary of current system state</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
          <span style={{ ...secondaryCardStyle, padding: "4px 8px", borderRadius: 999, gap: 2 }}>
            Fragility: <b style={{ color: "#e2e8f0" }}>{fmt(fragilityScore)}</b>
          </span>
          <span style={{ ...secondaryCardStyle, padding: "4px 8px", borderRadius: 999, gap: 2 }}>
            Level: <b style={{ color: levelColor(fragilityLevel) }}>{fragilityLevel}</b>
          </span>
          {Number.isFinite(confidence) ? (
            <span style={{ ...secondaryCardStyle, padding: "4px 8px", borderRadius: 999, gap: 2 }}>
              Confidence: <b style={{ color: "#93c5fd" }}>{fmt(confidence)}</b>
            </span>
          ) : null}
        </div>
        <div style={sectionTitleStyle}>Primary Recommendation</div>
        <div style={heroMetricStyle}>
          {String(primaryAdvice?.action ?? "No strategic recommendation available yet.")}
        </div>
        <div style={bodyTextStyle}>Summary: {heroSummary}</div>
      </div>

      <div style={sectionTitleStyle}>Executive Brief</div>
      <div style={cardStyle}>
        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>What Happened</div>
          <div style={primaryTextStyle}>{happenedText}</div>
        </div>
        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>Why It Matters</div>
          <div style={bodyTextStyle}>{whyItMattersText}</div>
        </div>
        <div style={{ ...secondaryCardStyle, border: "1px solid rgba(96,165,250,0.24)" }}>
          <div style={sectionTitleStyle}>What To Do Next</div>
          <div style={primaryTextStyle}>{whatToDoText}</div>
        </div>
      </div>

      <div style={sectionTitleStyle}>System Health</div>
      <div style={cardStyle}>
        <div style={heroMetricStyle}>{fmt(fragilityScore)}</div>
        <div style={bodyTextStyle}>
          Level:{" "}
          <span
            style={{
              color: levelColor(fragilityLevel),
              border: "1px solid rgba(148,163,184,0.24)",
              borderRadius: 999,
              padding: "2px 8px",
              fontWeight: 700,
              background: "rgba(2,6,23,0.45)",
            }}
          >
            {fragilityLevel}
          </span>
        </div>
        <div style={mutedTextStyle}>Volatility: {fmt(volatility)}</div>
        <div style={mutedTextStyle}>Risk drivers: {driverCount}</div>
      </div>

      <div style={sectionTitleStyle}>Top Risk</div>
      <div style={cardStyle}>
        {topRiskEdge ? (
          <>
            <div style={primaryTextStyle}>
              {String(topRiskEdge.from ?? "-")} → {String(topRiskEdge.to ?? "-")}
            </div>
            <div style={{ color: "#93c5fd", fontSize: 12 }}>Weight: {fmt(Number(topRiskEdge.weight ?? 0))}</div>
            <div style={bodyTextStyle}>
              {String(riskPropagation?.summary ?? "Risk propagation is active across connected objects.")}
            </div>
          </>
        ) : strongestConflict ? (
          <>
            <div style={primaryTextStyle}>
              {String(strongestConflict?.a ?? "-")} ↔ {String(strongestConflict?.b ?? "-")}
            </div>
            <div style={{ color: "#93c5fd", fontSize: 12 }}>
              Conflict score: {fmt(Number(strongestConflict?.score ?? 0))}
            </div>
            <div style={bodyTextStyle}>
              {String(strongestConflict?.reason ?? "Conflict pressure is currently the main hotspot.")}
            </div>
          </>
        ) : (
          <div style={bodyTextStyle}>No major risk cascade detected yet.</div>
        )}
      </div>

      <div style={sectionTitleStyle}>Best Action</div>
      <div style={{ ...cardStyle, border: "1px solid rgba(96,165,250,0.28)", background: "rgba(15,23,42,0.82)" }}>
        {primaryAdvice ? (
          <>
            <div style={heroMetricStyle}>{String(primaryAdvice.action ?? "-")}</div>
            <div style={bodyTextStyle}>{String(primaryAdvice.impact ?? "")}</div>
            <div style={{ color: "#93c5fd", fontSize: 12 }}>
              Confidence: {fmt(Number(strategicAdvice?.confidence ?? 0))}
            </div>
            {Array.isArray(primaryAdvice.targets) && primaryAdvice.targets.length ? (
              <div style={mutedTextStyle}>Targets: {primaryAdvice.targets.join(", ")}</div>
            ) : null}
            {strategicAdvice?.why ? <div style={bodyTextStyle}>{String(strategicAdvice.why)}</div> : null}
            {actions.slice(0, 2).map((a: any, i: number) => (
              <div key={`${a?.type ?? "action"}-${i}`} style={secondaryCardStyle}>
                <div style={primaryTextStyle}>{String(a?.action ?? "Recommended action")}</div>
                <div style={bodyTextStyle}>{String(a?.impact ?? "")}</div>
                <div style={mutedTextStyle}>
                  Type: {String(a?.type ?? "-")} · Priority: {String(a?.priority ?? "-")}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={bodyTextStyle}>No strategic recommendation available yet.</div>
        )}
      </div>

      <div style={sectionTitleStyle}>Decision Flow</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>Source</div>
          <div style={primaryTextStyle}>{objectName(dominantSource)}</div>
        </div>
        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>Risk Path</div>
          <div style={primaryTextStyle}>{riskPath}</div>
        </div>
        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>Best Response</div>
          <div style={primaryTextStyle}>{bestResponseText}</div>
        </div>
        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>Expected Direction</div>
          <div style={bodyTextStyle}>{expectedDirection}</div>
          {timelineImpact?.near_term ? (
            <div style={mutedTextStyle}>Near-term: {String(timelineImpact.near_term)}</div>
          ) : null}
        </div>
      </div>

      <div style={sectionTitleStyle}>Strategic Intelligence</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>Strategic Pattern</div>
          {topPattern ? (
            <>
              <div style={primaryTextStyle}>{String(topPattern?.label ?? "-")}</div>
              <div style={bodyTextStyle}>
                Frequency: {String(topPattern?.frequency ?? 0)} · Avg fragility: {fmt(Number(topPattern?.avg_fragility ?? 0))}
              </div>
              <div style={mutedTextStyle}>{String(topPattern?.why ?? "")}</div>
            </>
          ) : (
            <div style={mutedTextStyle}>No recurring strategic pattern detected.</div>
          )}
        </div>

        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>Object Focus</div>
          {topFocusedObjects.length ? (
            topFocusedObjects.map((o: any, i: number) => (
              <div key={`${o?.id ?? "obj"}-${i}`} style={bodyTextStyle}>
                {i + 1}. {objectName(String(o?.id ?? "-"))} ({fmt(Number(o?.score ?? 0))})
              </div>
            ))
          ) : (
            <div style={mutedTextStyle}>No object focus ranking available.</div>
          )}
        </div>

        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>Memory Insight</div>
          {memoryInsight ? (
            <div style={bodyTextStyle}>{memoryInsight}</div>
          ) : (
            <div style={mutedTextStyle}>No memory insight available yet.</div>
          )}
        </div>

        <div style={secondaryCardStyle}>
          <div style={sectionTitleStyle}>Opponent Pressure</div>
          {opponentModel ? (
            <>
              <div style={primaryTextStyle}>{String(bestResponse?.label ?? "No best response available")}</div>
              <div style={{ color: "#93c5fd", fontSize: 12 }}>
                Strategic risk: {fmt(strategicRisk)}
              </div>
              <div style={mutedTextStyle}>
                {String(topMove?.label ?? "No dominant external move")}
              </div>
            </>
          ) : (
            <div style={mutedTextStyle}>No external pressure model available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
