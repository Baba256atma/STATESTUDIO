"use client";

import React from "react";

import type { SceneObject } from "../../lib/sceneTypes";
import { AnimatableObject, type AnimatableObjectProps } from "./AnimatableObject";

export type SceneObjectInstancePlan = Omit<
  AnimatableObjectProps,
  "obj" | "renderId" | "index" | "key"
>;

export type SceneObjectInstancesProps = {
  stableObjects: SceneObject[];
  stableObjectIds: readonly string[];
  instancePlansById: ReadonlyMap<string, SceneObjectInstancePlan>;
  animMap: ReadonlyMap<string | undefined, AnimatableObjectProps["anim"]>;
};

function SceneObjectInstancesComponent({
  stableObjects,
  stableObjectIds,
  instancePlansById,
  animMap,
}: SceneObjectInstancesProps): React.ReactElement {
  return (
    <>
      {stableObjects.map((object, index) => {
        const stableId = stableObjectIds[index];
        if (!stableId) return null;
        const plan = instancePlansById.get(stableId);
        if (!plan) return null;
        return (
          <AnimatableObject
            key={stableId}
            obj={object}
            index={index}
            anim={animMap.get(object.id)}
            {...plan}
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
    prev.animMap === next.animMap
  );
}

export const SceneObjectInstances = React.memo(
  SceneObjectInstancesComponent,
  sceneObjectInstancesPropsEqual
);
