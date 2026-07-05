export type {
  ExecutiveStrategicTheme as ExecutiveStrategicThemeContract,
  ExecutiveStrategicThemeDependency,
  ExecutiveStrategicThemeExtensionPolicy,
  ExecutiveStrategicThemeIdentity,
  ExecutiveStrategicThemeManifest,
  ExecutiveStrategicThemeName,
  ExecutiveStrategicThemePurpose,
  ExecutiveStrategicThemeRelationship,
  ExecutiveStrategicThemeRelationshipType,
  ExecutiveStrategicThemeRegistry,
  ExecutiveStrategicThemeScope,
  ExecutiveStrategicThemeSuccessCriteria,
  ExecutiveStrategicThemesPlatform as ExecutiveStrategicThemesPlatformContract,
  ExecutiveStrategicThemeValidation,
} from "./executiveStrategicThemeTypes.ts";

export { getExecutiveStrategicThemesManifest } from "./executiveStrategicThemeManifest.ts";
export {
  EXECUTIVE_STRATEGIC_THEME_DEPENDENCIES,
  EXECUTIVE_STRATEGIC_THEME_EXTENSION_POLICY,
  EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_THEME_REGISTRY,
  EXECUTIVE_STRATEGIC_THEME_RELATIONSHIPS,
  EXECUTIVE_STRATEGIC_THEMES,
  listExecutiveStrategicThemes,
  listExecutiveStrategicThemesPublicApis,
} from "./executiveStrategicThemeRegistry.ts";

import { getExecutiveStrategicThemesManifest } from "./executiveStrategicThemeManifest.ts";
import {
  EXECUTIVE_STRATEGIC_THEME_REGISTRY,
  listExecutiveStrategicThemes,
  listExecutiveStrategicThemesPublicApis,
} from "./executiveStrategicThemeRegistry.ts";
import type {
  ExecutiveStrategicThemesPlatform as ExecutiveStrategicThemesPlatformType,
  ExecutiveStrategicThemeValidation as ExecutiveStrategicThemeValidationType,
} from "./executiveStrategicThemeTypes.ts";

function buildBuilderValidation(): ExecutiveStrategicThemeValidationType {
  const registry = EXECUTIVE_STRATEGIC_THEME_REGISTRY;
  const valid =
    registry.platformId === "BUS-19" &&
    registry.themes.length > 0 &&
    registry.relationships.length > 0 &&
    registry.publicApis.length > 0 &&
    registry.metadataOnly &&
    registry.immutable;

  return Object.freeze({
    valid,
    errors: Object.freeze(valid ? [] : ["builder-registry-validation-failed"]),
    warnings: Object.freeze([]),
  });
}

function validateExecutiveStrategicThemeFacade(): ExecutiveStrategicThemeValidationType {
  return buildBuilderValidation();
}

export function buildExecutiveStrategicTheme(): ExecutiveStrategicThemesPlatformType {
  const manifest = getExecutiveStrategicThemesManifest();
  return Object.freeze({
    registry: EXECUTIVE_STRATEGIC_THEME_REGISTRY,
    manifest,
    validation: buildBuilderValidation(),
  });
}

export const ExecutiveStrategicThemesPlatform = Object.freeze({
  buildExecutiveStrategicTheme,
  validateExecutiveStrategicTheme: validateExecutiveStrategicThemeFacade,
  getExecutiveStrategicThemesManifest,
  listExecutiveStrategicThemes,
  listExecutiveStrategicThemesPublicApis,
});
