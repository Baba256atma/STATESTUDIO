/**
 * APP-7:8 — Business Timeline Platform Freeze types.
 */

import type { BusinessTimelinePlatformFreezeManifest } from "./businessTimelinePlatformFreezeManifest.ts";
import type { BusinessTimelinePlatformCertificationResult } from "./businessTimelinePlatformCertification.ts";

export type BusinessTimelinePlatformFreezeCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessTimelinePlatformFreezeValidationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessTimelinePlatformFreezeValidationResult = Readonly<{
  valid: boolean;
  manifestPass: boolean;
  registryPass: boolean;
  compatibilityPass: boolean;
  certificationDependencyPass: boolean;
  releasePass: boolean;
  checks: readonly BusinessTimelinePlatformFreezeValidationCheck[];
  issues: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  readOnly: true;
}>;

export type BusinessTimelinePlatformFreezeRunResult = Readonly<{
  freezeVersion: string;
  certified: boolean;
  frozen: boolean;
  released: boolean;
  readyForRelease: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  releaseTag: string;
  manifest: BusinessTimelinePlatformFreezeManifest | null;
  certification: BusinessTimelinePlatformCertificationResult;
  validation: BusinessTimelinePlatformFreezeValidationResult;
  checks: readonly BusinessTimelinePlatformFreezeCheck[];
  score: number;
  readOnly: true;
}>;

export type BusinessTimelinePlatformRegistrySnapshot = Readonly<{
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
