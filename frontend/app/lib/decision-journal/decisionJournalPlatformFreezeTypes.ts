/**
 * APP-8:9 — Decision Journal Platform Freeze types.
 */

import type { DecisionJournalPlatformFreezeManifest } from "./decisionJournalPlatformFreezeManifest.ts";
import type { DecisionJournalPlatformCertificationResult } from "./decisionJournalPlatformCertification.ts";

export type DecisionJournalPlatformFreezeCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalPlatformFreezeValidationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalPlatformFreezeValidationResult = Readonly<{
  valid: boolean;
  manifestPass: boolean;
  registryPass: boolean;
  compatibilityPass: boolean;
  certificationDependencyPass: boolean;
  releasePass: boolean;
  checks: readonly DecisionJournalPlatformFreezeValidationCheck[];
  issues: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  readOnly: true;
}>;

export type DecisionJournalPlatformFreezeRunResult = Readonly<{
  freezeVersion: string;
  certified: boolean;
  frozen: boolean;
  released: boolean;
  readyForRelease: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  releaseTag: string;
  manifest: DecisionJournalPlatformFreezeManifest | null;
  certification: DecisionJournalPlatformCertificationResult;
  validation: DecisionJournalPlatformFreezeValidationResult;
  checks: readonly DecisionJournalPlatformFreezeCheck[];
  score: number;
  readOnly: true;
}>;

export type DecisionJournalPlatformRegistrySnapshot = Readonly<{
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
