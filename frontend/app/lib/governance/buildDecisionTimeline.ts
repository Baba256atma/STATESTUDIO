import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import { buildDecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import { buildDecisionConfidenceCalibration } from "../decision/confidence/calibration/buildDecisionConfidenceCalibration";
import { buildDecisionOutcomeAssessment } from "../decision/confidence/calibration/buildDecisionOutcomeAssessment";
import { buildObservedOutcomeAssessment } from "../decision/outcome/buildObservedOutcomeAssessment";
import { buildDecisionOutcomeFeedback } from "../decision/outcome/buildDecisionOutcomeFeedback";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import { selectDefaultCognitiveStyle } from "../cognitive/selectDefaultCognitiveStyle";
import { buildTeamDecisionState } from "../team/buildTeamDecisionState";
import { buildOrgMemoryState } from "../org-memory/buildOrgMemoryState";
import { buildCollaborationState } from "../collaboration/buildCollaborationState";
import { loadCollaborationEnvelope } from "../collaboration/collaborationStore";
import { buildStrategicCommandState } from "../command/buildStrategicCommandState";
import { buildAutonomousDecisionCouncilState } from "../council/buildAutonomousDecisionCouncilState";
import { buildDecisionExecutionIntent } from "../execution/buildDecisionExecutionIntent";
import { buildDecisionPolicyState } from "../policy/buildDecisionPolicyState";
import { buildDecisionGovernanceState } from "./buildDecisionGovernanceState";
import { buildApprovalWorkflowState } from "../approval/buildApprovalWorkflowState";
import { loadApprovalWorkflowEnvelope } from "../approval/approvalWorkflowStore";
import type { AuditEvent, TrustProvenance } from "./governanceTrustAuditContract";
import type { DecisionTimelineEvent } from "./decisionTimelineModel";

type BuildDecisionTimelineParams = {
  responseData?: Record<string, unknown> | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  memoryEntries?: DecisionMemoryEntry[];
  prompt?: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function cleanArray(values: unknown[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

function toTimestamp(value: unknown, fallback = Date.now()) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Date.parse(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapSource(kind: string | null | undefined): DecisionTimelineEvent["source"] {
  if (kind === "simulation_output") return "simulation_engine";
  if (kind === "multi_agent_output") return "multi_agent";
  if (kind === "prompt_interpretation") return "ai_reasoning";
  return "recommendation_engine";
}

function findProvenanceByKind(entries: TrustProvenance[], kind: TrustProvenance["kind"]) {
  return entries.find((entry) => entry.kind === kind) ?? null;
}

function addIfMissing(
  list: DecisionTimelineEvent[],
  event: DecisionTimelineEvent | null,
  byType = true
) {
  if (!event) return;
  if (byType && list.some((item) => item.type === event.type)) return;
  if (!byType && list.some((item) => item.id === event.id)) return;
  list.push(event);
}

export function buildDecisionTimeline(params: BuildDecisionTimelineParams): DecisionTimelineEvent[] {
  const responseData = params.responseData ?? null;
  const canonicalRecommendation =
    params.canonicalRecommendation ?? responseData?.canonical_recommendation ?? null;
  const canonicalTimelineEvents = Array.isArray(responseData?.timeline_impact?.events)
    ? responseData.timeline_impact.events
    : [];
  const auditEvents = Array.isArray(responseData?.audit_events) ? (responseData.audit_events as AuditEvent[]) : [];
  const provenance = Array.isArray(responseData?.trust_provenance) ? (responseData.trust_provenance as TrustProvenance[]) : [];
  const provenanceById = new Map(provenance.map((entry) => [entry.id, entry]));
  const latestMemory = params.memoryEntries?.[0] ?? null;
  const prompt =
    text(params.prompt) ||
    text(latestMemory?.prompt) ||
    text(responseData?.prompt_feedback?.prompt) ||
    "";

  const events: DecisionTimelineEvent[] = [];

  auditEvents.forEach((auditEvent) => {
    const prov = auditEvent.provenance_ref_id ? provenanceById.get(auditEvent.provenance_ref_id) ?? null : null;
    const base = {
      id: auditEvent.id,
      timestamp: toTimestamp(auditEvent.timestamp),
      confidence: prov?.confidence,
      provenance_ref_id: prov?.id,
      uncertainty: cleanArray(prov?.uncertainty_notes ?? [], 3),
    };

    switch (auditEvent.event_type) {
      case "prompt_submitted":
        addIfMissing(events, {
          ...base,
          type: "prompt",
          title: "Prompt submitted",
          summary: prompt || "A strategic decision question was submitted for review.",
          source: "user",
          why: cleanArray(auditEvent.explanation_notes ?? [], 3),
          signals: cleanArray([auditEvent.affected_entity, auditEvent.actor_hint], 3),
        });
        break;
      case "reasoning_generated":
        addIfMissing(events, {
          ...base,
          type: "reasoning",
          title: "AI reasoning generated",
          summary:
            text(responseData?.analysis_summary) ||
            text(responseData?.executive_summary_surface?.why_it_matters) ||
            "AI traced how pressure spreads through the current system.",
          source: "ai_reasoning",
          why: cleanArray(
            [
              ...(responseData?.ai_reasoning?.ambiguity_notes ?? []),
              ...(auditEvent.explanation_notes ?? []),
            ],
            4
          ),
          signals: cleanArray(
            [
              ...(responseData?.ai_reasoning?.matched_concepts ?? []),
              responseData?.ai_reasoning?.intent,
              responseData?.ai_reasoning?.path,
            ],
            4
          ),
        });
        break;
      case "simulation_run":
        addIfMissing(events, {
          ...base,
          type: "simulation",
          title: "Simulation run",
          summary:
            text(responseData?.decision_simulation?.impact?.summary) ||
            text(responseData?.decision_simulation?.summary) ||
            "Simulation estimated how the decision changes downstream pressure.",
          source: "simulation_engine",
          why: cleanArray(auditEvent.explanation_notes ?? [], 3),
          signals: cleanArray(
            [
              ...(responseData?.decision_simulation?.risk?.affectedDimensions ?? []),
              ...(responseData?.decision_simulation?.impact?.directlyAffectedObjectIds ?? []),
            ],
            4
          ),
        });
        break;
      case "scenario_compared":
        addIfMissing(events, {
          ...base,
          type: "comparison",
          title: "Comparison reviewed",
          summary:
            text(responseData?.decision_comparison?.summary) ||
            text(responseData?.comparison?.summary) ||
            "Alternative paths were compared to clarify the trade-offs.",
          source: "simulation_engine",
          why: cleanArray(auditEvent.explanation_notes ?? [], 3),
          signals: cleanArray(
            [
              ...(responseData?.decision_comparison?.tradeoffs ?? []),
              ...(responseData?.comparison?.notes ?? []),
            ],
            4
          ),
        });
        break;
      case "recommendation_generated":
        addIfMissing(events, {
          ...base,
          type: "recommendation",
          title: "Recommendation created",
          summary:
            text(canonicalRecommendation?.primary?.action) ||
            text(responseData?.executive_summary_surface?.what_to_do) ||
            "A recommendation was selected from the available system signals.",
          source: "recommendation_engine",
          why: cleanArray(
            [
              canonicalRecommendation?.reasoning?.why,
              ...(canonicalRecommendation?.reasoning?.key_drivers ?? []),
              ...(auditEvent.explanation_notes ?? []),
            ],
            4
          ),
          signals: cleanArray(
            [
              canonicalRecommendation?.primary?.impact_summary,
              canonicalRecommendation?.reasoning?.risk_summary,
            ],
            4
          ),
        });
        break;
      case "memory_updated":
        addIfMissing(events, {
          ...base,
          type: "memory_saved",
          title: "Scenario saved",
          summary:
            text(latestMemory?.title) ||
            text(latestMemory?.recommendation_summary) ||
            "This decision snapshot was saved for later review.",
          source: "recommendation_engine",
          why: cleanArray(auditEvent.explanation_notes ?? [], 3),
          signals: cleanArray(
            [
              latestMemory?.impact_summary,
              latestMemory?.compare_summary,
            ],
            3
          ),
        });
        break;
      case "action_applied":
        addIfMissing(events, {
          ...base,
          type: "action",
          title: "Action applied",
          summary:
            text(auditEvent.after_hint) ||
            text(auditEvent.before_hint) ||
            text(auditEvent.explanation_notes?.[0]) ||
            "An action was applied in safe mode.",
          source: "recommendation_engine",
          why: cleanArray(auditEvent.explanation_notes ?? [], 3),
          signals: cleanArray([auditEvent.affected_entity, auditEvent.actor_hint], 3),
        });
        break;
      default:
        break;
    }
  });

  canonicalTimelineEvents.forEach((timelineEvent: unknown, index: number) => {
    const record = asRecord(timelineEvent);
    addIfMissing(
      events,
      {
        id: text(record?.id) || `timeline_signal_${index + 1}`,
        timestamp: Date.now() + index,
        type: "reasoning",
        title: text(record?.label) || "Timeline event",
        summary: text(record?.summary) || text(responseData?.timeline_impact?.summary) || "Risk progression update captured.",
        source: "recommendation_engine",
        confidence: typeof record?.confidence === "number" ? record.confidence : undefined,
        signals: cleanArray(
          [
            record?.type,
            ...(Array.isArray(record?.related_object_ids) ? record.related_object_ids : []),
          ],
          4
        ),
      },
      false
    );
  });

  addIfMissing(
    events,
    prompt
      ? {
          id: "timeline_prompt",
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "prompt",
          title: "Prompt submitted",
          summary: prompt,
          source: "user",
        }
      : null
  );

  const reasoningProv = findProvenanceByKind(provenance, "prompt_interpretation");
  addIfMissing(
    events,
    responseData?.ai_reasoning
      ? {
          id: reasoningProv?.id ?? "timeline_reasoning",
          timestamp: toTimestamp(reasoningProv?.timestamp),
          type: "reasoning",
          title: "AI reasoning generated",
          summary:
            text(responseData?.analysis_summary) ||
            "AI traced how pressure spreads through the current system.",
          source: "ai_reasoning",
          confidence: reasoningProv?.confidence ?? responseData?.ai_reasoning?.confidence,
          why: cleanArray(responseData?.ai_reasoning?.ambiguity_notes ?? [], 4),
          signals: cleanArray(
            [
              ...(responseData?.ai_reasoning?.matched_concepts ?? []),
              responseData?.ai_reasoning?.path,
              responseData?.ai_reasoning?.intent,
            ],
            4
          ),
          uncertainty: cleanArray(reasoningProv?.uncertainty_notes ?? [], 3),
          provenance_ref_id: reasoningProv?.id,
        }
      : null
  );

  const multiAgentProv = findProvenanceByKind(provenance, "multi_agent_output");
  addIfMissing(
    events,
    responseData?.multi_agent_decision || responseData?.prompt_feedback?.multi_agent
      ? {
          id: multiAgentProv?.id ?? "timeline_multi_agent",
          timestamp: toTimestamp(multiAgentProv?.timestamp),
          type: "multi_agent",
          title: "Multi-agent review completed",
          summary:
            text(responseData?.multi_agent_decision?.consensus?.summary) ||
            text(responseData?.prompt_feedback?.multi_agent?.consensus?.summary) ||
            "Multiple strategic perspectives were merged into one decision view.",
          source: "multi_agent",
          confidence:
            multiAgentProv?.confidence ??
            responseData?.multi_agent_decision?.consensus?.merged_confidence ??
            responseData?.prompt_feedback?.multi_agent?.consensus?.merged_confidence,
          why: cleanArray(
            [
              ...(responseData?.multi_agent_decision?.conflicts ?? []),
              ...(responseData?.prompt_feedback?.multi_agent?.conflicts ?? []),
            ],
            4
          ),
          signals: cleanArray(
            [
              ...(responseData?.multi_agent_decision?.plan?.selected_agents ?? []),
              ...(responseData?.prompt_feedback?.multi_agent?.plan?.selected_agents ?? []),
            ],
            4
          ),
          uncertainty: cleanArray(multiAgentProv?.uncertainty_notes ?? [], 3),
          provenance_ref_id: multiAgentProv?.id,
        }
      : null
  );

  const simulationProv = findProvenanceByKind(provenance, "simulation_output");
  addIfMissing(
    events,
    responseData?.decision_simulation
      ? {
          id: simulationProv?.id ?? "timeline_simulation",
          timestamp: toTimestamp(simulationProv?.timestamp),
          type: "simulation",
          title: "Simulation run",
          summary:
            text(responseData?.decision_simulation?.impact?.summary) ||
            text(responseData?.decision_simulation?.summary) ||
            "Simulation estimated how the decision changes downstream pressure.",
          source: "simulation_engine",
          confidence: simulationProv?.confidence ?? responseData?.decision_simulation?.confidence,
          related_ids: cleanArray(
            [
              ...(responseData?.decision_simulation?.impact?.directlyAffectedObjectIds ?? []),
              ...(responseData?.decision_simulation?.impact?.downstreamObjectIds ?? []),
            ],
            6
          ),
          signals: cleanArray(
            [
              ...(responseData?.decision_simulation?.risk?.affectedDimensions ?? []),
              responseData?.decision_simulation?.scenario?.name,
            ],
            4
          ),
          uncertainty: cleanArray(simulationProv?.uncertainty_notes ?? [], 3),
          provenance_ref_id: simulationProv?.id,
        }
      : null
  );

  addIfMissing(
    events,
    responseData?.decision_comparison || responseData?.comparison
      ? {
          id: "timeline_comparison",
          timestamp: toTimestamp(responseData?.decision_comparison?.timestamp),
          type: "comparison",
          title: "Comparison reviewed",
          summary:
            text(responseData?.decision_comparison?.summary) ||
            text(responseData?.comparison?.summary) ||
            "Alternative futures were compared to expose the main trade-offs.",
          source: "simulation_engine",
          signals: cleanArray(
            [
              ...(responseData?.decision_comparison?.tradeoffs ?? []),
              ...(responseData?.comparison?.notes ?? []),
            ],
            4
          ),
        }
      : null
  );

  const recommendationProv = findProvenanceByKind(provenance, "recommendation_output");
  addIfMissing(
    events,
    canonicalRecommendation
      ? {
          id: recommendationProv?.id ?? canonicalRecommendation.id,
          timestamp: canonicalRecommendation.created_at ?? Date.now(),
          type: "recommendation",
          title: "Recommendation created",
          summary:
            text(canonicalRecommendation.primary.action) ||
            "A recommendation was selected from the available signals.",
          source: mapSource(recommendationProv?.kind),
          confidence: recommendationProv?.confidence ?? canonicalRecommendation.confidence?.score,
          related_ids: cleanArray(canonicalRecommendation.primary.target_ids ?? [], 6),
          why: cleanArray(
            [
              canonicalRecommendation.reasoning?.why,
              ...(canonicalRecommendation.reasoning?.key_drivers ?? []),
            ],
            4
          ),
          signals: cleanArray(
            [
              canonicalRecommendation.primary?.impact_summary,
              canonicalRecommendation.reasoning?.risk_summary,
            ],
            4
          ),
          uncertainty: cleanArray(recommendationProv?.uncertainty_notes ?? [], 3),
          provenance_ref_id: recommendationProv?.id,
        }
      : null
  );

  addIfMissing(
    events,
    latestMemory
      ? {
          id: `memory_${latestMemory.id}`,
          timestamp: latestMemory.created_at,
          type: "memory_saved",
          title: "Scenario saved",
          summary:
            text(latestMemory.recommendation_summary) ||
            text(latestMemory.impact_summary) ||
            latestMemory.title,
          source: "recommendation_engine",
          confidence: latestMemory.recommendation_confidence?.score ?? undefined,
          related_ids: latestMemory.target_ids ?? [],
          signals: cleanArray(
            [
              latestMemory.compare_summary,
              latestMemory.snapshot_ref?.scenario_id,
            ],
            3
          ),
        }
      : null
  );

  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation,
    responseData,
    decisionResult: responseData?.decision_result ?? null,
  });
  const outcomeAssessment = buildDecisionOutcomeAssessment({
    canonicalRecommendation,
    responseData,
    decisionResult: responseData?.decision_result ?? null,
    memoryEntries: params.memoryEntries ?? [],
  });
  const outcomeFeedback = buildDecisionOutcomeFeedback({
    canonicalRecommendation,
    observedAssessment: buildObservedOutcomeAssessment({
      canonicalRecommendation,
      responseData,
      decisionResult: responseData?.decision_result ?? null,
      memoryEntries: params.memoryEntries ?? [],
    }),
    memoryEntry: latestMemory,
    responseData,
  });
  const metaDecision = buildMetaDecisionState({
    reasoning: responseData?.ai_reasoning ?? null,
    simulation: responseData?.decision_simulation ?? null,
    comparison: responseData?.decision_comparison ?? responseData?.comparison ?? null,
    canonicalRecommendation,
    calibration: null,
    responseData,
    memoryEntries: params.memoryEntries ?? [],
  });
  const cognitiveStyle = selectDefaultCognitiveStyle({
    activeMode: responseData?.active_mode ?? responseData?.platform_assembly?.activeMode?.mode_id ?? null,
    rightPanelView: responseData?.right_panel_view ?? null,
    responseData,
    canonicalRecommendation,
  });
  const teamDecision = buildTeamDecisionState({
    responseData,
    canonicalRecommendation,
    decisionResult: responseData?.decision_result ?? null,
    memoryEntries: params.memoryEntries ?? [],
  });
  const orgMemory = buildOrgMemoryState({
    memoryEntries: params.memoryEntries ?? [],
    canonicalRecommendation,
  });
  const decisionExecutionIntent = buildDecisionExecutionIntent({
    source: "recommendation",
    canonicalRecommendation,
    responseData,
    decisionResult: responseData?.decision_result ?? null,
  });
  const policyState = buildDecisionPolicyState({
    canonicalRecommendation,
    decisionExecutionIntent,
    decisionResult: responseData?.decision_result ?? null,
    responseData,
    memoryEntries: params.memoryEntries ?? [],
  });
  const governance = buildDecisionGovernanceState({
    canonicalRecommendation,
    decisionExecutionIntent,
    decisionResult: responseData?.decision_result ?? null,
    responseData,
    memoryEntries: params.memoryEntries ?? [],
    orgMemoryState: orgMemory,
    teamDecisionState: teamDecision,
    metaDecisionState: metaDecision,
    policyState,
  });
  const approvalEnvelope = loadApprovalWorkflowEnvelope(
    responseData?.workspace_id ?? null,
    responseData?.project_id ?? null,
    governance.decision_id ?? canonicalRecommendation?.id ?? null
  );
  const approvalWorkflow = buildApprovalWorkflowState({
    canonicalRecommendation,
    decisionExecutionIntent,
    decisionGovernance: governance,
    decisionResult: responseData?.decision_result ?? null,
    responseData,
    memoryEntries: params.memoryEntries ?? [],
    existingWorkflow: approvalEnvelope?.workflow ?? null,
    policyState,
  });
  const collaborationEnvelope = loadCollaborationEnvelope(
    responseData?.workspace_id ?? null,
    responseData?.project_id ?? null,
    governance.decision_id ?? canonicalRecommendation?.id ?? null
  );
  const collaborationState = buildCollaborationState({
    canonicalRecommendation,
    decisionExecutionIntent,
    responseData,
    decisionResult: responseData?.decision_result ?? null,
    memoryEntries: params.memoryEntries ?? [],
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
    teamDecisionState: teamDecision,
    governanceState: governance,
    approvalWorkflowState: approvalWorkflow,
  });
  const decisionCouncil = buildAutonomousDecisionCouncilState({
    responseData,
    canonicalRecommendation,
    decisionResult: responseData?.decision_result ?? null,
    memoryEntries: params.memoryEntries ?? [],
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
  });
  const strategicCommand = buildStrategicCommandState({
    responseData,
    canonicalRecommendation,
    decisionResult: responseData?.decision_result ?? null,
    memoryEntries: params.memoryEntries ?? [],
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
    metaDecision,
    teamDecision,
    collaborationState,
    orgMemory,
    policyState,
    governanceState: governance,
    approvalWorkflow,
    decisionCouncil,
  });
  const calibration = buildDecisionConfidenceCalibration({
    canonicalRecommendation,
    confidenceModel,
    outcomeAssessment,
    memoryEntries: params.memoryEntries ?? [],
  });

  addIfMissing(
    events,
    metaDecision
      ? {
          id: `strategy_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "decision_strategy_selected",
          title: "Decision strategy selected",
          summary: metaDecision.rationale,
          source: "recommendation_engine",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          why: metaDecision.constraints.slice(0, 2),
          signals: [
            `Strategy: ${metaDecision.selected_strategy.replace(/_/g, " ")}`,
            `Evidence: ${metaDecision.evidence_strength}`,
            `Uncertainty: ${metaDecision.uncertainty_level}`,
          ],
        }
      : null
  );

  addIfMissing(
    events,
    cognitiveStyle
      ? {
          id: `cognitive_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "cognitive_style_selected",
          title: "Decision lens selected",
          summary: cognitiveStyle.reason,
          source: "recommendation_engine",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          signals: [`Style: ${cognitiveStyle.style}`],
        }
      : null
  );

  addIfMissing(
    events,
    teamDecision?.shared_recommendation
      ? {
          id: `team_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "team_decision_review_generated",
          title: "Team decision review generated",
          summary: `${teamDecision.alignment.alignment_level.replace(/^\w/, (value) => value.toUpperCase())} alignment around ${teamDecision.shared_recommendation}.`,
          source: "recommendation_engine",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          why: [teamDecision.alignment.agreement_points[0], teamDecision.alignment.disagreement_points[0]].filter(Boolean),
          signals: [
            teamDecision.team_next_move,
            teamDecision.escalation_needed ? "Escalation likely" : "Escalation not required",
          ],
        }
      : null
  );

  addIfMissing(
    events,
    collaborationState.inputs[0]
      ? {
          id: collaborationState.inputs[0].id,
          timestamp: collaborationState.inputs[0].timestamp,
          type: "collaboration_input_added",
          title: "Collaboration input added",
          summary: `${collaborationState.inputs[0].user_label} added a ${collaborationState.inputs[0].kind.replace(/_/g, " ")} note.`,
          source: "recommendation_engine",
          signals: [collaborationState.inputs[0].summary],
        }
      : null
  );

  addIfMissing(
    events,
    collaborationState.contributors.length
      ? {
          id: `collaboration_alignment_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "collaboration_alignment_updated",
          title: "Collaboration alignment updated",
          summary: `Collaboration alignment is ${collaborationState.alignment.alignment_level}.`,
          source: "recommendation_engine",
          why: collaborationState.alignment.agreement_points.slice(0, 2),
          signals: collaborationState.alignment.disagreement_points.slice(0, 2),
        }
      : null
  );

  addIfMissing(
    events,
    collaborationState.decision_delta.changed
      ? {
          id: `collaboration_delta_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "collaboration_decision_delta_detected",
          title: "Collaboration changed the decision posture",
          summary: collaborationState.decision_delta.summary,
          source: "recommendation_engine",
          signals: [collaborationState.decision_delta.after_summary ?? collaborationState.next_steps[0] ?? ""].filter(Boolean),
        }
      : null
  );

  addIfMissing(
    events,
    strategicCommand.headline
      ? {
          id: `strategic_command_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "strategic_command_state_generated",
          title: "Strategic command updated",
          summary: strategicCommand.explanation,
          source: "recommendation_engine",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          why: [strategicCommand.priority_reason, strategicCommand.next_move_reason].filter(Boolean),
          signals: [
            `Priority: ${strategicCommand.priority.replace(/_/g, " ")}`,
            strategicCommand.next_move,
            strategicCommand.alerts[0]?.title ?? "",
          ].filter(Boolean).slice(0, 3),
        }
      : null
  );

  addIfMissing(
    events,
    decisionCouncil.role_perspectives.length
      ? {
          id: `council_review_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "autonomous_council_review_generated",
          title: "Decision council review generated",
          summary: decisionCouncil.explanation,
          source: "multi_agent",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          why: decisionCouncil.debate.agreement_points.slice(0, 2),
          signals: decisionCouncil.debate.conflict_points.slice(0, 2),
        }
      : null
  );

  addIfMissing(
    events,
    decisionCouncil.consensus.final_recommendation
      ? {
          id: `council_consensus_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "council_consensus_updated",
          title: "Council consensus updated",
          summary: decisionCouncil.consensus.final_recommendation,
          source: "multi_agent",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          why: decisionCouncil.consensus.strongest_support.slice(0, 2),
          signals: decisionCouncil.consensus.main_reservations.slice(0, 2),
        }
      : null
  );

  addIfMissing(
    events,
    orgMemory.coverage_count > 1
      ? {
          id: `org_memory_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "org_memory_considered",
          title: "Organization memory considered",
          summary:
            orgMemory.current_decision_note ??
            orgMemory.org_guidance ??
            orgMemory.explanation,
          source: "recommendation_engine",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          signals: [
            `Coverage: ${orgMemory.coverage_count}`,
            ...(orgMemory.relevant_signals.slice(0, 2).map((signal) => signal.label)),
          ].slice(0, 3),
        }
      : null
  );

  addIfMissing(
    events,
    policyState?.posture
      ? {
          id: `policy_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "decision_policy_evaluated",
          title: "Decision policy evaluated",
          summary: policyState.explanation,
          source: "recommendation_engine",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          why: policyState.policy_drivers.slice(0, 2),
          signals: [
            `Posture: ${policyState.posture.replace(/_/g, " ")}`,
            ...(policyState.constraints.slice(0, 2)),
          ].slice(0, 3),
        }
      : null
  );

  addIfMissing(
    events,
    governance?.mode
      ? {
          id: `governance_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "decision_governance_evaluated",
          title: "Decision governance evaluated",
          summary: governance.explanation,
          source: "recommendation_engine",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          signals: [
            `Mode: ${governance.mode.replace(/_/g, " ")}`,
            governance.approval.required ? `Approval: ${governance.approval.approver_role ?? "required"}` : "Approval: not required",
            governance.escalation_required ? "Escalation required" : "Escalation not required",
          ],
        }
      : null
  );

  addIfMissing(
    events,
    approvalWorkflow.required
      ? {
          id: `approval_required_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "approval_required",
          title: "Approval required",
          summary: approvalWorkflow.explanation,
          source: "recommendation_engine",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          signals: [
            approvalWorkflow.requested_reviewer_role
              ? `Reviewer: ${approvalWorkflow.requested_reviewer_role}`
              : "Reviewer required",
            ...(approvalWorkflow.blocked_until_approval_actions.slice(0, 2).map((action) => `Blocked: ${action}`)),
          ].slice(0, 3),
        }
      : null
  );

  approvalWorkflow.decisions.forEach((decision) => {
    addIfMissing(
      events,
      {
        id: decision.id,
        timestamp: decision.timestamp,
        type:
          decision.decision === "approved"
            ? "approval_approved"
            : decision.decision === "rejected"
              ? "approval_rejected"
              : "approval_escalated",
        title:
          decision.decision === "approved"
            ? "Decision approved"
            : decision.decision === "rejected"
              ? "Decision rejected"
              : "Decision escalated",
        summary:
          decision.note ??
          `${decision.actor_role.replace(/^\w/, (value) => value.toUpperCase())} marked this decision as ${decision.decision}.`,
        source: "user",
        signals: [`Role: ${decision.actor_role}`],
      },
      false
    );
  });

  addIfMissing(
    events,
    calibration.calibration_label !== "insufficient_outcome_data"
      ? {
          id: `calibration_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "confidence_calibrated",
          title: "Confidence calibrated",
          summary: calibration.explanation,
          source: "recommendation_engine",
          confidence: calibration.calibrated_confidence_score ?? undefined,
          why: [outcomeAssessment.summary],
          signals: [
            ...outcomeAssessment.matched_signals.slice(0, 2),
            ...outcomeAssessment.mismatched_signals.slice(0, 2),
          ].slice(0, 4),
        }
      : null
  );

  addIfMissing(
    events,
    outcomeFeedback.outcome_status !== "insufficient_observation"
      ? {
          id: `outcome_feedback_${canonicalRecommendation?.id ?? "current"}`,
          timestamp: latestMemory?.created_at ?? Date.now(),
          type: "outcome_feedback_captured",
          title: "Outcome feedback captured",
          summary: outcomeFeedback.feedback_summary,
          source: "recommendation_engine",
          confidence: canonicalRecommendation?.confidence?.score ?? undefined,
          why: outcomeFeedback.guidance ? [outcomeFeedback.guidance] : undefined,
          signals: [
            ...outcomeFeedback.matched_signals.slice(0, 2),
            ...outcomeFeedback.diverged_signals.slice(0, 2),
          ].slice(0, 4),
        }
      : null
  );

  return events
    .filter((event) => event.summary || event.title)
    .sort((a, b) => a.timestamp - b.timestamp);
}
