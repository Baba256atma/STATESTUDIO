/**
 * APP-8:8 — Decision Journal Platform Certification types.
 */

import type { DecisionJournalPlatformCertificationGroupKey } from "./decisionJournalPlatformCertificationManifest.ts";

export type DecisionJournalPlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalPlatformCertificationGroup = Readonly<{
  groupKey: DecisionJournalPlatformCertificationGroupKey;
  title: string;
  passed: boolean;
  checksPassed: number;
  checksTotal: number;
  checks: readonly DecisionJournalPlatformCertificationCheck[];
  readOnly: true;
}>;

export type DecisionJournalPlatformLayerRegressionResult = Readonly<{
  layerId: string;
  title: string;
  contractVersion: string;
  certified: boolean;
  score: number;
  summary: string;
  readOnly: true;
}>;

export type DecisionJournalPlatformRegressionResult = Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly DecisionJournalPlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}>;

export type DecisionJournalPlatformReadinessGate = Readonly<{
  gateId: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalPlatformReadinessReport = Readonly<{
  readyForFreeze: boolean;
  gatesPassed: number;
  gatesTotal: number;
  summary: string;
  gates: readonly DecisionJournalPlatformReadinessGate[];
  readOnly: true;
}>;

export type DecisionJournalPlatformCertificationReport = Readonly<{
  platformIdentity: string;
  certificationVersion: string;
  certificationTimestamp: string;
  certificationScore: number;
  groups: readonly DecisionJournalPlatformCertificationGroup[];
  regressionSummary: string;
  layerRegressionResults: readonly DecisionJournalPlatformLayerRegressionResult[];
  readinessSummary: string;
  readyForFreeze: boolean;
  certifiedModules: readonly Readonly<{ layerId: string; title: string; contractVersion: string; readOnly: true }>[];
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  failures: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  certified: boolean;
  finalPlatformStatus: "CERTIFIED" | "NOT_CERTIFIED";
  readOnly: true;
}>;

export type DecisionJournalPlatformCertificationResult = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  certificationScore: number;
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  failures: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  status: "PASS" | "FAIL";
  summary: string;
  report: DecisionJournalPlatformCertificationReport;
  readOnly: true;
}>;
