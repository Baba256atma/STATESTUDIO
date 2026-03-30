/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Source: ../../../../backend/openapi.json

export type Action = {
  "color"?: string | null;
  "intensity"?: number | null;
  "target_id": string;
  "value"?: string | null;
  "verb": string;
};
export type AIControlPlaneState = {
  "enabled"?: boolean;
  "last_error"?: string | null;
  "reload_succeeded"?: boolean;
  "snapshot": AIPolicySnapshot;
};
export type AIPolicySnapshot = {
  "audit": AuditPolicyConfig;
  "benchmark": BenchmarkPolicyConfig;
  "enabled"?: boolean;
  "evaluation": EvaluationPolicyConfig;
  "model": ModelPolicyConfig;
  "privacy": PrivacyPolicyConfig;
  "provider": ProviderPolicyConfig;
  "routing": RoutingPolicyConfig;
  "telemetry": TelemetryPolicyConfig;
  "version_info": PolicyVersionInfo;
};
export type AIResponse = {
  "latency_ms"?: number | null;
  "metadata"?: Record<string, unknown>;
  "model"?: string;
  "object_candidates"?: Array<ObjectCandidate>;
  "ok"?: boolean;
  "output"?: string;
  "provider"?: string;
  "raw_model"?: string | null;
  "risk_signals"?: Array<RiskSignal>;
  "summary"?: string | null;
  "trace_id"?: string | null;
};
export type AnalyzeBridgeIn = {
  "human_state": HumanArchetypeState;
};
export type AnalyzeFullIn = {
  "episode_id"?: string | null;
  "metrics"?: {
  [key: string]: number;
} | null;
  "text": string;
};
export type AnalyzeFullResponse = {
  "episode_id"?: string | null;
  "error"?: Record<string, unknown> | null;
  "human_state"?: unknown;
  "ok"?: boolean | null;
  "signals"?: unknown;
  "system_signals"?: {
  [key: string]: number;
};
  "system_state"?: unknown;
  "visual"?: unknown;
  "warnings"?: Array<string>;
};
export type AnalyzeHumanIn = {
  "text": string;
};
export type AnalyzeSystemIn = {
  "history"?: Array<SystemArchetypeState> | null;
  "system_signals": {
  [key: string]: number;
};
};
export type app__routers__simulator_router__MonteCarloCfg = {
  "n"?: number;
  "sigma"?: number;
};
export type app__routers__timeline_router__MonteCarloCfg = {
  "every_step"?: boolean;
  "n"?: number;
  "sigma"?: number;
};
export type ArchetypeAnalyzeIn = {
  "history"?: Array<ArchetypeState> | null;
  "metrics": {
  [key: string]: number;
};
  "signals": Array<string>;
};
export type ArchetypeDetectionResult = {
  "archetype_id": string;
  "confidence": number;
  "dominant_loop": "R" | "B";
  "notes": string;
};
export type ArchetypeState = {
  "detected": Array<ArchetypeDetectionResult>;
  "instability": number;
  "system_pressure": number;
  "timestamp": number;
};
export type AuditEvent = {
  "benchmark_used"?: boolean;
  "correlation_id"?: string | null;
  "decision_reason"?: string | null;
  "error_code"?: string | null;
  "fallback_used"?: boolean;
  "metadata"?: Record<string, unknown>;
  "policy_tags"?: Array<string>;
  "privacy_mode"?: string | null;
  "selected_model"?: string | null;
  "selected_provider"?: string | null;
  "sensitivity_level"?: string | null;
  "stage": "request_received" | "privacy_classified" | "routing_decided" | "provider_selected" | "model_selected" | "provider_execution_started" | "provider_execution_completed" | "provider_execution_failed" | "fallback_applied" | "response_returned" | "policy_change_submitted" | "policy_change_validated" | "policy_change_approval_required" | "policy_change_approved" | "policy_change_rejected" | "policy_change_activated" | "policy_change_activation_failed" | "policy_promoted" | "promotion_failed" | "promotion_blocked" | "promotion_gate_failed" | "policy_rolled_back" | "canary_started" | "canary_assigned" | "canary_paused" | "canary_resumed" | "canary_rolled_back" | "canary_promoted" | "canary_health_degraded" | "experiment_created" | "experiment_started" | "experiment_assigned" | "experiment_paused" | "experiment_completed" | "experiment_stopped" | "experiment_winner_selected" | "optimization_run_started" | "optimization_proposal_created" | "optimization_proposal_approved" | "optimization_proposal_rejected" | "optimization_proposal_applied";
  "success"?: boolean | null;
  "task_type"?: string | null;
  "timestamp": string;
  "trace_id": string;
};
export type AuditEventListResponse = {
  "events"?: Array<AuditEvent>;
  "ok"?: boolean;
};
export type AuditPolicyConfig = {
  "enabled"?: boolean;
  "file_path": string;
  "include_policy_tags"?: boolean;
  "include_provider_metadata"?: boolean;
  "keep_in_memory"?: boolean;
  "log_to_file"?: boolean;
  "max_events"?: number;
  "redact_sensitive_fields"?: boolean;
};
export type AuditPolicyDecisionsResponse = {
  "events"?: Array<PolicyDecisionRecord>;
  "ok"?: boolean;
};
export type AuditPolicyResponse = {
  "enabled"?: boolean;
  "file_path"?: string | null;
  "include_policy_tags"?: boolean;
  "include_provider_metadata"?: boolean;
  "keep_in_memory"?: boolean;
  "log_to_file"?: boolean;
  "max_events"?: number;
  "redact_sensitive_fields"?: boolean;
};
export type BenchmarkPolicyConfig = {
  "enabled"?: boolean;
  "min_success_rate"?: number;
  "results_path": string;
  "weights"?: {
  [key: string]: number;
};
};
export type BranchEpisodeIn = {
  "include_history"?: boolean;
  "title"?: string | null;
};
export type BridgeConfig = {
  "rules": Array<BridgeRule>;
  "updated_at": string;
  "version": string;
};
export type BridgeRule = {
  "human_archetype_id": string;
  "system_signals": {
  [key: string]: number;
};
};
export type CanaryDecisionResult = {
  "decision_reason": string;
  "health_status": "healthy" | "degraded" | "insufficient_data";
  "promotion_ready"?: boolean;
  "recommended_action": "continue" | "pause" | "rollback" | "promote";
  "rollback_required"?: boolean;
};
export type CanaryHealthSummary = {
  "audit_completeness_rate"?: number;
  "average_latency_delta_ms"?: number;
  "average_latency_ms_canary"?: number;
  "average_latency_ms_stable"?: number;
  "canary_policy_version"?: string | null;
  "canary_request_count"?: number;
  "decision_reason": string;
  "fallback_rate"?: number;
  "health_status"?: "healthy" | "degraded" | "insufficient_data";
  "promotion_ready"?: boolean;
  "response_validity_rate"?: number;
  "rollback_required"?: boolean;
  "routing_failure_rate"?: number;
  "stable_policy_version": string;
  "stable_request_count"?: number;
};
export type CanaryLifecycleAction = {
  "actor_id": string;
  "reason"?: string | null;
};
export type CanaryReleaseState = {
  "assignment_scope"?: "global" | "tenant" | "workspace";
  "canary_enabled"?: boolean;
  "canary_policy_version": string;
  "canary_snapshot": AIPolicySnapshot;
  "decision"?: CanaryDecisionResult | null;
  "decision_reason"?: string | null;
  "health_summary"?: CanaryHealthSummary | null;
  "source_environment"?: EnvironmentType;
  "stable_policy_version": string;
  "stable_snapshot": AIPolicySnapshot;
  "started_at"?: string | null;
  "status"?: "draft" | "active" | "paused" | "rolled_back" | "promoted";
  "target_environment"?: EnvironmentType;
  "tenant_id"?: string | null;
  "traffic_percentage"?: number;
  "updated_at"?: string | null;
  "updated_by"?: string | null;
  "workspace_id"?: string | null;
};
export type CanaryTrafficRule = {
  "assignment_scope"?: "global" | "tenant" | "workspace";
  "tenant_id"?: string | null;
  "traffic_percentage"?: number;
  "workspace_id"?: string | null;
};
export type ChatActionOut = {
  "color"?: string | null;
  "intensity"?: number | null;
  "object"?: string | null;
  "position"?: Array<number> | null;
  "scale"?: number | null;
  "targetId"?: string | null;
  "target_id"?: string | null;
  "type"?: string | null;
  "value"?: Record<string, unknown> | null;
  "verb"?: string | null;
  "visible"?: boolean | null;
  [key: string]: unknown;
};
export type ChatErrorOut = {
  "message"?: string | null;
  "type"?: string | null;
};
export type ChatIn = {
  "allowed_objects"?: Array<string> | null;
  "history"?: Array<string> | null;
  "message"?: string | null;
  "mode"?: string | null;
  "text"?: string | null;
  "user_id"?: string | null;
};
export type ChatRequest = {
  "allowed_objects"?: Array<string> | null;
  "mode"?: string | null;
  "text": string;
  "user_id"?: string | null;
};
export type ChatResponse = {
  "actions"?: Array<Action>;
  "debug"?: Record<string, unknown> | null;
  "reply": string;
};
export type ChatResponseOut = {
  "actions"?: Array<ChatActionOut>;
  "active_mode"?: string | null;
  "analysis_summary"?: string | null;
  "context"?: Record<string, unknown> | null;
  "debug"?: Record<string, unknown> | null;
  "error"?: ChatErrorOut | null;
  "ok"?: boolean;
  "reply"?: string;
  "scene_json"?: Record<string, unknown> | null;
  "session_id"?: string | null;
  "source"?: string | null;
  "user_id"?: string | null;
  [key: string]: unknown;
};
export type CompareInput = {
  "focusDimension"?: "risk" | "efficiency" | "stability" | "growth" | "balanced";
  "scenarioA": CompareScenarioInput;
  "scenarioB": CompareScenarioInput;
};
export type CompareScenarioInput = {
  "intelligence": SystemIntelligenceResult;
  "scenario"?: Record<string, unknown>;
};
export type ComparisonMemoryRecord = {
  "confidence"?: number | null;
  "recommendation"?: string | null;
  "record_id": string;
  "scenario_a_id"?: string | null;
  "scenario_b_id"?: string | null;
  "timestamp": number;
  "user_choice"?: "A" | "B" | "hybrid" | "none" | "unknown";
  "winner"?: "A" | "B" | "tie" | "unknown";
};
export type CouncilAgentInput = {
  "allowed_objects"?: Array<string>;
  "compare_result"?: Record<string, unknown> | null;
  "decision_path"?: Record<string, unknown> | null;
  "focused_object_id"?: string | null;
  "fragility"?: Record<string, unknown> | null;
  "learning_summary"?: Record<string, unknown> | null;
  "memory_summary"?: Record<string, unknown> | null;
  "mode"?: string;
  "propagation"?: Record<string, unknown> | null;
  "scene_json"?: Record<string, unknown> | null;
  "strategy_result"?: Record<string, unknown> | null;
  "text"?: string;
};
export type CouncilAgentOpinion = {
  "concerns"?: Array<string>;
  "confidence": number;
  "headline": string;
  "priorities"?: Array<string>;
  "recommended_actions"?: Array<string>;
  "role": "ceo" | "cfo" | "coo";
  "summary": string;
};
export type CouncilDisagreement = {
  "ceo_position"?: string | null;
  "cfo_position"?: string | null;
  "coo_position"?: string | null;
  "dimension": string;
  "summary": string;
  "tension_level": number;
};
export type CouncilMeta = {
  "mode"?: string;
  "source"?: string;
  "timestamp": number;
  "version"?: string;
};
export type CouncilSynthesis = {
  "confidence": number;
  "headline": string;
  "recommended_direction": string;
  "summary": string;
  "top_actions"?: Array<string>;
  "tradeoffs"?: Array<string>;
};
export type CreateEpisodeIn = {
  "title"?: string | null;
};
export type DecisionExecutionRequest = {
  "context"?: Array<Record<string, unknown>>;
  "scenario"?: Record<string, unknown> | null;
  "selected_objects"?: Array<string>;
};
export type DecisionExecutionResponse = {
  "comparison": Array<Record<string, unknown>>;
  "scene_actions": {
  [key: string]: Array<string>;
};
  "simulation_result": Record<string, unknown>;
};
export type DecisionPayload = {
  "company_id": string;
  "snapshot": Record<string, unknown>;
};
export type DemoSeedIn = {
  "demo_id": "growth" | "fixes" | "escalation";
};
export type EffectivePolicyResolution = {
  "base_policy_version": string;
  "conflicts"?: Array<OverlayConflictRecord>;
  "effective_policy": AIPolicySnapshot;
  "effective_policy_version": string;
  "merge_trace"?: Array<OverlayMergeTrace>;
  "resolution_timestamp": string;
  "sources"?: Array<string>;
  "tenant_id"?: string | null;
  "tenant_overlay_version"?: string | null;
  "workspace_id"?: string | null;
  "workspace_overlay_version"?: string | null;
};
export type EnvironmentType = "local" | "dev" | "staging" | "production";
export type EvaluationPolicyConfig = {
  "include_audit_checks"?: boolean;
  "optimization_auto_apply_enabled"?: boolean;
  "regression_enabled"?: boolean;
  "use_mock_providers"?: boolean;
};
export type EventPayload = {
  "company_id": string;
  "event": Record<string, unknown>;
};
export type ExperimentDecisionResult = {
  "decision_reason": string;
  "experiment_id": string;
  "promotion_ready"?: boolean;
  "status": "draft" | "active" | "paused" | "completed" | "stopped";
  "stop_required"?: boolean;
  "winning_variant"?: string | null;
};
export type ExperimentLifecycleAction = {
  "actor_id": string;
  "reason"?: string | null;
};
export type ExperimentListResponse = {
  "experiments"?: Array<ExperimentRunState>;
};
export type ExperimentMetricsSummary = {
  "compared_at": string;
  "control_variant": VariantMetricsSummary;
  "enough_data"?: boolean;
  "experiment_id": string;
  "experiment_name": string;
  "status": "draft" | "active" | "paused" | "completed" | "stopped";
  "summary": string;
  "variant_summaries"?: Array<VariantMetricsSummary>;
  "winning_variant"?: string | null;
};
export type ExperimentResultsResponse = {
  "decision"?: ExperimentDecisionResult | null;
  "experiment": ExperimentRunState;
  "metrics_summary"?: ExperimentMetricsSummary | null;
};
export type ExperimentRunState = {
  "assignment_scope"?: "global" | "tenant" | "workspace";
  "control_policy_version": string;
  "created_at": string;
  "decision"?: ExperimentDecisionResult | null;
  "decision_reason"?: string | null;
  "description"?: string | null;
  "ended_at"?: string | null;
  "experiment_id": string;
  "experiment_name": string;
  "metrics_summary"?: ExperimentMetricsSummary | null;
  "started_at"?: string | null;
  "status"?: "draft" | "active" | "paused" | "completed" | "stopped";
  "tenant_id"?: string | null;
  "traffic_split"?: {
  [key: string]: number;
};
  "updated_at": string;
  "updated_by"?: string | null;
  "variants"?: Array<PolicyVariant>;
  "winning_variant"?: string | null;
  "workspace_id"?: string | null;
};
export type FragilityDriver = {
  "dimension"?: string | null;
  "evidence_text"?: string | null;
  "id": string;
  "label": string;
  "score"?: number;
  "severity": string;
};
export type FragilityFinding = {
  "explanation": string;
  "id": string;
  "recommendation": string;
  "severity": string;
  "title": string;
};
export type FragilityScanRequest = {
  "allowed_objects"?: Array<string> | null;
  "metadata"?: Record<string, unknown>;
  "mode"?: string;
  "source_name"?: string | null;
  "source_type"?: string | null;
  "source_url"?: string | null;
  "text"?: string | null;
  "user_id"?: string | null;
  "workspace_id"?: string | null;
};
export type FragilityScanResponse = {
  "debug"?: Record<string, unknown> | null;
  "drivers"?: Array<FragilityDriver>;
  "findings"?: Array<FragilityFinding>;
  "fragility_level": string;
  "fragility_score": number;
  "ok": boolean;
  "scene_payload"?: Record<string, unknown>;
  "suggested_actions"?: Array<string>;
  "suggested_objects"?: Array<string>;
  "summary": string;
};
export type HealthResponse = {
  "available"?: boolean;
  "base_url"?: string | null;
  "default_model"?: string | null;
  "latency_ms"?: number | null;
  "metadata"?: Record<string, unknown>;
  "ok"?: boolean;
  "provider"?: string;
  "trace_id"?: string | null;
};
export type HTTPValidationError = {
  "detail"?: Array<ValidationError>;
};
export type HumanArchetypeDefinition = {
  "description": string;
  "editable"?: boolean;
  "id": string;
  "name": string;
  "outputs": HumanArchetypeOutputs;
  "signals": HumanArchetypeSignals;
  "tags": Array<string>;
  "weights": HumanArchetypeWeights;
};
export type HumanArchetypeOutputs = {
  "default_intensity": number;
};
export type HumanArchetypeResult = {
  "archetype_id": string;
  "confidence": number;
  "evidence": Array<string>;
  "intensity": number;
};
export type HumanArchetypeSignals = {
  "keywords": Array<string>;
  "phrases": Array<string>;
  "sentiment_hint"?: "neg" | "pos" | "mixed" | "neutral" | null;
};
export type HumanArchetypeState = {
  "instability": number;
  "pressure": number;
  "results": Array<HumanArchetypeResult>;
  "timestamp": string;
};
export type HumanArchetypeWeights = {
  "intensity_scale": number;
  "keyword_weight": number;
  "phrase_weight": number;
};
export type HumanCatalog_Input = {
  "items": Array<HumanArchetypeDefinition>;
  "updated_at": string;
  "version": string;
};
export type HumanCatalog_Output = {
  "items": Array<HumanArchetypeDefinition>;
  "updated_at": string;
  "version": string;
};
export type LocalAIAnalyzeRequest = {
  "context"?: Record<string, unknown> | null;
  "history"?: Array<string> | null;
  "metadata"?: Record<string, unknown>;
  "model"?: string | null;
  "text": string;
  "trace_id"?: string | null;
};
export type LocalAIModelsResponse = {
  "metadata"?: Record<string, unknown>;
  "models"?: Array<ModelInfo>;
  "ok"?: boolean;
  "provider"?: string;
  "trace_id"?: string | null;
};
export type LoopTemplate = {
  "id": string;
  "notes"?: string | null;
  "type": "R" | "B";
  "variables": Array<string>;
};
export type MemorySaveRequest = {
  "comparison_record"?: ComparisonMemoryRecord | null;
  "scenario_record"?: ScenarioMemoryRecord | null;
  "strategy_records"?: Array<StrategyMemoryRecord>;
};
export type ModelExecutionMetric = {
  "avg_latency_ms"?: number;
  "model": string;
  "request_count"?: number;
};
export type ModelInfo = {
  "available"?: boolean;
  "context_window"?: number | null;
  "family"?: string | null;
  "metadata"?: Record<string, unknown>;
  "name": string;
  "provider"?: string;
  "size"?: string | null;
};
export type ModelPolicyConfig = {
  "default_model": string;
  "extraction_model": string;
  "fast_model": string;
  "reasoning_model": string;
  "selection_enabled"?: boolean;
  "selection_strategy"?: string;
};
export type ModelSelectionDebugRequest = {
  "context"?: Record<string, unknown> | null;
  "latency_sensitive"?: boolean;
  "metadata"?: Record<string, unknown>;
  "quality_policy"?: string;
  "requested_model"?: string | null;
  "task_type": string;
};
export type ModelSelectionDebugResponse = {
  "benchmark_used"?: boolean;
  "fallback_used"?: boolean;
  "metadata"?: Record<string, unknown>;
  "model_class": string;
  "selected_model": string;
  "selection_reason": string;
  "strategy"?: string;
};
export type MonteCarloRunIn = {
  "episode_id": string;
  "high_score_threshold"?: number;
  "kpi_keys"?: Array<string> | null;
  "n"?: number;
  "seed"?: number | null;
  "sigma"?: number;
};
export type NoteIn = {
  "author": string;
  "text": string;
};
export type ObjectCandidate = {
  "confidence"?: number;
  "label"?: string | null;
  "metadata"?: Record<string, unknown>;
  "object_id": string;
  "object_type"?: string | null;
  "score"?: number;
  "weight"?: number;
};
export type ObservedOutcome = {
  "note"?: string | null;
  "observed_impact"?: number | null;
  "observed_risk"?: number | null;
  "outcome_status"?: "unknown" | "positive" | "negative" | "mixed";
};
export type OptimizationAction = {
  "actor_id": string;
  "reason"?: string | null;
};
export type OptimizationApplicationResult = {
  "applied"?: boolean;
  "auto_applied"?: boolean;
  "decision_reason": string;
  "policy_change_id"?: string | null;
  "policy_change_status"?: string | null;
  "proposal_id": string;
  "resulting_policy_version"?: string | null;
};
export type OptimizationDecision = {
  "approval_required": boolean;
  "auto_apply_eligible": boolean;
  "decision_reason": string;
  "expected_benefit": string;
};
export type OptimizationProposalListResponse = {
  "proposals"?: Array<PolicyOptimizationProposal>;
};
export type OptimizationProposalSet = {
  "auto_applied_results"?: Array<OptimizationApplicationResult>;
  "completed_at": string;
  "decision_reason": string;
  "proposals"?: Array<PolicyOptimizationProposal>;
  "run_id": string;
  "source_signals"?: Array<PolicyOptimizationSignal>;
  "started_at": string;
};
export type OptimizationRiskAssessment = {
  "approval_required": boolean;
  "auto_apply_eligible": boolean;
  "decision_reason": string;
  "policy_change_risk_level": "low" | "medium" | "high" | "critical";
  "risk_level": "low" | "medium" | "high" | "forbidden";
};
export type OutcomeUpdateRequest = {
  "observed_outcome": ObservedOutcome;
  "record_id": string;
};
export type OverlayConflictRecord = {
  "attempted_value"?: unknown;
  "effective_value"?: unknown;
  "field_path": string;
  "reason": string;
  "scope_id": string;
  "scope_type": "global" | "tenant" | "workspace";
};
export type OverlayMergeTrace = {
  "blocked_fields"?: Array<string>;
  "overlay_reference": PolicyOverlayReference;
  "overridden_fields"?: Array<string>;
};
export type PipelineTrace = {
  "events"?: Array<TelemetryEvent>;
  "task_type"?: string | null;
  "total_latency_ms"?: number | null;
  "trace_id": string;
};
export type PipelineTraceListResponse = {
  "ok"?: boolean;
  "traces"?: Array<PipelineTrace>;
};
export type PolicyActivationResult = {
  "activated"?: boolean;
  "activated_at"?: string | null;
  "activated_by"?: string | null;
  "effective_policy_version"?: string | null;
  "message"?: string | null;
  "previous_active_change_id"?: string | null;
};
export type PolicyApprovalAction = {
  "actor_id": string;
  "reason"?: string | null;
};
export type PolicyApprovalDecision = {
  "actor_id"?: string | null;
  "approval_required"?: boolean;
  "decision_reason"?: string | null;
  "reason"?: string | null;
  "status"?: "not_required" | "pending" | "approved" | "rejected";
  "timestamp"?: string | null;
};
export type PolicyApprovalRecord = {
  "actor_id"?: string | null;
  "reason"?: string | null;
  "status"?: "not_required" | "pending" | "approved" | "rejected";
  "timestamp"?: string | null;
};
export type PolicyApprovalRequirement = {
  "approval_required": boolean;
  "reason": string;
  "required_roles"?: Array<string>;
  "risk_level": "low" | "medium" | "high" | "critical";
};
export type PolicyCanaryConfig = {
  "assignment_scope"?: "global" | "tenant" | "workspace";
  "canary_enabled"?: boolean;
  "canary_policy_version": string;
  "source_environment"?: EnvironmentType;
  "stable_policy_version": string;
  "target_environment"?: EnvironmentType;
  "tenant_id"?: string | null;
  "traffic_percentage"?: number;
  "traffic_rules"?: Array<CanaryTrafficRule>;
  "workspace_id"?: string | null;
};
export type PolicyChangeAuditRecord = {
  "activation_allowed"?: boolean;
  "approval_status": string;
  "approved_by"?: string | null;
  "base_policy_version"?: string | null;
  "change_id": string;
  "decision_reason"?: string | null;
  "proposed_policy_version": string;
  "scope_id": string;
  "scope_type": "global" | "tenant" | "workspace";
};
export type PolicyChangeDiagnostics = {
  "active_changes"?: {
  [key: string]: string;
};
  "counts_by_status"?: {
  [key: string]: number;
};
  "last_known_good_changes"?: {
  [key: string]: string;
};
  "last_reload_error"?: string | null;
  "last_reload_succeeded"?: boolean;
};
export type PolicyChangeListResponse = {
  "changes"?: Array<PolicyChangeRecord>;
};
export type PolicyChangePreview = {
  "approval": PolicyApprovalRequirement;
  "blocked_fields"?: Array<string>;
  "diff": PolicyDiffResult;
  "resulting_policy_version": string;
  "scope_id": string;
  "scope_type": "global" | "tenant" | "workspace";
  "tenant_id"?: string | null;
  "validation": PolicyValidationResult;
  "workspace_id"?: string | null;
};
export type PolicyChangeRecord = {
  "activation"?: PolicyActivationResult;
  "approval_record": PolicyApprovalRecord;
  "approval_requirement": PolicyApprovalRequirement;
  "change_id": string;
  "created_at": string;
  "description"?: string | null;
  "diff": PolicyDiffResult;
  "payload": PolicyOverlayPayload;
  "proposed_by": string;
  "resulting_policy_version": string;
  "sanitized_payload": PolicyOverlayPayload;
  "scope_id": string;
  "scope_type": "global" | "tenant" | "workspace";
  "source": string;
  "status": "pending" | "approved" | "rejected" | "activated" | "validation_failed" | "activation_failed";
  "tenant_id"?: string | null;
  "title": string;
  "updated_at": string;
  "validation": PolicyValidationResult;
  "workspace_id"?: string | null;
};
export type PolicyChangeRequest = {
  "description"?: string | null;
  "payload": PolicyOverlayPayload;
  "proposed_by"?: string;
  "scope_type": "global" | "tenant" | "workspace";
  "source"?: string;
  "tenant_id"?: string | null;
  "title": string;
  "workspace_id"?: string | null;
};
export type PolicyDecisionRecord = {
  "benchmark_used"?: boolean;
  "correlation_id"?: string | null;
  "decision_reason"?: string | null;
  "error_code"?: string | null;
  "fallback_used"?: boolean;
  "metadata"?: Record<string, unknown>;
  "policy_tags"?: Array<string>;
  "privacy_mode"?: string | null;
  "selected_model"?: string | null;
  "selected_provider"?: string | null;
  "sensitivity_level"?: string | null;
  "stage": "request_received" | "privacy_classified" | "routing_decided" | "provider_selected" | "model_selected" | "provider_execution_started" | "provider_execution_completed" | "provider_execution_failed" | "fallback_applied" | "response_returned" | "policy_change_submitted" | "policy_change_validated" | "policy_change_approval_required" | "policy_change_approved" | "policy_change_rejected" | "policy_change_activated" | "policy_change_activation_failed" | "policy_promoted" | "promotion_failed" | "promotion_blocked" | "promotion_gate_failed" | "policy_rolled_back" | "canary_started" | "canary_assigned" | "canary_paused" | "canary_resumed" | "canary_rolled_back" | "canary_promoted" | "canary_health_degraded" | "experiment_created" | "experiment_started" | "experiment_assigned" | "experiment_paused" | "experiment_completed" | "experiment_stopped" | "experiment_winner_selected" | "optimization_run_started" | "optimization_proposal_created" | "optimization_proposal_approved" | "optimization_proposal_rejected" | "optimization_proposal_applied";
  "success"?: boolean | null;
  "task_type"?: string | null;
  "timestamp": string;
  "trace_id": string;
};
export type PolicyDiffResult = {
  "changed_fields"?: Array<string>;
  "diffs"?: Array<PolicyFieldDiff>;
  "risk_level"?: "low" | "medium" | "high" | "critical";
  "summary": string;
};
export type PolicyEnvironmentListResponse = {
  "environments"?: Array<PolicyEnvironmentState>;
};
export type PolicyEnvironmentState = {
  "environment": EnvironmentType;
  "last_known_good_version"?: string | null;
  "policy_version": string;
  "snapshot": AIPolicySnapshot;
  "source_environment"?: EnvironmentType | null;
  "updated_at": string;
};
export type PolicyExperimentConfig = {
  "assignment_scope"?: "global" | "tenant" | "workspace";
  "control_policy_version": string;
  "description"?: string | null;
  "experiment_name": string;
  "tenant_id"?: string | null;
  "traffic_split"?: {
  [key: string]: number;
};
  "variants"?: Array<PolicyVariant>;
  "workspace_id"?: string | null;
};
export type PolicyFieldDiff = {
  "after_value"?: unknown;
  "before_value"?: unknown;
  "change_kind": "added" | "removed" | "changed";
  "field_path": string;
  "risk_level"?: "low" | "medium" | "high" | "critical";
  "summary": string;
};
export type PolicyOptimizationProposal = {
  "applied_by"?: string | null;
  "approved_by"?: string | null;
  "created_at": string;
  "created_by"?: string;
  "current_policy_version": string;
  "decision": OptimizationDecision;
  "expected_benefit": string;
  "linked_policy_change_id"?: string | null;
  "optimization_type": "tighten_fallback_rules" | "reduce_cloud_reasoning" | "promote_canary_winner" | "promote_experiment_winner" | "adjust_benchmark_weights";
  "proposal_id": string;
  "proposed_policy_patch": PolicyOverlayPayload;
  "rejected_by"?: string | null;
  "risk_assessment": OptimizationRiskAssessment;
  "source_signals"?: Array<PolicyOptimizationSignal>;
  "status"?: "proposed" | "approved" | "rejected" | "applied" | "expired";
  "target_scope"?: "global" | "tenant" | "workspace";
  "tenant_id"?: string | null;
  "updated_at": string;
  "workspace_id"?: string | null;
};
export type PolicyOptimizationSignal = {
  "current_value": number | string | boolean;
  "decision_reason": string;
  "metric_name": string;
  "signal_metadata"?: Record<string, unknown>;
  "signal_type": "high_fallback_rate" | "high_routing_failure_rate" | "canary_promotion_ready" | "experiment_winner" | "benchmark_weights_missing";
  "source_component": string;
  "threshold_value"?: number | string | boolean | null;
};
export type PolicyOverlayPayload = {
  "audit"?: Record<string, unknown>;
  "benchmark"?: Record<string, unknown>;
  "enabled"?: boolean | null;
  "evaluation"?: Record<string, unknown>;
  "model"?: Record<string, unknown>;
  "privacy"?: Record<string, unknown>;
  "provider"?: Record<string, unknown>;
  "routing"?: Record<string, unknown>;
  "telemetry"?: Record<string, unknown>;
};
export type PolicyOverlayReference = {
  "enabled"?: boolean;
  "inherited_from"?: string | null;
  "overlay_priority": number;
  "policy_version": string;
  "scope_id": string;
  "scope_type": "global" | "tenant" | "workspace";
  "source": string;
};
export type PolicyPromotionRequest = {
  "approved_by"?: string | null;
  "promotion_reason"?: string | null;
  "requested_by"?: string;
  "source_environment": EnvironmentType;
  "target_environment": EnvironmentType;
};
export type PolicyPromotionResult = {
  "activated"?: boolean;
  "activation_allowed"?: boolean;
  "approved_by"?: string | null;
  "gate_results"?: Array<PromotionGateResult>;
  "policy_version": string;
  "promotion_id": string;
  "promotion_reason"?: string | null;
  "promotion_status": "promoted" | "blocked" | "failed" | "rolled_back";
  "promotion_timestamp": string;
  "source_environment": EnvironmentType;
  "target_environment": EnvironmentType;
};
export type PolicyRollbackRequest = {
  "actor_id": string;
  "reason"?: string | null;
};
export type PolicyRollbackResult = {
  "actor_id": string;
  "environment": EnvironmentType;
  "policy_version"?: string | null;
  "previous_policy_version"?: string | null;
  "reason"?: string | null;
  "rollback_timestamp": string;
  "rolled_back": boolean;
};
export type PolicyValidationIssue = {
  "code": string;
  "field_path": string;
  "message": string;
  "severity": "warning" | "error";
};
export type PolicyValidationResult = {
  "conflicts"?: Array<OverlayConflictRecord>;
  "issues"?: Array<PolicyValidationIssue>;
  "logical_valid": boolean;
  "structural_valid": boolean;
  "valid": boolean;
};
export type PolicyVariant = {
  "policy_version": string;
  "source_environment"?: EnvironmentType;
  "variant_name": string;
};
export type PolicyVersionInfo = {
  "loaded_at": string;
  "policy_version": string;
  "source": "settings_defaults" | "file" | "fallback_defaults" | string;
  "updated_at"?: string | null;
};
export type PredictedSummary = {
  "expected_impact"?: number | null;
  "expected_risk"?: number | null;
  "headline": string;
};
export type PrivacyClassificationRequest = {
  "contains_uploaded_content"?: boolean;
  "context"?: Record<string, unknown>;
  "metadata"?: Record<string, unknown>;
  "task_type": string;
  "text"?: string | null;
  "workspace_privacy_mode"?: "default" | "local_preferred" | "local_only" | "cloud_allowed" | null;
};
export type PrivacyClassificationResult = {
  "classification_reason": string;
  "cloud_allowed"?: boolean;
  "contains_uploaded_content"?: boolean;
  "local_required"?: boolean;
  "policy_tags"?: Array<string>;
  "privacy_mode"?: "default" | "local_preferred" | "local_only" | "cloud_allowed";
  "sensitivity_level"?: "public" | "internal" | "confidential" | "restricted";
  "task_type": string;
};
export type PrivacyPolicyConfig = {
  "assume_uploaded_content_confidential"?: boolean;
  "cloud_blocked_sensitivity_levels"?: Array<string>;
  "default_privacy_mode"?: string;
  "enabled"?: boolean;
  "local_required_sensitivity_levels"?: Array<string>;
  "strict_mode"?: boolean;
};
export type PrivacyPolicyResponse = {
  "assume_uploaded_content_confidential"?: boolean;
  "cloud_blocked_sensitivity_levels"?: Array<"public" | "internal" | "confidential" | "restricted">;
  "default_privacy_mode"?: "default" | "local_preferred" | "local_only" | "cloud_allowed";
  "enabled"?: boolean;
  "local_required_sensitivity_levels"?: Array<"public" | "internal" | "confidential" | "restricted">;
  "strict_mode"?: boolean;
};
export type PromotionGateResult = {
  "gate_name": string;
  "metrics_summary"?: Record<string, unknown>;
  "passed": boolean;
  "reason": string;
};
export type PromotionHistoryRecord = {
  "approved_by"?: string | null;
  "gate_results"?: Array<PromotionGateResult>;
  "policy_version": string;
  "promotion_id": string;
  "promotion_reason"?: string | null;
  "promotion_status": "promoted" | "blocked" | "failed" | "rolled_back";
  "promotion_timestamp": string;
  "source_environment": EnvironmentType;
  "target_environment": EnvironmentType;
};
export type PromotionHistoryResponse = {
  "records"?: Array<PromotionHistoryRecord>;
};
export type PropagationGraphEdge = {
  "from_id": string;
  "to_id": string;
  "weight"?: number;
};
export type PropagationObjectGraph = {
  "edges"?: Array<PropagationGraphEdge>;
  "object_ids"?: Array<string>;
};
export type PropagationRequest = {
  "decay"?: number;
  "max_depth"?: number;
  "mode"?: string;
  "object_graph"?: PropagationObjectGraph | null;
  "relation_weight_default"?: number;
  "scene_json"?: Record<string, unknown> | null;
  "source_object_id": string;
};
export type ProviderExecutionMetric = {
  "avg_latency_ms"?: number;
  "provider": string;
  "request_count"?: number;
};
export type ProviderHealthEntry = {
  "available"?: boolean;
  "default_model"?: string | null;
  "error"?: string | null;
  "latency_ms"?: number | null;
  "metadata"?: Record<string, unknown>;
  "provider": string;
};
export type ProviderHealthListResponse = {
  "default_provider": string;
  "fallback_provider"?: string | null;
  "ok"?: boolean;
  "providers"?: Array<ProviderHealthEntry>;
};
export type ProviderInfo = {
  "base_url"?: string | null;
  "configured"?: boolean;
  "default_model"?: string | null;
  "enabled"?: boolean;
  "key": string;
  "kind": string;
  "metadata"?: Record<string, unknown>;
};
export type ProviderListResponse = {
  "default_provider": string;
  "fallback_provider"?: string | null;
  "ok"?: boolean;
  "providers"?: Array<ProviderInfo>;
};
export type ProviderPolicyConfig = {
  "cloud_provider_enabled"?: boolean;
  "default_provider"?: string;
  "fallback_provider"?: string | null;
  "local_provider_enabled"?: boolean;
  "providers"?: {
  [key: string]: ProviderPolicyEntry;
};
};
export type ProviderPolicyEntry = {
  "default_model"?: string | null;
  "enabled"?: boolean;
  "kind": "local" | "cloud";
};
export type ReplayEpisode = {
  "created_at": string;
  "duration": number;
  "episode_id": string;
  "frames": Array<ReplayFrame>;
  "title"?: string | null;
  "updated_at": string;
  "version": string;
};
export type ReplayFrame = {
  "human_state"?: Record<string, unknown> | null;
  "input_text"?: string | null;
  "meta": ReplayMeta;
  "system_signals": {
  [key: string]: number;
};
  "system_state"?: Record<string, unknown> | null;
  "t": number;
  "visual": Record<string, unknown>;
};
export type ReplayMeta = {
  "note"?: string | null;
  "tags"?: Array<string>;
};
export type RiskSignal = {
  "confidence"?: number;
  "key": string;
  "label"?: string | null;
  "metadata"?: Record<string, unknown>;
  "score"?: number;
  "weight"?: number;
};
export type RoutingDecision = {
  "cloud_allowed"?: boolean;
  "cloud_available"?: boolean;
  "fallback_allowed"?: boolean;
  "local_available"?: boolean;
  "local_preferred"?: boolean;
  "privacy_mode"?: string;
  "routing_reason": string;
  "selected_provider"?: string | null;
};
export type RoutingDecisionRequest = {
  "classification_reason"?: string | null;
  "cloud_allowed"?: boolean;
  "cloud_permitted"?: boolean;
  "latency_sensitive"?: boolean;
  "local_required"?: boolean;
  "metadata"?: Record<string, unknown>;
  "policy_tags"?: Array<string>;
  "privacy_mode"?: string;
  "privacy_sensitive"?: boolean;
  "provider_states"?: Array<RoutingProviderState>;
  "requested_provider"?: string | null;
  "sensitivity_level"?: string;
  "task_type": string;
};
export type RoutingPolicyConfig = {
  "cloud_allowed_tasks"?: Array<string>;
  "cloud_fallback_enabled"?: boolean;
  "cloud_for_reasoning_enabled"?: boolean;
  "default_mode"?: string;
  "enabled"?: boolean;
  "local_allowed_tasks"?: Array<string>;
  "local_first"?: boolean;
  "privacy_strict_local"?: boolean;
};
export type RoutingPolicyResponse = {
  "cloud_allowed_tasks"?: Array<string>;
  "cloud_fallback_enabled"?: boolean;
  "cloud_for_reasoning_enabled"?: boolean;
  "default_mode": string;
  "enabled"?: boolean;
  "local_allowed_tasks"?: Array<string>;
  "local_first"?: boolean;
  "privacy_strict_local"?: boolean;
};
export type RoutingProviderState = {
  "available"?: boolean;
  "configured"?: boolean;
  "enabled"?: boolean;
  "kind": "local" | "cloud";
  "provider": string;
};
export type SaveReportIn = {
  "episode_id": string;
  "label"?: string;
  "summary"?: Record<string, unknown>;
};
export type SaveScenarioIn = {
  "episode_id": string;
  "label"?: string;
  "scenario_inputs"?: Array<Record<string, unknown>>;
};
export type ScenarioActionIntent = {
  "action_id": string;
  "action_kind": "stress_increase" | "stress_reduce" | "strategy_apply" | "decision_path_request" | "propagation_request" | "compare_request";
  "created_at"?: number | null;
  "description"?: string | null;
  "label"?: string | null;
  "mode"?: "what_if" | "decision_path" | "compare" | "preview";
  "parameters"?: Record<string, unknown>;
  "priority"?: number | null;
  "requested_outputs"?: Array<string>;
  "source_object_id"?: string | null;
  "target_object_ids"?: Array<string>;
};
export type ScenarioActionRequest = {
  "current_context"?: Record<string, unknown> | null;
  "decay"?: number;
  "max_depth"?: number;
  "object_graph"?: PropagationObjectGraph | null;
  "scenario_action": ScenarioActionIntent;
  "scene_json"?: Record<string, unknown> | null;
};
export type ScenarioIn = {
  "delta"?: {
  [key: string]: number;
};
  "name": string;
};
export type ScenarioMemoryRecord = {
  "comparison_snapshot"?: Record<string, unknown> | null;
  "decision_path_snapshot"?: Record<string, unknown> | null;
  "generated_strategies"?: Array<Record<string, unknown>> | null;
  "intelligence_snapshot"?: Record<string, unknown> | null;
  "mode": "analysis" | "simulation" | "decision" | "compare" | "strategy_generation";
  "observed_outcome"?: ObservedOutcome | null;
  "predicted_summary"?: PredictedSummary | null;
  "propagation_snapshot"?: Record<string, unknown> | null;
  "record_id": string;
  "scenario_id"?: string | null;
  "scenario_title"?: string | null;
  "selected_decision"?: SelectedDecision | null;
  "selected_strategy_id"?: string | null;
  "source_action_ids"?: Array<string>;
  "source_object_ids"?: Array<string>;
  "tags"?: Array<string>;
  "timestamp": number;
};
export type ScenarioOverrideIn = {
  "absolute"?: {
  [key: string]: number;
};
  "branch"?: boolean;
  "branch_title"?: string | null;
  "delta"?: {
  [key: string]: number;
};
  "episode_id": string;
  "include_history"?: boolean;
};
export type SelectedDecision = {
  "decision_type": string;
  "note"?: string | null;
  "target_id"?: string | null;
};
export type SelectionHistoryEntry = {
  "fallback_used"?: boolean;
  "latency_bucket"?: string | null;
  "selected_model": string;
  "task_type": string;
  "timestamp": string;
};
export type SelectionStatsResponse = {
  "fallback_rate"?: number;
  "recent_history"?: Array<SelectionHistoryEntry>;
  "selections_by_latency_bucket"?: {
  [key: string]: number;
};
  "selections_by_model"?: {
  [key: string]: number;
};
  "selections_by_task"?: {
  [key: string]: number;
};
  "total_selections"?: number;
};
export type SimulatorRunIn = {
  "episode_id": string;
  "montecarlo"?: app__routers__simulator_router__MonteCarloCfg;
  "scenarios": Array<ScenarioIn>;
};
export type StageMetric = {
  "avg_latency_ms"?: number;
  "count"?: number;
  "stage": "request_received" | "canary_assigned" | "experiment_assigned" | "privacy_classified" | "routing_decided" | "provider_selected" | "model_selected" | "provider_execution_started" | "provider_execution_completed" | "provider_execution_failed" | "fallback_applied" | "response_returned";
  "success_rate"?: number;
};
export type StrategicCouncilResult = {
  "active"?: boolean;
  "disagreements"?: Array<CouncilDisagreement>;
  "meta": CouncilMeta;
  "opinions"?: Array<CouncilAgentOpinion>;
  "synthesis": CouncilSynthesis;
};
export type StrategicCouncilRunResponse = {
  "council": StrategicCouncilResult;
};
export type StrategyGenerationConstraints = {
  "maxStrategies"?: number;
  "preferredFocus"?: "risk" | "growth" | "efficiency" | "stability";
  "riskTolerance"?: number;
};
export type StrategyGenerationInput = {
  "constraints"?: StrategyGenerationConstraints;
  "currentScenario"?: Record<string, unknown> | null;
  "intelligence": SystemIntelligenceResult;
  "mode"?: "explore" | "optimize" | "stress_test";
  "object_graph"?: PropagationObjectGraph | null;
  "scene_json"?: Record<string, unknown> | null;
};
export type StrategyMemoryRecord = {
  "actions"?: Array<Record<string, unknown>>;
  "chosen"?: boolean;
  "outcome_status"?: "unknown" | "positive" | "negative" | "mixed";
  "predicted_score"?: number | null;
  "rationale": string;
  "record_id": string;
  "strategy_id": string;
  "timestamp": number;
  "title": string;
};
export type SystemArchetypeCatalog_Input = {
  "items": Array<SystemArchetypeDefinition>;
  "updated_at": string;
  "version": string;
};
export type SystemArchetypeCatalog_Output = {
  "items": Array<SystemArchetypeDefinition>;
  "updated_at": string;
  "version": string;
};
export type SystemArchetypeDefinition = {
  "description": string;
  "id": string;
  "loops_template": Array<LoopTemplate>;
  "name": string;
  "required_signals": Array<string>;
  "thresholds": SystemArchetypeThresholds;
  "weights": {
  [key: string]: number;
};
};
export type SystemArchetypeResult = {
  "archetype_id": string;
  "confidence": number;
  "dominant_loop": "R" | "B";
  "evidence": {
  [key: string]: number;
};
  "notes": string;
};
export type SystemArchetypeState = {
  "instability": number;
  "pressure": number;
  "results": Array<SystemArchetypeResult>;
  "timestamp": string;
};
export type SystemArchetypeThresholds = {
  "activation"?: {
  [key: string]: number;
};
  "min_confidence"?: number;
};
export type SystemConflict = {
  "actors"?: Array<string>;
  "name": string;
  "tradeoff"?: Array<string>;
};
export type SystemFeedbackLoop = {
  "name": string;
  "path"?: Array<string>;
  "type": string;
};
export type SystemFragilityPoint = {
  "description"?: string | null;
  "signal": string;
  "threshold": string;
};
export type SystemIntelligenceAdvice = {
  "advice_id": string;
  "body": string;
  "confidence": number;
  "kind": "focus" | "mitigate" | "protect" | "investigate" | "simulate_next";
  "target_object_id"?: string | null;
  "title": string;
};
export type SystemIntelligenceInput = {
  "current_focus_object_id"?: string | null;
  "decision_path"?: Record<string, unknown> | null;
  "mode"?: "analysis" | "simulation" | "decision";
  "propagation"?: Record<string, unknown> | null;
  "scanner_summary"?: Record<string, unknown> | null;
  "scenario_action"?: Record<string, unknown> | null;
  "scene_json"?: Record<string, unknown> | null;
};
export type SystemIntelligenceObjectInsight = {
  "fragility_score"?: number | null;
  "leverage_score": number;
  "object_id": string;
  "pressure_score": number;
  "rationale"?: string | null;
  "role": "source" | "impacted" | "leverage" | "bottleneck" | "protected" | "destination" | "context";
  "strategic_priority": number;
};
export type SystemIntelligencePathInsight = {
  "path_id": string;
  "path_role": "primary" | "secondary" | "tradeoff" | "feedback";
  "path_strength": number;
  "rationale"?: string | null;
  "significance_score": number;
  "source_object_id"?: string | null;
  "target_object_id"?: string | null;
};
export type SystemIntelligenceResult = {
  "active": boolean;
  "advice"?: Array<SystemIntelligenceAdvice>;
  "meta"?: Record<string, unknown>;
  "object_insights"?: Array<SystemIntelligenceObjectInsight>;
  "path_insights"?: Array<SystemIntelligencePathInsight>;
  "summary": SystemIntelligenceSummary;
};
export type SystemIntelligenceSummary = {
  "headline": string;
  "key_signal"?: string | null;
  "suggested_focus_object_id"?: string | null;
  "suggested_mode"?: "analysis" | "simulation" | "decision" | null;
  "summary": string;
};
export type SystemModel = {
  "conflicts"?: Array<SystemConflict>;
  "fragility_points"?: Array<SystemFragilityPoint>;
  "loops"?: Array<SystemFeedbackLoop>;
  "objects"?: Array<SystemModelObject>;
  "problem_summary": string;
  "relationships"?: Array<SystemModelRelationship>;
  "scenario_inputs"?: Array<SystemScenarioInput>;
  "signals"?: Array<SystemModelSignal>;
};
export type SystemModelObject = {
  "description": string;
  "id": string;
  "name": string;
  "type": string;
};
export type SystemModelRelationship = {
  "description"?: string | null;
  "from": string;
  "to": string;
  "type": string;
};
export type SystemModelRequest = {
  "context"?: Record<string, unknown> | null;
  "history"?: Array<string> | null;
  "metadata"?: Record<string, unknown>;
  "model"?: string | null;
  "text": string;
  "trace_id"?: string | null;
};
export type SystemModelResponse = {
  "latency_ms"?: number | null;
  "metadata"?: Record<string, unknown>;
  "ok"?: boolean;
  "system_model": SystemModel;
  "trace_id"?: string | null;
};
export type SystemModelSignal = {
  "description"?: string | null;
  "id": string;
  "name": string;
  "type": string;
};
export type SystemScenarioInput = {
  "baseline": string;
  "id": string;
  "name": string;
  "signal": string;
  "stress_case": string;
};
export type TelemetryEvent = {
  "benchmark_used"?: boolean;
  "error_code"?: string | null;
  "fallback_used"?: boolean;
  "latency_ms"?: number | null;
  "metadata"?: Record<string, unknown>;
  "model"?: string | null;
  "privacy_mode"?: string | null;
  "provider"?: string | null;
  "routing_reason"?: string | null;
  "sensitivity_level"?: string | null;
  "stage": "request_received" | "canary_assigned" | "experiment_assigned" | "privacy_classified" | "routing_decided" | "provider_selected" | "model_selected" | "provider_execution_started" | "provider_execution_completed" | "provider_execution_failed" | "fallback_applied" | "response_returned";
  "success"?: boolean | null;
  "task_type"?: string | null;
  "timestamp": string;
  "token_usage"?: {
  [key: string]: number;
} | null;
  "trace_id": string;
};
export type TelemetryEventListResponse = {
  "events"?: Array<TelemetryEvent>;
  "ok"?: boolean;
};
export type TelemetryMetricsResponse = {
  "average_stage_latency_ms"?: number;
  "fallback_rate"?: number;
  "model_usage"?: Array<ModelExecutionMetric>;
  "ok"?: boolean;
  "privacy_cloud_block_rate"?: number;
  "provider_usage"?: Array<ProviderExecutionMetric>;
  "response_valid_rate"?: number;
  "routing_policy_override_rate"?: number;
  "stages"?: Array<StageMetric>;
  "total_events"?: number;
  "total_traces"?: number;
};
export type TelemetryPolicyConfig = {
  "enabled"?: boolean;
  "file_path": string;
  "include_provider_metadata"?: boolean;
  "keep_in_memory"?: boolean;
  "log_to_file"?: boolean;
  "max_events"?: number;
  "redact_sensitive_fields"?: boolean;
};
export type TelemetryStageListResponse = {
  "ok"?: boolean;
  "stages"?: Array<StageMetric>;
};
export type TimelineCfg = {
  "model"?: string;
  "steps"?: number;
};
export type TimelineRunIn = {
  "episode_id": string;
  "montecarlo"?: app__routers__timeline_router__MonteCarloCfg;
  "scenarios": Array<ScenarioIn>;
  "timeline"?: TimelineCfg;
};
export type ValidationError = {
  "ctx"?: Record<string, unknown>;
  "input"?: unknown;
  "loc": Array<string | number>;
  "msg": string;
  "type": string;
};
export type VariantMetricsSummary = {
  "audit_completeness_rate"?: number;
  "average_latency_ms"?: number;
  "fallback_rate"?: number;
  "policy_version": string;
  "request_count"?: number;
  "response_validity_rate"?: number;
  "routing_error_rate"?: number;
  "variant_name": string;
};
export type ViewpointIn = {
  "author": string;
  "label": string;
  "summary": string;
};

export type ApiOperations = {
  "/ai/local/analyze": {
    post: {
      request: LocalAIAnalyzeRequest;
      response: AIResponse;
    };
  };
  "/ai/local/audit/events": {
    get: {
      request: unknown;
      response: AuditEventListResponse;
    };
  };
  "/ai/local/audit/policy": {
    get: {
      request: unknown;
      response: AuditPolicyResponse;
    };
  };
  "/ai/local/audit/policy-decisions": {
    get: {
      request: unknown;
      response: AuditPolicyDecisionsResponse;
    };
  };
  "/ai/local/audit/recent": {
    get: {
      request: unknown;
      response: AuditEventListResponse;
    };
  };
  "/ai/local/control-plane/effective-policy": {
    get: {
      request: unknown;
      response: EffectivePolicyResolution;
    };
  };
  "/ai/local/control-plane/effective-policy/{tenant_id}": {
    get: {
      request: unknown;
      response: EffectivePolicyResolution;
    };
  };
  "/ai/local/control-plane/effective-policy/{tenant_id}/{workspace_id}": {
    get: {
      request: unknown;
      response: EffectivePolicyResolution;
    };
  };
  "/ai/local/control-plane/overlay-trace/{tenant_id}/{workspace_id}": {
    get: {
      request: unknown;
      response: Array<OverlayMergeTrace>;
    };
  };
  "/ai/local/control-plane/policies": {
    get: {
      request: unknown;
      response: AIPolicySnapshot;
    };
  };
  "/ai/local/control-plane/policy-changes": {
    get: {
      request: unknown;
      response: PolicyChangeListResponse;
    };
    post: {
      request: PolicyChangeRequest;
      response: PolicyChangeRecord;
    };
  };
  "/ai/local/control-plane/policy-changes/{change_id}": {
    get: {
      request: unknown;
      response: PolicyChangeRecord;
    };
  };
  "/ai/local/control-plane/policy-changes/{change_id}/activate": {
    post: {
      request: PolicyApprovalAction;
      response: PolicyChangeRecord;
    };
  };
  "/ai/local/control-plane/policy-changes/{change_id}/approve": {
    post: {
      request: PolicyApprovalAction;
      response: PolicyChangeRecord;
    };
  };
  "/ai/local/control-plane/policy-changes/{change_id}/reject": {
    post: {
      request: PolicyApprovalAction;
      response: PolicyChangeRecord;
    };
  };
  "/ai/local/control-plane/policy-changes/diagnostics/reload": {
    post: {
      request: unknown;
      response: PolicyChangeDiagnostics;
    };
  };
  "/ai/local/control-plane/policy-changes/diagnostics/state": {
    get: {
      request: unknown;
      response: PolicyChangeDiagnostics;
    };
  };
  "/ai/local/control-plane/policy-changes/preview": {
    post: {
      request: PolicyChangeRequest;
      response: PolicyChangePreview;
    };
  };
  "/ai/local/control-plane/policy/approval/{change_id}": {
    get: {
      request: unknown;
      response: PolicyApprovalDecision;
    };
  };
  "/ai/local/control-plane/policy/approve": {
    post: {
      request: PolicyApprovalAction;
      response: PolicyChangeRecord;
    };
  };
  "/ai/local/control-plane/policy/audit/{change_id}": {
    get: {
      request: unknown;
      response: PolicyChangeAuditRecord;
    };
  };
  "/ai/local/control-plane/policy/canary/health": {
    get: {
      request: unknown;
      response: CanaryHealthSummary | null;
    };
  };
  "/ai/local/control-plane/policy/canary/pause": {
    post: {
      request: CanaryLifecycleAction;
      response: CanaryReleaseState;
    };
  };
  "/ai/local/control-plane/policy/canary/promote": {
    post: {
      request: CanaryLifecycleAction;
      response: CanaryReleaseState;
    };
  };
  "/ai/local/control-plane/policy/canary/resume": {
    post: {
      request: CanaryLifecycleAction;
      response: CanaryReleaseState;
    };
  };
  "/ai/local/control-plane/policy/canary/rollback": {
    post: {
      request: CanaryLifecycleAction;
      response: CanaryReleaseState;
    };
  };
  "/ai/local/control-plane/policy/canary/start": {
    post: {
      request: PolicyCanaryConfig;
      response: CanaryReleaseState;
    };
  };
  "/ai/local/control-plane/policy/canary/state": {
    get: {
      request: unknown;
      response: CanaryReleaseState | null;
    };
  };
  "/ai/local/control-plane/policy/diff": {
    post: {
      request: PolicyChangeRequest;
      response: PolicyDiffResult;
    };
  };
  "/ai/local/control-plane/policy/diff/{change_id}": {
    get: {
      request: unknown;
      response: PolicyDiffResult;
    };
  };
  "/ai/local/control-plane/policy/environment/{environment}": {
    get: {
      request: unknown;
      response: PolicyEnvironmentState;
    };
  };
  "/ai/local/control-plane/policy/environment/{environment}/rollback": {
    post: {
      request: PolicyRollbackRequest;
      response: PolicyRollbackResult;
    };
  };
  "/ai/local/control-plane/policy/environments": {
    get: {
      request: unknown;
      response: PolicyEnvironmentListResponse;
    };
  };
  "/ai/local/control-plane/policy/experiments": {
    get: {
      request: unknown;
      response: ExperimentListResponse;
    };
  };
  "/ai/local/control-plane/policy/experiments/{experiment_id}": {
    get: {
      request: unknown;
      response: ExperimentRunState;
    };
  };
  "/ai/local/control-plane/policy/experiments/{experiment_id}/results": {
    get: {
      request: unknown;
      response: ExperimentResultsResponse;
    };
  };
  "/ai/local/control-plane/policy/experiments/complete": {
    post: {
      request: ExperimentLifecycleAction;
      response: ExperimentRunState;
    };
  };
  "/ai/local/control-plane/policy/experiments/create": {
    post: {
      request: PolicyExperimentConfig;
      response: ExperimentRunState;
    };
  };
  "/ai/local/control-plane/policy/experiments/pause": {
    post: {
      request: ExperimentLifecycleAction;
      response: ExperimentRunState;
    };
  };
  "/ai/local/control-plane/policy/experiments/start": {
    post: {
      request: ExperimentLifecycleAction;
      response: ExperimentRunState;
    };
  };
  "/ai/local/control-plane/policy/experiments/stop": {
    post: {
      request: ExperimentLifecycleAction;
      response: ExperimentRunState;
    };
  };
  "/ai/local/control-plane/policy/history": {
    get: {
      request: unknown;
      response: PolicyChangeListResponse;
    };
  };
  "/ai/local/control-plane/policy/optimize/proposals": {
    get: {
      request: unknown;
      response: OptimizationProposalListResponse;
    };
  };
  "/ai/local/control-plane/policy/optimize/proposals/{proposal_id}": {
    get: {
      request: unknown;
      response: PolicyOptimizationProposal;
    };
  };
  "/ai/local/control-plane/policy/optimize/proposals/{proposal_id}/apply": {
    post: {
      request: OptimizationAction;
      response: OptimizationApplicationResult;
    };
  };
  "/ai/local/control-plane/policy/optimize/proposals/{proposal_id}/approve": {
    post: {
      request: OptimizationAction;
      response: PolicyOptimizationProposal;
    };
  };
  "/ai/local/control-plane/policy/optimize/proposals/{proposal_id}/reject": {
    post: {
      request: OptimizationAction;
      response: PolicyOptimizationProposal;
    };
  };
  "/ai/local/control-plane/policy/optimize/run": {
    post: {
      request: unknown;
      response: OptimizationProposalSet;
    };
  };
  "/ai/local/control-plane/policy/pending": {
    get: {
      request: unknown;
      response: PolicyChangeListResponse;
    };
  };
  "/ai/local/control-plane/policy/promote": {
    post: {
      request: PolicyPromotionRequest;
      response: PolicyPromotionResult;
    };
  };
  "/ai/local/control-plane/policy/promotion-history": {
    get: {
      request: unknown;
      response: PromotionHistoryResponse;
    };
  };
  "/ai/local/control-plane/policy/propose": {
    post: {
      request: PolicyChangeRequest;
      response: PolicyChangeRecord;
    };
  };
  "/ai/local/control-plane/policy/reject": {
    post: {
      request: PolicyApprovalAction;
      response: PolicyChangeRecord;
    };
  };
  "/ai/local/control-plane/policy/validate": {
    post: {
      request: PolicyChangeRequest;
      response: PolicyValidationResult;
    };
  };
  "/ai/local/control-plane/reload": {
    post: {
      request: unknown;
      response: AIControlPlaneState;
    };
  };
  "/ai/local/control-plane/reload-overlays": {
    post: {
      request: unknown;
      response: AIControlPlaneState;
    };
  };
  "/ai/local/control-plane/state": {
    get: {
      request: unknown;
      response: AIControlPlaneState;
    };
  };
  "/ai/local/control-plane/version": {
    get: {
      request: unknown;
      response: PolicyVersionInfo;
    };
  };
  "/ai/local/health": {
    get: {
      request: unknown;
      response: HealthResponse;
    };
  };
  "/ai/local/models": {
    get: {
      request: unknown;
      response: LocalAIModelsResponse;
    };
  };
  "/ai/local/privacy/classify": {
    post: {
      request: PrivacyClassificationRequest;
      response: PrivacyClassificationResult;
    };
  };
  "/ai/local/privacy/policy": {
    get: {
      request: unknown;
      response: PrivacyPolicyResponse;
    };
  };
  "/ai/local/providers": {
    get: {
      request: unknown;
      response: ProviderListResponse;
    };
  };
  "/ai/local/providers/health": {
    get: {
      request: unknown;
      response: ProviderHealthListResponse;
    };
  };
  "/ai/local/routing/decide": {
    post: {
      request: RoutingDecisionRequest;
      response: RoutingDecision;
    };
  };
  "/ai/local/routing/policy": {
    get: {
      request: unknown;
      response: RoutingPolicyResponse;
    };
  };
  "/ai/local/select-model": {
    post: {
      request: ModelSelectionDebugRequest;
      response: ModelSelectionDebugResponse;
    };
  };
  "/ai/local/selection-stats": {
    get: {
      request: unknown;
      response: SelectionStatsResponse;
    };
  };
  "/ai/local/system-model": {
    post: {
      request: SystemModelRequest;
      response: SystemModelResponse;
    };
  };
  "/ai/local/telemetry/events": {
    get: {
      request: unknown;
      response: TelemetryEventListResponse;
    };
  };
  "/ai/local/telemetry/metrics": {
    get: {
      request: unknown;
      response: TelemetryMetricsResponse;
    };
  };
  "/ai/local/telemetry/stages": {
    get: {
      request: unknown;
      response: TelemetryStageListResponse;
    };
  };
  "/ai/local/telemetry/traces": {
    get: {
      request: unknown;
      response: PipelineTraceListResponse;
    };
  };
  "/analyze/bridge": {
    post: {
      request: AnalyzeBridgeIn;
      response: Record<string, unknown>;
    };
  };
  "/analyze/full": {
    post: {
      request: AnalyzeFullIn;
      response: AnalyzeFullResponse;
    };
  };
  "/analyze/human": {
    post: {
      request: AnalyzeHumanIn;
      response: Record<string, unknown>;
    };
  };
  "/analyze/system": {
    post: {
      request: AnalyzeSystemIn;
      response: Record<string, unknown>;
    };
  };
  "/api/decisions": {
    get: {
      request: unknown;
      response: unknown;
    };
    post: {
      request: DecisionPayload;
      response: unknown;
    };
  };
  "/api/events": {
    get: {
      request: unknown;
      response: unknown;
    };
    post: {
      request: EventPayload;
      response: unknown;
    };
  };
  "/bridge/config": {
    get: {
      request: unknown;
      response: BridgeConfig;
    };
    put: {
      request: BridgeConfig;
      response: BridgeConfig;
    };
  };
  "/bridge/config/{version}": {
    get: {
      request: unknown;
      response: BridgeConfig;
    };
  };
  "/bridge/config/history": {
    get: {
      request: unknown;
      response: Record<string, unknown>;
    };
  };
  "/chat": {
    post: {
      request: ChatIn;
      response: ChatResponseOut;
    };
  };
  "/chat/ai": {
    post: {
      request: ChatRequest;
      response: ChatResponse;
    };
  };
  "/collaboration/{episode_id}": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/collaboration/{episode_id}/note": {
    post: {
      request: NoteIn;
      response: unknown;
    };
  };
  "/collaboration/{episode_id}/viewpoint": {
    post: {
      request: ViewpointIn;
      response: unknown;
    };
  };
  "/config/{company_id}": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/debug/business-loops": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/debug/contracts": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/debug/state-fields": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/debug/system-state-schema": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/decision/compare": {
    post: {
      request: DecisionExecutionRequest;
      response: DecisionExecutionResponse;
    };
  };
  "/decision/simulate": {
    post: {
      request: DecisionExecutionRequest;
      response: DecisionExecutionResponse;
    };
  };
  "/events/recent": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/events/replay": {
    post: {
      request: unknown;
      response: unknown;
    };
  };
  "/health": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/human/catalog": {
    get: {
      request: unknown;
      response: HumanCatalog_Output;
    };
    put: {
      request: HumanCatalog_Input;
      response: HumanCatalog_Output;
    };
  };
  "/human/catalog/{version}": {
    get: {
      request: unknown;
      response: HumanCatalog_Output;
    };
  };
  "/human/catalog/history": {
    get: {
      request: unknown;
      response: Record<string, unknown>;
    };
  };
  "/memory/summary": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/montecarlo/run": {
    post: {
      request: MonteCarloRunIn;
      response: Record<string, unknown>;
    };
  };
  "/objects": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/objects/{obj_id}": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/product/workspace": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/product/workspace/{workspace_id}/report": {
    post: {
      request: SaveReportIn;
      response: unknown;
    };
  };
  "/product/workspace/{workspace_id}/report/{report_id}": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/product/workspace/{workspace_id}/reports": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/product/workspace/{workspace_id}/scenario": {
    post: {
      request: SaveScenarioIn;
      response: unknown;
    };
  };
  "/product/workspace/{workspace_id}/scenarios": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/replay/compare": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/replay/demo": {
    post: {
      request: unknown;
      response: Record<string, unknown>;
    };
  };
  "/replay/demo/seed": {
    post: {
      request: DemoSeedIn;
      response: Record<string, unknown>;
    };
  };
  "/replay/episodes": {
    get: {
      request: unknown;
      response: Array<Record<string, unknown>>;
    };
    post: {
      request: CreateEpisodeIn;
      response: Record<string, unknown>;
    };
  };
  "/replay/episodes/{episode_id}": {
    get: {
      request: unknown;
      response: ReplayEpisode;
    };
  };
  "/replay/episodes/{episode_id}/branch": {
    post: {
      request: BranchEpisodeIn;
      response: unknown;
    };
  };
  "/replay/episodes/{episode_id}/export": {
    post: {
      request: unknown;
      response: Record<string, unknown>;
    };
  };
  "/replay/episodes/{episode_id}/frames": {
    post: {
      request: ReplayFrame;
      response: Record<string, unknown>;
    };
  };
  "/replay/view/{episode_id}": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/scanner/fragility": {
    post: {
      request: FragilityScanRequest;
      response: FragilityScanResponse;
    };
  };
  "/scenario/override": {
    post: {
      request: ScenarioOverrideIn;
      response: unknown;
    };
  };
  "/simulation/propagation": {
    post: {
      request: PropagationRequest;
      response: unknown;
    };
  };
  "/simulation/scenario-action": {
    post: {
      request: ScenarioActionRequest;
      response: unknown;
    };
  };
  "/simulator/run": {
    post: {
      request: SimulatorRunIn;
      response: unknown;
    };
  };
  "/simulator/timeline": {
    post: {
      request: TimelineRunIn;
      response: unknown;
    };
  };
  "/system/analyze": {
    post: {
      request: ArchetypeAnalyzeIn;
      response: unknown;
    };
  };
  "/system/archetypes": {
    get: {
      request: unknown;
      response: SystemArchetypeCatalog_Output;
    };
    put: {
      request: SystemArchetypeCatalog_Input;
      response: SystemArchetypeCatalog_Output;
    };
  };
  "/system/archetypes/{version}": {
    get: {
      request: unknown;
      response: SystemArchetypeCatalog_Output;
    };
  };
  "/system/archetypes/history": {
    get: {
      request: unknown;
      response: Record<string, unknown>;
    };
  };
  "/system/compare/run": {
    post: {
      request: CompareInput;
      response: unknown;
    };
  };
  "/system/evolution/run": {
    post: {
      request: Record<string, unknown> | null;
      response: unknown;
    };
  };
  "/system/evolution/state": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/system/intelligence/run": {
    post: {
      request: SystemIntelligenceInput;
      response: unknown;
    };
  };
  "/system/memory/recent": {
    get: {
      request: unknown;
      response: unknown;
    };
  };
  "/system/memory/save": {
    post: {
      request: MemorySaveRequest;
      response: unknown;
    };
  };
  "/system/outcome/update": {
    post: {
      request: OutcomeUpdateRequest;
      response: unknown;
    };
  };
  "/system/strategic-council/run": {
    post: {
      request: CouncilAgentInput;
      response: StrategicCouncilRunResponse;
    };
  };
  "/system/strategy/generate": {
    post: {
      request: StrategyGenerationInput;
      response: unknown;
    };
  };
};
