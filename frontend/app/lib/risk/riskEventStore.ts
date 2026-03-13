const RISK_EVENTS_KEY = "statestudio.risk.events.v1";

export type RiskEvent = { ts: number; level: string; score: number; reasons: string[] };

export function loadRiskEvents(): RiskEvent[] {
  try {
    const raw = window.localStorage.getItem(RISK_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e) => e && typeof e.ts === "number") as RiskEvent[];
  } catch {
    return [];
  }
}

export function appendRiskEvent(ev: RiskEvent): RiskEvent[] {
  const next = [...loadRiskEvents(), ev].slice(-50);
  try {
    window.localStorage.setItem(RISK_EVENTS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function clearRiskEvents(): void {
  try {
    window.localStorage.removeItem(RISK_EVENTS_KEY);
  } catch {
    // ignore
  }
}
