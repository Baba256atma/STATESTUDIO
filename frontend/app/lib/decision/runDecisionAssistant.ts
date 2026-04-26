import { buildDecisionContext, type BuildDecisionContextInput } from "./decisionContextBuilder.ts";
import type { DecisionAssistantOutput } from "./decisionAssistantTypes.ts";
import { buildDecisionExecutiveBrief } from "./decisionExecutiveBrief.ts";
import { buildDecisionPanelData } from "./decisionPanelAdapter.ts";
import { buildDecisionRecommendation } from "./decisionRecommendationEngine.ts";
import { buildDecisionSceneAction } from "./decisionSceneAdapter.ts";
import { evaluateDecisionScenarios } from "./decisionScenarioEvaluator.ts";
import { getScenarioSeedsForDomain, resolveScenarioDomain } from "./scenarioPresetCatalog.ts";

export type RunDecisionAssistantInput = BuildDecisionContextInput;

export function runDecisionAssistant(input: RunDecisionAssistantInput): DecisionAssistantOutput {
  const context = buildDecisionContext(input);
  const domain: ReturnType<typeof resolveScenarioDomain> = resolveScenarioDomain(context.domainId);
  const scenarioSeeds = getScenarioSeedsForDomain(domain);
  const scenarios = evaluateDecisionScenarios(context, scenarioSeeds);
  const recommendation = buildDecisionRecommendation(context, scenarios);
  const executiveBrief = buildDecisionExecutiveBrief({
    context,
    recommendation,
    topScenario: scenarios[0],
  });
  const panelData = buildDecisionPanelData({
    context,
    scenarios,
    recommendation,
    executiveBrief,
  });
  const sceneAction = buildDecisionSceneAction({ context, recommendation, scenarios });

  return {
    context,
    scenarioSeeds,
    scenarios,
    recommendation,
    executiveBrief,
    sceneAction,
    panelData,
  };
}
