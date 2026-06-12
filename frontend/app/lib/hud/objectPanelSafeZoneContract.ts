/**
 * MRP_HUD:10:2 — Object Panel Scene Right Safe Zone contract.
 * Guarantees object panel stays inside Zone C and left of MRP.
 */

import type { SceneHudZoneRect } from "../scene/sceneHudZoneContract.ts";
import { SCENE_HUD_ZONE_METRICS } from "../scene/sceneHudZoneContract.ts";

export const MIN_OBJECT_PANEL_TO_MRP_GAP = 12;

export type SceneRightSafeZone = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}>;

export type ObjectPanelSafeZoneContract = Readonly<{
  sceneRightSafeZone: SceneRightSafeZone;
  objectPanelReservedWidth: number;
  mrpReservedWidth: number;
  minimumGapBetweenObjectPanelAndMrp: number;
  objectPanelZone: SceneHudZoneRect;
  objectPanelRight: number;
  objectPanelWidth: number;
  mrpLeft: number;
  gap: number;
  overlapDetected: boolean;
  safeZoneViolation: boolean;
  clamped: boolean;
}>;

export type ObjectPanelSafeZoneInput = Readonly<{
  viewportWidth: number;
  layoutWidth: number;
  layoutHeight: number;
  sideInset: number;
  sideTop: number;
  sideMaxHeight: number;
  scenePanelLeft: number;
  scenePanelWidth: number;
  objectPanelWidthRequested: number;
  mrpWidth: number;
  mrpVisible: boolean;
  usingViewportFallback: boolean;
  isMobile: boolean;
  objectPanelExpanded: boolean;
}>;

function buildZoneRect(
  top: number,
  left: number,
  width: number,
  height: number,
  containerWidth: number,
  containerHeight: number,
  maxWidth: string
): SceneHudZoneRect {
  const safeWidth = Math.max(0, width);
  const safeHeight = Math.max(0, height);
  return {
    top,
    left,
    right: Math.max(0, containerWidth - left - safeWidth),
    bottom: Math.max(0, containerHeight - top - safeHeight),
    width: safeWidth,
    height: safeHeight,
    maxWidth,
    maxHeight: `${Math.floor(safeHeight)}px`,
  };
}

export function resolveSceneRightSafeZone(input: {
  sideTop: number;
  sideMaxHeight: number;
  scenePanelLeft: number;
  scenePanelWidth: number;
  effectiveLayoutWidth: number;
  sideInset: number;
}): SceneRightSafeZone {
  const left =
    input.scenePanelLeft + input.scenePanelWidth + SCENE_HUD_ZONE_METRICS.zoneGap;
  const right = input.effectiveLayoutWidth - input.sideInset;
  const width = Math.max(0, right - left);
  return Object.freeze({
    left,
    top: input.sideTop,
    width,
    height: input.sideMaxHeight,
    right,
    bottom: input.sideTop + input.sideMaxHeight,
  });
}

export function resolveObjectPanelSafeZoneContract(
  input: ObjectPanelSafeZoneInput
): ObjectPanelSafeZoneContract {
  const mrpReservedWidth = input.mrpVisible ? Math.max(0, input.mrpWidth) : 0;
  const minimumGap = MIN_OBJECT_PANEL_TO_MRP_GAP;
  const mrpReservation =
    input.mrpVisible && input.usingViewportFallback
      ? mrpReservedWidth + minimumGap
      : 0;

  const effectiveLayoutWidth = Math.max(320, input.layoutWidth - mrpReservation);
  const mrpLeft = input.viewportWidth - mrpReservedWidth;
  const objectPanelRight = input.sideInset;

  const sceneRightSafeZone = resolveSceneRightSafeZone({
    sideTop: input.sideTop,
    sideMaxHeight: input.sideMaxHeight,
    scenePanelLeft: input.scenePanelLeft,
    scenePanelWidth: input.scenePanelWidth,
    effectiveLayoutWidth,
    sideInset: input.sideInset,
  });

  const minObjectPanelLeft = sceneRightSafeZone.left;
  let objectPanelWidth = Math.min(
    input.objectPanelWidthRequested,
    Math.max(0, sceneRightSafeZone.width)
  );

  let objectPanelLeft = Math.max(
    minObjectPanelLeft,
    effectiveLayoutWidth - objectPanelRight - objectPanelWidth
  );

  const maxRight = effectiveLayoutWidth - input.sideInset;
  if (objectPanelLeft + objectPanelWidth > maxRight + 0.5) {
    objectPanelWidth = Math.max(0, maxRight - objectPanelLeft);
  }
  if (objectPanelLeft + objectPanelWidth > maxRight + 0.5) {
    objectPanelLeft = Math.max(minObjectPanelLeft, maxRight - objectPanelWidth);
  }

  const unclampedLeft = Math.max(
    input.scenePanelLeft + input.scenePanelWidth + SCENE_HUD_ZONE_METRICS.zoneGap,
    input.layoutWidth - objectPanelRight - input.objectPanelWidthRequested
  );
  const unclampedWidth = input.objectPanelWidthRequested;
  const preClampOverflow =
    unclampedLeft + unclampedWidth > input.layoutWidth - input.sideInset + 0.5 ||
    (input.mrpVisible &&
      input.usingViewportFallback &&
      unclampedLeft + unclampedWidth > effectiveLayoutWidth - input.sideInset + 0.5);

  const objectPanelRightEdge = objectPanelLeft + objectPanelWidth;
  const gap =
    input.mrpVisible && input.usingViewportFallback
      ? Math.max(0, mrpLeft - objectPanelRightEdge)
      : Math.max(0, effectiveLayoutWidth - input.sideInset - objectPanelRightEdge);

  const overlapDetected =
    input.mrpVisible &&
    input.usingViewportFallback &&
    gap < minimumGap - 0.5;

  const clamped =
    preClampOverflow ||
    objectPanelWidth !== input.objectPanelWidthRequested ||
    objectPanelLeft !== unclampedLeft;

  const maxWidthCss = input.isMobile
    ? "min(280px, 58vw)"
    : `min(${Math.floor(objectPanelWidth)}px, 32vw)`;

  const objectPanelZone = buildZoneRect(
    input.sideTop,
    objectPanelLeft,
    objectPanelWidth,
    input.sideMaxHeight,
    effectiveLayoutWidth,
    input.layoutHeight,
    maxWidthCss
  );

  return Object.freeze({
    sceneRightSafeZone,
    objectPanelReservedWidth: objectPanelWidth,
    mrpReservedWidth,
    minimumGapBetweenObjectPanelAndMrp: minimumGap,
    objectPanelZone,
    objectPanelRight: objectPanelZone.right,
    objectPanelWidth,
    mrpLeft,
    gap,
    overlapDetected,
    safeZoneViolation: preClampOverflow || overlapDetected,
    clamped,
  });
}

export function objectPanelSafeZoneSignature(
  contract: ObjectPanelSafeZoneContract
): string {
  return [
    contract.objectPanelZone.left,
    contract.objectPanelZone.width,
    contract.gap,
    contract.overlapDetected,
    contract.safeZoneViolation,
    contract.mrpLeft,
  ].join(":");
}
