/**
 * C:2 — Object Compare Marker Engine.
 *
 * Converts object comparison differences into visual-only overlay markers.
 * Markers preserve object positions and topology fingerprints; the engine has
 * no object movement, topology, scene, routing, or mutation authority.
 */

export const OBJECT_COMPARE_MARKERS_DIAGNOSTIC = "[OBJECT_COMPARE_MARKERS]" as const;

export const OBJECT_COMPARE_MARKERS_READY_DIAGNOSTIC = "[OBJECT_COMPARE_MARKERS_READY]" as const;

export const C2_OBJECT_MARKERS_COMPLETE_TAG = "[C2_OBJECT_MARKERS_COMPLETE]" as const;

export const OBJECT_COMPARE_MARKER_ENGINE_VERSION = "1.0.0" as const;

export type ObjectCompareMarkerStatus = "improved" | "declined" | "neutral";

export type ObjectCompareMarkerDisplay = "Improved Object" | "Declined Object" | "Neutral Object";

export type ObjectComparePosition = Readonly<{
  x: number;
  y: number;
  z?: number;
}>;

export type ObjectDifferenceProfile = Readonly<{
  differenceId: string;
  comparisonId: string;
  scenarioAId: string;
  scenarioBId: string;
  objectId: string;
  objectLabel: string;
  objectPosition: ObjectComparePosition;
  topologyFingerprint: string;
  objectHealthDelta: number;
  objectImpactDelta: number;
  confidence: number;
  summary: string;
  readOnly: true;
  mutation: false;
  objectMutation: false;
  topologyMutation: false;
}>;

export type ObjectCompareMarker = Readonly<{
  markerId: string;
  differenceId: string;
  objectId: string;
  objectLabel: string;
  display: ObjectCompareMarkerDisplay;
  status: ObjectCompareMarkerStatus;
  position: ObjectComparePosition;
  topologyFingerprint: string;
  intensity: number;
  confidence: number;
  label: string;
  visualOnly: true;
  objectMovement: false;
  objectMutation: false;
  topologyMutation: false;
  sceneMutation: false;
  readOnly: true;
}>;

export type ObjectCompareMarkerEngineInput = Readonly<{
  differences: readonly ObjectDifferenceProfile[];
}>;

export type ObjectCompareMarkerEngineResult = Readonly<{
  version: typeof OBJECT_COMPARE_MARKER_ENGINE_VERSION;
  markers: readonly ObjectCompareMarker[];
  markerCount: number;
  improvedObjectCount: number;
  declinedObjectCount: number;
  neutralObjectCount: number;
  visualOnly: true;
  objectMovement: false;
  objectMutation: false;
  topologyMutation: false;
  sceneMutation: false;
  routingMutation: false;
  readOnly: true;
  diagnostics: readonly [
    typeof OBJECT_COMPARE_MARKERS_DIAGNOSTIC,
    typeof OBJECT_COMPARE_MARKERS_READY_DIAGNOSTIC,
  ];
}>;

export const OBJECT_COMPARE_MARKER_DIAGNOSTICS = Object.freeze([
  OBJECT_COMPARE_MARKERS_DIAGNOSTIC,
  OBJECT_COMPARE_MARKERS_READY_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_COMPARE_MARKER_ENGINE_RESULT: ObjectCompareMarkerEngineResult = Object.freeze({
  version: OBJECT_COMPARE_MARKER_ENGINE_VERSION,
  markers: Object.freeze([]),
  markerCount: 0,
  improvedObjectCount: 0,
  declinedObjectCount: 0,
  neutralObjectCount: 0,
  visualOnly: true,
  objectMovement: false,
  objectMutation: false,
  topologyMutation: false,
  sceneMutation: false,
  routingMutation: false,
  readOnly: true,
  diagnostics: OBJECT_COMPARE_MARKER_DIAGNOSTICS,
});

let latestObjectCompareMarkerResult: ObjectCompareMarkerEngineResult =
  EMPTY_OBJECT_COMPARE_MARKER_ENGINE_RESULT;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function freezePosition(position: ObjectComparePosition): ObjectComparePosition {
  return Object.freeze({
    x: position.x,
    y: position.y,
    ...(position.z === undefined ? {} : { z: position.z }),
  });
}

function markerStatus(difference: ObjectDifferenceProfile): ObjectCompareMarkerStatus {
  const combinedDelta = difference.objectHealthDelta + difference.objectImpactDelta;
  if (combinedDelta > 0) return "improved";
  if (combinedDelta < 0) return "declined";
  return "neutral";
}

function markerDisplay(status: ObjectCompareMarkerStatus): ObjectCompareMarkerDisplay {
  if (status === "improved") return "Improved Object";
  if (status === "declined") return "Declined Object";
  return "Neutral Object";
}

export function buildObjectDifferenceProfile(
  input: Omit<ObjectDifferenceProfile, "readOnly" | "mutation" | "objectMutation" | "topologyMutation">
): ObjectDifferenceProfile {
  return Object.freeze({
    ...input,
    objectPosition: freezePosition(input.objectPosition),
    readOnly: true as const,
    mutation: false as const,
    objectMutation: false as const,
    topologyMutation: false as const,
  });
}

export function buildObjectCompareMarker(difference: ObjectDifferenceProfile): ObjectCompareMarker {
  const status = markerStatus(difference);
  return Object.freeze({
    markerId: `object-compare-marker:${difference.comparisonId}:${difference.differenceId}:${difference.objectId}`,
    differenceId: difference.differenceId,
    objectId: difference.objectId,
    objectLabel: difference.objectLabel,
    display: markerDisplay(status),
    status,
    position: freezePosition(difference.objectPosition),
    topologyFingerprint: difference.topologyFingerprint,
    intensity: clampScore(Math.abs(difference.objectHealthDelta) + Math.abs(difference.objectImpactDelta)),
    confidence: clampScore(difference.confidence),
    label: difference.summary,
    visualOnly: true as const,
    objectMovement: false as const,
    objectMutation: false as const,
    topologyMutation: false as const,
    sceneMutation: false as const,
    readOnly: true as const,
  });
}

export function generateObjectCompareMarkers(
  input: ObjectCompareMarkerEngineInput
): ObjectCompareMarkerEngineResult {
  const markers = Object.freeze(
    input.differences.map((difference) => buildObjectCompareMarker(difference))
  );

  latestObjectCompareMarkerResult = Object.freeze({
    version: OBJECT_COMPARE_MARKER_ENGINE_VERSION,
    markers,
    markerCount: markers.length,
    improvedObjectCount: markers.filter((marker) => marker.status === "improved").length,
    declinedObjectCount: markers.filter((marker) => marker.status === "declined").length,
    neutralObjectCount: markers.filter((marker) => marker.status === "neutral").length,
    visualOnly: true as const,
    objectMovement: false as const,
    objectMutation: false as const,
    topologyMutation: false as const,
    sceneMutation: false as const,
    routingMutation: false as const,
    readOnly: true as const,
    diagnostics: OBJECT_COMPARE_MARKER_DIAGNOSTICS,
  });

  return latestObjectCompareMarkerResult;
}

export function getObjectCompareMarkerEngineResult(): ObjectCompareMarkerEngineResult {
  return latestObjectCompareMarkerResult;
}

export function resetObjectCompareMarkerEngineForTests(): void {
  latestObjectCompareMarkerResult = EMPTY_OBJECT_COMPARE_MARKER_ENGINE_RESULT;
}

export const ObjectCompareMarkerEngine = Object.freeze({
  buildObjectDifferenceProfile,
  buildObjectCompareMarker,
  generateObjectCompareMarkers,
  getObjectCompareMarkerEngineResult,
  resetObjectCompareMarkerEngineForTests,
  diagnostics: OBJECT_COMPARE_MARKER_DIAGNOSTICS,
  emptyResult: EMPTY_OBJECT_COMPARE_MARKER_ENGINE_RESULT,
});
