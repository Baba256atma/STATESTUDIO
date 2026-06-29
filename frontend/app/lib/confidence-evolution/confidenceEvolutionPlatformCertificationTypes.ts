/**
 * APP-9:8 — Confidence Evolution Platform Certification types.
 */

import type { ConfidenceEvolutionPlatformCertificationGroupKey } from "./confidenceEvolutionPlatformCertificationManifest.ts";

export type ConfidenceEvolutionPlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformCertificationGroup = Readonly<{
  groupKey: ConfidenceEvolutionPlatformCertificationGroupKey;
  title: string;
  passed: boolean;
  checksPassed: number;
  checksTotal: number;
  checks: readonly ConfidenceEvolutionPlatformCertificationCheck[];
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformLayerRegressionResult = Readonly<{
  layerId: string;
  title: string;
  contractVersion: string;
  certified: boolean;
  score: number;
  summary: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformRegressionResult = Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly ConfidenceEvolutionPlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformReadinessGate = Readonly<{
  gateId: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformReadinessReport = Readonly<{
  readyForFreeze: boolean;
  gatesPassed: number;
  gatesTotal: number;
  summary: string;
  gates: readonly ConfidenceEvolutionPlatformReadinessGate[];
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformCertificationReport = Readonly<{
  platformIdentity: string;
  certificationVersion: string;
  certificationTimestamp: string;
  certificationScore: number;
  groups: readonly ConfidenceEvolutionPlatformCertificationGroup[];
  regressionSummary: string;
  layerRegressionResults: readonly ConfidenceEvolutionPlatformLayerRegressionResult[];
  readinessSummary: string;
  readyForFreeze: boolean;
  certifiedModules: readonly Readonly<{ layerId: string; title: string; contractVersion: string; readOnly: true }>[];
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  failures: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  certified: boolean;
  finalPlatformStatus: "CERTIFIED" | "NOT_CERTIFIED";
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformCertificationResult = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  certificationScore: number;
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  failures: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  status: "PASS" | "FAIL";
  summary: string;
  report: ConfidenceEvolutionPlatformCertificationReport;
  readOnly: true;
}>;
