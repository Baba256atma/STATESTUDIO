export type NexoraMvpGapSeverity =
  | "must_fix_before_launch"
  | "should_fix_before_launch"
  | "can_wait_until_post_launch";

export interface NexoraMvpGapAuditItem {
  id: string;
  category:
    | "product_entry"
    | "domain_selection"
    | "domain_home"
    | "demo_quality"
    | "prompt_flow"
    | "scene_behavior"
    | "panel_cockpit"
    | "risk_visibility"
    | "executive_story"
    | "domain_consistency"
    | "backend_stability"
    | "frontend_stability";
  severity: NexoraMvpGapSeverity;
  summary: string;
}

export interface NexoraMvpChecklistItem {
  id: string;
  label: string;
  status: "ready" | "needs_attention" | "post_launch";
}

export interface NexoraPostLaunchItem {
  id: string;
  label: string;
}

export const NEXORA_LAUNCH_DOMAIN_IDS = ["business", "devops", "finance"] as const;

export const DEFAULT_LAUNCH_DOMAIN_ID = "business";

export function isLaunchDomain(domainId?: string | null): boolean {
  return NEXORA_LAUNCH_DOMAIN_IDS.includes(String(domainId ?? "").trim().toLowerCase() as (typeof NEXORA_LAUNCH_DOMAIN_IDS)[number]);
}

export const NEXORA_MVP_GAP_AUDIT: NexoraMvpGapAuditItem[] = [
  {
    id: "entry_scope_clarity",
    category: "product_entry",
    severity: "must_fix_before_launch",
    summary: "Launch scope needs to center the 3 real domains instead of defaulting users into a generic fallback path.",
  },
  {
    id: "selection_launch_signals",
    category: "domain_selection",
    severity: "must_fix_before_launch",
    summary: "Domain selection should clearly distinguish launch-ready domains from preview domains.",
  },
  {
    id: "domain_demo_guidance",
    category: "domain_home",
    severity: "must_fix_before_launch",
    summary: "Users need clearer onboarding guidance from selected domain to demo to prompt to executive brief.",
  },
  {
    id: "demo_family_consistency",
    category: "demo_quality",
    severity: "should_fix_before_launch",
    summary: "Starter demos should feel like one product family with domain-specific meaning and comparable quality.",
  },
  {
    id: "prompt_to_story_clarity",
    category: "prompt_flow",
    severity: "must_fix_before_launch",
    summary: "Prompt examples and helper text should make the prompt -> risk -> executive story loop obvious.",
  },
  {
    id: "cockpit_signal_coherence",
    category: "panel_cockpit",
    severity: "should_fix_before_launch",
    summary: "Panel emphasis is present, but the launch MVP needs clearer explanation of why each domain emphasizes different panels.",
  },
  {
    id: "executive_surface_readability",
    category: "executive_story",
    severity: "must_fix_before_launch",
    summary: "The executive brief is already wired; the MVP needs it framed as a primary product outcome, not a hidden detail.",
  },
  {
    id: "non_launch_domain_expectations",
    category: "domain_consistency",
    severity: "should_fix_before_launch",
    summary: "General and Strategy should remain available, but should be clearly treated as preview experiences in the shipping MVP.",
  },
  {
    id: "frontend_warning_backlog",
    category: "frontend_stability",
    severity: "can_wait_until_post_launch",
    summary: "The existing HomeScreen warning backlog is noisy but not currently a launch-blocking error source.",
  },
  {
    id: "advanced_backend_expansion",
    category: "backend_stability",
    severity: "can_wait_until_post_launch",
    summary: "Deeper backend orchestration cleanup and future service expansion should not block the current MVP ship decision.",
  },
];

export const NEXORA_MVP_SHIPPING_CHECKLIST: NexoraMvpChecklistItem[] = [
  { id: "domain_selection", label: "Domain selection works and highlights launch-ready domains", status: "ready" },
  { id: "business_domain", label: "Business domain feels like a real launch domain", status: "ready" },
  { id: "devops_domain", label: "DevOps domain feels like a real launch domain", status: "ready" },
  { id: "finance_domain", label: "Finance domain feels like a real launch domain", status: "ready" },
  { id: "domain_demo_load", label: "Each launch domain loads a domain-aware starter demo", status: "ready" },
  { id: "prompt_examples", label: "Prompt examples are domain-aware and readable", status: "ready" },
  { id: "scene_updates", label: "Scene updates remain stable through the prompt flow", status: "ready" },
  { id: "risk_visibility", label: "Risk / fragility / KPI outputs are visible in the MVP flow", status: "ready" },
  { id: "executive_brief", label: "Executive brief is readable and part of the main product story", status: "ready" },
  { id: "decision_story", label: "Decision story remains available as part of the shared core experience", status: "ready" },
  { id: "chat_contract", label: "Backend /chat compatibility is preserved", status: "ready" },
  { id: "preview_domains", label: "Preview domains are clearly marked as non-launch experiences", status: "ready" },
];

export const NEXORA_POST_LAUNCH_BACKLOG: NexoraPostLaunchItem[] = [
  { id: "strategy_pack", label: "Elevate Strategy into a fourth real domain pack" },
  { id: "general_pack_cleanup", label: "Decide whether General remains a preview shell or becomes a polished launch surface" },
  { id: "multi_source_connectors", label: "Add deeper multi-source connectors beyond the normalized scanner architecture" },
  { id: "advanced_exploration", label: "Expand autonomous exploration surfaces beyond the current deterministic MVP path" },
  { id: "reporting_exports", label: "Add richer reporting, export, and polished replay surfaces" },
  { id: "lint_backlog", label: "Reduce the large pre-existing HomeScreen warning backlog" },
];
