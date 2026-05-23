const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logExecutiveTimelineMounted(): void {
  devLogOnce("timeline-mounted", "[Nexora][E2:10][TimelineMounted]");
}

export function logExecutiveTimelineRendered(payload: { eventCount: number; signature: string }): void {
  devLogOnce(`timeline-rendered-${payload.signature}`, "[Nexora][E2:10][TimelineRendered]", payload);
}

export function logExecutiveTimelineEventFocused(payload: { eventId: string; title: string }): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `timeline-focus-${payload.eventId}`;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.("[Nexora][E2:10][TimelineEventFocused]", payload);
}

export function logExecutiveTimelineReplayRequested(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:10][TimelineReplayRequested]");
}

export function logExecutiveTimelineStateUpdated(payload: { signature: string; eventCount: number }): void {
  devLogOnce(
    `timeline-state-${payload.signature}`,
    "[Nexora][E2:10][TimelineStateUpdated]",
    payload
  );
}

export function resetExecutiveTimelineHudInstrumentationForTests(): void {
  loggedKeys.clear();
}
