// Shared scene contracts for StateStudio (frontend-only).
// Keep this file as the single source of truth for SceneJson / loops / objects.

export type Vector3Tuple = [number, number, number];

// Aliases for legacy imports
export type SceneLoopType = LoopType;
export type SceneLoopStatus = LoopStatus;

// State vector (intensity, volatility, plus any future KPIs)
export type StateVector = {
  intensity?: number;
  volatility?: number;
  [key: string]: number | undefined;
};

export type SemanticObjectMeta = {
  canonical_name?: string;
  display_label?: string;
  category?: string;
  role?: string;
  domain?: string;
  tags?: string[];
  keywords?: string[];
  dependencies?: string[];
  risk_kind?: string;
  business_meaning?: string;
  related_terms?: string[];
  [key: string]: unknown;
};

// Scene object (3D node)
export type SceneObject = {
  id: string;
  label?: string;
  name?: string;
  type?: string;
  position?: Vector3Tuple;
  pos?: Vector3Tuple;
  color?: string;
  scale?: number;
  emphasis?: number;
  tags?: string[];
  role?: string;
  canonical_name?: string;
  display_label?: string;
  category?: string;
  domain?: string;
  keywords?: string[];
  dependencies?: string[];
  risk_kind?: string;
  business_meaning?: string;
  related_terms?: string[];
  scanner_reason?: string;
  scanner_highlighted?: boolean;
  scanner_severity?: string;
  scanner_emphasis?: number;
  scanner_focus?: boolean;
  scanner_overlay_summary?: string;
  semantic?: SemanticObjectMeta;
  domain_hints?: Record<string, string[]>;
  ux?: { shape?: string; base_color?: string };
  [key: string]: unknown;
};

// Loop edge
export type SceneLoopEdge = {
  from: string;
  to: string;
  weight?: number;
  kind?: string;
  label?: string;
  polarity?: string;
};

// Loop definition
export type SceneLoop = {
  id: string;
  type: LoopType | string;
  status?: LoopStatus;
  severity?: number;
  kpis?: string[];
  edges: SceneLoopEdge[];
  suggestions?: string[];
  label?: string;
  polarity?: string;
  strength?: number;
  triggered_by?: unknown;
  [key: string]: unknown;
};

// Scene JSON payload returned by backend
export type SceneJson = {
  meta?: Record<string, unknown>;
  domain_model?: Record<string, unknown>;
  state_vector: StateVector;
  scene: {
    camera?: { pos?: Vector3Tuple; lookAt?: Vector3Tuple; autoFrame?: boolean };
    lights?: unknown[];
    objects?: SceneObject[];
    animations?: unknown[];
    kpi?: Record<string, number>;
    loops?: SceneLoop[];
    active_loop?: string | null;
    loops_suggestions?: string[];
    scene?: { intensity?: number; volatility?: number };
    state_vector?: StateVector;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
// Loop contract (KPI + Loops)
export type LoopType =
  | "quality_protection"
  | "cost_compression"
  | "delivery_customer"
  | "risk_ignorance"
  | "stability_balance";

export type LoopStatus = "active" | "warning" | "paused" | "resolved";
