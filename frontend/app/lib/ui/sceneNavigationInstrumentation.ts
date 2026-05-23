const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

function devLogEvent(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.(event, payload ?? {});
}

export function logSceneNavigationToolbarMounted(): void {
  devLogOnce("scene-navigation-toolbar-mounted", "[Nexora][ToolbarMounted]");
}

export function logSceneNavigationToolbarAction(payload: {
  action: string;
  source: string;
  selectedObjectId?: string | null;
  camera?: Record<string, unknown>;
}): void {
  devLogEvent("[Nexora][ToolbarAction]", payload);
}

export function logSceneNavigationCameraFocus(payload: {
  objectId: string;
  source: string;
  selectedObjectId?: string | null;
  camera?: Record<string, unknown>;
}): void {
  devLogEvent("[Nexora][CameraFocus]", payload);
}

export function logSceneNavigationCameraReset(payload: {
  source: string;
  camera?: Record<string, unknown>;
}): void {
  devLogEvent("[Nexora][CameraReset]", payload);
}

export function logSceneNavigationFitScene(payload: {
  source: string;
  camera?: Record<string, unknown>;
}): void {
  devLogEvent("[Nexora][FitScene]", payload);
}

export function logSceneNavigationPresetSelected(payload: {
  presetId: string;
  source: string;
}): void {
  devLogEvent("[Nexora][PresetSelected]", payload);
}

export function resetSceneNavigationInstrumentationForTests(): void {
  loggedKeys.clear();
}
