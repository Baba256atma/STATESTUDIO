/**
 * MO:1 — manager-relevant affordances from object context.
 * Guidance only. Does not invent next objects or actions.
 */

import type { ManagerObjectContext } from "./managerObjectContext.ts";
import type { ManagerObjectIntent } from "./managerObjectInteractionFoundation.ts";

export type ManagerObjectAffordance = {
  readonly id: string;
  readonly label: string;
  readonly targetObjectId: string | null;
  readonly support: "KNOWN" | "UNKNOWN";
};

export type ManagerObjectGuidance = {
  readonly suggestedNextQuestions: readonly string[];
  readonly relatedObjectIds: readonly string[];
  readonly availableActions: readonly ManagerObjectAffordance[];
};

export function deriveManagerObjectGuidance(
  context: ManagerObjectContext,
  intent: ManagerObjectIntent,
): ManagerObjectGuidance {
  const relatedObjectIds = Object.freeze(
    [
      ...new Set(
        context.relationships
          .map((edge) => edge.otherId)
          .filter((id): id is string => id != null),
      ),
    ],
  );
  const availableActions: ManagerObjectAffordance[] = [];
  if (context.associatedProblem.value) {
    availableActions.push({
      id: "inspect-problem",
      label: "Inspect associated problem",
      targetObjectId: context.associatedProblem.value,
      support: "KNOWN",
    });
  }
  if (context.scenarios.value?.[0]) {
    availableActions.push({
      id: "explore-scenario",
      label: "Explore associated scenario",
      targetObjectId: context.scenarios.value[0],
      support: "KNOWN",
    });
  }
  if (context.decisions.value?.[0]) {
    availableActions.push({
      id: "review-decision",
      label: "Review associated decision",
      targetObjectId: context.decisions.value[0],
      support: "KNOWN",
    });
  }
  if (context.execution.value) {
    availableActions.push({
      id: "open-execution",
      label: "Open associated execution",
      targetObjectId: context.execution.value,
      support: "KNOWN",
    });
  }
  if (context.associatedGoal.value && context.objectId !== context.associatedGoal.value) {
    availableActions.push({
      id: "open-goal",
      label: "Open associated goal",
      targetObjectId: context.associatedGoal.value,
      support: "KNOWN",
    });
  }

  const suggestedNextQuestions = suggestQuestions(intent, context);

  return Object.freeze({
    suggestedNextQuestions,
    relatedObjectIds,
    availableActions: Object.freeze(availableActions),
  });
}

function suggestQuestions(
  intent: ManagerObjectIntent,
  context: ManagerObjectContext,
): readonly string[] {
  const questions: string[] = [];
  if (intent === "EXPLAIN" || intent === "STATUS") {
    questions.push("Why does it matter?");
    questions.push("What is connected to it?");
  }
  if (intent === "WHY" || intent === "RELATIONSHIPS") {
    questions.push("Is there a problem or risk?");
    if (context.scenarios.support === "KNOWN") {
      questions.push("What are my options?");
    }
  }
  if (intent === "RISK" || intent === "IMPACT") {
    questions.push("What happens if I do nothing?");
    questions.push("What should I do about this?");
  }
  if (intent === "OPTIONS" || intent === "SCENARIO") {
    questions.push("What do you recommend?");
    questions.push("What decision is required?");
  }
  if (intent === "RECOMMEND" || intent === "DECIDE") {
    questions.push("What should happen next?");
  }
  if (intent === "NEXT_ACTION" || intent === "EXECUTION") {
    questions.push("What is the outcome?");
  }
  if (context.kpi.support === "UNKNOWN") {
    questions.push("What evidence is still unknown?");
  }
  return Object.freeze(questions.slice(0, 4));
}
