/**
 * EIL-6:8 — Integration Observability Freeze Baselines.
 *
 * Exactly eight immutable frozen baselines.
 * Metadata-only. No mutable state.
 *
 * Ownership: owned exclusively by EIL-6:8.
 */

import { IntegrationObservabilityCertificationCanonicalId } from "./integrationObservabilityCertification.ts";
import { IntegrationObservabilityFreezeLockId } from "./integrationObservabilityFreezeIdentity.ts";

/** Closed frozen-baseline key vocabulary. */
export type ObservabilityFreezeBaselineKey =
  | "IdentityBaseline"
  | "DependencyBaseline"
  | "MetadataBaseline"
  | "ValidationBaseline"
  | "ManifestBaseline"
  | "PlatformBaseline"
  | "CertificationBaseline"
  | "FreezeBaseline";

/** Immutable frozen baseline descriptor. */
export interface IntegrationObservabilityFreezeBaseline {
  readonly baselineId: `EIL-6:8/Baseline/${ObservabilityFreezeBaselineKey}`;
  readonly canonicalKey: ObservabilityFreezeBaselineKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly platformLockId: typeof IntegrationObservabilityFreezeLockId;
  readonly namespace: "nexora.eil.integration-observability.freeze";
  readonly sourceCertificationId: typeof IntegrationObservabilityCertificationCanonicalId;
  readonly mutable: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const baseline = (
  key: ObservabilityFreezeBaselineKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityFreezeBaseline =>
  Object.freeze({
    baselineId: `EIL-6:8/Baseline/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    platformLockId: IntegrationObservabilityFreezeLockId,
    namespace: "nexora.eil.integration-observability.freeze" as const,
    sourceCertificationId: IntegrationObservabilityCertificationCanonicalId,
    mutable: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight frozen baselines in deterministic order.
 */
export const IntegrationObservabilityFreezeBaselines: readonly IntegrationObservabilityFreezeBaseline[] =
  Object.freeze([
    baseline(
      "IdentityBaseline",
      "Identity Baseline",
      "Frozen canonical identity baseline for Integration Observability.",
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
