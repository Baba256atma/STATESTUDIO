/** EX-3:4 immutable Validation evidence (descriptive, read-only). */

import { ExecutiveTimelineExperienceModel } from "./executiveTimelineExperienceModel.ts";

export const ExecutiveTimelineExperienceValidationEvidence = Object.freeze({
  evidenceId: "EX-3:4/ExecutiveTimelineExperienceValidationEvidence" as const,
  modelIdentity: ExecutiveTimelineExperienceModel.identity.id,
  registryIdentity: ExecutiveTimelineExperienceModel.registry.identity.id,
  foundationIdentity:
    ExecutiveTimelineExperienceModel.registry.foundation.identity.id,
  entityCount: ExecutiveTimelineExperienceModel.getSummary().entityCount,
  relationshipCount:
    ExecutiveTimelineExperienceModel.getSummary().relationshipCount,
  schemaCount: ExecutiveTimelineExperienceModel.getSummary().schemaCount,
  validationVersion: "1.0.0" as const,
  modelStatus: ExecutiveTimelineExperienceModel.status,
  modelReadiness: ExecutiveTimelineExperienceModel.readiness,
  readOnly: true as const,
  executable: false as const,
  validationEngineInvoked: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
});
