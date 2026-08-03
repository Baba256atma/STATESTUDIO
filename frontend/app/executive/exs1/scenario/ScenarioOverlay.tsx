"use client";

import { SCENARIO_TRANSITION_MS } from "./ScenarioConfig";
import { ScenarioBadge } from "./ScenarioBadge";
import { useScenarioExperience } from "./hooks/useScenarioExperience";

/**
 * ScenarioOverlay — halos, comparison borders, difference indicators (mock).
 */
export function ScenarioOverlay() {
  const {
    isActive,
    currentScenario,
    compareIds,
    scenarios,
  } = useScenarioExperience();

  if (!isActive) return null;

  const compareScenarios = scenarios.filter((s) => compareIds.includes(s.id));
  const multi = compareScenarios.length >= 2;
  const accent = currentScenario?.color ?? "#7A5AF8";

  return (
    <div
      data-testid="scenario-overlay"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        transition: `opacity ${SCENARIO_TRANSITION_MS}ms ease`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: multi
            ? `radial-gradient(45% 50% at 30% 40%, ${compareScenarios[0]?.color ?? accent}22 0%, transparent 70%),
               radial-gradient(45% 50% at 70% 55%, ${compareScenarios[1]?.color ?? accent}22 0%, transparent 70%)`
            : `radial-gradient(60% 55% at 50% 42%, ${accent}20 0%, transparent 72%)`,
          transition: "background 250ms ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "0.75rem",
          borderRadius: "0.75rem",
          border: multi
            ? `1px dashed ${compareScenarios[0]?.color ?? accent}66`
            : `1px solid ${accent}44`,
          boxShadow: multi
            ? `inset 0 0 0 1px ${compareScenarios[1]?.color ?? accent}33`
            : `inset 0 0 40px ${accent}10`,
          transition: "border-color 250ms ease, box-shadow 250ms ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "1rem",
          top: "3.6rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.35rem",
        }}
      >
        {currentScenario ? (
          <ScenarioBadge
            label={`${currentScenario.name} · Selected`}
            color={currentScenario.color}
            selected
          />
        ) : null}
        {multi ? (
          <ScenarioBadge label="Comparison Active" color="#BDB4FE" />
        ) : null}
        <span
          data-testid="scenario-difference-indicator"
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#A48AFB",
            background: "rgba(10,14,20,0.55)",
            border: "1px solid rgba(122,90,248,0.35)",
            borderRadius: "0.3rem",
            padding: "0.25rem 0.45rem",
          }}
        >
          {multi
            ? "Difference indicators · mock"
            : "Scenario halo · mock"}
        </span>
      </div>
    </div>
  );
}
