export type NexoraEnvironment =
  | "development"
  | "staging"
  | "production"
  | "demo"
  | "scanner_sandbox"
  | "enterprise_custom";

export type LoggingMode = "debug" | "standard" | "production_safe" | "audit_strict";

export type FeatureCapabilityMap = {
  scanner_create: boolean;
  scanner_enrich: boolean;
  autonomous_exploration: boolean;
  multi_agent: boolean;
  enterprise_integrations: boolean;
  scenario_replay_comparison: boolean;
  advanced_cockpit: boolean;
  memory_learning: boolean;
  experimental_reasoning_paths: boolean;
  strict_validation: boolean;
  enable_trace_logging: boolean;
  safe_execution_only: boolean;
  disable_multi_agent_if_unstable: boolean;
};

export type IntegrationPolicy = {
  allow_external_integrations: boolean;
  trusted_sources_only: boolean;
  allow_live_sync: boolean;
  scanner_scope: "none" | "sandbox_only" | "bounded" | "full";
};

export type RuntimeSafetyPolicy = {
  safe_mode: boolean;
  restricted_mode: boolean;
  max_scenarios_per_run: number;
  max_exploration_time_ms: number;
  max_multi_agent_count: number;
  block_destructive_external_writes: boolean;
};

export type DeploymentProfile = {
  id: string;
  environment: NexoraEnvironment;
  label: string;
  description?: string;
};

export type OperationalReadinessProfile = {
  audit_sensitivity: "low" | "medium" | "high";
  explainability_strictness: "standard" | "strict";
  approved_feature_set: string[];
  approved_integration_policy: "open" | "bounded" | "strict";
};

export type EnvironmentConfig = {
  deployment: DeploymentProfile;
  features: FeatureCapabilityMap;
  integration_policy: IntegrationPolicy;
  runtime_safety: RuntimeSafetyPolicy;
  logging_mode: LoggingMode;
  governance_hooks?: {
    enforce_review_status?: boolean;
    require_provenance_for_recommendations?: boolean;
  };
  readiness: OperationalReadinessProfile;
};

export type EnvironmentContext = {
  environment: NexoraEnvironment;
  mode_id?: string;
  company_id?: string;
  node_env?: string;
};

function boolFromEnv(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  const v = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(v)) return true;
  if (["0", "false", "no", "off"].includes(v)) return false;
  return fallback;
}

function numFromEnv(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function resolveNexoraEnvironment(input?: {
  requested?: string;
  mode_id?: string;
  node_env?: string;
}): NexoraEnvironment {
  const requested = String(input?.requested ?? "").trim().toLowerCase();
  const mode = String(input?.mode_id ?? "").trim().toLowerCase();
  const nodeEnv = String(input?.node_env ?? "").trim().toLowerCase();
  if (requested === "scanner_sandbox" || mode === "scanner") return "scanner_sandbox";
  if (requested === "demo" || mode === "demo") return "demo";
  if (requested === "staging") return "staging";
  if (requested === "enterprise_custom") return "enterprise_custom";
  if (requested === "production" || nodeEnv === "production") return "production";
  return "development";
}

export function buildEnvironmentConfig(context: EnvironmentContext): EnvironmentConfig {
  const env = context.environment;
  const isProdLike = env === "production" || env === "enterprise_custom";
  const isDemo = env === "demo";
  const isScannerSandbox = env === "scanner_sandbox";

  const features: FeatureCapabilityMap = {
    scanner_create: isScannerSandbox || !isProdLike || boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_SCANNER_CREATE, true),
    scanner_enrich: boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_SCANNER_ENRICH, true),
    autonomous_exploration: boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_AUTONOMOUS_EXPLORATION, !isProdLike),
    multi_agent: boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_MULTI_AGENT, true),
    enterprise_integrations: boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_ENTERPRISE_INTEGRATIONS, !isDemo),
    scenario_replay_comparison: boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_SCENARIO_REPLAY, true),
    advanced_cockpit: boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_ADVANCED_COCKPIT, !isDemo),
    memory_learning: boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_MEMORY_LEARNING, true),
    experimental_reasoning_paths: boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_REASONING, !isProdLike),
    strict_validation: boolFromEnv(process.env.NEXT_PUBLIC_STRICT_VALIDATION, isProdLike),
    enable_trace_logging: boolFromEnv(process.env.NEXT_PUBLIC_ENABLE_TRACE_LOGGING, !isDemo),
    safe_execution_only: boolFromEnv(process.env.NEXT_PUBLIC_SAFE_EXECUTION_ONLY, false),
    disable_multi_agent_if_unstable: boolFromEnv(
      process.env.NEXT_PUBLIC_DISABLE_MULTI_AGENT_IF_UNSTABLE,
      isProdLike
    ),
  };

  const integrationPolicy: IntegrationPolicy = {
    allow_external_integrations: features.enterprise_integrations && !isDemo,
    trusted_sources_only: isProdLike,
    allow_live_sync: !isDemo && env !== "development",
    scanner_scope: isScannerSandbox ? "sandbox_only" : isProdLike ? "bounded" : "full",
  };

  const runtimeSafety: RuntimeSafetyPolicy = {
    safe_mode: isProdLike,
    restricted_mode: isProdLike,
    max_scenarios_per_run: Math.max(1, numFromEnv(process.env.NEXT_PUBLIC_MAX_SCENARIOS_PER_RUN, isProdLike ? 4 : 8)),
    max_exploration_time_ms: Math.max(
      50,
      numFromEnv(process.env.NEXT_PUBLIC_MAX_EXPLORATION_TIME_MS, isProdLike ? 220 : 450)
    ),
    max_multi_agent_count: Math.max(1, numFromEnv(process.env.NEXT_PUBLIC_MAX_MULTI_AGENT_COUNT, isProdLike ? 6 : 8)),
    block_destructive_external_writes: true,
  };

  const loggingMode: LoggingMode =
    env === "development" ? "debug" : env === "demo" ? "standard" : isProdLike ? "audit_strict" : "production_safe";

  return {
    deployment: {
      id: `env_${env}`,
      environment: env,
      label: env.replace(/_/g, " "),
      description: "Nexora deployment/environment profile",
    },
    features,
    integration_policy: integrationPolicy,
    runtime_safety: runtimeSafety,
    logging_mode: loggingMode,
    governance_hooks: {
      enforce_review_status: isProdLike,
      require_provenance_for_recommendations: isProdLike,
    },
    readiness: {
      audit_sensitivity: isProdLike ? "high" : env === "staging" ? "medium" : "low",
      explainability_strictness: isProdLike ? "strict" : "standard",
      approved_feature_set: Object.entries(features)
        .filter(([, enabled]) => !!enabled)
        .map(([name]) => name),
      approved_integration_policy: integrationPolicy.trusted_sources_only ? "strict" : integrationPolicy.allow_live_sync ? "bounded" : "open",
    },
  };
}

export function isFeatureEnabled(config: EnvironmentConfig | null | undefined, feature: keyof FeatureCapabilityMap): boolean {
  if (!config) return true;
  return !!config.features?.[feature];
}
