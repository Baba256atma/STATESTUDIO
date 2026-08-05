"use client";

import { cockpit } from "../shell/executiveCockpitTheme";

export type AdvisorStatusBadge = {
  readonly id: string;
  readonly label: string;
  readonly tone?: "ready" | "connected" | "loaded" | "available" | "muted";
};

type Props = {
  readonly badges: readonly AdvisorStatusBadge[];
};

const TONE: Record<NonNullable<AdvisorStatusBadge["tone"]>, string> = {
  ready: "#4ade80",
  connected: "#38bdf8",
  loaded: "#a78bfa",
  available: "#fbbf24",
  muted: cockpit.muted,
};

export function ExecutiveAdvisorStatusStrip({ badges }: Props) {
  return (
    <div
      data-testid="executive-advisor-status-strip"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.3rem",
        flexShrink: 0,
      }}
    >
      {badges.map((badge) => {
        const color = TONE[badge.tone ?? "muted"];
        return (
          <span
            key={badge.id}
            data-testid={`executive-advisor-status-${badge.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.28rem",
              padding: "0.2rem 0.4rem",
              borderRadius: cockpit.radius.sm,
              border: `1px solid ${color}44`,
              background: `${color}12`,
              color: cockpit.textSoft,
              fontSize: "0.55rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <span
              aria-hidden
              style={{
                width: "0.35rem",
                height: "0.35rem",
                borderRadius: "999px",
                background: color,
              }}
            />
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
