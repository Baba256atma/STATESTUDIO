"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { CombinedScenarioCard } from "./CombinedScenarioCard";
import { ScenarioCard } from "./ScenarioCard";
import { useScenarioExperience } from "./hooks/useScenarioExperience";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onCreateRequest: () => void;
};

/**
 * ScenarioExplorer — floating, collapsible, resizable Stage panel.
 * Visible only when Executive Mode = Scenario.
 */
export function ScenarioExplorer({ onCreateRequest }: Props) {
  const {
    isActive,
    scenarios,
    currentScenarioId,
    favoriteId,
    compareIds,
    explorerCollapsed,
    explorerWidth,
    setExplorerCollapsed,
    setExplorerWidth,
    setCurrentScenario,
    toggleCompare,
    setFavorite,
    removeScenario,
    combineScenarios,
    setShowComparison,
    setShowRanking,
    clearCompare,
  } = useScenarioExperience();

  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragRef.current = { startX: event.clientX, startWidth: explorerWidth };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [explorerWidth],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const delta = event.clientX - dragRef.current.startX;
      setExplorerWidth(
        Math.min(420, Math.max(240, dragRef.current.startWidth + delta)),
      );
    },
    [setExplorerWidth],
  );

  if (!isActive) return null;

  const combined = scenarios.filter((s) => s.combinedFrom?.length);
  const base = scenarios.filter((s) => !s.combinedFrom?.length);
  const canCombine = compareIds.length === 2;

  return (
    <aside
      data-testid="scenario-explorer"
      aria-label="Scenario Explorer"
      style={{
        position: "absolute",
        top: "3.5rem",
        left: "1rem",
        width: explorerCollapsed ? "2.75rem" : explorerWidth,
        maxHeight: "calc(100% - 5rem)",
        zIndex: 8,
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.55rem",
        border: `1px solid ${cockpit.borderStrong}`,
        background: "rgba(10, 14, 20, 0.9)",
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
          flexShrink: 0,
        }}
      >
        {!explorerCollapsed ? (
          <strong
            data-testid="scenario-explorer-title"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: cockpit.text,
            }}
          >
            Scenario Explorer
          </strong>
        ) : (
          <span style={{ color: "#7A5AF8", fontSize: "0.7rem" }}>Sc</span>
        )}
        <button
          type="button"
          data-testid="scenario-explorer-collapse"
          aria-expanded={!explorerCollapsed}
          onClick={() => setExplorerCollapsed(!explorerCollapsed)}
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
          {explorerCollapsed ? "›" : "‹"}
        </button>
      </div>

      {!explorerCollapsed ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            padding: "0.65rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.55rem",
          }}
        >
          {base.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              selected={scenario.id === currentScenarioId}
              favorite={scenario.id === favoriteId}
              comparing={compareIds.includes(scenario.id)}
              onSelect={() => setCurrentScenario(scenario.id)}
              onToggleCompare={() => toggleCompare(scenario.id)}
              onFavorite={() => setFavorite(scenario.id)}
              onRemove={() => removeScenario(scenario.id)}
            />
          ))}

          {combined.map((scenario) => (
            <CombinedScenarioCard
              key={scenario.id}
              scenario={scenario}
              selected={scenario.id === currentScenarioId}
              onSelect={() => setCurrentScenario(scenario.id)}
            />
          ))}

          <button
            type="button"
            data-testid="scenario-new-button"
            onClick={onCreateRequest}
            style={{
              padding: "0.55rem 0.65rem",
              borderRadius: "0.45rem",
              border: `1px dashed #7A5AF8`,
              background: "rgba(122, 90, 248, 0.08)",
              color: "#BDB4FE",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "0.78rem",
              fontWeight: 550,
            }}
          >
            + New Scenario
          </button>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            <ToolButton
              testId="scenario-open-comparison"
              label="Compare"
              onClick={() => setShowComparison(true)}
            />
            <ToolButton
              testId="scenario-open-ranking"
              label="Rank"
              onClick={() => setShowRanking(true)}
            />
            {canCombine ? (
              <ToolButton
                testId="scenario-combine"
                label="Combine"
                onClick={() =>
                  combineScenarios(compareIds[0]!, compareIds[1]!)
                }
              />
            ) : null}
            {compareIds.length > 0 ? (
              <ToolButton
                testId="scenario-clear-compare"
                label="Clear"
                onClick={clearCompare}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {!explorerCollapsed ? (
        <div
          role="separator"
          aria-orientation="vertical"
          data-testid="scenario-explorer-resize"
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

function ToolButton({
  testId,
  label,
  onClick,
}: {
  readonly testId: string;
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      style={{
        padding: "0.3rem 0.5rem",
        borderRadius: "999px",
        border: `1px solid ${cockpit.border}`,
        background: "transparent",
        color: cockpit.accent,
        fontSize: "0.62rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}
