/**
 * DS-7:2 — Workspace scenario insight engine.
 * Executive insight only — read-only from existing workspace intelligence.
 *
 * OWNERSHIP RULE
 * DS-7:2 owns Scenario Executive Insight ONLY.
 * DS-7:2 MUST NOT simulate, compare scenarios, calculate executive indexes,
 * or mutate scenarios, KPIs, OKRs, or risks.
 */

import { getWorkspaceKpis } from "../kpi/workspaceKpiContract.ts";
import { getWorkspaceKpiHealthProfiles } from "../kpi/workspaceKpiHealthEngine.ts";
import { getWorkspaceObjective } from "../okr/workspaceOkrContract.ts";
import { getWorkspaceOkrHealthProfiles } from "../okr/workspaceOkrHealthEngine.ts";
import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import { getWorkspaceRelationships } from "../workspace/workspaceRelationshipCreationContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getDetectedWorkspaceRisks } from "../risk/workspaceRiskDetectionEngine.ts";
import { getRiskObjectBindings } from "../risk/workspaceRiskObjectBinding.ts";
import { getWorkspaceRiskSeverityProfiles } from "../risk/workspaceRiskSeverityEngine.ts";
import { getWorkspaceScenario } from "./workspaceScenarioContract.ts";

export const WORKSPACE_SCENARIO_INSIGHT_ENGINE_VERSION = "DS-7:2" as const;

export const WORKSPACE_SCENARIO_INSIGHT_ENGINE_TAGS = Object.freeze([
  "[DS72_SCENARIO_INSIGHT_ENGINE]",
  "[SCENARIO_EXECUTIVE_INSIGHT_READY]",
  "[SCENARIO_UNDERSTANDING_READY]",
  "[DS73_READY]",
  "[DS_7_2_COMPLETE]",
] as const);

export const NEXORA_SCENARIO_INSIGHT_LOG_PREFIX = "[NexoraScenarioInsight]" as const;

export const WORKSPACE_SCENARIO_INSIGHT_ENGINE_SOURCE = "ds-7:2-scenario-insight" as const;

export const WORKSPACE_SCENARIO_INSIGHT_STORAGE_KEY =
  "nexora.workspaceScenarioInsights.v1" as const;

export const WORKSPACE_SCENARIO_INSIGHT_READ_APIS = Object.freeze([
  "getWorkspaceScenario",
  "getObjectIntelligenceProfiles",
  "getWorkspaceRelationships",
  "getWorkspaceKpiHealthProfiles",
  "getWorkspaceKpis",
  "getWorkspaceOkrHealthProfiles",
  "getWorkspaceObjective",
  "getWorkspaceRiskSeverityProfiles",
  "getDetectedWorkspaceRisks",
  "getRiskObjectBindings",
] as const);

export type WorkspaceScenarioInsightReference = Readonly<{
  id: string;
  label: string;
}>;

export type WorkspaceScenarioInsight = Readonly<{
  contractVersion: typeof WORKSPACE_SCENARIO_INSIGHT_ENGINE_VERSION;
  workspaceId: WorkspaceId;
  scenarioId: string;
  executiveSummary: string;
  affectedObjects: readonly WorkspaceScenarioInsightReference[];
  relatedKpis: readonly WorkspaceScenarioInsightReference[];
  relatedOkrs: readonly WorkspaceScenarioInsightReference[];
  relatedRisks: readonly WorkspaceScenarioInsightReference[];
  attentionObjects: readonly WorkspaceScenarioInsightReference[];
  insightReason: string;
  generatedAt: string;
  source: typeof WORKSPACE_SCENARIO_INSIGHT_ENGINE_SOURCE;
}>;

export type WorkspaceScenarioInsightMap = Readonly<Record<string, WorkspaceScenarioInsight>>;

export type WorkspaceScenarioInsightStore = Readonly<
  Record<WorkspaceId, WorkspaceScenarioInsightMap>
>;

export type GenerateWorkspaceScenarioInsightResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  scenarioId: string | null;
  insight: WorkspaceScenarioInsight | null;
  generated: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = WORKSPACE_SCENARIO_INSIGHT_STORAGE_KEY;

const EXECUTIVE_THEME_SUMMARIES: ReadonlyArray<Readonly<{ pattern: RegExp; summary: string }>> =
  Object.freeze([
    Object.freeze({
      pattern: /forecast/i,
      summary: "Forecasting performance is the primary business focus.",
    }),
    Object.freeze({
      pattern: /growth|optimistic|expansion/i,
      summary: "Growth and expansion are the primary business focus.",
    }),
    Object.freeze({
      pattern: /cost|efficiency|operational/i,
      summary: "Operational efficiency is the primary business focus.",
    }),
    Object.freeze({
      pattern: /supply|warehouse|chain/i,
      summary: "Supply chain resilience is the primary business focus.",
    }),
  ]);

let workspaceScenarioInsightStore: WorkspaceScenarioInsightStore = {};
let workspaceScenarioInsightHydrated = false;
let workspaceScenarioInsightVersion = 0;

type WorkspaceScenarioInsightListener = () => void;

const workspaceScenarioInsightListeners = new Set<WorkspaceScenarioInsightListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function tokenize(value: string): readonly string[] {
  return Object.freeze(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 3)
  );
}

function tokensOverlap(left: string, right: string): boolean {
  for (const leftToken of tokenize(left)) {
    for (const rightToken of tokenize(right)) {
      if (leftToken === rightToken) return true;
      if (leftToken.startsWith(rightToken) || rightToken.startsWith(leftToken)) return true;
    }
  }
  return false;
}

function relevanceScore(scenarioText: string, targetText: string): number {
  const scenarioTokens = tokenize(scenarioText);
  const targetTokens = new Set(tokenize(targetText));
  if (scenarioTokens.length === 0 || targetTokens.size === 0) return 0;
  let score = 0;
  for (const token of scenarioTokens) {
    for (const targetToken of targetTokens) {
      if (token === targetToken) score += 2;
      else if (token.startsWith(targetToken) || targetToken.startsWith(token)) score += 1;
    }
  }
  return score;
}

function freezeInsight(insight: WorkspaceScenarioInsight): WorkspaceScenarioInsight {
  return Object.freeze({ ...insight });
}

function freezeReference(input: {
  id: string;
  label: string;
}): WorkspaceScenarioInsightReference {
  return Object.freeze({
    id: input.id,
    label: input.label,
  });
}

function readStorage(): WorkspaceScenarioInsightStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceScenarioInsightStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceScenarioInsightStore));
  } catch {
    // Insights remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceScenarioInsightStore(): void {
  if (workspaceScenarioInsightHydrated) return;
  workspaceScenarioInsightHydrated = true;
  workspaceScenarioInsightStore = readStorage();
}

function notifyWorkspaceScenarioInsightListeners(): void {
  workspaceScenarioInsightVersion += 1;
  workspaceScenarioInsightListeners.forEach((listener) => listener());
}

function commitWorkspaceScenarioInsightChange(): void {
  writeStorage();
  notifyWorkspaceScenarioInsightListeners();
}

function emitScenarioInsightDiagnostic(insight: WorkspaceScenarioInsight): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("scenarioInsight", NEXORA_SCENARIO_INSIGHT_LOG_PREFIX, {
    workspaceId: insight.workspaceId,
    scenarioId: insight.scenarioId,
    affectedObjectCount: insight.affectedObjects.length,
    riskCount: insight.relatedRisks.length,
    kpiCount: insight.relatedKpis.length,
    okrCount: insight.relatedOkrs.length,
    tags: WORKSPACE_SCENARIO_INSIGHT_ENGINE_TAGS,
    phase: "DS-7:2",
  });
}

function buildExecutiveSummary(scenarioText: string, scenarioName: string): string {
  for (const theme of EXECUTIVE_THEME_SUMMARIES) {
    if (theme.pattern.test(scenarioText)) {
      return theme.summary;
    }
  }
  return `${scenarioName.trim()} defines the primary executive focus for this scenario.`;
}

function resolveKpiHealthDescriptor(healthStatus: string): string {
  switch (healthStatus) {
    case "critical":
      return "declining";
    case "warning":
      return "mixed";
    case "watch":
      return "watch-level";
    default:
      return "stable";
  }
}

function resolveRiskDescriptor(severityLevel: string): string {
  switch (severityLevel) {
    case "critical":
      return "elevated";
    case "high":
      return "elevated";
    case "medium":
      return "moderate";
    default:
      return "emerging";
  }
}

export function buildWorkspaceScenarioInsightReason(input: {
  scenarioName: string;
  relatedKpis: readonly WorkspaceScenarioInsightReference[];
  relatedOkrs: readonly WorkspaceScenarioInsightReference[];
  relatedRisks: readonly WorkspaceScenarioInsightReference[];
  kpiHealthStatusById: ReadonlyMap<string, string>;
  riskSeverityLevelById: ReadonlyMap<string, string>;
}): string {
  const focusArea = /forecast/i.test(input.scenarioName)
    ? "forecasting operations"
    : `${input.scenarioName.trim()} operations`;

  const kpiPhrase =
    input.relatedKpis.length > 0
      ? input.relatedKpis
          .slice(0, 2)
          .map((kpi) => {
            const status = input.kpiHealthStatusById.get(kpi.id) ?? "unknown";
            return `${resolveKpiHealthDescriptor(status)} ${kpi.label.toLowerCase()}`;
          })
          .join(" and ")
      : "limited KPI linkage";

  const dominantRisk = input.relatedRisks[0];
  const riskPhrase = dominantRisk
    ? `${resolveRiskDescriptor(input.riskSeverityLevelById.get(dominantRisk.id) ?? "medium")} ${dominantRisk.label.toLowerCase()}`
    : "no dominant risk linkage";

  const okrPhrase =
    input.relatedOkrs.length > 0
      ? `objectives including ${input.relatedOkrs[0]?.label ?? "linked objectives"}`
      : "limited objective linkage";

  return `This scenario primarily affects ${focusArea} and is associated with ${kpiPhrase}, ${okrPhrase}, and ${riskPhrase}.`;
}

function sortReferences(
  items: readonly WorkspaceScenarioInsightReference[],
  scoreById: ReadonlyMap<string, number>
): readonly WorkspaceScenarioInsightReference[] {
  return Object.freeze(
    [...items].sort((left, right) => {
      const scoreDelta = (scoreById.get(right.id) ?? 0) - (scoreById.get(left.id) ?? 0);
      if (scoreDelta !== 0) return scoreDelta;
      return left.label.localeCompare(right.label);
    })
  );
}

function resolveConnectedObjectIds(workspaceId: WorkspaceId, seedObjectIds: ReadonlySet<string>): Set<string> {
  const connected = new Set(seedObjectIds);
  for (const relationship of getWorkspaceRelationships(workspaceId)) {
    if (connected.has(relationship.sourceObjectId)) {
      connected.add(relationship.targetObjectId);
    }
    if (connected.has(relationship.targetObjectId)) {
      connected.add(relationship.sourceObjectId);
    }
  }
  return connected;
}

export function buildWorkspaceScenarioInsight(input: {
  workspaceId: WorkspaceId;
  scenarioId: string;
  scenarioName: string;
  scenarioDescription: string;
}): WorkspaceScenarioInsight {
  const trimmedWorkspaceId = input.workspaceId.trim();
  const scenarioText = `${input.scenarioName} ${input.scenarioDescription}`.trim();

  const objectProfiles = getObjectIntelligenceProfiles(trimmedWorkspaceId);
  const objectScoreById = new Map<string, number>();
  const directlyMatchedObjectIds = new Set<string>();

  for (const profile of objectProfiles) {
    const score = Math.max(
      relevanceScore(scenarioText, profile.objectName),
      relevanceScore(scenarioText, profile.objectType)
    );
    if (score > 0) {
      objectScoreById.set(profile.objectId, score);
      directlyMatchedObjectIds.add(profile.objectId);
    }
  }

  const connectedObjectIds = resolveConnectedObjectIds(trimmedWorkspaceId, directlyMatchedObjectIds);
  for (const profile of objectProfiles) {
    if (!connectedObjectIds.has(profile.objectId)) continue;
    if (!objectScoreById.has(profile.objectId)) {
      objectScoreById.set(profile.objectId, 1);
    }
  }

  const relatedKpis: WorkspaceScenarioInsightReference[] = [];
  const kpiScoreById = new Map<string, number>();
  const kpiHealthStatusById = new Map<string, string>();
  const kpis = getWorkspaceKpis(trimmedWorkspaceId);
  const kpiNameById = new Map(kpis.map((kpi) => [kpi.kpiId, kpi.name] as const));

  for (const profile of getWorkspaceKpiHealthProfiles(trimmedWorkspaceId)) {
    const kpiName = kpiNameById.get(profile.kpiId) ?? profile.kpiId;
    kpiHealthStatusById.set(profile.kpiId, profile.healthStatus);
    const score = relevanceScore(scenarioText, kpiName);
    if (score <= 0) continue;
    kpiScoreById.set(profile.kpiId, score);
    relatedKpis.push(freezeReference({ id: profile.kpiId, label: kpiName }));
  }

  const relatedOkrs: WorkspaceScenarioInsightReference[] = [];
  const okrScoreById = new Map<string, number>();

  for (const profile of getWorkspaceOkrHealthProfiles(trimmedWorkspaceId)) {
    const objective = getWorkspaceObjective(trimmedWorkspaceId, profile.objectiveId);
    const objectiveTitle = objective?.title ?? profile.objectiveId;
    const score = relevanceScore(scenarioText, objectiveTitle);
    if (score <= 0) continue;
    okrScoreById.set(profile.objectiveId, score);
    relatedOkrs.push(freezeReference({ id: profile.objectiveId, label: objectiveTitle }));
  }

  const detectedByRiskId = new Map(
    getDetectedWorkspaceRisks(trimmedWorkspaceId).map((risk) => [risk.riskId, risk] as const)
  );
  const relatedRisks: WorkspaceScenarioInsightReference[] = [];
  const riskScoreById = new Map<string, number>();
  const riskSeverityLevelById = new Map<string, string>();

  for (const profile of getWorkspaceRiskSeverityProfiles(trimmedWorkspaceId)) {
    const detected = detectedByRiskId.get(profile.riskId);
    const riskTitle = detected?.title ?? profile.riskId;
    riskSeverityLevelById.set(profile.riskId, profile.severityLevel);
    const score =
      relevanceScore(scenarioText, riskTitle) +
      profile.severityScore / 100;
    if (score <= 0) continue;
    riskScoreById.set(profile.riskId, score);
    relatedRisks.push(freezeReference({ id: profile.riskId, label: riskTitle }));
  }

  const affectedObjects: WorkspaceScenarioInsightReference[] = objectProfiles
    .filter((profile) => objectScoreById.has(profile.objectId))
    .map((profile) =>
      freezeReference({
        id: profile.objectId,
        label: profile.objectName,
      })
    );

  const riskBoundObjectIds = new Set<string>();
  for (const binding of getRiskObjectBindings(trimmedWorkspaceId)) {
    if (!riskScoreById.has(binding.riskId)) continue;
    riskBoundObjectIds.add(binding.objectId);
    if (!objectScoreById.has(binding.objectId)) {
      objectScoreById.set(binding.objectId, 2);
      const profile = objectProfiles.find((entry) => entry.objectId === binding.objectId);
      if (profile) {
        affectedObjects.push(
          freezeReference({ id: profile.objectId, label: profile.objectName })
        );
      }
    }
  }

  const attentionScoreById = new Map<string, number>();
  for (const [objectId, score] of objectScoreById.entries()) {
    attentionScoreById.set(objectId, score);
  }
  for (const objectId of riskBoundObjectIds) {
    attentionScoreById.set(objectId, (attentionScoreById.get(objectId) ?? 0) + 3);
  }

  const attentionObjects = sortReferences(
    objectProfiles
      .filter((profile) => attentionScoreById.has(profile.objectId))
      .map((profile) =>
        freezeReference({
          id: profile.objectId,
          label: profile.objectName,
        })
      ),
    attentionScoreById
  ).slice(0, 5);

  const insight = freezeInsight(
    Object.freeze({
      contractVersion: WORKSPACE_SCENARIO_INSIGHT_ENGINE_VERSION,
      workspaceId: trimmedWorkspaceId,
      scenarioId: input.scenarioId,
      executiveSummary: buildExecutiveSummary(scenarioText, input.scenarioName),
      affectedObjects: sortReferences(
        [...new Map(affectedObjects.map((item) => [item.id, item] as const)).values()],
        objectScoreById
      ),
      relatedKpis: sortReferences(relatedKpis, kpiScoreById),
      relatedOkrs: sortReferences(relatedOkrs, okrScoreById),
      relatedRisks: sortReferences(relatedRisks, riskScoreById),
      attentionObjects,
      insightReason: buildWorkspaceScenarioInsightReason({
        scenarioName: input.scenarioName,
        relatedKpis: sortReferences(relatedKpis, kpiScoreById),
        relatedOkrs: sortReferences(relatedOkrs, okrScoreById),
        relatedRisks: sortReferences(relatedRisks, riskScoreById),
        kpiHealthStatusById,
        riskSeverityLevelById,
      }),
      generatedAt: nowIso(),
      source: WORKSPACE_SCENARIO_INSIGHT_ENGINE_SOURCE,
    })
  );

  return insight;
}

export function generateWorkspaceScenarioInsight(
  workspaceId: WorkspaceId,
  scenarioId: string
): GenerateWorkspaceScenarioInsightResult {
  hydrateWorkspaceScenarioInsightStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedScenarioId = scenarioId.trim();

  if (!trimmedWorkspaceId || !trimmedScenarioId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      scenarioId: trimmedScenarioId || null,
      insight: null,
      generated: false,
      reason: "missing_identifier",
      message: "Provide workspace and scenario identifiers before generating insight.",
    });
  }

  const scenario = getWorkspaceScenario(trimmedWorkspaceId, trimmedScenarioId);
  if (!scenario) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenarioId: trimmedScenarioId,
      insight: null,
      generated: false,
      reason: "scenario_not_found",
      message: "Scenario not found for insight generation.",
    });
  }

  const insight = buildWorkspaceScenarioInsight({
    workspaceId: trimmedWorkspaceId,
    scenarioId: scenario.scenarioId,
    scenarioName: scenario.name,
    scenarioDescription: scenario.description,
  });

  const existingMap = workspaceScenarioInsightStore[trimmedWorkspaceId] ?? {};
  workspaceScenarioInsightStore = Object.freeze({
    ...workspaceScenarioInsightStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...existingMap,
      [insight.scenarioId]: insight,
    }),
  });
  commitWorkspaceScenarioInsightChange();
  emitScenarioInsightDiagnostic(insight);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    scenarioId: trimmedScenarioId,
    insight,
    generated: true,
    reason: "generated",
    message: `Scenario insight generated for "${scenario.name}".`,
  });
}

export function getWorkspaceScenarioInsight(
  workspaceId: WorkspaceId,
  scenarioId: string
): WorkspaceScenarioInsight | null {
  hydrateWorkspaceScenarioInsightStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedScenarioId = scenarioId.trim();
  if (!trimmedWorkspaceId || !trimmedScenarioId) return null;
  const match = workspaceScenarioInsightStore[trimmedWorkspaceId]?.[trimmedScenarioId] ?? null;
  return match ? freezeInsight(match) : null;
}

export function getWorkspaceScenarioInsights(
  workspaceId: WorkspaceId
): readonly WorkspaceScenarioInsight[] {
  hydrateWorkspaceScenarioInsightStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceScenarioInsightStore[trimmedWorkspaceId] ?? {}).map(freezeInsight)
  );
}

export function subscribeWorkspaceScenarioInsightRegistry(
  listener: WorkspaceScenarioInsightListener
): () => void {
  hydrateWorkspaceScenarioInsightStore();
  workspaceScenarioInsightListeners.add(listener);
  return () => workspaceScenarioInsightListeners.delete(listener);
}

export function getWorkspaceScenarioInsightRegistryVersion(): number {
  hydrateWorkspaceScenarioInsightStore();
  return workspaceScenarioInsightVersion;
}

export function resetWorkspaceScenarioInsightStoreForTests(): void {
  workspaceScenarioInsightStore = {};
  workspaceScenarioInsightHydrated = false;
  workspaceScenarioInsightVersion = 0;
  workspaceScenarioInsightListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceScenarioInsightMemoryForTests(): void {
  workspaceScenarioInsightStore = {};
  workspaceScenarioInsightHydrated = false;
  workspaceScenarioInsightVersion = 0;
}
