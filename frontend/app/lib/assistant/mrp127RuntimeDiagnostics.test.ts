import { afterEach, describe, expect, it, vi } from "vitest";

import { ASSISTANT_PANEL_DOCK_DEFINITIONS } from "./assistantPanelDockContract";
import {
  openAssistantSupportAccordionPanel,
  resetAssistantSupportAccordionForTests,
} from "./assistantSupportAccordionRuntime";
import {
  resetMrp127RuntimeDiagnosticsForTests,
  traceMrp127AssistantSupportDockMounted,
  traceMrp127SupportPanelOpened,
  traceMrp127SupportPanelSwitched,
} from "./mrp127RuntimeDiagnostics";

describe("mrp127RuntimeDiagnostics", () => {
  afterEach(() => {
    resetMrp127RuntimeDiagnosticsForTests();
    resetAssistantSupportAccordionForTests();
    vi.restoreAllMocks();
  });

  it("logs dock mounted once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrp127AssistantSupportDockMounted();
    traceMrp127AssistantSupportDockMounted();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[MRP127Runtime]\nAssistantSupportDock mounted");
  });

  it("logs panel open and switch with executive labels", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrp127SupportPanelOpened("insight");
    traceMrp127SupportPanelSwitched("insight", "scenario");
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[0]?.[0]).toBe("[MRP127Runtime]\nSupportPanel opened\npanel=Insight");
    expect(log.mock.calls[1]?.[0]).toBe("[MRP127Runtime]\nSupportPanel switched\nInsight -> Scenario");
    expect(ASSISTANT_PANEL_DOCK_DEFINITIONS.scenario.label).toBe("Scenario");
  });

  it("runtime open emits single-open accordion contract", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    openAssistantSupportAccordionPanel("insight");
    openAssistantSupportAccordionPanel("scenario");
    expect(log.mock.calls.some((call) => String(call[0]).includes("openPanels=1"))).toBe(true);
  });
});
