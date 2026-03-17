export type FragilityScanRequest = {
  text?: string | null;
  source_type?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  workspace_id?: string | null;
  user_id?: string | null;
  mode?: string;
  allowed_objects?: string[] | null;
  metadata?: Record<string, unknown>;
};

export type FragilityDriver = {
  id: string;
  label: string;
  score: number;
  severity: string;
  dimension?: string | null;
  evidence_text?: string | null;
};

export type FragilityFinding = {
  id: string;
  title: string;
  severity: string;
  explanation: string;
  recommendation: string;
};

export type FragilitySceneObject = {
  id: string;
  emphasis?: number;
  reason?: string;
};

export type FragilitySceneHighlight = {
  type: string;
  target: string;
  severity?: string;
};

export type FragilityScenePayload = {
  objects: FragilitySceneObject[];
  highlights: FragilitySceneHighlight[];
  state_vector: {
    fragility_score?: number;
    fragility_level?: string;
    scanner_mode?: string;
  };
  suggested_focus: string[];
  scanner_overlay: {
    summary?: string;
    top_driver_ids?: string[];
  };
};

export type FragilityScanResponse = {
  ok: boolean;
  summary: string;
  fragility_score: number;
  fragility_level: string;
  drivers: FragilityDriver[];
  findings: FragilityFinding[];
  suggested_objects: string[];
  suggested_actions: string[];
  scene_payload: FragilityScenePayload;
  debug?: Record<string, unknown> | null;
};

export type FragilityScannerStatus = "idle" | "loading" | "success" | "error";

export type FragilityScannerState = {
  status: FragilityScannerStatus;
  error: string | null;
  result: FragilityScanResponse | null;
};
