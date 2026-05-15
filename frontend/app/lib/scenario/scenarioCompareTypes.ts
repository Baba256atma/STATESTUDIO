export interface ScenarioComparison {
  id: string;
  scenarioAId: string;
  scenarioBId: string;
  comparisonTitle: string;
  executiveSummary: string;
  stabilityDelta: number;
  fragilityDelta: number;
  propagationDelta: number;
  confidenceDelta: number;
  recommendedScenarioId?: string;
  tradeoffs: string[];
  createdAt: number;
}

export type ScenarioComparisonMetric = {
  scenarioId: string;
  stabilityScore: number;
  fragilityScore: number;
  propagationScore: number;
  confidenceScore: number;
  dependencyDensity: number;
};
