"use client";

import React from "react";

import {
  buildObjectInfoHudSignature,
  type ObjectInfoHudModel,
} from "../../lib/scene/objectInfoHudTypes";
import type { EditableObjectPatch } from "../../lib/modeling/objectEditingRuntime";
import type { PropagationPathPatch } from "../../lib/propagation/propagationAuthoringRuntime";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import type { WorkspaceHudPlacement } from "../../lib/ui/workspaceLayoutTypes";
import {
  logObjectDeselected,
  logObjectHudMounted,
  logObjectHudUpdated,
  logObjectSelected,
} from "../../lib/ui/objectInfoHudInstrumentation";
import { persistSceneHudAnchorPreference } from "../../lib/hud/sceneHudAnchorRuntime";
import { useFocusHudPresentation } from "../../lib/workspace/useFocusHudPresentation";
import { SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE } from "../../lib/scene/sceneHudZoneContract";
import { ObjectInfoHud } from "./ObjectInfoHud";
import { SceneHudOverlayRoot } from "./SceneHudOverlayRoot";
import { devLogThrottled } from "../../lib/runtime/diagnosticThrottle.ts";

export type ObjectInfoHudOverlayProps = {
  model: ObjectInfoHudModel;
  sceneJson: unknown;
  placement: WorkspaceHudPlacement;
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

const loggedObjectPanelVisibility = new Set<string>();

function logObjectPanelVisibilityRestored(objectId: string | null): void {
  if (process.env.NODE_ENV === "production") return;
  const key = objectId ?? "none";
  if (loggedObjectPanelVisibility.has(key)) return;
  loggedObjectPanelVisibility.add(key);
  globalThis.console?.debug?.("[Nexora][ObjectPanelVisibilityRestored]", {
    objectId,
    zone: "scene-object-panel-zone",
  });
}

function objectInfoHudPlacementSignature(placement: WorkspaceHudPlacement | null | undefined): string {
  if (!placement) return "placement:null";
  return [
    placement.visible ? "visible" : "hidden",
    placement.sizeMode,
    placement.anchor,
    placement.top ?? "",
    placement.left ?? "",
    placement.right ?? "",
    placement.bottom ?? "",
    placement.transform ?? "",
    placement.maxWidth ?? "",
    placement.zIndex ?? "",
  ].join("|");
}

function diffObjectInfoHudOverlayProps(
  prev: ObjectInfoHudOverlayProps | null,
  next: ObjectInfoHudOverlayProps
): {
  changedProps: Array<{
    propName: string;
    prevSignature: string;
    nextSignature: string;
    shouldRender: boolean;
  }>;
  changedPropNames: string[];
} {
  if (!prev) {
    return {
      changedPropNames: ["__initial_render__"],
      changedProps: [
        {
          propName: "__initial_render__",
          prevSignature: "none",
          nextSignature: buildObjectInfoHudSignature(next.model),
          shouldRender: true,
        },
      ],
    };
  }
  const candidates = [
    {
      propName: "model",
      prevSignature: buildObjectInfoHudSignature(prev.model),
      nextSignature: buildObjectInfoHudSignature(next.model),
    },
    {
      propName: "placement",
      prevSignature: objectInfoHudPlacementSignature(prev.placement),
      nextSignature: objectInfoHudPlacementSignature(next.placement),
    },
    {
      propName: "themeMode",
      prevSignature: String(prev.themeMode ?? ""),
      nextSignature: String(next.themeMode ?? ""),
    },
  ];
  const changedProps = candidates
    .filter((entry) => entry.prevSignature !== entry.nextSignature)
    .map((entry) => ({ ...entry, shouldRender: true }));
  return {
    changedPropNames: changedProps.map((entry) => entry.propName),
    changedProps,
  };
}

function ObjectInfoHudOverlayInner(props: ObjectInfoHudOverlayProps): React.ReactElement {
  const mountedRef = React.useRef(false);
  const lastObjectIdRef = React.useRef<string | null>(null);
  const previousPropsRef = React.useRef<ObjectInfoHudOverlayProps | null>(null);
  const renderCountRef = React.useRef(0);
  renderCountRef.current += 1;
  const placement = props.placement;
  const focusHud = useFocusHudPresentation("objectInfoHud", true);
  const selectedObjectId = props.model.selectedObjectId?.trim() || null;
  const hasObjectSelection = Boolean(selectedObjectId);
  const hasRelationshipDetail = Boolean(props.model.relationshipDetails);
  const hasPropagationDetail = Boolean(props.model.propagationDetails);
  const propsDiff = diffObjectInfoHudOverlayProps(previousPropsRef.current, props);
  const hudSignatureChanged = propsDiff.changedPropNames.includes("model");
  const visibilityChanged =
    Boolean(previousPropsRef.current?.placement.visible) !== Boolean(props.placement.visible);
  const layoutStoreChanged = propsDiff.changedPropNames.includes("placement");
  const parentRenderOnly = propsDiff.changedPropNames.length === 0;
  devLogThrottled({
    key: `${selectedObjectId ?? "none"}:${props.model.relationshipDetails?.id ?? "none"}:${props.model.propagationDetails?.id ?? "none"}:${placement.sizeMode}`,
    label: "[NEXORA_OBJECT_INFO_HUD_TRACE]",
    scope: "scene",
    intervalMs: 1000,
    payload: {
      stepName: "ObjectInfoHudOverlay render",
      file: "frontend/app/components/scene/ObjectInfoHudOverlay.tsx",
      stateWritten: "none",
      reason: "React render from SceneCanvas objectInfoHud prop or workspace layout store.",
      changedProps: propsDiff.changedProps,
      changedPropNames: propsDiff.changedPropNames,
      hudSignatureChanged,
      anchorChanged: layoutStoreChanged,
      visibilityChanged,
      layoutStoreChanged,
      parentRenderOnly,
      shouldRender: !parentRenderOnly,
      renderImpact: "Scene-native object info HUD render.",
      shouldBeImmediate: true,
      shouldBeDeferred: false,
      shouldBeSkippedIfSameObject: true,
      selectedObjectIdChanged: lastObjectIdRef.current !== selectedObjectId,
      focusedIdChanged: false,
      objectInfoHudChanged: lastObjectIdRef.current !== selectedObjectId,
      rightPanelChanged: false,
      objectPanelDataBuilt: Boolean(props.model.executiveSummary || props.model.riskLevel || props.model.frsiScore),
      executiveDataBuilt: Boolean(props.model.executiveSummary || props.model.riskLevel || props.model.frsiScore),
      renderCountDelta: 1,
      renderCount: renderCountRef.current,
      selectedObjectId,
      visible: true,
      sizeMode: placement.sizeMode,
    },
  });
  React.useEffect(() => {
    previousPropsRef.current = props;
  });

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
      logObjectPanelVisibilityRestored(selectedObjectId);
    } else if (selectedObjectId && previousId && selectedObjectId !== previousId) {
      logObjectHudUpdated({ objectId: selectedObjectId });
      logObjectPanelVisibilityRestored(selectedObjectId);
    }

    lastObjectIdRef.current = selectedObjectId;
  }, [selectedObjectId]);

  if (!hasObjectSelection && !hasRelationshipDetail && !hasPropagationDetail) {
    return <></>;
  }

  if (!focusHud.visible) {
    return <></>;
  }

  return (
    <SceneHudOverlayRoot
      panelId="objectInfoHud"
      style={{
        ...SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE,
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

function hasRenderableHudSelection(model: ObjectInfoHudModel): boolean {
  return Boolean(
    model.selectedObjectId?.trim() ||
      model.relationshipDetails ||
      model.propagationDetails
  );
}

function areObjectInfoHudOverlayPropsEqual(
  prev: ObjectInfoHudOverlayProps,
  next: ObjectInfoHudOverlayProps
): boolean {
  const prevHudSignature = buildObjectInfoHudSignature(prev.model);
  const nextHudSignature = buildObjectInfoHudSignature(next.model);
  const prevPlacementSignature = objectInfoHudPlacementSignature(prev.placement);
  const nextPlacementSignature = objectInfoHudPlacementSignature(next.placement);
  const equal =
    prevHudSignature === nextHudSignature &&
    prevPlacementSignature === nextPlacementSignature &&
    prev.themeMode === next.themeMode;
  devLogThrottled({
    key: `memo:${next.model.selectedObjectId ?? "none"}:${equal ? "blocked" : "render"}`,
    label: "[NEXORA_OBJECT_INFO_HUD_TRACE]",
    scope: "scene",
    intervalMs: 1000,
    payload: {
      stepName: "ObjectInfoHudOverlay memo comparator",
      file: "frontend/app/components/scene/ObjectInfoHudOverlay.tsx",
      changedProps: diffObjectInfoHudOverlayProps(prev, next).changedProps,
      changedPropNames: diffObjectInfoHudOverlayProps(prev, next).changedPropNames,
      hudSignatureChanged: prevHudSignature !== nextHudSignature,
      selectedObjectIdChanged: prev.model.selectedObjectId !== next.model.selectedObjectId,
      anchorChanged: prevPlacementSignature !== nextPlacementSignature,
      visibilityChanged: prev.placement.visible !== next.placement.visible,
      layoutStoreChanged: prevPlacementSignature !== nextPlacementSignature,
      parentRenderOnly: equal,
      shouldRender: !equal,
      stateWritten: "none",
      reason: equal ? "memo-comparator-blocked-parent-render" : "meaningful HUD prop changed",
    },
  });
  return equal;
}

function ObjectInfoHudOverlayOuter(props: ObjectInfoHudOverlayProps): React.ReactElement {
  if (!hasRenderableHudSelection(props.model)) {
    return <></>;
  }
  return <ObjectInfoHudOverlayInner {...props} />;
}

export const ObjectInfoHudOverlay = React.memo(ObjectInfoHudOverlayOuter, areObjectInfoHudOverlayPropsEqual);
ObjectInfoHudOverlay.displayName = "ObjectInfoHudOverlay";

export default ObjectInfoHudOverlay;
