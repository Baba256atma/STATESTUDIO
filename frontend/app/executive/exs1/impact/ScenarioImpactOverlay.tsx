"use client";

import { useScenarioImpact } from "./hooks/useScenarioImpact";

/**
 * ScenarioImpactOverlay — pulse paths, risk/opportunity glow (mock).
 */
export function ScenarioImpactOverlay() {
  const { isActive, primaryStory, multiImpact, compareStories } =
    useScenarioImpact();

  if (!isActive || !primaryStory) return null;

  const accent = multiImpact
    ? (compareStories[0] ? "#7A5AF8" : "#7A5AF8")
    : "#7A5AF8";
  const riskGlow = "rgba(240, 68, 56, 0.14)";
  const opportunityGlow = "rgba(18, 183, 106, 0.14)";

  return (
    <div
      data-testid="scenario-impact-overlay"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        background: multiImpact
          ? `radial-gradient(40% 45% at 28% 38%, ${riskGlow} 0%, transparent 70%),
             radial-gradient(40% 45% at 72% 58%, ${opportunityGlow} 0%, transparent 70%)`
          : `radial-gradient(55% 50% at 50% 42%, ${accent}18 0%, transparent 72%)`,
        transition: "background 250ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "1.15rem",
          bottom: "1rem",
          padding: "0.3rem 0.55rem",
          borderRadius: "0.35rem",
          border: "1px solid rgba(122, 90, 248, 0.4)",
          background: "rgba(8, 12, 18, 0.55)",
          color: "#BDB4FE",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {multiImpact ? "Dual impact · mock paths" : "Impact flow · mock"}
      </div>
    </div>
  );
}
