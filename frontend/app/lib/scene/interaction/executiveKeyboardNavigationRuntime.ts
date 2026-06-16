import {
  requestGlobalSceneReset,
  requestSceneNavigationAction,
  focusObject,
} from "../sceneNavigationContract";
import {
  logExecutiveInteractionFocus,
  logExecutiveInteractionSelection,
} from "./executiveInteractionDiagnostics";
import { patchExecutiveInteractionState } from "./executiveInteractionStateRuntime";

export type ExecutiveKeyboardNavigationAction =
  | "fit_scene"
  | "global_view"
  | "clear_focus";

function isTypingTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) return false;
  const tag = element.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if ((element as { isContentEditable?: boolean }).isContentEditable) return true;
  if ((element as { id?: string }).id === "nexora-chat-input") return true;
  const closest = (element as { closest?: (selector: string) => Element | null }).closest;
  if (typeof closest === "function") {
    return Boolean(
      closest.call(
        element,
        '[data-hud="chat"], #nexora-chat-input, [contenteditable="true"], [role="textbox"]'
      )
    );
  }
  return false;
}

export function resolveExecutiveKeyboardNavigationAction(
  event: KeyboardEvent
): ExecutiveKeyboardNavigationAction | null {
  if (event.metaKey || event.ctrlKey || event.altKey) return null;
  if (isTypingTarget(event.target)) return null;

  const key = event.key.toLowerCase();
  if (key === "f") return "fit_scene";
  if (key === "g") return "global_view";
  if (key === "escape") return "clear_focus";
  return null;
}

export function handleExecutiveKeyboardNavigation(
  event: KeyboardEvent,
  callbacks?: {
    clearSelection?: () => void;
  }
): boolean {
  const action = resolveExecutiveKeyboardNavigationAction(event);
  if (!action) return false;

  if (action === "fit_scene") {
    requestSceneNavigationAction("fit_scene", "keyboard");
    return true;
  }
  if (action === "global_view") {
    requestGlobalSceneReset("keyboard");
    return true;
  }
  if (action === "clear_focus") {
    callbacks?.clearSelection?.();
    patchExecutiveInteractionState({
      selectedObjectId: null,
      focusedObjectId: null,
    });
    logExecutiveInteractionSelection("cleared:keyboard", { source: "keyboard" });
    logExecutiveInteractionFocus("cleared:keyboard", { source: "keyboard" });
    return true;
  }
  return false;
}

export function focusExecutiveObjectFromInteraction(
  objectId: string,
  source: "scene" | "keyboard" | "panel" = "scene"
): void {
  const trimmed = objectId.trim();
  if (!trimmed) return;
  patchExecutiveInteractionState({
    selectedObjectId: trimmed,
    focusedObjectId: trimmed,
  });
  focusObject(trimmed, source === "scene" ? "panel" : source, { animate: true });
  logExecutiveInteractionFocus(`object:${trimmed}`, { objectId: trimmed, source });
  logExecutiveInteractionSelection(`object:${trimmed}`, { objectId: trimmed, source });
}
