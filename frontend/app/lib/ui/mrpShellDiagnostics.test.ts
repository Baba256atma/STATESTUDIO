import { afterEach, describe, expect, it, vi } from "vitest";

import {
  resetMrpShellDiagnosticsForTests,
  traceMrpCleanHeader,
  traceMrpCollapseControlMounted,
  traceMrpCollapseControlRelocatedToHeader,
  traceMrpDuplicateCollapseControlsRemoved,
  traceMrpTabRenameDashboardToInsight,
  traceMrpTabsMounted,
} from "./mrpShellDiagnostics";

describe("mrpShellDiagnostics", () => {
  afterEach(() => {
    resetMrpShellDiagnosticsForTests();
    vi.restoreAllMocks();
  });

  it("logs clean header once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrpCleanHeader();
    traceMrpCleanHeader();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraMRP]\nheader=clean\nprimaryDecision=removed");
  });

  it("logs collapse control once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrpCollapseControlMounted();
    traceMrpCollapseControlMounted();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraMRP]\ncollapseControl=mounted");
  });

  it("logs tabs once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrpTabsMounted();
    traceMrpTabsMounted();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraMRP]\ntabs=mounted");
  });

  it("logs dashboard to insight rename once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrpTabRenameDashboardToInsight();
    traceMrpTabRenameDashboardToInsight();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraMRP]\ntabRename=dashboard_to_insight");
  });

  it("logs collapse control relocation once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrpCollapseControlRelocatedToHeader();
    traceMrpCollapseControlRelocatedToHeader();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraMRP]\ncollapseControl=relocated_to_header");
  });

  it("logs duplicate collapse removal once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrpDuplicateCollapseControlsRemoved();
    traceMrpDuplicateCollapseControlsRemoved();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraMRP]\nduplicateCollapseControls=removed");
  });
});
