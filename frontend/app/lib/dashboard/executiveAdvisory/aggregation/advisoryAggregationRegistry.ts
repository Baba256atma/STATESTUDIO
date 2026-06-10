/**
 * Phase 5:2 — Advisory Aggregation Registry.
 * Only registered intelligence sources may contribute advisory inputs.
 */

import type { AdvisoryInputSource } from "./advisoryContextContract.ts";

export const ADVISORY_AGGREGATION_REGISTRY_VERSION = "5.2.0";

export type AdvisoryAggregationRegistryEntry = Readonly<{
  source: AdvisoryInputSource;
  feedOwner: string;
  domainCount: number;
  description: string;
}>;

export const ADVISORY_AGGREGATION_REGISTRY: readonly AdvisoryAggregationRegistryEntry[] = Object.freeze([
  Object.freeze({
    source: "operational",
    feedOwner: "operationalIntelligenceRuntime",
    domainCount: 4,
    description: "Operational health, pressure, signals, and demand impact",
  }),
  Object.freeze({
    source: "risk",
    feedOwner: "riskIntelligenceRuntime",
    domainCount: 4,
    description: "Risk exposure, momentum, confidence, and executive attention",
  }),
  Object.freeze({
    source: "timeline",
    feedOwner: "timelineIntelligenceRuntime",
    domainCount: 4,
    description: "Timeline momentum, milestone pressure, drift, and decision windows",
  }),
  Object.freeze({
    source: "scenario",
    feedOwner: "scenarioIntelligenceRuntime",
    domainCount: 4,
    description: "Expected impact, confidence, tradeoffs, and investigation paths",
  }),
  Object.freeze({
    source: "war_room",
    feedOwner: "warRoomIntelligenceRuntime",
    domainCount: 4,
    description: "Situation overview, critical risks, decision focus, and scenario comparison",
  }),
]);

const registeredSources = new Set<AdvisoryInputSource>(
  ADVISORY_AGGREGATION_REGISTRY.map((entry) => entry.source)
);

export function listRegisteredAdvisorySources(): readonly AdvisoryInputSource[] {
  return Object.freeze([...registeredSources]);
}

export function isRegisteredAdvisorySource(source: AdvisoryInputSource): boolean {
  return registeredSources.has(source);
}

export function getAdvisoryAggregationRegistryEntry(
  source: AdvisoryInputSource
): AdvisoryAggregationRegistryEntry | undefined {
  return ADVISORY_AGGREGATION_REGISTRY.find((entry) => entry.source === source);
}
