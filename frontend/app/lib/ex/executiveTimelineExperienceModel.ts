/**
 * EX-3:3 — metadata-only Executive Timeline Experience Model aggregate.
 *
 * EX-3:2 Registry is the sole upstream runtime dependency.
 */

import { ExecutiveTimelineExperienceRegistry } from "./executiveTimelineExperienceRegistry.ts";
import {
  ExecutiveTimelineExperienceModelApprovedAliases,
  ExecutiveTimelineExperienceModelId,
  ExecutiveTimelineExperienceModelIdentity,
  ExecutiveTimelineExperienceModelNamespace,
  ExecutiveTimelineExperienceModelNextPhase,
  ExecutiveTimelineExperienceModelPreviousPhase,
  ExecutiveTimelineExperienceModelReadiness,
  ExecutiveTimelineExperienceModelStatus,
  ExecutiveTimelineExperienceModelVersion,
  assertExecutiveTimelineExperienceModelIdentity,
  resolveExecutiveTimelineExperienceModelIdentity,
} from "./executiveTimelineExperienceModelIdentity.ts";
import { ExecutiveTimelineExperienceModelManifest } from "./executiveTimelineExperienceModelManifest.ts";
import {
  ExecutiveTimelineExperienceModelContracts,
  ExecutiveTimelineExperienceModelDecisions,
  ExecutiveTimelineExperienceModelMetadata,
  ExecutiveTimelineExperienceModelValidationMetadata,
} from "./executiveTimelineExperienceModelMetadata.ts";
import {
  ExecutiveTimelineExperienceModelEntities,
  ExecutiveTimelineExperienceModelRelationships,
} from "./executiveTimelineExperienceModelRelationships.ts";
import { ExecutiveTimelineExperienceModelSchemas } from "./executiveTimelineExperienceModelSchemas.ts";
import type { ExecutiveTimelineExperienceModelSummary } from "./executiveTimelineExperienceModelTypes.ts";

export * from "./executiveTimelineExperienceModelTypes.ts";
export * from "./executiveTimelineExperienceModelIdentity.ts";
export * from "./executiveTimelineExperienceModelRelationships.ts";
export * from "./executiveTimelineExperienceModelSchemas.ts";
export * from "./executiveTimelineExperienceModelMetadata.ts";
export * from "./executiveTimelineExperienceModelManifest.ts";

if (ExecutiveTimelineExperienceRegistry.readiness !== "ReadyForModel") {
  throw new Error(
    "EX-3:3 Model requires Registry readiness ReadyForModel.",
  );
}

if (ExecutiveTimelineExperienceRegistry.status !== "Registry") {
  throw new Error("EX-3:3 Model requires Registry status Registry.");
}

if (
  ExecutiveTimelineExperienceModelEntities.length !== 12
  || ExecutiveTimelineExperienceModelRelationships.length !== 18
  || ExecutiveTimelineExperienceModelSchemas.length !== 10
) {
  throw new Error("EX-3:3 Model catalogue counts are incomplete.");
}

export const ExecutiveTimelineExperienceModelDependencyDeclaration =
  Object.freeze({
    runtimeDependency: "EX-3:2/ExecutiveTimelineExperienceRegistry" as const,
    registryOnly: true as const,
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceModelSummaryValue = Object.freeze({
  identity: ExecutiveTimelineExperienceModelId,
  namespace: ExecutiveTimelineExperienceModelNamespace,
  version: ExecutiveTimelineExperienceModelVersion,
  status: ExecutiveTimelineExperienceModelStatus,
  readiness: ExecutiveTimelineExperienceModelReadiness,
  previousPhase: ExecutiveTimelineExperienceModelPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceModelNextPhase,
  entityCount: 12,
  relationshipCount: 18,
  schemaCount: 10,
  registryIdentity: "EX-3:2/ExecutiveTimelineExperienceRegistry",
  metadataOnly: true,
  deterministic: true,
  sideEffectFree: true,
  validationCreated: false,
  validationAuthorized: false,
} as const satisfies ExecutiveTimelineExperienceModelSummary);

export const getExecutiveTimelineExperienceModelSummary =
  (): ExecutiveTimelineExperienceModelSummary =>
    ExecutiveTimelineExperienceModelSummaryValue;

export const ExecutiveTimelineExperienceModel = Object.freeze({
  identity: ExecutiveTimelineExperienceModelIdentity,
  entities: ExecutiveTimelineExperienceModelEntities,
  relationships: ExecutiveTimelineExperienceModelRelationships,
  schemas: ExecutiveTimelineExperienceModelSchemas,
  validationMetadata: ExecutiveTimelineExperienceModelValidationMetadata,
  manifest: ExecutiveTimelineExperienceModelManifest,
  metadata: ExecutiveTimelineExperienceModelMetadata,
  contracts: ExecutiveTimelineExperienceModelContracts,
  decisions: ExecutiveTimelineExperienceModelDecisions,
  registry: ExecutiveTimelineExperienceRegistry,
  dependencyDeclaration:
    ExecutiveTimelineExperienceModelDependencyDeclaration,
  getSummary: getExecutiveTimelineExperienceModelSummary,
  status: ExecutiveTimelineExperienceModelStatus,
  readiness: ExecutiveTimelineExperienceModelReadiness,
  aliases: ExecutiveTimelineExperienceModelApprovedAliases,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  providerExecution: false as const,
  rtcIntegration: false as const,
  uiRendering: false as const,
  playbackEngine: false as const,
  validationCreated: false as const,
  validationAuthorized: false as const,
  ex34Created: false as const,
  ex34Authorized: false as const,
});

export {
  assertExecutiveTimelineExperienceModelIdentity,
  resolveExecutiveTimelineExperienceModelIdentity,
};
