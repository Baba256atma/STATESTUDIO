"use client";

import { useMemo, useState } from "react";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type { NexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import { NexoraSceneEnvironmentController } from "../workspace/NexoraSceneEnvironmentController";
import { NexoraStageCameraController } from "./NexoraStageCameraController";
import { NexoraStageConnections } from "./NexoraStageConnections";
import { NexoraStageContextNodes } from "./NexoraStageContextNodes";
import { NexoraStageObject } from "./NexoraStageObject";

type Props = {
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly environment: NexoraMVPSceneEnvironmentVisualState;
  readonly onSelectSubject: (subjectId: string) => void;
  readonly onClearSelection: () => void;
};

/**
 * Canonical Stage scene graph — presentation consumer only.
 */
export function NexoraStageScene({
  presentation,
  environment,
  onSelectSubject,
  onClearSelection,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scene = presentation.scene;

  const allConnections = useMemo(
    () =>
      [...scene.connections, ...presentation.contextConnections].map(
        (connection) =>
          Object.freeze({
            ...connection,
            opacity: Math.min(
              1,
              connection.opacity * environment.connectionEmphasis,
            ),
          }),
      ),
    [
      scene.connections,
      presentation.contextConnections,
      environment.connectionEmphasis,
    ],
  );

  return (
    <>
      <NexoraSceneEnvironmentController
        environment={environment}
        onClearSelection={onClearSelection}
      />

      <NexoraStageConnections
        connections={allConnections}
        objects={scene.objects}
        contextNodes={presentation.contextNodes}
      />

      {scene.objects.map((object) => (
        <NexoraStageObject
          key={object.id}
          presentation={object}
          hoveredId={hoveredId}
          onSelect={onSelectSubject}
          onHover={setHoveredId}
        />
      ))}

      <NexoraStageContextNodes
        nodes={presentation.contextNodes}
        hoveredId={hoveredId}
        onSelect={onSelectSubject}
        onHover={setHoveredId}
      />

      <NexoraStageCameraController camera={scene.camera} />
    </>
  );
}
