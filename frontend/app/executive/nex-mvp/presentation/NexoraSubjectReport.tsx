"use client";

import type { NexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly viewModel: NexoraMVPPresentationViewModel;
};

/**
 * Compact subject Report surface — DOM overlay beside Stage, not a dashboard.
 */
export function NexoraSubjectReport({ viewModel }: Props) {
  if (!viewModel.showReportSurface || viewModel.subjectId == null) {
    return null;
  }

  return (
    <aside
      data-testid="nexora-subject-report"
      data-presentation-state={viewModel.state}
      data-subject-id={viewModel.subjectId}
      aria-label="Subject report"
      style={{
        position: "absolute",
        left: "0.85rem",
        bottom: "0.85rem",
        zIndex: 7,
        width: "min(18.5rem, calc(100% - 12rem))",
        maxHeight: "42%",
        overflow: "auto",
        padding: "0.7rem 0.75rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.borderStrong}`,
        background: "rgba(8, 14, 24, 0.86)",
        boxShadow: cockpit.elevation.raised,
        backdropFilter: "blur(10px)",
        pointerEvents: "auto",
        color: cockpit.textSoft,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.56rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Report
      </p>
      <h2
        data-testid="nexora-subject-report-title"
        style={{
          margin: "0.35rem 0 0",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: cockpit.text,
        }}
      >
        {viewModel.subjectLabel ?? viewModel.subjectId}
      </h2>
      {viewModel.essentialStatus ? (
        <p
          data-testid="nexora-subject-report-status"
          style={{
            margin: "0.25rem 0 0",
            fontSize: "0.72rem",
            color: cockpit.accent,
          }}
        >
          {viewModel.essentialStatus}
        </p>
      ) : null}

      {viewModel.showKPIs && viewModel.primaryKpi ? (
        <div
          data-testid="nexora-subject-report-kpi"
          style={{ marginTop: "0.65rem" }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
            }}
          >
            {viewModel.primaryKpi.label}
          </p>
          <p
            style={{
              margin: "0.2rem 0 0",
              fontSize: "1.05rem",
              color: cockpit.text,
              fontWeight: 600,
            }}
          >
            {viewModel.primaryKpi.value}
            {viewModel.primaryKpi.delta ? (
              <span
                style={{
                  marginLeft: "0.45rem",
                  fontSize: "0.72rem",
                  color: cockpit.muted,
                  fontWeight: 500,
                }}
              >
                {viewModel.primaryKpi.delta}
              </span>
            ) : null}
          </p>
          {viewModel.primaryKpi.target ? (
            <p
              style={{
                margin: "0.15rem 0 0",
                fontSize: "0.68rem",
                color: cockpit.muted,
              }}
            >
              Target {viewModel.primaryKpi.target}
            </p>
          ) : null}
        </div>
      ) : null}

      {viewModel.showKOI && viewModel.koi ? (
        <div
          data-testid="nexora-subject-report-koi"
          style={{ marginTop: "0.55rem" }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
            }}
          >
            {viewModel.koi.label}
          </p>
          <p
            style={{
              margin: "0.2rem 0 0",
              fontSize: "0.85rem",
              color: cockpit.text,
            }}
          >
            {viewModel.koi.value}
          </p>
        </div>
      ) : null}

      {viewModel.showRelationships ? (
        <ul
          data-testid="nexora-subject-report-relationships"
          style={{
            margin: "0.65rem 0 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {viewModel.relationships.map((relation) => (
            <li
              key={relation.id}
              style={{
                fontSize: "0.68rem",
                color: cockpit.textSoft,
              }}
            >
              <span style={{ color: cockpit.lowMuted }}>
                {relation.relation}
              </span>{" "}
              {relation.label}
            </li>
          ))}
        </ul>
      ) : null}

      {viewModel.showExecutiveSummary && viewModel.summary ? (
        <p
          data-testid="nexora-subject-report-summary"
          style={{
            margin: "0.7rem 0 0",
            fontSize: "0.72rem",
            lineHeight: 1.45,
            color: cockpit.textSoft,
          }}
        >
          {viewModel.summary}
        </p>
      ) : null}

      <p
        data-testid="nexora-subject-report-advisor-slot"
        style={cockpit.visuallyHidden}
      >
        Advisor / Insight detail binds in the right-side intelligence region
      </p>
    </aside>
  );
}
