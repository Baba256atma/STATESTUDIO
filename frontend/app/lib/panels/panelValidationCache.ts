export type PanelValidationCacheValue = {
  data: unknown;
  contractFailed: boolean;
  contractDebugSignature: string;
  contractFailureDetail: {
    issueCount: number;
    issuePaths: string[];
    rejectedSlices: string[];
  } | null;
};

const PANEL_VALIDATION_CACHE = new Map<string, PanelValidationCacheValue>();
const PANEL_VALIDATION_CACHE_ORDER: string[] = [];
const MAX_PANEL_VALIDATION_CACHE_SIZE = 128;

let previousCacheKey: string | null = null;

const EXCLUDED_TOP_LEVEL_KEY_PATTERN =
  /time|timestamp|epoch|run|updated|generated|signature|trace|request|nonce|session|at$/i;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function hasPresentSlice(value: unknown): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function extractPanelShapeInput(input: unknown): Record<string, unknown> {
  if (!isObject(input)) return {};
  return {
    dashboard: input.dashboard ?? input.executiveSummary ?? input.decisionCockpit ?? null,
    advice: input.advice ?? input.strategicAdvice ?? null,
    timeline: input.timeline ?? null,
    simulation: input.simulation ?? input.decision_simulation ?? input.decisionSimulation ?? null,
    risk: input.risk ?? null,
    fragility: input.fragility ?? null,
    conflict: input.conflict ?? null,
    warRoom: input.warRoom ?? input.war_room ?? null,
    compare: input.compare ?? null,
    memory: input.memory ?? null,
    memoryEntries: input.memoryEntries ?? null,
    actions: input.actions ?? null,
    governance: input.governance ?? null,
    approval: input.approval ?? null,
    policy: input.policy ?? null,
    strategicCouncil: input.strategicCouncil ?? null,
  };
}

function presentTopLevelKeys(shape: Record<string, unknown>): string[] {
  const entries: Array<[string, unknown]> = [
    ["dashboard", shape.dashboard],
    ["advice", shape.advice],
    ["timeline", shape.timeline],
    ["simulation", shape.simulation],
    ["risk", shape.risk],
    ["fragility", shape.fragility],
    ["conflict", shape.conflict],
    ["warRoom", shape.warRoom],
    ["compare", shape.compare],
    ["memory", shape.memory],
    ["governance", shape.governance],
    ["approval", shape.approval],
    ["policy", shape.policy],
    ["strategicCouncil", shape.strategicCouncil],
    ["actions", shape.actions],
  ];
  return entries.filter(([, value]) => hasPresentSlice(value)).map(([key]) => key).sort();
}

function sliceArrayLength(value: unknown): number {
  if (value == null) return 0;
  if (Array.isArray(value)) return value.length;
  if (!isObject(value)) return 0;
  let total = 0;
  for (const entry of Object.values(value)) {
    if (Array.isArray(entry)) total += entry.length;
  }
  return total;
}

function countFragilityDrivers(fragility: unknown): number {
  if (!isObject(fragility)) return 0;
  const drivers = fragility.drivers;
  if (Array.isArray(drivers)) return drivers.length;
  if (isObject(drivers)) return Object.keys(drivers).length;
  return 0;
}

function countActions(shape: Record<string, unknown>): number {
  const actions = shape.actions;
  return Array.isArray(actions) ? actions.length : 0;
}

function shouldIncludeMemoryEntryCount(shape: Record<string, unknown>): boolean {
  return hasPresentSlice(shape.memory) || hasPresentSlice(shape.memoryEntries);
}

export type PanelValidationCacheShape = {
  topLevelKeys: string[];
  actionsCount: number;
  dashboardArrayLength: number;
  adviceArrayLength: number;
  timelineArrayLength: number;
  simulationArrayLength: number;
  riskArrayLength: number;
  fragilityDriversCount: number;
  memoryEntryCount?: number;
};

export function buildPanelValidationCacheShape(input: unknown): PanelValidationCacheShape {
  const shape = extractPanelShapeInput(input);
  const cacheShape: PanelValidationCacheShape = {
    topLevelKeys: presentTopLevelKeys(shape),
    actionsCount: countActions(shape),
    dashboardArrayLength: sliceArrayLength(shape.dashboard),
    adviceArrayLength: sliceArrayLength(shape.advice),
    timelineArrayLength: sliceArrayLength(shape.timeline),
    simulationArrayLength: sliceArrayLength(shape.simulation),
    riskArrayLength: sliceArrayLength(shape.risk),
    fragilityDriversCount: countFragilityDrivers(shape.fragility),
  };
  if (shouldIncludeMemoryEntryCount(shape)) {
    cacheShape.memoryEntryCount = Array.isArray(shape.memoryEntries) ? shape.memoryEntries.length : 0;
  }
  return cacheShape;
}

export function buildPanelValidationCacheKey(input: unknown): string {
  return JSON.stringify(buildPanelValidationCacheShape(input));
}

export function diffPanelValidationCacheKeyParts(
  previousKey: string | null,
  nextKey: string
): string[] {
  if (!previousKey) return ["initial"];
  try {
    const previous = JSON.parse(previousKey) as Record<string, unknown>;
    const next = JSON.parse(nextKey) as Record<string, unknown>;
    const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);
    const changed: string[] = [];
    keys.forEach((key) => {
      if (JSON.stringify(previous[key]) !== JSON.stringify(next[key])) {
        changed.push(key);
      }
    });
    return changed.length > 0 ? changed : ["none"];
  } catch {
    return ["unparseable"];
  }
}

export function logPanelValidationCacheLookup(cacheKey: string, cacheHit: boolean): void {
  if (process.env.NODE_ENV === "production") return;
  const changedParts = diffPanelValidationCacheKeyParts(previousCacheKey, cacheKey);
  console.debug("[Nexora][PanelValidationCacheKey]", {
    cacheKey,
    previousCacheKey,
    cacheHit,
    changedParts,
  });
  previousCacheKey = cacheKey;
}

export function getPanelValidationCacheEntry(
  cacheKey: string
): PanelValidationCacheValue | null {
  return PANEL_VALIDATION_CACHE.get(cacheKey) ?? null;
}

export function setPanelValidationCacheEntry(
  cacheKey: string,
  value: PanelValidationCacheValue
): void {
  if (PANEL_VALIDATION_CACHE.has(cacheKey)) {
    const index = PANEL_VALIDATION_CACHE_ORDER.indexOf(cacheKey);
    if (index >= 0) {
      PANEL_VALIDATION_CACHE_ORDER.splice(index, 1);
    }
  }
  PANEL_VALIDATION_CACHE.set(cacheKey, value);
  PANEL_VALIDATION_CACHE_ORDER.push(cacheKey);
  while (PANEL_VALIDATION_CACHE_ORDER.length > MAX_PANEL_VALIDATION_CACHE_SIZE) {
    const evicted = PANEL_VALIDATION_CACHE_ORDER.shift();
    if (evicted) {
      PANEL_VALIDATION_CACHE.delete(evicted);
    }
  }
}

export function resetPanelValidationCacheForTests(): void {
  PANEL_VALIDATION_CACHE.clear();
  PANEL_VALIDATION_CACHE_ORDER.length = 0;
  previousCacheKey = null;
}

/** @deprecated Prefer buildPanelValidationCacheKey — kept for callers filtering volatile keys. */
export function isVolatilePanelCacheField(key: string): boolean {
  return EXCLUDED_TOP_LEVEL_KEY_PATTERN.test(key);
}
