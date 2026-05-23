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

export function logOverlayRegistered(payload: {
  overlayId: string;
  overlayType: string;
  sourceObjects: string[];
  targetObjects: string[];
  reason: string;
}): void {
  devLogOnce(`overlay-registered-${payload.overlayId}`, "[Nexora][OverlayRegistered]", payload);
}

export function logOverlayActivated(payload: {
  overlayId: string;
  overlayType: string;
  sourceObjects: string[];
  targetObjects: string[];
  reason: string;
}): void {
  devLogEvent("[Nexora][OverlayActivated]", payload);
}

export function logOverlayRemoved(payload: {
  overlayId: string;
  overlayType: string;
  reason: string;
}): void {
  devLogEvent("[Nexora][OverlayRemoved]", payload);
}

export function logPropagationOverlayRendered(payload: Record<string, unknown>): void {
  devLogOnce(`propagation-rendered-${payload.edgeCount ?? 0}`, "[Nexora][PropagationRendered]", payload);
}

export function logRiskFlowOverlayRendered(payload: Record<string, unknown>): void {
  devLogOnce(`risk-flow-rendered-${payload.edgeCount ?? 0}`, "[Nexora][RiskFlowRendered]", payload);
}

export function logScenarioOverlayRendered(payload: Record<string, unknown>): void {
  devLogOnce(`scenario-rendered-${payload.edgeCount ?? 0}`, "[Nexora][ScenarioRendered]", payload);
}

export function logOverlayVisibilityChanged(payload: {
  overlayType: string;
  visible: boolean;
  reason: string;
}): void {
  devLogEvent("[Nexora][OverlayVisibilityChanged]", payload);
}

export function logOverlayRuntimeSnapshotCreated(payload: {
  propagation: boolean;
  risk_flow: boolean;
  scenario: boolean;
  dependency: boolean;
}): void {
  devLogEvent("[Nexora][OverlayRuntime][SnapshotCreated]", payload);
}

export function logOverlayRuntimeSubscriberNotify(payload?: { listenerCount: number }): void {
  devLogEvent("[Nexora][OverlayRuntime][SubscriberNotify]", payload ?? {});
}

export function logOverlayRuntimeVisibilityChanged(payload: {
  propagation: boolean;
  risk_flow: boolean;
  scenario: boolean;
  dependency: boolean;
}): void {
  devLogEvent("[Nexora][OverlayRuntime][VisibilityChanged]", payload);
}

export function resetOverlayInstrumentationForTests(): void {
  loggedKeys.clear();
}
