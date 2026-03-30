"use client";

import React from "react";

import { buildCognitiveStyleState } from "../../lib/cognitive/buildCognitiveStyleState";
import type { CognitiveStyle } from "../../lib/cognitive/cognitiveStyleTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type CognitiveStylePanelProps = {
  activeMode?: string | null;
  rightPanelView?: string | null;
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenCompare?: (() => void) | null;
  onOpenTimeline?: (() => void) | null;
  onOpenMemory?: (() => void) | null;
};

export function CognitiveStylePanel(props: CognitiveStylePanelProps) {
  const [selectedStyle, setSelectedStyle] = React.useState<CognitiveStyle | null>(null);
  const state = React.useMemo(
    () =>
      buildCognitiveStyleState({
        activeStyle: selectedStyle,
        activeMode: props.activeMode ?? null,
        rightPanelView: props.rightPanelView ?? null,
        responseData: props.responseData ?? null,
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        decisionResult: props.decisionResult ?? null,
        memoryEntries: props.memoryEntries ?? [],
      }),
    [selectedStyle, props.activeMode, props.rightPanelView, props.responseData, props.canonicalRecommendation, props.decisionResult, props.memoryEntries]
  );
  const view = state.view;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Decision Lens</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          View the same decision through an executive, analyst, operator, or investor lens.
        </div>
      </div>

      <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Style Switcher
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {state.available_styles.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setSelectedStyle(style)}
              style={{
                ...secondaryButtonStyle,
                borderColor: state.active_style === style ? "rgba(96,165,250,0.45)" : secondaryButtonStyle.borderColor,
                background: state.active_style === style ? "rgba(59,130,246,0.18)" : secondaryButtonStyle.background,
                color: state.active_style === style ? "#dbeafe" : secondaryButtonStyle.color,
              }}
            >
              {style.replace(/\b\w/g, (m) => m.toUpperCase())}
            </button>
          ))}
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
          {state.selected_reason ?? "Nexora is using the current style lens."}
        </div>
      </div>

      <Section label="Headline" title={view.headline} summary={view.summary}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MiniCard label="Decision framing" text={view.decision_framing} />
          <MiniCard label="Confidence framing" text={view.confidence_framing ?? "Confidence is available but not emphasized in this lens."} />
        </div>
      </Section>

      <Section label="Primary Focus" title="What matters most in this lens" summary="The same decision truth is being reordered for the active role and mindset.">
        <TextList items={view.primary_focus} empty="No primary focus is available yet." />
      </Section>

      <Section label="Risks To Watch" title="What this lens wants surfaced" summary={view.tradeoff_framing ?? "Trade-offs remain visible in this lens."}>
        <TextList items={view.risks_to_watch} empty="No key risk is visible yet." />
      </Section>

      <Section label="Supporting Evidence" title="What supports the view" summary="Evidence remains consistent across styles, even when emphasis changes.">
        <TextList items={view.supporting_evidence} empty="No supporting evidence is available yet." />
      </Section>

      <Section label="Next Actions" title="What to do next from this lens" summary="These actions are reframed for the active role, not changed at the underlying decision level.">
        <TextList items={view.next_actions} empty="No next action is available yet." />
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
          {props.onOpenMemory ? (
            <button type="button" onClick={props.onOpenMemory} style={secondaryButtonStyle}>
              Open Decision Memory
            </button>
          ) : null}
        </div>
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

function MiniCard(props: { label: string; text: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        {props.label}
      </div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.text}</div>
    </div>
  );
}

function TextList(props: { items: string[]; empty: string }) {
  return props.items.length ? (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
      {props.items.map((item) => (
        <div key={item} style={{ ...softCardStyle, padding: 10, gap: 4, color: nx.text, fontSize: 12, lineHeight: 1.45 }}>
          {item}
        </div>
      ))}
    </div>
  ) : (
    <div style={{ ...softCardStyle, padding: 10, gap: 4, color: nx.lowMuted, fontSize: 12, lineHeight: 1.45 }}>
      {props.empty}
    </div>
  );
}
