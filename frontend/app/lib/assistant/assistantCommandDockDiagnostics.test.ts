import { afterEach, describe, expect, it, vi } from "vitest";

import {
  EXECUTIVE_COMMAND_DOCK_COMMANDS,
  listExecutiveCommandDockVisibleCommands,
  resolveAssistantCommandDockWorkspaceId,
} from "./assistantCommandDockContract";
import {
  resetExecutiveCommandDockDiagnosticsForTests,
  traceExecutiveCommandDockAction,
  traceExecutiveCommandDockMounted,
} from "./assistantCommandDockDiagnostics";

describe("assistantCommandDockContract", () => {
  it("maps primary commands to existing workspace ids", () => {
    expect(resolveAssistantCommandDockWorkspaceId("analyze")).toBe("analyze");
    expect(resolveAssistantCommandDockWorkspaceId("compare")).toBe("compare");
    expect(resolveAssistantCommandDockWorkspaceId("scenario")).toBe("scenario");
    expect(resolveAssistantCommandDockWorkspaceId("war_room")).toBe("war_room");
  });

  it("exposes four active dock commands", () => {
    const visible = listExecutiveCommandDockVisibleCommands();
    expect(visible.map((entry) => entry.id)).toEqual(["analyze", "compare", "scenario", "war_room"]);
    expect(EXECUTIVE_COMMAND_DOCK_COMMANDS.find((entry) => entry.id === "risk")?.disabled).toBe(true);
  });
});

describe("assistantCommandDockDiagnostics", () => {
  afterEach(() => {
    resetExecutiveCommandDockDiagnosticsForTests();
    vi.restoreAllMocks();
  });

  it("logs mount once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceExecutiveCommandDockMounted();
    traceExecutiveCommandDockMounted();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraCommandDock]\nstatus=mounted");
  });

  it("logs workspace actions", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceExecutiveCommandDockAction("analyze");
    traceExecutiveCommandDockAction("war_room");
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraCommandDock]\naction=analyze");
    expect(log.mock.calls[1]?.[0]).toBe("[NexoraCommandDock]\naction=war_room");
  });
});
