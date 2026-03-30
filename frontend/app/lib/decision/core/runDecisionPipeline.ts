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
import type { DecisionPipelineState } from "./decisionPipelineTypes";

type RunDecisionPipelineInput = {
  prompt?: string | null;
  responseData?: any | null;
  sceneContext?: any | null;
  workspaceId?: string | null;
  projectId?: string | null;
  memoryEntries?: DecisionMemoryEntry[];
  decisionResult?: DecisionExecutionResult | null;
};

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function getObjects(payload: any): any[] {
  return Array.isArray(payload?.scene_json?.scene?.objects)
    ? payload.scene_json.scene.objects
    : Array.isArray(payload?.scene?.objects)
      ? payload.scene.objects
      : Array.isArray(payload?.objects)
        ? payload.objects
        : [];
}

function buildFallbackReasoning(input: RunDecisionPipelineInput): ReasoningOutput | null {
  const prompt = text(input.prompt) || text(input.responseData?.prompt_feedback?.prompt) || "";
  const projectId = String(input.projectId ?? input.responseData?.project_id ?? "default_project");
  if (!prompt) return input.responseData?.ai_reasoning ?? null;

  return buildReasoningOutput(
    createReasoningInput({
      prompt,
      context: {
        workspace_id: input.workspaceId ?? undefined,
        project_id: projectId,
        project_domain: input.responseData?.project_domain ?? undefined,
        selected_object_id: null,
        active_mode: null,
        memory_signals: {
          volatile_nodes: (input.memoryEntries ?? []).flatMap((entry) => entry.target_ids ?? []).slice(0, 3),
          recurring_patterns: (input.memoryEntries ?? []).map((entry) => entry.recommendation_action ?? "").filter(Boolean).slice(0, 3),
        },
      },
      semanticObjects: getObjects(input.sceneContext ?? input.responseData),
      simulationContext: {
        baseline_available: Boolean(input.responseData?.decision_comparison ?? input.responseData?.comparison),
        active_scenario_id: input.responseData?.decision_simulation?.scenario?.id ?? undefined,
      },
      strategyContext: {
        at_risk_kpis: input.responseData?.strategy_kpi?.impact_summary?.at_risk_kpis ?? [],
        threatened_objectives: input.responseData?.strategy_kpi?.impact_summary?.threatened_objectives ?? [],
      },
    })
  );
}

function buildFallbackSimulation(input: {
  prompt: string;
  reasoning: ReasoningOutput | null;
  responseData: any;
  projectId: string;
}): SimulationResult | null {
  if (input.responseData?.decision_simulation) return input.responseData.decision_simulation;
  if (!input.reasoning?.inferred_decision_input) return null;

  const simInput = createSimulationInputFromPrompt({
    text: input.prompt || "Recommended decision",
    matchedObjectIds: input.reasoning.inferred_decision_input.target_object_ids,
    topics: input.reasoning.inferred_decision_input.topics,
    kind: input.reasoning.inferred_decision_input.kind,
  });

  return buildSimulationResult({
    projectId: input.projectId,
    input: simInput,
    objects: getObjects(input.responseData),
    relations: input.responseData?.scene_json?.scene?.relations ?? input.responseData?.relations ?? [],
    riskSummary:
      text(input.responseData?.risk_propagation?.summary) ||
      "Simulation estimated downstream exposure based on the current scene graph.",
    timelineSteps: [
      "Immediate pressure appears on the selected targets.",
      "Near-term propagation spreads through connected dependencies.",
      "Downstream effects remain visible if no mitigation is added.",
    ],
    recommendation:
      text(input.responseData?.canonical_recommendation?.primary?.action) ||
      text(input.responseData?.executive_summary_surface?.what_to_do) ||
      "Stabilize the most exposed nodes first.",
    confidence:
      input.responseData?.canonical_recommendation?.confidence?.score ??
      input.reasoning.confidence?.score ??
      0.62,
    affectedDimensions: input.responseData?.decision_simulation?.risk?.affectedDimensions ?? ["stability"],
  });
}

export function runDecisionPipeline(input: RunDecisionPipelineInput): DecisionPipelineState {
  const responseData = input.responseData ?? {};
  const projectId = String(input.projectId ?? responseData?.project_id ?? "default_project");
  const prompt =
    text(input.prompt) ||
    text(responseData?.prompt_feedback?.prompt) ||
    text(input.memoryEntries?.[0]?.prompt) ||
    "";
  const recommendation =
    responseData?.canonical_recommendation ??
    buildCanonicalRecommendation(responseData);
  const reasoning = responseData?.ai_reasoning ?? buildFallbackReasoning(input);
  const simulation =
    responseData?.decision_simulation ??
    buildFallbackSimulation({
      prompt,
      reasoning,
      responseData,
      projectId,
    });
  const multiAgent =
    responseData?.multi_agent_decision ??
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
        decision_simulation: simulation ?? responseData?.decision_simulation,
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
    reasoning,
    simulation,
    comparison: responseData?.decision_comparison ?? responseData?.comparison ?? null,
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

  return {
    decision_id: recommendation?.id ?? `decision_pipeline_${now}`,
    prompt: prompt || null,
    reasoning,
    simulation,
    recommendation,
    multi_agent: multiAgent,
    execution: input.decisionResult ?? responseData?.decision_result ?? null,
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
