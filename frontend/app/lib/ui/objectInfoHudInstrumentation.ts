const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logObjectHudMounted(): void {
  devLogOnce("object-hud-mounted", "[Nexora][E2:9][ObjectHudMounted]");
}

export function logObjectSelected(payload: { objectId: string }): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:9][ObjectSelected]", payload);
}

export function logObjectDeselected(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:9][ObjectDeselected]");
}

export function logObjectHudUpdated(payload: { objectId: string }): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `object-hud-updated-${payload.objectId}`;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.("[Nexora][E2:9][ObjectHudUpdated]", payload);
}

export function logObjectHudPositionResolved(payload: { side: "left" | "right"; objectId: string }): void {
  devLogOnce(
    `object-hud-position-${payload.objectId}-${payload.side}`,
    "[Nexora][E2:9][ObjectHudPositionResolved]",
    payload
  );
}

export function resetObjectInfoHudInstrumentationForTests(): void {
  loggedKeys.clear();
}
