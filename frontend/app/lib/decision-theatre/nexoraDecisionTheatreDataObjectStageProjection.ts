/**
 * DATA-UX:4 — Director-owned, read-only spatial presentation of canonical DATA_OBJECTs.
 * No RDI, Data Reality, focus, relationship, or Stage truth is stored here.
 */

import type {
  NexoraMVPStageConnectionPresentation,
  NexoraMVPStageObjectPresentation,
} from "../nex-mvp/nexora3DExecutiveStage.ts";
import type { NexoraDecisionTheatreDataObject } from "./nexoraDecisionTheatreDataObjectProjection.ts";

export const nexoraDecisionTheatreDataObjectStageProjectionIdentity =
  "DATA-UX:4/DirectorDataObjectStageProjection" as const;

const DENSITY_OMIT_INTENTS = Object.freeze([
  "COMPARE_CANDIDATES",
  "REVIEW_COMMITMENT",
  "REVIEW_CONSEQUENCE",
] as const);

export type NexoraDecisionTheatreDataObjectStageParticipant = Readonly<{
  dataObject: NexoraDecisionTheatreDataObject;
  presentation: NexoraMVPStageObjectPresentation;
  visibilityReason: "manager-requested-data-inspection" | "explicit-data-inspection";
  placementAuthority: typeof nexoraDecisionTheatreDataObjectStageProjectionIdentity;
  sceneIntent: "ORIENT_TO_STAGE" | "PRESERVE_SCENE";
}>;

export type NexoraDecisionTheatreDataObjectStageProjection = Readonly<{
  identity: typeof nexoraDecisionTheatreDataObjectStageProjectionIdentity;
  participants: readonly NexoraDecisionTheatreDataObjectStageParticipant[];
  connections: readonly NexoraMVPStageConnectionPresentation[];
  diagnostics: Readonly<{
    canonicalSourceIds: readonly string[];
    dataObjectIds: readonly string[];
    stageInstanceIds: readonly string[];
    selectedDataObjectId: string | null;
    businessFocusId: string | null;
    relationshipIds: readonly string[];
    relationshipSemantics: readonly string[];
    visibilityReasons: readonly string[];
    duplicateCount: number;
    directorOwnsPlacement: true;
    projectionOnly: true;
    mutatesBusinessFocus: false;
    mutatesDataReality: false;
  }>;
}>;

function stableUnique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)]);
}

function resolvePlacement(
  index: number,
  count: number,
  stageObjects: readonly NexoraMVPStageObjectPresentation[],
): readonly [number, number, number] {
  const visible = stageObjects.filter((entry) => entry.disclosureState !== "hidden");
  const centerX = visible.length
    ? visible.reduce((sum, entry) => sum + entry.targetPosition[0], 0) / visible.length
    : 0;
  const lowestY = visible.length
    ? Math.min(...visible.map((entry) => entry.targetPosition[1]))
    : 0;
  const spacing = Math.min(2.1, 5.4 / Math.max(1, count));
  const x = Math.max(-2.7, Math.min(2.7, centerX + (index - (count - 1) / 2) * spacing));
  const y = Math.max(-2.65, Math.min(-1.72, lowestY - 1.15));
  return Object.freeze([x, y, 0] as const);
}

export function projectNexoraDecisionTheatreDataObjectsToStage(input: Readonly<{
  dataObjects: readonly NexoraDecisionTheatreDataObject[];
  visibleDataObjectIds: readonly string[];
  selectedDataObjectId: string | null;
  businessFocusId: string | null;
  stageObjects: readonly NexoraMVPStageObjectPresentation[];
  sceneIntentKind?: string | null;
}>): NexoraDecisionTheatreDataObjectStageProjection {
  const requestedIds = stableUnique(input.visibleDataObjectIds);
  const omitForDensity = DENSITY_OMIT_INTENTS.includes(
    input.sceneIntentKind as (typeof DENSITY_OMIT_INTENTS)[number],
  );
  const visibleIds = omitForDensity
    ? requestedIds.filter((id) => id === input.selectedDataObjectId)
    : requestedIds;
  const byId = new Map(input.dataObjects.map((entry) => [entry.id, entry]));
  const visible = visibleIds.flatMap((id) => byId.get(id) ?? []);
  const participants = Object.freeze(
    visible.map((dataObject, index): NexoraDecisionTheatreDataObjectStageParticipant => {
      const position = resolvePlacement(index, visible.length, input.stageObjects);
      const selected = dataObject.id === input.selectedDataObjectId;
      const unresolved = dataObject.unresolvedFieldCount > 0;
      return Object.freeze({
        dataObject,
        presentation: Object.freeze({
          id: dataObject.id,
          label: dataObject.label,
          kind: "data-object data-source csv",
          role: "peripheral" as const,
          overviewPosition: position,
          targetPosition: position,
          scale: 0.88,
          opacity: 0.94,
          emissiveIntensity: selected ? 0.24 : 0.08,
          labelProminence: selected ? "full" as const : "reduced" as const,
          selected,
          focused: false,
          attention: unresolved ? "elevated" as const : "normal" as const,
          status: unresolved ? "unresolved" : "ready",
          executiveVisualState: unresolved ? "unresolved" as const : "normal" as const,
          stateMarker: unresolved ? "unresolved" as const : "none" as const,
          rimIntensity: unresolved ? 0.32 : selected ? 0.22 : 0.08,
          disclosureState: "visible-related" as const,
          spatialRole: "related" as const,
          interactive: true,
          labelVisible: true,
          labelPrimaryLine: dataObject.label,
          labelSecondaryLine: `CSV · ${unresolved ? "Needs clarification" : "Ready"}`,
          labelSide: "bottom" as const,
          labelWorldOffsetX: 0,
          labelWorldOffsetY: -0.72,
          labelOwnerDistance: 0.72,
          labelVisibilityMode: selected ? "full" as const : "compact" as const,
          labelTerritoryStatus: "owned" as const,
          stageLabelContract: "stage-label-1" as const,
          compositionMode: "executive-2_5d" as const,
          presentationPosition: Object.freeze({ x: position[0], y: position[1] }),
          depthRole: "background" as const,
          presentationRegion: "background-context" as const,
        }),
        visibilityReason: omitForDensity
          ? "explicit-data-inspection" as const
          : "manager-requested-data-inspection" as const,
        placementAuthority: nexoraDecisionTheatreDataObjectStageProjectionIdentity,
        sceneIntent: omitForDensity ? "PRESERVE_SCENE" as const : "ORIENT_TO_STAGE" as const,
      });
    }),
  );
  const visibleStageIds = new Set(input.stageObjects.map((entry) => entry.id));
  const connections = Object.freeze(
    participants.flatMap(({ dataObject }) =>
      dataObject.relationships.flatMap((relationship): readonly NexoraMVPStageConnectionPresentation[] => {
        if (!visibleStageIds.has(relationship.targetId)) return [];
        return [Object.freeze({
          id: relationship.id,
          sourceId: relationship.sourceId,
          targetId: relationship.targetId,
          emphasized: dataObject.id === input.selectedDataObjectId,
          opacity: dataObject.id === input.selectedDataObjectId ? 0.42 : 0.24,
          relation: relationship.semanticRelation,
          visualRole: "context" as const,
          directionCue: "source-to-target" as const,
          lineWidth: 0.9,
          impliesCausality: false as const,
          linePattern: "dashed" as const,
          routeKind: "straight" as const,
        })];
      }),
    ),
  );
  return Object.freeze({
    identity: nexoraDecisionTheatreDataObjectStageProjectionIdentity,
    participants,
    connections,
    diagnostics: Object.freeze({
      canonicalSourceIds: Object.freeze(participants.map((entry) => entry.dataObject.sourceId)),
      dataObjectIds: Object.freeze(participants.map((entry) => entry.dataObject.id)),
      stageInstanceIds: Object.freeze(participants.map((entry) => `stage:${entry.dataObject.id}`)),
      selectedDataObjectId: input.selectedDataObjectId,
      businessFocusId: input.businessFocusId,
      relationshipIds: Object.freeze(connections.map((entry) => entry.id)),
      relationshipSemantics: Object.freeze(connections.map((entry) => entry.relation ?? "related")),
      visibilityReasons: Object.freeze(participants.map((entry) => entry.visibilityReason)),
      duplicateCount: input.visibleDataObjectIds.length - requestedIds.length,
      directorOwnsPlacement: true as const,
      projectionOnly: true as const,
      mutatesBusinessFocus: false as const,
      mutatesDataReality: false as const,
    }),
  });
}
