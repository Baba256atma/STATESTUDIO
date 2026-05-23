import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  EXECUTIVE_DEV_SURFACES_STORAGE_KEY,
  isExecutiveWorkspaceCleanPresentation,
  shouldExposeExecutiveDevSurfaces,
  shouldShowExecutivePipelineStatusHud,
  shouldShowExecutiveScenePanelDock,
  shouldShowExecutiveObjectPanelDock,
  shouldShowExecutiveStatusStrip,
  shouldShowExecutiveRightAssistantPanel,
  shouldShowExecutiveLeftCommandPanel,
  shouldShowExecutiveStageAssistantOverlay,
  shouldShowExecutiveScenarioSuggestionsPanel,
  shouldShowExecutiveScenarioComparisonPanel,
  shouldShowExecutiveCommandBar,
  shouldShowExecutiveQuickActionsDock,
} from "./executiveWorkspacePresentation";

function createStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
    clear: () => map.clear(),
    key: (index: number) => [...map.keys()][index] ?? null,
    get length() {
      return map.size;
    },
  } as Storage;
}

describe("executiveWorkspacePresentation", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubGlobal("window", { localStorage: createStorage() });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("enables clean presentation for type_c mode", () => {
    expect(isExecutiveWorkspaceCleanPresentation()).toBe(true);
  });

  it("hides dev surfaces until localStorage opt-in", () => {
    expect(shouldExposeExecutiveDevSurfaces()).toBe(false);
    window.localStorage.setItem(EXECUTIVE_DEV_SURFACES_STORAGE_KEY, "1");
    expect(shouldExposeExecutiveDevSurfaces()).toBe(true);
  });

  it("shows pipeline HUD only for processing or error in clean mode", () => {
    expect(shouldShowExecutivePipelineStatusHud("ready")).toBe(false);
    expect(shouldShowExecutivePipelineStatusHud("processing")).toBe(true);
    expect(shouldShowExecutivePipelineStatusHud("error")).toBe(true);
  });

  it("hides status strip in clean mode without dev opt-in", () => {
    expect(shouldShowExecutiveStatusStrip()).toBe(false);
    window.localStorage.setItem(EXECUTIVE_DEV_SURFACES_STORAGE_KEY, "1");
    expect(shouldShowExecutiveStatusStrip()).toBe(true);
  });

  it("hides legacy scene panel dock in clean mode without dev opt-in", () => {
    expect(shouldShowExecutiveScenePanelDock()).toBe(false);
    window.localStorage.setItem(EXECUTIVE_DEV_SURFACES_STORAGE_KEY, "1");
    expect(shouldShowExecutiveScenePanelDock()).toBe(true);
  });

  it("hides legacy object panel dock in clean mode without dev opt-in", () => {
    expect(shouldShowExecutiveObjectPanelDock()).toBe(false);
    window.localStorage.setItem(EXECUTIVE_DEV_SURFACES_STORAGE_KEY, "1");
    expect(shouldShowExecutiveObjectPanelDock()).toBe(true);
  });

  it("shows right assistant and hides left command in clean mode without dev opt-in", () => {
    expect(shouldShowExecutiveRightAssistantPanel()).toBe(true);
    expect(shouldShowExecutiveScenarioSuggestionsPanel()).toBe(true);
    expect(shouldShowExecutiveScenarioComparisonPanel()).toBe(true);
    expect(shouldShowExecutiveCommandBar()).toBe(true);
    expect(shouldShowExecutiveQuickActionsDock()).toBe(true);
    expect(shouldShowExecutiveLeftCommandPanel()).toBe(false);
    expect(shouldShowExecutiveStageAssistantOverlay()).toBe(false);
    window.localStorage.setItem(EXECUTIVE_DEV_SURFACES_STORAGE_KEY, "1");
    expect(shouldShowExecutiveRightAssistantPanel()).toBe(false);
    expect(shouldShowExecutiveScenarioSuggestionsPanel()).toBe(false);
    expect(shouldShowExecutiveScenarioComparisonPanel()).toBe(false);
    expect(shouldShowExecutiveCommandBar()).toBe(false);
    expect(shouldShowExecutiveQuickActionsDock()).toBe(false);
    expect(shouldShowExecutiveLeftCommandPanel()).toBe(true);
    expect(shouldShowExecutiveStageAssistantOverlay()).toBe(true);
  });
});
