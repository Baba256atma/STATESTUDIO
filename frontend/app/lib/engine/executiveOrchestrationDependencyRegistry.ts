import {
  ExecutiveOrchestrationDependencyContract,
  ExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";
import type {
  ExecutiveOrchestrationDependencyEntry,
  ExecutiveOrchestrationDependencyId,
} from "./executiveOrchestrationRegistryTypes.ts";

const forbiddenUsage = Object.freeze([
  "importing internal implementation files",
  "calling runtime services",
  "database access",
  "storage access",
  "HTTP requests",
  "queues",
  "schedulers",
  "event buses",
  "UI access",
  "React dependencies",
  "Next.js runtime dependencies",
  "mutable global state",
  "dynamic orchestration",
] as const);

const allowedUsage = Object.freeze([
  "metadata references",
  "public-contract declarations",
] as const);

const dependency = (
  dependencyId: ExecutiveOrchestrationDependencyId,
  name: string,
  category: ExecutiveOrchestrationDependencyEntry["category"],
  namespace: string,
  required: boolean,
) => Object.freeze({
  id: `eng-8-dep-${dependencyId}` as const,
  dependencyId,
  name,
  category,
  namespace,
  relationship: "AllowedPublicDependency",
  required,
  allowedUsage,
  forbiddenUsage,
  publicApiOnly: true,
  runtimeInvocationAllowed: false,
  kind: "Dependency",
  status: "Registered",
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
} as const satisfies ExecutiveOrchestrationDependencyEntry);

/**
 * Canonical approved public dependency registry for ENG-8:2.
 * runtimeInvocationAllowed is false for every entry.
 */
export const ExecutiveOrchestrationDependencyRegistry = Object.freeze([
  dependency(
    "eng-1-public-api",
    "ENG-1 Executive Engine Public API",
    "EnginePublicApi",
    "nexora.engine.executive.public",
    true,
  ),
  dependency(
    "eng-2-public-api",
    "ENG-2 Executive Request and Intent Public API",
    "EnginePublicApi",
    "nexora.engine.executive.request-intent.public",
    true,
  ),
  dependency(
    "eng-3-public-api",
    "ENG-3 Executive Intent Resolution Public API",
    "EnginePublicApi",
    "nexora.engine.executive.intent-resolution.public",
    true,
  ),
  dependency(
    "eng-4-public-api",
    "ENG-4 Executive Context Public API",
    "EnginePublicApi",
    "nexora.engine.executive.context-assembly.public",
    true,
  ),
  dependency(
    "eng-5-public-api",
    "ENG-5 Executive Planning Public API",
    "EnginePublicApi",
    "nexora.engine.executive.planning.public",
    true,
  ),
  dependency(
    "eng-6-public-api",
    "ENG-6 Executive Reasoning Public API",
    "EnginePublicApi",
    "nexora.engine.executive.reasoning.public",
    true,
  ),
  dependency(
    "eng-7-public-api",
    "ENG-7 Executive Decision Public API",
    "EnginePublicApi",
    "Nexora.Engine.ExecutiveDecision.Public",
    true,
  ),
  dependency(
    "bus-public-apis",
    "BUS Public APIs",
    "BusinessPublicApi",
    "nexora.bus.public",
    false,
  ),
  dependency(
    "ops-public-apis",
    "OPS Public APIs",
    "OperationsPublicApi",
    "nexora.ops.public",
    false,
  ),
  dependency(
    "advisor-public-apis",
    "Advisor Public APIs",
    "AdvisorPublicApi",
    "nexora.advisor.public",
    false,
  ),
] as const);

export const ExecutiveOrchestrationDependencyRegistryFoundationAlignment = Object.freeze({
  foundationId: ExecutiveOrchestrationFoundation.id,
  foundationAllowed: ExecutiveOrchestrationDependencyContract.rules.allowed,
  registeredDependencyCount: 10,
  runtimeInvocationAllowedEverywhere: false,
  metadataOnly: true,
  immutable: true,
} as const);
