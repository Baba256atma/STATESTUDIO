"use client";

import { EXS1_OBJECTS } from "../mock/exs1Mock";
import { ScenarioImpactAnimation } from "./ScenarioImpactAnimation";
import { ScenarioImpactNode } from "./ScenarioImpactNode";
import { ScenarioImpactPath } from "./ScenarioImpactPath";
import { useScenarioImpact } from "./hooks/useScenarioImpact";

/**
 * ScenarioPropagationView — paths, ripples, and impact node rings on Stage.
 */
export function ScenarioPropagationView() {
  const {
    isActive,
    primaryStory,
    compareStories,
    multiImpact,
    propagationStep,
    rippleKey,
  } = useScenarioImpact();

  if (!isActive || !primaryStory) return null;

  const stories = multiImpact ? compareStories : [primaryStory];

  return (
    <div
      data-testid="scenario-propagation-view"
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4 }}
    >
      {stories.map((story, storyIndex) => {
        const color =
          storyIndex === 0
            ? "#7A5AF8"
            : storyIndex === 1
              ? "#2E90FA"
              : "#12B76A";
        const rootId = story.chain[0]?.objectId;
        const rootObject =
          EXS1_OBJECTS.find((o) => o.id === rootId) ?? null;

        return (
          <div key={story.scenarioId}>
            <ScenarioImpactPath
              pathId={story.scenarioId}
              objects={EXS1_OBJECTS}
              chain={story.chain}
              color={color}
              propagationStep={
                story.scenarioId === primaryStory.scenarioId
                  ? propagationStep
                  : story.chain.length
              }
            />
            <ScenarioImpactAnimation
              rootObject={rootObject}
              color={color}
              rippleKey={rippleKey + storyIndex}
              active={story.scenarioId === primaryStory.scenarioId}
            />
            {story.chain.map((node) => {
              const object = EXS1_OBJECTS.find((o) => o.id === node.objectId);
              if (!object) return null;
              const active =
                story.scenarioId === primaryStory.scenarioId
                  ? propagationStep > node.order
                  : true;
              return (
                <ScenarioImpactNode
                  key={`${story.scenarioId}-${node.objectId}`}
                  object={object}
                  node={node}
                  color={color}
                  active={active}
                  dimmed={!active}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
