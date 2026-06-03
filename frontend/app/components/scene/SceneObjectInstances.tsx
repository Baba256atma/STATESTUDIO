"use client";

import React from "react";

import type { SceneObject } from "../../lib/sceneTypes";
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
  connectedToSelectedIds,
  relationshipExplorationActive = false,
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
        const isSelected = isSceneObjectSelected(selectedObjectId, stableId, objectKey);
        const connectedToSelected =
          relationshipExplorationActive &&
          (isSelected ||
            connectedToSelectedIds?.has(stableId) ||
            connectedToSelectedIds?.has(objectKey) === true);
        return (
          <AnimatableObject
            key={stableId}
            obj={object}
            index={index}
            anim={animMap.get(object.id)}
            {...plan}
            isSelected={isSelected}
            connectedToSelected={connectedToSelected}
            relationshipExplorationActive={relationshipExplorationActive}
            layoutPositions={layoutPositions}
            layoutLabelOffsets={layoutLabelOffsets}
            showObjectDebugLabels={showObjectDebugLabels}
            showExecutiveLayoutLabels={showExecutiveLayoutLabels}
            renderId={stableId}
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
    prev.relationshipExplorationActive === next.relationshipExplorationActive
  );
}

export const SceneObjectInstances = React.memo(
  SceneObjectInstancesComponent,
  sceneObjectInstancesPropsEqual
);
