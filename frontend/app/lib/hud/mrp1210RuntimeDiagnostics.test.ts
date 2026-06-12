import { afterEach, describe, expect, it, vi } from "vitest";

import {
  resetMrp1210RuntimeDiagnosticsForTests,
  traceMrp1210TimelineCollapsed,
  traceMrp1210TimelineExpanded,
} from "./mrp1210RuntimeDiagnostics";

describe("mrp1210RuntimeDiagnostics", () => {
  afterEach(() => {
    resetMrp1210RuntimeDiagnosticsForTests();
    vi.restoreAllMocks();
  });

  it("logs timeline collapsed once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrp1210TimelineCollapsed();
    traceMrp1210TimelineCollapsed();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[MRP1210Runtime]\nTimelineCollapsed");
  });

  it("logs timeline expanded once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceMrp1210TimelineExpanded();
    traceMrp1210TimelineExpanded();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[MRP1210Runtime]\nTimelineExpanded");
  });
});
