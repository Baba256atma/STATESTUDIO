"use client";

import React, { useMemo, useSyncExternalStore } from "react";

import { resolveExecutiveRelationshipScenePlan } from "../../../lib/relationships/executive";
import { resolveRelationshipViewProfile } from "../../../lib/scene/relationshipViewProfiles";
import { logExecutiveGraphicsProfileOnce } from "../../../lib/scene/graphics/executiveGraphicsProfile";
import {
  getWorkspaceViewMode,
  getWorkspaceViewModeServerSnapshot,
  subscribeWorkspaceViewMode,
} from "../../../lib/workspace/workspaceViewModeRuntime";
import type { NexoraRelationship } from "../../../lib/relationships/relationshipTypes";
import type { SceneThemeId } from "../../../lib/theme/sceneThemeTypes";
import { readValidatedSceneRelationshipsForRender } from "../../../lib/relationships/relationshipRendererRuntime";
import { RelationshipLine } from "./RelationshipLine";
import {
  buildRuntimeObjectPositionLookupCache,
  buildRuntimeObjectPositionLookupSignature,
  type RuntimeObjectPositionContext,
} from "../sceneRenderUtils";

export type RelationshipRendererProps = {
  sceneJson: unknown;
  objects: any[];
  themeId: SceneThemeId;
  selectedObjectId?: string | null;
  selectedRelationshipId?: string | null;
  emphasizedRelationshipIds?: readonly string[];
  onRelationshipSelect?: (relationship: NexoraRelationship) => void;
  runtimeObjectPositionContext?: RuntimeObjectPositionContext;
};

/** E2:25 + E2:47 — Executive relationship rendering layer. */
export const RelationshipRenderer = React.memo(function RelationshipRenderer(
  props: RelationshipRendererProps
): React.ReactElement | null {
  const workspaceViewMode = useSyncExternalStore(
    subscribeWorkspaceViewMode,
    getWorkspaceViewMode,
    getWorkspaceViewModeServerSnapshot
  );
  const relationshipViewProfile = useMemo(
    () => resolveRelationshipViewProfile(workspaceViewMode),
    [workspaceViewMode]
  );
  const relationships = useMemo(
    () => readValidatedSceneRelationshipsForRender(props.sceneJson, props.objects),
    [props.objects, props.sceneJson]
  );

  const positionLookupSignature = useMemo(
    () => buildRuntimeObjectPositionLookupSignature(props.objects, props.runtimeObjectPositionContext),
    [props.objects, props.runtimeObjectPositionContext]
  );
  const positionLookup = useMemo(
    () =>
      buildRuntimeObjectPositionLookupCache({
        sceneObjects: props.objects,
        context: props.runtimeObjectPositionContext,
      }),
    [positionLookupSignature]
  );

  const scenePlan = useMemo(
    () =>
      resolveExecutiveRelationshipScenePlan({
        relationships,
        selectedObjectId: props.selectedObjectId,
        selectedRelationshipId: props.selectedRelationshipId,
      }),
    [relationships, props.selectedObjectId, props.selectedRelationshipId]
  );

  React.useEffect(() => {
    logExecutiveGraphicsProfileOnce({
      viewMode: workspaceViewMode,
      objectCount: props.objects.length,
    });
  }, [props.objects.length, workspaceViewMode]);

  if (relationships.length === 0) return null;

  const stressedIds = new Set(props.emphasizedRelationshipIds ?? []);

  return (
    <group
      userData={{
        nxLayer: "relationships",
        nxDensity: scenePlan.densityMode,
        nxViewMode: workspaceViewMode,
      }}
    >
      {relationships.map((relationship) => {
        const renderPlan = scenePlan.plans[relationship.id];
        if (renderPlan && !renderPlan.visible) return null;
        const twinStressed = stressedIds.has(relationship.id);
        return (
          <RelationshipLine
            key={relationship.id}
            relationship={relationship}
            objects={props.objects}
            themeId={props.themeId}
            viewMode={workspaceViewMode}
            lineOpacityMul={relationshipViewProfile.lineOpacity}
            renderPlan={renderPlan}
            showLabel={renderPlan?.showLabel ?? relationshipViewProfile.showLabelDefault}
            billboardLabels={relationshipViewProfile.depthCue}
            selected={relationship.id === props.selectedRelationshipId}
            emphasized={twinStressed || renderPlan?.emphasis !== "BACKGROUND"}
            onSelect={props.onRelationshipSelect}
            runtimeObjectPositionContext={props.runtimeObjectPositionContext}
            positionLookup={positionLookup}
          />
        );
      })}
    </group>
  );
});

export default RelationshipRenderer;
