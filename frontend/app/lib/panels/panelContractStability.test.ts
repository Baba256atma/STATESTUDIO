import { beforeEach, describe, expect, it } from "vitest";
import {
  isMeaningfullyDifferentContract,
  resetPanelContractStabilityForTests,
} from "./panelContractStability";

describe("panelContractStability", () => {
  beforeEach(() => {
    resetPanelContractStabilityForTests();
  });

  it("treats first salvage as meaningful", () => {
    expect(
      isMeaningfullyDifferentContract({
        contractSignature: "sig-1",
        salvagedOutputSignature: "out-1",
        priorOutputSignature: null,
      })
    ).toBe(true);
  });

  it("skips when salvaged output and preserved slices are unchanged", () => {
    expect(
      isMeaningfullyDifferentContract({
        contractSignature: "sig-1",
        salvagedOutputSignature: "out-1",
        priorOutputSignature: "out-1",
        preservedSlices: { analysis_summary: true, approval: true },
        priorPreservedSlices: { analysis_summary: true, approval: true },
      })
    ).toBe(false);
  });

  it("detects preserved slice changes", () => {
    expect(
      isMeaningfullyDifferentContract({
        contractSignature: "sig-1",
        salvagedOutputSignature: "out-1",
        priorOutputSignature: "out-1",
        preservedSlices: { analysis_summary: true, approval: false },
        priorPreservedSlices: { analysis_summary: true, approval: true },
      })
    ).toBe(true);
  });
});
