"use client";

import { SCENARIO_RANK_OPTIONS } from "./ScenarioConfig";
import { useScenarioExperience } from "./hooks/useScenarioExperience";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ScenarioRankingPanel — presentation-only sort of mock scenarios.
 */
export function ScenarioRankingPanel() {
  const {
    showRanking,
    setShowRanking,
    rankSort,
    setRankSort,
    rankedScenarios,
    setCurrentScenario,
    currentScenarioId,
  } = useScenarioExperience();

  if (!showRanking) return null;

  return (
    <div
      data-testid="scenario-ranking-panel"
      style={{
        position: "absolute",
        right: "1rem",
        bottom: "1rem",
        width: "min(16rem, calc(100% - 2rem))",
        zIndex: 9,
        borderRadius: "0.55rem",
        border: `1px solid ${cockpit.borderStrong}`,
        background: "rgba(10, 14, 20, 0.92)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.55rem 0.7rem",
          borderBottom: `1px solid ${cockpit.border}`,
        }}
      >
        <strong
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Scenario Ranking
        </strong>
        <button
          type="button"
          data-testid="scenario-ranking-close"
          onClick={() => setShowRanking(false)}
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
          ×
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.3rem",
          padding: "0.55rem 0.65rem",
        }}
      >
        {SCENARIO_RANK_OPTIONS.map((option) => {
          const active = option.id === rankSort;
          return (
            <button
              key={option.id}
              type="button"
              data-testid={`scenario-rank-${option.id}`}
              onClick={() => setRankSort(option.id)}
              style={{
                padding: "0.28rem 0.45rem",
                borderRadius: "999px",
                border: active
                  ? `1px solid ${cockpit.borderStrong}`
                  : `1px solid ${cockpit.border}`,
                background: active ? cockpit.accentSoft : "transparent",
                color: active ? cockpit.accent : cockpit.muted,
                fontSize: "0.58rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <ol
        style={{
          margin: 0,
          padding: "0 0.65rem 0.7rem",
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        {rankedScenarios.map((scenario, index) => {
          const selected = scenario.id === currentScenarioId;
          return (
            <li key={scenario.id}>
              <button
                type="button"
                data-testid={`scenario-rank-item-${scenario.id}`}
                onClick={() => setCurrentScenario(scenario.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.4rem 0.45rem",
                  borderRadius: "0.35rem",
                  border: selected
                    ? `1px solid ${scenario.color}`
                    : `1px solid transparent`,
                  background: selected ? `${scenario.color}18` : "transparent",
                  color: cockpit.text,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span style={{ color: cockpit.lowMuted, fontSize: "0.68rem" }}>
                  {index + 1}
                </span>
                <span
                  aria-hidden
                  style={{
                    width: "0.45rem",
                    height: "0.45rem",
                    borderRadius: "999px",
                    background: scenario.color,
                  }}
                />
                <span style={{ fontSize: "0.74rem", flex: 1 }}>
                  {scenario.name}
                </span>
                <span style={{ fontSize: "0.66rem", color: cockpit.muted }}>
                  ROI {scenario.roi}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
