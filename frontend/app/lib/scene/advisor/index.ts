export type {
  BuildExecutiveAdvisorInput,
  ExecutiveAdvisorCopilotContext,
  ExecutiveAdvisorHudModel,
  ExecutiveAdvisorObservation,
  ExecutiveAdvisorQuestion,
  ExecutiveAdvisorRecommendation,
  ExecutiveAdvisorRecommendationStatus,
  ExecutiveAdvisorState,
  ExecutiveAdvisorStrategicBrief,
} from "./executiveAdvisorTypes.ts";

export {
  buildExecutiveAdvisorState,
  resolveAdvisorProactivePrompt,
  resolveExecutiveAdvisorCopilotPrompt,
} from "./executiveAdvisorRuntime.ts";

export {
  buildAdvisorEvidence,
  detectAdvisorObservations,
  detectTradeOffs,
  generateStrategicQuestions,
} from "./strategicCoReasoningEngine.ts";

export {
  clearExecutiveAdvisor,
  getExecutiveAdvisorServerSnapshot,
  getExecutiveAdvisorState,
  refreshExecutiveAdvisor,
  resetExecutiveAdvisorForTests,
  setExecutiveAdvisorRecommendationStatus,
  subscribeExecutiveAdvisor,
} from "./executiveAdvisorStore.ts";

export {
  logE299AdvisorInitialized,
  logE299OpportunityDetected,
  logE299RecommendationGenerated,
  logE299RiskDetected,
  logE299StrategicQuestionGenerated,
} from "./executiveAdvisorDiagnostics.ts";
