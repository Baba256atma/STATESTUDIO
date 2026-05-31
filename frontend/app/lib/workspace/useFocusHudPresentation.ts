"use client";

import { useSyncExternalStore } from "react";

import {
  getExecutiveFocusModeServerSnapshot,
  getExecutiveFocusModeSnapshot,
  subscribeExecutiveFocusMode,
} from "../workspace/executiveFocusModeRuntime";
import { resolveFocusHudVisibility, type FocusHudPresentation } from "../workspace/focusHudVisibilityRuntime";
import type { FocusHudPanelId } from "../workspace/focusModeProfiles";

export function useFocusHudPresentation(
  panelId: FocusHudPanelId,
  layoutVisible: boolean
): FocusHudPresentation {
  const focus = useSyncExternalStore(
    subscribeExecutiveFocusMode,
    getExecutiveFocusModeSnapshot,
    getExecutiveFocusModeServerSnapshot
  );

  return resolveFocusHudVisibility({
    focusEnabled: focus.enabled,
    profileId: focus.profile,
    panelId,
    layoutVisible,
  });
}

export default useFocusHudPresentation;
