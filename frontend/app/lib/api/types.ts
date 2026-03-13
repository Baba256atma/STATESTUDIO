export type Action = {
  type: string;
  object?: string;
  value?: Record<string, unknown>;
  target_id?: string;
  targetId?: string;
  color?: string;
  intensity?: number;
  position?: number[];
  visible?: boolean;
  scale?: number;
  [key: string]: unknown;
};

export type ChatResponse = {
  ok: boolean;
  user_id?: string | null;
  reply: string;
  actions: Action[];
  scene_json: Record<string, unknown> | null;
  source: string | null;
  error: { type: string; message: string } | null;
  debug?: Record<string, unknown> | null;
  active_mode?: string;
  session_id?: string;
};

export type ChatEvent = {
  id: string;
  timestamp: string;
  user_id: string;
  user_text: string;
  reply: string;
  actions: Action[];
};
