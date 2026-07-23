/**
 * EIL-1:8 — Integration Freeze Baselines.
 *
 * Immutable baselines for Foundation through Freeze.
 * Derived from Certification → Platform composition references.
 * Metadata only.
 *
 * Ownership: owned exclusively by EIL-1:8.
 */

import {
  IntegrationCertificationIdentity,
  IntegrationCertificationPlatform,
} from "./integrationCertification.ts";
import type {
  IntegrationFreezeBaseline,
  IntegrationFreezeBaselinePhase,
} from "./integrationFreezeTypes.ts";

const certification = IntegrationCertificationPlatform;
const platform = certification.integrationPlatform;
const composition = platform.composition;

const baseline = (
  sourcePhase: IntegrationFreezeBaselinePhase,
  namespace: string,
  readiness: string,
  status: string,
  description: string,
  ordinal: number,
): IntegrationFreezeBaseline =>
  Object.freeze({
    baselineId: `EIL-1:8/Baseline/${sourcePhase}` as const,
    sourcePhase,
    version: "1.0.0",
    namespace,
    readiness,
    status,
    description,
    ownership: "EIL-1:8" as const,
    ordinal,
    tags: Object.freeze(["baseline", sourcePhase.toLowerCase()]),
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight freeze baselines spanning Foundation through Freeze.
 */
export const IntegrationFreezeBaselines: readonly IntegrationFreezeBaseline[] =
  Object.freeze([
    baseline(
      "EIL-1:1",
      "nexora.eil.integration.foundation",
      "ReadyForRegistry",
      "Foundation",
      `Frozen baseline for ${composition.foundationReference}.`,
      1,
    ),
    baseline(
      "EIL-1:2",
      "nexora.eil.integration.registry",
      "ReadyForModel",
      "Registry",
      `Frozen baseline for ${composition.registryReference}.`,
      2,
    ),
    baseline(
      "EIL-1:3",
      "nexora.eil.integration.model",
      "ReadyForValidation",
      "Model",
      `Frozen baseline for ${composition.modelReference}.`,
      3,
    ),
    baseline(
      "EIL-1:4",
      "nexora.eil.integration.validation",
      "ReadyForManifest",
      "Validation",
      `Frozen baseline for ${composition.validationReference}.`,
      4,
    ),
    baseline(
      "EIL-1:5",
      "nexora.eil.integration.manifest",
      "ReadyForPlatform",
      "Manifest",
      `Frozen baseline for ${composition.manifestReference}.`,
      5,
    ),
    baseline(
      "EIL-1:6",
      "nexora.eil.integration.platform",
      "ReadyForCertification",
      "Platform",
      `Frozen baseline for ${platform.identity.canonicalId}.`,
      6,
    ),
    baseline(
      "EIL-1:7",
      "nexora.eil.integration.certification",
      "ReadyForFreeze",
      "Certification",
      `Frozen baseline for ${IntegrationCertificationIdentity.canonicalId}.`,
      7,
    ),
    baseline(
      "EIL-1:8",
      "nexora.eil.integration.freeze",
      "ReadyForPublicIndex",
      "Frozen",
      "Frozen baseline for EIL-1:8/IntegrationFreeze.",
      8,
    ),
  ]);
