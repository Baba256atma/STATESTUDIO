/**
 * Phase 6:2 — Strategic Alignment logging.
 */

import type {
  StrategicAlignmentSnapshot,
  StrategicAlignmentSurfaceModel,
} from "./strategicAlignmentContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportStrategicAlignment(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `strategic:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StrategicAlignment]", detail);
}

export function reportObjectiveImpact(
  objectives: StrategicAlignmentSnapshot["objectivesImpact"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `objective:${objectives.objectives.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ObjectiveImpact]", objectives);
}

export function reportStrategicDirection(
  direction: StrategicAlignmentSnapshot["strategicDirection"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `direction:${direction.direction}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StrategicDirection]", direction);
}

export function reportStrategicTradeoff(
  tradeoffs: StrategicAlignmentSnapshot["strategicTradeoffs"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `tradeoff:${tradeoffs.tradeoffs.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StrategicTradeoff]", tradeoffs);
}

export function reportStrategicTension(tension: StrategicAlignmentSnapshot["strategicTension"]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `tension:${tension.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StrategicTension]", tension);
}

export function reportStrategicConfidence(
  confidence: StrategicAlignmentSnapshot["strategicConfidence"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `confidence:${confidence.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StrategicConfidence]", confidence);
}

export function reportStrategicAttention(
  attention: StrategicAlignmentSnapshot["strategicAttention"]
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `attention:${attention.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StrategicAttention]", attention);
}

export function reportStrategicAlignmentSurface(model: StrategicAlignmentSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.snapshot.alignmentScore.score}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][StrategicAlignment]", {
    surfaceId: model.surfaceId,
    score: model.snapshot.alignmentScore.score,
    attention: model.snapshot.strategicAttention.level,
  });
}

export function resetStrategicAlignmentLoggingForTests(): void {
  loggedKeys.clear();
}
