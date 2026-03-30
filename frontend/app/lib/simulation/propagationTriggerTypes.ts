import type { PropagationOverlayState } from "./propagationTypes";
import type { ScenarioActionContract } from "./scenarioActionTypes";

export type PropagationTriggerKind =
  | "scenario_action"
  | "chat_payload"
  | "scanner_primary"
  | "manual_action"
  | "selected_object"
  | "fallback_preview";

export type PropagationTriggerIntent = {
  kind: PropagationTriggerKind;
  source_object_id: string | null;
  priority: number;
  confidence: number;
  created_at: number;
  payload?: PropagationOverlayState | null;
  scenario_action?: ScenarioActionContract | null;
  route_policy: "reuse_payload" | "request_backend" | "fallback_preview";
  mode_hint?: "backend" | "preview" | "idle";
  reason: string;
};

export type PropagationTriggerResolution = {
  active_trigger: PropagationTriggerIntent | null;
  candidate_triggers: PropagationTriggerIntent[];
  resolution_reason: string;
  should_request_backend: boolean;
  should_reuse_payload: boolean;
  should_fallback_preview: boolean;
};

export type ScenarioActionPropagationIntent = ScenarioActionContract;
