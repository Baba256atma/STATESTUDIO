import type { WorkspaceViewMode } from "../workspace/workspaceViewModeTypes";
import { shouldSuppressIdleDebugLog } from "../runtime/idleRuntimeStabilityGuard";

export const TYPE_C_LOCKED_VIEW_MODE: WorkspaceViewMode = "3D";

let typeCViewModeLockArmed = false;
let loggedTypeCViewModeLock = false;

export function armTypeCViewModeLock(): void {
  typeCViewModeLockArmed = true;
}

export function resetTypeCViewModeLockForTests(): void {
  typeCViewModeLockArmed = false;
  loggedTypeCViewModeLock = false;
}

export function isTypeCManagerRoute(): boolean {
  if (typeof window === "undefined") return false;
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  return pathname === "/type-c";
}

export function isTypeCViewModeLocked(): boolean {
  return typeCViewModeLockArmed || isTypeCManagerRoute();
}

export function shouldHideTypeCViewModeToggle(): boolean {
  return isTypeCViewModeLocked();
}

export function normalizeWorkspaceViewModeForTypeC(input: {
  mode: WorkspaceViewMode;
  source: string;
}): { mode: WorkspaceViewMode; source: string; blocked: boolean } {
  if (!isTypeCViewModeLocked()) {
    return { mode: input.mode, source: input.source, blocked: false };
  }
  logTypeCViewModeLockOnce();
  if (input.mode === TYPE_C_LOCKED_VIEW_MODE) {
    return { mode: input.mode, source: input.source, blocked: false };
  }
  return {
    mode: TYPE_C_LOCKED_VIEW_MODE,
    source: `${input.source}:type_c_locked_to_executive_3d`,
    blocked: true,
  };
}

export function logTypeCViewModeLockOnce(): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedTypeCViewModeLock) return;
  if (shouldSuppressIdleDebugLog("type-c-view-mode-lock")) return;
  loggedTypeCViewModeLock = true;
  console.info("[Nexora][TypeCViewModeLock]", {
    route: "type-c",
    lockedMode: TYPE_C_LOCKED_VIEW_MODE,
    hiddenToggle: true,
    reason: "manager_tool_not_graphics_editor",
  });
}
