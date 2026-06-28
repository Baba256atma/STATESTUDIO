/**
 * PHASE-2 / DS1:7 — DS-1 Foundation Certification types.
 * Meta-certification shapes only — no runtime execution.
 */

export type Ds1FoundationLayerId = "DS1:1" | "DS1:2" | "DS1:3" | "DS1:4" | "DS1:5" | "DS1:6";

export type Ds1FoundationFailurePhase =
  | "prerequisite"
  | "layer"
  | "integration"
  | "freeze"
  | "regression"
  | "score";

export type Ds1FoundationLayerResult = Readonly<{
  layerId: Ds1FoundationLayerId;
  title: string;
  certified: boolean;
  gateCount: number;
  passedGateCount: number;
  overallScore: number;
  frozen: boolean;
}>;

export type Ds1FoundationCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  group: "prerequisite" | "layer" | "integration" | "regression" | "foundation";
}>;

export type Ds1FoundationScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type Ds1FoundationScoreReport = Readonly<{
  contractVersion: string;
  dimensions: Ds1FoundationScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type Ds1FoundationFreezeReport = Readonly<{
  allLayersFrozen: boolean;
  layerFreezeStates: Readonly<Record<Ds1FoundationLayerId, boolean>>;
  generatedAt: string;
}>;

export type Ds1FoundationFailureReport = Readonly<{
  failurePhase: Ds1FoundationFailurePhase;
  failedLayerId: Ds1FoundationLayerId | null;
  failedGateId: string | null;
  evidence: string;
  rootCause: string;
  impact: string;
  recommendedFix: string;
  riskOfFix: string;
}>;

export type Ds1FoundationCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  layerResults: readonly Ds1FoundationLayerResult[];
  checks: readonly Ds1FoundationCertificationCheck[];
  scoreReport: Ds1FoundationScoreReport;
  freezeReport: Ds1FoundationFreezeReport;
  failureReport: Ds1FoundationFailureReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type Ds1FoundationEventType =
  | "FoundationCertificationStarted"
  | "LayerCertificationStarted"
  | "LayerCertificationPassed"
  | "LayerCertificationFailed"
  | "IntegrationGatePassed"
  | "IntegrationGateFailed"
  | "FoundationCertificationPassed"
  | "FoundationCertificationFailed";

export type Ds1FoundationEvent = Readonly<{
  type: Ds1FoundationEventType;
  layerId: Ds1FoundationLayerId | null;
  gateId: string | null;
  timestamp: string;
}>;

export type Ds1FoundationDiagnosticEntry = Readonly<{
  layerId: Ds1FoundationLayerId | null;
  gateId: string | null;
  event: Ds1FoundationEventType;
  message: string;
  generatedAt: string;
}>;
