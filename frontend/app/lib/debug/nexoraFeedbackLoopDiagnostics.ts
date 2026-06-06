export type NexoraFeedbackLogInput = {
  source: string;
  objectId?: string | null;
  view?: string | null;
  contextId?: string | null;
  action?: string;
  writer?: string;
  stackDepth?: number;
  extra?: Record<string, unknown>;
};

function captureStack(depth = 6): string {
  if (process.env.NODE_ENV === "production") return "";
  const stack = new Error().stack;
  if (!stack) return "";
  return stack
    .split("\n")
    .slice(2, 2 + depth)
    .map((line) => line.trim())
    .join(" | ");
}

function logDev(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  console.debug(label, payload);
}

export function logNexoraSelectionWrite(input: NexoraFeedbackLogInput): void {
  logDev("[NEXORA_SELECTION_WRITE]", {
    source: input.source,
    objectId: input.objectId ?? null,
    action: input.action ?? "write",
    writer: input.writer ?? null,
    timestamp: Date.now(),
    stack: captureStack(input.stackDepth ?? 5),
    ...input.extra,
  });
}

export function logNexoraSelectionSource(input: NexoraFeedbackLogInput): void {
  logDev("[NEXORA_SELECTION_SOURCE]", {
    source: input.source,
    objectId: input.objectId ?? null,
    writer: input.writer ?? null,
    timestamp: Date.now(),
    stack: captureStack(input.stackDepth ?? 5),
    ...input.extra,
  });
}

export function logNexoraPanelRequest(input: NexoraFeedbackLogInput): void {
  logDev("[NEXORA_PANEL_REQUEST]", {
    source: input.source,
    objectId: input.objectId ?? null,
    view: input.view ?? null,
    contextId: input.contextId ?? null,
    action: input.action ?? "request",
    writer: input.writer ?? null,
    timestamp: Date.now(),
    stack: captureStack(input.stackDepth ?? 5),
    ...input.extra,
  });
}

export function logNexoraPanelMount(input: NexoraFeedbackLogInput): void {
  logDev("[NEXORA_PANEL_MOUNT]", {
    source: input.source,
    objectId: input.objectId ?? null,
    view: input.view ?? null,
    contextId: input.contextId ?? null,
    timestamp: Date.now(),
    ...input.extra,
  });
}

export function logNexoraPanelEffect(input: NexoraFeedbackLogInput): void {
  logDev("[NEXORA_PANEL_EFFECT]", {
    source: input.source,
    objectId: input.objectId ?? null,
    view: input.view ?? null,
    contextId: input.contextId ?? null,
    action: input.action ?? "effect",
    timestamp: Date.now(),
    stack: captureStack(input.stackDepth ?? 4),
    ...input.extra,
  });
}

export function logNexoraPanelSelectionWrite(input: NexoraFeedbackLogInput): void {
  logDev("[NEXORA_PANEL_SELECTION_WRITE]", {
    source: input.source,
    objectId: input.objectId ?? null,
    view: input.view ?? null,
    contextId: input.contextId ?? null,
    writer: input.writer ?? null,
    timestamp: Date.now(),
    stack: captureStack(input.stackDepth ?? 5),
    ...input.extra,
  });
}

export function logNexoraRenderCount(component: string, renderCount: number, extra?: Record<string, unknown>): void {
  logDev("[NEXORA_RENDER_COUNT]", {
    component,
    renderCount,
    timestamp: Date.now(),
    ...extra,
  });
}
