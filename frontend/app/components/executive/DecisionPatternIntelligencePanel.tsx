"use client";

import React from "react";

import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";
import { buildDecisionPatternIntelligence } from "../../lib/decision/patterns/buildDecisionPatternIntelligence";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";

type DecisionPatternIntelligencePanelProps = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenMemory?: (() => void) | null;
  onOpenCompare?: (() => void) | null;
  onOpenConfidenceCalibration?: (() => void) | null;
};

export function DecisionPatternIntelligencePanel(props: DecisionPatternIntelligencePanelProps) {
  const intelligence = buildDecisionPatternIntelligence({
    memoryEntries: props.memoryEntries ?? [],
    canonicalRecommendation: props.canonicalRecommendation ?? null,
  });
  const relatedEntries = (props.memoryEntries ?? []).filter((entry) =>
    intelligence.related_entry_ids?.includes(entry.id)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 800 }}>Decision Pattern Intelligence</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Learn from recurring decisions, trade-offs, and outcomes.
        </div>
        <div style={{ color: "#cbd5f5", fontSize: 11, lineHeight: 1.45 }}>
          Based on {intelligence.coverage_count} prior decision {intelligence.coverage_count === 1 ? "record" : "records"}.
          {intelligence.coverage_count < 3 ? " Pattern confidence is still limited." : " Pattern evidence is now strong enough to guide the next move."}
        </div>
      </div>

      <SectionCard
        label="Coverage"
        title={intelligence.coverage_count ? "What Nexora is learning" : "No strong decision patterns yet"}
        summary={intelligence.explanation}
      >
        {intelligence.current_pattern_note ? (
          <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Current recommendation
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{intelligence.current_pattern_note}</div>
          </div>
        ) : (
          <EmptyHint message="Nexora needs more similar decisions before it can connect the current recommendation to a historical pattern." />
        )}
      </SectionCard>

      <SectionCard
        label="Patterns That Tend To Work"
        title="Repeated strengths"
        summary="These are the recurring decision styles that seem to hold up best."
      >
        <PatternList
          items={intelligence.top_success_patterns}
          emptyMessage="No strong success pattern yet. More replay and outcome evidence is needed."
          tone={nx.success}
        />
      </SectionCard>

      <SectionCard
        label="Patterns That Tend To Underperform"
        title="Repeated weak spots"
        summary="These patterns deserve extra scrutiny before you trust a similar move again."
      >
        <PatternList
          items={intelligence.top_failure_patterns}
          emptyMessage="No recurring underperformance pattern is visible yet."
          tone={nx.risk}
        />
      </SectionCard>

      <SectionCard
        label="Repeated Trade-offs And Uncertainties"
        title="Structural tension"
        summary="Recurring trade-offs and unknowns show where decisions keep getting harder."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MiniGroup
            title="Repeated trade-offs"
            items={intelligence.repeated_tradeoffs}
            emptyMessage="No repeated trade-off pattern has surfaced yet."
          />
          <MiniGroup
            title="Repeated uncertainties"
            items={intelligence.repeated_uncertainties}
            emptyMessage="No recurring uncertainty signal has surfaced yet."
          />
        </div>
      </SectionCard>

      <SectionCard
        label="Recommendation Hint"
        title="What Nexora should do differently next time"
        summary="Use recurring pattern evidence to shape the next recommendation more responsibly."
      >
        {intelligence.recommendation_hint ? (
          <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
            <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{intelligence.recommendation_hint}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {props.onOpenCompare ? (
                <button type="button" onClick={props.onOpenCompare} style={secondaryButtonStyle}>
                  Open Compare
                </button>
              ) : null}
              {props.onOpenConfidenceCalibration ? (
                <button type="button" onClick={props.onOpenConfidenceCalibration} style={secondaryButtonStyle}>
                  Open Calibration
                </button>
              ) : null}
              {props.onOpenMemory ? (
                <button type="button" onClick={props.onOpenMemory} style={secondaryButtonStyle}>
                  Open Decision Memory
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <EmptyHint message="Pattern guidance will appear once Nexora has enough repeated decision evidence to compare." />
        )}
      </SectionCard>

      <SectionCard
        label="Related History"
        title="Recent records supporting this pattern"
        summary="Ground the pattern in a few recent decision examples."
      >
        {relatedEntries.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            {relatedEntries.map((entry) => (
              <div key={entry.id} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
                <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{entry.title}</div>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                  {entry.recommendation_summary ?? entry.situation_summary ?? "Recent decision record"}
                </div>
                {entry.recommendation_confidence?.level ? (
                  <div style={{ color: "#cbd5f5", fontSize: 11 }}>
                    Confidence: {entry.recommendation_confidence.level}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyHint message="No closely related prior decisions are visible yet." />
        )}
      </SectionCard>
    </div>
  );
}

function SectionCard(props: {
  label: string;
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {props.label}
        </div>
        <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800 }}>{props.title}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.summary}</div>
      </div>
      {props.children}
    </div>
  );
}

function PatternList(props: { items: string[]; emptyMessage: string; tone: string }) {
  if (!props.items.length) {
    return <EmptyHint message={props.emptyMessage} />;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
      {props.items.slice(0, 3).map((item) => (
        <div key={item} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
          <div style={{ color: props.tone, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Pattern signal
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

function MiniGroup(props: { title: string; items: string[]; emptyMessage: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.title}
      </div>
      {props.items.length ? (
        props.items.slice(0, 3).map((item) => (
          <div key={item} style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
            {item}
          </div>
        ))
      ) : (
        <div style={{ color: nx.lowMuted, fontSize: 12, lineHeight: 1.45 }}>{props.emptyMessage}</div>
      )}
    </div>
  );
}

function EmptyHint(props: { message: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      <div style={{ color: nx.lowMuted, fontSize: 12, lineHeight: 1.45 }}>{props.message}</div>
    </div>
  );
}
