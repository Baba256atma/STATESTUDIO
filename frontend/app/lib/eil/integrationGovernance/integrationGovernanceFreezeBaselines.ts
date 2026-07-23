/**
 * EIL-7:8 — Integration Governance Freeze Baselines.
 *
 * Exactly eight immutable frozen baselines.
 * Metadata-only. No mutable state.
 *
 * Ownership: owned exclusively by EIL-7:8.
 */

import { IntegrationGovernanceCertificationCanonicalId } from "./integrationGovernanceCertification.ts";
import { IntegrationGovernanceFreezeLockId } from "./integrationGovernanceFreezeIdentity.ts";

/** Closed frozen-baseline key vocabulary. */
export type GovernanceFreezeBaselineKey =
  | "IdentityBaseline"
  | "DependencyBaseline"
  | "MetadataBaseline"
  | "ValidationBaseline"
  | "ManifestBaseline"
  | "PlatformBaseline"
  | "CertificationBaseline"
  | "FreezeBaseline";

/** Immutable frozen baseline descriptor. */
export interface IntegrationGovernanceFreezeBaseline {
  readonly baselineId: `EIL-7:8/Baseline/${GovernanceFreezeBaselineKey}`;
  readonly canonicalKey: GovernanceFreezeBaselineKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly platformLockId: typeof IntegrationGovernanceFreezeLockId;
  readonly namespace: "nexora.eil.integration-governance.freeze";
  readonly sourceCertificationId: typeof IntegrationGovernanceCertificationCanonicalId;
  readonly mutable: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const baseline = (
  key: GovernanceFreezeBaselineKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernanceFreezeBaseline =>
  Object.freeze({
    baselineId: `EIL-7:8/Baseline/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    platformLockId: IntegrationGovernanceFreezeLockId,
    namespace: "nexora.eil.integration-governance.freeze" as const,
    sourceCertificationId: IntegrationGovernanceCertificationCanonicalId,
    mutable: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight frozen baselines in deterministic order.
 */
export const IntegrationGovernanceFreezeBaselines: readonly IntegrationGovernanceFreezeBaseline[] =
  Object.freeze([
    baseline(
      "IdentityBaseline",
      "Identity Baseline",
      "Frozen canonical identity baseline for Integration Governance.",
      1,
    ),
    baseline(
      "DependencyBaseline",
      "Dependency Baseline",
      "Frozen Certification-only dependency baseline.",
      2,
    ),
    baseline(
      "MetadataBaseline",
      "Metadata Baseline",
      "Frozen metadata-only architectural baseline.",
      3,
    ),
    baseline(
      "ValidationBaseline",
      "Validation Baseline",
      "Frozen Validation Pass baseline by Certification reference.",
      4,
    ),
    baseline(
      "ManifestBaseline",
      "Manifest Baseline",
      "Frozen Manifest publication baseline by Certification reference.",
      5,
    ),
    baseline(
      "PlatformBaseline",
      "Platform Baseline",
      "Frozen Platform composition baseline by Certification reference.",
      6,
    ),
    baseline(
      "CertificationBaseline",
      "Certification Baseline",
      "Frozen Certification aggregate Pass baseline.",
      7,
    ),
    baseline(
      "FreezeBaseline",
      "Freeze Baseline",
      "Frozen Freeze release baseline for Public Index publication.",
      8,
    ),
  ]);
