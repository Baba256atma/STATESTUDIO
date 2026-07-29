import { EXECUTIVE_KPI_PLATFORM_IDENTITY } from "./executiveKpiPlatformFreezeIndex.ts";
import { EXECUTIVE_OKR_PLATFORM_IDENTITY } from "./executiveOkrPlatformFreezeIndex.ts";
import { EXECUTIVE_STRATEGY_PLATFORM_REGISTRY } from "./executiveStrategyIndex.ts";
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
import { EXECUTIVE_STRATEGY_SIMULATION_PUBLIC_APIS } from "./executiveStrategySimulationIndex.ts";
import type {
  ExecutiveStrategyPlatformConsumerEntry,
  ExecutiveStrategyPlatformDependencyEntry,
  ExecutiveStrategyPlatformExtensionPolicy,
  ExecutiveStrategyPlatformIdentity,
  ExecutiveStrategyPlatformPhaseEntry,
  ExecutiveStrategyPlatformPublicApiEntry,
  ExecutiveStrategyPlatformReleaseMetadata,
} from "./executiveStrategyPlatformFreezeTypes.ts";

export const EXECUTIVE_STRATEGY_PLATFORM_IDENTITY: ExecutiveStrategyPlatformIdentity = Object.freeze({
  platformId: "BUS-STRAT",
  platformName: "Executive Strategy Platform",
  version: "1.0.0",
  certificationPhaseId: "BUS-26",
  state: "Certified Frozen Released",
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_STRATEGY_PLATFORM_PHASES: readonly ExecutiveStrategyPlatformPhaseEntry[] = Object.freeze([
  Object.freeze({ phaseId: "BUS-17", phaseName: "Executive Strategy Platform Foundation", order: 17, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-18", phaseName: "Executive Strategy Definition Platform", order: 18, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-19", phaseName: "Executive Strategic Themes Platform", order: 19, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-20", phaseName: "Executive Strategic Objectives Platform", order: 20, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-21", phaseName: "Executive Strategic Initiatives Platform", order: 21, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-22", phaseName: "Executive Strategic Roadmaps Platform", order: 22, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-23", phaseName: "Executive Strategy Alignment Platform", order: 23, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-24", phaseName: "Executive Strategy Monitoring Platform", order: 24, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-25", phaseName: "Executive Strategy Simulation Platform", order: 25, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-26", phaseName: "Executive Strategy Platform Certification & Freeze", order: 26, status: "Released", metadataOnly: true, immutable: true }),
] as const);

export const EXECUTIVE_STRATEGY_PLATFORM_EXTENSION_POLICY: ExecutiveStrategyPlatformExtensionPolicy = Object.freeze({
  allowsFutureBusPhases: true,
  requiresPublicApiConsumption: true,
  allowsStrategyExecution: false,
  allowsRuntimeExecution: false,
  allowsPersistence: false,
  allowsSimulationExecution: false,
  policyId: "executive-strategy-platform-freeze-extension-policy",
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_STRATEGY_PLATFORM_RELEASE_METADATA: ExecutiveStrategyPlatformReleaseMetadata = Object.freeze({
  releaseId: "executive-strategy-platform-freeze",
  releaseName: "Executive Strategy Platform Certification & Freeze",
  releaseVersion: "BUS-26",
  releaseDateMetadata: "deterministic-release-metadata",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_STRATEGY_PLATFORM_CONSUMERS: readonly ExecutiveStrategyPlatformConsumerEntry[] = Object.freeze([
  Object.freeze({ consumerId: "consumer-kpi-platform", consumerName: "Executive KPI Platform", consumerType: "Current", metadataOnly: true, immutable: true }),
  Object.freeze({ consumerId: "consumer-okr-platform", consumerName: "Executive OKR Platform", consumerType: "Current", metadataOnly: true, immutable: true }),
  Object.freeze({ consumerId: "consumer-portfolio-platform", consumerName: "Portfolio Platform", consumerType: "Future", metadataOnly: true, immutable: true }),
  Object.freeze({ consumerId: "consumer-financial-platform", consumerName: "Financial Platform", consumerType: "Future", metadataOnly: true, immutable: true }),
  Object.freeze({ consumerId: "consumer-organization-platform", consumerName: "Organization Platform", consumerType: "Future", metadataOnly: true, immutable: true }),
  Object.freeze({ consumerId: "consumer-resource-platform", consumerName: "Resource Platform", consumerType: "Future", metadataOnly: true, immutable: true }),
  Object.freeze({ consumerId: "consumer-reporting-platform", consumerName: "Reporting Platform", consumerType: "Future", metadataOnly: true, immutable: true }),
] as const);

type PublicApiSource = string | Readonly<{ readonly apiName: string }>;

const BUS_26_PUBLIC_APIS = Object.freeze([
  "ExecutiveStrategyPlatformFreeze",
  "buildExecutiveStrategyPlatformFreezeManifest",
  "runExecutiveStrategyPlatformCertification",
  "runExecutiveStrategyPlatformRegression",
  "runExecutiveStrategyPlatformFreeze",
  "getExecutiveStrategyPlatformFreezeState",
  "listExecutiveStrategyPlatformPhases",
  "listExecutiveStrategyPlatformPublicApis",
  "getExecutiveStrategyPlatformCompatibilityMatrix",
  "getExecutiveStrategyPlatformExtensionPolicy",
] as const);

function publicApiName(api: PublicApiSource): string {
  return typeof api === "string" ? api : api.apiName;
}

function apiEntries(
  phaseId: ExecutiveStrategyPlatformPhaseEntry["phaseId"],
  publicApis: readonly PublicApiSource[]
): readonly ExecutiveStrategyPlatformPublicApiEntry[] {
  return Object.freeze(publicApis.map((api) => Object.freeze({
    apiName: publicApiName(api),
    phaseId,
    stable: true,
    metadataOnly: true,
  })));
}

export function listExecutiveStrategyPlatformPhases(): readonly ExecutiveStrategyPlatformPhaseEntry[] {
  return EXECUTIVE_STRATEGY_PLATFORM_PHASES;
}

export function listExecutiveStrategyPlatformPublicApis(): readonly ExecutiveStrategyPlatformPublicApiEntry[] {
  return Object.freeze([
    ...apiEntries("BUS-17", EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.publicApis.map((api) => api.apiName)),
    ...apiEntries("BUS-18", EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS),
    ...apiEntries("BUS-19", EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS),
    ...apiEntries("BUS-20", EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS),
    ...apiEntries("BUS-21", EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS),
    ...apiEntries("BUS-22", EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS),
    ...apiEntries("BUS-23", EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS),
    ...apiEntries("BUS-24", EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS),
    ...apiEntries("BUS-25", EXECUTIVE_STRATEGY_SIMULATION_PUBLIC_APIS),
    ...apiEntries("BUS-26", BUS_26_PUBLIC_APIS),
  ]);
}

export function listExecutiveStrategyPlatformDependencies(): readonly ExecutiveStrategyPlatformDependencyEntry[] {
  return Object.freeze([
    Object.freeze({ dependencyId: "dependency-bus-17-kpi", sourcePhaseId: "BUS-17", targetPlatform: EXECUTIVE_KPI_PLATFORM_IDENTITY.platformName, dependencyStatus: "Certified", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "dependency-bus-17-okr", sourcePhaseId: "BUS-17", targetPlatform: EXECUTIVE_OKR_PLATFORM_IDENTITY.platformName, dependencyStatus: "Certified", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "dependency-bus-18-foundation", sourcePhaseId: "BUS-18", targetPlatform: EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformName, dependencyStatus: "Compatible", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "dependency-bus-19-definition", sourcePhaseId: "BUS-19", targetPlatform: EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformName, dependencyStatus: "Compatible", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "dependency-bus-20-theme", sourcePhaseId: "BUS-20", targetPlatform: EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformName, dependencyStatus: "Compatible", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "dependency-bus-21-objective", sourcePhaseId: "BUS-21", targetPlatform: EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.platformName, dependencyStatus: "Compatible", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "dependency-bus-22-initiative", sourcePhaseId: "BUS-22", targetPlatform: EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.platformName, dependencyStatus: "Compatible", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "dependency-bus-23-roadmap", sourcePhaseId: "BUS-23", targetPlatform: EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformName, dependencyStatus: "Compatible", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "dependency-bus-24-alignment", sourcePhaseId: "BUS-24", targetPlatform: EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.platformName, dependencyStatus: "Compatible", metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "dependency-bus-25-monitoring", sourcePhaseId: "BUS-25", targetPlatform: EXECUTIVE_STRATEGY_MONITORING_REGISTRY.platformName, dependencyStatus: "Compatible", metadataOnly: true, immutable: true }),
  ]);
}

export function getExecutiveStrategyPlatformExtensionPolicy(): ExecutiveStrategyPlatformExtensionPolicy {
  return EXECUTIVE_STRATEGY_PLATFORM_EXTENSION_POLICY;
}
