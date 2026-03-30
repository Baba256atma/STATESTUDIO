"use client";

import React from "react";

import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { buildStrategicLearningState } from "../../lib/decision/learning/buildStrategicLearningState";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type StrategicLearningPanelProps = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenMemory?: (() => void) | null;
  onOpenPatternIntelligence?: (() => void) | null;
  onOpenDecisionLifecycle?: (() => void) | null;
};

export function StrategicLearningPanel(props: StrategicLearningPanelProps) {
  const learning = buildStrategicLearningState({
    memoryEntries: props.memoryEntries ?? [],
    canonicalRecommendation: props.canonicalRecommendation ?? null,
  });
  const relatedEntries = (props.memoryEntries ?? []).slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Strategic Learning</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Learn how Nexora&apos;s decision quality evolves across memory, replay, and calibrated outcomes.
        </div>
        <div style={{ color: "#cbd5f5", fontSize: 11, lineHeight: 1.45 }}>
          Based on {learning.coverage_count} decision {learning.coverage_count === 1 ? "record" : "records"}.
          Replay-backed evidence: {learning.memory_evolution.replay_backed_decisions}. Calibration coverage:{" "}
          {learning.memory_evolution.calibrated_decisions >= Math.max(2, Math.floor(learning.coverage_count / 3))
            ? "moderate"
            : "limited"}
          .
        </div>
      </div>

      <Section label="Coverage" title="What long-term learning looks like" summary={learning.explanation}>
        {learning.current_recommendation_note ? (
          <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Current recommendation
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{learning.current_recommendation_note}</div>
          </div>
        ) : (
          <EmptyState message="Current long-term learning is still too limited to confidently connect back to the active recommendation." />
        )}
      </Section>

      <Section label="Learning Signals" title="What Nexora is learning across decisions" summary="These are the strongest recurring long-term signals visible right now.">
        {learning.learning_signals.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {learning.learning_signals.slice(0, 4).map((signal) => (
              <div key={signal.id} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{signal.label}</div>
                  <div style={{ color: "#93c5fd", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {signal.strength}
                  </div>
                </div>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{signal.summary}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No strong cross-decision signal is visible yet." />
        )}
      </Section>

      <Section label="Memory Evolution" title="How Nexora's memory is maturing" summary={learning.memory_evolution.summary}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
          <StatCard label="Decisions" value={String(learning.memory_evolution.total_decisions)} />
          <StatCard label="Calibrated" value={String(learning.memory_evolution.calibrated_decisions)} />
          <StatCard label="Replay-backed" value={String(learning.memory_evolution.replay_backed_decisions)} />
          <StatCard label="Trend" value={learning.memory_evolution.confidence_trend.replace(/\b\w/g, (m) => m.toUpperCase())} />
        </div>
      </Section>

      <Section label="Domain Drift" title="Where operating conditions may be changing" summary={learning.domain_drift.summary}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Affected domains
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
              {learning.domain_drift.affected_domains.length
                ? learning.domain_drift.affected_domains.join(", ")
                : "No strong domain shift is visible yet."}
            </div>
          </div>
          <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
            <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Implications
            </div>
            {learning.domain_drift.implications.map((item) => (
              <div key={item} style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section label="Strategic Guidance" title="What this means for future recommendations" summary="Turn long-term learning into better future decision quality.">
        {learning.strategic_guidance ? (
          <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
            <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{learning.strategic_guidance}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {props.onOpenDecisionLifecycle ? (
                <button type="button" onClick={props.onOpenDecisionLifecycle} style={secondaryButtonStyle}>
                  Open Lifecycle
                </button>
              ) : null}
              {props.onOpenPatternIntelligence ? (
                <button type="button" onClick={props.onOpenPatternIntelligence} style={secondaryButtonStyle}>
                  Open Pattern Intelligence
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
          <EmptyState message="Strategic guidance will strengthen as Nexora accumulates more replay-backed and calibrated decisions." />
        )}
      </Section>

      <Section label="Related History" title="Recent records supporting this learning" summary="Ground long-term learning in traceable decision history.">
        {relatedEntries.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            {relatedEntries.map((entry) => (
              <div key={entry.id} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
                <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{entry.title}</div>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                  {entry.feedback_summary ?? entry.recommendation_summary ?? entry.situation_summary ?? "Decision record"}
                </div>
                {entry.calibration_result?.calibration_label ? (
                  <div style={{ color: "#93c5fd", fontSize: 11 }}>
                    {entry.calibration_result.calibration_label.replace(/_/g, " ")}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No supporting decision history is visible yet." />
        )}
      </Section>
    </div>
  );
}

function Section(props: { label: string; title: string; summary: string; children: React.ReactNode }) {
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

function StatCard(props: { label: string; value: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 10, gap: 4 }}>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 12, fontWeight: 800 }}>{props.value}</div>
    </div>
  );
}

function EmptyState(props: { message: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      <div style={{ color: nx.lowMuted, fontSize: 12, lineHeight: 1.45 }}>{props.message}</div>
    </div>
  );
}
