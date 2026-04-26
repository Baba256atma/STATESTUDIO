"use client";

import React from "react";
import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";

type FocusInsightCardProps = {
  selectedObjectId: string | null;
  selectedObjectLabel?: string | null;
  responseData?: any;
  sceneJson?: any;
  riskPropagation?: any;
};

function toLabel(id: string): string {
  return id.replace(/^obj_/, "").replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function confidenceFromRisk(risk01: number): { label: "High" | "Medium" | "Low"; pct: number } {
  const pct = Math.round(Math.max(0, Math.min(1, risk01)) * 100);
  if (pct >= 70) return { label: "High", pct };
  if (pct >= 40) return { label: "Medium", pct };
  return { label: "Low", pct };
}

export default function FocusInsightCard(props: FocusInsightCardProps) {
  const selectedId = String(props.selectedObjectId ?? "").trim();
  if (!selectedId) return null;

  const riskScore = Math.max(
    0,
    Math.min(1, Number(props.responseData?.risk?.score ?? props.responseData?.fragility?.score ?? 0) || 0)
  );
  const confidence = confidenceFromRisk(riskScore);
  const impacted = (() => {
    const edges = Array.isArray(props.riskPropagation?.edges) ? props.riskPropagation.edges : [];
    const targets = edges
      .filter((edge: any) => String(edge?.from ?? "").trim() === selectedId)
      .map((edge: any) => String(edge?.to ?? "").trim())
      .filter(Boolean);
    return targets.slice(0, 2).map((id) => toLabel(id));
  })();
  const signalTitle =
    riskScore >= 0.72 ? "Risk pressure increasing" : riskScore >= 0.35 ? "Risk needs monitoring" : "Risk remains stable";
  const objectLabel = String(props.selectedObjectLabel ?? toLabel(selectedId));
  const impactLine = impacted.length > 0 ? `May affect ${impacted.join(" + ")}` : "Limited downstream impact detected";
  const recommendation =
    riskScore >= 0.72
      ? "Consider alternate supplier or add buffer stock"
      : riskScore >= 0.35
        ? "Inspect driver sensitivity before next action"
        : "Continue current plan and monitor signals";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ ...softCardStyle, padding: 12 }}>
        <div style={{ ...sectionTitleStyle, marginBottom: 6 }}>Focus Insight</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: nx.text }}>{signalTitle}</div>
        <div style={{ marginTop: 6, fontSize: 12, color: nx.muted }}>Object: {objectLabel}</div>
      </div>
      <div style={{ ...softCardStyle, padding: 12, gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: nx.lowMuted }}>Why it matters</div>
        <div style={{ fontSize: 12, color: nx.text }}>
          {objectLabel} is currently part of the active risk surface and can influence near-term stability.
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: nx.lowMuted, marginTop: 2 }}>Impact</div>
        <div style={{ fontSize: 12, color: nx.text }}>{impactLine}</div>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: nx.lowMuted, marginTop: 2 }}>
          Recommended Action
        </div>
        <div style={{ fontSize: 12, color: nx.text }}>{recommendation}</div>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: nx.lowMuted, marginTop: 2 }}>Confidence</div>
        <div style={{ fontSize: 12, color: nx.text }}>
          {confidence.pct}% ({confidence.label})
        </div>
      </div>
    </div>
  );
}
