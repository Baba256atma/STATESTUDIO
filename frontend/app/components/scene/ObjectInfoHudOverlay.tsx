"use client";

import React from "react";

import type { ObjectInfoHudModel } from "../../lib/scene/objectInfoHudTypes";
import type { EditableObjectPatch } from "../../lib/modeling/objectEditingRuntime";
import type { PropagationPathPatch } from "../../lib/propagation/propagationAuthoringRuntime";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import {
  logObjectDeselected,
  logObjectHudMounted,
  logObjectHudUpdated,
  logObjectSelected,
} from "../../lib/ui/objectInfoHudInstrumentation";
import { persistSceneHudAnchorPreference, sceneHudDockStyle } from "../../lib/hud/sceneHudAnchorRuntime";
import { useFocusHudPresentation } from "../../lib/workspace/useFocusHudPresentation";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";
import { ObjectInfoHud } from "./ObjectInfoHud";
import { SceneHudOverlayRoot } from "./SceneHudOverlayRoot";

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

export function ObjectInfoHudOverlay(props: ObjectInfoHudOverlayProps): React.ReactElement {
  const mountedRef = React.useRef(false);
  const lastObjectIdRef = React.useRef<string | null>(null);
  const { getHudPlacement } = useWorkspaceLayout();
  const placement = getHudPlacement("objectInfoHud");
  const focusHud = useFocusHudPresentation("objectInfoHud", placement.visible);
  const selectedObjectId = props.model.selectedObjectId?.trim() || null;

  React.useEffect(() => {
    persistSceneHudAnchorPreference("objectInfoHud", "TOP_RIGHT");
  }, []);

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

  if (!placement.visible && !focusHud.preserveMount) return <></>;

  const hasObjectSelection = Boolean(selectedObjectId);
  const hasRelationshipDetail = Boolean(props.model.relationshipDetails);
  const hasPropagationDetail = Boolean(props.model.propagationDetails);
  if (!hasObjectSelection && !hasRelationshipDetail && !hasPropagationDetail) {
    return <></>;
  }

  return (
    <SceneHudOverlayRoot
      panelId="objectInfoHud"
      style={{
        ...sceneHudDockStyle({
          panelId: "objectInfoHud",
          anchor: "TOP_RIGHT",
          visible: focusHud.visible,
          collapsed: placement.sizeMode === "compact",
          maxWidth: placement.maxWidth,
          zIndex: placement.zIndex,
          transitionMs: 160,
          visiblePanelCount: 3,
        }),
        ...focusHud.style,
      }}
    >
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
    </SceneHudOverlayRoot>
  );
}

export default ObjectInfoHudOverlay;
