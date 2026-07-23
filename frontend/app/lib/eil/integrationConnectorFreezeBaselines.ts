/**
 * EIL-2:8 — Integration Connector Freeze Baselines.
 *
 * Immutable baselines for Foundation through Freeze.
 * Derived from Certification → Platform composition references.
 * Metadata only.
 *
 * Ownership: owned exclusively by EIL-2:8.
 */

import {
  IntegrationConnectorCertificationIdentity,
  IntegrationConnectorCertificationPlatform,
} from "./integrationConnectorCertification.ts";
import type {
  IntegrationConnectorFreezeBaseline,
  IntegrationConnectorFreezeBaselinePhase,
} from "./integrationConnectorFreezeTypes.ts";

const certification = IntegrationConnectorCertificationPlatform;
const platform = certification.integrationConnectorPlatform;
const composition = platform.composition;

const baseline = (
  sourcePhase: IntegrationConnectorFreezeBaselinePhase,
  namespace: string,
  readiness: string,
  status: string,
  description: string,
  ordinal: number,
): IntegrationConnectorFreezeBaseline =>
  Object.freeze({
    baselineId: `EIL-2:8/Baseline/${sourcePhase}` as const,
    sourcePhase,
    version: "1.0.0",
    namespace,
    readiness,
    status,
    description,
    ownership: "EIL-2:8" as const,
    ordinal,
    tags: Object.freeze(["baseline", sourcePhase.toLowerCase()]),
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight freeze baselines spanning Foundation through Freeze.
 */
export const IntegrationConnectorFreezeBaselines: readonly IntegrationConnectorFreezeBaseline[] =
  Object.freeze([
    baseline(
      "EIL-2:1",
      "nexora.eil.integration-connector.foundation",
      "ReadyForRegistry",
      "Foundation",
      `Frozen baseline for ${composition.foundationReference}.`,
      1,
    ),
    baseline(
      "EIL-2:2",
      "nexora.eil.integration-connector.registry",
      "ReadyForModel",
      "Registry",
      `Frozen baseline for ${composition.registryReference}.`,
      2,
    ),
    baseline(
      "EIL-2:3",
      "nexora.eil.integration-connector.model",
      "ReadyForValidation",
      "Model",
      `Frozen baseline for ${composition.modelReference}.`,
      3,
    ),
    baseline(
      "EIL-2:4",
      "nexora.eil.integration-connector.validation",
      "ReadyForManifest",
      "Validation",
      `Frozen baseline for ${composition.validationReference}.`,
      4,
    ),
    baseline(
      "EIL-2:5",
      "nexora.eil.integration-connector.manifest",
      "ReadyForPlatform",
      "Manifest",
      `Frozen baseline for ${composition.manifestReference}.`,
      5,
    ),
    baseline(
      "EIL-2:6",
      "nexora.eil.integration-connector.platform",
      "ReadyForCertification",
      "Platform",
      `Frozen baseline for ${platform.identity.canonicalId}.`,
      6,
    ),
    baseline(
      "EIL-2:7",
      "nexora.eil.integration-connector.certification",
      "ReadyForFreeze",
      "Certification",
      `Frozen baseline for ${IntegrationConnectorCertificationIdentity.canonicalId}.`,
      7,
    ),
    baseline(
      "EIL-2:8",
      "nexora.eil.integration-connector.freeze",
      "ReadyForPublicIndex",
      "Frozen",
      "Frozen baseline for EIL-2:8/IntegrationConnectorFreeze.",
      8,
    ),
  ]);
