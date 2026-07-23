/**
 * EIL-8:8 — Executive Integration Suite Freeze Baselines.
 *
 * Exactly eight immutable frozen baselines.
 * Metadata-only. No mutable state.
 *
 * Ownership: owned exclusively by EIL-8:8.
 */

import { ExecutiveIntegrationSuiteCertificationCanonicalId } from "./executiveIntegrationSuiteCertification.ts";
import { ExecutiveIntegrationSuiteFreezeLockId } from "./executiveIntegrationSuiteFreezeIdentity.ts";

/** Closed frozen-baseline key vocabulary. */
export type SuiteFreezeBaselineKey =
  | "IdentityBaseline"
  | "DependencyBaseline"
  | "MetadataBaseline"
  | "ValidationBaseline"
  | "ManifestBaseline"
  | "PlatformBaseline"
  | "CertificationBaseline"
  | "FreezeBaseline";

/** Immutable frozen baseline descriptor. */
export interface ExecutiveIntegrationSuiteFreezeBaseline {
  readonly baselineId: `EIL-8:8/Baseline/${SuiteFreezeBaselineKey}`;
  readonly canonicalKey: SuiteFreezeBaselineKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly platformLockId: typeof ExecutiveIntegrationSuiteFreezeLockId;
  readonly namespace: "nexora.eil.executive-integration-suite.freeze";
  readonly sourceCertificationId: typeof ExecutiveIntegrationSuiteCertificationCanonicalId;
  readonly mutable: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const baseline = (
  key: SuiteFreezeBaselineKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteFreezeBaseline =>
  Object.freeze({
    baselineId: `EIL-8:8/Baseline/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    platformLockId: ExecutiveIntegrationSuiteFreezeLockId,
    namespace: "nexora.eil.executive-integration-suite.freeze" as const,
    sourceCertificationId: ExecutiveIntegrationSuiteCertificationCanonicalId,
    mutable: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight frozen baselines in deterministic order.
 */
export const ExecutiveIntegrationSuiteFreezeBaselines: readonly ExecutiveIntegrationSuiteFreezeBaseline[] =
  Object.freeze([
    baseline(
      "IdentityBaseline",
      "Identity Baseline",
      "Frozen canonical identity baseline for Executive Integration Suite.",
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
