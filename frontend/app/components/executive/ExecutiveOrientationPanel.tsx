"use client";

import type React from "react";

import { nexoraHudShellStyle, resolveNexoraHudTheme } from "../../lib/scene/nexoraHudTheme";
import type { ExecutiveOrientationExperience } from "../../lib/workspace/orientation";
import { isProgressiveLayerVisible } from "../../lib/workspace/orientation";

export type ExecutiveOrientationPanelProps = {
  experience: ExecutiveOrientationExperience;
  themeMode: "day" | "night";
  onQuickStartSelect?: (actionId: string) => void;
};

/** E2:48 Parts 2–6, 8 — situational awareness, quick start, confidence (progressive). */
export function ExecutiveOrientationPanel(props: ExecutiveOrientationPanelProps): React.ReactElement {
  const { experience, themeMode } = props;
  const theme = resolveNexoraHudTheme(themeMode);
  const disclosure = experience.progressiveDisclosure;
  const showRisk = isProgressiveLayerVisible("risk", disclosure);
  const showDecision = isProgressiveLayerVisible("decision", disclosure);
  const showAction = isProgressiveLayerVisible("action", disclosure);
  const showAdvanced = isProgressiveLayerVisible("advanced", disclosure);

  return (
    <div
      data-nx="executive-orientation-panel"
      aria-label="Executive situational awareness"
      style={nexoraHudShellStyle(
        theme,
        { width: "min(320px, calc(100vw - 24px))", padding: "12px 14px", pointerEvents: "auto" },
        { surface: "sceneInfoHud", edgeAnchor: "TOP_LEFT" }
      )}
    >
      <div
        style={{
          color: theme.label,
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {disclosure.phaseLabel}
      </div>

      {isProgressiveLayerVisible("situation", disclosure) ? (
        <>
          <div style={{ color: theme.textPrimary, fontSize: 13, fontWeight: 800, marginTop: 6, lineHeight: 1.35 }}>
            {experience.situationalAwareness.entryHeadline}
          </div>
          <div style={{ color: theme.textSecondary, fontSize: 11, marginTop: 8, lineHeight: 1.45 }}>
            <OrientationRow label="System overview" value={experience.situationalAwareness.systemOverview} />
            <OrientationRow label="Operational status" value={experience.situationalAwareness.operationalStatus} />
          </div>
        </>
      ) : null}

      {showRisk ? (
        <div style={{ color: theme.textSecondary, fontSize: 11, marginTop: 8, lineHeight: 1.45 }}>
          <OrientationRow label="Risk status" value={experience.situationalAwareness.riskStatus} />
        </div>
      ) : null}

      {showDecision ? (
        <div style={{ color: theme.textSecondary, fontSize: 11, marginTop: 8, lineHeight: 1.45 }}>
          <OrientationRow label="Recommended next step" value={experience.situationalAwareness.recommendedNextStep} />
        </div>
      ) : null}

      {showAction && experience.quickStart.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
          {experience.quickStart.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => props.onQuickStartSelect?.(item.id)}
              style={{
                textAlign: "left",
                borderRadius: 8,
                border: `1px solid ${theme.controlBorder}`,
                background: theme.controlBackground,
                color: theme.textPrimary,
                padding: "8px 10px",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700 }}>{item.label}</div>
              <div style={{ fontSize: 10, color: theme.textSecondary, marginTop: 2, lineHeight: 1.35 }}>
                {item.rationale}
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {showAdvanced ? (
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {experience.confidence.signals
            .filter((signal) => signal.ready)
            .slice(0, 4)
            .map((signal) => (
              <span
                key={signal.id}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: theme.textPrimary,
                  border: `1px solid ${theme.controlBorder}`,
                  borderRadius: 999,
                  padding: "3px 8px",
                  background: theme.controlBackground,
                }}
              >
                {signal.label}
              </span>
            ))}
        </div>
      ) : null}
    </div>
  );
}

function OrientationRow(props: { label: string; value: string }) {
  return (
    <div style={{ marginTop: 4 }}>
      <strong>{props.label}:</strong> {props.value}
    </div>
  );
}

export default ExecutiveOrientationPanel;
