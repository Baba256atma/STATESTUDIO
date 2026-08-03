import { ExecutiveTimelineExperienceRegistry } from "./executiveTimelineExperienceRegistry.ts";
import {
  ExecutiveTimelineExperienceModelId,
  ExecutiveTimelineExperienceModelIdentity,
  ExecutiveTimelineExperienceModelNamespace,
  ExecutiveTimelineExperienceModelNextPhase,
  ExecutiveTimelineExperienceModelPreviousPhase,
  ExecutiveTimelineExperienceModelReadiness,
  ExecutiveTimelineExperienceModelStatus,
  ExecutiveTimelineExperienceModelVersion,
} from "./executiveTimelineExperienceModelIdentity.ts";
import {
  ExecutiveTimelineExperienceModelEntities,
  ExecutiveTimelineExperienceModelRelationships,
} from "./executiveTimelineExperienceModelRelationships.ts";
import { ExecutiveTimelineExperienceModelSchemas } from "./executiveTimelineExperienceModelSchemas.ts";

export const ExecutiveTimelineExperienceModelManifest = Object.freeze({
  manifestId: "EX-3:3/ExecutiveTimelineExperienceModelManifest" as const,
  identity: ExecutiveTimelineExperienceModelIdentity,
  modelIdentity: ExecutiveTimelineExperienceModelId,
  namespace: ExecutiveTimelineExperienceModelNamespace,
  version: ExecutiveTimelineExperienceModelVersion,
  status: ExecutiveTimelineExperienceModelStatus,
  readiness: ExecutiveTimelineExperienceModelReadiness,
  previousPhase: ExecutiveTimelineExperienceModelPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceModelNextPhase,
  upstreamRegistryReference: ExecutiveTimelineExperienceRegistry.identity.id,
  entityCount: ExecutiveTimelineExperienceModelEntities.length,
  relationshipCount: ExecutiveTimelineExperienceModelRelationships.length,
  schemaCount: ExecutiveTimelineExperienceModelSchemas.length,
  dependency: Object.freeze({
    registry: ExecutiveTimelineExperienceRegistry,
    registryIdentity: ExecutiveTimelineExperienceRegistry.identity.id,
    registryReadiness: ExecutiveTimelineExperienceRegistry.readiness,
    runtimeDependency: "EX-3:2/ExecutiveTimelineExperienceRegistry" as const,
  }),
  summary: Object.freeze({
    entityNames: ExecutiveTimelineExperienceModelEntities.map(
      (entity) => entity.name,
    ),
    relationshipKinds: Object.freeze(
      [...new Set(
        ExecutiveTimelineExperienceModelRelationships.map(
          (relationship) => relationship.kind,
        ),
      )],
    ),
    schemaKinds: ExecutiveTimelineExperienceModelSchemas.map(
      (schema) => schema.kind,
    ),
    metadataOnly: true as const,
    immutable: true as const,
  }),
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
});
