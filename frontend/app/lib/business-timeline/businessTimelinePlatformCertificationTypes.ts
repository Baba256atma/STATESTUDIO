/**
 * APP-7:7 — Business Timeline Platform Certification types.
 */

import type { BusinessTimelinePlatformCertificationGroupKey } from "./businessTimelinePlatformCertificationManifest.ts";

export type BusinessTimelinePlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessTimelinePlatformCertificationGroup = Readonly<{
  groupKey: BusinessTimelinePlatformCertificationGroupKey;
  title: string;
  passed: boolean;
  checksPassed: number;
  checksTotal: number;
  checks: readonly BusinessTimelinePlatformCertificationCheck[];
  readOnly: true;
}>;

export type BusinessTimelinePlatformLayerRegressionResult = Readonly<{
  layerId: string;
  title: string;
  contractVersion: string;
  certified: boolean;
  score: number;
  summary: string;
  readOnly: true;
}>;

export type BusinessTimelinePlatformRegressionResult = Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly BusinessTimelinePlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}>;

export type BusinessTimelinePlatformReadinessGate = Readonly<{
  gateId: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessTimelinePlatformReadinessReport = Readonly<{
  readyForFreeze: boolean;
  gatesPassed: number;
  gatesTotal: number;
  summary: string;
  gates: readonly BusinessTimelinePlatformReadinessGate[];
  readOnly: true;
}>;

export type BusinessTimelinePlatformCertificationReport = Readonly<{
  platformIdentity: string;
  certificationVersion: string;
  certificationTimestamp: string;
  certificationScore: number;
  groups: readonly BusinessTimelinePlatformCertificationGroup[];
  regressionSummary: string;
  layerRegressionResults: readonly BusinessTimelinePlatformLayerRegressionResult[];
  readinessSummary: string;
  readyForFreeze: boolean;
  certifiedModules: readonly Readonly<{ layerId: string; title: string; contractVersion: string; readOnly: true }>[];
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  failures: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  certified: boolean;
  finalPlatformStatus: "CERTIFIED" | "NOT_CERTIFIED";
  readOnly: true;
}>;

export type BusinessTimelinePlatformCertificationResult = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  certificationScore: number;
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  failures: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  status: "PASS" | "FAIL";
  summary: string;
  report: BusinessTimelinePlatformCertificationReport;
  readOnly: true;
}>;
