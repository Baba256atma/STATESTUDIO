/**
 * DS-8 — Executive Intelligence Registry.
 * Platform registry for executive index definitions and metadata only.
 * Does not calculate indexes, render dashboard surfaces, or mutate downstream intelligence.
 *
 * Architecture:
 *   Objects → Relationships → KPI → OKR → Risk → Scenario
 *     ↓
 *   Executive Registry (DS-8)
 *     ↓
 *   Executive Index (IDX-1+ plugins)
 *     ↓
 *   Dashboard / Assistant (consumers)
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";

export const EXECUTIVE_INTELLIGENCE_REGISTRY_VERSION = "DS-8" as const;

export const EXECUTIVE_INTELLIGENCE_REGISTRY_TAGS = Object.freeze([
  "[DS8_EXECUTIVE_REGISTRY]",
  "[EXECUTIVE_PLATFORM_READY]",
  "[INDEX_REGISTRY_READY]",
  "[POST_MVP_READY]",
  "[IDX1_READY]",
  "[DS_8_COMPLETE]",
] as const);

export const NEXORA_EXECUTIVE_REGISTRY_LOG_PREFIX = "[NexoraExecutiveRegistry]" as const;

export const EXECUTIVE_REGISTRY_SOURCE = "ds-8-executive-registry" as const;

export const EXECUTIVE_REGISTRY_STORAGE_KEY = "nexora.executiveRegistry.v1" as const;

export type ExecutiveIndexCategory =
  | "financial"
  | "strategic"
  | "operational"
  | "resource"
  | "scenario"
  | "custom";

export type ExecutiveIndexDependency =
  | "objects"
  | "relationships"
  | "kpis"
  | "okrs"
  | "risks"
  | "scenarios";

export type ExecutiveIndexStatus = "reserved" | "active" | "deprecated" | "experimental";

export type ExecutiveIndexDefinition = Readonly<{
  contractVersion: typeof EXECUTIVE_INTELLIGENCE_REGISTRY_VERSION;
  indexId: string;
  name: string;
  description: string;
  category: ExecutiveIndexCategory;
  ownerPhase: string;
  status: ExecutiveIndexStatus;
  version: string;
  dependencies: readonly ExecutiveIndexDependency[];
  registeredAt: string;
  updatedAt: string;
  source: typeof EXECUTIVE_REGISTRY_SOURCE;
}>;

export type ExecutiveIndexRegistryStore = Readonly<Record<string, ExecutiveIndexDefinition>>;

export type RegisterExecutiveIndexInput = Readonly<{
  indexId?: string;
  name: string;
  description: string;
  category: ExecutiveIndexCategory;
  ownerPhase: string;
  status?: ExecutiveIndexStatus;
  version?: string;
  dependencies: readonly ExecutiveIndexDependency[];
}>;

export type RegisterExecutiveIndexResult = Readonly<{
  success: boolean;
  index: ExecutiveIndexDefinition | null;
  created: boolean;
  reason: string;
  message: string;
}>;

export type UnregisterExecutiveIndexResult = Readonly<{
  success: boolean;
  indexId: string | null;
  removed: boolean;
  reason: string;
  message: string;
}>;

export const EXECUTIVE_INDEX_CATEGORIES = Object.freeze([
  "financial",
  "strategic",
  "operational",
  "resource",
  "scenario",
  "custom",
] as const satisfies readonly ExecutiveIndexCategory[]);

export const EXECUTIVE_INDEX_DEPENDENCIES = Object.freeze([
  "objects",
  "relationships",
  "kpis",
  "okrs",
  "risks",
  "scenarios",
] as const satisfies readonly ExecutiveIndexDependency[]);

type ReservedExecutiveIndexSeed = Readonly<{
  name: string;
  description: string;
  category: ExecutiveIndexCategory;
  ownerPhase: string;
  dependencies: readonly ExecutiveIndexDependency[];
}>;

export const RESERVED_EXECUTIVE_INDEX_SEEDS = Object.freeze([
  Object.freeze({
    name: "Cost Pressure Index",
    description: "Reserved executive index for cost pressure across KPI and OKR signals.",
    category: "financial" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["kpis", "okrs", "risks"] as const),
  }),
  Object.freeze({
    name: "Scenario Risk Score",
    description: "Reserved executive index for scenario-linked risk exposure.",
    category: "scenario" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["scenarios", "risks", "okrs"] as const),
  }),
  Object.freeze({
    name: "Execution Readiness",
    description: "Reserved executive index for operational execution readiness.",
    category: "operational" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["objects", "kpis", "okrs"] as const),
  }),
  Object.freeze({
    name: "Opportunity Score",
    description: "Reserved executive index for strategic opportunity evaluation.",
    category: "strategic" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["scenarios", "kpis", "okrs"] as const),
  }),
  Object.freeze({
    name: "Strategic Alignment",
    description: "Reserved executive index for objective and relationship alignment.",
    category: "strategic" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["okrs", "objects", "relationships"] as const),
  }),
  Object.freeze({
    name: "Decision Confidence",
    description: "Reserved executive index for executive decision confidence.",
    category: "strategic" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["scenarios", "risks", "kpis"] as const),
  }),
  Object.freeze({
    name: "Time Sensitivity",
    description: "Reserved executive index for time-sensitive scenario outcomes.",
    category: "operational" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["scenarios", "kpis"] as const),
  }),
  Object.freeze({
    name: "Dependency Score",
    description: "Reserved executive index for relationship and object dependency exposure.",
    category: "operational" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["relationships", "objects", "risks"] as const),
  }),
  Object.freeze({
    name: "Impact Score",
    description: "Reserved executive index for cross-object impact propagation.",
    category: "strategic" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["objects", "relationships", "scenarios"] as const),
  }),
  Object.freeze({
    name: "Resource Constraint Score",
    description: "Reserved executive index for resource constraint pressure.",
    category: "resource" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["kpis", "okrs", "objects"] as const),
  }),
  Object.freeze({
    name: "Data Quality Score",
    description: "Reserved executive index for object and KPI data quality.",
    category: "operational" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["objects", "kpis"] as const),
  }),
  Object.freeze({
    name: "Anomaly Score",
    description: "Reserved executive index for anomaly detection across intelligence layers.",
    category: "operational" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["kpis", "risks", "scenarios"] as const),
  }),
  Object.freeze({
    name: "Expected ROI",
    description: "Reserved executive index for expected return on investment.",
    category: "financial" as const,
    ownerPhase: "IDX-1",
    dependencies: Object.freeze(["scenarios", "kpis", "okrs"] as const),
  }),
  Object.freeze({
    name: "Future Executive Indexes",
    description: "Reserved placeholder for post-MVP executive index plugins.",
    category: "custom" as const,
    ownerPhase: "IDX-1+",
    dependencies: Object.freeze([
      "objects",
      "relationships",
      "kpis",
      "okrs",
      "risks",
      "scenarios",
    ] as const),
  }),
] as const satisfies readonly ReservedExecutiveIndexSeed[]);

const STORAGE_KEY = EXECUTIVE_REGISTRY_STORAGE_KEY;

const INDEX_CATEGORIES = new Set<ExecutiveIndexCategory>(EXECUTIVE_INDEX_CATEGORIES);
const INDEX_DEPENDENCIES = new Set<ExecutiveIndexDependency>(EXECUTIVE_INDEX_DEPENDENCIES);
const INDEX_STATUSES = new Set<ExecutiveIndexStatus>([
  "reserved",
  "active",
  "deprecated",
  "experimental",
]);

let executiveIndexRegistryStore: ExecutiveIndexRegistryStore = {};
let executiveIndexRegistryHydrated = false;
let executiveIndexRegistryVersion = 0;
let reservedIndexesSeeded = false;

type ExecutiveIndexRegistryListener = () => void;

const executiveIndexRegistryListeners = new Set<ExecutiveIndexRegistryListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "executive_index"
  );
}

function freezeIndex(index: ExecutiveIndexDefinition): ExecutiveIndexDefinition {
  return Object.freeze({
    ...index,
    dependencies: Object.freeze([...index.dependencies]),
  });
}

function readStorage(): ExecutiveIndexRegistryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as ExecutiveIndexRegistryStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(executiveIndexRegistryStore));
  } catch {
    // Registry remains available in-memory if storage is unavailable.
  }
}

function notifyExecutiveIndexRegistryListeners(): void {
  executiveIndexRegistryVersion += 1;
  executiveIndexRegistryListeners.forEach((listener) => listener());
}

function commitExecutiveIndexRegistryChange(): void {
  writeStorage();
  notifyExecutiveIndexRegistryListeners();
}

function emitExecutiveRegistryDiagnostic(input: {
  indexId: string;
  category: ExecutiveIndexCategory;
  ownerPhase: string;
  action: "registered" | "rejected" | "unregistered" | "seeded";
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("executiveRegistry", NEXORA_EXECUTIVE_REGISTRY_LOG_PREFIX, {
    indexId: input.indexId,
    category: input.category,
    ownerPhase: input.ownerPhase,
    action: input.action,
    tags: EXECUTIVE_INTELLIGENCE_REGISTRY_TAGS,
    phase: "DS-8",
  });
}

export function buildExecutiveIndexId(name: string): string {
  return slugify(name);
}

export function validateExecutiveIndexCategory(
  category: string
): category is ExecutiveIndexCategory {
  return INDEX_CATEGORIES.has(category as ExecutiveIndexCategory);
}

export function validateExecutiveIndexDependencies(
  dependencies: readonly string[]
): dependencies is readonly ExecutiveIndexDependency[] {
  if (dependencies.length === 0) return false;
  return dependencies.every((dependency) =>
    INDEX_DEPENDENCIES.has(dependency as ExecutiveIndexDependency)
  );
}

function buildExecutiveIndexDefinition(input: {
  indexId: string;
  name: string;
  description: string;
  category: ExecutiveIndexCategory;
  ownerPhase: string;
  status: ExecutiveIndexStatus;
  version: string;
  dependencies: readonly ExecutiveIndexDependency[];
  registeredAt: string;
  updatedAt: string;
}): ExecutiveIndexDefinition {
  return freezeIndex(
    Object.freeze({
      contractVersion: EXECUTIVE_INTELLIGENCE_REGISTRY_VERSION,
      indexId: input.indexId,
      name: input.name.trim(),
      description: input.description.trim(),
      category: input.category,
      ownerPhase: input.ownerPhase.trim(),
      status: input.status,
      version: input.version.trim(),
      dependencies: Object.freeze([...input.dependencies]),
      registeredAt: input.registeredAt,
      updatedAt: input.updatedAt,
      source: EXECUTIVE_REGISTRY_SOURCE,
    })
  );
}

function seedReservedExecutiveIndexes(): void {
  if (reservedIndexesSeeded) return;
  reservedIndexesSeeded = true;

  const timestamp = nowIso();
  let changed = false;

  for (const seed of RESERVED_EXECUTIVE_INDEX_SEEDS) {
    const indexId = buildExecutiveIndexId(seed.name);
    if (executiveIndexRegistryStore[indexId]) continue;

    executiveIndexRegistryStore = Object.freeze({
      ...executiveIndexRegistryStore,
      [indexId]: buildExecutiveIndexDefinition({
        indexId,
        name: seed.name,
        description: seed.description,
        category: seed.category,
        ownerPhase: seed.ownerPhase,
        status: "reserved",
        version: "0.0.0-reserved",
        dependencies: seed.dependencies,
        registeredAt: timestamp,
        updatedAt: timestamp,
      }),
    });
    changed = true;

    emitExecutiveRegistryDiagnostic({
      indexId,
      category: seed.category,
      ownerPhase: seed.ownerPhase,
      action: "seeded",
    });
  }

  if (changed) {
    commitExecutiveIndexRegistryChange();
  }
}

export function hydrateExecutiveIntelligenceRegistry(): void {
  if (executiveIndexRegistryHydrated) return;
  executiveIndexRegistryHydrated = true;
  executiveIndexRegistryStore = readStorage();
  seedReservedExecutiveIndexes();
}

export function registerExecutiveIndex(
  input: RegisterExecutiveIndexInput
): RegisterExecutiveIndexResult {
  hydrateExecutiveIntelligenceRegistry();

  const name = String(input.name ?? "").trim();
  const description = String(input.description ?? "").trim();
  const ownerPhase = String(input.ownerPhase ?? "").trim();
  const category = input.category;
  const status = input.status ?? "reserved";
  const version = String(input.version ?? "0.0.0-reserved").trim();
  const indexId = String(input.indexId ?? buildExecutiveIndexId(name)).trim();

  if (!name) {
    return Object.freeze({
      success: false,
      index: null,
      created: false,
      reason: "invalid_name",
      message: "Executive index name is required.",
    });
  }

  if (!ownerPhase) {
    return Object.freeze({
      success: false,
      index: null,
      created: false,
      reason: "invalid_owner_phase",
      message: "Executive index ownerPhase is required.",
    });
  }

  if (!validateExecutiveIndexCategory(category)) {
    emitExecutiveRegistryDiagnostic({
      indexId,
      category: "custom",
      ownerPhase,
      action: "rejected",
    });
    return Object.freeze({
      success: false,
      index: null,
      created: false,
      reason: "invalid_category",
      message: `Executive index category "${String(category)}" is not supported.`,
    });
  }

  if (!validateExecutiveIndexDependencies(input.dependencies)) {
    emitExecutiveRegistryDiagnostic({
      indexId,
      category,
      ownerPhase,
      action: "rejected",
    });
    return Object.freeze({
      success: false,
      index: null,
      created: false,
      reason: "invalid_dependencies",
      message: "Executive index dependencies must include at least one supported intelligence layer.",
    });
  }

  if (!INDEX_STATUSES.has(status)) {
    return Object.freeze({
      success: false,
      index: null,
      created: false,
      reason: "invalid_status",
      message: `Executive index status "${status}" is not supported.`,
    });
  }

  if (executiveIndexRegistryStore[indexId]) {
    emitExecutiveRegistryDiagnostic({
      indexId,
      category,
      ownerPhase,
      action: "rejected",
    });
    return Object.freeze({
      success: false,
      index: executiveIndexRegistryStore[indexId] ?? null,
      created: false,
      reason: "duplicate_index",
      message: `Executive index "${indexId}" is already registered.`,
    });
  }

  const timestamp = nowIso();
  const index = buildExecutiveIndexDefinition({
    indexId,
    name,
    description,
    category,
    ownerPhase,
    status,
    version,
    dependencies: input.dependencies,
    registeredAt: timestamp,
    updatedAt: timestamp,
  });

  executiveIndexRegistryStore = Object.freeze({
    ...executiveIndexRegistryStore,
    [indexId]: index,
  });
  commitExecutiveIndexRegistryChange();

  emitExecutiveRegistryDiagnostic({
    indexId,
    category,
    ownerPhase,
    action: "registered",
  });

  return Object.freeze({
    success: true,
    index,
    created: true,
    reason: "registered",
    message: `Executive index "${name}" registered.`,
  });
}

export function unregisterExecutiveIndex(indexId: string): UnregisterExecutiveIndexResult {
  hydrateExecutiveIntelligenceRegistry();

  const trimmedIndexId = String(indexId ?? "").trim();
  if (!trimmedIndexId) {
    return Object.freeze({
      success: false,
      indexId: null,
      removed: false,
      reason: "invalid_index_id",
      message: "Executive indexId is required.",
    });
  }

  const existing = executiveIndexRegistryStore[trimmedIndexId];
  if (!existing) {
    return Object.freeze({
      success: false,
      indexId: trimmedIndexId,
      removed: false,
      reason: "not_found",
      message: `Executive index "${trimmedIndexId}" was not found.`,
    });
  }

  const { [trimmedIndexId]: _removed, ...rest } = executiveIndexRegistryStore;
  executiveIndexRegistryStore = Object.freeze(rest);
  commitExecutiveIndexRegistryChange();

  emitExecutiveRegistryDiagnostic({
    indexId: trimmedIndexId,
    category: existing.category,
    ownerPhase: existing.ownerPhase,
    action: "unregistered",
  });

  return Object.freeze({
    success: true,
    indexId: trimmedIndexId,
    removed: true,
    reason: "unregistered",
    message: `Executive index "${trimmedIndexId}" unregistered.`,
  });
}

export function getExecutiveIndex(indexId: string): ExecutiveIndexDefinition | null {
  hydrateExecutiveIntelligenceRegistry();
  const trimmedIndexId = String(indexId ?? "").trim();
  if (!trimmedIndexId) return null;
  const match = executiveIndexRegistryStore[trimmedIndexId] ?? null;
  return match ? freezeIndex(match) : null;
}

export function getExecutiveIndexes(): readonly ExecutiveIndexDefinition[] {
  hydrateExecutiveIntelligenceRegistry();
  return Object.freeze(
    Object.values(executiveIndexRegistryStore)
      .map(freezeIndex)
      .sort((left, right) => left.name.localeCompare(right.name))
  );
}

export function isExecutiveIndexRegistered(indexId: string): boolean {
  hydrateExecutiveIntelligenceRegistry();
  const trimmedIndexId = String(indexId ?? "").trim();
  if (!trimmedIndexId) return false;
  return Boolean(executiveIndexRegistryStore[trimmedIndexId]);
}

export function subscribeExecutiveIndexRegistry(
  listener: ExecutiveIndexRegistryListener
): () => void {
  hydrateExecutiveIntelligenceRegistry();
  executiveIndexRegistryListeners.add(listener);
  return () => {
    executiveIndexRegistryListeners.delete(listener);
  };
}

export function getExecutiveIndexRegistryVersion(): number {
  hydrateExecutiveIntelligenceRegistry();
  return executiveIndexRegistryVersion;
}

export function resetExecutiveIntelligenceRegistryStoreForTests(): void {
  executiveIndexRegistryStore = {};
  executiveIndexRegistryHydrated = false;
  executiveIndexRegistryVersion = 0;
  reservedIndexesSeeded = false;
  executiveIndexRegistryListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

export function resetExecutiveIntelligenceRegistryMemoryForTests(): void {
  executiveIndexRegistryHydrated = false;
  executiveIndexRegistryVersion = 0;
  reservedIndexesSeeded = false;
}

export const ExecutiveIntelligenceRegistry = Object.freeze({
  registerExecutiveIndex,
  unregisterExecutiveIndex,
  getExecutiveIndex,
  getExecutiveIndexes,
  isExecutiveIndexRegistered,
  hydrateExecutiveIntelligenceRegistry,
  resetExecutiveIntelligenceRegistryStoreForTests,
  resetExecutiveIntelligenceRegistryMemoryForTests,
});
