export type DecisionNodeRole =
  | "source"
  | "impacted"
  | "leverage"
  | "bottleneck"
  | "protected"
  | "destination"
  | "context";

export type DecisionEdgeRole =
  | "primary_path"
  | "secondary_path"
  | "feedback"
  | "tradeoff"
  | "supporting";

export type DecisionPathNodeOverlay = {
  id: string;
  role: DecisionNodeRole;
  depth: number;
  strength: number;
  direction?: "upstream" | "downstream" | "mixed";
  label?: string | null;
  rationale?: string | null;
};

export type DecisionPathEdgeOverlay = {
  from: string;
  to: string;
  role: DecisionEdgeRole;
  depth: number;
  strength: number;
};

export type DecisionPathOverlayState = {
  active: boolean;
  sourceId: string | null;
  nodes: DecisionPathNodeOverlay[];
  edges: DecisionPathEdgeOverlay[];
  emphasisMode: "decision_path";
  meta: {
    actionId?: string;
    mode?: string;
    version: string;
  };
};
