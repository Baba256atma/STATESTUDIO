"use client";

import type {
  NexoraMVPAdvisorViewModel,
  NexoraMVPIntelligenceAction,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly viewModel: NexoraMVPAdvisorViewModel;
  readonly onAction: (action: NexoraMVPIntelligenceAction) => void;
};

/**
 * Advisor guidance surface — action-oriented, not a chatbot transcript.
 */
export function NexoraAdvisorView({ viewModel, onAction }: Props) {
  return (
    <div
      data-testid="nexora-advisor-view"
      data-context-key={viewModel.contextKey}
      data-subject-id={viewModel.subjectId ?? "none"}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <header>
        <p
          data-testid="nexora-advisor-view-title"
          style={{
            margin: 0,
            fontSize: cockpit.type.sectionTitle.size,
            letterSpacing: cockpit.type.sectionTitle.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
            fontWeight: cockpit.type.sectionTitle.weight,
          }}
        >
          {viewModel.title}
        </p>
        <p
          data-testid="nexora-advisor-view-context"
          style={{
            margin: "0.35rem 0 0",
            fontSize: "0.68rem",
            color: cockpit.muted,
          }}
        >
          {viewModel.contextLine}
        </p>
        {viewModel.subjectLabel ? (
          <p
            data-testid="nexora-advisor-view-subject"
            style={{
              margin: "0.35rem 0 0",
              fontSize: "0.85rem",
              color: cockpit.text,
              fontWeight: 600,
            }}
          >
            {viewModel.subjectLabel}
            {viewModel.subjectKind ? (
              <span
                style={{
                  marginLeft: "0.4rem",
                  fontSize: "0.65rem",
                  color: cockpit.lowMuted,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {viewModel.subjectKind}
              </span>
            ) : null}
          </p>
        ) : null}
      </header>

      {viewModel.observation ? (
        <p
          data-testid="nexora-advisor-observation"
          style={{
            margin: 0,
            fontSize: cockpit.type.body.size,
            color: cockpit.textSoft,
            lineHeight: 1.45,
          }}
        >
          {viewModel.observation}
        </p>
      ) : null}

      {viewModel.recommendation ? (
        <div
          data-testid="nexora-advisor-recommendation"
          style={{
            padding: "0.65rem 0.7rem",
            borderRadius: cockpit.radius.md,
            border: `1px solid ${cockpit.border}`,
            background: cockpit.panelSoft,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.56rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
            }}
          >
            Recommendation
          </p>
          <p
            style={{
              margin: "0.35rem 0 0",
              fontSize: "0.9rem",
              color: cockpit.accent,
              fontWeight: 600,
            }}
          >
            {viewModel.recommendation}
          </p>
          {viewModel.rationale ? (
            <p
              data-testid="nexora-advisor-rationale"
              style={{
                margin: "0.4rem 0 0",
                fontSize: "0.72rem",
                color: cockpit.textSoft,
                lineHeight: 1.45,
              }}
            >
              {viewModel.rationale}
            </p>
          ) : null}
        </div>
      ) : (
        <p
          data-testid="nexora-advisor-empty"
          style={{
            margin: 0,
            fontSize: "0.72rem",
            color: cockpit.muted,
          }}
        >
          {viewModel.emptyReason ??
            "No recommendation available for the current context."}
        </p>
      )}

      {viewModel.warning ? (
        <p
          data-testid="nexora-advisor-warning"
          role="status"
          style={{
            margin: 0,
            fontSize: "0.7rem",
            color: "#fbbf24",
          }}
        >
          {viewModel.warning}
        </p>
      ) : null}

      {viewModel.nextActions.length > 0 ? (
        <div
          data-testid="nexora-advisor-actions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.56rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
            }}
          >
            Next
          </p>
          {viewModel.nextActions.map((action) => (
            <button
              key={action.id}
              type="button"
              data-testid={`nexora-advisor-action-${action.id}`}
              disabled={!action.available}
              title={
                action.available
                  ? action.label
                  : (action.disabledReason ?? "Unavailable")
              }
              onClick={() => {
                if (action.available) onAction(action);
              }}
              style={{
                textAlign: "left",
                border: `1px solid ${cockpit.border}`,
                background: action.available
                  ? "rgba(56, 120, 180, 0.16)"
                  : "transparent",
                color: action.available ? cockpit.textSoft : cockpit.lowMuted,
                fontSize: "0.72rem",
                borderRadius: cockpit.radius.sm,
                padding: "0.4rem 0.5rem",
                cursor: action.available ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
