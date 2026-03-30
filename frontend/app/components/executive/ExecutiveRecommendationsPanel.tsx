"use client";

import React from "react";

import { EmptyStateCard } from "../ui/panelStates";
import { nx, primaryButtonStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { ExecutiveOSController } from "../../lib/executive/executiveOSTypes";

type ExecutiveRecommendationsPanelProps = {
  controller: ExecutiveOSController;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

export function ExecutiveRecommendationsPanel({ controller, resolveObjectLabel }: ExecutiveRecommendationsPanelProps) {
  const recommendations = controller.state.recommendations;
  if (!recommendations.length) {
    return <EmptyStateCard text="Recommendations will appear after Nexora can connect signals, strategy options, and learning into concrete next moves." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Recommendations</div>
      {recommendations.map((recommendation) => (
        <div key={recommendation.recommendation_id} style={{ ...softCardStyle, padding: 10, gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>{recommendation.title}</div>
            <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>{recommendation.kind.toUpperCase()}</div>
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{recommendation.summary}</div>
          {recommendation.target_object_id ? (
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>
              {resolveObjectLabel?.(recommendation.target_object_id) ?? "This target is outside the current scene context."}
            </div>
          ) : null}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Confidence {recommendation.confidence.toFixed(2)}</div>
            <button type="button" onClick={() => controller.runRecommendation(recommendation)} style={primaryButtonStyle}>
              Act On This
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
