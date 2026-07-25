/** ASSISTANT-8:8 — Immutable frozen release metadata for Public Index. */
import { ExecutiveActionExecutionCertification } from "./executiveActionExecutionCertification.ts";
import { ExecutionFreezeBaselines } from "./executionFreezeBaselines.ts";
import { ExecutionFreezeCompatibility } from "./executionFreezeCompatibility.ts";
import { ExecutionFreezeExtensions } from "./executionFreezeExtensions.ts";
import { ExecutionFreezeLock } from "./executionFreezeLock.ts";
import {
  ExecutionFreezeGuarantees,
  ExecutionFreezeStructuralMetadata,
  ExecutiveActionExecutionFreezeIdentity,
} from "./executionFreezeMetadata.ts";

const certification = ExecutiveActionExecutionCertification;

export const ExecutionFreezeRelease = Object.freeze({
  identity: ExecutiveActionExecutionFreezeIdentity,
  canonicalId: ExecutiveActionExecutionFreezeIdentity.id,
  namespace: ExecutiveActionExecutionFreezeIdentity.namespace,
  version: ExecutiveActionExecutionFreezeIdentity.version,
  releaseStatus: ExecutiveActionExecutionFreezeIdentity.releaseStatus,
  readiness: ExecutiveActionExecutionFreezeIdentity.readiness,
  lifecycle: ExecutiveActionExecutionFreezeIdentity.lifecycle,
  lockIdentifier: ExecutionFreezeLock.lockIdentifier,
  dependencyChain: ExecutiveActionExecutionFreezeIdentity.dependencyChain,
  frozenCertification: certification.identity,
  frozenPlatform: certification.platform.identity,
  frozenInventories: certification.platform.inventory,
  frozenGuarantees: certification.platform.guarantees,
  frozenCompatibility: ExecutionFreezeCompatibility,
  frozenBaselines: ExecutionFreezeBaselines,
  frozenExtensions: ExecutionFreezeExtensions,
  freezeGuarantees: ExecutionFreezeGuarantees,
  certificationResults: certification.results,
  metadata: ExecutionFreezeStructuralMetadata,
  publicIndexEligibility: "Eligible",
  duplicatedDefinitions: false,
  independentlyMaintainedCounts: false,
  reconstructedInventories: false,
  metadataOnly: true,
  immutable: true,
} as const);
