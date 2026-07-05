import { EXECUTIVE_KPI_PLATFORM_IDENTITY } from "./executiveKpiPlatformFreezeIndex.ts";
import { EXECUTIVE_OKR_PLATFORM_IDENTITY } from "./executiveOkrPlatformFreezeIndex.ts";
import { buildExecutiveStrategyPlatformFreezeManifest } from "./executiveStrategyPlatformFreezeManifest.ts";
import { getExecutiveStrategyPlatformCompatibilityMatrix } from "./executiveStrategyPlatformCompatibility.ts";
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
import {
  EXECUTIVE_STRATEGY_PLATFORM_CONSUMERS,
  EXECUTIVE_STRATEGY_PLATFORM_IDENTITY,
  EXECUTIVE_STRATEGY_PLATFORM_RELEASE_METADATA,
  getExecutiveStrategyPlatformExtensionPolicy,
  listExecutiveStrategyPlatformDependencies,
  listExecutiveStrategyPlatformPhases,
  listExecutiveStrategyPlatformPublicApis,
} from "./executiveStrategyPlatformFreezeRegistry.ts";
import type {
  ExecutiveStrategyPlatformCertificationGate,
  ExecutiveStrategyPlatformCertificationResult,
} from "./executiveStrategyPlatformFreezeTypes.ts";

function gate(
  gateId: string,
  gateName: string,
  passed: boolean,
  diagnostics: readonly string[] = Object.freeze([])
): ExecutiveStrategyPlatformCertificationGate {
  return Object.freeze({ gateId, gateName, passed, diagnostics: Object.freeze([...diagnostics]) });
}

export function runExecutiveStrategyPlatformCertification(): ExecutiveStrategyPlatformCertificationResult {
  const manifest = buildExecutiveStrategyPlatformFreezeManifest();
  const compatibility = getExecutiveStrategyPlatformCompatibilityMatrix();
  const extensionPolicy = getExecutiveStrategyPlatformExtensionPolicy();
  const dependencies = listExecutiveStrategyPlatformDependencies();
  const phases = listExecutiveStrategyPlatformPhases();
  const publicApis = listExecutiveStrategyPlatformPublicApis();

  const gates = Object.freeze([
    gate("gate-bus-17", "BUS-17 availability", EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformId === "BUS-17" && listExecutiveStrategyPublicApis().length > 0),
    gate("gate-bus-18", "BUS-18 availability", EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId === "BUS-18" && EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS.length > 0),
    gate("gate-bus-19", "BUS-19 availability", EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformId === "BUS-19" && EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS.length > 0),
    gate("gate-bus-20", "BUS-20 availability", EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.platformId === "BUS-20" && EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS.length > 0),
    gate("gate-bus-21", "BUS-21 availability", EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.platformId === "BUS-21" && EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS.length > 0),
    gate("gate-bus-22", "BUS-22 availability", EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformId === "BUS-22" && EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS.length > 0),
    gate("gate-bus-23", "BUS-23 availability", EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.platformId === "BUS-23" && EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS.length > 0),
    gate("gate-bus-24", "BUS-24 availability", EXECUTIVE_STRATEGY_MONITORING_REGISTRY.platformId === "BUS-24" && EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS.length > 0),
    gate("gate-bus-25", "BUS-25 availability", EXECUTIVE_STRATEGY_SIMULATION_REGISTRY.platformId === "BUS-25" && EXECUTIVE_STRATEGY_SIMULATION_PUBLIC_APIS.length > 0),
    gate("gate-platform-identity", "Platform Identity", EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.platformId === "BUS-STRAT" && EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.state === "Certified Frozen Released"),
    gate("gate-manifest", "Platform Manifest", manifest.platformIdentity.platformId === "BUS-STRAT" && manifest.deterministicFingerprint.length > 0),
    gate("gate-dependency-registry", "Dependency Registry", dependencies.length === 10 && EXECUTIVE_KPI_PLATFORM_IDENTITY.state === "Certified Frozen Released" && EXECUTIVE_OKR_PLATFORM_IDENTITY.state === "Certified Frozen Released"),
    gate("gate-public-api-registry", "Public API Registry", publicApis.length > 0 && new Set(publicApis.map((api) => api.apiName)).size === publicApis.length),
    gate("gate-phase-registry", "Phase Registry", phases.length === 10 && phases[0]?.phaseId === "BUS-17" && phases.at(-1)?.phaseId === "BUS-26"),
    gate("gate-compatibility", "Compatibility Matrix", compatibility.length === 8),
    gate("gate-extension-policy", "Extension Policy", extensionPolicy.requiresPublicApiConsumption && !extensionPolicy.allowsStrategyExecution && !extensionPolicy.allowsRuntimeExecution && !extensionPolicy.allowsPersistence && !extensionPolicy.allowsSimulationExecution),
    gate("gate-consumer-registry", "Consumer Registry", EXECUTIVE_STRATEGY_PLATFORM_CONSUMERS.length >= 7),
    gate("gate-release-integrity", "Release Integrity", EXECUTIVE_STRATEGY_PLATFORM_RELEASE_METADATA.releaseStatus === "Released" && EXECUTIVE_STRATEGY_PLATFORM_RELEASE_METADATA.freezeStatus === "Frozen"),
  ]);

  const diagnostics = Object.freeze(gates.filter((entry) => !entry.passed).map((entry) => `${entry.gateId}:${entry.gateName}`));
  return Object.freeze({
    status: diagnostics.length === 0 ? "PASS" : "FAIL",
    gates,
    diagnostics,
    metadataOnly: true,
    deterministic: true,
  });
}
