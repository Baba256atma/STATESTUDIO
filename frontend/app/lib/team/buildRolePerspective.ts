import { buildCognitiveDecisionView } from "../cognitive/buildCognitiveDecisionView";
import type { CognitiveStyle } from "../cognitive/cognitiveStyleTypes";
import type { TeamDecisionRole, TeamRolePerspective } from "./teamDecisionTypes";

type BuildRolePerspectiveInput = {
  role: TeamDecisionRole;
  canonicalRecommendation?: any | null;
  executiveSummary?: any | null;
  confidenceModel?: any | null;
  compareModel?: any | null;
  simulation?: any | null;
  patternIntelligence?: any | null;
  strategicLearning?: any | null;
  metaDecision?: any | null;
};

function unique(values: unknown[], limit = 3) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").replace(/\s+/g, " ").trim())
        .filter(Boolean)
    )
  ).slice(0, limit);
}

function roleToStyle(role: TeamDecisionRole): CognitiveStyle {
  return role;
}

export function buildRolePerspective(input: BuildRolePerspectiveInput): TeamRolePerspective {
  const view = buildCognitiveDecisionView({
    style: roleToStyle(input.role),
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    executiveSummary: input.executiveSummary ?? null,
    confidenceModel: input.confidenceModel ?? null,
    compareModel: input.compareModel ?? null,
    simulation: input.simulation ?? null,
    patternIntelligence: input.patternIntelligence ?? null,
    strategicLearning: input.strategicLearning ?? null,
    metaDecision: input.metaDecision ?? null,
  });

  return {
    role: input.role,
    headline: view.headline,
    priorities: unique(view.primary_focus, 3),
    concerns: unique(view.risks_to_watch, 3),
    suggested_next_action:
      view.next_actions[0] ??
      input.metaDecision?.next_best_actions?.[0] ??
      "Review the current recommendation before the team commits.",
    confidence_note: view.confidence_framing ?? null,
  };
}
