/**
 * CC:4 — Map CC:3 commands → Runtime action plans (no execution).
 *
 * Documents support / unsupported boundaries against existing MVP authorities.
 */

import type { NexoraConversationalCommand } from "./conversationalCommand.ts";
import {
  CONVERSATIONAL_RUNTIME_BRIDGE_REASON,
  type NexoraConversationalRuntimeActionPlan,
} from "./conversationalRuntimeBridge.ts";

export type ConversationalCommandSupport =
  | {
      readonly supported: true;
      readonly plan: NexoraConversationalRuntimeActionPlan;
    }
  | {
      readonly supported: false;
      readonly reason: string;
      readonly plan: null;
    };

/**
 * Translate a validated CC:3 command into an existing Runtime action plan.
 * Does not mutate Runtime. Does not invent engines.
 */
export function mapConversationalCommandToRuntimeAction(
  command: NexoraConversationalCommand,
): ConversationalCommandSupport {
  const base = {
    primaryTargetId: command.primaryTargetId,
    secondaryTargetIds: Object.freeze([...command.secondaryTargetIds]),
    source: "conversation" as const,
  };

  switch (command.kind) {
    case "focus-subject":
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          runtimeActionKind: "select-interaction-subject",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_FOCUS_DISPATCHED,
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.CONVERGES_WITH_CLICK,
            "authority:selectNexoraMVPInteractionSubject",
          ]),
        }),
      };

    case "explore-subject":
      // Existing exploration authority = focus + context disclosure.
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          runtimeActionKind: "select-interaction-subject",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_EXPLORE_AS_FOCUS,
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.CONVERGES_WITH_CLICK,
            "authority:selectNexoraMVPInteractionSubject",
          ]),
        }),
      };

    case "analyze-subject":
      // No generative analyze engine — route to focus so Advisor derives.
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          runtimeActionKind: "select-interaction-subject",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_ANALYZE_AS_FOCUS,
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.CONVERGES_WITH_CLICK,
            "authority:selectNexoraMVPInteractionSubject+advisor-derive",
          ]),
        }),
      };

    case "open-overview":
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          primaryTargetId: null,
          secondaryTargetIds: Object.freeze([]),
          runtimeActionKind: "reset-overview",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_OVERVIEW_DISPATCHED,
            "authority:resetNexoraMVPObjectInteractionOverview",
          ]),
        }),
      };

    case "navigate-back":
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          primaryTargetId: null,
          secondaryTargetIds: Object.freeze([]),
          runtimeActionKind: "navigation-step-back",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_NAVIGATION_BACK_DISPATCHED,
            "authority:stepBackNexoraMVPObjectInteraction",
          ]),
        }),
      };

    case "navigate-forward":
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          primaryTargetId: null,
          secondaryTargetIds: Object.freeze([]),
          runtimeActionKind: "navigation-step-forward",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_NAVIGATION_FORWARD_DISPATCHED,
            "authority:stepForwardNexoraMVPObjectInteraction",
          ]),
        }),
      };

    case "reveal-related":
      // Related disclosure is produced by focusing the anchor subject.
      if (!command.primaryTargetId) {
        return {
          supported: false,
          reason:
            "reveal-related without anchor has no canonical Runtime collection",
          plan: null,
        };
      }
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          runtimeActionKind: "select-interaction-subject",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_REVEAL_DISPATCHED,
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.CONVERGES_WITH_CLICK,
            "authority:selectNexoraMVPInteractionSubject→related-disclosure",
          ]),
        }),
      };

    case "reveal-problems":
      return mapRevealCollection(command, "problem", base);
    case "reveal-scenarios":
      return mapRevealCollection(command, "scenario", base);
    case "reveal-decisions":
      return mapRevealCollection(command, "decision", base);
    case "reveal-execution":
      return mapRevealCollection(command, "execution", base);

    case "reveal-goals":
      return {
        supported: false,
        reason:
          "no canonical goals queue/collection Runtime authority in MVP Stage",
        plan: null,
      };

    case "compare-subjects":
      return {
        supported: false,
        reason:
          "no canonical comparison Runtime engine; will not invent compare UI",
        plan: null,
      };

    case "simulate-scenario":
      // Safe entry: focus scenario subject. Full simulation engine unsupported.
      if (!command.primaryTargetId) {
        return {
          supported: false,
          reason: "simulate-scenario requires a scenario subject id",
          plan: null,
        };
      }
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          runtimeActionKind: "select-interaction-subject",
          collectionCategory: null,
          notes: Object.freeze([
            "simulate-scenario→select-scenario-subject-only",
            "full-scenario-simulation-engine-not-invoked",
            "authority:selectNexoraMVPInteractionSubject",
          ]),
        }),
      };

    case "prepare-executive-context":
    case "switch-workspace":
      if (!command.primaryTargetId) {
        return {
          supported: false,
          reason: "experience command requires a registered workspace id",
          plan: null,
        };
      }
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          runtimeActionKind: "change-workspace",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_WORKSPACE_DISPATCHED,
            "authority:applyNexoraMVPWorkspaceChangeToInteraction",
            ...(command.secondaryTargetIds[0]
              ? [
                  "authority:selectNexoraMVPInteractionSubject",
                  "explicit-subject-preserved-over-experience-default",
                ]
              : []),
          ]),
        }),
      };

    case "request-recommendation":
    case "request-explanation":
    case "request-prioritization":
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          runtimeActionKind: "resolve-executive-recommendation",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_RECOMMENDATION_DISPATCHED,
            "authority:resolveNexoraExecutiveRecommendation",
            "advisory-only-no-runtime-mutation",
          ]),
        }),
      };

    case "define-scenario":
    case "modify-scenario":
    case "evaluate-scenario":
    case "compare-scenarios":
    case "explain-scenario":
    case "open-scenario":
    case "defer-decision-commitment":
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          runtimeActionKind: "resolve-executive-scenario",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_SCENARIO_DISPATCHED,
            "authority:resolveNexoraExecutiveScenarioConversation",
            "advisory-only-no-runtime-mutation",
            "legacy-defer-decision-commitment",
          ]),
        }),
      };

    case "commit-decision":
    case "approve-decision":
    case "reject-decision":
    case "defer-decision":
    case "reconsider-decision":
    case "confirm-decision-commitment":
    case "cancel-decision-commitment":
    case "prefer-option":
      return {
        supported: true,
        plan: Object.freeze({
          ...base,
          runtimeActionKind: "resolve-executive-decision-commitment",
          collectionCategory: null,
          notes: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_DECISION_COMMITMENT_DISPATCHED,
            "authority:resolveNexoraExecutiveDecisionCommitment",
            "decision-authority-only-no-stage-mutation",
            "stops-before-execution",
          ]),
        }),
      };

    case "unsupported":
    default:
      return {
        supported: false,
        reason: CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_UNSUPPORTED,
        plan: null,
      };
  }
}

function mapRevealCollection(
  command: NexoraConversationalCommand,
  category: "problem" | "scenario" | "decision" | "execution",
  base: {
    readonly primaryTargetId: string | null;
    readonly secondaryTargetIds: readonly string[];
    readonly source: "conversation";
  },
): ConversationalCommandSupport {
  // With anchor: focus subject so linked context nodes disclose (canonical).
  // Without anchor: open Queue collection for that category.
  if (command.primaryTargetId) {
    return {
      supported: true,
      plan: Object.freeze({
        ...base,
        runtimeActionKind: "select-interaction-subject",
        collectionCategory: null,
        notes: Object.freeze([
          CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_REVEAL_DISPATCHED,
          `reveal-${category}-with-anchor→focus-for-context-disclosure`,
          "authority:selectNexoraMVPInteractionSubject",
        ]),
      }),
    };
  }

  return {
    supported: true,
    plan: Object.freeze({
      ...base,
      primaryTargetId: null,
      runtimeActionKind: "open-queue-collection",
      collectionCategory: category,
      notes: Object.freeze([
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_REVEAL_DISPATCHED,
        `reveal-${category}-collection`,
        "authority:openNexoraMVPExecutiveQueueCollection",
      ]),
    }),
  };
}
