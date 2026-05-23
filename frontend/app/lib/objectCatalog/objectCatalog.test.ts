import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  getAllCatalogObjectDefinitions,
  getCatalogObjectsByCategory,
  requestCloseObjectCatalog,
  requestOpenObjectCatalog,
  searchCatalogObjects,
} from "./objectCatalogRuntime";
import { resetObjectCatalogRegistryForTests } from "./objectCatalogRegistry";
import { resetObjectCatalogInstrumentationForTests } from "./objectCatalogInstrumentation";

describe("objectCatalogRuntime", () => {
  beforeEach(() => {
    resetObjectCatalogRegistryForTests();
    resetObjectCatalogInstrumentationForTests();
    if (typeof globalThis.window === "undefined") {
      (globalThis as typeof globalThis & { window: Window }).window = {
        dispatchEvent: () => true,
      } as unknown as Window;
    }
    vi.spyOn(window, "dispatchEvent").mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers starter categories and objects", () => {
    expect(getAllCatalogObjectDefinitions().length).toBeGreaterThanOrEqual(21);
    expect(getCatalogObjectsByCategory("operations").map((item) => item.label)).toContain("Supplier");
    expect(getCatalogObjectsByCategory("finance").map((item) => item.label)).toContain("Budget");
    expect(getCatalogObjectsByCategory("project").map((item) => item.label)).toContain("Project");
    expect(getCatalogObjectsByCategory("strategy").map((item) => item.label)).toContain("Risk");
  });

  it("searches catalog objects by label and category", () => {
    const supplier = searchCatalogObjects("supplier");
    expect(supplier.matches.some((item) => item.label === "Supplier")).toBe(true);

    const risk = searchCatalogObjects("risk");
    expect(risk.matches.some((item) => item.category === "strategy")).toBe(true);
  });

  it("dispatches catalog open and close events", () => {
    requestOpenObjectCatalog("scene_panel");
    requestCloseObjectCatalog("catalog_ui");
    expect(window.dispatchEvent).toHaveBeenCalledTimes(2);
    const openEvent = vi.mocked(window.dispatchEvent).mock.calls[0]?.[0] as CustomEvent;
    expect(openEvent.type).toBe("nexora:object-catalog-open");
    expect(openEvent.detail.source).toBe("scene_panel");
  });
});
