/**
 * APP-12:9 — Executive Recommendation Platform Freeze types.
 */

import type { ExecutiveRecommendationPlatformFreezeManifest } from "./executiveRecommendationPlatformFreezeManifest.ts";
import type { CertificationReport } from "./executiveRecommendationPlatformCertificationTypes.ts";

export type ExecutiveRecommendationPlatformFreezeCertificationDependency = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  report: CertificationReport;
  readOnly: true;
}>;

export type ExecutiveRecommendationPlatformFreezeCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationPlatformFreezeValidationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationPlatformFreezeValidationResult = Readonly<{
  valid: boolean;
  manifestPass: boolean;
  registryPass: boolean;
  compatibilityPass: boolean;
  certificationDependencyPass: boolean;
  releasePass: boolean;
  checks: readonly ExecutiveRecommendationPlatformFreezeValidationCheck[];
  issues: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  readOnly: true;
}>;

export type ExecutiveRecommendationPlatformFreezeRunResult = Readonly<{
  freezeVersion: string;
  certified: boolean;
  frozen: boolean;
  released: boolean;
  readyForRelease: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  releaseTag: string;
  manifest: ExecutiveRecommendationPlatformFreezeManifest | null;
  certification: ExecutiveRecommendationPlatformFreezeCertificationDependency;
  validation: ExecutiveRecommendationPlatformFreezeValidationResult;
  checks: readonly ExecutiveRecommendationPlatformFreezeCheck[];
  score: number;
  readOnly: true;
}>;

export type ExecutiveRecommendationPlatformRegistrySnapshot = Readonly<{
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
