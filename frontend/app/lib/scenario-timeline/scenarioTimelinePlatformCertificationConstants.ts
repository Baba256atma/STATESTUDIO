/**
 * APP-5:9 — Scenario Timeline Platform Certification constants.
 */

export const SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "APP-5/9" as const;
export const SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION =
  "APP-5/9-platform-certification-arch" as const;

export const SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_TAGS = Object.freeze([
  "[APP5_9]",
  "[PLATFORM_CERTIFICATION]",
  "[READ_ONLY]",
  "[NO_NEW_FEATURES]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_VALIDATION_GATE_KEYS = Object.freeze([
  "A_platform_identity",
  "B_platform_version",
  "C_public_contracts",
  "D_frozen_vocabulary",
  "E_immutable_objects",
  "F_event_pipeline",
  "G_lifecycle_pipeline",
  "H_history_pipeline",
  "I_query_pipeline",
  "J_api_layer",
  "K_assistant_integration",
  "L_dashboard_integration",
  "M_cross_layer_compatibility",
  "N_public_api_stability",
  "O_version_compatibility",
  "P_architecture_boundaries",
  "Q_no_engine_bypass",
  "R_no_registry_bypass",
  "S_no_persistence",
  "T_no_ui_implementation",
  "U_no_dashboard_implementation",
  "V_no_assistant_reasoning",
  "W_regression_safety",
  "X_typescript_build",
  "Y_documentation_completeness",
  "Z_platform_readiness",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_REQUIRED_DOCS = Object.freeze([
  "docs/app-5-1-scenario-timeline-platform-foundation.md",
  "docs/app-5-6-scenario-timeline-api-layer.md",
  "docs/app-5-7-scenario-timeline-assistant-integration.md",
  "docs/app-5-8-scenario-timeline-dashboard-integration.md",
  "docs/app-5-9-scenario-timeline-platform-certification-report.md",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_BYPASS_FORBIDDEN_IMPORTS = Object.freeze([
  "scenarioTimelineEventRegistry.ts",
  "scenarioTimelineLifecycleRegistry.ts",
  "scenarioTimelineHistoryRegistry.ts",
  "scenarioTimelineApiSources.ts",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_INTEGRATION_MODULES = Object.freeze([
  "app/lib/scenario-timeline/scenarioTimelineAssistantAdapter.ts",
  "app/lib/scenario-timeline/scenarioTimelineDashboardAdapter.ts",
  "app/lib/scenario-timeline/scenarioTimelineAssistantIntegration.ts",
  "app/lib/scenario-timeline/scenarioTimelineDashboardIntegration.ts",
] as const);
