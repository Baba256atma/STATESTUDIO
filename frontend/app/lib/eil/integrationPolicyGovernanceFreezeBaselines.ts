/**
 * EIL-5:8 — Integration Policy & Governance Freeze Baselines.
 *
 * Immutable baselines for Foundation through Freeze.
 * Derived from Certification → Platform composition references.
 * Metadata only.
 *
 * Ownership: owned exclusively by EIL-5:8.
 */

import {
  IntegrationPolicyGovernanceCertificationIdentity,
  IntegrationPolicyGovernanceCertificationPlatform,
} from "./integrationPolicyGovernanceCertification.ts";
import type {
  IntegrationPolicyGovernanceFreezeBaseline,
  PolicyGovernanceFreezeBaselinePhase,
} from "./integrationPolicyGovernanceFreezeTypes.ts";

const certification = IntegrationPolicyGovernanceCertificationPlatform;
const platform = certification.integrationPolicyGovernancePlatform;
const composition = platform.composition;

const baseline = (
  sourcePhase: PolicyGovernanceFreezeBaselinePhase,
  namespace: string,
  readiness: string,
  status: string,
  description: string,
  ordinal: number,
): IntegrationPolicyGovernanceFreezeBaseline =>
  Object.freeze({
    baselineId: `EIL-5:8/Baseline/${sourcePhase}` as const,
    sourcePhase,
    version: "1.0.0",
    namespace,
    readiness,
    status,
    description,
    ownership: "EIL-5:8" as const,
    ordinal,
    tags: Object.freeze(["baseline", sourcePhase.toLowerCase()]),
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight freeze baselines spanning Foundation through Freeze.
 */
export const IntegrationPolicyGovernanceFreezeBaselines: readonly IntegrationPolicyGovernanceFreezeBaseline[] =
  Object.freeze([
    baseline(
      "EIL-5:1",
      "nexora.eil.integration-policy-governance.foundation",
      "ReadyForRegistry",
      "Foundation",
      `Frozen baseline for ${composition.foundationReference}.`,
      1,
    ),
    baseline(
      "EIL-5:2",
      "nexora.eil.integration-policy-governance.registry",
      "ReadyForModel",
      "Registry",
      `Frozen baseline for ${composition.registryReference}.`,
      2,
    ),
    baseline(
      "EIL-5:3",
      "nexora.eil.integration-policy-governance.model",
      "ReadyForValidation",
      "Model",
      `Frozen baseline for ${composition.modelReference}.`,
      3,
    ),
    baseline(
      "EIL-5:4",
      "nexora.eil.integration-policy-governance.validation",
      "ReadyForManifest",
      "Validation",
      `Frozen baseline for ${composition.validationReference}.`,
      4,
    ),
    baseline(
      "EIL-5:5",
      "nexora.eil.integration-policy-governance.manifest",
      "ReadyForPlatform",
      "Manifest",
      `Frozen baseline for ${composition.manifestReference}.`,
      5,
    ),
    baseline(
      "EIL-5:6",
      "nexora.eil.integration-policy-governance.platform",
      "ReadyForCertification",
      "Platform",
      `Frozen baseline for ${platform.identity.canonicalId}.`,
      6,
    ),
    baseline(
      "EIL-5:7",
      "nexora.eil.integration-policy-governance.certification",
      "ReadyForFreeze",
      "Certification",
      `Frozen baseline for ${IntegrationPolicyGovernanceCertificationIdentity.canonicalId}.`,
      7,
    ),
    baseline(
      "EIL-5:8",
      "nexora.eil.integration-policy-governance.freeze",
      "ReadyForPublicIndex",
      "Frozen",
      "Frozen baseline for EIL-5:8/IntegrationPolicyGovernanceFreeze.",
      8,
    ),
  ]);
