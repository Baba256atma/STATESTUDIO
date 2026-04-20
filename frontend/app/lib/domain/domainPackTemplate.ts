import type { ProductModeId } from "../modes/productModesContract";
import type { NexoraDomainAdviceConfig } from "./domainAdviceExecutiveFraming";
import type { NexoraDomainScenarioKpiMapping } from "./domainScenarioKpiMapping";
import type { NexoraDomainDescriptor } from "./domainSelectionRegistry";
import type {
  NexoraDomainPack,
  NexoraNavGroupKey,
  NexoraShellSectionKey,
} from "./domainPackRegistry";

export type NexoraDomainRightPanelDefault =
  | "timeline"
  | "conflict"
  | "object_focus"
  | "memory_insights"
  | "risk_flow"
  | "replay"
  | "strategic_advice"
  | "opponent_moves"
  | "strategic_patterns"
  | "executive_dashboard"
  | "collaboration"
  | "workspace";

export type NexoraTemplateExecutiveFramingStyle =
  | "systemic"
  | "operational"
  | "financial"
  | "resilience"
  | "strategic";

export interface NexoraDomainVocabularyEntry {
  id: string;
  label: string;
  coreRole: string;
  description?: string;
  synonyms?: string[];
  tags?: string[];
}

export interface NexoraDomainScannerHintTemplate {
  sourceType?: string;
  entityKeywords?: string[];
  relationKeywords?: string[];
  loopKeywords?: string[];
  tags?: string[];
}

export interface NexoraDomainPanelTemplate {
  id: string;
  slot?: "left" | "right" | "bottom" | "top" | "center";
  priority?: number;
  title?: string;
  tags?: string[];
}

export interface NexoraDomainCockpitTemplate {
  summaryBlocks: string[];
  layoutMode?: "standard" | "expanded";
  panelIds?: string[];
}

export interface NexoraDomainDemoTemplate {
  defaultDemoId: string;
  label?: string;
  assetKey?: string;
  starterWorkspaceLabel?: string;
  notes?: string[];
}

export interface NexoraDomainExperienceDefaultsTemplate {
  preferredWorkspaceModeId: ProductModeId;
  preferredCockpitLayoutMode?: "standard" | "expanded";
  preferredRightPanelTab?: NexoraDomainRightPanelDefault;
  helperTitle: string;
  helperBody: string;
  promptGuideTitle: string;
  promptGuideBody: string;
  executiveFramingStyle: NexoraTemplateExecutiveFramingStyle;
  demoLabel?: string;
  /** Live-demo framing (optional; surfaced in shell, no new backend fields). */
  demoScenarioTitle?: string;
  demoBusinessContext?: string;
  demoDecisionQuestion?: string;
}

export interface NexoraUniversalDomainPackTemplate {
  descriptor: NexoraDomainDescriptor;
  pack: NexoraDomainPack;
  sections: {
    vocabulary: NexoraDomainVocabularyEntry[];
    prompts: string[];
    scenarios: string[];
    kpis: string[];
    scannerHints: NexoraDomainScannerHintTemplate[];
    panels: NexoraDomainPanelTemplate[];
    cockpit: NexoraDomainCockpitTemplate;
    advice: NexoraDomainAdviceConfig | null;
    demo: NexoraDomainDemoTemplate;
  };
  notes: string[];
}

export interface CreateUniversalDomainPackTemplateInput {
  domainId: string;
  label: string;
  description: string;
  iconHint?: string;
  domainPackId: string;
  defaultDemoId: string;
  defaultProductMode: "general" | "business" | "finance" | "devops" | "strategy";
  promptExamples: string[];
  tags?: string[];
  visibleNavGroups?: NexoraNavGroupKey[];
  visibleSections?: NexoraShellSectionKey[];
  scenarioKpiMapping?: NexoraDomainScenarioKpiMapping | null;
  adviceConfig?: NexoraDomainAdviceConfig | null;
  experienceDefaults: NexoraDomainExperienceDefaultsTemplate;
  vocabulary?: NexoraDomainVocabularyEntry[];
  scannerHints?: NexoraDomainScannerHintTemplate[];
  panelDefinitions?: NexoraDomainPanelTemplate[];
  cockpitDefaults?: NexoraDomainCockpitTemplate;
  demoDefaults?: Partial<NexoraDomainDemoTemplate>;
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function normalizeVocabulary(
  vocabulary?: NexoraDomainVocabularyEntry[]
): NexoraDomainVocabularyEntry[] {
  if (!Array.isArray(vocabulary)) return [];
  return vocabulary.map((entry) => ({
    id: String(entry.id).trim(),
    label: String(entry.label).trim(),
    coreRole: String(entry.coreRole).trim(),
    ...(entry.description ? { description: String(entry.description).trim() } : {}),
    synonyms: uniq((entry.synonyms ?? []).map(String)),
    tags: uniq((entry.tags ?? []).map(String)),
  }));
}

function normalizeScannerHints(
  scannerHints?: NexoraDomainScannerHintTemplate[]
): NexoraDomainScannerHintTemplate[] {
  if (!Array.isArray(scannerHints)) return [];
  return scannerHints.map((hint) => ({
    ...(hint.sourceType ? { sourceType: String(hint.sourceType).trim() } : {}),
    entityKeywords: uniq((hint.entityKeywords ?? []).map(String)),
    relationKeywords: uniq((hint.relationKeywords ?? []).map(String)),
    loopKeywords: uniq((hint.loopKeywords ?? []).map(String)),
    tags: uniq((hint.tags ?? []).map(String)),
  }));
}

function normalizePanels(panelDefinitions?: NexoraDomainPanelTemplate[]): NexoraDomainPanelTemplate[] {
  if (!Array.isArray(panelDefinitions)) return [];
  return panelDefinitions.map((panel) => ({
    id: String(panel.id).trim(),
    ...(panel.slot ? { slot: panel.slot } : {}),
    ...(Number.isFinite(Number(panel.priority)) ? { priority: Number(panel.priority) } : {}),
    ...(panel.title ? { title: String(panel.title).trim() } : {}),
    tags: uniq((panel.tags ?? []).map(String)),
  }));
}

export function createUniversalDomainPackTemplate(
  input: CreateUniversalDomainPackTemplateInput
): NexoraUniversalDomainPackTemplate {
  const promptExamples = uniq((input.promptExamples ?? []).map(String));
  const vocabulary = normalizeVocabulary(input.vocabulary);
  const scannerHints = normalizeScannerHints(input.scannerHints);
  const panels = normalizePanels(input.panelDefinitions);
  const cockpit: NexoraDomainCockpitTemplate = {
    summaryBlocks: uniq(
      (input.cockpitDefaults?.summaryBlocks ??
        input.panelDefinitions?.map((panel) => panel.id) ??
        []
      ).map(String)
    ),
    ...(input.cockpitDefaults?.layoutMode ? { layoutMode: input.cockpitDefaults.layoutMode } : {}),
    panelIds: uniq(
      (
        input.cockpitDefaults?.panelIds ??
        panels.map((panel) => panel.id)
      ).map(String)
    ),
  };
  const demo: NexoraDomainDemoTemplate = {
    defaultDemoId: input.defaultDemoId,
    label: input.demoDefaults?.label ?? input.experienceDefaults.demoLabel ?? `${input.label} Demo`,
    ...(input.demoDefaults?.assetKey ? { assetKey: input.demoDefaults.assetKey } : {}),
    ...(input.demoDefaults?.starterWorkspaceLabel
      ? { starterWorkspaceLabel: input.demoDefaults.starterWorkspaceLabel }
      : {}),
    notes: uniq((input.demoDefaults?.notes ?? []).map(String)),
  };

  const descriptor: NexoraDomainDescriptor = {
    id: input.domainId,
    label: input.label,
    description: input.description,
    ...(input.iconHint ? { iconHint: input.iconHint } : {}),
    domainPackId: input.domainPackId,
    defaultDemoId: input.defaultDemoId,
    defaultProductMode: input.defaultProductMode,
    promptExamples,
    tags: uniq((input.tags ?? []).map(String)),
  };

  const pack: NexoraDomainPack = {
    id: input.domainPackId,
    domainId: input.domainId,
    label: `${input.label} Pack`,
    defaultDemoId: input.defaultDemoId,
    defaultProductMode: input.defaultProductMode,
    promptExamples,
    panelIds: uniq(panels.map((panel) => panel.id)),
    cockpitSummaryBlocks: cockpit.summaryBlocks,
    visibleNavGroups: input.visibleNavGroups ?? ["scene_group", "strategy_group", "risk_group", "executive_group"],
    visibleSections: input.visibleSections ?? ["scene", "objects", "timeline", "advice", "risk", "executive"],
    scenarioKpiMapping: input.scenarioKpiMapping ?? null,
    adviceConfig: input.adviceConfig ?? null,
    experienceDefaults: {
      preferredWorkspaceModeId: input.experienceDefaults.preferredWorkspaceModeId,
      ...(input.experienceDefaults.preferredCockpitLayoutMode
        ? { preferredCockpitLayoutMode: input.experienceDefaults.preferredCockpitLayoutMode }
        : {}),
      ...(input.experienceDefaults.preferredRightPanelTab
        ? { preferredRightPanelTab: input.experienceDefaults.preferredRightPanelTab }
        : {}),
      helperTitle: input.experienceDefaults.helperTitle,
      helperBody: input.experienceDefaults.helperBody,
      promptGuideTitle: input.experienceDefaults.promptGuideTitle,
      promptGuideBody: input.experienceDefaults.promptGuideBody,
      executiveFramingStyle: input.experienceDefaults.executiveFramingStyle,
      ...(input.experienceDefaults.demoLabel ? { demoLabel: input.experienceDefaults.demoLabel } : {}),
      ...(input.experienceDefaults.demoScenarioTitle
        ? { demoScenarioTitle: input.experienceDefaults.demoScenarioTitle }
        : {}),
      ...(input.experienceDefaults.demoBusinessContext
        ? { demoBusinessContext: input.experienceDefaults.demoBusinessContext }
        : {}),
      ...(input.experienceDefaults.demoDecisionQuestion
        ? { demoDecisionQuestion: input.experienceDefaults.demoDecisionQuestion }
        : {}),
    },
    vocabulary,
    scannerHints,
    panelDefinitions: panels,
    cockpitDefaults: cockpit,
    demoDefaults: demo,
    tags: uniq((input.tags ?? []).map(String)),
  };

  return {
    descriptor,
    pack,
    sections: {
      vocabulary,
      prompts: promptExamples,
      scenarios: uniq((input.scenarioKpiMapping?.scenarios ?? []).map((scenario) => scenario.id)),
      kpis: uniq((input.scenarioKpiMapping?.kpis ?? []).map((kpi) => kpi.id)),
      scannerHints,
      panels,
      cockpit,
      advice: input.adviceConfig ?? null,
      demo,
    },
    notes: [
      "Universal domain pack template applied.",
      vocabulary.length > 0 ? `Vocabulary: ${vocabulary.length} entries.` : "Vocabulary omitted.",
      scannerHints.length > 0 ? `Scanner hints: ${scannerHints.length}.` : "Scanner hints omitted.",
    ],
  };
}
