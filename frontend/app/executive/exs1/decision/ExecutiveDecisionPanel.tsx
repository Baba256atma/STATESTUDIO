"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { INITIAL_SCENARIOS } from "../scenario/ScenarioConfig";
import { ExecutiveDecisionApprovalBar } from "./ExecutiveDecisionApprovalBar";
import { ExecutiveDecisionCard } from "./ExecutiveDecisionCard";
import { ExecutiveDecisionSummary } from "./ExecutiveDecisionSummary";
import { useExecutiveDecision } from "./hooks/useExecutiveDecision";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onManualCreateRequest: () => void;
};

/**
 * ExecutiveDecisionPanel — floating Decision workspace (collapsible / resizable).
 */
export function ExecutiveDecisionPanel({ onManualCreateRequest }: Props) {
  const {
    isActive,
    decisions,
    currentDecision,
    currentDecisionId,
    panelCollapsed,
    panelWidth,
    setCurrentDecision,
    setPanelCollapsed,
    setPanelWidth,
    createFromScenario,
    combineFromScenarios,
  } = useExecutiveDecision();

  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragRef.current = { startX: event.clientX, startWidth: panelWidth };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [panelWidth],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const delta = event.clientX - dragRef.current.startX;
      setPanelWidth(
        Math.min(420, Math.max(260, dragRef.current.startWidth + delta)),
      );
    },
    [setPanelWidth],
  );

  if (!isActive) return null;

  return (
    <aside
      data-testid="executive-decision-panel"
      aria-label="Executive Decision"
      style={{
        position: "absolute",
        top: "3.5rem",
        left: "1rem",
        width: panelCollapsed ? "2.75rem" : panelWidth,
        maxHeight: "calc(100% - 5rem)",
        zIndex: 8,
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.55rem",
        border: "1px solid rgba(21, 112, 239, 0.45)",
        background: "rgba(10, 14, 20, 0.92)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        overflow: "hidden",
        transition: "width 250ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.4rem",
          padding: "0.55rem 0.65rem",
          borderBottom: `1px solid ${cockpit.border}`,
        }}
      >
        {!panelCollapsed ? (
          <strong
            data-testid="executive-decision-panel-title"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Executive Decision
          </strong>
        ) : (
          <span style={{ color: "#1570EF", fontSize: "0.7rem" }}>Dc</span>
        )}
        <button
          type="button"
          data-testid="executive-decision-panel-collapse"
          aria-expanded={!panelCollapsed}
          onClick={() => setPanelCollapsed(!panelCollapsed)}
          style={{
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            borderRadius: "0.3rem",
            width: "1.6rem",
            height: "1.6rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {panelCollapsed ? "›" : "‹"}
        </button>
      </div>

      {!panelCollapsed ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            padding: "0.65rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          <section>
            <p style={labelStyle}>Current Decision</p>
            <p
              data-testid="executive-decision-current"
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.86rem",
                fontWeight: 600,
                color: "#1570EF",
              }}
            >
              {currentDecision?.name ?? "None"}
            </p>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
              Status · {currentDecision?.status ?? "—"}
            </p>
          </section>

          <section>
            <p style={labelStyle}>Candidate Scenarios</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.3rem",
                marginTop: "0.3rem",
              }}
            >
              {INITIAL_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  data-testid={`decision-source-${s.id}`}
                  onClick={() => createFromScenario(s.id, s.name)}
                  style={{
                    padding: "0.28rem 0.45rem",
                    borderRadius: "999px",
                    border: `1px solid ${s.color}66`,
                    background: `${s.color}14`,
                    color: s.color,
                    fontSize: "0.6rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {s.name}
                </button>
              ))}
              <button
                type="button"
                data-testid="decision-source-combine"
                onClick={() =>
                  combineFromScenarios(
                    ["scenario-a", "scenario-c"],
                    "Scenario A + C",
                  )
                }
                style={{
                  padding: "0.28rem 0.45rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(122,90,248,0.5)",
                  background: "rgba(122,90,248,0.12)",
                  color: "#BDB4FE",
                  fontSize: "0.6rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                A + C
              </button>
              <button
                type="button"
                data-testid="decision-source-manual"
                onClick={onManualCreateRequest}
                style={{
                  padding: "0.28rem 0.45rem",
                  borderRadius: "999px",
                  border: `1px solid ${cockpit.border}`,
                  background: "transparent",
                  color: cockpit.accent,
                  fontSize: "0.6rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Manual
              </button>
            </div>
          </section>

          <section
            style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}
          >
            <p style={labelStyle}>Decisions</p>
            {decisions.map((decision) => (
              <ExecutiveDecisionCard
                key={decision.id}
                decision={decision}
                selected={decision.id === currentDecisionId}
                onSelect={() => setCurrentDecision(decision.id)}
              />
            ))}
          </section>

          <section>
            <p style={labelStyle}>Executive Summary</p>
            <div style={{ marginTop: "0.35rem" }}>
              <ExecutiveDecisionSummary />
            </div>
          </section>

          <ExecutiveDecisionApprovalBar />
        </div>
      ) : null}

      {!panelCollapsed ? (
        <div
          role="separator"
          aria-orientation="vertical"
          data-testid="executive-decision-panel-resize"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "4px",
            height: "100%",
            cursor: "col-resize",
          }}
        />
      ) : null}
    </aside>
  );
}

const labelStyle = {
  margin: 0,
  fontSize: "0.56rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: cockpit.lowMuted,
};
