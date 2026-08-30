"use client";

import { cockpit } from "../../exs1/shell/executiveCockpitTheme";
import type { NexoraDecisionTheatreIconicObject } from "@/app/lib/decision-theatre/nexoraDecisionTheatreIconicProjection.ts";

const ROLE_MARK: Readonly<Record<string, string>> = Object.freeze({
  cost: "C",
  time: "T",
  evidence: "E",
  confidence: "K",
  uncertainty: "U",
  reversibility: "R",
  capacity: "P",
  "goal-impact": "G",
});

type Props = {
  readonly iconic: NexoraDecisionTheatreIconicObject;
};

/**
 * DTH:2 — Minimal family distinction only.
 * Smaller, icon-forward, attached, subordinate. No color/size/motion meaning.
 */
export function NexoraDecisionTheatreIconicSatellite({ iconic }: Props) {
  const mark = ROLE_MARK[iconic.role] ?? "I";
  const valueText =
    iconic.unknown
      ? "unknown"
      : iconic.missing
        ? "missing"
        : iconic.value == null
          ? iconic.epistemicStatus
          : String(iconic.value);
  return (
    <button
      type="button"
      data-testid={`nexora-theatre-iconic-${iconic.presentationId}`}
      data-visual-family="iconic-object"
      data-iconic-role={iconic.role}
      data-iconic-owner={iconic.ownerExecutiveObjectId}
      data-iconic-token={iconic.rendererIconToken}
      data-iconic-interaction={iconic.interactionCapability}
      data-iconic-unknown={iconic.unknown ? "true" : "false"}
      data-iconic-missing={iconic.missing ? "true" : "false"}
      data-iconic-provenance={iconic.provenance}
      data-nexograph-form-token={`form-iconic-${iconic.role}`}
      data-nexograph-subordinate="true"
      data-nexograph-halo="halo-none"
      aria-label={iconic.accessibilityLabel}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.28rem",
        margin: "0.08rem 0 0.12rem 0.55rem",
        padding: "0.12rem 0.28rem",
        maxWidth: "8.4rem",
        border: `1px solid ${cockpit.border}`,
        borderRadius: "999px",
        background: "rgba(8, 14, 24, 0.35)",
        color: cockpit.muted,
        fontSize: "0.48rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: iconic.interactionCapability === "identity-only" ? "default" : "default",
        fontFamily: "inherit",
        lineHeight: 1.2,
      }}
    >
      <span
        aria-hidden="true"
        data-iconic-mark={mark}
        style={{
          display: "inline-flex",
          width: "0.9rem",
          height: "0.9rem",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "999px",
          border: `1px solid ${cockpit.border}`,
          fontSize: "0.42rem",
          fontWeight: 700,
        }}
      >
        {mark}
      </span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {iconic.managerReadableLabel}
        {iconic.unknown || iconic.missing ? ` · ${valueText}` : ""}
      </span>
    </button>
  );
}
