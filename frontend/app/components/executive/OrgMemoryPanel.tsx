"use client";

import React from "react";

import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { loadOrgScopedDecisionMemoryEntries } from "../../lib/decision/memory/decisionMemoryStore";
import { buildOrgMemoryState } from "../../lib/org-memory/buildOrgMemoryState";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type OrgMemoryPanelProps = {
  workspaceId?: string | null;
  memoryEntries?: DecisionMemoryEntry[];
  canonicalRecommendation?: CanonicalRecommendation | null;
  onOpenMemory?: (() => void) | null;
  onOpenStrategicLearning?: (() => void) | null;
  onOpenTeamDecision?: (() => void) | null;
};

export function OrgMemoryPanel(props: OrgMemoryPanelProps) {
  const orgEntries = React.useMemo(() => {
    const scoped = loadOrgScopedDecisionMemoryEntries(props.workspaceId ?? null);
    const current = props.memoryEntries ?? [];
    return Array.from(new Map([...scoped, ...current].map((entry) => [entry.id, entry])).values());
  }, [props.workspaceId, props.memoryEntries]);
  const orgMemory = React.useMemo(
    () =>
      buildOrgMemoryState({
        memoryEntries: orgEntries,
        canonicalRecommendation: props.canonicalRecommendation ?? null,
      }),
    [orgEntries, props.canonicalRecommendation]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Organization Memory</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Use cross-team and cross-project decision memory to strengthen current guidance.
        </div>
        <div style={{ color: "#cbd5f5", fontSize: 11, lineHeight: 1.45 }}>
          Based on {orgMemory.coverage_count} organization decision {orgMemory.coverage_count === 1 ? "record" : "records"}.{" "}
          Replay-backed outcomes: {orgEntries.filter((entry) => entry.snapshot_ref?.replay_id || entry.observed_outcome_summary).length}.{" "}
          Recurring clusters: {orgMemory.clusters.length}.
        </div>
      </div>

      <Section label="Coverage" title="What the organization has learned so far" summary={orgMemory.explanation}>
        {orgMemory.current_decision_note ? (
          <SignalCard title="Current decision context" body={orgMemory.current_decision_note} />
        ) : (
          <EmptyState message="Current organization memory is still too limited to confidently shape the active recommendation." />
        )}
      </Section>

      <Section label="Top Signals" title="Cross-project patterns that matter now" summary="These are the strongest organization-level signals visible right now.">
        {orgMemory.relevant_signals.length || orgMemory.signals.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {(orgMemory.relevant_signals.length ? orgMemory.relevant_signals : orgMemory.signals).slice(0, 4).map((signal) => (
              <div key={signal.id} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{signal.label}</div>
                  <div style={{ color: "#93c5fd", fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {signal.strength}
                  </div>
                </div>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{signal.summary}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No strong organization-memory signal is visible yet." />
        )}
      </Section>

      <Section label="What Tends To Work" title="Recurring organizational strengths" summary="Use cross-project wins to strengthen current decision posture.">
        <SplitList
          leftLabel="Successes"
          leftItems={orgMemory.recurring_successes}
          leftEmpty="No repeated cross-project success is visible yet."
          rightLabel="Failures"
          rightItems={orgMemory.recurring_failures}
          rightEmpty="No repeated organizational weak spot is visible yet."
        />
      </Section>

      <Section label="Trade-offs" title="Recurring organizational tensions" summary="These trade-offs and uncertainties keep reappearing across projects.">
        <SplitList
          leftLabel="Trade-offs"
          leftItems={orgMemory.recurring_tradeoffs}
          leftEmpty="No recurring trade-off is visible yet."
          rightLabel="Uncertainties"
          rightItems={orgMemory.recurring_uncertainties}
          rightEmpty="No recurring uncertainty is visible yet."
        />
      </Section>

      <Section label="Related Decisions" title="Cross-project references behind this guidance" summary="Keep organization memory grounded in traceable decision history.">
        {orgMemory.related_refs.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            {orgMemory.related_refs.slice(0, 5).map((ref) => (
              <div key={ref.id} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
                <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{ref.title}</div>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                  {ref.domain ?? ref.project_id ?? "General"} {ref.result_hint ? `· ${ref.result_hint}` : ""}
                </div>
                <div style={{ color: "#93c5fd", fontSize: 11, lineHeight: 1.4 }}>
                  {ref.calibration_hint ?? "Calibration not available"}{ref.replay_backed ? " · Replay-backed" : ""}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No related cross-project reference is visible yet." />
        )}
      </Section>

      <Section label="Org Guidance" title="What organization memory suggests for this decision" summary="Turn organizational memory into practical current guidance.">
        {orgMemory.org_guidance ? (
          <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
            <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800, lineHeight: 1.45 }}>{orgMemory.org_guidance}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {props.onOpenTeamDecision ? (
                <button type="button" onClick={props.onOpenTeamDecision} style={secondaryButtonStyle}>
                  Open Team Decision
                </button>
              ) : null}
              {props.onOpenStrategicLearning ? (
                <button type="button" onClick={props.onOpenStrategicLearning} style={secondaryButtonStyle}>
                  Open Strategic Learning
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
          <EmptyState message="Organization memory is still limited. Nexora needs more cross-project decisions, replay-backed outcomes, and calibrated evidence to strengthen org guidance." />
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

function SignalCard(props: { title: string; body: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{props.title}</div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.body}</div>
    </div>
  );
}

function SplitList(props: {
  leftLabel: string;
  leftItems: string[];
  leftEmpty: string;
  rightLabel: string;
  rightItems: string[];
  rightEmpty: string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <ListCard label={props.leftLabel} items={props.leftItems} empty={props.leftEmpty} />
      <ListCard label={props.rightLabel} items={props.rightItems} empty={props.rightEmpty} />
    </div>
  );
}

function ListCard(props: { label: string; items: string[]; empty: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      {props.items.length ? (
        props.items.map((item) => (
          <div key={item} style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>
            {item}
          </div>
        ))
      ) : (
        <div style={{ color: nx.lowMuted, fontSize: 12, lineHeight: 1.45 }}>{props.empty}</div>
      )}
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
