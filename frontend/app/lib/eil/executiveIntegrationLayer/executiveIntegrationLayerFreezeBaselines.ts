/**
 * EIL-9:8 — Executive Integration Layer Freeze Baselines.
 *
 * Exactly eight immutable frozen baselines.
 * Metadata-only. No mutable state.
 *
 * Ownership: owned exclusively by EIL-9:8.
 */

import { ExecutiveIntegrationLayerCertificationCanonicalId } from "./executiveIntegrationLayerCertification.ts";
import { ExecutiveIntegrationLayerFreezeLockId } from "./executiveIntegrationLayerFreezeIdentity.ts";

/** Closed frozen-baseline key vocabulary. */
export type LayerFreezeBaselineKey =
  | "IdentityBaseline"
  | "DependencyBaseline"
  | "MetadataBaseline"
  | "ValidationBaseline"
  | "ManifestBaseline"
  | "PlatformBaseline"
  | "CertificationBaseline"
  | "FreezeBaseline";

/** Immutable frozen baseline descriptor. */
export interface ExecutiveIntegrationLayerFreezeBaseline {
  readonly baselineId: `EIL-9:8/Baseline/${LayerFreezeBaselineKey}`;
  readonly canonicalKey: LayerFreezeBaselineKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly platformLockId: typeof ExecutiveIntegrationLayerFreezeLockId;
  readonly namespace: "nexora.eil.executive-integration-layer.freeze";
  readonly sourceCertificationId: typeof ExecutiveIntegrationLayerCertificationCanonicalId;
  readonly mutable: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const baseline = (
  key: LayerFreezeBaselineKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerFreezeBaseline =>
  Object.freeze({
    baselineId: `EIL-9:8/Baseline/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    platformLockId: ExecutiveIntegrationLayerFreezeLockId,
    namespace: "nexora.eil.executive-integration-layer.freeze" as const,
    sourceCertificationId: ExecutiveIntegrationLayerCertificationCanonicalId,
    mutable: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight frozen baselines in deterministic order.
 */
export const ExecutiveIntegrationLayerFreezeBaselines: readonly ExecutiveIntegrationLayerFreezeBaseline[] =
  Object.freeze([
    baseline(
      "IdentityBaseline",
      "Identity Baseline",
      "Frozen canonical identity baseline for Executive Integration Layer.",
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
