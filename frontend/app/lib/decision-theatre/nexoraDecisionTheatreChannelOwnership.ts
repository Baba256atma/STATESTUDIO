/**
 * DTH:3 — Visual channel ownership. One primary managerial meaning per channel.
 */

import {
  NEXORA_DECISION_THEATRE_CHANNEL_MEANING,
  NEXORA_DECISION_THEATRE_VISUAL_CHANNELS,
  type NexoraDecisionTheatreVisualChannel,
} from "./nexoraDecisionTheatreVisualGrammar.ts";

export const nexoraDecisionTheatreChannelOwnershipIdentity =
  "DTH:3/VisualChannelOwnership" as const;

export type NexoraDecisionTheatreChannelOwnership = Readonly<{
  channel: NexoraDecisionTheatreVisualChannel;
  primaryMeaning: string;
  mustNotMean: readonly string[];
}>;

export const NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP: Readonly<
  Record<NexoraDecisionTheatreVisualChannel, NexoraDecisionTheatreChannelOwnership>
> = Object.freeze(
  Object.fromEntries(
    NEXORA_DECISION_THEATRE_VISUAL_CHANNELS.map((channel) => {
      const prohibited: Record<NexoraDecisionTheatreVisualChannel, readonly string[]> = {
        form: Object.freeze(["status", "urgency", "confidence"]),
        color: Object.freeze([
          "object type",
          "category decoration",
          "importance",
          "cost magnitude",
          "confidence percentage",
          "relationship strength",
        ]),
        size: Object.freeze([
          "urgency",
          "cost",
          "popularity",
          "confidence",
          "selection",
          "canonical importance",
          "business value",
        ]),
        distance: Object.freeze([
          "causality",
          "risk probability",
          "priority",
          "time duration",
          "organizational hierarchy",
        ]),
        opacity: Object.freeze([
          "deleted",
          "invalid",
          "resolved",
          "unimportant",
          "low confidence",
          "inactive business state",
        ]),
        halo: Object.freeze([
          "selection",
          "focus",
          "critical status",
          "recommendation",
          "approval",
          "execution readiness",
        ]),
        "line-pattern": Object.freeze(["causality", "falsehood", "deletion"]),
        "line-weight": Object.freeze([
          "mention count",
          "visual proximity",
          "object status",
          "director preference",
          "advisor recommendation",
        ]),
        direction: Object.freeze(["causality unless the causal layer supports it"]),
        motion: Object.freeze(["decorative life", "unsupported urgency"]),
        iconography: Object.freeze(["status", "urgency", "confidence"]),
      };
      return [
        channel,
        Object.freeze({
          channel,
          primaryMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING[channel],
          mustNotMean: prohibited[channel],
        }),
      ];
    }),
  ),
) as Readonly<Record<NexoraDecisionTheatreVisualChannel, NexoraDecisionTheatreChannelOwnership>>;
