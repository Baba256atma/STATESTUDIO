import {
  EMPTY_RISK_INTELLIGENCE_REGISTRY,
  RISK_INTELLIGENCE_CATEGORY_LABELS,
  RISK_INTELLIGENCE_DIAGNOSTICS,
  RISK_INTELLIGENCE_RUNTIME_VERSION,
  type RiskIntelligenceBuildInput,
  type RiskIntelligenceCategory,
  type RiskIntelligenceCategoryLabel,
  type RiskIntelligenceCategoryScores,
  type RiskIntelligenceMomentum,
  type RiskIntelligenceProfile,
  type RiskIntelligenceRegistry,
} from "./riskIntelligenceContract.ts";

type RiskRecord = Readonly<Record<string, unknown>>;

let latestRiskIntelligenceRegistry: RiskIntelligenceRegistry = EMPTY_RISK_INTELLIGENCE_REGISTRY;

const CATEGORY_KEYS: readonly (keyof RiskIntelligenceCategoryScores)[] = Object.freeze([
  "operationalRisk",
  "financialRisk",
  "scheduleRisk",
  "dependencyRisk",
  "supplyRisk",
  "strategicRisk",
]);

const CATEGORY_BY_SCORE_KEY: Readonly<Record<keyof RiskIntelligenceCategoryScores, RiskIntelligenceCategory>> =
  Object.freeze({
    operationalRisk: "operational",
    financialRisk: "financial",
    scheduleRisk: "schedule",
    dependencyRisk: "dependency",
    supplyRisk: "supply",
    strategicRisk: "strategic",
  });

function asRecord(value: unknown): RiskRecord | null {
  return value && typeof value === "object" ? (value as RiskRecord) : null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readSceneObjects(sceneJson: unknown): readonly unknown[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? objects : [];
}

function readSceneRelationships(sceneJson: unknown): readonly unknown[] {
  const relationships = (sceneJson as { scene?: { relationships?: unknown[] } } | null)?.scene
    ?.relationships;
  return Array.isArray(relationships) ? relationships : [];
}

function readSceneRisks(sceneJson: unknown): readonly unknown[] {
  const risks = (sceneJson as { scene?: { risks?: unknown[] } } | null)?.scene?.risks;
  return Array.isArray(risks) ? risks : [];
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readScore(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value >= 0 && value <= 1 ? clampScore(value * 100) : clampScore(value);
  }
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "critical") return 95;
  if (normalized === "high") return 80;
  if (normalized === "medium" || normalized === "moderate" || normalized === "warning") return 60;
  if (normalized === "low") return 30;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return parsed >= 0 && parsed <= 1 ? clampScore(parsed * 100) : clampScore(parsed);
}

function metadata(record: RiskRecord): RiskRecord {
  return asRecord(record.metadata) ?? Object.freeze({});
}

function normalizeMomentum(value: unknown): RiskIntelligenceMomentum {
  const normalized = readString(value).toLowerCase();
  if (["improving", "recovering", "down", "decreasing", "declining"].includes(normalized)) {
    return "improving";
  }
  if (["worsening", "up", "increasing", "escalating", "deteriorating"].includes(normalized)) {
    return "worsening";
  }
  if (["stable", "flat", "steady"].includes(normalized)) return "stable";
  return "unknown";
}

function normalizeCategory(value: unknown): RiskIntelligenceCategory | null {
  const normalized = readString(value).toLowerCase().replace(/\s+/g, "_");
  if (normalized.includes("operational")) return "operational";
  if (normalized.includes("financial") || normalized.includes("finance")) return "financial";
  if (normalized.includes("schedule") || normalized.includes("timeline") || normalized.includes("delay")) {
    return "schedule";
  }
  if (normalized.includes("dependency") || normalized.includes("depend")) return "dependency";
  if (normalized.includes("supply") || normalized.includes("supplier")) return "supply";
  if (normalized.includes("strategic") || normalized.includes("strategy")) return "strategic";
  return null;
}

function resolveSubjectId(record: RiskRecord, index: number): string {
  return (
    readString(record.subjectId) ||
    readString(record.objectId) ||
    readString(record.targetId) ||
    readString(record.id) ||
    `risk-subject:${index + 1}`
  );
}

function resolveRiskId(record: RiskRecord, subjectId: string, index: number): string {
  return readString(record.riskId) || readString(record.id) || `risk:${subjectId}:${index + 1}`;
}

function resolveLabel(record: RiskRecord, subjectId: string): string {
  return (
    readString(record.label) ||
    readString(record.name) ||
    readString(record.display_label) ||
    readString(record.canonical_name) ||
    subjectId
  );
}

function scoreFromTokens(tokens: readonly string[], rules: readonly [string[], number][]): number {
  let score = 0;
  for (const [keywords, value] of rules) {
    if (keywords.some((keyword) => tokens.some((token) => token.includes(keyword)))) {
      score = Math.max(score, value);
    }
  }
  return score;
}

function collectTokens(record: RiskRecord): readonly string[] {
  const meta = metadata(record);
  const tags = Array.isArray(record.tags) ? record.tags.map((tag) => readString(tag).toLowerCase()) : [];
  const keywords = Array.isArray(record.keywords)
    ? record.keywords.map((keyword) => readString(keyword).toLowerCase())
    : [];
  return [
    readString(record.type).toLowerCase(),
    readString(record.objectType).toLowerCase(),
    readString(record.role).toLowerCase(),
    readString(record.category).toLowerCase(),
    readString(record.domain).toLowerCase(),
    readString(record.risk_kind).toLowerCase(),
    readString(meta.risk_kind).toLowerCase(),
    readString(meta.type).toLowerCase(),
    ...tags,
    ...keywords,
  ].filter(Boolean);
}

function scoreOperationalRisk(record: RiskRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.operationalRisk) ??
    readScore(meta.operationalRisk) ??
    readScore(record.operational_risk) ??
    readScore(meta.operational_risk);
  if (explicit != null) return explicit;

  const tokenScore = scoreFromTokens(collectTokens(record), [
    [["production", "inventory", "operational", "process"], 72],
    [["capacity", "throughput", "bottleneck"], 68],
  ]);
  return Math.max(tokenScore, 35);
}

function scoreFinancialRisk(record: RiskRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.financialRisk) ??
    readScore(meta.financialRisk) ??
    readScore(record.financial_risk) ??
    readScore(meta.financial_risk);
  if (explicit != null) return explicit;

  return scoreFromTokens(collectTokens(record), [
    [["revenue", "cost", "budget", "financial", "margin", "cash"], 78],
    [["pricing", "profit"], 64],
  ]) || 30;
}

function scoreScheduleRisk(record: RiskRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.scheduleRisk) ??
    readScore(meta.scheduleRisk) ??
    readScore(record.schedule_risk) ??
    readScore(meta.schedule_risk);
  if (explicit != null) return explicit;

  return scoreFromTokens(collectTokens(record), [
    [["schedule", "timeline", "delay", "deadline", "milestone", "slippage"], 82],
    [["late", "overdue"], 70],
  ]) || 28;
}

function scoreDependencyRisk(record: RiskRecord, dependencyCount = 0): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.dependencyRisk) ??
    readScore(meta.dependencyRisk) ??
    readScore(record.dependency_risk) ??
    readScore(meta.dependency_risk);
  if (explicit != null) return explicit;

  const dependencyScore = dependencyCount > 0 ? clampScore(45 + dependencyCount * 12) : 0;
  const tokenScore = scoreFromTokens(collectTokens(record), [
    [["dependency", "depends", "upstream", "downstream", "blocks"], 76],
    [["single_point", "single-source"], 84],
  ]);
  return Math.max(dependencyScore, tokenScore, 25);
}

function scoreSupplyRisk(record: RiskRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.supplyRisk) ??
    readScore(meta.supplyRisk) ??
    readScore(record.supply_risk) ??
    readScore(meta.supply_risk);
  if (explicit != null) return explicit;

  return scoreFromTokens(collectTokens(record), [
    [["supplier", "supply", "vendor", "procurement", "sourcing"], 80],
    [["logistics", "shipment"], 66],
  ]) || 26;
}

function scoreStrategicRisk(record: RiskRecord): number {
  const meta = metadata(record);
  const explicit =
    readScore(record.strategicRisk) ??
    readScore(meta.strategicRisk) ??
    readScore(record.strategic_risk) ??
    readScore(meta.strategic_risk);
  if (explicit != null) return explicit;

  const importance = readScore(record.importance) ?? readScore(record.emphasis);
  const tokenScore = scoreFromTokens(collectTokens(record), [
    [["strategic", "executive", "enterprise", "portfolio"], 86],
    [["mission", "critical_path"], 78],
  ]);
  return Math.max(importance ?? 0, tokenScore, 32);
}

function resolveCategoryScores(
  record: RiskRecord,
  dependencyCount = 0
): RiskIntelligenceCategoryScores {
  return Object.freeze({
    operationalRisk: scoreOperationalRisk(record),
    financialRisk: scoreFinancialRisk(record),
    scheduleRisk: scoreScheduleRisk(record),
    dependencyRisk: scoreDependencyRisk(record, dependencyCount),
    supplyRisk: scoreSupplyRisk(record),
    strategicRisk: scoreStrategicRisk(record),
  });
}

function resolvePrimaryCategory(
  categories: RiskIntelligenceCategoryScores,
  preferred?: RiskIntelligenceCategory | null
): RiskIntelligenceCategory {
  let primary: RiskIntelligenceCategory = "operational";
  let highest = -1;
  for (const key of CATEGORY_KEYS) {
    const score = categories[key];
    if (score > highest) {
      highest = score;
      primary = CATEGORY_BY_SCORE_KEY[key];
    }
  }
  if (preferred) {
    const preferredKey = `${preferred}Risk` as keyof RiskIntelligenceCategoryScores;
    if (preferredKey in categories && categories[preferredKey] >= highest) {
      return preferred;
    }
  }
  return primary;
}

function resolveSeverity(categories: RiskIntelligenceCategoryScores, record: RiskRecord): number {
  return (
    readScore(record.severity) ??
    readScore(record.risk) ??
    readScore(record.scanner_severity) ??
    Math.max(...CATEGORY_KEYS.map((key) => categories[key]))
  );
}

function resolveExposure(severity: number, record: RiskRecord): number {
  return (
    readScore(record.exposure) ??
    readScore(record.impact) ??
    readScore(record.scanner_emphasis) ??
    clampScore(severity * 0.85 + (readScore(record.emphasis) ?? 50) * 0.15)
  );
}

function resolveConfidence(record: RiskRecord): number {
  const meta = metadata(record);
  return (
    readScore(record.confidence) ??
    readScore(meta.confidence) ??
    readScore(record.sourceConfidence) ??
    70
  );
}

function countDependenciesForSubject(
  subjectId: string,
  relationships: readonly unknown[]
): number {
  let count = 0;
  for (const raw of relationships) {
    const record = asRecord(raw);
    if (!record) continue;
    const sourceId =
      readString(record.sourceId) || readString(record.sourceObjectId) || readString(record.from);
    const targetId =
      readString(record.targetId) || readString(record.targetObjectId) || readString(record.to);
    const type = readString(record.type) || readString(record.relationshipType);
    if (
      (sourceId === subjectId || targetId === subjectId) &&
      ["dependency", "supplies", "blocks", "depends_on"].includes(type.toLowerCase())
    ) {
      count += 1;
    }
  }
  return count;
}

function buildCategoryScoresFromExplicitRisk(
  record: RiskRecord,
  dependencyCount = 0
): RiskIntelligenceCategoryScores {
  const meta = metadata(record);
  const category = normalizeCategory(
    record.category ??
      record.riskCategory ??
      record.riskType ??
      meta.category ??
      meta.riskType ??
      record.risk_kind ??
      meta.risk_kind
  );
  const severity =
    readScore(record.severity) ?? readScore(record.scanner_severity) ?? readScore(record.risk);
  const base = resolveCategoryScores(record, dependencyCount);
  if (!category || severity == null) return base;

  const boosted = { ...base };
  const key = `${category}Risk` as keyof RiskIntelligenceCategoryScores;
  if (key in boosted) {
    boosted[key] = Math.max(boosted[key], severity);
  }
  return Object.freeze(boosted);
}

export function createRiskIntelligenceProfile(
  raw: unknown,
  index = 0,
  context: Readonly<{ relationships?: readonly unknown[] }> = {}
): RiskIntelligenceProfile | null {
  const record = asRecord(raw);
  if (!record) return null;

  const subjectId = resolveSubjectId(record, index);
  const riskId = resolveRiskId(record, subjectId, index);
  const dependencyCount =
    Array.isArray(record.dependencies) && record.dependencies.length > 0
      ? record.dependencies.length
      : countDependenciesForSubject(subjectId, context.relationships ?? []);
  const categories = buildCategoryScoresFromExplicitRisk(record, dependencyCount);
  const preferredCategory = normalizeCategory(
    record.category ??
      record.riskCategory ??
      record.riskType ??
      metadata(record).riskType ??
      record.risk_kind ??
      metadata(record).risk_kind
  );
  const primaryCategory = resolvePrimaryCategory(categories, preferredCategory);
  const severity = resolveSeverity(categories, record);
  const exposure = resolveExposure(severity, record);

  return Object.freeze({
    riskId,
    subjectId,
    label: resolveLabel(record, subjectId),
    primaryCategory,
    primaryCategoryLabel: RISK_INTELLIGENCE_CATEGORY_LABELS[primaryCategory],
    severity,
    exposure,
    confidence: resolveConfidence(record),
    momentum: normalizeMomentum(record.momentum ?? record.trend ?? metadata(record).momentum),
    categories,
  });
}

function dedupeProfiles(profiles: readonly RiskIntelligenceProfile[]): readonly RiskIntelligenceProfile[] {
  const byRiskId = new Map<string, RiskIntelligenceProfile>();
  for (const profile of profiles) {
    if (!byRiskId.has(profile.riskId)) byRiskId.set(profile.riskId, profile);
  }
  return Object.freeze([...byRiskId.values()]);
}

export function buildRiskIntelligenceRegistry(
  input: RiskIntelligenceBuildInput = {}
): RiskIntelligenceRegistry {
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const explicitRisks = input.risks ?? readSceneRisks(input.sceneJson);
  const context = Object.freeze({ relationships });

  const profiles = dedupeProfiles([
    ...explicitRisks
      .map((risk, index) => createRiskIntelligenceProfile(risk, index, context))
      .filter((profile): profile is RiskIntelligenceProfile => profile != null),
    ...objects
      .map((object, index) => createRiskIntelligenceProfile(object, index, context))
      .filter((profile): profile is RiskIntelligenceProfile => profile != null),
  ]);

  const profileByRiskId = Object.freeze(
    profiles.reduce<Record<string, RiskIntelligenceProfile>>((registry, profile) => {
      registry[profile.riskId] = profile;
      return registry;
    }, {})
  );
  const profileBySubjectId = Object.freeze(
    profiles.reduce<Record<string, RiskIntelligenceProfile>>((registry, profile) => {
      if (!registry[profile.subjectId]) registry[profile.subjectId] = profile;
      return registry;
    }, {})
  );

  latestRiskIntelligenceRegistry = Object.freeze({
    version: RISK_INTELLIGENCE_RUNTIME_VERSION,
    profiles,
    profileByRiskId,
    profileBySubjectId,
    riskCount: profiles.length,
    sceneMutation: false,
    routingMutation: false,
    simulation: false,
    diagnostics: RISK_INTELLIGENCE_DIAGNOSTICS,
  });

  return latestRiskIntelligenceRegistry;
}

export function getRiskIntelligenceRegistry(): RiskIntelligenceRegistry {
  return latestRiskIntelligenceRegistry;
}

export function resetRiskIntelligenceRuntimeForTests(): void {
  latestRiskIntelligenceRegistry = EMPTY_RISK_INTELLIGENCE_REGISTRY;
}
