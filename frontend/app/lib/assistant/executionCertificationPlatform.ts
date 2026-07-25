/** ASSISTANT-8:7 — Certification platform summary derived from Platform. */
import { ExecutiveActionExecutionPlatform } from "./executiveActionExecutionPlatform.ts";
import { ExecutionCertificationCriteria } from "./executionCertificationCriteria.ts";
import { ExecutionCertificationGates } from "./executionCertificationGates.ts";
import {
  ExecutionCertificationStructuralMetadata,
  ExecutiveActionExecutionCertificationIdentity,
} from "./executionCertificationMetadata.ts";
import { ExecutionCertificationReadiness } from "./executionCertificationReadiness.ts";
import { ExecutionCertificationResults } from "./executionCertificationResults.ts";

export const ExecutionCertificationPlatform = Object.freeze({
  identity: ExecutiveActionExecutionCertificationIdentity,
  sourcePlatform: ExecutiveActionExecutionPlatform.identity,
  criteriaCount: ExecutionCertificationCriteria.length,
  gateCount: ExecutionCertificationGates.length,
  readiness: ExecutionCertificationReadiness.readiness,
  certificationStatus: ExecutionCertificationResults.certificationStatus,
  compatibilityStatus: ExecutiveActionExecutionPlatform.compatibility,
  platformStability: Object.freeze({
    stable: true,
    deterministic: ExecutiveActionExecutionPlatform.deterministic,
    immutable: ExecutiveActionExecutionPlatform.immutable,
    canonical: ExecutiveActionExecutionPlatform.canonical,
    capabilityCount:
      ExecutiveActionExecutionPlatform.statistics.platformCapabilityCount,
    guaranteeCount:
      ExecutiveActionExecutionPlatform.statistics.platformGuaranteeCount,
    extensionCount:
      ExecutiveActionExecutionPlatform.statistics.platformExtensionCount,
  }),
  statistics: Object.freeze({
    criteriaCount: ExecutionCertificationCriteria.length,
    gateCount: ExecutionCertificationGates.length,
    platformCapabilityCount:
      ExecutiveActionExecutionPlatform.statistics.platformCapabilityCount,
    platformGuaranteeCount:
      ExecutiveActionExecutionPlatform.statistics.platformGuaranteeCount,
    publishedInventoryCount:
      ExecutiveActionExecutionPlatform.statistics.publishedInventoryCount,
  }),
  metadata: ExecutionCertificationStructuralMetadata,
  metadataOnly: true,
  immutable: true,
} as const);
