"use client";

import React from "react";

import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import {
  buildDecisionTrustTimelineModel,
  type DecisionTrustTimelineItem,
} from "../../lib/decision/trust/buildDecisionTrustTimelineModel";
import { nx, panelSurfaceStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionTrustTimelineProps = {
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
  memoryEntry?: DecisionMemoryEntry | null;
};

function confidenceTone(value: number | null | undefined) {
  if (typeof value !== "number") return nx.lowMuted;
  if (value > 0.75) return nx.success;
  if (value > 0.45) return nx.warning;
  return nx.risk;
}

function formatConfidence(value: number | null | undefined) {
  if (typeof value !== "number") return "Confidence pending";
  if (value > 0.75) return `High confidence ${Math.round(value * 100)}%`;
  if (value > 0.45) return `Medium confidence ${Math.round(value * 100)}%`;
  return `Low confidence ${Math.round(value * 100)}%`;
}

function formatTimestamp(value: string | null | undefined) {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(parsed));
}

export function DecisionTrustTimeline(props: DecisionTrustTimelineProps) {
  const model = React.useMemo(
    () =>
      buildDecisionTrustTimelineModel({
        responseData: props.responseData ?? null,
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        decisionResult: props.decisionResult ?? null,
        memoryEntry: props.memoryEntry ?? null,
      }),
    [props.responseData, props.canonicalRecommendation, props.decisionResult, props.memoryEntry]
  );

  return (
    <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800 }}>Trust Timeline</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          {model.summary}
        </div>
      </div>

      {model.items.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {model.items.map((item, index) => (
            <TimelineItem key={item.id} item={item} showConnector={index < model.items.length - 1} />
          ))}
        </div>
      ) : (
        <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
          <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Audit Trail
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
            No trust history yet. Run an analysis or simulation to build the decision trail.
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineItem(props: { item: DecisionTrustTimelineItem; showConnector: boolean }) {
  const timestamp = formatTimestamp(props.item.timestamp);
  const confidenceLabel = formatConfidence(props.item.confidence);
  const confidenceColor = confidenceTone(props.item.confidence);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "18px minmax(0, 1fr)", columnGap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 10,
            height: 10,
            marginTop: 5,
            borderRadius: "999px",
            background: "linear-gradient(180deg, rgba(96,165,250,0.95), rgba(59,130,246,0.52))",
            boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
          }}
        />
        {props.showConnector ? (
          <div
            style={{
              width: 1,
              flex: 1,
              minHeight: 28,
              marginTop: 6,
              background: "linear-gradient(180deg, rgba(96,165,250,0.28), rgba(148,163,184,0.12))",
            }}
          />
        ) : null}
      </div>

      <div style={{ paddingBottom: props.showConnector ? 14 : 0 }}>
        <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{props.item.title}</div>
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{props.item.explanation}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {props.item.source}
              </div>
              {timestamp ? <div style={{ color: nx.lowMuted, fontSize: 11 }}>{timestamp}</div> : null}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                color: confidenceColor,
                fontSize: 11,
                fontWeight: 700,
                border: `1px solid ${confidenceColor === nx.lowMuted ? nx.border : confidenceColor}`,
                borderRadius: 999,
                padding: "4px 8px",
                background: "rgba(2,6,23,0.42)",
              }}
            >
              {confidenceLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
