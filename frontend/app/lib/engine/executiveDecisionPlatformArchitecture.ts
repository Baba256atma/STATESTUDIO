import {
  ExecutiveDecisionPlatformComponentRegistry,
  ExecutiveDecisionPlatformComponentTotals,
} from "./executiveDecisionPlatformComponentRegistry.ts";
import type {
  ExecutiveDecisionPlatformConsumer,
  ExecutiveDecisionPlatformDependency,
} from "./executiveDecisionPlatformTypes.ts";

const dependency = (
  key: string,
  source: string,
  target: string,
  relationship: string,
) => Object.freeze({
  id: `eng-7-platform-dependency-${key}`,
  source,
  target,
  direction: "ForwardOnly",
  relationship,
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionPlatformDependency);

const consumer = (
  key: string,
  name: string,
  classification: ExecutiveDecisionPlatformConsumer["classification"],
) => Object.freeze({
  id: `eng-7-platform-consumer-${key}`,
  name,
  classification,
  status: "Declared",
  runtimeIntegration: "Prohibited",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionPlatformConsumer);

/**
 * Immutable platform architecture for ENG-7:6.
 */
export const ExecutiveDecisionPlatformArchitecture = Object.freeze({
  id: "eng-7-platform-architecture",
  name: "Executive Decision Platform Architecture",
  orderedSections: Object.freeze([
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
  ] as const),
  componentOrdering: Object.freeze(
    ExecutiveDecisionPlatformComponentRegistry.map(({ id }) => id),
  ),
  phaseLineage: Object.freeze([
    "ENG-7:1",
    "ENG-7:2",
    "ENG-7:3",
    "ENG-7:4",
    "ENG-7:5",
    "ENG-7:6",
  ] as const),
  architectureChain: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
  ] as const),
  dependencies: Object.freeze([
    dependency("foundation-to-registry", "foundation", "registry", "PhaseHandoff"),
    dependency("registry-to-model", "registry", "model", "PhaseHandoff"),
    dependency("model-to-validation", "model", "validation", "PhaseHandoff"),
    dependency("validation-to-manifest", "validation", "manifest", "PhaseHandoff"),
    dependency("manifest-to-platform", "manifest", "platform", "PhaseHandoff"),
  ] as const),
  dependencyDirection: "ForwardOnly",
  publicApiBoundaries: Object.freeze({
    approvedSurfaces: Object.freeze([
      "executiveDecisionPublicApi.ts",
      "executiveDecisionRegistryPlatform.ts",
      "executiveDecisionModelPlatform.ts",
      "executiveDecisionValidationPlatform.ts",
      "executiveDecisionManifestPlatform.ts",
    ] as const),
    internalImportProhibition: "Prohibited",
  } as const),
  ownershipBoundaries: Object.freeze({
    owner: "ENG-7",
    owns: Object.freeze([
      "platform aggregation",
      "component registry metadata",
      "platform architecture metadata",
      "platform readiness metadata",
      "platform inventory metadata",
      "platform summaries",
      "certification preparation metadata",
    ] as const),
    neverOwns: Object.freeze([
      "new foundation contracts",
      "new registries",
      "new models",
      "new validation rules",
      "new manifest declarations",
      "decision selection",
      "alternative ranking",
      "confidence calculation",
      "risk calculation",
      "recommendation generation",
      "reasoning",
      "planning",
      "orchestration",
      "execution",
      "persistence",
      "communication",
      "visualization",
    ] as const),
  } as const),
  compatibilityBoundaries: Object.freeze({
    priorPhasesReferencedOnly: true,
    noRedefinition: true,
  } as const),
  consumers: Object.freeze([
    consumer("certification", "ENG-7:7 Certification", "FuturePhase"),
    consumer("freeze", "ENG-7:8 Freeze", "FuturePhase"),
    consumer("public-index", "ENG-7:9 Public Index", "FuturePhase"),
    consumer("orchestration", "ENG-8 Executive Orchestration", "ExternalConsumer"),
    consumer("advisor", "Advisor", "ExternalConsumer"),
  ] as const),
  prohibitedRuntimeRelationships: Object.freeze([
    "BUS internals",
    "OPS internals",
    "Director runtime",
    "Scene runtime",
    "EVE runtime",
    "UI modules",
    "persistence services",
    "database clients",
    "runtime schedulers",
    "execution workers",
  ] as const),
  totals: ExecutiveDecisionPlatformComponentTotals,
  boundary: Object.freeze({
    publicApiOnly: true,
    forwardOnly: true,
    ownershipIsolated: true,
    antiDuplicationCompliant: true,
    runtimeFree: true,
    metadataOnly: true,
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);
