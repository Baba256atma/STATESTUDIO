import { buildCanonicalRecommendation } from "../recommendation/buildCanonicalRecommendation";
import { buildDecisionMemoryEntry } from "../memory/buildDecisionMemoryEntry";
import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import { buildObservedOutcomeAssessment } from "../outcome/buildObservedOutcomeAssessment";
import { buildDecisionOutcomeFeedback } from "../outcome/buildDecisionOutcomeFeedback";
import { buildDecisionFeedbackSignal } from "../outcome/buildDecisionFeedbackSignal";
import { buildDecisionPatternIntelligence } from "../patterns/buildDecisionPatternIntelligence";
import { buildMetaDecisionState } from "../meta/buildMetaDecisionState";
import { buildDecisionTimeline } from "../../governance/buildDecisionTimeline";
import {
  buildReasoningOutput,
  createReasoningInput,
  type MatchedConcept,
  type ReasoningOutput,
} from "../../reasoning/aiReasoningContract";
import { buildSimulationResult, createSimulationInputFromPrompt, type SimulationResult } from "../simulationContract";
import { orchestrateMultiAgentDecision } from "../../reasoning/multiAgentDecisionEngineContract";
import type { DecisionExecutionResult } from "../../executive/decisionExecutionTypes";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import type { DecisionPipelineState } from "./decisionPipelineTypes";
import type { SimulationRelation } from "../simulationContract";
import type { SemanticObject } from "../../objectSemantics";
import type { SceneObject } from "../../sceneTypes";
import type { MultiAgentResult } from "../../reasoning/multiAgentDecisionEngineContract";

type RunDecisionPipelineInput = {
  prompt?: string | null;
  responseData?: Record<string, unknown> | null;
  sceneContext?: Record<string, unknown> | null;
  workspaceId?: string | null;
  projectId?: string | null;
  memoryEntries?: DecisionMemoryEntry[];
  decisionResult?: DecisionExecutionResult | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readNestedRecord(record: Record<string, unknown> | null | undefined, ...keys: string[]): Record<string, unknown> | null {
  let current: unknown = record;
  for (const key of keys) {
    current = asRecord(current)?.[key];
  }
  return asRecord(current);
}

function readNestedValue(record: Record<string, unknown> | null | undefined, ...keys: string[]): unknown {
  let current: unknown = record;
  for (const key of keys) {
    current = asRecord(current)?.[key];
  }
  return current;
}

function readCanonicalFromResponse(responseData: Record<string, unknown>): CanonicalRecommendation | null {
  const raw = responseData["canonical_recommendation"];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const primary = asRecord(record.primary);
  const reasoning = asRecord(record.reasoning);
  const confidence = asRecord(record.confidence);
  if (typeof record.id !== "string" || !primary || typeof primary.action !== "string") return null;
  if (!reasoning || typeof reasoning.why !== "string") return null;
  if (!confidence || typeof confidence.score !== "number") return null;
  if (!Array.isArray(record.alternatives)) return null;
  return raw as CanonicalRecommendation;
}

function getObjects(payload: Record<string, unknown> | null | undefined): unknown[] {
  const sceneJsonObjects = readNestedRecord(payload, "scene_json", "scene")?.objects;
  if (Array.isArray(sceneJsonObjects)) return sceneJsonObjects;
  const sceneObjects = readNestedRecord(payload, "scene")?.objects;
  if (Array.isArray(sceneObjects)) return sceneObjects;
  return Array.isArray(payload?.objects) ? payload.objects : [];
}

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function buildFallbackReasoning(input: RunDecisionPipelineInput): ReasoningOutput | null {
  const responseData = input.responseData ?? null;
  const prompt = text(input.prompt) || text(readNestedRecord(responseData, "prompt_feedback")?.prompt) || "";
  const projectId = String(input.projectId ?? responseData?.project_id ?? "default_project");
  const existingReasoning = readNestedValue(responseData, "ai_reasoning");
  if (!prompt) {
    return existingReasoning && typeof existingReasoning === "object"
      ? (existingReasoning as ReasoningOutput)
      : null;
  }

  return buildReasoningOutput(
    createReasoningInput({
      prompt,
      context: {
        workspace_id: input.workspaceId ?? undefined,
        project_id: projectId,
        project_domain:
          typeof readNestedValue(responseData, "project_domain") === "string"
            ? (readNestedValue(responseData, "project_domain") as string)
            : undefined,
        selected_object_id: null,
        active_mode: null,
        memory_signals: {
          volatile_nodes: (input.memoryEntries ?? []).flatMap((entry) => entry.target_ids ?? []).slice(0, 3),
          recurring_patterns: (input.memoryEntries ?? []).map((entry) => entry.recommendation_action ?? "").filter(Boolean).slice(0, 3),
        },
      },
      semanticObjects: getObjects(input.sceneContext ?? responseData) as SemanticObject[],
      simulationContext: {
        baseline_available: Boolean(
          readNestedValue(responseData, "decision_comparison") ?? readNestedValue(responseData, "comparison")
        ),
        active_scenario_id:
          typeof readNestedRecord(responseData, "decision_simulation", "scenario")?.id === "string"
            ? (readNestedRecord(responseData, "decision_simulation", "scenario")?.id as string)
            : undefined,
      },
      strategyContext: {
        at_risk_kpis:
          (readNestedRecord(responseData, "strategy_kpi", "impact_summary")?.at_risk_kpis as string[] | undefined) ?? [],
        threatened_objectives:
          (readNestedRecord(responseData, "strategy_kpi", "impact_summary")?.threatened_objectives as
            | string[]
            | undefined) ?? [],
      },
    })
  );
}

function buildFallbackSimulation(input: {
  prompt: string;
  reasoning: ReasoningOutput | null;
  responseData: Record<string, unknown> | null;
  projectId: string;
}): SimulationResult | null {
  const responseData = input.responseData;
  const existingSimulation = readNestedValue(responseData, "decision_simulation");
  if (existingSimulation) return existingSimulation as SimulationResult;
  if (!input.reasoning?.inferred_decision_input) return null;

  const simInput = createSimulationInputFromPrompt({
    text: input.prompt || "Recommended decision",
    matchedObjectIds: input.reasoning.inferred_decision_input.target_object_ids,
    topics: input.reasoning.inferred_decision_input.topics,
    kind: input.reasoning.inferred_decision_input.kind,
  });

  const canonicalRecommendation = readCanonicalFromResponse(responseData ?? {});
  const executiveSummary = readNestedRecord(responseData, "executive_summary_surface");
  const decisionSimulationRisk = readNestedRecord(responseData, "decision_simulation", "risk");

  return buildSimulationResult({
    projectId: input.projectId,
    input: simInput,
    objects: getObjects(responseData) as SceneObject[],
    relations:
      ((readNestedRecord(responseData, "scene_json", "scene")?.relations as unknown[]) ??
      (Array.isArray(responseData?.relations) ? responseData.relations : [])) as SimulationRelation[],
    riskSummary:
      text(readNestedRecord(responseData, "risk_propagation")?.summary) ||
      "Simulation estimated downstream exposure based on the current scene graph.",
    timelineSteps: [
      "Immediate pressure appears on the selected targets.",
      "Near-term propagation spreads through connected dependencies.",
      "Downstream effects remain visible if no mitigation is added.",
    ],
    recommendation:
      text(canonicalRecommendation?.primary?.action) ||
      text(executiveSummary?.what_to_do) ||
      "Stabilize the most exposed nodes first.",
    confidence:
      canonicalRecommendation?.confidence?.score ??
      input.reasoning.confidence?.score ??
      0.62,
    affectedDimensions:
      (decisionSimulationRisk?.affectedDimensions as string[] | undefined) ?? ["stability"],
  });
}

export function runDecisionPipeline(input: RunDecisionPipelineInput): DecisionPipelineState {
  const responseData: Record<string, unknown> = input.responseData ?? {};
  const projectId = String(input.projectId ?? responseData.project_id ?? "default_project");
  const prompt =
    text(input.prompt) ||
    text(readNestedRecord(responseData, "prompt_feedback")?.prompt) ||
    text(input.memoryEntries?.[0]?.prompt) ||
    "";
  const recommendation = readCanonicalFromResponse(responseData) ?? buildCanonicalRecommendation(responseData);
  const reasoningRaw = readNestedValue(responseData, "ai_reasoning");
  const reasoning =
    (reasoningRaw && typeof reasoningRaw === "object" ? (reasoningRaw as ReasoningOutput) : null) ??
    buildFallbackReasoning(input);
  const simulationRaw = readNestedValue(responseData, "decision_simulation");
  const simulation =
    (simulationRaw ? (simulationRaw as SimulationResult) : null) ??
    buildFallbackSimulation({
      prompt,
      reasoning,
      responseData,
      projectId,
    });
  const multiAgentRaw = readNestedValue(responseData, "multi_agent_decision");
  const multiAgent =
    (multiAgentRaw && typeof multiAgentRaw === "object" ? multiAgentRaw : null) ??
    (reasoning
      ? orchestrateMultiAgentDecision({
          context: {
            workspace_id: input.workspaceId ?? undefined,
            project_id: projectId,
            prompt,
            reasoning,
            simulation,
            matched_object_ids: reasoning.matched_concepts
              .filter((concept: MatchedConcept) => concept.kind === "object")
              .map((concept: MatchedConcept) => concept.id),
            memory: {
              volatile_nodes: (input.memoryEntries ?? []).flatMap((entry) => entry.target_ids ?? []).slice(0, 4),
              recurring_patterns: (input.memoryEntries ?? []).map((entry) => entry.recommendation_action ?? "").filter(Boolean).slice(0, 4),
            },
          },
        })
      : null);
  const memory =
    buildDecisionMemoryEntry({
      responseData: {
        ...responseData,
        canonical_recommendation: recommendation,
        decision_simulation: simulation ?? readNestedValue(responseData, "decision_simulation"),
      },
      prompt,
      workspaceId: input.workspaceId,
      projectId,
    }) ?? null;
  const observedOutcome = buildObservedOutcomeAssessment({
    canonicalRecommendation: recommendation,
    responseData,
    decisionResult: input.decisionResult ?? null,
    memoryEntries: input.memoryEntries ?? [],
  });
  const outcomeFeedback = buildDecisionOutcomeFeedback({
    canonicalRecommendation: recommendation,
    observedAssessment: observedOutcome,
    memoryEntry: input.memoryEntries?.[0] ?? memory,
    responseData,
  });
  const calibration = buildDecisionFeedbackSignal({
    canonicalRecommendation: recommendation,
    outcomeFeedback,
    priorAdjustedScore: input.memoryEntries?.[0]?.calibration_result?.adjusted_confidence_score ?? null,
  });
  const patternContext = buildDecisionPatternIntelligence({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: recommendation,
  });
  const metaDecision = buildMetaDecisionState({
    reasoning: asRecord(reasoningRaw),
    simulation: asRecord(simulationRaw),
    comparison:
      asRecord(readNestedValue(responseData, "decision_comparison")) ??
      asRecord(readNestedValue(responseData, "comparison")),
    canonicalRecommendation: recommendation,
    calibration,
    responseData,
    memoryEntries: input.memoryEntries ?? [],
  });
  const auditTrace = buildDecisionTimeline({
    responseData,
    canonicalRecommendation: recommendation,
    memoryEntries: input.memoryEntries ?? [],
    prompt,
  });
  const now = Date.now();
  const executionRaw = readNestedValue(responseData, "decision_result");

  return {
    decision_id: recommendation?.id ?? `decision_pipeline_${now}`,
    prompt: prompt || null,
    reasoning,
    simulation,
    recommendation,
    multi_agent: (multiAgent as MultiAgentResult | null) ?? null,
    execution: (input.decisionResult ?? (executionRaw && typeof executionRaw === "object" ? executionRaw : null)) as
      | DecisionExecutionResult
      | null,
    memory,
    observed_outcome: observedOutcome,
    outcome_feedback: outcomeFeedback,
    calibration,
    meta_decision: metaDecision,
    pattern_context: patternContext,
    audit_trace: auditTrace,
    memory_entry_id: memory?.id,
    created_at: recommendation?.created_at ?? now,
    updated_at: now,
  };
}
