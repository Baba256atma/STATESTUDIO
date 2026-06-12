import { afterEach, describe, expect, it, vi } from "vitest";

import { ASSISTANT_PANEL_DOCK_DEFINITIONS } from "./assistantPanelDockContract";
import {
  openAssistantSupportAccordionPanel,
  resetAssistantSupportAccordionForTests,
} from "./assistantSupportAccordionRuntime";
import {
  resetMrp128RuntimeDiagnosticsForTests,
  traceMrp128QuestionInjected,
  traceMrp128QuestionsPanelMounted,
  traceMrp128SingleOpenContractPassed,
} from "./mrp128RuntimeDiagnostics";

describe("mrp128RuntimeDiagnostics", () => {
  afterEach(() => {
    resetMrp128RuntimeDiagnosticsForTests();
    resetAssistantSupportAccordionForTests();
    vi.restoreAllMocks();
  });

  it("logs questions panel mounted once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrp128QuestionsPanelMounted();
    traceMrp128QuestionsPanelMounted();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[MRP128Runtime]\nQuestionsPanel mounted");
  });

  it("logs question injection with prompt text", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrp128QuestionInjected("What scenario should I compare?");
    expect(log.mock.calls[0]?.[0]).toBe(
      '[MRP128Runtime]\nQuestion injected\nquestion="What scenario should I compare?"'
    );
  });

  it("runtime open emits single-open contract", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    openAssistantSupportAccordionPanel("questions");
    openAssistantSupportAccordionPanel("insight");
    expect(log.mock.calls.some((call) => String(call[0]).includes("SingleOpenContract passed"))).toBe(true);
    expect(log.mock.calls.some((call) => String(call[0]).includes("openPanels=1"))).toBe(true);
    expect(ASSISTANT_PANEL_DOCK_DEFINITIONS.questions.icon).toBe("❓");
    expect(ASSISTANT_PANEL_DOCK_DEFINITIONS.questions.label).toBe("Executive Questions");
  });

  it("logs single-open contract directly", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrp128SingleOpenContractPassed(1);
    expect(log.mock.calls[0]?.[0]).toBe("[MRP128Runtime]\nSingleOpenContract passed\nopenPanels=1");
  });
});
