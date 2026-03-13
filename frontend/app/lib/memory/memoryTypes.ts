export type ObjectMemory = {
  id: string;
  stress: number;
  confidence: number;
  volatility: number;
  lastUpdated: number;
  lastReason?: string;
  kpi?: Record<string, number>;
  chaos?: Record<string, number>;
};

export type LoopMemory = {
  id: string;
  momentum: number;
  instability: number;
  lastUpdated: number;
  kpi?: Record<string, number>;
  chaos?: Record<string, number>;
};

export type GlobalMemory = {
  temperature: number;
  decay: number;
};

export type MemoryStateV1 = {
  version: "1";
  savedAt: string;
  objects: Record<string, ObjectMemory>;
  loops: Record<string, LoopMemory>;
  globals: GlobalMemory;
};

export type MemoryUpdateInput = {
  now: number;
  focusedObjectId?: string;
  activeLoopId?: string;
  actions: any[];
  text?: string;
  mode?: string;
};
