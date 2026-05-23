import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveFeedbackItem,
  FeedbackCaptureRegistry,
  FeedbackDimensionScores,
  FeedbackSource,
  FeedbackType,
} from "./executiveFeedbackTypes.ts";

const DEFAULT_DIMENSIONS: FeedbackDimensionScores = Object.freeze({
  usability: 0.5,
  trustworthiness: 0.5,
  clarity: 0.5,
  explainability: 0.5,
  workflowQuality: 0.5,
  decisionUsefulness: 0.5,
  simulationUsefulness: 0.5,
  dashboardEffectiveness: 0.5,
});

export type RegisterExecutiveFeedbackInput = {
  organizationId?: string;
  type: FeedbackType;
  source: FeedbackSource;
  authorRole: string;
  summary: string;
  detail?: string;
  relatedWorkflow?: string | null;
  dimensions?: Partial<FeedbackDimensionScores>;
  tags?: readonly string[];
  attribution?: string;
  now?: number;
};

function clampScore(value: number | undefined, fallback: number): number {
  return Math.max(0, Math.min(1, Number((value ?? fallback).toFixed(4))));
}

function normalizeDimensions(input?: Partial<FeedbackDimensionScores>): FeedbackDimensionScores {
  return {
    usability: clampScore(input?.usability, DEFAULT_DIMENSIONS.usability),
    trustworthiness: clampScore(input?.trustworthiness, DEFAULT_DIMENSIONS.trustworthiness),
    clarity: clampScore(input?.clarity, DEFAULT_DIMENSIONS.clarity),
    explainability: clampScore(input?.explainability, DEFAULT_DIMENSIONS.explainability),
    workflowQuality: clampScore(input?.workflowQuality, DEFAULT_DIMENSIONS.workflowQuality),
    decisionUsefulness: clampScore(input?.decisionUsefulness, DEFAULT_DIMENSIONS.decisionUsefulness),
    simulationUsefulness: clampScore(input?.simulationUsefulness, DEFAULT_DIMENSIONS.simulationUsefulness),
    dashboardEffectiveness: clampScore(input?.dashboardEffectiveness, DEFAULT_DIMENSIONS.dashboardEffectiveness),
  };
}

export function createFeedbackCaptureRegistry(organizationId = "nexora-default", now = 0): FeedbackCaptureRegistry {
  return {
    organizationId: organizationId.trim() || "nexora-default",
    feedback: Object.freeze([]),
    signature: stableSignature(["d10-feedback-registry", organizationId.trim() || "nexora-default", 0]),
    updatedAt: now,
  };
}

export function registerExecutiveFeedback(
  registry: FeedbackCaptureRegistry,
  input: RegisterExecutiveFeedbackInput
): FeedbackCaptureRegistry {
  const organizationId = input.organizationId?.trim() || registry.organizationId || "nexora-default";
  const now = input.now ?? Date.now();
  const summary = input.summary.trim();
  const detail = input.detail?.trim() ?? "";
  const tags = Array.from(new Set((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean))).sort();
  const dimensions = normalizeDimensions(input.dimensions);
  const attribution = input.attribution?.trim() || input.authorRole.trim() || input.source;
  const signature = stableSignature([
    "d10-feedback-item",
    organizationId,
    input.type,
    input.source,
    input.authorRole.trim(),
    summary,
    detail,
    input.relatedWorkflow ?? null,
    tags,
    dimensions,
    attribution,
  ]);
  const existing = registry.feedback.find((item) => item.signature === signature);
  if (existing) return registry;

  const feedback: ExecutiveFeedbackItem = {
    feedbackId: stableSignature(["d10-feedback-id", signature]).slice(0, 56),
    organizationId,
    type: input.type,
    source: input.source,
    authorRole: input.authorRole.trim() || input.source,
    summary,
    detail,
    relatedWorkflow: input.relatedWorkflow?.trim() || null,
    dimensions,
    tags: Object.freeze(tags),
    generatedAt: now,
    attribution,
    signature,
  };
  const nextFeedback = [...registry.feedback, feedback].sort((a, b) => a.generatedAt - b.generatedAt || a.feedbackId.localeCompare(b.feedbackId));

  return {
    organizationId,
    feedback: Object.freeze(nextFeedback),
    updatedAt: now,
    signature: stableSignature(["d10-feedback-registry", organizationId, nextFeedback.map((item) => item.signature)]),
  };
}
