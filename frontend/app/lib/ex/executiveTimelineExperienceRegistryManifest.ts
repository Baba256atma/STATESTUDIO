import { ExecutiveTimelineExperienceFoundation } from "./executiveTimelineExperienceFoundation.ts";
import {
  ExecutiveTimelineExperienceRegistryAllEntries,
  ExecutiveTimelineExperienceRegistryCatalogues,
} from "./executiveTimelineExperienceRegistryCatalogues.ts";
import {
  ExecutiveTimelineExperienceRegistryId,
  ExecutiveTimelineExperienceRegistryIdentity,
  ExecutiveTimelineExperienceRegistryNamespace,
  ExecutiveTimelineExperienceRegistryNextPhase,
  ExecutiveTimelineExperienceRegistryPreviousPhase,
  ExecutiveTimelineExperienceRegistryReadiness,
  ExecutiveTimelineExperienceRegistryStatus,
  ExecutiveTimelineExperienceRegistryVersion,
} from "./executiveTimelineExperienceRegistryIdentity.ts";
import { ExecutiveTimelineExperienceRegistryValidation } from "./executiveTimelineExperienceRegistryValidation.ts";

export const ExecutiveTimelineExperienceRegistryManifest = Object.freeze({
  manifestId: "EX-3:2/ExecutiveTimelineExperienceRegistryManifest" as const,
  registryIdentity: ExecutiveTimelineExperienceRegistryId,
  identity: ExecutiveTimelineExperienceRegistryIdentity,
  namespace: ExecutiveTimelineExperienceRegistryNamespace,
  version: ExecutiveTimelineExperienceRegistryVersion,
  status: ExecutiveTimelineExperienceRegistryStatus,
  readiness: ExecutiveTimelineExperienceRegistryReadiness,
  previousPhase: ExecutiveTimelineExperienceRegistryPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceRegistryNextPhase,
  catalogueCount: ExecutiveTimelineExperienceRegistryCatalogues.length,
  totalRegisteredEntries: ExecutiveTimelineExperienceRegistryAllEntries.length,
  validationRuleCount: ExecutiveTimelineExperienceRegistryValidation.ruleCount,
  dependency: Object.freeze({
    foundation: ExecutiveTimelineExperienceFoundation,
    foundationIdentity: ExecutiveTimelineExperienceFoundation.identity.id,
    foundationReadiness: ExecutiveTimelineExperienceFoundation.readiness,
    runtimeDependency:
      "EX-3:1/ExecutiveTimelineExperienceFoundation" as const,
  }),
  registrySummary: Object.freeze({
    catalogues: ExecutiveTimelineExperienceRegistryCatalogues.map((catalogue) =>
      Object.freeze({
        kind: catalogue.kind,
        entryCount: catalogue.entryCount,
        order: catalogue.order,
      })),
    validationAllPassed: ExecutiveTimelineExperienceRegistryValidation.allPassed,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
});
