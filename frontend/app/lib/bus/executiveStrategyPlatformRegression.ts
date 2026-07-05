import { EXECUTIVE_STRATEGY_PLATFORM_REGISTRY, listExecutiveStrategyPublicApis } from "./executiveStrategyIndex.ts";
import {
  EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
} from "./executiveStrategyDefinitionIndex.ts";
import {
  EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_THEME_REGISTRY,
} from "./executiveStrategicThemeIndex.ts";
import {
  EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
} from "./executiveStrategicObjectiveIndex.ts";
import {
  EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
} from "./executiveStrategicInitiativeIndex.ts";
import {
  EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
} from "./executiveStrategicRoadmapIndex.ts";
import {
  EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
} from "./executiveStrategyAlignmentIndex.ts";
import {
  EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
} from "./executiveStrategyMonitoringIndex.ts";
import {
  EXECUTIVE_STRATEGY_SIMULATION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_SIMULATION_REGISTRY,
} from "./executiveStrategySimulationIndex.ts";
import type {
  ExecutiveStrategyPlatformRegressionEntry,
  ExecutiveStrategyPlatformRegressionResult,
} from "./executiveStrategyPlatformFreezeTypes.ts";

function entry(
  regressionId: string,
  phaseId: ExecutiveStrategyPlatformRegressionEntry["phaseId"],
  coveredPublicApis: readonly string[],
  status: "PASS" | "FAIL"
): ExecutiveStrategyPlatformRegressionEntry {
  return Object.freeze({
    regressionId,
    phaseId,
    coveredPublicApis: Object.freeze([...coveredPublicApis]),
    status,
    metadataOnly: true,
  });
}

export function runExecutiveStrategyPlatformRegression(): ExecutiveStrategyPlatformRegressionResult {
  const entries = Object.freeze([
    entry("regression-bus-17", "BUS-17", listExecutiveStrategyPublicApis().map((api) => api.apiName), EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformId === "BUS-17" && EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.publicApis.length > 0 ? "PASS" : "FAIL"),
    entry("regression-bus-18", "BUS-18", EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS, EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId === "BUS-18" && EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.publicApis.length > 0 ? "PASS" : "FAIL"),
    entry("regression-bus-19", "BUS-19", EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS, EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformId === "BUS-19" && EXECUTIVE_STRATEGIC_THEME_REGISTRY.publicApis.length > 0 ? "PASS" : "FAIL"),
    entry("regression-bus-20", "BUS-20", EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS, EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.platformId === "BUS-20" && EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.publicApis.length > 0 ? "PASS" : "FAIL"),
    entry("regression-bus-21", "BUS-21", EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS, EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.platformId === "BUS-21" && EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.publicApis.length > 0 ? "PASS" : "FAIL"),
    entry("regression-bus-22", "BUS-22", EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS, EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformId === "BUS-22" && EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.publicApis.length > 0 ? "PASS" : "FAIL"),
    entry("regression-bus-23", "BUS-23", EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS, EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.platformId === "BUS-23" && EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.publicApis.length > 0 ? "PASS" : "FAIL"),
    entry("regression-bus-24", "BUS-24", EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS, EXECUTIVE_STRATEGY_MONITORING_REGISTRY.platformId === "BUS-24" && EXECUTIVE_STRATEGY_MONITORING_REGISTRY.publicApis.length > 0 ? "PASS" : "FAIL"),
    entry("regression-bus-25", "BUS-25", EXECUTIVE_STRATEGY_SIMULATION_PUBLIC_APIS, EXECUTIVE_STRATEGY_SIMULATION_REGISTRY.platformId === "BUS-25" && EXECUTIVE_STRATEGY_SIMULATION_REGISTRY.publicApis.length > 0 ? "PASS" : "FAIL"),
  ]);

  const passedEntries = entries.filter((item) => item.status === "PASS").length;
  const failedEntries = entries.length - passedEntries;
  return Object.freeze({
    status: failedEntries === 0 ? "PASS" : "FAIL",
    entries,
    totalEntries: entries.length,
    passedEntries,
    failedEntries,
    metadataOnly: true,
  });
}
