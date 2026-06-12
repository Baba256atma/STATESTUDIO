import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  MRP_COLLAPSE_BUTTON_WIDTH,
  MRP_HEADER_CONTROL_HEIGHT,
  MRP_HEADER_INSET,
  resetMainRightPanelHeaderContractForTests,
  resolveMrpHeaderInset,
  resolveMrpHeaderVerticalProbe,
  traceNexoraMRPHeader,
  validateMrpHeaderVerticalAlignment,
} from "./mainRightPanelHeaderContract";

describe("mainRightPanelHeaderContract", () => {
  beforeEach(() => {
    resetMainRightPanelHeaderContractForTests();
  });

  it("uses unified 4px header inset for all controls", () => {
    expect(MRP_HEADER_INSET).toBe(4);
    expect(resolveMrpHeaderInset()).toBe(4);
    expect(MRP_HEADER_CONTROL_HEIGHT).toBe(32);
    expect(MRP_COLLAPSE_BUTTON_WIDTH).toBe(28);

    const probe = resolveMrpHeaderVerticalProbe();
    expect(probe.insightTop).toBe(4);
    expect(probe.assistantTop).toBe(4);
    expect(probe.collapseTop).toBe(4);
    expect(probe.insightBottom).toBe(4);
    expect(probe.assistantBottom).toBe(4);
    expect(probe.collapseBottom).toBe(4);
    expect(validateMrpHeaderVerticalAlignment(probe)).toBe(true);
  });

  it("logs NexoraMRPHeader diagnostics and brakes on mismatch", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    traceNexoraMRPHeader();
    expect(log.mock.calls.some((call) => String(call[0]).includes("[NexoraMRPHeader] headerInset=4"))).toBe(true);
    expect(log.mock.calls.some((call) => String(call[0]).includes("verticalAlignment=true"))).toBe(true);

    resetMainRightPanelHeaderContractForTests();
    traceNexoraMRPHeader({
      insightTop: 4,
      assistantTop: 4,
      collapseTop: 8,
      insightBottom: 4,
      assistantBottom: 4,
      collapseBottom: 4,
    });
    expect(warn.mock.calls.some((call) => String(call[0]).includes("header_alignment_mismatch"))).toBe(true);

    log.mockRestore();
    warn.mockRestore();
  });
});
