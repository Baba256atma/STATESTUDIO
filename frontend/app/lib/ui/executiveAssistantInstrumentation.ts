const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logExecutiveAssistantMounted(): void {
  devLogOnce("assistant-mounted", "[Nexora][E2:12][AssistantMounted]");
}

export function logExecutiveAssistantMessageRendered(messageId: string): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `message-${messageId}`;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.("[Nexora][E2:12][AssistantMessageRendered]", { messageId });
}

export function logExecutiveAssistantSuggestionSelected(payload: {
  kind: "action" | "question";
  id: string;
  label: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:12][AssistantSuggestionSelected]", payload);
}

export function logExecutiveAssistantCollapsed(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:12][AssistantCollapsed]");
}

export function logExecutiveAssistantExpanded(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:12][AssistantExpanded]");
}

export function logExecutiveAssistantThemeResolved(mode: "day" | "night"): void {
  devLogOnce(`theme-${mode}`, "[Nexora][E2:12][AssistantThemeResolved]", { mode });
}

export function resetExecutiveAssistantInstrumentationForTests(): void {
  loggedKeys.clear();
}
