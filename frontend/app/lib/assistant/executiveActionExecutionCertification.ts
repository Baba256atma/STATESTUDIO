/** ASSISTANT-8:7 — Canonical Executive Action Execution Certification aggregate. */
import { ExecutiveActionExecutionPlatform } from "./executiveActionExecutionPlatform.ts";
import { ExecutionCertificationCriteria } from "./executionCertificationCriteria.ts";
import { ExecutionCertificationGates } from "./executionCertificationGates.ts";
import {
  ExecutionCertificationStructuralMetadata,
  ExecutiveActionExecutionCertificationIdentity,
} from "./executionCertificationMetadata.ts";
import { ExecutionCertificationPlatform } from "./executionCertificationPlatform.ts";
import { ExecutionCertificationReadiness } from "./executionCertificationReadiness.ts";
import { ExecutionCertificationResults } from "./executionCertificationResults.ts";

export const ExecutiveActionExecutionCertification = Object.freeze({
  identity: ExecutiveActionExecutionCertificationIdentity,
  platform: ExecutiveActionExecutionPlatform,
  metadata: ExecutionCertificationStructuralMetadata,
  criteria: ExecutionCertificationCriteria,
  gates: ExecutionCertificationGates,
  results: ExecutionCertificationResults,
  readiness: ExecutionCertificationReadiness,
  certificationPlatform: ExecutionCertificationPlatform,
  compatibility: ExecutiveActionExecutionPlatform.compatibility,
  guarantees: ExecutionCertificationStructuralMetadata.rules,
  statistics: Object.freeze({
    certificationCriteriaCount: ExecutionCertificationCriteria.length,
    certificationGateCount: ExecutionCertificationGates.length,
    certificationReadinessCount:
      ExecutionCertificationReadiness.declarations.length,
    platformCapabilityCount:
      ExecutiveActionExecutionPlatform.statistics.platformCapabilityCount,
    platformGuaranteeCount:
      ExecutiveActionExecutionPlatform.statistics.platformGuaranteeCount,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-8:6 Executive Action Execution Platform",
  ]),
  publicApiSurface: Object.freeze([
    "ExecutiveActionExecutionCertification",
  ]),
  status: "Certification",
  stage: "ReadyForFreeze",
  readinessStatus: "ReadyForFreeze",
  nextPhase: "ASSISTANT-8:8 — Executive Action Execution Freeze",
  canonical: true,
  mutable: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableLogic: false,
  runtime: false,
  executionEngine: false,
  workflowRuntime: false,
  scheduler: false,
  monitoringServices: false,
  automation: false,
  persistence: false,
  orchestration: false,
  apis: false,
  aiReasoning: false,
  ui: false,
} as const);
