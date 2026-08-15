"use client";

/**
 * STAGE-MOTION:1 — syncs frozen final targets once per layout commit
 * and advances the single motion authority each frame.
 */

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPContextNodePresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  type ExecutiveStageMotionTargetEntry,
  setExecutiveStageMotionReducedMotion,
  setExecutiveStageMotionDebugTrace,
  syncExecutiveStageMotionTargets,
  advanceExecutiveStageMotion,
  writeExecutiveStageMotionObservabilityToHost,
  registerExecutiveStageMotionLivePositionReader,
} from "@/app/lib/spatial-presentation/executiveStageMotion";
import { readExecutiveStage2DLivePosition } from "./executiveStage2DLivePositions";

type Props = {
  readonly objects: readonly NexoraMVPStageObjectPresentation[];
  readonly contextNodes?: readonly NexoraMVPContextNodePresentation[];
  readonly anchorObjectId: string | null;
};

function resolveHost(): Element | null {
  if (typeof document === "undefined") return null;
  return document.querySelector('[data-testid="nexora-3d-executive-stage"]');
}

export function NexoraStageMotionController({
  objects,
  contextNodes = [],
  anchorObjectId,
}: Props) {
  const reducedMotionApplied = useRef(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setExecutiveStageMotionDebugTrace(params.get("stageMotionTrace") === "1");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setExecutiveStageMotionReducedMotion(mq.matches);
    apply();
    reducedMotionApplied.current = true;
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    registerExecutiveStageMotionLivePositionReader((objectId) => {
      const live = readExecutiveStage2DLivePosition(objectId);
      return live ? ([live[0], live[1], live[2]] as const) : null;
    });
    return () => registerExecutiveStageMotionLivePositionReader(null);
  }, []);

  const targetMap = useMemo(() => {
    const map = new Map<string, ExecutiveStageMotionTargetEntry>();
    for (const object of objects) {
      const visible =
        object.disclosureState !== "hidden" && object.opacity > 0.04;
      map.set(
        object.id,
        Object.freeze({
          position: Object.freeze([
            object.targetPosition[0],
            object.targetPosition[1],
            object.targetPosition[2],
          ] as const),
          visible,
          opacity: visible ? object.opacity : 0,
          scale: object.scale,
        }),
      );
    }
    for (const node of contextNodes) {
      const visible = node.opacity > 0.04;
      map.set(
        node.id,
        Object.freeze({
          position: Object.freeze([
            node.targetPosition[0],
            node.targetPosition[1],
            node.targetPosition[2],
          ] as const),
          visible,
          opacity: node.opacity,
          scale: node.scale,
        }),
      );
      if (node.subjectId !== node.id) {
        map.set(
          node.subjectId,
          Object.freeze({
            position: Object.freeze([
              node.targetPosition[0],
              node.targetPosition[1],
              node.targetPosition[2],
            ] as const),
            visible,
            opacity: node.opacity,
            scale: node.scale,
          }),
        );
      }
    }
    return map;
  }, [objects, contextNodes]);

  useLayoutEffect(() => {
    syncExecutiveStageMotionTargets({
      targets: targetMap,
      anchorObjectId,
      nowMs: typeof performance !== "undefined" ? performance.now() : Date.now(),
    });
    writeExecutiveStageMotionObservabilityToHost(resolveHost());
  }, [targetMap, anchorObjectId]);

  useFrame(() => {
    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    advanceExecutiveStageMotion(now);
    writeExecutiveStageMotionObservabilityToHost(resolveHost());
  });

  return null;
}
