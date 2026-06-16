"use client";

import React from "react";

import type { SceneObject } from "../../lib/sceneTypes";
import type { SvieObjectHealthVisualStyle } from "../../lib/scene/svie/svieHealthVisualizationContract.ts";
import type { SvieObjectRiskHotspotVisualStyle } from "../../lib/scene/svie/svieRiskHotspotVisualizationContract.ts";
import type { SvieCauseChainNodeVisualStyle } from "../../lib/scene/svie/svieCauseChainVisualizationContract.ts";
import type { SvieRecommendationNodeVisualStyle } from "../../lib/scene/svie/svieRecommendationVisualizationContract.ts";
import type { SvieConfidenceNodeVisualStyle } from "../../lib/scene/svie/svieConfidenceVisualizationContract.ts";
import type { SvieExecutiveStoryNodeVisualStyle } from "../../lib/scene/svie/svieExecutiveStoryLayerContract.ts";
import type { SvieFutureStateNodeVisualStyle } from "../../lib/scene/svie/svieFutureStateVisualizationContract.ts";
import type { SvieScenarioDeltaNodeVisualStyle } from "../../lib/scene/svie/svieScenarioDeltaVisualizationContract.ts";
import type { SvieScenarioImpactChainNodeVisualStyle } from "../../lib/scene/svie/svieScenarioImpactChainContract.ts";
import type { SvieScenarioComparisonNodeVisualStyle } from "../../lib/scene/svie/svieScenarioComparisonLayerContract.ts";
import type { SvieScenarioConfidenceNodeVisualStyle } from "../../lib/scene/svie/svieScenarioConfidenceLayerContract.ts";
import type { SvieExecutiveFutureStoryNodeVisualStyle } from "../../lib/scene/svie/svieExecutiveFutureStoryLayerContract.ts";
import { AnimatableObject, type AnimatableObjectProps } from "./AnimatableObject";
import { isSceneObjectSelected } from "../../lib/scene/selectedSceneObjectRuntime";

export type SceneObjectInstancePlan = Omit<
  AnimatableObjectProps,
  "obj" | "renderId" | "index" | "key"
>;

export type SceneObjectInstancesProps = {
  stableObjects: SceneObject[];
  stableObjectIds: readonly string[];
  instancePlansById: ReadonlyMap<string, SceneObjectInstancePlan>;
  animMap: ReadonlyMap<string | undefined, AnimatableObjectProps["anim"]>;
  layoutPositions?: Record<string, [number, number, number]>;
  layoutLabelOffsets?: Record<string, { y: number; opacity: number }>;
  showObjectDebugLabels?: boolean;
  showExecutiveLayoutLabels?: boolean;
  selectedObjectId?: string | null;
  connectedToSelectedIds?: ReadonlySet<string>;
  relationshipExplorationActive?: boolean;
  svieHealthVisualByObjectId?: Readonly<Record<string, SvieObjectHealthVisualStyle>>;
  svieRiskHotspotVisualByObjectId?: Readonly<Record<string, SvieObjectRiskHotspotVisualStyle>>;
  svieCauseChainNodeVisualByObjectId?: Readonly<Record<string, SvieCauseChainNodeVisualStyle>>;
  svieRecommendationNodeVisualByObjectId?: Readonly<Record<string, SvieRecommendationNodeVisualStyle>>;
  svieConfidenceNodeVisualByObjectId?: Readonly<Record<string, SvieConfidenceNodeVisualStyle>>;
  svieExecutiveStoryNodeVisualByObjectId?: Readonly<Record<string, SvieExecutiveStoryNodeVisualStyle>>;
  svieFutureStateNodeVisualByObjectId?: Readonly<Record<string, SvieFutureStateNodeVisualStyle>>;
  svieScenarioDeltaNodeVisualByObjectId?: Readonly<Record<string, SvieScenarioDeltaNodeVisualStyle>>;
  svieScenarioImpactNodeVisualByObjectId?: Readonly<Record<string, SvieScenarioImpactChainNodeVisualStyle>>;
  svieScenarioComparisonNodeVisualByObjectId?: Readonly<Record<string, SvieScenarioComparisonNodeVisualStyle>>;
  svieScenarioConfidenceNodeVisualByObjectId?: Readonly<Record<string, SvieScenarioConfidenceNodeVisualStyle>>;
  svieExecutiveFutureStoryNodeVisualByObjectId?: Readonly<Record<string, SvieExecutiveFutureStoryNodeVisualStyle>>;
};

const loggedLayoutPassThroughSignatures = new Set<string>();

function readObjectLayoutPosition(
  object: SceneObject,
  stableId: string,
  layoutPositions?: Record<string, [number, number, number]>
): [number, number, number] | undefined {
  return (
    layoutPositions?.[stableId] ??
    (object.id ? layoutPositions?.[String(object.id)] : undefined) ??
    (object.name ? layoutPositions?.[String(object.name)] : undefined)
  );
}

function logLayoutPassThroughOnce(input: {
  stableObjects: SceneObject[];
  stableObjectIds: readonly string[];
  instancePlansById: ReadonlyMap<string, SceneObjectInstancePlan>;
  layoutPositions?: Record<string, [number, number, number]>;
}) {
  if (process.env.NODE_ENV === "production") return;
  const layoutPositionCount = input.layoutPositions ? Object.keys(input.layoutPositions).length : 0;
  const missingLayoutPositionIds = input.stableObjects
    .map((object, index) => input.stableObjectIds[index] ?? String(object.id ?? object.name ?? `obj:${index}`))
    .filter((stableId, index) => !readObjectLayoutPosition(input.stableObjects[index], stableId, input.layoutPositions));
  const signature = JSON.stringify({
    objectIds: input.stableObjectIds,
    planCount: input.instancePlansById.size,
    layoutPositionCount,
    missingLayoutPositionIds,
  });
  if (loggedLayoutPassThroughSignatures.has(signature)) return;
  loggedLayoutPassThroughSignatures.add(signature);
  console.log("[Nexora][SceneObjectInstances][LayoutPassThrough]", {
    stableObjectsLength: input.stableObjects.length,
    instancePlansByIdSize: input.instancePlansById.size,
    layoutPositionCount,
    missingLayoutPositionIds,
  });
}

function SceneObjectInstancesComponent({
  stableObjects,
  stableObjectIds,
  instancePlansById,
  animMap,
  layoutPositions,
  layoutLabelOffsets,
  showObjectDebugLabels,
  showExecutiveLayoutLabels,
  selectedObjectId = null,
  connectedToSelectedIds: _connectedToSelectedIds,
  relationshipExplorationActive: _relationshipExplorationActive = false,
  svieHealthVisualByObjectId,
  svieRiskHotspotVisualByObjectId,
  svieCauseChainNodeVisualByObjectId,
  svieRecommendationNodeVisualByObjectId,
  svieConfidenceNodeVisualByObjectId,
  svieExecutiveStoryNodeVisualByObjectId,
  svieFutureStateNodeVisualByObjectId,
  svieScenarioDeltaNodeVisualByObjectId,
  svieScenarioImpactNodeVisualByObjectId,
  svieScenarioComparisonNodeVisualByObjectId,
  svieScenarioConfidenceNodeVisualByObjectId,
  svieExecutiveFutureStoryNodeVisualByObjectId,
}: SceneObjectInstancesProps): React.ReactElement {
  logLayoutPassThroughOnce({
    stableObjects,
    stableObjectIds,
    instancePlansById,
    layoutPositions,
  });

  return (
    <>
      {stableObjects.map((object, index) => {
        const stableId = stableObjectIds[index];
        if (!stableId) return null;
        const plan = instancePlansById.get(stableId);
        if (!plan) return null;
        const objectKey = String(object.id ?? object.name ?? stableId);
        const isCanonicalSelected = isSceneObjectSelected(selectedObjectId, stableId, objectKey);
        return (
          <AnimatableObject
            key={stableId}
            obj={object}
            index={index}
            anim={animMap.get(object.id)}
            {...plan}
            isSelected={isCanonicalSelected}
            canonicalSelectedId={selectedObjectId ?? null}
            connectedToSelected={false}
            relationshipExplorationActive={false}
            layoutPositions={layoutPositions}
            layoutLabelOffsets={layoutLabelOffsets}
            showObjectDebugLabels={showObjectDebugLabels}
            showExecutiveLayoutLabels={showExecutiveLayoutLabels}
            renderId={stableId}
            svieHealthVisual={svieHealthVisualByObjectId?.[stableId] ?? svieHealthVisualByObjectId?.[objectKey]}
            svieRiskHotspotVisual={
              svieRiskHotspotVisualByObjectId?.[stableId] ?? svieRiskHotspotVisualByObjectId?.[objectKey]
            }
            svieCauseChainNodeVisual={
              svieCauseChainNodeVisualByObjectId?.[stableId] ??
              svieCauseChainNodeVisualByObjectId?.[objectKey]
            }
            svieRecommendationNodeVisual={
              svieRecommendationNodeVisualByObjectId?.[stableId] ??
              svieRecommendationNodeVisualByObjectId?.[objectKey]
            }
            svieConfidenceNodeVisual={
              svieConfidenceNodeVisualByObjectId?.[stableId] ??
              svieConfidenceNodeVisualByObjectId?.[objectKey]
            }
            svieExecutiveStoryNodeVisual={
              svieExecutiveStoryNodeVisualByObjectId?.[stableId] ??
              svieExecutiveStoryNodeVisualByObjectId?.[objectKey]
            }
            svieFutureStateNodeVisual={
              svieFutureStateNodeVisualByObjectId?.[stableId] ??
              svieFutureStateNodeVisualByObjectId?.[objectKey]
            }
            svieScenarioDeltaNodeVisual={
              svieScenarioDeltaNodeVisualByObjectId?.[stableId] ??
              svieScenarioDeltaNodeVisualByObjectId?.[objectKey]
            }
            svieScenarioImpactNodeVisual={
              svieScenarioImpactNodeVisualByObjectId?.[stableId] ??
              svieScenarioImpactNodeVisualByObjectId?.[objectKey]
            }
            svieScenarioComparisonNodeVisual={
              svieScenarioComparisonNodeVisualByObjectId?.[stableId] ??
              svieScenarioComparisonNodeVisualByObjectId?.[objectKey]
            }
            svieScenarioConfidenceNodeVisual={
              svieScenarioConfidenceNodeVisualByObjectId?.[stableId] ??
              svieScenarioConfidenceNodeVisualByObjectId?.[objectKey]
            }
            svieExecutiveFutureStoryNodeVisual={
              svieExecutiveFutureStoryNodeVisualByObjectId?.[stableId] ??
              svieExecutiveFutureStoryNodeVisualByObjectId?.[objectKey]
            }
          />
        );
      })}
    </>
  );
}

function sceneObjectInstancesPropsEqual(
  prev: SceneObjectInstancesProps,
  next: SceneObjectInstancesProps
): boolean {
  return (
    prev.stableObjects === next.stableObjects &&
    prev.stableObjectIds === next.stableObjectIds &&
    prev.instancePlansById === next.instancePlansById &&
    prev.animMap === next.animMap &&
    prev.layoutPositions === next.layoutPositions &&
    prev.layoutLabelOffsets === next.layoutLabelOffsets &&
    prev.showObjectDebugLabels === next.showObjectDebugLabels &&
    prev.showExecutiveLayoutLabels === next.showExecutiveLayoutLabels &&
    prev.selectedObjectId === next.selectedObjectId &&
    prev.connectedToSelectedIds === next.connectedToSelectedIds &&
    prev.relationshipExplorationActive === next.relationshipExplorationActive &&
    prev.svieHealthVisualByObjectId === next.svieHealthVisualByObjectId &&
    prev.svieRiskHotspotVisualByObjectId === next.svieRiskHotspotVisualByObjectId &&
    prev.svieCauseChainNodeVisualByObjectId === next.svieCauseChainNodeVisualByObjectId &&
    prev.svieRecommendationNodeVisualByObjectId === next.svieRecommendationNodeVisualByObjectId &&
    prev.svieConfidenceNodeVisualByObjectId === next.svieConfidenceNodeVisualByObjectId &&
    prev.svieExecutiveStoryNodeVisualByObjectId === next.svieExecutiveStoryNodeVisualByObjectId &&
    prev.svieFutureStateNodeVisualByObjectId === next.svieFutureStateNodeVisualByObjectId &&
    prev.svieScenarioDeltaNodeVisualByObjectId === next.svieScenarioDeltaNodeVisualByObjectId &&
    prev.svieScenarioImpactNodeVisualByObjectId === next.svieScenarioImpactNodeVisualByObjectId &&
    prev.svieScenarioComparisonNodeVisualByObjectId === next.svieScenarioComparisonNodeVisualByObjectId &&
    prev.svieScenarioConfidenceNodeVisualByObjectId === next.svieScenarioConfidenceNodeVisualByObjectId &&
    prev.svieExecutiveFutureStoryNodeVisualByObjectId === next.svieExecutiveFutureStoryNodeVisualByObjectId
  );
}

export const SceneObjectInstances = React.memo(
  SceneObjectInstancesComponent,
  sceneObjectInstancesPropsEqual
);
