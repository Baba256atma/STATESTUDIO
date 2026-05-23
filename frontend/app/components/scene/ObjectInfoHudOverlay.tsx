"use client";

import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import type { ObjectInfoHudModel } from "../../lib/scene/objectInfoHudTypes";
import type { EditableObjectPatch } from "../../lib/modeling/objectEditingRuntime";
import type { PropagationPathPatch } from "../../lib/propagation/propagationAuthoringRuntime";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { resolveSceneObjectHudPosition } from "../../lib/scene/resolveSceneObjectHudPosition";
import {
  logObjectDeselected,
  logObjectHudMounted,
  logObjectHudPositionResolved,
  logObjectHudUpdated,
  logObjectSelected,
} from "../../lib/ui/objectInfoHudInstrumentation";
import type { PanelSizeMode } from "../../lib/ui/workspaceLayoutTypes";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";
import { ObjectInfoHud } from "./ObjectInfoHud";

export type ObjectInfoHudOverlayProps = {
  model: ObjectInfoHudModel;
  sceneJson: unknown;
  themeMode?: NexoraHudThemeMode;
  onCreateRelationship?: () => void;
  onDeleteRelationship?: (relationshipId: string) => void;
  onCreateImpactPath?: (sourceObjectId?: string | null) => void;
  onEditPropagationPath?: (pathId: string, patch: PropagationPathPatch) => void;
  onDeletePropagationPath?: (pathId: string) => void;
  onEditObject?: (objectId: string, patch: EditableObjectPatch) => void;
  onDuplicateObject?: (objectId: string) => void;
  onDeleteObject?: (objectId: string) => void;
};

function ObjectInfoHudAnchor(props: {
  position: [number, number, number];
  objectId: string;
  model: ObjectInfoHudModel;
  themeMode?: NexoraHudThemeMode;
  panelSizeMode: PanelSizeMode;
  onCreateRelationship?: () => void;
  onDeleteRelationship?: (relationshipId: string) => void;
  onCreateImpactPath?: (sourceObjectId?: string | null) => void;
  onEditPropagationPath?: (pathId: string, patch: PropagationPathPatch) => void;
  onDeletePropagationPath?: (pathId: string) => void;
  onEditObject?: (objectId: string, patch: EditableObjectPatch) => void;
  onDuplicateObject?: (objectId: string) => void;
  onDeleteObject?: (objectId: string) => void;
}): React.ReactElement {
  const { camera, size } = useThree();
  const [screenOffset, setScreenOffset] = React.useState<{ x: number; side: "left" | "right" }>({
    x: 18,
    side: "right",
  });
  const lastSideRef = React.useRef<string | null>(null);

  useFrame(() => {
    const projected = new THREE.Vector3(...props.position).project(camera);
    const sx = (projected.x * 0.5 + 0.5) * size.width;
    const preferRight = sx < size.width * 0.58;
    const side: "left" | "right" = preferRight ? "right" : "left";
    const x = preferRight ? 18 : -268;
    if (lastSideRef.current !== side) {
      lastSideRef.current = side;
      setScreenOffset({ x, side });
      logObjectHudPositionResolved({ side, objectId: props.objectId });
    }
  });

  return (
    <Html position={props.position} transform={false} style={{ pointerEvents: "none" }}>
      <div
        style={{
          transform: `translate(${screenOffset.x}px, -42%)`,
          pointerEvents: "none",
        }}
      >
        <ObjectInfoHud
          {...props.model}
          themeMode={props.themeMode}
          panelSizeMode={props.panelSizeMode}
          onCreateRelationship={props.onCreateRelationship}
          onDeleteRelationship={props.onDeleteRelationship}
          onCreateImpactPath={props.onCreateImpactPath}
          onEditPropagationPath={props.onEditPropagationPath}
          onDeletePropagationPath={props.onDeletePropagationPath}
          onEditObject={props.onEditObject}
          onDuplicateObject={props.onDuplicateObject}
          onDeleteObject={props.onDeleteObject}
        />
      </div>
    </Html>
  );
}

export function ObjectInfoHudOverlay(props: ObjectInfoHudOverlayProps): React.ReactElement {
  const mountedRef = React.useRef(false);
  const lastObjectIdRef = React.useRef<string | null>(null);
  const { hudStyle, getHudPlacement } = useWorkspaceLayout();
  const placement = getHudPlacement("objectInfoHud");
  const selectedObjectId = props.model.selectedObjectId?.trim() || null;
  const anchorPosition = React.useMemo(
    () => resolveSceneObjectHudPosition(props.sceneJson, selectedObjectId),
    [props.sceneJson, selectedObjectId]
  );

  React.useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logObjectHudMounted();
  }, []);

  React.useEffect(() => {
    const previousId = lastObjectIdRef.current;
    if (previousId === selectedObjectId) return;

    if (!selectedObjectId && previousId) {
      logObjectDeselected();
    } else if (selectedObjectId && !previousId) {
      logObjectSelected({ objectId: selectedObjectId });
    } else if (selectedObjectId && previousId && selectedObjectId !== previousId) {
      logObjectHudUpdated({ objectId: selectedObjectId });
    }

    lastObjectIdRef.current = selectedObjectId;
  }, [selectedObjectId]);

  if (!placement.visible) return <></>;

  if (!selectedObjectId) {
    return (
      <Html transform={false} fullscreen style={{ pointerEvents: "none" }}>
        <div style={hudStyle("objectInfoHud")}>
          <ObjectInfoHud
            {...props.model}
            themeMode={props.themeMode}
            panelSizeMode={placement.sizeMode}
            onCreateRelationship={props.onCreateRelationship}
            onDeleteRelationship={props.onDeleteRelationship}
            onCreateImpactPath={props.onCreateImpactPath}
            onEditPropagationPath={props.onEditPropagationPath}
            onDeletePropagationPath={props.onDeletePropagationPath}
            onEditObject={props.onEditObject}
            onDuplicateObject={props.onDuplicateObject}
            onDeleteObject={props.onDeleteObject}
          />
        </div>
      </Html>
    );
  }

  if (!anchorPosition || placement.anchor === "top-left") {
    return (
      <Html transform={false} fullscreen style={{ pointerEvents: "none" }}>
        <div style={hudStyle("objectInfoHud")}>
          <ObjectInfoHud
            {...props.model}
            themeMode={props.themeMode}
            panelSizeMode={placement.sizeMode}
            onCreateRelationship={props.onCreateRelationship}
            onDeleteRelationship={props.onDeleteRelationship}
            onCreateImpactPath={props.onCreateImpactPath}
            onEditPropagationPath={props.onEditPropagationPath}
            onDeletePropagationPath={props.onDeletePropagationPath}
            onEditObject={props.onEditObject}
            onDuplicateObject={props.onDuplicateObject}
            onDeleteObject={props.onDeleteObject}
          />
        </div>
      </Html>
    );
  }

  return (
    <ObjectInfoHudAnchor
      position={anchorPosition}
      objectId={selectedObjectId}
      model={props.model}
      themeMode={props.themeMode}
      panelSizeMode={placement.sizeMode}
      onCreateRelationship={props.onCreateRelationship}
      onDeleteRelationship={props.onDeleteRelationship}
      onCreateImpactPath={props.onCreateImpactPath}
      onEditPropagationPath={props.onEditPropagationPath}
      onDeletePropagationPath={props.onDeletePropagationPath}
      onEditObject={props.onEditObject}
      onDuplicateObject={props.onDuplicateObject}
      onDeleteObject={props.onDeleteObject}
    />
  );
}

export default ObjectInfoHudOverlay;
