"use client";

import { ScenarioImpactOverlay } from "./ScenarioImpactOverlay";
import { ScenarioImpactStoryPanel } from "./ScenarioImpactStoryPanel";
import { ScenarioPropagationView } from "./ScenarioPropagationView";
import { useScenarioImpact } from "./hooks/useScenarioImpact";

/**
 * ScenarioImpactLayer — executive impact visualization on Stage.
 * Activates only when Scenario mode + scenario selected.
 */
export function ScenarioImpactLayer() {
  const { isActive } = useScenarioImpact();
  if (!isActive) return null;

  return (
    <div
      data-testid="scenario-impact-layer"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 6,
        pointerEvents: "none",
      }}
    >
      <ScenarioImpactOverlay />
      <ScenarioPropagationView />
      <div style={{ pointerEvents: "auto" }}>
        <ScenarioImpactStoryPanel />
      </div>
    </div>
  );
}
