/**
 * APP-4:13 — Executive Memory Platform Certification types.
 */

import type {
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_GATE_IDS,
} from "./executiveMemoryPlatformCertificationConstants.ts";

export type ExecutiveMemoryPlatformCertificationGateId =
  (typeof EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_GATE_IDS)[number];

export type ExecutiveMemoryPlatformCertificationCheck = Readonly<{
  id: ExecutiveMemoryPlatformCertificationGateId;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformRegressionPhase = Readonly<{
  phaseId: string;
  phaseName: string;
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformRegressionResult = Readonly<{
  status: "PASS" | "FAIL";
  certified: boolean;
  phases: readonly ExecutiveMemoryPlatformRegressionPhase[];
  passedPhases: readonly ExecutiveMemoryPlatformRegressionPhase[];
  failedPhases: readonly ExecutiveMemoryPlatformRegressionPhase[];
  architectureDriftDetected: boolean;
  brokenContracts: readonly string[];
  executionTimeMs: number;
  summary: string;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformCertificationPerformance = Readonly<{
  certificationExecutionTimeMs: number;
  regressionExecutionTimeMs: number;
  totalCertifiedModules: number;
  totalPublicApis: number;
  totalContracts: number;
  totalCertificationTestFiles: number;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformCompatibilityValidation = Readonly<{
  schemaCompatible: boolean;
  versionCompatible: boolean;
  lifecycleCompatible: boolean;
  searchCompatible: boolean;
  dashboardCompatible: boolean;
  assistantCompatible: boolean;
  app2ScenarioCompatible: boolean;
  app3IntentCompatible: boolean;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformCertificationManifest = Readonly<{
  certificationVersion: string;
  platformStatus: string;
  readinessStatus: string;
  certificationDate: string;
  certifiedPhases: readonly string[];
  certifiedModules: readonly string[];
  contractVersions: Readonly<Record<string, string>>;
  certificationTestFiles: readonly string[];
  documentationFiles: readonly string[];
  architectureHash: string;
  metadataOnly: true;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  releaseReady: boolean;
  checks: readonly ExecutiveMemoryPlatformCertificationCheck[];
  passedChecks: readonly ExecutiveMemoryPlatformCertificationCheck[];
  failedChecks: readonly ExecutiveMemoryPlatformCertificationCheck[];
  summary: string;
  generatedAt: string;
  regression: ExecutiveMemoryPlatformRegressionResult;
  manifest: ExecutiveMemoryPlatformCertificationManifest;
  performance: ExecutiveMemoryPlatformCertificationPerformance;
  compatibility: ExecutiveMemoryPlatformCompatibilityValidation;
  tags: readonly string[];
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformCertificationRunResult = Readonly<{
  certificationVersion: string;
  certified: boolean;
  releaseReady: boolean;
  status: "PASS" | "FAIL";
  regressionStatus: "PASS" | "FAIL";
  summary: string;
  tags: readonly string[];
  manifest: ExecutiveMemoryPlatformCertificationManifest;
  certification: ExecutiveMemoryPlatformCertificationResult;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformPhaseCertificationResult = Readonly<{
  phaseId: string;
  phaseName: string;
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformCertificationEngineState = Readonly<{
  engineId: "executive-memory-platform-certification-engine";
  contractVersion: string;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;
