"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";
import { ScenarioImpactLegend } from "./ScenarioImpactLegend";
import { useScenarioImpact } from "./hooks/useScenarioImpact";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ScenarioImpactStoryPanel — floating Impact Story summary (mock).
 */
export function ScenarioImpactStoryPanel() {
  const { isActive, primaryStory, currentScenario } = useScenarioImpact();
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(280);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragRef.current = { startX: event.clientX, startWidth: width };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [width],
  );

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const delta = dragRef.current.startX - event.clientX;
    setWidth(Math.min(400, Math.max(240, dragRef.current.startWidth + delta)));
  }, []);

  if (!isActive || !primaryStory || !currentScenario) return null;

  return (
    <aside
      data-testid="scenario-impact-story-panel"
      aria-label="Impact Story"
      style={{
        position: "absolute",
        top: "3.5rem",
        right: "1rem",
        width: collapsed ? "2.75rem" : width,
        maxHeight: "calc(100% - 5rem)",
        zIndex: 8,
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.55rem",
        border: `1px solid ${currentScenario.color}88`,
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
        {!collapsed ? (
          <strong
            data-testid="scenario-impact-story-title"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: cockpit.text,
            }}
          >
            Impact Story
          </strong>
        ) : (
          <span style={{ color: currentScenario.color, fontSize: "0.7rem" }}>
            Im
          </span>
        )}
        <button
          type="button"
          data-testid="scenario-impact-story-collapse"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((v) => !v)}
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
          {collapsed ? "‹" : "›"}
        </button>
      </div>

      {!collapsed ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            padding: "0.7rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem",
          }}
        >
          <div>
            <p style={labelStyle}>Executive Summary</p>
            <p
              data-testid="scenario-impact-summary"
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.8rem",
                lineHeight: 1.45,
                color: cockpit.textSoft,
              }}
            >
              {primaryStory.summary}
            </p>
          </div>

          <div>
            <p style={labelStyle}>Estimated Direction</p>
            <p
              data-testid="scenario-impact-direction"
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.78rem",
                color: currentScenario.color,
                fontWeight: 550,
              }}
            >
              {primaryStory.estimatedDirection}
            </p>
          </div>

          <div>
            <p style={labelStyle}>Confidence</p>
            <p
              data-testid="scenario-impact-confidence"
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.84rem",
                color: cockpit.text,
              }}
            >
              {primaryStory.confidence}%
            </p>
          </div>

          <div>
            <p style={labelStyle}>Affected Departments</p>
            <div
              data-testid="scenario-impact-departments"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.3rem",
                marginTop: "0.3rem",
              }}
            >
              {primaryStory.affectedDepartments.map((dept) => (
                <span
                  key={dept}
                  style={{
                    fontSize: "0.62rem",
                    padding: "0.2rem 0.4rem",
                    borderRadius: "999px",
                    border: `1px solid ${cockpit.border}`,
                    color: cockpit.textSoft,
                  }}
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p style={labelStyle}>Affected Objects</p>
            <ol
              data-testid="scenario-impact-objects"
              style={{
                margin: "0.3rem 0 0",
                padding: "0 0 0 1rem",
                color: cockpit.textSoft,
                fontSize: "0.74rem",
                lineHeight: 1.5,
              }}
            >
              {primaryStory.chain.map((node) => (
                <li key={node.objectId}>
                  {node.label} · {node.status} · {node.level}
                </li>
              ))}
            </ol>
          </div>

          <ScenarioImpactLegend />
        </div>
      ) : null}

      {!collapsed ? (
        <div
          role="separator"
          aria-orientation="vertical"
          data-testid="scenario-impact-story-resize"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
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
