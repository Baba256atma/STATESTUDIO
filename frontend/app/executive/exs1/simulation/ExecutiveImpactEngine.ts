/**
 * Phase D — Impact Engine (affected objects, direction, level, dependencies).
 * No business optimization.
 */

import type { Exs1ObjectId } from "../exs1Types";
import type { ExecutiveMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import { getObjectMetadata } from "../metadata/ExecutiveMetadataRegistry";
import type { ExecutiveFutureState } from "./ExecutiveFutureState";
import type { ImpactDirection, ImpactLevel } from "./ExecutiveSimulationConfig";

export type ObjectImpact = {
  readonly objectId: Exs1ObjectId;
  readonly label: string;
  readonly direction: ImpactDirection;
  readonly level: ImpactLevel;
  readonly delta: number;
  readonly dependencies: readonly Exs1ObjectId[];
};

export type ExecutiveImpactResult = {
  readonly affectedObjectIds: readonly Exs1ObjectId[];
  readonly impacts: readonly ObjectImpact[];
  readonly summary: string;
};

function directionFor(delta: number): ImpactDirection {
  if (delta > 0) return "Up";
  if (delta < 0) return "Down";
  return "Neutral";
}

function levelFor(delta: number): ImpactLevel {
  const abs = Math.abs(delta);
  if (abs >= 100) return "High";
  if (abs >= 20) return "Medium";
  return "Low";
}

export function runImpactEngine(
  future: ExecutiveFutureState,
  catalog: ExecutiveMetadataCatalog | null,
): ExecutiveImpactResult {
  const impacts: ObjectImpact[] = future.objects
    .filter((o) => o.delta !== 0)
    .map((object) => {
      const meta = catalog
        ? getObjectMetadata(catalog, object.objectId)
        : undefined;
      return {
        objectId: object.objectId,
        label: object.label,
        direction: directionFor(object.delta),
        level: levelFor(object.delta),
        delta: object.delta,
        dependencies: meta?.relatedObjectIds ?? [],
      };
    })
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const affectedObjectIds = impacts.map((i) => i.objectId);
  const summary =
    impacts.length === 0
      ? "No material executive object impacts."
      : `${impacts.length} objects impacted · lead ${impacts[0]!.label} (${impacts[0]!.direction} ${impacts[0]!.level}).`;

  return { affectedObjectIds, impacts, summary };
}
