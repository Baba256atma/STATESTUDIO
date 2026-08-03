"use client";

import { useExecutiveDecision } from "./hooks/useExecutiveDecision";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ExecutiveDecisionSummary — reason, benefits, risks, confidence, next step.
 */
export function ExecutiveDecisionSummary() {
  const { currentDecision } = useExecutiveDecision();
  if (!currentDecision) return null;

  return (
    <div
      data-testid="executive-decision-summary"
      style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
    >
      <Block title="Reason" body={currentDecision.reason} />
      <Block
        title="Expected Benefits"
        body={currentDecision.benefits.join(" · ")}
      />
      <Block title="Known Risks" body={currentDecision.risks.join(" · ")} />
      <Block
        title="Confidence"
        body={`${currentDecision.confidence}%`}
        accent
      />
      <Block title="Recommended Next Step" body={currentDecision.nextStep} />
      <Block title="Why this Decision?" body={currentDecision.whyThis} />
      <Block
        title="Why not alternatives?"
        body={currentDecision.whyNotAlternatives}
      />
      <Block
        title="Expected Executive Impact"
        body={currentDecision.expectedImpact}
      />
    </div>
  );
}

function Block({
  title,
  body,
  accent,
}: {
  readonly title: string;
  readonly body: string;
  readonly accent?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: "0.56rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: "0.25rem 0 0",
          fontSize: "0.78rem",
          lineHeight: 1.45,
          color: accent ? "#1570EF" : cockpit.textSoft,
          fontWeight: accent ? 550 : 400,
        }}
      >
        {body}
      </p>
    </div>
  );
}
