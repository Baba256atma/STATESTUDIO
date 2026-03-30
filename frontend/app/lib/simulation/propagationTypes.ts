export type PropagationNodeImpact = {
  object_id: string;
  depth: number;
  strength: number;
  role: "source" | "impacted" | "context";
};

export type PropagationEdgeImpact = {
  from: string;
  to: string;
  depth: number;
  strength: number;
};

export type PropagationTriggerSource =
  | "chat_payload"
  | "selected_object"
  | "clicked_object"
  | "scanner_primary"
  | "backend_payload"
  | "scenario_action"
  | "manual_action"
  | "fallback_preview";

export type PropagationOverlayState = {
  active: boolean;
  source_object_id: string | null;
  mode: "preview" | "backend";
  impacted_nodes: PropagationNodeImpact[];
  impacted_edges: PropagationEdgeImpact[];
  meta: {
    label?: string;
    timestamp: number;
    source_kind: PropagationTriggerSource;
  };
};
