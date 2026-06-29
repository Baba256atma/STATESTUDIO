/**
 * APP-10:9 — Cross-Scenario Learning Platform Freeze types.
 */

import type { CrossScenarioLearningPlatformFreezeManifest } from "./crossScenarioLearningPlatformFreezeManifest.ts";
import type { CrossScenarioLearningPlatformCertificationReport } from "./crossScenarioLearningPlatformCertificationTypes.ts";

export type CrossScenarioLearningPlatformFreezeCertificationDependency = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  report: CrossScenarioLearningPlatformCertificationReport;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformFreezeCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformFreezeValidationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformFreezeValidationResult = Readonly<{
  valid: boolean;
  manifestPass: boolean;
  registryPass: boolean;
  compatibilityPass: boolean;
  certificationDependencyPass: boolean;
  releasePass: boolean;
  checks: readonly CrossScenarioLearningPlatformFreezeValidationCheck[];
  issues: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformFreezeRunResult = Readonly<{
  freezeVersion: string;
  certified: boolean;
  frozen: boolean;
  released: boolean;
  readyForRelease: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  releaseTag: string;
  manifest: CrossScenarioLearningPlatformFreezeManifest | null;
  certification: CrossScenarioLearningPlatformFreezeCertificationDependency;
  validation: CrossScenarioLearningPlatformFreezeValidationResult;
  checks: readonly CrossScenarioLearningPlatformFreezeCheck[];
  score: number;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformRegistrySnapshot = Readonly<{
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
