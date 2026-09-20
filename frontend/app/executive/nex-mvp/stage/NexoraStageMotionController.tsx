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
  setExecutiveStageMotionReducedMotion,
  setExecutiveStageMotionDebugTrace,
  syncExecutiveStageMotionTargets,
  advanceExecutiveStageMotion,
  writeExecutiveStageMotionObservabilityToHost,
  registerExecutiveStageMotionLivePositionReader,
} from "@/app/lib/spatial-presentation/executiveStageMotion";
import { projectStageProdSceneMotion } from "@/app/lib/stage-prod/stageProdSceneMotion.ts";
import {
  readExecutiveStage2DLivePosition,
  readExecutiveStageMotionLiveSamples,
} from "./executiveStage2DLivePositions";

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

  const sceneMotion = useMemo(() => {
    return projectStageProdSceneMotion({ objects, contextNodes });
  }, [objects, contextNodes]);

  useLayoutEffect(() => {
    syncExecutiveStageMotionTargets({
      targets: sceneMotion.targets,
      anchorObjectId,
      nowMs: typeof performance !== "undefined" ? performance.now() : Date.now(),
    });
    writeExecutiveStageMotionObservabilityToHost(
      resolveHost(),
      readExecutiveStageMotionLiveSamples(),
    );
  }, [sceneMotion, anchorObjectId]);

  useFrame(() => {
    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    advanceExecutiveStageMotion(now);
    writeExecutiveStageMotionObservabilityToHost(
      resolveHost(),
      readExecutiveStageMotionLiveSamples(),
    );
  });

  return null;
}
