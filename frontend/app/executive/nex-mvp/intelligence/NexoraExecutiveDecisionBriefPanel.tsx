"use client";

import type { ExecutiveDecisionBriefResult } from "@/app/lib/spatial-presentation/executiveStageDecisionBrief";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly decisionBrief: ExecutiveDecisionBriefResult | null | undefined;
  readonly onSelectOptionObject?: (objectId: string) => void;
  readonly onExecuteRecommendation?: (actionId: string) => void;
};

/**
 * STAGE-PROD:4 — compact Decision Brief in Advisor region.
 * Not a Stage Object. Quiet when unavailable / ineligible.
 */
export function NexoraExecutiveDecisionBriefPanel({
  decisionBrief,
  onSelectOptionObject,
  onExecuteRecommendation,
}: Props) {
  const brief = decisionBrief?.brief ?? null;
  if (
    decisionBrief == null ||
    decisionBrief.eligible !== true ||
    decisionBrief.available !== true ||
    brief == null
  ) {
    return null;
  }

  const sectionLabelStyle = {
    fontSize: "0.55rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: cockpit.muted,
    fontWeight: 600,
    marginBottom: "0.2rem",
  };

  const bodyStyle = {
    fontSize: "0.68rem",
    color: cockpit.textSoft,
    lineHeight: 1.4,
    margin: 0,
  };

  return (
    <section
      data-testid="nexora-executive-decision-brief"
      data-stage-prod="4"
      data-brief-subject={brief.subjectObjectId}
      data-brief-completeness={brief.completeness}
      data-brief-is-semantic-object="false"
      aria-label="Decision Brief"
      style={{
        margin: "0.35rem 0.75rem 0.15rem",
        padding: "0.55rem 0.65rem 0.6rem",
        borderTop: `1px solid ${cockpit.border}`,
        borderBottom: `1px solid ${cockpit.border}`,
        background: "rgba(10, 16, 26, 0.4)",
      }}
    >
      <div
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: cockpit.muted,
          fontWeight: 600,
          marginBottom: "0.4rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <span>Decision Brief</span>
        {brief.completeness === "partial" ? (
          <span data-testid="nexora-executive-brief-partial" style={{ opacity: 0.75 }}>
            Decision context incomplete
          </span>
        ) : null}
      </div>

      <div data-testid="nexora-executive-brief-situation" style={{ marginBottom: "0.45rem" }}>
        <div style={sectionLabelStyle}>{brief.situation.label}</div>
        <p style={bodyStyle}>{brief.situation.text}</p>
      </div>

      <div data-testid="nexora-executive-brief-evidence" style={{ marginBottom: "0.45rem" }}>
        <div style={sectionLabelStyle}>Evidence</div>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.15rem",
          }}
        >
          {brief.evidence.map((item) => (
            <li
              key={item.id}
              data-testid={`nexora-executive-brief-evidence-${item.id}`}
              style={{ ...bodyStyle, paddingLeft: "0.15rem" }}
            >
              · {item.text}
            </li>
          ))}
        </ul>
      </div>

      {brief.impact != null ? (
        <div data-testid="nexora-executive-brief-impact" style={{ marginBottom: "0.45rem" }}>
          <div style={sectionLabelStyle}>{brief.impact.label}</div>
          <p style={bodyStyle}>{brief.impact.text}</p>
        </div>
      ) : null}

      {brief.options.length > 0 ? (
        <div data-testid="nexora-executive-brief-options" style={{ marginBottom: "0.45rem" }}>
          <div style={sectionLabelStyle}>Options</div>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.12rem",
            }}
          >
            {brief.options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  data-testid={`nexora-executive-brief-option-${option.id}`}
                  data-option-object={option.objectId ?? "none"}
                  onClick={() => {
                    if (option.objectId != null) {
                      onSelectOptionObject?.(option.objectId);
                    }
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    background: "transparent",
                    color: cockpit.textSoft,
                    padding: "0.18rem 0.1rem",
                    cursor: option.objectId != null ? "pointer" : "default",
                    fontFamily: "inherit",
                    fontSize: "0.65rem",
                  }}
                >
                  · {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {brief.recommendation != null ? (
        <div
          data-testid="nexora-executive-brief-recommendation"
          style={{ marginBottom: "0.45rem" }}
        >
          <div style={sectionLabelStyle}>Recommendation</div>
          {brief.recommendation.actionId != null ? (
            <button
              type="button"
              data-testid="nexora-executive-brief-recommendation-action"
              data-action-id={brief.recommendation.actionId}
              onClick={() => {
                if (brief.recommendation?.actionId != null) {
                  onExecuteRecommendation?.(brief.recommendation.actionId);
                }
              }}
              style={{
                width: "100%",
                textAlign: "left",
                border: `1px solid ${cockpit.border}`,
                borderRadius: "0.2rem",
                background: "rgba(56, 120, 180, 0.12)",
                color: cockpit.textSoft,
                padding: "0.32rem 0.45rem",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.68rem",
                fontWeight: 600,
              }}
            >
              {brief.recommendation.text}
            </button>
          ) : (
            <p style={bodyStyle}>{brief.recommendation.text}</p>
          )}
        </div>
      ) : null}

      {brief.decisionRequired != null ? (
        <div data-testid="nexora-executive-brief-decision-required">
          <div style={sectionLabelStyle}>{brief.decisionRequired.label}</div>
          <p style={bodyStyle}>{brief.decisionRequired.text}</p>
        </div>
      ) : null}
    </section>
  );
}
