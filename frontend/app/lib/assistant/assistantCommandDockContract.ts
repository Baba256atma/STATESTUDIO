import type { ExecutiveWorkspaceId } from "../dashboard/executiveWorkspaceRegistryContract.ts";

/** MRP:12:5 — Executive Command Dock actions (workspace routing only). */
export type AssistantCommandDockAction =
  | "analyze"
  | "compare"
  | "scenario"
  | "war_room"
  | "risk"
  | "explain";

export type AssistantCommandDockPriority = "primary" | "secondary" | "future";

export type AssistantCommandDockCommand = Readonly<{
  id: AssistantCommandDockAction;
  label: string;
  icon: string;
  workspaceId: ExecutiveWorkspaceId | null;
  priority: AssistantCommandDockPriority;
  disabled?: boolean;
}>;

export const EXECUTIVE_COMMAND_DOCK_COMMANDS: readonly AssistantCommandDockCommand[] = Object.freeze([
  {
    id: "analyze",
    label: "Analyze",
    icon: "⌕",
    workspaceId: "analyze",
    priority: "primary",
  },
  {
    id: "compare",
    label: "Compare",
    icon: "⇄",
    workspaceId: "compare",
    priority: "primary",
  },
  {
    id: "scenario",
    label: "Scenario",
    icon: "◎",
    workspaceId: "scenario",
    priority: "secondary",
  },
  {
    id: "war_room",
    label: "War Room",
    icon: "⚑",
    workspaceId: "war_room",
    priority: "secondary",
  },
  {
    id: "risk",
    label: "Risk",
    icon: "◆",
    workspaceId: "risk",
    priority: "future",
    disabled: true,
  },
]);

export function resolveAssistantCommandDockWorkspaceId(
  action: AssistantCommandDockAction
): ExecutiveWorkspaceId | null {
  const command = EXECUTIVE_COMMAND_DOCK_COMMANDS.find((entry) => entry.id === action);
  return command?.workspaceId ?? null;
}

export function listExecutiveCommandDockPrimaryCommands(): readonly AssistantCommandDockCommand[] {
  return EXECUTIVE_COMMAND_DOCK_COMMANDS.filter((entry) => entry.priority === "primary");
}

export function listExecutiveCommandDockVisibleCommands(): readonly AssistantCommandDockCommand[] {
  return EXECUTIVE_COMMAND_DOCK_COMMANDS.filter((entry) => entry.priority === "primary" || entry.priority === "secondary");
}
