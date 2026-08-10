"use client";

import { Canvas } from "@react-three/fiber";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type { NexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
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
  return (
    <Canvas
      data-testid="nexora-stage-canvas"
      frameloop="always"
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{
        position: [...presentation.scene.camera.position],
        fov: presentation.scene.camera.fov,
        near: 0.1,
        far: 80,
      }}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        touchAction: "none",
      }}
      onPointerMissed={onClearSelection}
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
