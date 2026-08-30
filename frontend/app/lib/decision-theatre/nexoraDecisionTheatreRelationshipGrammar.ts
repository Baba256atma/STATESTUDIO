/**
 * DTH:3 — Relationship presentation resolver.
 * Relationship is not causality. Direction is not cause. Strength is not impact.
 */

export const nexoraDecisionTheatreRelationshipGrammarIdentity =
  "DTH:3/RelationshipVisualGrammar" as const;

export type NexoraDecisionTheatreRelationshipSupportState =
  | "established"
  | "candidate"
  | "unknown";

export type NexoraDecisionTheatreRelationshipVisual = Readonly<{
  relationshipId: string;
  semanticType: string | null;
  supportState: NexoraDecisionTheatreRelationshipSupportState;
  patternToken: "line-supported" | "line-candidate" | "line-unknown";
  weightToken: "weight-neutral" | "weight-lower" | "weight-higher";
  directionToken: "arrow-source-to-target" | "arrow-target-to-source" | "arrow-none";
  causalStatus: "unsupported" | "supported";
  causalLanguageAllowed: boolean;
  provenance: string;
  uncertainty: string;
  explanation: string;
  mustNotInfer: readonly string[];
  fallback: "none" | "neutral";
}>;

function comparableNumbers(values: readonly (number | null | undefined)[]): number[] {
  return values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

export function resolveRelationshipWeightToken(input: {
  readonly own: number | null | undefined;
  readonly peers: readonly (number | null | undefined)[];
  readonly comparable: boolean;
}): NexoraDecisionTheatreRelationshipVisual["weightToken"] {
  if (!input.comparable) return "weight-neutral";
  const peers = comparableNumbers([input.own, ...input.peers]);
  if (peers.length < 2 || input.own == null || !Number.isFinite(input.own)) {
    return "weight-neutral";
  }
  const min = Math.min(...peers);
  const max = Math.max(...peers);
  if (max === min) return "weight-neutral";
  const mid = (min + max) / 2;
  if (input.own < mid) return "weight-lower";
  if (input.own > mid) return "weight-higher";
  return "weight-neutral";
}

export function resolveNexoraDecisionTheatreRelationshipVisual(input: {
  readonly relationshipId: string;
  readonly semanticType: string | null;
  readonly supportState?: NexoraDecisionTheatreRelationshipSupportState | null;
  readonly strength?: number | null;
  readonly peerStrengths?: readonly (number | null | undefined)[];
  readonly strengthComparable?: boolean;
  readonly direction?: "source-to-target" | "target-to-source" | "none" | null;
  readonly causalAuthority?: boolean;
  readonly provenance?: string | null;
}): NexoraDecisionTheatreRelationshipVisual {
  const support: NexoraDecisionTheatreRelationshipSupportState =
    input.supportState === "established" || input.supportState === "candidate"
      ? input.supportState
      : "unknown";
  const patternToken =
    support === "established"
      ? "line-supported"
      : support === "candidate"
        ? "line-candidate"
        : "line-unknown";
  const weightToken = resolveRelationshipWeightToken({
    own: input.strength,
    peers: input.peerStrengths ?? [],
    comparable: input.strengthComparable === true,
  });
  const directionToken =
    input.direction === "source-to-target"
      ? "arrow-source-to-target"
      : input.direction === "target-to-source"
        ? "arrow-target-to-source"
        : "arrow-none";
  const causalLanguageAllowed = input.causalAuthority === true;
  const explanationParts = [
    support === "established"
      ? "This relationship is supported by authoritative association."
      : support === "candidate"
        ? "This relationship is hypothesized and is not confirmed."
        : "This relationship is unresolved. That does not mean it is false.",
    directionToken === "arrow-none"
      ? "No authoritative direction is shown."
      : "An arrow shows supported direction of dependency or flow, not cause by itself.",
    causalLanguageAllowed
      ? "Causal language is allowed because the causal authority supports it."
      : "Do not describe this as a confirmed cause.",
  ];
  return Object.freeze({
    relationshipId: input.relationshipId,
    semanticType: input.semanticType,
    supportState: support,
    patternToken,
    weightToken,
    directionToken,
    causalStatus: causalLanguageAllowed ? "supported" : "unsupported",
    causalLanguageAllowed,
    provenance: input.provenance?.trim() || "stage-relationship-projection",
    uncertainty:
      support === "unknown"
        ? "Support is unknown; missing support is not a negative finding."
        : support === "candidate"
          ? "Candidate support remains unconfirmed."
          : "Support follows the stated authoritative association.",
    explanation: explanationParts.join(" "),
    mustNotInfer: Object.freeze([
      "causality",
      "false relationship",
      "high business impact from line weight",
      "execution order unless specified",
      "influence from association alone",
    ]),
    fallback: input.supportState == null ? "neutral" : "none",
  });
}
