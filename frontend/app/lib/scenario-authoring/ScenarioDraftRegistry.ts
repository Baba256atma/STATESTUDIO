import type { ScenarioDraft } from "./scenarioAuthoringContract.ts";
import {
  EMPTY_SCENARIO_DRAFT_REGISTRY_SNAPSHOT,
  SCENARIO_DRAFT_REGISTRY_DIAGNOSTICS,
  SCENARIO_DRAFT_REGISTRY_VERSION,
  type ArchiveScenarioDraftRegistryInput,
  type CreateScenarioDraftRegistryInput,
  type ReadScenarioDraftRegistryInput,
  type ScenarioDraftRegistryEntry,
  type ScenarioDraftRegistryMutationResult,
  type ScenarioDraftRegistryPersistenceAdapter,
  type ScenarioDraftRegistrySnapshot,
  type UpdateScenarioDraftRegistryInput,
} from "./scenarioDraftRegistryContract.ts";

const SCENARIO_DRAFT_REGISTRY_STORAGE_KEY = "nexora:typec:scenario-draft-registry:v1";

let registryInitialized = false;
let entries: ScenarioDraftRegistryEntry[] = [];
let updatedAt: string | null = null;
let persistenceAdapter: ScenarioDraftRegistryPersistenceAdapter =
  createDefaultScenarioDraftRegistryPersistenceAdapter();

function nowIso(): string {
  return new Date().toISOString();
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function freezeEntry(entry: ScenarioDraftRegistryEntry): ScenarioDraftRegistryEntry {
  return Object.freeze({
    ...entry,
    draft: Object.freeze({
      ...entry.draft,
      assumptions: Object.freeze([...entry.draft.assumptions]),
      focusObjectIds: Object.freeze([...entry.draft.focusObjectIds]),
      validationMessages: Object.freeze([...entry.draft.validationMessages]),
      changes: Object.freeze([...entry.draft.changes]),
      metadata: Object.freeze({ ...entry.draft.metadata }),
    }),
  });
}

function isDraftOnly(draft: ScenarioDraft): boolean {
  return (
    draft.simulationActive === false &&
    draft.readOnlyIntelligence === true &&
    draft.sceneMutation === false &&
    draft.routingMutation === false &&
    draft.topologyMutation === false
  );
}

function hasSimulationPayload(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (record.simulationActive === true) return true;
  if (record.simulationResultsStored === true) return true;
  if (record.simulationResults != null) return true;
  if (record.simulationSnapshot != null) return true;
  if (record.executionActive === true) return true;
  return false;
}

function normalizeDraftForRegistry(
  draft: ScenarioDraft,
  existingCreatedAt?: string
): ScenarioDraft | null {
  const draftId = readString(draft.draftId);
  if (!draftId || hasSimulationPayload(draft) || !isDraftOnly(draft)) return null;

  const timestamp = nowIso();
  const createdAt = readString(existingCreatedAt) || readString(draft.metadata.createdAt) || timestamp;

  return Object.freeze({
    ...draft,
    draftId,
    metadata: Object.freeze({
      ...draft.metadata,
      draftId,
      createdAt,
      updatedAt: timestamp,
      intelligenceReadOnly: true as const,
    }),
    readOnlyIntelligence: true as const,
    simulationActive: false as const,
    sceneMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
  });
}

function buildRegistryEntry(
  draft: ScenarioDraft,
  registryStatus: ScenarioDraftRegistryEntry["registryStatus"],
  archivedAt: string | null
): ScenarioDraftRegistryEntry {
  return freezeEntry(
    Object.freeze({
      draft,
      registryStatus,
      archivedAt,
      draftsOnly: true as const,
      simulationActive: false as const,
      simulationResultsStored: false as const,
      dsMutation: false as const,
      intelligenceMutation: false as const,
      sceneMutation: false as const,
      objectMutation: false as const,
      routingMutation: false as const,
      topologyMutation: false as const,
    })
  );
}

function countActive(entriesList: readonly ScenarioDraftRegistryEntry[]): number {
  return entriesList.filter((entry) => entry.registryStatus === "active").length;
}

function countArchived(entriesList: readonly ScenarioDraftRegistryEntry[]): number {
  return entriesList.filter((entry) => entry.registryStatus === "archived").length;
}

function verifyRegistryIntegrity(entriesList: readonly ScenarioDraftRegistryEntry[]): boolean {
  const ids = new Set<string>();
  for (const entry of entriesList) {
    const draftId = readString(entry.draft.draftId);
    if (!draftId || ids.has(draftId)) return false;
    if (!entry.draftsOnly || entry.simulationActive || entry.simulationResultsStored) return false;
    if (!isDraftOnly(entry.draft)) return false;
    ids.add(draftId);
  }
  return true;
}

function buildSnapshot(): ScenarioDraftRegistrySnapshot {
  const frozenEntries = Object.freeze(entries.map(freezeEntry));
  return Object.freeze({
    version: SCENARIO_DRAFT_REGISTRY_VERSION,
    updatedAt,
    draftCount: frozenEntries.length,
    activeCount: countActive(frozenEntries),
    archivedCount: countArchived(frozenEntries),
    entries: frozenEntries,
    draftsOnly: true as const,
    simulationActive: false as const,
    simulationResultsStored: false as const,
    dsMutation: false as const,
    intelligenceMutation: false as const,
  });
}

function isRegistryEntry(value: unknown): value is ScenarioDraftRegistryEntry {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const draft = record.draft;
  if (!draft || typeof draft !== "object") return false;
  const draftRecord = draft as Record<string, unknown>;
  return (
    typeof draftRecord.draftId === "string" &&
    record.registryStatus !== undefined &&
    record.draftsOnly === true &&
    record.simulationActive === false &&
    record.simulationResultsStored === false
  );
}

function parseScenarioDraftRegistrySnapshot(raw: string): ScenarioDraftRegistrySnapshot | null {
  try {
    const parsed = JSON.parse(raw) as ScenarioDraftRegistrySnapshot;
    if (!parsed || parsed.version !== SCENARIO_DRAFT_REGISTRY_VERSION || !Array.isArray(parsed.entries)) {
      return null;
    }
    const restored = parsed.entries.filter(isRegistryEntry).map((entry) => {
      const draft = normalizeDraftForRegistry(entry.draft as ScenarioDraft, entry.draft.metadata.createdAt);
      if (!draft) return null;
      return buildRegistryEntry(
        draft,
        entry.registryStatus === "archived" ? "archived" : "active",
        typeof entry.archivedAt === "string" ? entry.archivedAt : null
      );
    }).filter((entry): entry is ScenarioDraftRegistryEntry => entry != null);

    if (!verifyRegistryIntegrity(restored)) return null;

    return Object.freeze({
      version: SCENARIO_DRAFT_REGISTRY_VERSION,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
      draftCount: restored.length,
      activeCount: countActive(restored),
      archivedCount: countArchived(restored),
      entries: Object.freeze(restored),
      draftsOnly: true,
      simulationActive: false,
      simulationResultsStored: false,
      dsMutation: false,
      intelligenceMutation: false,
    });
  } catch {
    return null;
  }
}

function createDefaultScenarioDraftRegistryPersistenceAdapter(): ScenarioDraftRegistryPersistenceAdapter {
  return Object.freeze({
    load(): ScenarioDraftRegistrySnapshot | null {
      if (typeof globalThis.localStorage === "undefined") return null;
      try {
        const raw = globalThis.localStorage.getItem(SCENARIO_DRAFT_REGISTRY_STORAGE_KEY);
        if (!raw) return null;
        return parseScenarioDraftRegistrySnapshot(raw);
      } catch {
        return null;
      }
    },
    save(snapshot: ScenarioDraftRegistrySnapshot): void {
      if (typeof globalThis.localStorage === "undefined") return;
      try {
        globalThis.localStorage.setItem(SCENARIO_DRAFT_REGISTRY_STORAGE_KEY, JSON.stringify(snapshot));
      } catch {
        // Best-effort persistence; registry state remains in memory.
      }
    },
    clear(): void {
      if (typeof globalThis.localStorage === "undefined") return;
      try {
        globalThis.localStorage.removeItem(SCENARIO_DRAFT_REGISTRY_STORAGE_KEY);
      } catch {
        // Best-effort cleanup only.
      }
    },
  });
}

function persistRegistry(): void {
  persistenceAdapter.save(buildSnapshot());
}

function initializeRegistry(): void {
  if (registryInitialized) return;
  registryInitialized = true;
  const loaded = persistenceAdapter.load();
  if (!loaded || !verifyRegistryIntegrity(loaded.entries)) {
    entries = [];
    updatedAt = null;
    return;
  }
  entries = loaded.entries.map(freezeEntry);
  updatedAt = loaded.updatedAt;
}

function commitRegistryChange(timestamp = nowIso()): void {
  if (!verifyRegistryIntegrity(entries)) return;
  updatedAt = timestamp;
  persistRegistry();
}

function mutationResult(
  success: boolean,
  entry: ScenarioDraftRegistryEntry | null,
  reason: ScenarioDraftRegistryMutationResult["reason"]
): ScenarioDraftRegistryMutationResult {
  return Object.freeze({
    success,
    entry,
    reason,
    registryIntegrityPreserved: verifyRegistryIntegrity(entries),
    draftsOnly: true as const,
    simulationActive: false as const,
    simulationResultsStored: false as const,
    dsMutation: false as const,
    intelligenceMutation: false as const,
  });
}

export function createScenarioDraftRegistryEntry(
  input: CreateScenarioDraftRegistryInput
): ScenarioDraftRegistryMutationResult {
  initializeRegistry();
  if (hasSimulationPayload(input.draft)) {
    return mutationResult(false, null, "simulation_payload_rejected");
  }

  const draft = normalizeDraftForRegistry(input.draft);
  if (!draft) {
    return mutationResult(false, null, "invalid_draft");
  }

  if (entries.some((entry) => entry.draft.draftId === draft.draftId)) {
    return mutationResult(false, null, "duplicate_draft");
  }

  const entry = buildRegistryEntry(draft, "active", null);
  entries = [...entries, entry];
  commitRegistryChange(draft.metadata.updatedAt);
  return mutationResult(true, entry, "created");
}

export function readScenarioDraftRegistryEntry(
  input: ReadScenarioDraftRegistryInput
): ScenarioDraftRegistryEntry | null {
  initializeRegistry();
  const draftId = readString(input.draftId);
  if (!draftId) return null;
  const entry = entries.find((candidate) => candidate.draft.draftId === draftId) ?? null;
  if (!entry) return null;
  if (entry.registryStatus === "archived" && !input.includeArchived) return null;
  return freezeEntry(entry);
}

export function listScenarioDraftRegistryEntries(options?: {
  includeArchived?: boolean;
}): readonly ScenarioDraftRegistryEntry[] {
  initializeRegistry();
  const includeArchived = options?.includeArchived ?? false;
  const visible = includeArchived
    ? entries
    : entries.filter((entry) => entry.registryStatus === "active");
  return Object.freeze(visible.map(freezeEntry));
}

export function updateScenarioDraftRegistryEntry(
  input: UpdateScenarioDraftRegistryInput
): ScenarioDraftRegistryMutationResult {
  initializeRegistry();
  const draftId = readString(input.draftId);
  if (!draftId) {
    return mutationResult(false, null, "missing_draft_id");
  }

  const existing = entries.find((entry) => entry.draft.draftId === draftId) ?? null;
  if (!existing) {
    return mutationResult(false, null, "draft_not_found");
  }
  if (existing.registryStatus === "archived") {
    return mutationResult(false, null, "already_archived");
  }
  if (hasSimulationPayload(input.draft)) {
    return mutationResult(false, null, "simulation_payload_rejected");
  }

  const draft = normalizeDraftForRegistry(input.draft, existing.draft.metadata.createdAt);
  if (!draft || draft.draftId !== draftId) {
    return mutationResult(false, null, "invalid_draft");
  }

  const entry = buildRegistryEntry(draft, "active", null);
  entries = entries.map((candidate) => (candidate.draft.draftId === draftId ? entry : candidate));
  commitRegistryChange(draft.metadata.updatedAt);
  return mutationResult(true, entry, "updated");
}

export function archiveScenarioDraftRegistryEntry(
  input: ArchiveScenarioDraftRegistryInput
): ScenarioDraftRegistryMutationResult {
  initializeRegistry();
  const draftId = readString(input.draftId);
  if (!draftId) {
    return mutationResult(false, null, "missing_draft_id");
  }

  const existing = entries.find((entry) => entry.draft.draftId === draftId) ?? null;
  if (!existing) {
    return mutationResult(false, null, "draft_not_found");
  }
  if (existing.registryStatus === "archived") {
    return mutationResult(false, null, "already_archived");
  }

  const archivedAt = nowIso();
  const entry = buildRegistryEntry(existing.draft, "archived", archivedAt);
  entries = entries.map((candidate) => (candidate.draft.draftId === draftId ? entry : candidate));
  commitRegistryChange(archivedAt);
  return mutationResult(true, entry, "archived");
}

export function getScenarioDraftRegistrySnapshot(): ScenarioDraftRegistrySnapshot {
  initializeRegistry();
  return buildSnapshot();
}

export function setScenarioDraftRegistryPersistenceAdapterForTests(
  adapter: ScenarioDraftRegistryPersistenceAdapter | null
): void {
  persistenceAdapter = adapter ?? createDefaultScenarioDraftRegistryPersistenceAdapter();
}

export function resetScenarioDraftRegistryForTests(): void {
  registryInitialized = false;
  entries = [];
  updatedAt = null;
  persistenceAdapter = createDefaultScenarioDraftRegistryPersistenceAdapter();
}

export function clearScenarioDraftRegistryForTests(): void {
  entries = [];
  updatedAt = null;
  persistenceAdapter.clear();
}

export const ScenarioDraftRegistry = Object.freeze({
  createScenarioDraftRegistryEntry,
  readScenarioDraftRegistryEntry,
  listScenarioDraftRegistryEntries,
  updateScenarioDraftRegistryEntry,
  archiveScenarioDraftRegistryEntry,
  getScenarioDraftRegistrySnapshot,
  setScenarioDraftRegistryPersistenceAdapterForTests,
  resetScenarioDraftRegistryForTests,
  clearScenarioDraftRegistryForTests,
  diagnostics: SCENARIO_DRAFT_REGISTRY_DIAGNOSTICS,
  emptySnapshot: EMPTY_SCENARIO_DRAFT_REGISTRY_SNAPSHOT,
});
