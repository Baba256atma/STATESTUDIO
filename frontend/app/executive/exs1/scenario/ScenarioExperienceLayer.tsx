"use client";

import { ScenarioImpactLayer } from "../impact/ScenarioImpactLayer";
import { ScenarioComparisonPanel } from "./ScenarioComparisonPanel";
import { ScenarioExplorer } from "./ScenarioExplorer";
import { ScenarioOverlay } from "./ScenarioOverlay";
import { ScenarioRankingPanel } from "./ScenarioRankingPanel";
import { useScenarioExperience } from "./hooks/useScenarioExperience";

type Props = {
  readonly onCreateRequest: () => void;
};

/**
 * ScenarioExperienceLayer — Stage-local Scenario Engineering + Impact chrome.
 * Renders only when Executive Mode = Scenario.
 */
export function ScenarioExperienceLayer({ onCreateRequest }: Props) {
  const { isActive } = useScenarioExperience();
  if (!isActive) return null;

  return (
    <div
      data-testid="scenario-experience-layer"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 7,
        pointerEvents: "none",
      }}
    >
      <ScenarioOverlay />
      <ScenarioImpactLayer />
      <div style={{ pointerEvents: "auto" }}>
        <ScenarioExplorer onCreateRequest={onCreateRequest} />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <ScenarioComparisonPanel />
        <ScenarioRankingPanel />
      </div>
    </div>
  );
}
