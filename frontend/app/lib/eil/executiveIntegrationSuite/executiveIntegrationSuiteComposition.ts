/**
 * EIL-8:1 — Executive Integration Suite Composition.
 *
 * Immutable Suite composition describing identity, membership,
 * dependency direction, canonical composition, and readiness.
 * Metadata only. No runtime composition.
 *
 * Ownership: owned exclusively by EIL-8:1.
 */

import { ExecutiveIntegrationSuiteModules } from "./executiveIntegrationSuiteModules.ts";

/** Canonical Suite Foundation identity constants used by composition. */
export const ExecutiveIntegrationSuiteCompositionIdentity = Object.freeze({
  phaseId: "EIL-8:1" as const,
  canonicalId: "EIL-8:1/ExecutiveIntegrationSuiteFoundation" as const,
  suiteName: "Executive Integration Suite" as const,
  foundationName: "Executive Integration Suite Foundation" as const,
  namespace: "nexora.eil.executive-integration-suite.foundation" as const,
  version: "1.0.0" as const,
  status: "Foundation" as const,
  readiness: "ReadyForRegistry" as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Immutable Suite composition aggregate.
 */
export const ExecutiveIntegrationSuiteComposition = Object.freeze({
  compositionId: "EIL-8:1/Composition" as const,
  suiteIdentity: ExecutiveIntegrationSuiteCompositionIdentity,
  moduleMembership: ExecutiveIntegrationSuiteModules,
  moduleCount: ExecutiveIntegrationSuiteModules.length,
  dependencyDirection: Object.freeze({
    directionId: "EIL-8:1/DependencyDirection" as const,
    direction: "SuiteFoundation → EIL-1..EIL-7 PublicIndexes" as const,
    publicIndexOnly: true as const,
    laterEil8PhaseImport: false as const,
    bypassesPublicIndex: false as const,
    reconstructsUpstream: false as const,
    introducesNewIntegrationBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  canonicalComposition: Object.freeze({
    compositionPath:
      "EIL-8:1 → EIL-1:9 + EIL-2:9 + EIL-3:9 + EIL-4:9 + EIL-5:9 + EIL-6:9 + EIL-7:9 Public Indexes" as const,
    moduleKeys: Object.freeze(
      ExecutiveIntegrationSuiteModules.map((module) => module.moduleKey),
    ),
    publicIndexIds: Object.freeze(
      ExecutiveIntegrationSuiteModules.map((module) => module.publicIndexId),
    ),
    preservesCanonicalReferences: true as const,
    duplicatesUpstreamMetadata: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  }),
  readiness: "ReadyForRegistry" as const,
  nextPhase: "EIL-8:2 — Executive Integration Suite Registry" as const,
  compositionOnly: true as const,
  runtimeComposition: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
