/**
 * C:2 — KPI/Risk Compare Visual Layer.
 *
 * Converts KPI and risk comparison differences into immutable visual-only
 * markers. This layer has no KPI, risk, scene, routing, or mutation authority.
 */

export const KPI_RISK_VISUAL_LAYER_DIAGNOSTIC = "[KPI_RISK_VISUAL_LAYER]" as const;

export const KPI_RISK_VISUAL_READY_DIAGNOSTIC = "[KPI_RISK_VISUAL_READY]" as const;

export const C2_KPI_RISK_VISUAL_COMPLETE_TAG = "[C2_KPI_RISK_VISUAL_COMPLETE]" as const;

export const KPI_RISK_COMPARE_VISUAL_LAYER_VERSION = "1.0.0" as const;

export type KpiRiskVisualDisplay =
  | "KPI Improvement"
  | "KPI Decline"
  | "Risk Increase"
  | "Risk Reduction";

export type KpiRiskVisualKind = "kpi" | "risk";

export type KpiDifferenceProfile = Readonly<{
  differenceId: string;
  comparisonId: string;
  scenarioAId: string;
  scenarioBId: string;
  kpiId: string;
  kpiLabel: string;
  kpiHealthDelta: number;
  kpiTrendDelta: number;
  kpiImpactDelta: number;
  confidence: number;
  summary: string;
  readOnly: true;
  mutation: false;
  kpiMutation: false;
}>;

export type RiskDifferenceProfile = Readonly<{
  differenceId: string;
  comparisonId: string;
  scenarioAId: string;
  scenarioBId: string;
  riskId: string;
  riskLabel: string;
  riskExposureDelta: number;
  riskProbabilityDelta: number;
  confidence: number;
  summary: string;
  readOnly: true;
  mutation: false;
  riskMutation: false;
}>;

export type KpiRiskVisualMarker = Readonly<{
  markerId: string;
  differenceId: string;
  targetId: string;
  targetLabel: string;
  kind: KpiRiskVisualKind;
  display: KpiRiskVisualDisplay;
  intensity: number;
  confidence: number;
  label: string;
  visualOnly: true;
  mutation: false;
  kpiMutation: false;
  riskMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  readOnly: true;
}>;

export type KpiRiskCompareVisualLayerInput = Readonly<{
  kpiDifferences: readonly KpiDifferenceProfile[];
  riskDifferences: readonly RiskDifferenceProfile[];
}>;

export type KpiRiskCompareVisualLayerResult = Readonly<{
  version: typeof KPI_RISK_COMPARE_VISUAL_LAYER_VERSION;
  kpiMarkers: readonly KpiRiskVisualMarker[];
  riskMarkers: readonly KpiRiskVisualMarker[];
  markers: readonly KpiRiskVisualMarker[];
  markerCount: number;
  kpiImprovementCount: number;
  kpiDeclineCount: number;
  riskIncreaseCount: number;
  riskReductionCount: number;
  visualOnly: true;
  mutation: false;
  kpiMutation: false;
  riskMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  readOnly: true;
  diagnostics: readonly [
    typeof KPI_RISK_VISUAL_LAYER_DIAGNOSTIC,
    typeof KPI_RISK_VISUAL_READY_DIAGNOSTIC,
  ];
}>;

export const KPI_RISK_VISUAL_DIAGNOSTICS = Object.freeze([
  KPI_RISK_VISUAL_LAYER_DIAGNOSTIC,
  KPI_RISK_VISUAL_READY_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_RISK_COMPARE_VISUAL_LAYER_RESULT: KpiRiskCompareVisualLayerResult =
  Object.freeze({
    version: KPI_RISK_COMPARE_VISUAL_LAYER_VERSION,
    kpiMarkers: Object.freeze([]),
    riskMarkers: Object.freeze([]),
    markers: Object.freeze([]),
    markerCount: 0,
    kpiImprovementCount: 0,
    kpiDeclineCount: 0,
    riskIncreaseCount: 0,
    riskReductionCount: 0,
    visualOnly: true,
    mutation: false,
    kpiMutation: false,
    riskMutation: false,
    sceneMutation: false,
    topologyMutation: false,
    routingMutation: false,
    readOnly: true,
    diagnostics: KPI_RISK_VISUAL_DIAGNOSTICS,
  });

let latestKpiRiskVisualLayerResult: KpiRiskCompareVisualLayerResult =
  EMPTY_KPI_RISK_COMPARE_VISUAL_LAYER_RESULT;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function kpiDisplay(difference: KpiDifferenceProfile): Extract<
  KpiRiskVisualDisplay,
  "KPI Improvement" | "KPI Decline"
> {
  const combinedDelta = difference.kpiHealthDelta + difference.kpiTrendDelta + difference.kpiImpactDelta;
  return combinedDelta >= 0 ? "KPI Improvement" : "KPI Decline";
}

function riskDisplay(difference: RiskDifferenceProfile): Extract<
  KpiRiskVisualDisplay,
  "Risk Increase" | "Risk Reduction"
> {
  const combinedDelta = difference.riskExposureDelta + difference.riskProbabilityDelta;
  return combinedDelta > 0 ? "Risk Increase" : "Risk Reduction";
}

export function buildKpiDifferenceProfile(
  input: Omit<KpiDifferenceProfile, "readOnly" | "mutation" | "kpiMutation">
): KpiDifferenceProfile {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    mutation: false as const,
    kpiMutation: false as const,
  });
}

export function buildRiskDifferenceProfile(
  input: Omit<RiskDifferenceProfile, "readOnly" | "mutation" | "riskMutation">
): RiskDifferenceProfile {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    mutation: false as const,
    riskMutation: false as const,
  });
}

export function buildKpiCompareVisualMarker(difference: KpiDifferenceProfile): KpiRiskVisualMarker {
  return Object.freeze({
    markerId: `kpi-risk-visual:${difference.comparisonId}:${difference.differenceId}:${difference.kpiId}`,
    differenceId: difference.differenceId,
    targetId: difference.kpiId,
    targetLabel: difference.kpiLabel,
    kind: "kpi" as const,
    display: kpiDisplay(difference),
    intensity: clampScore(
      Math.abs(difference.kpiHealthDelta) +
      Math.abs(difference.kpiTrendDelta) +
      Math.abs(difference.kpiImpactDelta)
    ),
    confidence: clampScore(difference.confidence),
    label: difference.summary,
    visualOnly: true as const,
    mutation: false as const,
    kpiMutation: false as const,
    riskMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    readOnly: true as const,
  });
}

export function buildRiskCompareVisualMarker(difference: RiskDifferenceProfile): KpiRiskVisualMarker {
  return Object.freeze({
    markerId: `kpi-risk-visual:${difference.comparisonId}:${difference.differenceId}:${difference.riskId}`,
    differenceId: difference.differenceId,
    targetId: difference.riskId,
    targetLabel: difference.riskLabel,
    kind: "risk" as const,
    display: riskDisplay(difference),
    intensity: clampScore(Math.abs(difference.riskExposureDelta) + Math.abs(difference.riskProbabilityDelta)),
    confidence: clampScore(difference.confidence),
    label: difference.summary,
    visualOnly: true as const,
    mutation: false as const,
    kpiMutation: false as const,
    riskMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    readOnly: true as const,
  });
}

export function generateKpiRiskCompareVisualLayer(
  input: KpiRiskCompareVisualLayerInput
): KpiRiskCompareVisualLayerResult {
  const kpiMarkers = Object.freeze(
    input.kpiDifferences.map((difference) => buildKpiCompareVisualMarker(difference))
  );
  const riskMarkers = Object.freeze(
    input.riskDifferences.map((difference) => buildRiskCompareVisualMarker(difference))
  );
  const markers = Object.freeze([...kpiMarkers, ...riskMarkers]);

  latestKpiRiskVisualLayerResult = Object.freeze({
    version: KPI_RISK_COMPARE_VISUAL_LAYER_VERSION,
    kpiMarkers,
    riskMarkers,
    markers,
    markerCount: markers.length,
    kpiImprovementCount: kpiMarkers.filter((marker) => marker.display === "KPI Improvement").length,
    kpiDeclineCount: kpiMarkers.filter((marker) => marker.display === "KPI Decline").length,
    riskIncreaseCount: riskMarkers.filter((marker) => marker.display === "Risk Increase").length,
    riskReductionCount: riskMarkers.filter((marker) => marker.display === "Risk Reduction").length,
    visualOnly: true as const,
    mutation: false as const,
    kpiMutation: false as const,
    riskMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    readOnly: true as const,
    diagnostics: KPI_RISK_VISUAL_DIAGNOSTICS,
  });

  return latestKpiRiskVisualLayerResult;
}

export function getKpiRiskCompareVisualLayerResult(): KpiRiskCompareVisualLayerResult {
  return latestKpiRiskVisualLayerResult;
}

export function resetKpiRiskCompareVisualLayerForTests(): void {
  latestKpiRiskVisualLayerResult = EMPTY_KPI_RISK_COMPARE_VISUAL_LAYER_RESULT;
}

export const KpiRiskCompareVisualLayer = Object.freeze({
  buildKpiDifferenceProfile,
  buildRiskDifferenceProfile,
  buildKpiCompareVisualMarker,
  buildRiskCompareVisualMarker,
  generateKpiRiskCompareVisualLayer,
  getKpiRiskCompareVisualLayerResult,
  resetKpiRiskCompareVisualLayerForTests,
  diagnostics: KPI_RISK_VISUAL_DIAGNOSTICS,
  emptyResult: EMPTY_KPI_RISK_COMPARE_VISUAL_LAYER_RESULT,
});
