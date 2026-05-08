import type { ElementScores, ElementScoreId } from "./emotionElementMapping";

export type SychoSlimMemory = {
  i: number;
  f: number;
  m: {
    f: number;
    w: number;
    a: number;
    e: number;
    s: number;
  };
  t: number;
};

export type SychoMemory = SychoSlimMemory;

const STORAGE_KEY = "sycho_mem_v1";
const LEGACY_KEYS = ["sycho_memory_v1", "nexora_psych_session_v1"];
const ELEMENTS: ElementScoreId[] = ["fire", "water", "air", "earth", "sun"];
const KEY_BY_ELEMENT: Record<ElementScoreId, keyof SychoSlimMemory["m"]> = {
  fire: "f",
  water: "w",
  air: "a",
  earth: "e",
  sun: "s",
};

let cachedMemory: SychoSlimMemory | null = null;
let writeDisabled = false;
let lastSaveAt = 0;
let interactionsSinceSave = 0;
let legacyCleaned = false;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function createDefaultMemory(): SychoSlimMemory {
  return {
    i: 0,
    f: 0,
    m: { f: 0.2, w: 0.2, a: 0.2, e: 0.2, s: 0.2 },
    t: Date.now(),
  };
}

function cleanupLegacyMemory(): void {
  if (legacyCleaned || !canUseStorage()) return;
  legacyCleaned = true;
  try {
    LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Optional cleanup only.
  }
}

function normalizeMemory(raw: unknown): SychoSlimMemory {
  const value = typeof raw === "object" && raw != null ? raw as Partial<SychoSlimMemory> : {};
  const mood = typeof value.m === "object" && value.m != null ? value.m as Partial<SychoSlimMemory["m"]> : {};
  const interactionCount = Math.max(0, Math.floor(Number(value.i) || 0));
  return {
    i: interactionCount,
    f: clamp01(Number(value.f) || Math.min(1, interactionCount / 60)),
    m: {
      f: clamp01(Number(mood.f) || 0.2),
      w: clamp01(Number(mood.w) || 0.2),
      a: clamp01(Number(mood.a) || 0.2),
      e: clamp01(Number(mood.e) || 0.2),
      s: clamp01(Number(mood.s) || 0.2),
    },
    t: Math.max(0, Number(value.t) || Date.now()),
  };
}

export function getMemoryScores(memory: SychoMemory): ElementScores {
  return {
    fire: memory.m.f,
    water: memory.m.w,
    air: memory.m.a,
    earth: memory.m.e,
    sun: memory.m.s,
  };
}

export function getMemoryFamiliarity(memory: SychoMemory): number {
  return memory.f;
}

export function loadMemory(): SychoMemory {
  if (cachedMemory) return cachedMemory;
  cleanupLegacyMemory();
  if (!canUseStorage()) {
    cachedMemory = createDefaultMemory();
    return cachedMemory;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cachedMemory = raw ? normalizeMemory(JSON.parse(raw) as unknown) : createDefaultMemory();
  } catch {
    cachedMemory = createDefaultMemory();
  }
  return cachedMemory;
}

export function saveMemory(memory: SychoMemory): boolean {
  cachedMemory = normalizeMemory(memory);
  if (!canUseStorage() || writeDisabled) return false;

  const now = Date.now();
  if (now - lastSaveAt < 2500 && interactionsSinceSave < 4) return false;

  try {
    const serialized = JSON.stringify(cachedMemory);
    if (serialized.length > 500) {
      writeDisabled = true;
      return false;
    }
    window.localStorage.setItem(STORAGE_KEY, serialized);
    lastSaveAt = now;
    interactionsSinceSave = 0;
    return true;
  } catch {
    writeDisabled = true;
    return false;
  }
}

export function saveSlimMemory(memory: SychoMemory): boolean {
  return saveMemory(memory);
}

export function loadSlimMemory(): SychoMemory {
  return loadMemory();
}

export function resetMemory(): void {
  cachedMemory = createDefaultMemory();
  writeDisabled = false;
  lastSaveAt = 0;
  interactionsSinceSave = 0;
  if (canUseStorage()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // Ignore optional memory cleanup failures.
    }
  }
}

export function updateMemory(memory: SychoMemory, currentScores: ElementScores): SychoMemory {
  const alpha = 0.08;
  const mood = { ...memory.m };
  ELEMENTS.forEach((element) => {
    const key = KEY_BY_ELEMENT[element];
    mood[key] = clamp01(memory.m[key] * (1 - alpha) + currentScores[element] * alpha);
  });

  const interactionCount = memory.i + 1;
  const next = normalizeMemory({
    i: interactionCount,
    f: Math.min(1, interactionCount / 60),
    m: mood,
    t: Date.now(),
  });
  cachedMemory = next;
  interactionsSinceSave += 1;
  return next;
}
