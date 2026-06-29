/**
 * APP-4:14 — Executive Memory Platform Freeze types.
 */

import type {
  EXECUTIVE_MEMORY_PLATFORM_STATUS_CERTIFIED,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_FROZEN,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_RELEASED,
} from "./executiveMemoryPlatformFreezeConstants.ts";

export type ExecutiveMemoryPlatformFreezeStatus = Readonly<{
  certified: typeof EXECUTIVE_MEMORY_PLATFORM_STATUS_CERTIFIED;
  frozen: typeof EXECUTIVE_MEMORY_PLATFORM_STATUS_FROZEN;
  released: typeof EXECUTIVE_MEMORY_PLATFORM_STATUS_RELEASED;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformRegistryEntry = Readonly<{
  phaseId: string;
  title: string;
  contractVersion: string;
  immutable: true;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformPublicApiEntry = Readonly<{
  apiId: string;
  category: string;
  phaseId: string;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformContractRegistryEntry = Readonly<{
  contractId: string;
  contractVersion: string;
  phaseId: string;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformCompatibilityGuarantee = Readonly<{
  guaranteeId: string;
  description: string;
  enforced: true;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformExtensionPoint = Readonly<{
  extensionId: string;
  label: string;
  description: string;
  status: "registered";
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformFreezeManifest = Readonly<{
  platformName: string;
  platformVersion: string;
  releaseTag: string;
  releaseStage: string;
  releaseDate: string;
  platformStatus: ExecutiveMemoryPlatformFreezeStatus;
  freezeVersion: string;
  certifiedModules: readonly ExecutiveMemoryPlatformRegistryEntry[];
  publicApis: readonly ExecutiveMemoryPlatformPublicApiEntry[];
  contractRegistry: readonly ExecutiveMemoryPlatformContractRegistryEntry[];
  certificationRegistry: readonly string[];
  extensionPoints: readonly ExecutiveMemoryPlatformExtensionPoint[];
  compatibilityGuarantees: readonly ExecutiveMemoryPlatformCompatibilityGuarantee[];
  platformMetadata: Readonly<{
    architectureHash: string;
    totalPhases: number;
    totalPublicApis: number;
    totalContracts: number;
    metadataOnly: true;
  }>;
  futureExtensionPolicy: Readonly<{
    policyId: string;
    rule: string;
    permitted: readonly string[];
    forbidden: readonly string[];
  }>;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformFreezeCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformFreezeCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  frozen: boolean;
  released: boolean;
  checks: readonly ExecutiveMemoryPlatformFreezeCheck[];
  passedChecks: readonly ExecutiveMemoryPlatformFreezeCheck[];
  failedChecks: readonly ExecutiveMemoryPlatformFreezeCheck[];
  summary: string;
  generatedAt: string;
  manifest: ExecutiveMemoryPlatformFreezeManifest;
  regressionStatus: "PASS" | "FAIL";
  priorCertificationStatus: "PASS" | "FAIL";
  tags: readonly string[];
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformFreezeRunResult = Readonly<{
  freezeVersion: string;
  certified: boolean;
  frozen: boolean;
  released: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  manifest: ExecutiveMemoryPlatformFreezeManifest;
  certification: ExecutiveMemoryPlatformFreezeCertificationResult;
  readOnly: true;
}>;
