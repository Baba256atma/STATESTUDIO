"use client";

import { Canvas } from "@react-three/fiber";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type { NexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import { resolveExecutiveStageFixedCamera } from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera";
import { shouldResetExecutiveStage2DToOverview } from "@/app/lib/spatial-presentation/executiveStage2DTopologyReadability";
import { NexoraStageScene } from "./NexoraStageScene";

type Props = {
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly environment: NexoraMVPSceneEnvironmentVisualState;
  readonly onSelectSubject: (subjectId: string) => void;
  readonly onClearSelection: () => void;
};

/**
 * Client-only R3F Canvas host for the Executive Stage.
 */
export function NexoraStageCanvas({
  presentation,
  environment,
  onSelectSubject,
  onClearSelection,
}: Props) {
  // STAGE-2D:1 — seed Canvas from the fixed camera; ignore presentation variance.
  const fixed = resolveExecutiveStageFixedCamera();
  const topologyMode =
    presentation.scene.mode === "focus" ? "anchored" : "overview";

  return (
    <Canvas
      data-testid="nexora-stage-canvas"
      data-stage-background-boundary="true"
      frameloop="always"
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{
        position: [fixed.position.x, fixed.position.y, fixed.position.z],
        fov: fixed.fov,
        near: fixed.near,
        far: fixed.far,
      }}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        touchAction: "none",
      }}
      onPointerMissed={() => {
        // STAGE-2D:4 — empty Stage only; objects/connections/context stopPropagation.
        if (
          !shouldResetExecutiveStage2DToOverview({
            source: "background",
            topologyMode,
            hitKind: "none",
          })
        ) {
          return;
        }
        onClearSelection();
      }}
    >
      <NexoraStageScene
        presentation={presentation}
        environment={environment}
        onSelectSubject={onSelectSubject}
        onClearSelection={onClearSelection}
      />
    </Canvas>
  );
}
