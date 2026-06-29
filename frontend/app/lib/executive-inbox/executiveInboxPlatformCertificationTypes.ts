/**
 * APP-11:7 — Executive Inbox Platform Certification types.
 */

import type { ExecutiveInboxPlatformCertificationGroupKey } from "./executiveInboxPlatformCertificationManifest.ts";

export type ExecutiveInboxPlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformCertificationGroup = Readonly<{
  groupKey: ExecutiveInboxPlatformCertificationGroupKey;
  title: string;
  passed: boolean;
  checksPassed: number;
  checksTotal: number;
  checks: readonly ExecutiveInboxPlatformCertificationCheck[];
  readOnly: true;
}>;

export type ExecutiveInboxPlatformLayerRegressionResult = Readonly<{
  layerId: string;
  title: string;
  contractVersion: string;
  certified: boolean;
  passedCount: number;
  checkCount: number;
  summary: string;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformRegressionResult = Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly ExecutiveInboxPlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformCertificationStatus = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  certificationTimestamp: string | null;
  contractVersion: typeof import("./executiveInboxPlatformCertificationManifest.ts").EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformCertificationReport = Readonly<{
  certified: boolean;
  phase: "APP-11/7";
  contractVersion: typeof import("./executiveInboxPlatformCertificationManifest.ts").EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  platformVersion: typeof import("./executiveInboxPlatformCertificationManifest.ts").EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  groups: readonly ExecutiveInboxPlatformCertificationGroup[];
  groupCount: number;
  groupsPassed: number;
  groupsFailed: number;
  checkCount: number;
  passedCount: number;
  failedCount: number;
  regression: ExecutiveInboxPlatformRegressionResult;
  status: ExecutiveInboxPlatformCertificationStatus;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformCertificationResult = Readonly<{
  certified: boolean;
  report: ExecutiveInboxPlatformCertificationReport;
  readOnly: true;
}>;
