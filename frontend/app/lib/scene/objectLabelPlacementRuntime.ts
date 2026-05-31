/** E2:58 / E2:66 — Object label placement with relationship-aware offsets. */

import {
  traceObjectLabelCached,
  traceObjectLabelComputed,
} from "./objectLabelDiagnosticGuard";
import { buildObjectLabelPlacementSignature } from "./objectLabelSignature";
import { getObjectLabelCached, setObjectLabelCached } from "./objectLabelRuntimeCache";
import type { ObjectNameRenderingProfile } from "./objectNameRenderingProfile";

export type ObjectLabelPlacementInput = {
  baseScaleY: number;
  objectScale: number;
  profile: ObjectNameRenderingProfile;
  index: number;
  objectCount: number;
  neighborOffset?: number;
  relationshipDensity?: number;
};

export type ObjectLabelPlacement = {
  y: number;
  x: number;
  z: number;
};

function computeObjectLabelPlacement(input: ObjectLabelPlacementInput): ObjectLabelPlacement {
  const scale = input.baseScaleY * input.objectScale;
  const baseY = scale * input.profile.offsetYMultiplier + input.profile.offsetYBase;
  const stagger =
    input.objectCount > 25 ? (input.index % 3) * 0.04 : input.objectCount > 10 ? (input.index % 2) * 0.03 : 0;
  const relationshipOffset = Math.min(0.18, (input.relationshipDensity ?? 0) * 0.04);
  const neighborOffset = Math.min(0.12, input.neighborOffset ?? 0);
  const y = baseY + stagger + relationshipOffset + neighborOffset;
  return { y, x: 0, z: 0 };
}

export function resolveObjectLabelPlacement(input: ObjectLabelPlacementInput): ObjectLabelPlacement {
  const signature = buildObjectLabelPlacementSignature(input);
  const cached = getObjectLabelCached<ObjectLabelPlacement>("placement", signature);
  if (cached) {
    traceObjectLabelCached("placement", signature);
    return cached;
  }

  const placement = computeObjectLabelPlacement(input);
  setObjectLabelCached("placement", signature, placement);
  traceObjectLabelComputed("placement", signature, {
    index: input.index,
    y: Number(placement.y.toFixed(3)),
    objectCount: input.objectCount,
    relationshipDensity: input.relationshipDensity ?? 0,
  });
  return placement;
}

export function resetObjectLabelPlacementLogsForTests(): void {
  /* retained for test compatibility */
}
