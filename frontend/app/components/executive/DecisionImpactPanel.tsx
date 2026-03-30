"use client";

import React from "react";

import type { DecisionImpactState } from "../../lib/impact/decisionImpactTypes";
import { nx, cardStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";

type DecisionImpactPanelProps = {
  impact: DecisionImpactState | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
  titleLabel?: string;
  emptyText?: string;
};

function labelFor(
  resolveObjectLabel: DecisionImpactPanelProps["resolveObjectLabel"],
  id: string | null | undefined
) {
  if (!id) return "Unknown";
  return resolveObjectLabel?.(id) ?? id;
}

export function DecisionImpactPanel(props: DecisionImpactPanelProps) {
  const impact = props.impact;
  if (!impact?.active) {
    return (
      <div style={{ ...cardStyle, gap: 12, padding: 14 }}>
        <div style={sectionTitleStyle}>{props.titleLabel ?? "Decision Impact"}</div>
        <div style={{ ...softCardStyle, color: nx.lowMuted, fontSize: 12, padding: 12 }}>
          {props.emptyText ?? "No strong downstream impact path is active yet."}
        </div>
      </div>
    );
  }

  const sourceLabel = labelFor(props.resolveObjectLabel, impact.source_object_id);
  const affected = impact.nodes
    .filter((node) => node.role !== "context" && node.object_id !== impact.source_object_id)
    .slice(0, 3);
  const strongestRisk = impact.nodes.find((node) => node.role === "downstream_risk") ?? null;
  const strongestEdge = impact.edges[0] ?? null;

  return (
    <div style={{ ...cardStyle, gap: 14, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <div style={sectionTitleStyle}>{props.titleLabel ?? "Decision Impact"}</div>
        <div style={{ color: "#93c5fd", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Confidence {impact.meta.confidence.toFixed(2)}
        </div>
      </div>

      <div style={{ ...softCardStyle, gap: 6, border: "1px solid rgba(96,165,250,0.2)", padding: 12 }}>
        <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>
          {impact.action_label ?? "Decision impact active"}
        </div>
        <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700 }}>Source: {sourceLabel}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
          {strongestRisk
            ? `${labelFor(props.resolveObjectLabel, strongestRisk.object_id)} is the strongest downstream consequence currently visible.`
            : "Impact is currently concentrated around the primary source and first-order effects."}
        </div>
      </div>

      {affected.length > 0 ? (
        <div style={{ ...softCardStyle, gap: 8, padding: 12 }}>
          <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Top Affected Objects
          </div>
          {affected.map((node) => (
            <div key={`${node.object_id}-${node.role}`} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>
                {labelFor(props.resolveObjectLabel, node.object_id)}
              </div>
              <div style={{ color: node.role === "downstream_risk" ? "#fca5a5" : "#93c5fd", fontSize: 11 }}>
                {node.role.replace(/_/g, " ")}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {strongestEdge ? (
        <div style={{ ...softCardStyle, gap: 6, padding: 12 }}>
          <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Strongest Path
          </div>
          <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>
            {labelFor(props.resolveObjectLabel, strongestEdge.from_id)} {"->"} {labelFor(props.resolveObjectLabel, strongestEdge.to_id)}
          </div>
          <div style={{ color: nx.muted, fontSize: 12 }}>
            {strongestEdge.role === "stabilizing_path"
              ? "This path carries the strongest stabilizing effect."
              : strongestEdge.role === "tradeoff_path"
              ? "This path carries the clearest tradeoff pressure."
              : strongestEdge.role === "risk_path"
              ? "This path carries the strongest downstream risk."
              : "This path carries the strongest visible impact."}
          </div>
        </div>
      ) : null}
    </div>
  );
}
