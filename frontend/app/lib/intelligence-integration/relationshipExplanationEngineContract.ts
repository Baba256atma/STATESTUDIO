/**
 * INT:3 — Relationship Explanation Engine contract.
 *
 * Template-driven read-only executive relationship explanations from certified
 * DS-4 relationship intelligence. No AI generation, mutations, or routing changes.
 */

import type { ExecutiveRelationshipSummary } from "../relationship-intelligence/executiveRelationshipSummaryContract.ts";
import { EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY } from "../relationship-intelligence/executiveRelationshipSummaryContract.ts";

export const RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTIC =
  "[RELATIONSHIP_EXPLANATION_ENGINE]" as const;

export const RELATIONSHIP_EXPLANATION_READY_DIAGNOSTIC =
  "[RELATIONSHIP_EXPLANATION_READY]" as const;

export const INT3_RELATIONSHIP_EXPLANATION_COMPLETE_TAG =
  "[INT3_RELATIONSHIP_EXPLANATION_COMPLETE]" as const;

export const RELATIONSHIP_EXPLANATION_ENGINE_VERSION = "3.3.0" as const;

export type ExecutiveRelationshipExplanation = Readonly<{
  relationshipId: string;
  label: string;
  dependencyExplanation: string;
  influenceExplanation: string;
  strengthExplanation: string;
  riskExposureExplanation: string;
  whyDependencyCritical: string | null;
  whyInfluenceStrong: string | null;
  whyExposureHigh: string | null;
  executiveSummary: string;
}>;

export type RelationshipExplanationRegistry = Readonly<{
  version: typeof RELATIONSHIP_EXPLANATION_ENGINE_VERSION;
  explanationCount: number;
  explanations: readonly ExecutiveRelationshipExplanation[];
  executiveSummary: string;
  relationshipIntelligence: ExecutiveRelationshipSummary;
  explanationReady: true;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTIC,
    typeof RELATIONSHIP_EXPLANATION_READY_DIAGNOSTIC,
  ];
}>;

export type RelationshipExplanationEngineBuildInput = Readonly<{
  sceneJson?: unknown;
  relationships?: readonly unknown[];
  objects?: readonly unknown[];
  relationshipIntelligence?: ExecutiveRelationshipSummary;
}>;

export const RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTICS = Object.freeze([
  RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_EXPLANATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RELATIONSHIP_EXPLANATION_REGISTRY: RelationshipExplanationRegistry =
  Object.freeze({
    version: RELATIONSHIP_EXPLANATION_ENGINE_VERSION,
    explanationCount: 0,
    explanations: Object.freeze([]),
    executiveSummary: "No relationship explanations are available.",
    relationshipIntelligence: EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY,
    explanationReady: true,
    readOnly: true,
    sceneMutation: false,
    objectMutation: false,
    mrpMutation: false,
    routingMutation: false,
    topologyMutation: false,
    legacyRouterUsage: false,
    diagnostics: RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTICS,
  });
