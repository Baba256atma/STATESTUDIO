import { DirectorValidationMetadata } from "./directorValidationMetadata.ts";
import { DirectorValidationRegistry } from "./directorValidationRegistry.ts";

export { DirectorValidationMetadata, DirectorValidationRegistry };

export const DirectorValidationReadiness =
  DirectorValidationMetadata.readiness;

export const DirectorValidationSummary = Object.freeze({
  id: DirectorValidationMetadata.id,
  namespace: DirectorValidationMetadata.namespace,
  version: DirectorValidationMetadata.validationVersion,
  status: DirectorValidationMetadata.status,
  readiness: DirectorValidationReadiness,
  categoryCount: DirectorValidationMetadata.validationCategoryCount,
  ruleCount: DirectorValidationMetadata.validationRuleCount,
  policyCount: DirectorValidationMetadata.policyCount,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

