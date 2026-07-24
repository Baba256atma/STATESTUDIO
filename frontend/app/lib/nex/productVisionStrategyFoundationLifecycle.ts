/**
 * NEX-1:1 — Declarative product lifecycle metadata.
 *
 * This is not a state machine and executes no transitions.
 */

import type { ProductReferenceEntry } from "./productVisionStrategyFoundationTypes.ts";

export const ProductVisionStrategyLifecycleStages: readonly ProductReferenceEntry[] =
  Object.freeze([
    Object.freeze({ id: "NEX/Lifecycle/Discover", name: "Discover", description: "Understand users, decisions, and strategic problems.", order: 1, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX/Lifecycle/Define", name: "Define", description: "Define product intent, outcomes, scope, and boundaries.", order: 2, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX/Lifecycle/Develop", name: "Develop", description: "Guide delivery through approved downstream technical layers.", order: 3, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX/Lifecycle/Release", name: "Release", description: "Describe product releases and their intended value.", order: 4, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX/Lifecycle/Learn", name: "Learn", description: "Evaluate declared product outcomes and strategic fit.", order: 5, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX/Lifecycle/Evolve", name: "Evolve", description: "Refine product direction through governed product-reference revisions.", order: 6, immutable: true, metadataOnly: true }),
  ] as const);

export const ProductVisionStrategyFoundationLifecycle = Object.freeze({
  id: "NEX-1:1/ProductLifecycle",
  stages: ProductVisionStrategyLifecycleStages,
  currentFoundationState: "Defined",
  readiness: "ReadyForRegistry",
  executesTransitions: false,
  runtimeStateMachine: false,
  immutable: true,
  metadataOnly: true,
} as const);
