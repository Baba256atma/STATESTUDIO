/**
 * STAGE-LABEL:1 — Object-Owned Label Territory & Collision Authority.
 *
 * Final authority for Stage label placement. Labels adapt to objects;
 * objects never chase labels. No Z, no camera, no topology changes.
 *
 * STAGE-LABEL:FIX1 — caption proximity: one primary caption per Object,
 * name+state in one owned container, association vs neighbor silhouettes.
 */

import { EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT } from "./executiveStage2DHardSeparation.ts";
import { resolveExecutiveStageFixedCamera } from "./executiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION } from "./executiveStageReservedRegionContainment.ts";
import { resolveExecutiveObjectGeometryFamily } from "./executiveObjectGeometryLanguage.ts";
import {
  EXECUTIVE_OBJECT_LABEL_FONT_TOKENS,
  projectExecutiveObjectLabelToNdc,
} from "./executiveObjectLabelInformationDensity.ts";
import {
  formatExecutiveObjectStageLabel,
  resolveExecutiveLabelWorldOffset,
  type ExecutiveLabelPlacementSide,
} from "./executiveObjectLabelRelationshipGrammar.ts";
import { EXECUTIVE_THREAD_GATEWAY_FOOTPRINT } from "./executiveThreadExpansion.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageObjectLabelTerritoryIdentity =
  "STAGE-LABEL:1/ObjectOwnedLabelTerritoryCollisionAuthority" as const;

export const executiveStageObjectLabelTerritoryVersion = "6.1.0" as const;

export const executiveStageObjectLabelTerritoryNamespace =
  "nexora.spatial-presentation.executive-stage-object-label-territory" as const;

export const executiveStageObjectLabelTerritoryPhase =
  "ObjectOwnedLabelTerritoryAndCollisionAuthority" as const;

export const executiveStageObjectLabelTerritoryArchitecturalRole =
  "PresentationOnlyObjectOwnedLabelLayoutAuthority" as const;

export type ExecutiveStageObjectLabelTerritoryIdentity = {
  readonly id: typeof executiveStageObjectLabelTerritoryIdentity;
  readonly version: typeof executiveStageObjectLabelTerritoryVersion;
  readonly namespace: typeof executiveStageObjectLabelTerritoryNamespace;
  readonly phase: typeof executiveStageObjectLabelTerritoryPhase;
  readonly architecturalRole: typeof executiveStageObjectLabelTerritoryArchitecturalRole;
};

const IDENTITY: ExecutiveStageObjectLabelTerritoryIdentity = Object.freeze({
  id: executiveStageObjectLabelTerritoryIdentity,
  version: executiveStageObjectLabelTerritoryVersion,
  namespace: executiveStageObjectLabelTerritoryNamespace,
  phase: executiveStageObjectLabelTerritoryPhase,
  architecturalRole: executiveStageObjectLabelTerritoryArchitecturalRole,
});

export function getExecutiveStageObjectLabelTerritoryIdentity(): ExecutiveStageObjectLabelTerritoryIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageObjectLabelTerritoryArchitecturalRole,
  movesObjects: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  inventsRelationships: false as const,
  redesignsObjectGeometry: false as const,
  usesZForCollision: false as const,
  freeFloatDisplacement: false as const,
  presentationOnly: true as const,
});

export type ExecutiveStageLabelSide = ExecutiveLabelPlacementSide;

export type ExecutiveStageLabelVisibilityMode =
  | "full"
  | "compact"
  | "minimal"
  | "hidden";

export type ExecutiveStageLabelRect = Readonly<{
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
}>;

export type ExecutiveStageObjectLabelOwnership = Readonly<{
  readonly ownerObjectId: string;
  readonly labelId: string;
  readonly preferredSide: ExecutiveStageLabelSide;
  readonly resolvedSide: ExecutiveStageLabelSide;
  readonly anchorPoint: readonly [number, number];
  readonly bounds: ExecutiveStageLabelRect;
  readonly territoryBounds: ExecutiveStageLabelRect;
  readonly ownerDistance: number;
  readonly visibility: ExecutiveStageLabelVisibilityMode;
  readonly primaryLine: string;
  readonly secondaryLine: string | null;
  readonly valueLine: string | null;
  readonly worldOffsetX: number;
  readonly worldOffsetY: number;
  readonly priorityRank: number;
}>;

/**
 * One paint contract for every Executive Stage caption.
 * The measured CSS box is centered on the projected anchor.
 * World size follows drei Html: css pixels × distanceFactor / viewport height.
 * Character width matches the rendered uppercase caption, including tracking.
 */
export const EXECUTIVE_STAGE_LABEL_MEASUREMENT = Object.freeze({
  paintOrigin: "center" as const,
  distanceFactor: 10,
  /** Uppercase IBM Plex Sans at weight 700 plus 0.04em tracking. */
  charWidthEm: 0.76,
  lineHeight: 1.15,
  wrapCharacters: 16,
  referenceViewport: Object.freeze({ width: 1440, height: 900 }),
  /** Preferred caption edge gap. Hard overlap remains a smaller pad. */
  preferredEdgeGapPx: 24,
  hardLabelGapWorld: 0.04,
});

export type ExecutiveStageLabelViewport = Readonly<{
  width: number;
  height: number;
  ndc?: Readonly<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  }>;
}>;

export const EXECUTIVE_STAGE_LABEL_POLICY = Object.freeze({
  ownerGap: 0.12,
  maxOwnerDistanceFactor: 1.55,
  /** Caption center must be this much closer to owner silhouette than any neighbor. */
  associationPad: 0.1,
  labelHalf: Object.freeze({
    full: Object.freeze({ w: 0.55, h: 0.26 }),
    compact: Object.freeze({ w: 0.46, h: 0.22 }),
    minimal: Object.freeze({ w: 0.38, h: 0.16 }),
  }),
  sideOrder: Object.freeze([
    "top",
    "top-right",
    "top-left",
    "right",
    "left",
    "bottom-right",
    "bottom-left",
    "bottom",
  ] as const satisfies readonly ExecutiveStageLabelSide[]),
  anchorPreferred: Object.freeze([
    "top",
    "top-right",
    "top-left",
    "bottom",
  ] as const satisfies readonly ExecutiveStageLabelSide[]),
  /**
   * Object captions: Top-Right, then Top-Center.
   * Other sides stay in the vocabulary for non-object captions.
   */
  objectCaptionSides: Object.freeze([
    "top-right",
    "top",
  ] as const satisfies readonly ExecutiveStageLabelSide[]),
});

const SIDE_SET = new Set<string>(EXECUTIVE_STAGE_LABEL_POLICY.sideOrder);

/** Screen gap expressed in the same world units as label footprints. */
export function executiveStageLabelReadabilityGapWorld(viewportHeight: number): number {
  const height =
    viewportHeight > 0
      ? viewportHeight
      : EXECUTIVE_STAGE_LABEL_MEASUREMENT.referenceViewport.height;
  return (
    (EXECUTIVE_STAGE_LABEL_MEASUREMENT.preferredEdgeGapPx *
      EXECUTIVE_STAGE_LABEL_MEASUREMENT.distanceFactor) /
    height
  );
}

function stabilize(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

function separationWorld(
  a: ExecutiveStageLabelRect,
  b: ExecutiveStageLabelRect,
): number {
  const gapX = Math.max(b.minX - a.maxX, a.minX - b.maxX, 0);
  const gapY = Math.max(b.minY - a.maxY, a.minY - b.maxY, 0);
  if (gapX === 0 && gapY === 0) return 0;
  if (gapX === 0) return gapY;
  if (gapY === 0) return gapX;
  return Math.hypot(gapX, gapY);
}

function rectsOverlap(
  a: ExecutiveStageLabelRect,
  b: ExecutiveStageLabelRect,
  pad = 0,
): boolean {
  return (
    a.minX < b.maxX + pad - 1e-6 &&
    a.maxX > b.minX - pad + 1e-6 &&
    a.minY < b.maxY + pad - 1e-6 &&
    a.maxY > b.minY - pad + 1e-6
  );
}

function distancePointToRect(
  x: number,
  y: number,
  rect: ExecutiveStageLabelRect,
): number {
  const dx = Math.max(rect.minX - x, 0, x - rect.maxX);
  const dy = Math.max(rect.minY - y, 0, y - rect.maxY);
  if (dx === 0 && dy === 0) {
    const pen = Math.min(
      x - rect.minX,
      rect.maxX - x,
      y - rect.minY,
      rect.maxY - y,
    );
    return -pen;
  }
  return Math.hypot(dx, dy);
}

export function isExecutiveStageLabelSide(
  value: string | null | undefined,
): value is ExecutiveStageLabelSide {
  return value != null && SIDE_SET.has(value);
}

export function resolveExecutiveStageLabelPriorityRank(input: {
  readonly focused?: boolean;
  readonly selected?: boolean;
  readonly role?: string | null;
  readonly attention?: string | null;
  readonly kind?: string | null;
}): number {
  if (input.focused) return 100;
  if (input.selected) return 90;
  if (input.role === "related" || input.role === "focused") return 70;
  const attention = (input.attention ?? "").toLowerCase();
  if (
    attention === "critical" ||
    attention === "important" ||
    attention === "elevated"
  ) {
    return 60;
  }
  if (input.role === "peripheral") return 40;
  if (
    input.kind === "problem" ||
    input.kind === "scenario" ||
    input.kind === "decision" ||
    input.kind === "execution"
  ) {
    return 55;
  }
  return 30;
}

/** Content grammar — name first, state secondary, no duplicated WATCH. */
export function resolveExecutiveStageOwnedLabelContent(input: {
  readonly objectName: string;
  readonly objectKind?: string | null;
  readonly status?: string | null;
  readonly valueText?: string | null;
  readonly presentationLevel?: "minimum" | "report" | "operation";
  readonly visibility?: ExecutiveStageLabelVisibilityMode;
}): Readonly<{
  readonly primaryLine: string;
  readonly secondaryLine: string | null;
  readonly valueLine: string | null;
}> {
  const visibility = input.visibility ?? "full";
  const valueLine = input.valueText?.trim() || null;
  if (visibility === "hidden") {
    return Object.freeze({ primaryLine: "", secondaryLine: null, valueLine: null });
  }

  const kind = (input.objectKind ?? "").toLowerCase();
  const isWork =
    kind === "problem" ||
    kind === "scenario" ||
    kind === "decision" ||
    kind === "execution";

  let name = (input.objectName ?? "").trim();
  name = name
    .replace(
      /\s*[·•|-]\s*(watch|stable|attention|critical|unresolved|normal)\s*$/i,
      "",
    )
    .trim();
  if (isWork) {
    name = name
      .replace(/^(problem|scenario|decision|execution)\s*[·•|:.-]\s*/i, "")
      .trim();
  }

  const formatted = formatExecutiveObjectStageLabel({
    objectName: name || input.objectName,
    objectKind: input.objectKind,
    stateText: null,
    presentationLevel: input.presentationLevel ?? "minimum",
  });

  let primary = formatted.primaryLine;
  const parts = primary.split(/\s*·\s*/).filter(Boolean);
  if (
    parts.length >= 2 &&
    parts[0]!.toLowerCase() === parts[1]!.toLowerCase()
  ) {
    primary = parts[0]!;
  }

  const rawStatus = (input.status ?? "").trim();
  const statusToken = rawStatus.toLowerCase();
  const statusLooksLikeState =
    statusToken === "watch" ||
    statusToken === "stable" ||
    statusToken === "attention" ||
    statusToken === "critical" ||
    statusToken === "unresolved" ||
    statusToken === "normal";

  let secondary: string | null = null;
  if (isWork) {
    secondary = kind.charAt(0).toUpperCase() + kind.slice(1);
  } else if (statusLooksLikeState && statusToken.length > 0) {
    if (!primary.toLowerCase().includes(statusToken)) {
      secondary = statusToken.toUpperCase();
    }
  }

  if (visibility === "compact") {
    if (
      secondary != null &&
      !isWork &&
      primary.toLowerCase().includes(secondary.toLowerCase())
    ) {
      secondary = null;
    }
  }

  if (visibility === "minimal" && !isWork) {
    secondary = null;
  }

  return Object.freeze({
    primaryLine: primary,
    secondaryLine: secondary,
    valueLine,
  });
}

export function resolveExecutiveStageLabelPreferredSide(input: {
  readonly objectX: number;
  readonly objectY: number;
  readonly focused?: boolean;
  readonly role?: string | null;
  readonly nearestForeign?: Readonly<{ readonly x: number; readonly y: number }> | null;
}): ExecutiveStageLabelSide {
  void input.objectX;
  void input.objectY;
  void input.focused;
  void input.role;
  void input.nearestForeign;
  return "top-right";
}

function sidePreferenceList(
  preferred: ExecutiveStageLabelSide,
  focused: boolean,
  nearestForeign: Readonly<{ readonly x: number; readonly y: number }> | null,
  objectX: number,
  objectY: number,
): readonly ExecutiveStageLabelSide[] {
  void preferred;
  void focused;
  void nearestForeign;
  void objectX;
  void objectY;
  return EXECUTIVE_STAGE_LABEL_POLICY.objectCaptionSides;
}

function captionLinesForContent(
  primaryLine: string,
  secondaryLine: string | null,
  valueLine: string | null,
): readonly string[] {
  const primary = primaryLine.trim();
  const secondary = (secondaryLine ?? "").trim();
  const value = (valueLine ?? "").trim();
  if (value.length > 0) {
    return Object.freeze([primary, value, secondary].filter((line) => line.length > 0));
  }
  const wrap = EXECUTIVE_STAGE_LABEL_MEASUREMENT.wrapCharacters;
  const source = primary.length > 0 ? primary : " ";
  const lines: string[] = [];
  for (let index = 0; index < source.length; index += wrap) {
    lines.push(source.slice(index, index + wrap));
  }
  if (secondary.length > 0) lines.push(secondary);
  return Object.freeze(lines);
}

/**
 * CSS size of the caption the renderer will paint, then converted to world
 * units with the same distanceFactor the Html portal uses.
 */
function labelFootprintForContent(
  mode: Exclude<ExecutiveStageLabelVisibilityMode, "hidden">,
  primaryLine: string,
  secondaryLine: string | null,
  valueLine: string | null = null,
  viewportHeight: number = EXECUTIVE_STAGE_LABEL_MEASUREMENT.referenceViewport.height,
): Readonly<{
  readonly w: number;
  readonly h: number;
  readonly paintedW: number;
  readonly paintedH: number;
  readonly lines: readonly string[];
}> {
  const lines = captionLinesForContent(primaryLine, secondaryLine, valueLine);
  const fontSize = EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.identity;
  void mode;
  const longest = lines.reduce((max, line) => Math.max(max, line.length), 1);
  const cssWidth = longest * fontSize * EXECUTIVE_STAGE_LABEL_MEASUREMENT.charWidthEm;
  const cssHeight =
    Math.max(lines.length, 1) *
    fontSize *
    EXECUTIVE_STAGE_LABEL_MEASUREMENT.lineHeight;
  const height = viewportHeight > 1
    ? viewportHeight
    : EXECUTIVE_STAGE_LABEL_MEASUREMENT.referenceViewport.height;
  const worldPerPixel = EXECUTIVE_STAGE_LABEL_MEASUREMENT.distanceFactor / height;
  const paintedW = cssWidth * worldPerPixel;
  const paintedH = cssHeight * worldPerPixel;
  return Object.freeze({
    w: paintedW / 2,
    h: paintedH / 2,
    paintedW,
    paintedH,
    lines,
  });
}

function captionCloserToNeighborThanOwner(
  centerX: number,
  centerY: number,
  ownerObjectId: string,
  bodyById: ReadonlyMap<string, ExecutiveStageLabelRect>,
  pad: number,
): boolean {
  const ownerBody = bodyById.get(ownerObjectId);
  if (ownerBody == null) return false;
  const ownerDist = Math.max(
    0,
    distancePointToRect(centerX, centerY, ownerBody),
  );
  for (const [bodyId, body] of bodyById) {
    if (bodyId === ownerObjectId) continue;
    const otherDist = Math.max(0, distancePointToRect(centerX, centerY, body));
    if (otherDist + 1e-6 < ownerDist + pad) return true;
  }
  return false;
}

function outwardHalf(
  side: ExecutiveStageLabelSide,
  halfX: number,
  halfY: number,
): number {
  if (side === "left" || side === "right") return halfX;
  if (side === "top" || side === "bottom") return halfY;
  return Math.hypot(halfX, halfY) * 0.72;
}

function makeLabelRect(
  ownerX: number,
  ownerY: number,
  body: ExecutiveStageLabelRect,
  side: ExecutiveStageLabelSide,
  paintedW: number,
  paintedH: number,
): Readonly<{
  readonly rect: ExecutiveStageLabelRect;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly ownerDistance: number;
  readonly anchorX: number;
  readonly anchorY: number;
}> {
  const bodyHalfX = Math.max(ownerX - body.minX, body.maxX - ownerX, 0.2);
  const bodyHalfY = Math.max(ownerY - body.minY, body.maxY - ownerY, 0.2);
  let radial =
    outwardHalf(side, bodyHalfX, bodyHalfY) +
    EXECUTIVE_STAGE_LABEL_POLICY.ownerGap +
    outwardHalf(side, paintedW / 2, paintedH / 2);
  const build = (distance: number) => {
    const offset = resolveExecutiveLabelWorldOffset(side, distance);
    const anchorX = stabilize(ownerX + offset.x);
    const anchorY = stabilize(ownerY + offset.y);
    return Object.freeze({
      rect: Object.freeze({
        minX: stabilize(anchorX - paintedW / 2),
        maxX: stabilize(anchorX + paintedW / 2),
        minY: stabilize(anchorY - paintedH / 2),
        maxY: stabilize(anchorY + paintedH / 2),
      }),
      offsetX: offset.x,
      offsetY: offset.y,
      ownerDistance: Math.hypot(offset.x, offset.y),
      anchorX,
      anchorY,
    });
  };
  let placed = build(radial);
  for (let step = 0; step < 8 && rectsOverlap(placed.rect, body, 0.02); step += 1) {
    radial += 0.06;
    placed = build(radial);
  }
  return placed;
}

function bodyRectForObject(
  object: ExecutiveStageLabelLayoutObjectInput,
  level: "minimum" | "report" | "operation",
): ExecutiveStageLabelRect {
  const roleHalf =
    object.halfExtent > 0 ? object.halfExtent : bodyHalfForRole(object.role, level);
  const geometry = resolveExecutiveObjectGeometryFamily({
    objectKind: object.kind && object.kind.trim().length > 0 ? object.kind : "object",
  });
  const halfW = Math.max(roleHalf, geometry.dimensions.width / 2);
  const halfH = Math.max(roleHalf, geometry.dimensions.height / 2);
  return Object.freeze({
    minX: object.x - halfW,
    maxX: object.x + halfW,
    minY: object.y - halfH,
    maxY: object.y + halfH,
  });
}

function labelExceedsViewport(
  rect: ExecutiveStageLabelRect,
  viewport: ExecutiveStageLabelViewport | null,
): boolean {
  const ndc = viewport?.ndc;
  if (viewport == null || ndc == null || viewport.width < 2 || viewport.height < 2) {
    return false;
  }
  const camera = resolveExecutiveStageFixedCamera();
  const aspect = viewport.width / viewport.height;
  const corners = [
    [rect.minX, rect.minY],
    [rect.maxX, rect.minY],
    [rect.minX, rect.maxY],
    [rect.maxX, rect.maxY],
  ] as const;
  for (const [x, y] of corners) {
    const projected = projectExecutiveObjectLabelToNdc({
      world: { x, y, z: 0 },
      cameraPosition: camera.position,
      cameraTarget: camera.target,
      fovDegrees: camera.fov,
      aspect,
    });
    if (!Number.isFinite(projected.x) || !Number.isFinite(projected.y)) return true;
    if (
      projected.x < ndc.left - 1e-4 ||
      projected.x > ndc.right + 1e-4 ||
      projected.y < ndc.bottom - 1e-4 ||
      projected.y > ndc.top + 1e-4
    ) {
      return true;
    }
  }
  return false;
}

export function resolveExecutiveStageSharedCaptionBox(input: {
  readonly ownerX: number;
  readonly ownerY: number;
  readonly halfExtent: number;
  readonly kind?: string;
  readonly lines: readonly string[];
  readonly side?: ExecutiveStageLabelSide;
  readonly viewportHeight?: number;
}): Readonly<{
  readonly offsetX: number;
  readonly offsetY: number;
  readonly rect: ExecutiveStageLabelRect;
}> {
  const side = input.side ?? "bottom";
  const footprint = labelFootprintForContent(
    "full",
    input.lines[0] ?? "",
    input.lines.length > 2 ? input.lines[2]! : input.lines.length > 1 ? null : null,
    input.lines.length > 2 ? input.lines[1]! : input.lines[1] ?? null,
    input.viewportHeight,
  );
  const body = bodyRectForObject(
    {
      id: "caption-owner",
      label: input.lines[0] ?? "",
      kind: input.kind,
      x: input.ownerX,
      y: input.ownerY,
      halfExtent: input.halfExtent,
    },
    "minimum",
  );
  const placement = makeLabelRect(
    input.ownerX,
    input.ownerY,
    body,
    side,
    footprint.paintedW,
    footprint.paintedH,
  );
  return Object.freeze({
    offsetX: placement.offsetX,
    offsetY: placement.offsetY,
    rect: placement.rect,
  });
}

function maxOwnerDistance(
  ownerHalf: number,
  halfW: number,
  halfH: number,
): number {
  return (
    (ownerHalf +
      EXECUTIVE_STAGE_LABEL_POLICY.ownerGap +
      Math.max(halfW, halfH)) *
    EXECUTIVE_STAGE_LABEL_POLICY.maxOwnerDistanceFactor
  );
}

function fitTopCenterInsideStage<T extends {
  readonly rect: ExecutiveStageLabelRect;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly anchorX: number;
  readonly anchorY: number;
  readonly ownerDistance: number;
}>(
  placement: T,
  usable: ExecutiveStageLabelRect,
  ownerBody: ExecutiveStageLabelRect,
): T | null {
  let dx = 0;
  let dy = 0;
  const overflowLeft = usable.minX - placement.rect.minX;
  const overflowRight = placement.rect.maxX - usable.maxX;
  if (overflowLeft > 1e-6 && overflowRight > 1e-6) return null;
  if (overflowLeft > 1e-6) dx = overflowLeft;
  else if (overflowRight > 1e-6) dx = -overflowRight;
  const shifted = (shiftX: number, shiftY: number): ExecutiveStageLabelRect =>
    Object.freeze({
      minX: stabilize(placement.rect.minX + shiftX),
      maxX: stabilize(placement.rect.maxX + shiftX),
      minY: stabilize(placement.rect.minY + shiftY),
      maxY: stabilize(placement.rect.maxY + shiftY),
    });
  for (let pass = 0; pass < 4; pass += 1) {
    const rect = shifted(dx, dy);
    let raise = 0;
    for (const region of EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardReservedRegions) {
      const bounds = {
        minX: region.minX,
        maxX: region.maxX,
        minY: region.minY,
        maxY: region.maxY,
      };
      if (!rectsOverlap(rect, bounds)) continue;
      raise = Math.max(raise, bounds.maxY - rect.minY + 0.03);
    }
    if (raise <= 1e-6) break;
    dy += raise;
  }
  if (dx === 0 && dy === 0) return placement;
  const rect = shifted(dx, dy);
  const inside =
    rect.minX >= usable.minX - 1e-6 &&
    rect.maxX <= usable.maxX + 1e-6 &&
    rect.minY >= usable.minY - 1e-6 &&
    rect.maxY <= usable.maxY + 1e-6 &&
    rect.minX < ownerBody.maxX &&
    rect.maxX > ownerBody.minX &&
    placement.anchorY + dy > ownerBody.maxY &&
    !labelIntersectsReserved(rect);
  if (!inside) return null;
  return Object.freeze({
    ...placement,
    rect,
    offsetX: stabilize(placement.offsetX + dx),
    offsetY: stabilize(placement.offsetY + dy),
    anchorX: stabilize(placement.anchorX + dx),
    anchorY: stabilize(placement.anchorY + dy),
    ownerDistance: Math.hypot(placement.offsetX + dx, placement.offsetY + dy),
  });
}

function labelIntersectsReserved(rect: ExecutiveStageLabelRect): boolean {
  for (const region of EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardReservedRegions) {
    if (
      rectsOverlap(rect, {
        minX: region.minX,
        maxX: region.maxX,
        minY: region.minY,
        maxY: region.maxY,
      })
    ) {
      return true;
    }
  }
  return false;
}

export type ExecutiveStageLabelLayoutObjectInput = Readonly<{
  readonly id: string;
  readonly label: string;
  readonly kind?: string;
  readonly status?: string;
  readonly attention?: string;
  readonly x: number;
  readonly y: number;
  readonly halfExtent: number;
  readonly role?: string;
  readonly focused?: boolean;
  readonly selected?: boolean;
  readonly labelVisible?: boolean;
  readonly disclosureState?: string;
  readonly opacity?: number;
  readonly valueText?: string | null;
}>;

export type ExecutiveStageLabelLayoutObstacle = Readonly<{
  readonly id: string;
  readonly bounds: ExecutiveStageLabelRect;
}>;

export type ExecutiveStageLabelLayoutResult = Readonly<{
  readonly byId: ReadonlyMap<string, ExecutiveStageObjectLabelOwnership>;
  readonly ownerships: readonly ExecutiveStageObjectLabelOwnership[];
  readonly visibleCount: number;
  readonly hiddenCount: number;
  readonly collisionCount: number;
  readonly bodyOverlapCount: number;
  readonly ownerViolationCount: number;
  readonly reservedCollisionCount: number;
  readonly clippedCount: number;
  readonly labelLabelOverlapCount: number;
}>;

function bodyHalfForRole(
  role: string | undefined,
  presentationState: string,
): number {
  const table =
    presentationState === "operation"
      ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.operation
      : presentationState === "report"
        ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.report
        : EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum;
  if (role === "focused" || role === "anchor") return table.anchor;
  if (role === "related") return table.related;
  if (role === "peripheral") return table.secondary;
  return table.background;
}

/**
 * Resolve owned label placements for all visible Stage objects.
 * Deterministic. Side vocabulary only. No free-float XY nudging.
 */
export function resolveExecutiveStageOwnedLabelPlacement(input: {
  readonly objects: readonly ExecutiveStageLabelLayoutObjectInput[];
  readonly obstacles?: readonly ExecutiveStageLabelLayoutObstacle[];
  readonly presentationLevel?: "minimum" | "report" | "operation";
  readonly anchorObjectId?: string | null;
  readonly viewport?: ExecutiveStageLabelViewport | null;
}): ExecutiveStageLabelLayoutResult {
  const level = input.presentationLevel ?? "minimum";
  const viewportHeight =
    input.viewport?.height ??
    EXECUTIVE_STAGE_LABEL_MEASUREMENT.referenceViewport.height;
  const obstacles = input.obstacles ?? [];
  const visibleObjects = input.objects
    .filter(
      (object) =>
        object.disclosureState !== "hidden" &&
        (object.opacity == null || object.opacity > 0.05) &&
        object.labelVisible !== false,
    )
    .slice()
    .sort((left, right) => {
      const rankDelta =
        resolveExecutiveStageLabelPriorityRank(right) -
        resolveExecutiveStageLabelPriorityRank(left);
      if (rankDelta !== 0) return rankDelta;
      return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
    });

  const bodyById = new Map<string, ExecutiveStageLabelRect>();
  for (const object of input.objects) {
    if (object.disclosureState === "hidden") continue;
    if (object.opacity != null && object.opacity <= 0.05) continue;
    bodyById.set(object.id, bodyRectForObject(object, level));
  }

  const placed: ExecutiveStageObjectLabelOwnership[] = [];
  const placedRects: ExecutiveStageLabelRect[] = [];
  let collisionCount = 0;
  let bodyOverlapCount = 0;
  let ownerViolationCount = 0;
  let reservedCollisionCount = 0;
  let clippedCount = 0;

  const considerSide = (
    object: ExecutiveStageLabelLayoutObjectInput,
    side: ExecutiveStageLabelSide,
    mode: Exclude<ExecutiveStageLabelVisibilityMode, "hidden">,
    reserved: readonly ExecutiveStageLabelRect[],
    preferred: ExecutiveStageLabelSide,
    labelClearance: number,
  ): ExecutiveStageObjectLabelOwnership | null => {
    const ownerHalf =
      object.halfExtent > 0
        ? object.halfExtent
        : bodyHalfForRole(object.role, level);
    const ownerBody = bodyById.get(object.id);
    if (ownerBody == null) return null;
    const content = resolveExecutiveStageOwnedLabelContent({
      objectName: object.label,
      objectKind: object.kind,
      status: object.status,
      valueText: object.valueText,
      presentationLevel: level,
      visibility: mode,
    });
    const footprint = labelFootprintForContent(
      mode,
      content.primaryLine,
      content.secondaryLine,
      content.valueLine,
      viewportHeight,
    );
    const placement = makeLabelRect(
      object.x,
      object.y,
      ownerBody,
      side,
      footprint.paintedW,
      footprint.paintedH,
    );
    if (!Number.isFinite(placement.anchorX) || !Number.isFinite(placement.anchorY)) return null;
    const usable = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect;
    const fitted =
      side === "top" ? fitTopCenterInsideStage(placement, usable, ownerBody) : placement;
    if (fitted == null) return null;
    if (fitted.ownerDistance > maxOwnerDistance(ownerHalf, footprint.w, footprint.h) + 1e-6) {
      return null;
    }
    if (
      fitted.rect.minX < usable.minX - 1e-6 ||
      fitted.rect.maxX > usable.maxX + 1e-6 ||
      fitted.rect.minY < usable.minY - 1e-6 ||
      fitted.rect.maxY > usable.maxY + 1e-6 ||
      labelExceedsViewport(fitted.rect, input.viewport ?? null) ||
      labelIntersectsReserved(fitted.rect) ||
      rectsOverlap(fitted.rect, ownerBody, 0.02)
    ) {
      return null;
    }
    for (const [bodyId, body] of bodyById) {
      if (bodyId !== object.id && rectsOverlap(fitted.rect, body, 0.02)) return null;
    }
    for (const obstacle of obstacles) {
      if (rectsOverlap(fitted.rect, obstacle.bounds, 0.02)) return null;
    }
    for (const other of reserved) {
      if (rectsOverlap(fitted.rect, other, labelClearance)) return null;
    }
    if (
      captionCloserToNeighborThanOwner(
        fitted.anchorX,
        fitted.anchorY,
        object.id,
        bodyById,
        EXECUTIVE_STAGE_LABEL_POLICY.associationPad,
      )
    ) {
      return null;
    }
    return Object.freeze({
      ownerObjectId: object.id,
      labelId: `label-${object.id}`,
      preferredSide: preferred,
      resolvedSide: side,
      anchorPoint: Object.freeze([object.x, object.y] as const),
      bounds: fitted.rect,
      territoryBounds: Object.freeze({
        minX: object.x - ownerHalf - footprint.w - EXECUTIVE_STAGE_LABEL_POLICY.ownerGap,
        maxX: object.x + ownerHalf + footprint.w + EXECUTIVE_STAGE_LABEL_POLICY.ownerGap,
        minY: object.y - ownerHalf - footprint.h - EXECUTIVE_STAGE_LABEL_POLICY.ownerGap,
        maxY: object.y + ownerHalf + footprint.h + EXECUTIVE_STAGE_LABEL_POLICY.ownerGap,
      }),
      ownerDistance: fitted.ownerDistance,
      visibility: mode,
      primaryLine: content.primaryLine,
      secondaryLine: content.secondaryLine,
      valueLine: content.valueLine,
      worldOffsetX: fitted.offsetX,
      worldOffsetY: fitted.offsetY,
      priorityRank: resolveExecutiveStageLabelPriorityRank(object),
    });
  };

  const hardLabelGap = EXECUTIVE_STAGE_LABEL_MEASUREMENT.hardLabelGapWorld;
  const readableGap = Math.max(
    hardLabelGap,
    executiveStageLabelReadabilityGapWorld(viewportHeight),
  );
  const trySharedBatch = (
    clearance: number,
  ): readonly ExecutiveStageObjectLabelOwnership[] | null => {
    for (const mode of ["full"] as const) {
      for (const side of ["top-right"] as const) {
        const reserved: ExecutiveStageLabelRect[] = [];
        const batch: ExecutiveStageObjectLabelOwnership[] = [];
        let fits = true;
        for (const object of visibleObjects) {
          const hit = considerSide(object, side, mode, reserved, side, clearance);
          if (hit == null) {
            fits = false;
            break;
          }
          batch.push(hit);
          reserved.push(hit.bounds);
        }
        if (fits && batch.length === visibleObjects.length && batch.length > 0) {
          return batch;
        }
      }
    }
    return null;
  };
  const sharedBatch = trySharedBatch(readableGap);
  if (sharedBatch != null) {
    for (const ownership of sharedBatch) {
      placed.push(ownership);
      if (ownership.visibility !== "hidden") placedRects.push(ownership.bounds);
    }
  }

  if (sharedBatch == null) {
    const plans = visibleObjects.map((object) => {
      const ownerHalf =
        object.halfExtent > 0
          ? object.halfExtent
          : bodyHalfForRole(object.role, level);
      const nearestForeign = (() => {
        let best: { x: number; y: number; dist: number } | null = null;
        for (const other of input.objects) {
          if (other.id === object.id) continue;
          if (other.disclosureState === "hidden") continue;
          if (other.opacity != null && other.opacity <= 0.05) continue;
          const dist = Math.hypot(object.x - other.x, object.y - other.y);
          if (best == null || dist < best.dist) {
            best = { x: other.x, y: other.y, dist };
          }
        }
        return best;
      })();
      const preferred = resolveExecutiveStageLabelPreferredSide({
        objectX: object.x,
        objectY: object.y,
        focused: object.focused === true || object.id === input.anchorObjectId,
        role: object.role,
        nearestForeign:
          nearestForeign != null && nearestForeign.dist < 2.4
            ? { x: nearestForeign.x, y: nearestForeign.y }
            : null,
      });
      const sides = sidePreferenceList(
        preferred,
        object.focused === true || object.id === input.anchorObjectId,
        nearestForeign != null && nearestForeign.dist < 2.4
          ? { x: nearestForeign.x, y: nearestForeign.y }
          : null,
        object.x,
        object.y,
      );
      return { object, ownerHalf, preferred, sides };
    });
    const modes: Exclude<ExecutiveStageLabelVisibilityMode, "hidden">[] = [
      "full",
      "compact",
      "minimal",
    ];
    const search: { placed: ExecutiveStageObjectLabelOwnership[] | null } = { placed: null };
    let bestGap = -1;
    const exhaustive = plans.length <= 6;
    if (exhaustive) {
      const chosen: ExecutiveStageObjectLabelOwnership[] = [];
      const walk = (
        index: number,
        runningMin: number,
        mode: (typeof modes)[number],
        budget: { nodes: number },
      ) => {
        if (budget.nodes > 80000 || bestGap + 1e-6 >= readableGap) return;
        if (runningMin <= bestGap + 1e-6) return;
        if (index >= plans.length) {
          bestGap = runningMin;
          search.placed = chosen.slice();
          return;
        }
        const plan = plans[index]!;
        for (const side of plan.sides) {
          budget.nodes += 1;
          const hit = considerSide(
            plan.object,
            side,
            mode,
            chosen.map((entry) => entry.bounds),
            plan.preferred,
            hardLabelGap,
          );
          if (hit == null) continue;
          let nextMin = runningMin;
          for (const previous of chosen) {
            nextMin = Math.min(nextMin, separationWorld(hit.bounds, previous.bounds));
          }
          if (nextMin <= bestGap + 1e-6) continue;
          chosen.push(hit);
          walk(index + 1, nextMin, mode, budget);
          chosen.pop();
          if (bestGap + 1e-6 >= readableGap) return;
        }
      };
      for (const mode of modes) {
        if (search.placed != null) break;
        bestGap = -1;
        walk(0, Number.POSITIVE_INFINITY, mode, { nodes: 0 });
      }
    }
    if (search.placed != null) {
      for (const ownership of search.placed) {
        placed.push(ownership);
        placedRects.push(ownership.bounds);
      }
    } else {
      for (const plan of plans) {
        let resolved: ExecutiveStageObjectLabelOwnership | null = null;
        for (const mode of modes) {
          if (resolved != null) break;
          for (const side of plan.sides) {
            const hit = considerSide(
              plan.object,
              side,
              mode,
              placedRects,
              plan.preferred,
              hardLabelGap,
            );
            if (hit == null) continue;
            resolved = hit;
            break;
          }
        }
        if (resolved == null) {
          collisionCount += 1;
          const content = resolveExecutiveStageOwnedLabelContent({
            objectName: plan.object.label,
            objectKind: plan.object.kind,
            status: plan.object.status,
            presentationLevel: level,
            visibility: "hidden",
          });
          placed.push(
            Object.freeze({
              ownerObjectId: plan.object.id,
              labelId: `label-${plan.object.id}`,
              preferredSide: plan.preferred,
              resolvedSide: plan.preferred,
              anchorPoint: Object.freeze([plan.object.x, plan.object.y] as const),
              bounds: Object.freeze({
                minX: plan.object.x,
                maxX: plan.object.x,
                minY: plan.object.y,
                maxY: plan.object.y,
              }),
              territoryBounds: Object.freeze({
                minX: plan.object.x - plan.ownerHalf,
                maxX: plan.object.x + plan.ownerHalf,
                minY: plan.object.y - plan.ownerHalf,
                maxY: plan.object.y + plan.ownerHalf,
              }),
              ownerDistance: 0,
              visibility: "hidden" as const,
              primaryLine: content.primaryLine,
              secondaryLine: null,
              valueLine: null,
              worldOffsetX: 0,
              worldOffsetY: 0,
              priorityRank: resolveExecutiveStageLabelPriorityRank(plan.object),
            }),
          );
          continue;
        }
        placed.push(resolved);
        placedRects.push(resolved.bounds);
      }
    }
  }

  for (const ownership of placed) {
    if (ownership.visibility === "hidden") continue;
    const usable = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect;
    if (
      ownership.bounds.minX < usable.minX - 1e-6 ||
      ownership.bounds.maxX > usable.maxX + 1e-6 ||
      ownership.bounds.minY < usable.minY - 1e-6 ||
      ownership.bounds.maxY > usable.maxY + 1e-6
    ) {
      clippedCount += 1;
    }
    if (labelIntersectsReserved(ownership.bounds)) {
      reservedCollisionCount += 1;
    }
    for (const [bodyId, body] of bodyById) {
      if (bodyId === ownership.ownerObjectId) continue;
      if (rectsOverlap(ownership.bounds, body)) bodyOverlapCount += 1;
    }
    const anchorX = ownership.anchorPoint[0] + ownership.worldOffsetX;
    const anchorY = ownership.anchorPoint[1] + ownership.worldOffsetY;
    if (
      captionCloserToNeighborThanOwner(
        anchorX,
        anchorY,
        ownership.ownerObjectId,
        bodyById,
        EXECUTIVE_STAGE_LABEL_POLICY.associationPad,
      )
    ) {
      ownerViolationCount += 1;
    }
  }

  let labelLabelOverlapCount = 0;
  for (let i = 0; i < placed.length; i += 1) {
    const left = placed[i]!;
    if (left.visibility === "hidden") continue;
    for (let j = i + 1; j < placed.length; j += 1) {
      const right = placed[j]!;
      if (right.visibility === "hidden") continue;
      if (rectsOverlap(left.bounds, right.bounds)) labelLabelOverlapCount += 1;
    }
  }

  const byId = new Map<string, ExecutiveStageObjectLabelOwnership>();
  for (const ownership of placed) {
    byId.set(ownership.ownerObjectId, ownership);
  }

  const visibleCount = placed.filter(
    (entry) => entry.visibility !== "hidden",
  ).length;

  return Object.freeze({
    byId,
    ownerships: Object.freeze(placed),
    visibleCount,
    hiddenCount: placed.length - visibleCount,
    collisionCount,
    bodyOverlapCount,
    ownerViolationCount,
    reservedCollisionCount,
    clippedCount,
    labelLabelOverlapCount,
  });
}

export function validateExecutiveStageLabelOwnership(
  result: ExecutiveStageLabelLayoutResult,
): Readonly<{
  readonly ok: boolean;
  readonly bodyOverlapCount: number;
  readonly labelLabelOverlapCount: number;
  readonly ownerViolationCount: number;
  readonly reservedCollisionCount: number;
  readonly clippedCount: number;
}> {
  return Object.freeze({
    ok:
      result.bodyOverlapCount === 0 &&
      result.labelLabelOverlapCount === 0 &&
      result.ownerViolationCount === 0 &&
      result.reservedCollisionCount === 0 &&
      result.clippedCount === 0,
    bodyOverlapCount: result.bodyOverlapCount,
    labelLabelOverlapCount: result.labelLabelOverlapCount,
    ownerViolationCount: result.ownerViolationCount,
    reservedCollisionCount: result.reservedCollisionCount,
    clippedCount: result.clippedCount,
  });
}

export function buildExecutiveThreadGatewayLabelObstacle(input: {
  readonly x: number;
  readonly y: number;
  readonly mode?: "discoverable-collapsed" | "quiet-collapse";
}): ExecutiveStageLabelLayoutObstacle {
  const halfW =
    input.mode === "quiet-collapse"
      ? EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.collapseHalfWidth
      : EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfWidth;
  const halfH =
    input.mode === "quiet-collapse"
      ? EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.collapseHalfHeight
      : EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfHeight;
  return Object.freeze({
    id: "executive-thread-gateway",
    bounds: Object.freeze({
      minX: input.x - halfW,
      maxX: input.x + halfW,
      minY: input.y - halfH,
      maxY: input.y + halfH,
    }),
  });
}

export function getExecutiveStageObjectLabelObservability(input?: {
  readonly visibleCount?: number;
  readonly hiddenCount?: number;
  readonly collisionCount?: number;
  readonly bodyOverlapCount?: number;
  readonly ownerViolationCount?: number;
  readonly reservedCollisionCount?: number;
  readonly clippedCount?: number;
}): Readonly<{
  readonly contract: "stage-label-1";
  readonly identity: string;
  readonly version: string;
  readonly visibleCount: string;
  readonly hiddenCount: string;
  readonly collisionCount: string;
  readonly bodyOverlapCount: string;
  readonly ownerViolationCount: string;
  readonly reservedCollisionCount: string;
  readonly clippedCount: string;
}> {
  return Object.freeze({
    contract: "stage-label-1",
    identity: executiveStageObjectLabelTerritoryIdentity,
    version: executiveStageObjectLabelTerritoryVersion,
    visibleCount: String(input?.visibleCount ?? 0),
    hiddenCount: String(input?.hiddenCount ?? 0),
    collisionCount: String(input?.collisionCount ?? 0),
    bodyOverlapCount: String(input?.bodyOverlapCount ?? 0),
    ownerViolationCount: String(input?.ownerViolationCount ?? 0),
    reservedCollisionCount: String(input?.reservedCollisionCount ?? 0),
    clippedCount: String(input?.clippedCount ?? 0),
  });
}

export function verifyExecutiveStageObjectLabelTerritory(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly cameraSafe: boolean;
  readonly noFreeFloat: boolean;
}> {
  const identity = getExecutiveStageObjectLabelTerritoryIdentity();
  return Object.freeze({
    ok:
      identity.id ===
        "STAGE-LABEL:1/ObjectOwnedLabelTerritoryCollisionAuthority" &&
      identity.version === "6.1.0" &&
      EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.movesCamera === false &&
      EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.freeFloatDisplacement ===
        false,
    identityValid:
      identity.id ===
      "STAGE-LABEL:1/ObjectOwnedLabelTerritoryCollisionAuthority",
    cameraSafe:
      EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.movesCamera === false,
    noFreeFloat:
      EXECUTIVE_STAGE_OBJECT_LABEL_TERRITORY_BOUNDARY.freeFloatDisplacement ===
      false,
  });
}
