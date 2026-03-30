"use client";

import React from "react";

import { buildTeamDecisionState } from "../../lib/team/buildTeamDecisionState";
import type { TeamDecisionRole } from "../../lib/team/teamDecisionTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type TeamDecisionPanelProps = {
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenCompare?: (() => void) | null;
  onOpenTimeline?: (() => void) | null;
  onOpenWarRoom?: (() => void) | null;
  onOpenCognitiveStyle?: (() => void) | null;
  onOpenCollaborationIntelligence?: (() => void) | null;
};

export function TeamDecisionPanel(props: TeamDecisionPanelProps) {
  const [focusedRole, setFocusedRole] = React.useState<TeamDecisionRole | null>(null);
  const state = React.useMemo(
    () =>
      buildTeamDecisionState({
        responseData: props.responseData ?? null,
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        decisionResult: props.decisionResult ?? null,
        memoryEntries: props.memoryEntries ?? [],
      }),
    [props.responseData, props.canonicalRecommendation, props.decisionResult, props.memoryEntries]
  );
  const visiblePerspectives = focusedRole
    ? state.role_perspectives.filter((perspective) => perspective.role === focusedRole)
    : state.role_perspectives;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Team Decision</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Review how different decision roles align around the current recommendation.
        </div>
      </div>

      <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Shared Recommendation
        </div>
        <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 800, lineHeight: 1.3 }}>
          {state.shared_recommendation}
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{state.shared_summary}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge label={`Alignment ${state.alignment.alignment_level}`} tone={alignmentTone(state.alignment.alignment_level)} />
          <Badge label={state.escalation_needed ? "Escalation likely" : "Escalation not required"} tone={state.escalation_needed ? "#fca5a5" : "#86efac"} />
        </div>
      </div>

      <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Role Perspectives
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {state.role_perspectives.map((perspective) => (
            <button
              key={perspective.role}
              type="button"
              onClick={() => setFocusedRole((current) => (current === perspective.role ? null : perspective.role))}
              style={{
                ...secondaryButtonStyle,
                borderColor: focusedRole === perspective.role ? "rgba(96,165,250,0.45)" : secondaryButtonStyle.borderColor,
                background: focusedRole === perspective.role ? "rgba(59,130,246,0.18)" : secondaryButtonStyle.background,
                color: focusedRole === perspective.role ? "#dbeafe" : secondaryButtonStyle.color,
              }}
            >
              {titleCase(perspective.role)}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {visiblePerspectives.map((perspective) => (
            <div key={perspective.role} style={{ ...softCardStyle, padding: 12, gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {titleCase(perspective.role)}
                </div>
                <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800, lineHeight: 1.35 }}>{perspective.headline}</div>
                <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>
                  {perspective.confidence_note ?? "Confidence context is available but secondary for this role."}
                </div>
              </div>
              <MiniList label="Priorities" items={perspective.priorities} empty="No role priorities are visible yet." />
              <MiniList label="Concerns" items={perspective.concerns} empty="No concerns are visible yet." />
              <div style={{ ...softCardStyle, padding: 10, gap: 4, background: "rgba(15,23,42,0.45)" }}>
                <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Suggested next action
                </div>
                <div style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>{perspective.suggested_next_action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panelSurfaceStyle, padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <AlignmentBlock
          label="Agreement"
          title={`Alignment is ${state.alignment.alignment_level}`}
          items={state.alignment.agreement_points}
          empty="No clear agreement has formed yet."
        />
        <AlignmentBlock
          label="Disagreement"
          title="Where the team still diverges"
          items={state.alignment.disagreement_points}
          empty="No material disagreement is visible yet."
        />
      </div>

      <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Unresolved Questions
        </div>
        <MiniList label={null} items={state.alignment.unresolved_questions} empty="No unresolved question is visible yet." />
      </div>

      <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Team Next Move
        </div>
        <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800, lineHeight: 1.35 }}>{state.team_next_move}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
          The team surface stays anchored to one recommendation while showing where different roles want more caution, evidence, or execution focus.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {props.onOpenCompare ? (
            <button type="button" onClick={props.onOpenCompare} style={secondaryButtonStyle}>
              Open Compare
            </button>
          ) : null}
          {props.onOpenTimeline ? (
            <button type="button" onClick={props.onOpenTimeline} style={secondaryButtonStyle}>
              Open Timeline
            </button>
          ) : null}
          {props.onOpenWarRoom ? (
            <button type="button" onClick={props.onOpenWarRoom} style={secondaryButtonStyle}>
              Open War Room
            </button>
          ) : null}
          {props.onOpenCognitiveStyle ? (
            <button type="button" onClick={props.onOpenCognitiveStyle} style={secondaryButtonStyle}>
              Open Decision Lens
            </button>
          ) : null}
          {props.onOpenCollaborationIntelligence ? (
            <button type="button" onClick={props.onOpenCollaborationIntelligence} style={secondaryButtonStyle}>
              Open Collaboration
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MiniList(props: { label: string | null; items: string[]; empty: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {props.label ? (
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {props.label}
        </div>
      ) : null}
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

function AlignmentBlock(props: { label: string; title: string; items: string[]; empty: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{props.title}</div>
      <MiniList label={null} items={props.items} empty={props.empty} />
    </div>
  );
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (match) => match.toUpperCase());
}

function alignmentTone(value: "high" | "moderate" | "low") {
  if (value === "high") return "#86efac";
  if (value === "low") return "#fca5a5";
  return "#fcd34d";
}

function Badge(props: { label: string; tone: string }) {
  return (
    <div
      style={{
        padding: "5px 8px",
        borderRadius: 999,
        border: `1px solid ${props.tone}33`,
        background: `${props.tone}18`,
        color: props.tone,
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
      }}
    >
      {props.label}
    </div>
  );
}
