export type CustomerDemoProfile = {
  id: string;
  label: string;
  domain: string;
  business_context: string;
  executive_focus: string;
  default_mode: string;
  recommended_prompts: string[];
  hero_summary: string;
  initial_focus_object_ids: string[];
  scenario_script_id?: string | null;
  panel_labels?: Record<string, string>;
  header_context_label?: string | null;
  empty_state_copy?: Record<string, string>;
};

export type CustomerDemoState = {
  activeProfileId: string | null;
  activeProfile: CustomerDemoProfile | null;
  isDemoMode: boolean;
};
