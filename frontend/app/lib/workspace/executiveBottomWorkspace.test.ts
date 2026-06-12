import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getBottomWorkspaceState,
  resetExecutiveBottomWorkspaceForTests,
  selectBottomWorkspaceTimelineEvent,
  toggleBottomWorkspace,
} from "./executiveBottomWorkspace";

describe("executiveBottomWorkspace timeline display state", () => {
  afterEach(() => {
    resetExecutiveBottomWorkspaceForTests();
    vi.restoreAllMocks();
  });

  it("toggles compact and expanded only", () => {
    expect(getBottomWorkspaceState().heightMode).toBe("expanded");
    toggleBottomWorkspace();
    expect(getBottomWorkspaceState().heightMode).toBe("compact");
    toggleBottomWorkspace();
    expect(getBottomWorkspaceState().heightMode).toBe("expanded");
  });

  it("preserves selection when compacting", () => {
    selectBottomWorkspaceTimelineEvent("event-42");
    toggleBottomWorkspace();
    expect(getBottomWorkspaceState().selectedTimelineEvent).toBe("event-42");
    toggleBottomWorkspace();
    expect(getBottomWorkspaceState().selectedTimelineEvent).toBe("event-42");
  });

  it("emits MRP1210 and MRP131 runtime traces on toggle", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    toggleBottomWorkspace();
    toggleBottomWorkspace();
    expect(log.mock.calls.some((call) => String(call[0]).includes("TimelineCompact"))).toBe(true);
    expect(log.mock.calls.some((call) => String(call[0]).includes("TimelineExpanded"))).toBe(true);
  });
});
