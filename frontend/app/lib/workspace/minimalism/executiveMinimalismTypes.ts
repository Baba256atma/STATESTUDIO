/** E2:45 — Executive minimalism + visual noise reduction contracts. */

export type MinimalismElementClass = "CRITICAL" | "IMPORTANT" | "OPTIONAL" | "NOISE";

export type AttentionHierarchyTier = "PRIMARY" | "SECONDARY" | "TERTIARY" | "BACKGROUND";

export type InformationCategory =
  | "current_view"
  | "selected_object"
  | "decision_status"
  | "frsi_score"
  | "frsi_breakdown"
  | "scenario_status"
  | "readiness"
  | "timeline_events"
  | "object_metadata"
  | "confidence"
  | "health"
  | "pipeline_insight";

export type InformationOwner =
  | "command_bar"
  | "scene_info"
  | "object_info"
  | "status_hud"
  | "timeline_hud"
  | "scene_toolbar"
  | "quick_actions_dock";

export type TopBarPrimaryBlockId = "frsi" | "scenario" | "decision" | "workspace_controls";

export type TopBarOverflowItemId =
  | "readiness"
  | "mini_insight"
  | "analyze"
  | "compare"
  | "load_template"
  | "save_workspace"
  | "load_workspace"
  | "hud_settings"
  | "layout_preset"
  | "view_mode"
  | "developer_tools"
  | "sandbox"
  | "diagnostics";

export type ExecutiveMinimalismAuditInput = {
  commandBarVisible?: boolean;
  statusHudVisible?: boolean;
  sceneInfoVisible?: boolean;
  objectInfoVisible?: boolean;
  timelineVisible?: boolean;
  quickActionsVisible?: boolean;
  objectCount?: number;
  viewportWidth?: number;
};

export type ExecutiveMinimalismAuditElement = {
  id: string;
  surface: string;
  classification: MinimalismElementClass;
  category?: InformationCategory;
  reason?: string;
};

export type ExecutiveMinimalismAuditReport = {
  visibleElements: ExecutiveMinimalismAuditElement[];
  redundantElements: ExecutiveMinimalismAuditElement[];
  noiseElements: ExecutiveMinimalismAuditElement[];
  duplicateElements: ExecutiveMinimalismAuditElement[];
};

export type TopBarPriorityInput = {
  viewportWidth?: number;
  commandBarVisible?: boolean;
  quickActionsVisible?: boolean;
  statusHudVisible?: boolean;
};

export type TopBarPrioritySnapshot = {
  primaryBlocks: TopBarPrimaryBlockId[];
  overflowItems: TopBarOverflowItemId[];
  showMiniInsight: boolean;
  showInlineActions: boolean;
  compactStatusBlocks: boolean;
};

export type ExecutiveVisualWeightSnapshot = {
  borderWidthPx: number;
  shellShadow: string | undefined;
  blockPaddingPx: number;
  useGlowAccents: boolean;
  backdropBlurPx: number;
};

export type ExecutiveLabelReductionInput = {
  objectCount: number;
  selected?: boolean;
  focused?: boolean;
  isCritical?: boolean;
  isHighRisk?: boolean;
  isConnected?: boolean;
  viewportWidth?: number;
  cameraDistance?: number;
};

export type ExecutiveLabelReductionState = {
  visible: boolean;
  showSecondary: boolean;
  showIcon: boolean;
  opacity: number;
  priorityRank: number;
};

export type ExecutiveEmptyStateContext =
  | "no_selection"
  | "no_data"
  | "unknown"
  | "loading"
  | "no_scenario"
  | "no_risk_signals"
  | "no_timeline_events"
  | "confidence_missing"
  | "frsi_pending"
  | "placeholder";
