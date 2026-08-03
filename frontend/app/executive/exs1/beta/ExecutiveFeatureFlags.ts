/**
 * Phase E — Beta feature flags (no component-level branching).
 * Consumers read flags via useExecutiveBeta(); providers gate surfaces.
 */

export type ExecutiveFeatureFlagId =
  | "EnableSimulation"
  | "EnableConnectors"
  | "EnableRuntimeInspector"
  | "EnableMetadataEditor"
  | "EnableDemoMode"
  | "EnableDeveloperMode"
  | "EnableMotionDebug"
  | "EnableMetadataDebug";

export type ExecutiveFeatureFlags = Readonly<
  Record<ExecutiveFeatureFlagId, boolean>
>;

export const DEFAULT_BETA_FEATURE_FLAGS: ExecutiveFeatureFlags = Object.freeze({
  EnableSimulation: true,
  EnableConnectors: true,
  EnableRuntimeInspector: process.env.NODE_ENV !== "production",
  EnableMetadataEditor: true,
  EnableDemoMode: true,
  EnableDeveloperMode: process.env.NODE_ENV !== "production",
  EnableMotionDebug: false,
  EnableMetadataDebug: false,
});

export function mergeFeatureFlags(
  overrides?: Partial<ExecutiveFeatureFlags>,
): ExecutiveFeatureFlags {
  return Object.freeze({
    ...DEFAULT_BETA_FEATURE_FLAGS,
    ...overrides,
  });
}
