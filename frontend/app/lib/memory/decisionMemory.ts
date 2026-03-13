import type { MemoryStateV1, MemoryUpdateInput, ObjectMemory, LoopMemory } from "./memoryTypes";

export function safeNumber(n: any, fallback: number): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function createInitialMemoryState(): MemoryStateV1 {
  const now = Date.now();
  return {
    version: "1",
    savedAt: new Date(now).toISOString(),
    objects: {},
    loops: {},
    globals: { temperature: 0.2, decay: 0.06 },
  };
}

function getObjectMemory(prev: MemoryStateV1, id: string, now: number): ObjectMemory {
  const existing = prev.objects[id];
  if (existing) return existing;
  return {
    id,
    stress: 0.15,
    confidence: 0.5,
    volatility: 0.1,
    lastUpdated: now,
  };
}

function getLoopMemory(prev: MemoryStateV1, id: string, now: number): LoopMemory {
  const existing = prev.loops[id];
  if (existing) return existing;
  return {
    id,
    momentum: 0.15,
    instability: 0.1,
    lastUpdated: now,
  };
}

function actionTouchesObject(action: any): string | null {
  if (!action || typeof action !== "object") return null;
  const target = typeof action.target === "string" ? action.target : null;
  return target;
}

function isStabilizing(action: any): boolean {
  if (!action || typeof action !== "object") return false;
  if (action.type === "SET_OBJECT_OPACITY") {
    const opacity = (action.payload as any)?.opacity;
    return typeof opacity === "number" && opacity >= 0.6;
  }
  if (action.type === "SET_OBJECT_SCALE") {
    const multiplier = (action.payload as any)?.multiplier;
    return typeof multiplier === "number" && multiplier < 1;
  }
  if (action.type === "SET_OBJECT_COLOR") return true;
  return false;
}

function isIntense(action: any): boolean {
  if (!action || typeof action !== "object") return false;
  if (action.type === "SET_OBJECT_SCALE") {
    const multiplier = (action.payload as any)?.multiplier;
    return typeof multiplier === "number" && multiplier > 1;
  }
  if (action.type === "SET_OBJECT_OPACITY") {
    const opacity = (action.payload as any)?.opacity;
    return typeof opacity === "number" && opacity < 0.5;
  }
  if (action.type === "SET_OBJECT_COLOR") return true;
  return false;
}

export function updateMemory(prev: MemoryStateV1, input: MemoryUpdateInput): MemoryStateV1 {
  const now = safeNumber(input.now, Date.now());
  const decay = clamp01(safeNumber(prev.globals.decay, 0.06));
  const actions = Array.isArray(input.actions) ? input.actions : [];
  const nextObjects: Record<string, ObjectMemory> = { ...prev.objects };
  const nextLoops: Record<string, LoopMemory> = { ...prev.loops };

  const touchedIds = new Set<string>();
  let multiObjectUpdates = 0;

  actions.forEach((action) => {
    const target = actionTouchesObject(action);
    if (!target) return;
    touchedIds.add(target);
    multiObjectUpdates += 1;

    const cur = getObjectMemory(prev, target, now);
    const dt = Math.max(0, now - cur.lastUpdated);
    const repeatBoost = dt < 1500 ? 0.08 : 0.02;
    const intensityBoost = isIntense(action) ? 0.08 : 0.02;
    const stabilizeBoost = isStabilizing(action) ? -0.04 : 0;
    const stress = clamp01(cur.stress * (1 - decay) + intensityBoost + stabilizeBoost);
    const volatility = clamp01(cur.volatility * (1 - decay) + repeatBoost);
    const confidence = clamp01(cur.confidence * (1 - decay * 0.5) + (stabilizeBoost < 0 ? 0.06 : 0.01));

    nextObjects[target] = {
      ...cur,
      stress,
      volatility,
      confidence,
      lastUpdated: now,
    };
  });

  if (input.focusedObjectId) {
    const cur = getObjectMemory(prev, input.focusedObjectId, now);
    nextObjects[input.focusedObjectId] = {
      ...cur,
      confidence: clamp01(cur.confidence + 0.03),
      lastUpdated: now,
    };
  }

  if (input.activeLoopId) {
    const loop = getLoopMemory(prev, input.activeLoopId, now);
    const momentumBoost = multiObjectUpdates > 1 ? 0.08 : 0.03;
    const instabilityBoost = multiObjectUpdates > 2 ? 0.06 : 0.02;
    nextLoops[input.activeLoopId] = {
      ...loop,
      momentum: clamp01(loop.momentum * (1 - decay * 0.5) + momentumBoost),
      instability: clamp01(loop.instability * (1 - decay) + instabilityBoost),
      lastUpdated: now,
    };
  }

  return {
    version: "1",
    savedAt: new Date(now).toISOString(),
    objects: nextObjects,
    loops: nextLoops,
    globals: { temperature: clamp01(prev.globals.temperature + 0.01), decay },
  };
}

export function deriveVisualPatch(mem: MemoryStateV1, id: string): { scale?: number; opacity?: number } {
  const obj = mem.objects[id];
  if (!obj) return {};
  const scale = clamp01(0.85 + obj.stress * 0.4 + obj.volatility * 0.2);
  const opacity = clamp01(0.45 + obj.confidence * 0.5 - obj.volatility * 0.2);
  const patch: { scale?: number; opacity?: number } = {};
  if (Number.isFinite(scale)) patch.scale = scale;
  if (Number.isFinite(opacity)) patch.opacity = opacity;
  return patch;
}
