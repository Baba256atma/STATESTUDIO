import type { PropagationOverlayState } from "./propagationTypes";

export type ScenarioActionKind =
  | "stress_increase"
  | "stress_reduce"
  | "strategy_apply"
  | "decision_path_request"
  | "propagation_request"
  | "compare_request";

export type ScenarioActionMode = "what_if" | "decision_path" | "compare" | "preview";

export type ScenarioRequestedOutput =
  | "propagation"
  | "decision_path"
  | "summary"
  | "advice";

export type ScenarioActionIntent = {
  action_id: string;
  action_kind: ScenarioActionKind;
  source_object_id: string | null;
  target_object_ids?: string[];
  label?: string;
  description?: string;
  parameters?: Record<string, unknown>;
  mode?: ScenarioActionMode;
  requested_outputs?: ScenarioRequestedOutput[];
  created_at?: number;
  priority?: number;
};

export type ScenarioActionContract = {
  intent: ScenarioActionIntent;
  route_policy: {
    reuse_payload_if_available: boolean;
    request_backend: boolean;
    allow_preview_fallback: boolean;
  };
  visualization_hints: {
    preferred_focus_object_id?: string | null;
    preserve_existing_scene: boolean;
    emphasis_mode?: "propagation" | "decision_path" | "mixed";
  };
  metadata: {
    origin: "scenario_studio" | "war_room" | "manual_action";
    version: string;
  };
  payload?: unknown;
};

export type DecisionPathNodeRole =
  | "source"
  | "impacted"
  | "protected"
  | "leverage"
  | "bottleneck"
  | "destination"
  | "context";

export type DecisionPathEdgeRole =
  | "primary_path"
  | "secondary_path"
  | "tradeoff_path"
  | "feedback_path";

export type DecisionPathNode = {
  object_id: string;
  role: DecisionPathNodeRole;
  depth: number;
  strength: number;
  direction?: "upstream" | "downstream" | "mixed";
  rationale?: string | null;
};

export type DecisionPathEdge = {
  from_id: string;
  to_id: string;
  depth: number;
  strength: number;
  path_role?: DecisionPathEdgeRole;
};

export type DecisionPathResult = {
  active: boolean;
  source_object_id: string | null;
  nodes: DecisionPathNode[];
  edges: DecisionPathEdge[];
  meta: {
    mode?: string;
    interpretation?: string;
    engine_version?: string;
    action_id?: string;
    action_kind?: string;
  };
};

export type ScenarioActionAnalysis = {
  summary?: string | null;
  advice?: Array<{
    label: string;
    rationale?: string | null;
  }>;
};

export type ScenarioActionResponsePayload = {
  scenario_action?: ScenarioActionContract | null;
  propagation?: PropagationOverlayState | null;
  decisionPath?: DecisionPathResult | null;
  analysis?: ScenarioActionAnalysis | null;
};

export type ScenarioOverlayPackage = {
  propagation?: PropagationOverlayState | null;
  decisionPath?: DecisionPathResult | null;
  sourceAction?: ScenarioActionContract | null;
  mode: "propagation" | "decision_path" | "mixed" | "idle";
};
