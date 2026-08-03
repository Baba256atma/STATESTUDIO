"use client";

import { INITIAL_SCENARIOS } from "../scenario/ScenarioConfig";
import { useExecutiveDecision } from "./hooks/useExecutiveDecision";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * DecisionPreviewPanel — visual-only pre-approval comparison.
 */
export function DecisionPreviewPanel() {
  const { isActive, previewOpen, setPreviewOpen, currentDecision } =
    useExecutiveDecision();

  if (!isActive || !previewOpen || !currentDecision) return null;

  const candidates = INITIAL_SCENARIOS.slice(0, 2);

  return (
    <div
      data-testid="decision-preview-panel"
      style={{
        position: "absolute",
        left: "50%",
        bottom: "1rem",
        transform: "translateX(-50%)",
        width: "min(34rem, calc(100% - 2rem))",
        zIndex: 9,
        borderRadius: "0.55rem",
        border: "1px solid rgba(21, 112, 239, 0.45)",
        background: "rgba(10, 14, 20, 0.94)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.55rem 0.75rem",
          borderBottom: `1px solid ${cockpit.border}`,
        }}
      >
        <strong
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Decision Preview
        </strong>
        <button
          type="button"
          data-testid="decision-preview-close"
          onClick={() => setPreviewOpen(false)}
          style={{
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            borderRadius: "0.3rem",
            width: "1.6rem",
            height: "1.6rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ×
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "0.5rem",
          padding: "0.7rem",
        }}
      >
        {candidates.map((s) => (
          <PreviewCol
            key={s.id}
            title={s.name}
            color={s.color}
            lines={[`ROI ${s.roi}`, `Risk ${s.risk}`, `${s.confidence}%`]}
          />
        ))}
        <PreviewCol
          title="Decision Preview"
          color="#1570EF"
          lines={[
            currentDecision.name,
            currentDecision.status,
            `${currentDecision.confidence}%`,
          ]}
          emphasis
        />
      </div>
    </div>
  );
}

function PreviewCol({
  title,
  color,
  lines,
  emphasis,
}: {
  readonly title: string;
  readonly color: string;
  readonly lines: readonly string[];
  readonly emphasis?: boolean;
}) {
  return (
    <div
      style={{
        padding: "0.55rem",
        borderRadius: "0.4rem",
        border: emphasis ? `1px solid ${color}` : `1px solid ${cockpit.border}`,
        background: emphasis ? `${color}14` : cockpit.panelSoft,
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color,
          marginBottom: "0.35rem",
        }}
      >
        {title}
      </div>
      {lines.map((line) => (
        <div
          key={line}
          style={{ fontSize: "0.68rem", color: cockpit.textSoft, lineHeight: 1.45 }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}
