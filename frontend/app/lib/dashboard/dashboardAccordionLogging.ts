/**
 * Dashboard accordion diagnostic brakes (dev only, deduped).
 */

const accordionLogKeys = new Set<string>();

function shouldEmit(label: string, key: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const dedupeKey = `${label}:${key}`;
  if (accordionLogKeys.has(dedupeKey)) return false;
  accordionLogKeys.add(dedupeKey);
  return true;
}

export function reportDashboardAccordion(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.phase ?? "init"}:${payload.contextSignature ?? "none"}`;
  if (!shouldEmit("[Nexora][DashboardAccordion]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardAccordion]", payload);
}

export function reportAccordionPanel(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.panelId ?? "none"}:${payload.panelType ?? "unknown"}`;
  if (!shouldEmit("[Nexora][AccordionPanel]", key)) return;
  globalThis.console?.info?.("[Nexora][AccordionPanel]", payload);
}

export function reportPanelExpanded(payload: {
  panelId: string;
  panelType: string;
  contextSignature: string;
  expandedCount: number;
}): void {
  const key = `${payload.panelId}:${payload.contextSignature}`;
  if (!shouldEmit("[Nexora][PanelExpanded]", key)) return;
  globalThis.console?.info?.("[Nexora][PanelExpanded]", payload);
}

export function reportPanelCollapsed(payload: {
  panelId: string;
  panelType: string;
  contextSignature: string;
  expandedCount: number;
}): void {
  const key = `${payload.panelId}:${payload.contextSignature}`;
  if (!shouldEmit("[Nexora][PanelCollapsed]", key)) return;
  globalThis.console?.info?.("[Nexora][PanelCollapsed]", payload);
}

export function reportPanelPriority(payload: {
  panelId: string;
  panelType: string;
  priority: number;
  orderIndex: number;
  contextSignature: string;
}): void {
  const key = `${payload.panelId}:${payload.priority}:${payload.orderIndex}`;
  if (!shouldEmit("[Nexora][PanelPriority]", key)) return;
  globalThis.console?.info?.("[Nexora][PanelPriority]", payload);
}

export function reportDashboardAccordionRegistry(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.version ?? "unknown"}:${payload.panelCount ?? 0}`;
  if (!shouldEmit("[Nexora][DashboardAccordion]", `registry:${key}`)) return;
  globalThis.console?.info?.("[Nexora][DashboardAccordion]", { phase: "registry_loaded", ...payload });
}

export function resetDashboardAccordionLoggingForTests(): void {
  accordionLogKeys.clear();
}
