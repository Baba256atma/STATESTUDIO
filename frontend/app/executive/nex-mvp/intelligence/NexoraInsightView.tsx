"use client";

import type { NexoraMVPInsightViewModel } from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly viewModel: NexoraMVPInsightViewModel;
};

/**
 * Insight explanation surface — understanding-oriented, not a dashboard.
 */
export function NexoraInsightView({ viewModel }: Props) {
  return (
    <div
      data-testid="nexora-insight-view"
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
          data-testid="nexora-insight-view-title"
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
          data-testid="nexora-insight-view-context"
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
            data-testid="nexora-insight-view-subject"
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

      {viewModel.headline ? (
        <p
          data-testid="nexora-insight-headline"
          style={{
            margin: 0,
            fontSize: "0.95rem",
            color: cockpit.text,
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          {viewModel.headline}
        </p>
      ) : null}

      {viewModel.summary ? (
        <p
          data-testid="nexora-insight-summary"
          style={{
            margin: 0,
            fontSize: cockpit.type.body.size,
            color: cockpit.textSoft,
            lineHeight: 1.45,
          }}
        >
          {viewModel.summary}
        </p>
      ) : viewModel.emptyReason ? (
        <p
          data-testid="nexora-insight-empty"
          style={{ margin: 0, fontSize: "0.72rem", color: cockpit.muted }}
        >
          {viewModel.emptyReason}
        </p>
      ) : null}

      {viewModel.attention ? (
        <p
          data-testid="nexora-insight-attention"
          style={{
            margin: 0,
            fontSize: "0.68rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:
              viewModel.attention === "critical" ||
              viewModel.attention === "important"
                ? "#fbbf24"
                : cockpit.accent,
          }}
        >
          Attention · {viewModel.attention}
        </p>
      ) : null}

      {viewModel.primaryKpi ? (
        <div
          data-testid="nexora-insight-kpi"
          style={{
            padding: "0.6rem 0.65rem",
            borderRadius: cockpit.radius.md,
            border: `1px solid ${cockpit.border}`,
            background: cockpit.panelSoft,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.56rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
            }}
          >
            {viewModel.primaryKpi.label}
          </p>
          <p
            style={{
              margin: "0.25rem 0 0",
              fontSize: "1.05rem",
              color: cockpit.text,
              fontWeight: 600,
            }}
          >
            {viewModel.primaryKpi.value}
            {viewModel.primaryKpi.delta ? (
              <span
                style={{
                  marginLeft: "0.4rem",
                  fontSize: "0.72rem",
                  color: cockpit.muted,
                  fontWeight: 500,
                }}
              >
                {viewModel.primaryKpi.delta}
              </span>
            ) : null}
          </p>
        </div>
      ) : null}

      {viewModel.koi ? (
        <div data-testid="nexora-insight-koi">
          <p
            style={{
              margin: 0,
              fontSize: "0.56rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
            }}
          >
            KOI · {viewModel.koi.label}
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

      {viewModel.drivers.length > 0 ? (
        <ul
          data-testid="nexora-insight-drivers"
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {viewModel.drivers.map((driver) => (
            <li
              key={driver}
              style={{ fontSize: "0.7rem", color: cockpit.textSoft }}
            >
              {driver}
            </li>
          ))}
        </ul>
      ) : null}

      {viewModel.relationships.length > 0 ? (
        <ul
          data-testid="nexora-insight-relationships"
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.22rem",
          }}
        >
          {viewModel.relationships.map((relation) => (
            <li
              key={relation.id}
              style={{ fontSize: "0.68rem", color: cockpit.muted }}
            >
              <span style={{ color: cockpit.lowMuted }}>
                {relation.relation}
              </span>{" "}
              {relation.label}
            </li>
          ))}
        </ul>
      ) : null}

      {viewModel.risks.length > 0 ? (
        <ul
          data-testid="nexora-insight-risks"
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.22rem",
          }}
        >
          {viewModel.risks.map((risk) => (
            <li key={risk} style={{ fontSize: "0.68rem", color: "#fbbf24" }}>
              {risk}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
