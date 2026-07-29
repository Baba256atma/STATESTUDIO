import { useMemo } from "react";

import type { StrategicCouncilResult } from "../council/strategicCouncilTypes";
import type { ScenarioActionContract, DecisionPathResult } from "../simulation/scenarioActionTypes";
import type { PropagationOverlayState } from "../simulation/propagationTypes";
import {
  buildDecisionImpactSelection,
  mapDecisionImpact,
  summarizeDecisionImpact,
} from "./decisionImpactMapper";

import type { SceneJson } from "../sceneTypes";

type UseDecisionImpactParams = {
  propagation?: PropagationOverlayState | null;
  decisionPath?: DecisionPathResult | null;
  strategicAdvice?: unknown;
  strategicCouncil?: StrategicCouncilResult | null;
  scenarioAction?: ScenarioActionContract | null;
  sceneJson?: SceneJson | null;
  source?: string;
};

export function useDecisionImpact(params: UseDecisionImpactParams) {
  const impact = useMemo(
    () =>
      mapDecisionImpact({
        propagation: params.propagation ?? null,
        decisionPath: params.decisionPath ?? null,
        strategicAdvice: params.strategicAdvice ?? null,
        strategicCouncil: params.strategicCouncil ?? null,
        scenarioAction: params.scenarioAction ?? null,
        sceneJson: params.sceneJson ?? null,
        source: params.source,
      }),
    [params.decisionPath, params.propagation, params.scenarioAction, params.sceneJson, params.source, params.strategicAdvice, params.strategicCouncil]
  );

  const selection = useMemo(() => buildDecisionImpactSelection(impact), [impact]);
  const summary = useMemo(() => summarizeDecisionImpact(impact), [impact]);

  return {
    impact,
    selection,
    summary,
  };
}
