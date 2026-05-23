"use client";

import React, { useMemo } from "react";

import { readSceneRelationships } from "../../../lib/relationships/relationshipRuntime";
import type { NexoraRelationship } from "../../../lib/relationships/relationshipTypes";
import type { SceneThemeId } from "../../../lib/theme/sceneThemeTypes";
import { RelationshipLine } from "./RelationshipLine";

export type RelationshipRendererProps = {
  sceneJson: unknown;
  objects: any[];
  themeId: SceneThemeId;
  selectedObjectId?: string | null;
  selectedRelationshipId?: string | null;
  onRelationshipSelect?: (relationship: NexoraRelationship) => void;
};

/** E2:25 — Canonical scene relationship rendering layer (business entities, not mesh ownership). */
export const RelationshipRenderer = React.memo(function RelationshipRenderer(
  props: RelationshipRendererProps
): React.ReactElement | null {
  const relationships = useMemo(() => readSceneRelationships(props.sceneJson), [props.sceneJson]);

  if (relationships.length === 0) return null;

  return (
    <group data-nx-layer="relationships">
      {relationships.map((relationship) => (
        <RelationshipLine
          key={relationship.id}
          relationship={relationship}
          objects={props.objects}
          themeId={props.themeId}
          showLabel={
            !props.selectedObjectId ||
            relationship.sourceId === props.selectedObjectId ||
            relationship.targetId === props.selectedObjectId ||
            relationship.id === props.selectedRelationshipId
          }
          selected={relationship.id === props.selectedRelationshipId}
          emphasized={
            relationship.sourceId === props.selectedObjectId ||
            relationship.targetId === props.selectedObjectId ||
            relationship.id === props.selectedRelationshipId
          }
          onSelect={props.onRelationshipSelect}
        />
      ))}
    </group>
  );
});

export default RelationshipRenderer;
