import { describe, expect, it } from "vitest";

import { buildExecutiveQuickActionsModel } from "./executiveQuickActionsTypes";

describe("executiveQuickActionsTypes", () => {
  it("builds context-aware analyze labels", () => {
    const system = buildExecutiveQuickActionsModel({ hasObjectSelection: false });
    expect(system.context.analyzeLabel).toBe("Analyze System");
    expect(system.actions.find((action) => action.id === "analyze")?.label).toBe("Analyze System");

    const object = buildExecutiveQuickActionsModel({ hasObjectSelection: true });
    expect(object.context.analyzeLabel).toBe("Analyze Object");
    expect(object.actions).toHaveLength(4);
  });

  it("supports disabled action flags", () => {
    const model = buildExecutiveQuickActionsModel({
      hasObjectSelection: true,
      disabledActions: { analyze: true },
    });
    expect(model.actions.find((action) => action.id === "analyze")?.disabled).toBe(true);
  });
});
