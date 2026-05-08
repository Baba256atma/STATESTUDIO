export type EyeMemory = {
  selfReflectionCount: number;
  lastEyeContactAt: number | null;
  familiarity: number;
  shadowDepth: number;
};

const EYE_MEMORY_KEY = "nexora_psych_eye_memory_v1";

const DEFAULT_EYE_MEMORY: EyeMemory = {
  selfReflectionCount: 0,
  lastEyeContactAt: null,
  familiarity: 0,
  shadowDepth: 0,
};

let cachedEyeMemory: EyeMemory = { ...DEFAULT_EYE_MEMORY };
let loaded = false;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeEyeMemory(raw: Partial<EyeMemory> | null | undefined): EyeMemory {
  return {
    selfReflectionCount: Math.max(0, Math.floor(Number(raw?.selfReflectionCount) || 0)),
    lastEyeContactAt: typeof raw?.lastEyeContactAt === "number" ? raw.lastEyeContactAt : null,
    familiarity: clamp01(Number(raw?.familiarity) || 0),
    shadowDepth: clamp01(Number(raw?.shadowDepth) || 0),
  };
}

function saveEyeMemory(memory: EyeMemory): void {
  cachedEyeMemory = normalizeEyeMemory(memory);
  if (!canUseStorage()) return;

  try {
    const serialized = JSON.stringify(cachedEyeMemory);
    if (serialized.length > 1024) return;
    window.localStorage.setItem(EYE_MEMORY_KEY, serialized);
  } catch {
    // Eye memory is a tiny optional residue layer; storage failures should stay silent.
  }
}

export function loadEyeMemory(): EyeMemory {
  if (loaded) return cachedEyeMemory;
  loaded = true;

  if (!canUseStorage()) return cachedEyeMemory;

  try {
    const raw = window.localStorage.getItem(EYE_MEMORY_KEY);
    cachedEyeMemory = raw ? normalizeEyeMemory(JSON.parse(raw) as Partial<EyeMemory>) : { ...DEFAULT_EYE_MEMORY };
  } catch {
    cachedEyeMemory = { ...DEFAULT_EYE_MEMORY };
    try {
      window.localStorage.removeItem(EYE_MEMORY_KEY);
    } catch {
      // Ignore storage cleanup failures.
    }
  }

  return cachedEyeMemory;
}

export function getEyeMemory(): EyeMemory {
  return loadEyeMemory();
}

export function isSelfReflectionInput(input: string): boolean {
  const text = input.toLowerCase();
  return (
    text.includes("who am i") ||
    text.includes("why am i") ||
    text.includes("myself") ||
    text.includes("identity") ||
    text.includes("face") ||
    text.includes("mirror")
  );
}

export function updateEyeMemoryFromInput(input: string): EyeMemory | null {
  if (!isSelfReflectionInput(input)) return null;

  const current = loadEyeMemory();
  const next = normalizeEyeMemory({
    selfReflectionCount: current.selfReflectionCount + 1,
    lastEyeContactAt: Date.now(),
    familiarity: Math.min(1, current.familiarity + 0.08),
    shadowDepth: Math.min(1, current.shadowDepth + 0.05),
  });

  saveEyeMemory(next);

  if (process.env.NODE_ENV !== "production") {
    console.log("[Sycho][B12.9][EyeMemoryUpdated]", {
      selfReflectionCount: next.selfReflectionCount,
      familiarity: Number(next.familiarity.toFixed(3)),
      shadowDepth: Number(next.shadowDepth.toFixed(3)),
    });
  }

  return next;
}

export function resetEyeMemory(): void {
  cachedEyeMemory = { ...DEFAULT_EYE_MEMORY };
  loaded = true;
  if (canUseStorage()) {
    try {
      window.localStorage.removeItem(EYE_MEMORY_KEY);
    } catch {
      // Ignore storage cleanup failures.
    }
  }
  if (process.env.NODE_ENV !== "production") {
    console.log("[Sycho][B12.9][EyeMemoryReset]");
  }
}
