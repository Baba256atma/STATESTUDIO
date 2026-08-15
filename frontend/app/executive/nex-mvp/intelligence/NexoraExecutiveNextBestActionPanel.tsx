"use client";

import type { ExecutiveNextBestActionResult } from "@/app/lib/spatial-presentation/executiveStageNextBestAction";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly nextBestAction: ExecutiveNextBestActionResult | null | undefined;
  readonly onExecuteAction: (actionId: string) => void;
};

/**
 * STAGE-PROD:3 — restrained NBA panel for Advisor region.
 * Not a Stage Object. Quiet when no recommendation.
 */
export function NexoraExecutiveNextBestActionPanel({
  nextBestAction,
  onExecuteAction,
}: Props) {
  const recommended = nextBestAction?.recommendedAction ?? null;
  if (recommended == null || nextBestAction?.eligible !== true) {
    return null;
  }

  const alternatives = nextBestAction.alternativeActions;

  return (
    <section
      data-testid="nexora-executive-nba"
      data-stage-prod="3"
      data-nba-subject={nextBestAction.subjectObjectId ?? "none"}
      data-nba-recommended-kind={recommended.kind}
      data-nba-recommended-target={
        recommended.targetObjectId ?? recommended.targetCollection ?? "none"
      }
      data-nba-is-semantic-object="false"
      aria-label="Next Best Action"
      style={{
        margin: "0.55rem 0.75rem 0.35rem",
        padding: "0.55rem 0.65rem 0.6rem",
        borderTop: `1px solid ${cockpit.border}`,
        borderBottom: `1px solid ${cockpit.border}`,
        background: "rgba(8, 14, 24, 0.35)",
      }}
    >
      <div
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: cockpit.muted,
          fontWeight: 600,
          marginBottom: "0.35rem",
        }}
      >
        Next Best Action
      </div>
      <button
        type="button"
        data-testid="nexora-executive-nba-recommended"
        data-action-id={recommended.id}
        onClick={() => onExecuteAction(recommended.id)}
        style={{
          width: "100%",
          textAlign: "left",
          border: `1px solid ${cockpit.accent}`,
          borderRadius: "0.25rem",
          background: "rgba(56, 120, 180, 0.18)",
          color: cockpit.textSoft,
          padding: "0.4rem 0.5rem",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <div style={{ fontSize: "0.72rem", fontWeight: 600 }}>
          {recommended.label}
        </div>
        <div
          style={{
            fontSize: "0.6rem",
            color: cockpit.muted,
            marginTop: "0.18rem",
            lineHeight: 1.35,
          }}
        >
          {recommended.reason}
        </div>
      </button>
      {alternatives.length > 0 ? (
        <div style={{ marginTop: "0.45rem" }}>
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: cockpit.muted,
              marginBottom: "0.2rem",
            }}
          >
            Other options
          </div>
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
            {alternatives.map((action) => (
              <li key={action.id}>
                <button
                  type="button"
                  data-testid={`nexora-executive-nba-alt-${action.id}`}
                  data-action-id={action.id}
                  onClick={() => onExecuteAction(action.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    background: "transparent",
                    color: cockpit.textSoft,
                    padding: "0.22rem 0.15rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.65rem",
                  }}
                >
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
