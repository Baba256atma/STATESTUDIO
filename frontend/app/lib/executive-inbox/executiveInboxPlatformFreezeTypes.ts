/**
 * APP-11:8 — Executive Inbox Platform Freeze types.
 */

import type { ExecutiveInboxPlatformFreezeManifest } from "./executiveInboxPlatformFreezeManifest.ts";
import type { ExecutiveInboxPlatformCertificationReport } from "./executiveInboxPlatformCertificationTypes.ts";

export type ExecutiveInboxPlatformFreezeCertificationDependency = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  report: ExecutiveInboxPlatformCertificationReport;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformFreezeCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformFreezeValidationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformFreezeValidationResult = Readonly<{
  valid: boolean;
  manifestPass: boolean;
  registryPass: boolean;
  compatibilityPass: boolean;
  certificationDependencyPass: boolean;
  releasePass: boolean;
  checks: readonly ExecutiveInboxPlatformFreezeValidationCheck[];
  issues: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  readOnly: true;
}>;

export type ExecutiveInboxPlatformFreezeRunResult = Readonly<{
  freezeVersion: string;
  certified: boolean;
  frozen: boolean;
  released: boolean;
  readyForRelease: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  releaseTag: string;
  manifest: ExecutiveInboxPlatformFreezeManifest | null;
  certification: ExecutiveInboxPlatformFreezeCertificationDependency;
  validation: ExecutiveInboxPlatformFreezeValidationResult;
  checks: readonly ExecutiveInboxPlatformFreezeCheck[];
  score: number;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformRegistrySnapshot = Readonly<{
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
