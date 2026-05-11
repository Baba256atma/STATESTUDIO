import type { SceneJson } from "../sceneTypes.ts";
import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCScenarioDraft } from "./typeCScenarioDrafts.ts";

export type TypeCSandboxRequest = {
  sceneSnapshot: SceneJson;
  currentRecommendation?: TypeCDecisionRecommendation | null;
  activeScenario?: TypeCScenarioDraft | null;
};

export type TypeCSandboxStrategy = {
  id: string;
  title: string;
  description: string;
  proposedActions: string[];
  expectedBenefits: string[];
  risks: string[];
  confidence: number;
};

export type TypeCSandboxResult = {
  strategies: TypeCSandboxStrategy[];
  bestStrategyId?: string | null;
  summary: string;
  source?: "sandbox";
};
