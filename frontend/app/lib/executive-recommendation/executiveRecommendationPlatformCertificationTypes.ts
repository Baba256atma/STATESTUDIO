/**
 * APP-12:8 — Executive Recommendation Platform Certification types.
 */

import type { ExecutiveRecommendationPlatformCertificationGroupKey } from "./executiveRecommendationPlatformCertificationManifest.ts";

export type CertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type CertificationGroup = Readonly<{
  groupKey: ExecutiveRecommendationPlatformCertificationGroupKey;
  title: string;
  passed: boolean;
  checksPassed: number;
  checksTotal: number;
  checks: readonly CertificationCheck[];
  readOnly: true;
}>;

export type PlatformRegressionLayerResult = Readonly<{
  layerId: string;
  title: string;
  contractVersion: string;
  certified: boolean;
  passedCount: number;
  checkCount: number;
  summary: string;
  readOnly: true;
}>;

export type PlatformRegression = Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly PlatformRegressionLayerResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}>;

export type CertificationSummary = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  certificationTimestamp: string | null;
  contractVersion: typeof import("./executiveRecommendationPlatformCertificationManifest.ts").EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  readOnly: true;
}>;

export type CertificationReport = Readonly<{
  certified: boolean;
  phase: "APP-12/8";
  contractVersion: typeof import("./executiveRecommendationPlatformCertificationManifest.ts").EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  platformVersion: typeof import("./executiveRecommendationPlatformCertificationManifest.ts").EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  groups: readonly CertificationGroup[];
  groupCount: number;
  groupsPassed: number;
  groupsFailed: number;
  checkCount: number;
  passedCount: number;
  failedCount: number;
  regression: PlatformRegression;
  summary: CertificationSummary;
  timestamp: string;
  readOnly: true;
}>;

export type PlatformCertification = Readonly<{
  certified: boolean;
  report: CertificationReport;
  readOnly: true;
}>;

export type { CertificationManifest } from "./executiveRecommendationPlatformCertificationManifest.ts";
