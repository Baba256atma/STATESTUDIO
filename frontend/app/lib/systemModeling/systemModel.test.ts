import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  generateSystemFromTemplate,
  readSystemBlueprint,
  buildTemplatePreview,
} from "./systemModelRuntime";
import { resetTemplateRegistryForTests } from "./templateRegistry";
import { resetSystemModelInstrumentationForTests } from "./systemModelInstrumentation";
import { getAllDomainTemplates } from "./templateLoader";
import type { SceneJson } from "../sceneTypes";

const baseScene: SceneJson = {
  state_vector: {},
  scene: {
    objects: [],
    loops: [],
    relationships: [],
  },
};

describe("systemModelRuntime", () => {
  beforeEach(() => {
    resetTemplateRegistryForTests();
    resetSystemModelInstrumentationForTests();
    vi.spyOn(globalThis.console, "info").mockImplementation(() => undefined);
  });

  it("registers four executive domain templates", () => {
    const templates = getAllDomainTemplates();
    expect(templates.length).toBe(4);
    expect(templates.map((template) => template.category)).toEqual(
      expect.arrayContaining(["supply_chain", "pmo", "finance", "operations"])
    );
  });

  it("builds template preview without scene mutation", () => {
    const preview = buildTemplatePreview("supply_chain_visibility");
    expect(preview?.objectCount).toBe(6);
    expect(preview?.relationshipCount).toBe(5);
  });

  it("generates objects, relationships, and blueprint metadata", () => {
    const result = generateSystemFromTemplate({
      currentScene: baseScene,
      templateId: "finance_system",
    });
    expect(result.success).toBe(true);
    expect(result.createdObjectIds?.length).toBe(6);
    expect(result.createdRelationshipIds?.length).toBe(5);
    const blueprint = readSystemBlueprint(result.nextScene);
    expect(blueprint?.templateId).toBe("finance_system");
    expect(blueprint?.source).toBe("template");
  });
});
