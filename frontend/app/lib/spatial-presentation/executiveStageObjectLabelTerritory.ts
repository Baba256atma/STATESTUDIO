/**
 * STAGE-LABEL:1 — Object-Owned Label Territory & Collision Authority.
 *
 * Final authority for Stage label placement. Labels adapt to objects;
 * objects never chase labels. No Z, no camera, no topology changes.
 */

import {
  EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT,
  resolveExecutiveStage2DVisibleBounds,
} from "./executiveStage2DHardSeparation.ts";
import { EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION } from "./executiveStageReservedRegionContainment.ts";
import {
  EXECUTIVE_STAGE_LABEL_SECTOR_TO_SIDE,
  formatExecutiveObjectStageLabel,
  resolveExecutiveLabelWorldOffset,
  resolveExecutiveStageAngularSector,
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
  readonly worldOffsetX: number;
  readonly worldOffsetY: number;
  readonly priorityRank: number;
}>;

export const EXECUTIVE_STAGE_LABEL_POLICY = Object.freeze({
  ownerGap: 0.12,
  maxOwnerDistanceFactor: 1.55,
  labelHalf: Object.freeze({
    full: Object.freeze({ w: 0.55, h: 0.24 }),
    compact: Object.freeze({ w: 0.46, h: 0.2 }),
    minimal: Object.freeze({ w: 0.38, h: 0.15 }),
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
});

const SIDE_SET = new Set<string>(EXECUTIVE_STAGE_LABEL_POLICY.sideOrder);

function stabilize(value: number): number {
  return Math.round(value * 1e6) / 1e6;
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

function rectCenter(rect: ExecutiveStageLabelRect): Readonly<{
  readonly x: number;
  readonly y: number;
}> {
  return Object.freeze({
    x: (rect.minX + rect.maxX) * 0.5,
    y: (rect.minY + rect.maxY) * 0.5,
  });
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
  readonly presentationLevel?: "minimum" | "report" | "operation";
  readonly visibility?: ExecutiveStageLabelVisibilityMode;
}): Readonly<{
  readonly primaryLine: string;
  readonly secondaryLine: string | null;
}> {
  const visibility = input.visibility ?? "full";
  if (visibility === "hidden") {
    return Object.freeze({ primaryLine: "", secondaryLine: null });
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
  if (visibility === "minimal") {
    secondary = null;
  } else if (isWork) {
    secondary = kind.charAt(0).toUpperCase() + kind.slice(1);
  } else if (statusLooksLikeState && statusToken.length > 0) {
    if (!primary.toLowerCase().includes(statusToken)) {
      secondary = statusToken.toUpperCase();
    }
  }

  if (visibility === "compact") {
    if (
      secondary != null &&
      primary.toLowerCase().includes(secondary.toLowerCase())
    ) {
      secondary = null;
    }
  }

  return Object.freeze({
    primaryLine: primary,
    secondaryLine: secondary,
  });
}

export function resolveExecutiveStageLabelPreferredSide(input: {
  readonly objectX: number;
  readonly objectY: number;
  readonly focused?: boolean;
  readonly role?: string | null;
  readonly nearestForeign?: Readonly<{ readonly x: number; readonly y: number }> | null;
}): ExecutiveStageLabelSide {
  if (input.focused || input.role === "focused") return "top";
  if (input.nearestForeign != null) {
    const dx = input.objectX - input.nearestForeign.x;
    const dy = input.objectY - input.nearestForeign.y;
    // Prefer the side pointing away from the nearest foreign body.
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx >= 0 && dy >= 0) return "top-right";
      if (dx >= 0 && dy < 0) return "bottom-right";
      if (dx < 0 && dy >= 0) return "top-left";
      return "bottom-left";
    }
    if (dy >= 0) return dx >= 0 ? "top-right" : "top-left";
    return dx >= 0 ? "bottom-right" : "bottom-left";
  }
  const sector = resolveExecutiveStageAngularSector(
    input.objectX,
    input.objectY,
  );
  return EXECUTIVE_STAGE_LABEL_SECTOR_TO_SIDE[sector];
}

function sidePreferenceList(
  preferred: ExecutiveStageLabelSide,
  focused: boolean,
): readonly ExecutiveStageLabelSide[] {
  const base = focused
    ? EXECUTIVE_STAGE_LABEL_POLICY.anchorPreferred
    : EXECUTIVE_STAGE_LABEL_POLICY.sideOrder;
  const ordered: ExecutiveStageLabelSide[] = [preferred];
  for (const side of base) {
    if (!ordered.includes(side)) ordered.push(side);
  }
  for (const side of EXECUTIVE_STAGE_LABEL_POLICY.sideOrder) {
    if (!ordered.includes(side)) ordered.push(side);
  }
  return Object.freeze(ordered);
}

function labelHalfForMode(
  mode: Exclude<ExecutiveStageLabelVisibilityMode, "hidden">,
): Readonly<{ readonly w: number; readonly h: number }> {
  return EXECUTIVE_STAGE_LABEL_POLICY.labelHalf[mode];
}

function makeLabelRect(
  ownerX: number,
  ownerY: number,
  ownerHalf: number,
  side: ExecutiveStageLabelSide,
  halfW: number,
  halfH: number,
): Readonly<{
  readonly rect: ExecutiveStageLabelRect;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly ownerDistance: number;
}> {
  const radial =
    ownerHalf +
    EXECUTIVE_STAGE_LABEL_POLICY.ownerGap +
    Math.max(halfH, halfW * 0.35);
  const offset = resolveExecutiveLabelWorldOffset(side, radial);
  const centerX = stabilize(ownerX + offset.x);
  const centerY = stabilize(ownerY + offset.y);
  return Object.freeze({
    rect: Object.freeze({
      minX: centerX - halfW,
      maxX: centerX + halfW,
      minY: centerY - halfH,
      maxY: centerY + halfH,
    }),
    offsetX: offset.x,
    offsetY: offset.y,
    ownerDistance: Math.hypot(offset.x, offset.y),
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
}): ExecutiveStageLabelLayoutResult {
  const level = input.presentationLevel ?? "minimum";
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
    const half =
      object.halfExtent > 0
        ? object.halfExtent
        : bodyHalfForRole(object.role, level);
    bodyById.set(
      object.id,
      resolveExecutiveStage2DVisibleBounds(object.x, object.y, half),
    );
  }

  const placed: ExecutiveStageObjectLabelOwnership[] = [];
  const placedRects: ExecutiveStageLabelRect[] = [];
  let collisionCount = 0;
  let bodyOverlapCount = 0;
  let ownerViolationCount = 0;
  let reservedCollisionCount = 0;
  let clippedCount = 0;

  for (const object of visibleObjects) {
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
    );
    const modes: Exclude<ExecutiveStageLabelVisibilityMode, "hidden">[] = [
      "full",
      "compact",
      "minimal",
    ];

    let resolved: ExecutiveStageObjectLabelOwnership | null = null;

    for (const mode of modes) {
      const half = labelHalfForMode(mode);
      const maxDist = maxOwnerDistance(ownerHalf, half.w, half.h);
      for (const side of sides) {
        const placement = makeLabelRect(
          object.x,
          object.y,
          ownerHalf,
          side,
          half.w,
          half.h,
        );
        if (placement.ownerDistance > maxDist + 1e-6) continue;

        const usable = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect;
        const clipped =
          placement.rect.minX < usable.minX - 1e-6 ||
          placement.rect.maxX > usable.maxX + 1e-6 ||
          placement.rect.minY < usable.minY - 1e-6 ||
          placement.rect.maxY > usable.maxY + 1e-6;
        if (clipped) continue;
        if (labelIntersectsReserved(placement.rect)) continue;

        let hitsForeignBody = false;
        for (const [bodyId, body] of bodyById) {
          if (bodyId === object.id) continue;
          if (rectsOverlap(placement.rect, body, 0.02)) {
            hitsForeignBody = true;
            break;
          }
        }
        if (hitsForeignBody) continue;

        let hitsObstacle = false;
        for (const obstacle of obstacles) {
          if (rectsOverlap(placement.rect, obstacle.bounds, 0.02)) {
            hitsObstacle = true;
            break;
          }
        }
        if (hitsObstacle) continue;

        let hitsLabel = false;
        for (const other of placedRects) {
          if (rectsOverlap(placement.rect, other, 0.04)) {
            hitsLabel = true;
            break;
          }
        }
        if (hitsLabel) continue;

        const center = rectCenter(placement.rect);
        const ownerDist = Math.hypot(center.x - object.x, center.y - object.y);
        let ownerViolation = false;
        for (const other of input.objects) {
          if (other.id === object.id) continue;
          if (other.disclosureState === "hidden") continue;
          if (other.opacity != null && other.opacity <= 0.05) continue;
          const otherDist = Math.hypot(center.x - other.x, center.y - other.y);
          // Owner must be clearly closer (perceptual attachment).
          if (otherDist + 0.28 < ownerDist) {
            ownerViolation = true;
            break;
          }
        }
        if (ownerViolation) continue;

        const content = resolveExecutiveStageOwnedLabelContent({
          objectName: object.label,
          objectKind: object.kind,
          status: object.status,
          presentationLevel: level,
          visibility: mode,
        });
        const territory = Object.freeze({
          minX:
            object.x -
            ownerHalf -
            half.w -
            EXECUTIVE_STAGE_LABEL_POLICY.ownerGap,
          maxX:
            object.x +
            ownerHalf +
            half.w +
            EXECUTIVE_STAGE_LABEL_POLICY.ownerGap,
          minY:
            object.y -
            ownerHalf -
            half.h -
            EXECUTIVE_STAGE_LABEL_POLICY.ownerGap,
          maxY:
            object.y +
            ownerHalf +
            half.h +
            EXECUTIVE_STAGE_LABEL_POLICY.ownerGap,
        });

        resolved = Object.freeze({
          ownerObjectId: object.id,
          labelId: `label-${object.id}`,
          preferredSide: preferred,
          resolvedSide: side,
          anchorPoint: Object.freeze([object.x, object.y] as const),
          bounds: placement.rect,
          territoryBounds: territory,
          ownerDistance: placement.ownerDistance,
          visibility: mode,
          primaryLine: content.primaryLine,
          secondaryLine: content.secondaryLine,
          worldOffsetX: placement.offsetX,
          worldOffsetY: placement.offsetY,
          priorityRank: resolveExecutiveStageLabelPriorityRank(object),
        });
        break;
      }
      if (resolved != null) break;
    }

    if (resolved == null) {
      collisionCount += 1;
      const content = resolveExecutiveStageOwnedLabelContent({
        objectName: object.label,
        objectKind: object.kind,
        status: object.status,
        presentationLevel: level,
        visibility: "hidden",
      });
      placed.push(
        Object.freeze({
          ownerObjectId: object.id,
          labelId: `label-${object.id}`,
          preferredSide: preferred,
          resolvedSide: preferred,
          anchorPoint: Object.freeze([object.x, object.y] as const),
          bounds: Object.freeze({
            minX: object.x,
            maxX: object.x,
            minY: object.y,
            maxY: object.y,
          }),
          territoryBounds: Object.freeze({
            minX: object.x - ownerHalf,
            maxX: object.x + ownerHalf,
            minY: object.y - ownerHalf,
            maxY: object.y + ownerHalf,
          }),
          ownerDistance: 0,
          visibility: "hidden" as const,
          primaryLine: content.primaryLine,
          secondaryLine: null,
          worldOffsetX: 0,
          worldOffsetY: 0,
          priorityRank: resolveExecutiveStageLabelPriorityRank(object),
        }),
      );
      continue;
    }

    placed.push(resolved);
    if (resolved.visibility !== "hidden") {
      placedRects.push(resolved.bounds);
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
    const center = rectCenter(ownership.bounds);
    const ownerBody = bodyById.get(ownership.ownerObjectId);
    if (ownerBody) {
      const ownerDist = Math.max(
        0,
        distancePointToRect(center.x, center.y, ownerBody),
      );
      for (const [bodyId, body] of bodyById) {
        if (bodyId === ownership.ownerObjectId) continue;
        const otherDist = Math.max(
          0,
          distancePointToRect(center.x, center.y, body),
        );
        if (otherDist + 0.08 < ownerDist) ownerViolationCount += 1;
      }
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
