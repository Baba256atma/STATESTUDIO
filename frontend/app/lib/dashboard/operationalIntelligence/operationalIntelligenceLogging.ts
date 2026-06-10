/**
 * Phase 4:2 — Operational Intelligence logging.
 */

import type {
  DemandImpactCard,
  OperationalHealthCard,
  OperationalIntelligenceSurfaceModel,
  OperationalPressureCard,
  OperationalSignalsCard,
} from "./operationalIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportOperationalIntelligence(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `op:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][OperationalIntelligence]", detail);
}

export function reportOperationalHealth(health: OperationalHealthCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `health:${health.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][OperationalHealth]", health);
}

export function reportOperationalSignal(signals: OperationalSignalsCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `signal:${signals.signalCount}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][OperationalSignal]", signals);
}

export function reportOperationalPressure(pressure: OperationalPressureCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `pressure:${pressure.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][OperationalPressure]", pressure);
}

export function reportDemandImpact(demand: DemandImpactCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `demand:${demand.direction}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][DemandImpact]", demand);
}

export function reportOperationalIntelligenceSurface(model: OperationalIntelligenceSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.headline}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][OperationalIntelligence]", {
    surfaceId: model.surfaceId,
    owner: model.owner,
    headline: model.headline,
    contextSources: model.contextSources,
    health: model.snapshot.health.level,
    pressure: model.snapshot.pressure.level,
    demand: model.snapshot.demandImpact.direction,
  });
}

export function resetOperationalIntelligenceLoggingForTests(): void {
  loggedKeys.clear();
}
