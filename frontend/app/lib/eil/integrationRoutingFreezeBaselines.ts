/**
 * EIL-3:8 — Integration Routing Freeze Baselines.
 *
 * Immutable baselines for Foundation through Freeze.
 * Derived from Certification → Platform composition references.
 * Metadata only.
 *
 * Ownership: owned exclusively by EIL-3:8.
 */

import {
  IntegrationRoutingCertificationIdentity,
  IntegrationRoutingCertificationPlatform,
} from "./integrationRoutingCertification.ts";
import type {
  RoutingFreezeBaseline,
  RoutingFreezeBaselinePhase,
} from "./integrationRoutingFreezeTypes.ts";

const certification = IntegrationRoutingCertificationPlatform;
const platform = certification.integrationRoutingPlatform;
const composition = platform.composition;

const baseline = (
  sourcePhase: RoutingFreezeBaselinePhase,
  namespace: string,
  readiness: string,
  status: string,
  description: string,
  ordinal: number,
): RoutingFreezeBaseline =>
  Object.freeze({
    baselineId: `EIL-3:8/Baseline/${sourcePhase}` as const,
    sourcePhase,
    version: "1.0.0",
    namespace,
    readiness,
    status,
    description,
    ownership: "EIL-3:8" as const,
    ordinal,
    tags: Object.freeze(["baseline", sourcePhase.toLowerCase()]),
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight freeze baselines spanning Foundation through Freeze.
 */
export const IntegrationRoutingFreezeBaselines: readonly RoutingFreezeBaseline[] =
  Object.freeze([
    baseline(
      "EIL-3:1",
      "nexora.eil.integration-routing.foundation",
      "ReadyForRegistry",
      "Foundation",
      `Frozen baseline for ${composition.foundationReference}.`,
      1,
    ),
    baseline(
      "EIL-3:2",
      "nexora.eil.integration-routing.registry",
      "ReadyForModel",
      "Registry",
      `Frozen baseline for ${composition.registryReference}.`,
      2,
    ),
    baseline(
      "EIL-3:3",
      "nexora.eil.integration-routing.model",
      "ReadyForValidation",
      "Model",
      `Frozen baseline for ${composition.modelReference}.`,
      3,
    ),
    baseline(
      "EIL-3:4",
      "nexora.eil.integration-routing.validation",
      "ReadyForManifest",
      "Validation",
      `Frozen baseline for ${composition.validationReference}.`,
      4,
    ),
    baseline(
      "EIL-3:5",
      "nexora.eil.integration-routing.manifest",
      "ReadyForPlatform",
      "Manifest",
      `Frozen baseline for ${composition.manifestReference}.`,
      5,
    ),
    baseline(
      "EIL-3:6",
      "nexora.eil.integration-routing.platform",
      "ReadyForCertification",
      "Platform",
      `Frozen baseline for ${platform.identity.canonicalId}.`,
      6,
    ),
    baseline(
      "EIL-3:7",
      "nexora.eil.integration-routing.certification",
      "ReadyForFreeze",
      "Certification",
      `Frozen baseline for ${IntegrationRoutingCertificationIdentity.canonicalId}.`,
      7,
    ),
    baseline(
      "EIL-3:8",
      "nexora.eil.integration-routing.freeze",
      "ReadyForPublicIndex",
      "Frozen",
      "Frozen baseline for EIL-3:8/IntegrationRoutingFreeze.",
      8,
    ),
  ]);
