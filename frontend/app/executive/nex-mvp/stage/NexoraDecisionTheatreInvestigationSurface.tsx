"use client";

import type { NexoraDecisionTheatreObjectInvestigation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.ts";
import type { NexoraDecisionTheatreInvestigationLevel } from "@/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.ts";
import { OBJECT_PANEL_WIDTH } from "@/app/lib/hud/hudPanelDesignContract.ts";
import { cockpit, typeScale } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly investigation: NexoraDecisionTheatreObjectInvestigation;
  readonly onLevelChange: (level: NexoraDecisionTheatreInvestigationLevel) => void;
  readonly onClose: () => void;
  readonly onAsk: (question: string) => void;
};

export function NexoraDecisionTheatreInvestigationSurface({
  investigation,
  onLevelChange,
  onClose,
  onAsk,
}: Props) {
  const showUnderstand = investigation.level === "understand" || investigation.level === "investigate";
  const showInvestigate = investigation.level === "investigate";
  return (
    <aside
      data-testid="nexora-theatre-investigation"
      data-theatre-investigation-object-id={investigation.objectId}
      data-theatre-investigation-object-type={investigation.canonicalObjectType}
      data-theatre-investigation-level={investigation.level}
      data-theatre-investigation-open="true"
      aria-label={`${investigation.managerReadableName} investigation`}
      style={{
        position: "absolute",
        top: "4.5rem",
        right: "0.75rem",
        width: OBJECT_PANEL_WIDTH,
        maxWidth: "42%",
        maxHeight: "58%",
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
        padding: "0.7rem 0.8rem",
        borderRadius: "0.5rem",
        border: `1px solid ${cockpit.borderStrong}`,
        background: cockpit.panel,
        color: cockpit.text,
        boxShadow: "0 10px 28px rgba(0, 0, 0, 0.32)",
        pointerEvents: "auto",
        overflow: "hidden",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: typeScale.status.size, fontWeight: typeScale.status.weight, color: cockpit.muted, textTransform: "uppercase", letterSpacing: typeScale.status.tracking }}>
            {investigation.canonicalObjectType.replace(/-/g, " ")}
          </div>
          <div style={{ fontSize: typeScale.cardTitle.size, fontWeight: typeScale.cardTitle.weight, color: cockpit.text }}>
            {investigation.managerReadableName}
          </div>
        </div>
        <button
          type="button"
          data-testid="nexora-theatre-investigation-close"
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: cockpit.muted,
            cursor: "pointer",
            fontSize: "0.75rem",
          }}
        >
          Close
        </button>
      </header>
      <p style={{ fontSize: typeScale.body.size, color: cockpit.textSoft, margin: 0 }}>{investigation.glance.identity}</p>
      <p style={{ fontSize: typeScale.body.size, color: cockpit.textSoft, margin: 0 }}>{investigation.glance.state}</p>
      <p style={{ fontSize: typeScale.body.size, color: cockpit.muted, margin: 0 }}>{investigation.glance.whyRelevant}</p>
      {showUnderstand ? (
        <div style={{ overflow: "auto", minHeight: 0, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <p style={{ fontSize: typeScale.body.size, margin: 0 }}>{investigation.advisorReadable.evidence}</p>
          <p style={{ fontSize: typeScale.body.size, margin: 0, color: cockpit.muted }}>{investigation.advisorReadable.related}</p>
          {investigation.relatedDecision ? (
            <p style={{ ...typeScale.body, margin: 0 }}>Decision relevance: {investigation.relatedDecision.label}.</p>
          ) : null}
        </div>
      ) : null}
      {showInvestigate ? (
        <div style={{ overflow: "auto", minHeight: 0 }}>
          {investigation.relationships.map((item) => (
            <div key={`${item.id}:${item.relation}`} style={{ fontSize: typeScale.caption.size, color: cockpit.textSoft }}>
              {investigation.managerReadableName} {item.relation} {item.label}
            </div>
          ))}
          {investigation.cost ? <div style={{ fontSize: typeScale.caption.size }}>Cost: {investigation.cost}</div> : null}
          {investigation.time ? <div style={{ fontSize: typeScale.caption.size }}>Time: {investigation.time}</div> : null}
          <p style={{ fontSize: typeScale.caption.size, color: cockpit.warning, margin: "0.35rem 0 0" }}>{investigation.uncertainty}</p>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {investigation.level === "glance" ? (
          <button
            type="button"
            data-testid="nexora-theatre-investigation-understand"
            onClick={() => onLevelChange("understand")}
            style={chipStyle}
          >
            Understand
          </button>
        ) : null}
        {investigation.level === "understand" ? (
          <button
            type="button"
            data-testid="nexora-theatre-investigation-deeper"
            onClick={() => onLevelChange("investigate")}
            style={chipStyle}
          >
            Investigate
          </button>
        ) : null}
        {investigation.suggestedQuestions.slice(0, 3).map((question) => (
          <button key={question} type="button" onClick={() => onAsk(question)} style={chipStyle}>
            {question}
          </button>
        ))}
      </div>
    </aside>
  );
}

const chipStyle = {
  border: `1px solid ${cockpit.border}`,
  background: cockpit.accentSoft,
  color: cockpit.text,
  borderRadius: "999px",
  padding: "0.2rem 0.55rem",
  fontSize: "0.62rem",
  cursor: "pointer",
} as const;
