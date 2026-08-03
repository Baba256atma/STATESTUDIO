"use client";

import { useEffect, useMemo, useState } from "react";
import { useScenarioExperience } from "../../scenario/hooks/useScenarioExperience";
import {
  IMPACT_TRANSITION_MS,
  getScenarioImpactStory,
  type ScenarioImpactStory,
} from "../ScenarioImpactConfig";

/**
 * Scenario Impact hook — active only in Scenario mode with a selected scenario.
 * Pure UI orchestration. No runtime propagation.
 */
export function useScenarioImpact() {
  const {
    isActive: scenarioModeActive,
    currentScenario,
    currentScenarioId,
    compareIds,
    scenarios,
  } = useScenarioExperience();

  const isActive = scenarioModeActive && currentScenarioId != null;
  const primaryStory = useMemo(
    () => getScenarioImpactStory(currentScenarioId),
    [currentScenarioId],
  );

  const compareStories = useMemo(() => {
    if (compareIds.length < 2) return [] as ScenarioImpactStory[];
    return compareIds
      .map((id) => getScenarioImpactStory(id))
      .filter((s): s is ScenarioImpactStory => s != null);
  }, [compareIds]);

  const multiImpact = compareStories.length >= 2;

  const [propagationStep, setPropagationStep] = useState(0);
  const [rippleKey, setRippleKey] = useState(0);

  useEffect(() => {
    if (!isActive || !primaryStory) {
      setPropagationStep(0);
      return;
    }
    setPropagationStep(0);
    setRippleKey((k) => k + 1);
    const max = primaryStory.chain.length;
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      setPropagationStep(step);
      if (step >= max) clearInterval(timer);
    }, IMPACT_TRANSITION_MS);
    return () => clearInterval(timer);
  }, [isActive, primaryStory?.scenarioId]);

  const nodeByObjectId = useMemo(() => {
    const map = new Map<
      string,
      { story: ScenarioImpactStory; node: ScenarioImpactStory["chain"][number] }
    >();
    if (multiImpact) {
      for (const story of compareStories) {
        for (const node of story.chain) {
          if (!map.has(node.objectId)) {
            map.set(node.objectId, { story, node });
          }
        }
      }
    } else if (primaryStory) {
      for (const node of primaryStory.chain) {
        map.set(node.objectId, { story: primaryStory, node });
      }
    }
    return map;
  }, [multiImpact, compareStories, primaryStory]);

  return {
    isActive,
    scenarioModeActive,
    currentScenario,
    primaryStory,
    compareStories,
    multiImpact,
    propagationStep,
    rippleKey,
    nodeByObjectId,
    transitionMs: IMPACT_TRANSITION_MS,
  };
}
