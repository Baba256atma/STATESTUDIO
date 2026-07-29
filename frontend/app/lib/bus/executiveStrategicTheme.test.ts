import * as assert from "node:assert/strict";
import { test } from "node:test";

import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import { EXECUTIVE_STRATEGY_PLATFORM_REGISTRY, EXECUTIVE_STRATEGY_PUBLIC_APIS } from "./executiveStrategyRegistry.ts";
import {
  EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  listExecutiveStrategyDefinitions,
} from "./executiveStrategyDefinitionRegistry.ts";
import { buildExecutiveStrategicTheme, EXECUTIVE_STRATEGIC_THEME_REGISTRY, EXECUTIVE_STRATEGIC_THEME_RELATIONSHIPS, EXECUTIVE_STRATEGIC_THEMES, ExecutiveStrategicThemesPlatform, getExecutiveStrategicThemesManifest, validateExecutiveStrategicTheme } from "./executiveStrategicThemeIndex.ts";
import type { ExecutiveStrategicThemeRegistry } from "./executiveStrategicThemeTypes.ts";

test("platform identity", () => {
  const registry = EXECUTIVE_STRATEGIC_THEME_REGISTRY;

  assert.equal(registry.platformId, "BUS-19");
  assert.equal(registry.platformName, "Executive Strategic Themes Platform");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.foundationPlatformId, "BUS-17");
  assert.equal(registry.definitionPlatformId, "BUS-18");
});

test("strategic theme contracts", () => {
  assert.equal(EXECUTIVE_STRATEGIC_THEMES.length, 3);
  assert.equal(EXECUTIVE_STRATEGIC_THEMES.every((theme) => theme.purpose.purposeStatement.length > 0), true);
  assert.equal(EXECUTIVE_STRATEGIC_THEMES.every((theme) => theme.scope.scopeStatement.length > 0), true);
});

test("theme hierarchy", () => {
  const growthTheme = EXECUTIVE_STRATEGIC_THEMES.find((theme) => theme.identity.themeId === "theme-sustainable-growth");
  const innovationTheme = EXECUTIVE_STRATEGIC_THEMES.find((theme) => theme.identity.themeId === "theme-innovation-engine");

  assert.equal(growthTheme?.childThemeIds.includes("theme-innovation-engine"), true);
  assert.equal(innovationTheme?.parentThemeId, "theme-sustainable-growth");
});

test("relationship registry", () => {
  assert.equal(EXECUTIVE_STRATEGIC_THEME_RELATIONSHIPS.length, 9);
  assert.equal(EXECUTIVE_STRATEGIC_THEME_RELATIONSHIPS.some((relationship) => relationship.relationshipType === "ParentThemeToChildTheme"), true);
});

test("registries", () => {
  const registry = EXECUTIVE_STRATEGIC_THEME_REGISTRY;

  assert.equal(registry.themes.length, 3);
  assert.equal(registry.categories.length, 4);
  assert.equal(registry.statuses.length, 5);
  assert.equal(registry.priorities.length, 5);
  assert.equal(registry.lifecycles.length, 5);
  assert.equal(registry.owners.length, 3);
  assert.equal(registry.versions.length, 3);
  assert.equal(Object.isFrozen(registry), true);
});

test("dependency boundaries", () => {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const manifest = getExecutiveStrategicThemesManifest();

  assert.equal(kpiFreezeManifest.platformIdentity.state, "Certified Frozen Released");
  assert.equal(okrFreezeManifest.platformIdentity.state, "Certified Frozen Released");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformId, "BUS-17");
  assert.equal(EXECUTIVE_STRATEGY_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId, "BUS-18");
  assert.equal(strategyDefinitions.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS.length > 0, true);
  assert.equal(manifest.strategyFoundationAvailable, true);
  assert.equal(manifest.strategyDefinitionsAvailable, true);
});

test("validation", () => {
  const validation = validateExecutiveStrategicTheme();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("manifest", () => {
  const first = getExecutiveStrategicThemesManifest();
  const second = getExecutiveStrategicThemesManifest();

  assert.equal(first.platformId, "BUS-19");
  assert.equal(first.themeCount, 3);
  assert.equal(first.relationshipCount, 9);
  assert.equal(first.certificationStatus, "Strategic Themes Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("public APIs", () => {
  assert.equal(typeof ExecutiveStrategicThemesPlatform.buildExecutiveStrategicTheme, "function");
  assert.equal(typeof ExecutiveStrategicThemesPlatform.validateExecutiveStrategicTheme, "function");
  assert.equal(typeof ExecutiveStrategicThemesPlatform.getExecutiveStrategicThemesManifest, "function");
  assert.equal(typeof ExecutiveStrategicThemesPlatform.listExecutiveStrategicThemes, "function");
  assert.equal(typeof ExecutiveStrategicThemesPlatform.listExecutiveStrategicThemesPublicApis, "function");
});

test("immutable behavior", () => {
  const platform = buildExecutiveStrategicTheme();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveStrategicThemesPlatform), true);
});

test("version integrity", () => {
  const platform = buildExecutiveStrategicTheme();

  assert.equal(platform.registry.versions.every((version) => version.semanticVersion === "1.0.0"), true);
  assert.equal(platform.registry.themes.every((theme) => theme.version.semanticVersion === "1.0.0"), true);
});

test("detects duplicate themes", () => {
  const duplicateRegistry: ExecutiveStrategicThemeRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_THEME_REGISTRY,
    themes: Object.freeze([
      EXECUTIVE_STRATEGIC_THEME_REGISTRY.themes[0],
      EXECUTIVE_STRATEGIC_THEME_REGISTRY.themes[0],
    ]),
  });
  const validation = validateExecutiveStrategicTheme(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-theme-id:theme-sustainable-growth"), true);
});

test("detects duplicate public APIs", () => {
  const duplicateRegistry: ExecutiveStrategicThemeRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_THEME_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_STRATEGIC_THEME_REGISTRY.publicApis[0],
      EXECUTIVE_STRATEGIC_THEME_REGISTRY.publicApis[0],
    ]),
  });
  const validation = validateExecutiveStrategicTheme(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-public-api:ExecutiveStrategicThemesPlatform"), true);
});
