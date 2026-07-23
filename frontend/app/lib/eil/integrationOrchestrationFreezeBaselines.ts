/**
 * EIL-4:8 — Integration Orchestration Freeze Baselines.
 *
 * Immutable baselines for Foundation through Freeze.
 * Derived from Certification → Platform composition references.
 * Metadata only.
 *
 * Ownership: owned exclusively by EIL-4:8.
 */

import {
  IntegrationOrchestrationCertificationIdentity,
  IntegrationOrchestrationCertificationPlatform,
} from "./integrationOrchestrationCertification.ts";
import type {
  IntegrationOrchestrationFreezeBaseline,
  OrchestrationFreezeBaselinePhase,
} from "./integrationOrchestrationFreezeTypes.ts";

const certification = IntegrationOrchestrationCertificationPlatform;
const platform = certification.integrationOrchestrationPlatform;
const composition = platform.composition;

const baseline = (
  sourcePhase: OrchestrationFreezeBaselinePhase,
  namespace: string,
  readiness: string,
  status: string,
  description: string,
  ordinal: number,
): IntegrationOrchestrationFreezeBaseline =>
  Object.freeze({
    baselineId: `EIL-4:8/Baseline/${sourcePhase}` as const,
    sourcePhase,
    version: "1.0.0",
    namespace,
    readiness,
    status,
    description,
    ownership: "EIL-4:8" as const,
    ordinal,
    tags: Object.freeze(["baseline", sourcePhase.toLowerCase()]),
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight freeze baselines spanning Foundation through Freeze.
 */
export const IntegrationOrchestrationFreezeBaselines: readonly IntegrationOrchestrationFreezeBaseline[] =
  Object.freeze([
    baseline(
      "EIL-4:1",
      "nexora.eil.integration-orchestration.foundation",
      "ReadyForRegistry",
      "Foundation",
      `Frozen baseline for ${composition.foundationReference}.`,
      1,
    ),
    baseline(
      "EIL-4:2",
      "nexora.eil.integration-orchestration.registry",
      "ReadyForModel",
      "Registry",
      `Frozen baseline for ${composition.registryReference}.`,
      2,
    ),
    baseline(
      "EIL-4:3",
      "nexora.eil.integration-orchestration.model",
      "ReadyForValidation",
      "Model",
      `Frozen baseline for ${composition.modelReference}.`,
      3,
    ),
    baseline(
      "EIL-4:4",
      "nexora.eil.integration-orchestration.validation",
      "ReadyForManifest",
      "Validation",
      `Frozen baseline for ${composition.validationReference}.`,
      4,
    ),
    baseline(
      "EIL-4:5",
      "nexora.eil.integration-orchestration.manifest",
      "ReadyForPlatform",
      "Manifest",
      `Frozen baseline for ${composition.manifestReference}.`,
      5,
    ),
    baseline(
      "EIL-4:6",
      "nexora.eil.integration-orchestration.platform",
      "ReadyForCertification",
      "Platform",
      `Frozen baseline for ${platform.identity.canonicalId}.`,
      6,
    ),
    baseline(
      "EIL-4:7",
      "nexora.eil.integration-orchestration.certification",
      "ReadyForFreeze",
      "Certification",
      `Frozen baseline for ${IntegrationOrchestrationCertificationIdentity.canonicalId}.`,
      7,
    ),
    baseline(
      "EIL-4:8",
      "nexora.eil.integration-orchestration.freeze",
      "ReadyForPublicIndex",
      "Frozen",
      "Frozen baseline for EIL-4:8/IntegrationOrchestrationFreeze.",
      8,
    ),
  ]);
