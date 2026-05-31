const emitted = new Set<string>();

function emit(tag: string, payload: unknown): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${tag}:${JSON.stringify(payload)}`;
  if (emitted.has(key)) return;
  emitted.add(key);
  console.info(tag, payload);
}

export function logExecutiveOrientation(event: string, payload: unknown): void {
  emit("[Nexora][Orientation]", { event, ...(payload as object) });
}

export function logExecutiveFirstImpression(event: string, payload: unknown): void {
  emit("[Nexora][FirstImpression]", { event, ...(payload as object) });
}

export function logSituationalAwareness(event: string, payload: unknown): void {
  emit("[Nexora][SituationalAwareness]", { event, ...(payload as object) });
}

export function logExecutiveQuickStart(event: string, payload: unknown): void {
  emit("[Nexora][QuickStart]", { event, ...(payload as object) });
}

export function logWorkspaceMeaning(event: string, payload: unknown): void {
  emit("[Nexora][WorkspaceMeaning]", { event, ...(payload as object) });
}

export function logProgressiveDisclosure(event: string, payload: unknown): void {
  emit("[Nexora][ProgressiveDisclosure]", { event, ...(payload as object) });
}

export function resetExecutiveOrientationInstrumentationForTests(): void {
  emitted.clear();
}
