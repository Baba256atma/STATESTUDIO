"use client";

import React from "react";

import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { secondaryButtonStyle } from "../ui/nexoraTheme";

export const RecommendationCard = ({
  rec,
  onWhyThis,
}: {
  rec: CanonicalRecommendation | null;
  onWhyThis?: (() => void) | null;
}) => {
  if (!rec) return null;

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(148,163,184,0.16)",
        padding: 16,
        background: "rgba(15,23,42,0.78)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.6 }}>Recommended Action</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>{rec.primary.action}</div>

      <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.78, color: "#cbd5e1" }}>
        {rec.reasoning.why}
      </div>

      <div style={{ fontSize: 11, opacity: 0.55, color: "#94a3b8" }}>
        Confidence: {rec.confidence.level}
      </div>

      {onWhyThis ? (
        <div>
          <button type="button" onClick={onWhyThis} style={secondaryButtonStyle}>
            Why this?
          </button>
        </div>
      ) : null}
    </div>
  );
};
