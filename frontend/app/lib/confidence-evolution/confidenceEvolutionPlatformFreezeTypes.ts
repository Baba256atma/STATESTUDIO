/**
 * APP-9:9 — Confidence Evolution Platform Freeze types.
 */

import type { ConfidenceEvolutionPlatformFreezeManifest } from "./confidenceEvolutionPlatformFreezeManifest.ts";
import type { ConfidenceEvolutionPlatformCertificationResult } from "./confidenceEvolutionPlatformCertification.ts";

export type ConfidenceEvolutionPlatformFreezeCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformFreezeValidationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformFreezeValidationResult = Readonly<{
  valid: boolean;
  manifestPass: boolean;
  registryPass: boolean;
  compatibilityPass: boolean;
  certificationDependencyPass: boolean;
  releasePass: boolean;
  checks: readonly ConfidenceEvolutionPlatformFreezeValidationCheck[];
  issues: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformFreezeRunResult = Readonly<{
  freezeVersion: string;
  certified: boolean;
  frozen: boolean;
  released: boolean;
  readyForRelease: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  releaseTag: string;
  manifest: ConfidenceEvolutionPlatformFreezeManifest | null;
  certification: ConfidenceEvolutionPlatformCertificationResult;
  validation: ConfidenceEvolutionPlatformFreezeValidationResult;
  checks: readonly ConfidenceEvolutionPlatformFreezeCheck[];
  score: number;
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformRegistrySnapshot = Readonly<{
  registryVersion: string;
  platformId: string;
  platformName: string;
  releaseVersion: string;
  frozen: boolean;
  publicApiCount: number;
  phaseCount: number;
  consumerCount: number;
  readOnly: true;
}>;
