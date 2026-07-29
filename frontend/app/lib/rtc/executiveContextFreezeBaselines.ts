/**
 * RTC-1:8 — Executive Context Freeze Baselines.
 *
 * Exactly eight frozen baselines describing the certified state of each phase.
 *
 * Ownership: owned exclusively by RTC-1:8.
 */

import { ExecutiveContextRuntimeCertification } from "./executiveContextRuntimeCertification.ts";

/** Frozen baseline name. */
export type ExecutiveContextFrozenBaselineName =
  | "FoundationBaseline"
  | "RegistryBaseline"
  | "ModelBaseline"
  | "ValidationBaseline"
  | "ManifestBaseline"
  | "PlatformBaseline"
  | "CertificationBaseline"
  | "ReleaseBaseline";

/** Frozen baseline declaration. */
export interface ExecutiveContextFrozenBaseline {
  readonly baselineId: string;
  readonly baselineName: ExecutiveContextFrozenBaselineName;
  readonly displayName: string;
  readonly phaseId: string;
  readonly description: string;
  readonly order: number;
  readonly frozen: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const baseline = (
  baselineName: ExecutiveContextFrozenBaselineName,
  displayName: string,
  phaseId: string,
  description: string,
  order: number,
): ExecutiveContextFrozenBaseline =>
  Object.freeze({
    baselineId: `RTC-1:8/Baseline/${String(order).padStart(2, "0")}`,
    baselineName,
    displayName,
    phaseId,
    description,
    order,
    frozen: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight frozen baselines. */
export const ExecutiveContextFreezeBaselines = Object.freeze([
  baseline(
    "FoundationBaseline",
    "Foundation Baseline",
    "RTC-1:1",
    "Certified Foundation responsibilities and identity contracts.",
    1,
  ),
  baseline(
    "RegistryBaseline",
    "Registry Baseline",
    "RTC-1:2",
    "Certified Registry identities and domain catalogue.",
    2,
  ),
  baseline(
    "ModelBaseline",
    "Model Baseline",
    "RTC-1:3",
    "Certified Model entities, ownership, and relationships.",
    3,
  ),
  baseline(
    "ValidationBaseline",
    "Validation Baseline",
    "RTC-1:4",
    "Certified Validation categories and forty-rule baseline.",
    4,
  ),
  baseline(
    "ManifestBaseline",
    "Manifest Baseline",
    "RTC-1:5",
    "Certified Manifest package description and release baselines.",
    5,
  ),
  baseline(
    "PlatformBaseline",
    "Platform Baseline",
    "RTC-1:6",
    "Certified Platform services, events, and inspection contracts.",
    6,
  ),
  baseline(
    "CertificationBaseline",
    "Certification Baseline",
    "RTC-1:7",
    "Certified gates, categories, and release readiness.",
    7,
  ),
  baseline(
    "ReleaseBaseline",
    "Release Baseline",
    "RTC-1:8",
    "Frozen release state sealed by the Runtime Freeze artifact.",
    8,
  ),
] as const);

export const ExecutiveContextFreezeBaselineNames = Object.freeze([
  "FoundationBaseline",
  "RegistryBaseline",
  "ModelBaseline",
  "ValidationBaseline",
  "ManifestBaseline",
  "PlatformBaseline",
  "CertificationBaseline",
  "ReleaseBaseline",
] as const satisfies readonly ExecutiveContextFrozenBaselineName[]);

/** Baseline catalogue with certification provenance. */
export const ExecutiveContextFreezeBaselineCatalog = Object.freeze({
  catalogId: "RTC-1:8/BaselineCatalog",
  baselines: ExecutiveContextFreezeBaselines,
  baselineCount: ExecutiveContextFreezeBaselines.length,
  sourceCertification: ExecutiveContextRuntimeCertification.identity.id,
  frozen: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
