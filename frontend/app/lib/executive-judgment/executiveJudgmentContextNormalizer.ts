import {
  EXECUTIVE_JUDGMENT_API_VERSION,
  EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY,
  EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
  type ExecutiveJudgmentContext,
  type ExecutiveJudgmentMetadata,
} from "./index.ts";
import type { ExecutiveJudgmentContextSectionName } from "./executiveJudgmentContextRegistry.ts";

export type ExecutiveJudgmentContextItem = Readonly<{
  id: string;
  label: string;
  description: string;
  source: string;
  references: readonly string[];
  metadataOnly: true;
}>;

export type ExecutiveJudgmentContextPlatformMetadata = Readonly<{
  platformId: string;
  version: string;
  compatible: boolean;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentContextInput = Readonly<{
  contextId?: string;
  workspaceId?: string;
  executiveContextId?: string;
  reasoningPlatformVersion?: string;
  scopeTags?: readonly string[];
  identity?: readonly ExecutiveJudgmentContextItem[];
  intent?: readonly ExecutiveJudgmentContextItem[];
  situation?: readonly ExecutiveJudgmentContextItem[];
  objects?: readonly ExecutiveJudgmentContextItem[];
  relationships?: readonly ExecutiveJudgmentContextItem[];
  kpis?: readonly ExecutiveJudgmentContextItem[];
  risks?: readonly ExecutiveJudgmentContextItem[];
  scenarios?: readonly ExecutiveJudgmentContextItem[];
  timeline?: readonly ExecutiveJudgmentContextItem[];
  executiveMemory?: readonly ExecutiveJudgmentContextItem[];
  recommendations?: readonly ExecutiveJudgmentContextItem[];
  constraints?: readonly ExecutiveJudgmentContextItem[];
  knownAssumptions?: readonly ExecutiveJudgmentContextItem[];
  availableEvidence?: readonly ExecutiveJudgmentContextItem[];
  availableAlternatives?: readonly ExecutiveJudgmentContextItem[];
  sharedMentalModel?: readonly ExecutiveJudgmentContextItem[];
  reasoningMetadata?: readonly ExecutiveJudgmentContextItem[];
  platformMetadata?: readonly ExecutiveJudgmentContextPlatformMetadata[];
}>;

export type NormalizedExecutiveJudgmentContext = Readonly<{
  baseContext: ExecutiveJudgmentContext;
  identity: readonly ExecutiveJudgmentContextItem[];
  intent: readonly ExecutiveJudgmentContextItem[];
  situation: readonly ExecutiveJudgmentContextItem[];
  objects: readonly ExecutiveJudgmentContextItem[];
  relationships: readonly ExecutiveJudgmentContextItem[];
  kpis: readonly ExecutiveJudgmentContextItem[];
  risks: readonly ExecutiveJudgmentContextItem[];
  scenarios: readonly ExecutiveJudgmentContextItem[];
  timeline: readonly ExecutiveJudgmentContextItem[];
  executiveMemory: readonly ExecutiveJudgmentContextItem[];
  recommendations: readonly ExecutiveJudgmentContextItem[];
  constraints: readonly ExecutiveJudgmentContextItem[];
  knownAssumptions: readonly ExecutiveJudgmentContextItem[];
  availableEvidence: readonly ExecutiveJudgmentContextItem[];
  availableAlternatives: readonly ExecutiveJudgmentContextItem[];
  sharedMentalModel: readonly ExecutiveJudgmentContextItem[];
  reasoningMetadata: readonly ExecutiveJudgmentContextItem[];
  platformMetadata: readonly ExecutiveJudgmentContextPlatformMetadata[];
  sectionOrder: readonly ExecutiveJudgmentContextSectionName[];
  deterministic: true;
  metadataOnly: true;
}>;

const SECTION_ORDER: readonly ExecutiveJudgmentContextSectionName[] = Object.freeze([
  "identity",
  "intent",
  "situation",
  "objects",
  "relationships",
  "kpis",
  "risks",
  "scenarios",
  "timeline",
  "executiveMemory",
  "recommendations",
  "constraints",
  "knownAssumptions",
  "availableEvidence",
  "availableAlternatives",
  "sharedMentalModel",
  "reasoningMetadata",
  "platformMetadata",
]);

function metadata(description: string): ExecutiveJudgmentMetadata {
  return Object.freeze({
    source: "APP-JUDGE-2",
    description,
    tags: Object.freeze(["executive-judgment-context", "metadata-only"]),
    apiVersion: EXECUTIVE_JUDGMENT_API_VERSION,
    platformVersion: EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
    metadataOnly: true,
  });
}

function defaultItem(id: string, label: string, source: string): ExecutiveJudgmentContextItem {
  return Object.freeze({ id, label, description: `${label} metadata.`, source, references: Object.freeze([]), metadataOnly: true });
}

function normalizeItems(items: readonly ExecutiveJudgmentContextItem[] = Object.freeze([])): readonly ExecutiveJudgmentContextItem[] {
  const byId = new Map<string, ExecutiveJudgmentContextItem>();
  for (const item of items) {
    const normalized = Object.freeze({
      id: item.id.trim(),
      label: item.label.trim(),
      description: item.description.trim(),
      source: item.source.trim(),
      references: Object.freeze([...new Set(item.references.map((reference) => reference.trim()).filter(Boolean))].sort()),
      metadataOnly: true as const,
    });
    if (normalized.id.length > 0 && !byId.has(normalized.id)) {
      byId.set(normalized.id, normalized);
    }
  }
  return Object.freeze([...byId.values()].sort((left, right) => left.id.localeCompare(right.id)));
}

function normalizePlatforms(platforms: readonly ExecutiveJudgmentContextPlatformMetadata[] = Object.freeze([])): readonly ExecutiveJudgmentContextPlatformMetadata[] {
  const defaultPlatforms = Object.freeze([
    Object.freeze({ platformId: EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.platformId, version: EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.version, compatible: true, metadataOnly: true as const }),
  ]);
  const byId = new Map<string, ExecutiveJudgmentContextPlatformMetadata>();
  for (const platform of [...defaultPlatforms, ...platforms]) {
    const normalized = Object.freeze({
      platformId: platform.platformId.trim(),
      version: platform.version.trim(),
      compatible: platform.compatible,
      metadataOnly: true as const,
    });
    if (normalized.platformId.length > 0 && !byId.has(normalized.platformId)) {
      byId.set(normalized.platformId, normalized);
    }
  }
  return Object.freeze([...byId.values()].sort((left, right) => left.platformId.localeCompare(right.platformId)));
}

export function normalizeExecutiveJudgmentContext(input: ExecutiveJudgmentContextInput = Object.freeze({})): NormalizedExecutiveJudgmentContext {
  const baseContext: ExecutiveJudgmentContext = Object.freeze({
    contextId: input.contextId?.trim() || "executive-judgment-context",
    workspaceId: input.workspaceId?.trim() || "workspace",
    executiveContextId: input.executiveContextId?.trim() || "executive-context",
    reasoningPlatformVersion: input.reasoningPlatformVersion?.trim() || "APP-REASON-4",
    scopeTags: Object.freeze([...(input.scopeTags ?? Object.freeze(["global"]))].map((tag) => tag.trim()).filter(Boolean).sort()),
    metadata: metadata("Normalized Executive Judgment Context."),
  });

  return Object.freeze({
    baseContext,
    identity: normalizeItems(input.identity ?? Object.freeze([defaultItem("identity.default", "Identity", "Identity Platform")])),
    intent: normalizeItems(input.intent ?? Object.freeze([defaultItem("intent.default", "Intent", "Executive Intent")])),
    situation: normalizeItems(input.situation ?? Object.freeze([defaultItem("situation.default", "Situation", "APP")])),
    objects: normalizeItems(input.objects),
    relationships: normalizeItems(input.relationships),
    kpis: normalizeItems(input.kpis),
    risks: normalizeItems(input.risks),
    scenarios: normalizeItems(input.scenarios),
    timeline: normalizeItems(input.timeline),
    executiveMemory: normalizeItems(input.executiveMemory),
    recommendations: normalizeItems(input.recommendations),
    constraints: normalizeItems(input.constraints),
    knownAssumptions: normalizeItems(input.knownAssumptions),
    availableEvidence: normalizeItems(input.availableEvidence),
    availableAlternatives: normalizeItems(input.availableAlternatives),
    sharedMentalModel: normalizeItems(input.sharedMentalModel),
    reasoningMetadata: normalizeItems(input.reasoningMetadata ?? Object.freeze([defaultItem("reasoning.default", "Reasoning Metadata", "Reasoning Platform")])),
    platformMetadata: normalizePlatforms(input.platformMetadata),
    sectionOrder: SECTION_ORDER,
    deterministic: true,
    metadataOnly: true,
  });
}
