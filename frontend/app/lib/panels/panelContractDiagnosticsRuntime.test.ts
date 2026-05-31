import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  flushPanelContractDiagnostics,
  hasEmittedPanelContractSalvage,
  queuePanelContractSalvageDiagnostic,
  resetPanelContractDiagnosticsForTests,
} from "./panelContractDiagnosticsRuntime";

describe("panelContractDiagnosticsRuntime", () => {
  beforeEach(() => {
    resetPanelContractDiagnosticsForTests();
    vi.restoreAllMocks();
    vi.spyOn(globalThis.console, "warn").mockImplementation(() => {});
  });

  it("defers salvage diagnostics out of the synchronous call path", () => {
    queuePanelContractSalvageDiagnostic({
      signature: "sig-1",
      contractSignature: "sig-1",
      payload: { headline: true },
      previousContractSignature: null,
      repeatedSalvage: false,
    });
    expect(hasEmittedPanelContractSalvage("sig-1")).toBe(false);
    flushPanelContractDiagnostics();
    expect(hasEmittedPanelContractSalvage("sig-1")).toBe(true);
    expect(globalThis.console.warn).toHaveBeenCalledTimes(1);
  });

  it("dedupes salvage diagnostics by contract signature", () => {
    const diagnostic = {
      signature: "sig-2",
      contractSignature: "sig-2",
      payload: { approval: true },
      previousContractSignature: null,
      repeatedSalvage: false,
    };
    queuePanelContractSalvageDiagnostic(diagnostic);
    queuePanelContractSalvageDiagnostic(diagnostic);
    flushPanelContractDiagnostics();
    expect(globalThis.console.warn).toHaveBeenCalledTimes(1);
  });
});
