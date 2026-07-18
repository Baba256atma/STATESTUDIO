import {
  ExecutiveOrchestrationDependencyRegistry,
  ExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationManifestDependencyEntry,
} from "./executiveOrchestrationManifestTypes.ts";

const dependency = (
  id: string,
  name: string,
  namespace: string,
  relationship: ExecutiveOrchestrationManifestDependencyEntry["relationship"],
  required: boolean,
) => Object.freeze({
  id,
  name,
  namespace,
  relationship,
  required,
  publicApiOnly: true,
  runtimeAllowed: false,
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveOrchestrationManifestDependencyEntry);

/**
 * Immutable dependency map for ENG-8:5.
 * runtimeAllowed is false for every entry.
 */
export const ExecutiveOrchestrationDependencyManifest = Object.freeze({
  id: "eng-8-manifest-dependency-map",
  section: "DependencyMap",
  name: "Executive Orchestration Dependency Manifest",
  description:
    "Immutable approved public dependency map for Executive Orchestration across Engine, BUS, OPS, and Advisor surfaces.",
  dependencies: Object.freeze([
    dependency(
      "eng-1",
      "ENG-1",
      "nexora.engine.executive.public",
      "ApprovedPublicDependency",
      true,
    ),
    dependency(
      "eng-2",
      "ENG-2",
      "nexora.engine.executive.request-intent.public",
      "ApprovedPublicDependency",
      true,
    ),
    dependency(
      "eng-3",
      "ENG-3",
      "nexora.engine.executive.intent-resolution.public",
      "ApprovedPublicDependency",
      true,
    ),
    dependency(
      "eng-4",
      "ENG-4",
      "nexora.engine.executive.context-assembly.public",
      "ApprovedPublicDependency",
      true,
    ),
    dependency(
      "eng-5",
      "ENG-5",
      "nexora.engine.executive.planning.public",
      "ApprovedPublicDependency",
      true,
    ),
    dependency(
      "eng-6",
      "ENG-6",
      "nexora.engine.executive.reasoning.public",
      "ApprovedPublicDependency",
      true,
    ),
    dependency(
      "eng-7",
      "ENG-7",
      "Nexora.Engine.ExecutiveDecision.Public",
      "ApprovedPublicDependency",
      true,
    ),
    dependency(
      "eng-8-1",
      "ENG-8:1",
      "nexora.engine.executive.orchestration.foundation",
      "PriorPhaseSurface",
      true,
    ),
    dependency(
      "eng-8-2",
      "ENG-8:2",
      "nexora.engine.executive.orchestration.registry",
      "PriorPhaseSurface",
      true,
    ),
    dependency(
      "eng-8-3",
      "ENG-8:3",
      "nexora.engine.executive.orchestration.model",
      "PriorPhaseSurface",
      true,
    ),
    dependency(
      "eng-8-4",
      "ENG-8:4",
      "nexora.engine.executive.orchestration.validation",
      "PriorPhaseSurface",
      true,
    ),
    dependency(
      "bus-public-apis",
      "BUS Public APIs",
      "nexora.bus.public",
      "ApprovedPublicDependency",
      false,
    ),
    dependency(
      "ops-public-apis",
      "OPS Public APIs",
      "nexora.ops.public",
      "ApprovedPublicDependency",
      false,
    ),
    dependency(
      "advisor-public-apis",
      "Advisor Public APIs",
      "nexora.advisor.public",
      "ApprovedPublicDependency",
      false,
    ),
  ] as const),
  registryDependencyAlignment: Object.freeze({
    registryDependencyCount: ExecutiveOrchestrationDependencyRegistry.length,
    runtimeInvocationAllowedEverywhere: ExecutiveOrchestrationDependencyRegistry.every(
      ({ runtimeInvocationAllowed }) => runtimeInvocationAllowed === false,
    ),
    registryId: ExecutiveOrchestrationRegistryPlatform.registryMetadata.id,
  } as const),
  dependencyCount: 14,
  status: "Complete",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);
