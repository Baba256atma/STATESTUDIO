import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { ExecutivePublicationSummary, MVPCompletionScorecard, MVPCompletionState, PublicationRecommendation, PublishReadyDashboard, PublishRisk } from "./mvpCompletionTypes.ts";

function highestRisk(risks: readonly PublishRisk[]) {
  if (risks.some((risk) => risk.severity === "critical")) return "critical";
  if (risks.some((risk) => risk.severity === "warning")) return "warning";
  if (risks.some((risk) => risk.severity === "caution")) return "caution";
  return "informational";
}

export function buildPublishReadyDashboard(input: {
  organizationId: string;
  generatedAt: number;
  state: MVPCompletionState;
  recommendation: PublicationRecommendation;
  scorecard: MVPCompletionScorecard;
  risks: readonly PublishRisk[];
  summary: ExecutivePublicationSummary;
  readinessStatus: string;
  trustPosture: string;
}): PublishReadyDashboard {
  return {
    dashboardId: stableSignature(["d10-publish-dashboard", input.organizationId]).slice(0, 56),
    organizationId: input.organizationId,
    generatedAt: input.generatedAt,
    completionStatus: input.state,
    readinessStatus: input.readinessStatus,
    publicationStatus: input.recommendation,
    riskPosture: highestRisk(input.risks),
    trustPosture: input.trustPosture,
    executiveRecommendations: Object.freeze(input.summary.shouldHappenNext),
    scorecard: input.scorecard,
    summary: input.summary,
    signature: stableSignature(["d10-publish-dashboard", input.organizationId, input.state, input.recommendation, input.scorecard, input.summary.signature]),
  };
}
