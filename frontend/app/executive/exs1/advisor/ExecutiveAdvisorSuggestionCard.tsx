"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { AdvisorSuggestion } from "./ExecutiveAdvisorTypes";

const KIND_COLOR: Record<AdvisorSuggestion["kind"], string> = {
  Recommendation: "#38bdf8",
  Question: "#A4BCFD",
  Observation: "#98A2B3",
  Warning: "#FDB022",
  Opportunity: "#12B76A",
  Risk: "#F04438",
};

type Props = {
  readonly suggestion: AdvisorSuggestion;
};

export function ExecutiveAdvisorSuggestionCard({ suggestion }: Props) {
  const color = KIND_COLOR[suggestion.kind];
  return (
    <div
      data-testid={`executive-advisor-suggestion-${suggestion.id}`}
      data-kind={suggestion.kind}
      style={{
        padding: "0.6rem 0.7rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${color}55`,
        background: `${color}12`,
        boxShadow: cockpit.elevation.raised,
        transition: cockpit.transition,
      }}
    >
      <div
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color,
          marginBottom: "0.2rem",
        }}
      >
        {suggestion.kind}
      </div>
      <div
        style={{
          fontSize: "0.78rem",
          fontWeight: 550,
          color: cockpit.text,
        }}
      >
        {suggestion.title}
      </div>
      <div
        style={{
          marginTop: "0.2rem",
          fontSize: "0.74rem",
          lineHeight: 1.45,
          color: cockpit.textSoft,
        }}
      >
        {suggestion.body}
      </div>
    </div>
  );
}
