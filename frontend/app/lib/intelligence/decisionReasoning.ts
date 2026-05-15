/**
 * Decision Intelligence — reasoning graph primitives (D4 foundation).
 *
 * Purpose: tree-shaped explanations with evidence hooks for war-room / audit / graph UI.
 * Future role: populated by strategy engines and optional LLM adapters behind the same contract.
 * Boundaries: structural types only; no graph layout or React rendering here.
 */

import type { DecisionConfidenceBand } from "./decisionTypes.ts";

export type DecisionReasoningNodeKind =
  | "premise"
  | "synthesis"
  | "tradeoff"
  | "conclusion"
  | "counterfactual"
  | "audit";

/**
 * Recursive reasoning node — supports nested explanations and evidence ids only (not embedded evidence blobs).
 */
export type DecisionReasoningNode = Readonly<{
  readonly id: string;
  readonly kind: DecisionReasoningNodeKind;
  readonly statement: string;
  /** Local confidence for this node (0–1), distinct from recommendation-level confidence. */
  readonly confidence01: number;
  /** References DecisionEvidence.id values held on the parent recommendation / insight. */
  readonly evidenceIds: readonly string[];
  /** Optional weight when aggregating children (0–1). */
  readonly weight01?: number;
  /** Optional band for pre-computed UI tone without recomputing thresholds. */
  readonly confidenceBand?: DecisionConfidenceBand;
  readonly children: readonly DecisionReasoningNode[];
}>;

/** Optional future graph edge (e.g. war-room layout); not required for tree-only explanations. */
export type DecisionReasoningEdge = Readonly<{
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly relation: "supports" | "contradicts" | "refines" | "derives";
}>;

export type DecisionReasoningGraph = Readonly<{
  readonly rootId: string;
  readonly nodes: readonly DecisionReasoningNode[];
  readonly edges: readonly DecisionReasoningEdge[];
}>;
