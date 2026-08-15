/**
 * NEX-MVP consumer of P2:8.2 Object State Visual Validation.
 *
 * Applies restrained executive-state presentation onto Stage object fields
 * after P2:6/P2:7. Does not move camera, invent edges, or recompute severity.
 */

import {
  resolveDataRealityObjectVisualState,
  type DataRealityObjectVisualState,
} from "@/app/lib/data-reality/dataRealityObjectStateVisualValidation";
import type {
  NexoraMVPStageObjectPresentation,
  NexoraMVPStageObjectStateMarker,
} from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

export const nexoraMVPDataRealityObjectVisualStateIdentity =
  "NEX-MVP/P2:8.2/DataRealityObjectStateVisualValidationConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_OBJECT_VISUAL_STATE_BOUNDARY =
  Object.freeze({
    consumesP282ObjectStateVisualValidation: true as const,
    inventsRelationships: false as const,
    overridesChoreographyPositions: false as const,
    redesignsObjectGeometry: false as const,
    introducesDashboardUi: false as const,
    lowLevelMeshesMayImport: false as const,
  });

function labelProminenceRank(
  value: NexoraMVPStageObjectPresentation["labelProminence"],
): number {
  switch (value) {
    case "full":
      return 3;
    case "reduced":
      return 2;
    default:
      return 1;
  }
}

function maxLabelProminence(
  a: NexoraMVPStageObjectPresentation["labelProminence"],
  b: NexoraMVPStageObjectPresentation["labelProminence"],
): NexoraMVPStageObjectPresentation["labelProminence"] {
  return labelProminenceRank(a) >= labelProminenceRank(b) ? a : b;
}

export function resolveNexoraMVPObjectVisualStateFromPresentation(
  object: NexoraMVPStageObjectPresentation,
): DataRealityObjectVisualState {
  return resolveDataRealityObjectVisualState({
    objectId: object.id,
    mvpStatus: object.status,
    mvpAttention: object.attention,
    interactionRole: object.role,
    focused: object.focused,
    selected: object.selected,
    // Retention is severity/choreography-driven — unresolved is not auto-retained.
    retainAttention:
      object.attention === "critical" || object.attention === "important",
  });
}

/**
 * Optional choreography-aware apply: pass explicit retainAttention object ids
 * from P2:6 without inventing retention for unresolved/normal subjects.
 */
export function applyDataRealityObjectVisualStateToStagePresentationWithRetention(
  presentation: NexoraMVPStageInteractionPresentation,
  retainedObjectIds: readonly string[] = [],
): NexoraMVPStageInteractionPresentation {
  const retained = new Set(retainedObjectIds);
  const objects = Object.freeze(
    presentation.scene.objects.map((object) => {
      const visual = resolveDataRealityObjectVisualState({
        objectId: object.id,
        mvpStatus: object.status,
        mvpAttention: object.attention,
        interactionRole: object.role,
        focused: object.focused,
        selected: object.selected,
        retainAttention:
          retained.has(object.id) ||
          object.attention === "critical" ||
          object.attention === "important",
      });
      return applyVisualStateToObject(object, visual);
    }),
  );

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
    }),
  });
}

function applyVisualStateToObject(
  object: NexoraMVPStageObjectPresentation,
  visual: DataRealityObjectVisualState,
): NexoraMVPStageObjectPresentation {
  // Compose with choreography: never reduce elevated severity floors;
  // never rewrite targetPosition / role / status / attention.
  // Unresolved/normal backgrounds may be dimmed for focus hierarchy (marker remains).
  const scale =
    visual.executiveState === "normal" && object.role === "unrelated"
      ? Math.min(object.scale, visual.scale)
      : Math.max(object.scale, visual.scale);

  const opacity =
    (visual.executiveState === "normal" ||
      visual.executiveState === "unresolved") &&
    object.role === "unrelated"
      ? Math.min(object.opacity, visual.opacity)
      : Math.max(object.opacity, visual.opacity);

  const emissiveIntensity = Math.max(
    object.emissiveIntensity,
    visual.emissiveIntensity,
  );

  return Object.freeze({
    ...object,
    scale,
    opacity,
    emissiveIntensity,
    labelProminence: maxLabelProminence(
      object.labelProminence,
      visual.labelProminence,
    ),
    executiveVisualState: visual.executiveState,
    stateMarker: visual.marker as NexoraMVPStageObjectStateMarker,
    rimIntensity: visual.rimIntensity,
    // Preserve interaction flags — selection ≠ critical.
    focused: object.focused,
    selected: object.selected,
  });
}

/**
 * Apply P2:8.2 object-state visual validation onto Stage presentation objects.
 * Leaves connections, context, camera, and positions untouched.
 */
export function applyDataRealityObjectVisualStateToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
): NexoraMVPStageInteractionPresentation {
  const objects = Object.freeze(
    presentation.scene.objects.map((object) => {
      const visual = resolveNexoraMVPObjectVisualStateFromPresentation(object);
      return applyVisualStateToObject(object, visual);
    }),
  );

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
    }),
  });
}
