import {
  DEFAULT_DOMAIN_ADVICE_CONFIGS,
  type NexoraDomainAdviceConfig,
} from "./domainAdviceExecutiveFraming";
import {
  DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS,
  type NexoraDomainScenarioKpiMapping,
} from "./domainScenarioKpiMapping";
import type { ProductModeId } from "../modes/productModesContract";
import { BUSINESS_DOMAIN_PACK_INPUT } from "./packs/businessDomainPack";
import { FINANCE_DOMAIN_PACK_INPUT } from "./packs/financeDomainPack";
import { DEVOPS_DOMAIN_PACK_INPUT } from "./packs/devopsDomainPack";
import type {
  NexoraDomainCockpitTemplate,
  NexoraDomainDemoTemplate,
  NexoraDomainPanelTemplate,
  NexoraDomainScannerHintTemplate,
  NexoraDomainVocabularyEntry,
} from "./domainPackTemplate";

export type NexoraShellSectionKey =
  | "scene"
  | "objects"
  | "focus"
  | "timeline"
  | "advice"
  | "conflict"
  | "risk_flow"
  | "risk"
  | "replay"
  | "memory"
  | "patterns"
  | "opponent"
  | "collaboration"
  | "workspace"
  | "executive";

export type NexoraNavGroupKey =
  | "scene_group"
  | "strategy_group"
  | "risk_group"
  | "replay_group"
  | "memory_group"
  | "workspace_group"
  | "executive_group";

export interface NexoraDomainPack {
  id: string;
  domainId: string;
  label: string;
  defaultDemoId: string;
  defaultProductMode: "general" | "business" | "finance" | "devops" | "strategy";
  promptExamples: string[];
  panelIds: string[];
  cockpitSummaryBlocks: string[];
  visibleNavGroups: NexoraNavGroupKey[];
  visibleSections: NexoraShellSectionKey[];
  scenarioKpiMapping?: NexoraDomainScenarioKpiMapping | null;
  adviceConfig?: NexoraDomainAdviceConfig | null;
  experienceDefaults?: {
    preferredWorkspaceModeId?: ProductModeId;
    preferredCockpitLayoutMode?: "standard" | "expanded";
    preferredRightPanelTab?:
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
    helperTitle?: string;
    helperBody?: string;
    promptGuideTitle?: string;
    promptGuideBody?: string;
    executiveFramingStyle?: "systemic" | "operational" | "financial" | "resilience" | "strategic";
    demoLabel?: string;
  } | null;
  vocabulary?: NexoraDomainVocabularyEntry[];
  scannerHints?: NexoraDomainScannerHintTemplate[];
  panelDefinitions?: NexoraDomainPanelTemplate[];
  cockpitDefaults?: NexoraDomainCockpitTemplate | null;
  demoDefaults?: NexoraDomainDemoTemplate | null;
  tags: string[];
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function createDomainPack(input: NexoraDomainPack): NexoraDomainPack {
  return {
    ...input,
    promptExamples: uniq(input.promptExamples),
    panelIds: uniq(input.panelIds),
    cockpitSummaryBlocks: uniq(input.cockpitSummaryBlocks),
    vocabulary: Array.isArray(input.vocabulary) ? input.vocabulary : [],
    scannerHints: Array.isArray(input.scannerHints) ? input.scannerHints : [],
    panelDefinitions: Array.isArray(input.panelDefinitions) ? input.panelDefinitions : [],
    tags: uniq(input.tags),
  };
}

export const DEFAULT_DOMAIN_PACKS: Record<string, NexoraDomainPack> = {
  general: createDomainPack({
    id: "general_core_pack",
    domainId: "general",
    label: "General Systems Pack",
    defaultDemoId: "general_systems_demo",
    defaultProductMode: "general",
    promptExamples: [
      "where is the system under pressure",
      "show the weakest dependency path",
      "what intervention would stabilize this system",
    ],
    panelIds: ["general_overview_panel", "general_risk_panel", "general_advice_panel"],
    cockpitSummaryBlocks: ["overview", "risk", "action"],
    visibleNavGroups: ["scene_group", "strategy_group", "risk_group", "workspace_group", "executive_group"],
    visibleSections: ["scene", "objects", "focus", "timeline", "advice", "conflict", "risk_flow", "risk", "workspace", "executive"],
    scenarioKpiMapping: null,
    adviceConfig: null,
    tags: ["general", "core", "systems"],
  }),
  business: createDomainPack(BUSINESS_DOMAIN_PACK_INPUT),
  finance: createDomainPack(FINANCE_DOMAIN_PACK_INPUT),
  devops: createDomainPack(DEVOPS_DOMAIN_PACK_INPUT),
  strategy: createDomainPack({
    id: "strategy_competition_pack",
    domainId: "strategy",
    label: "Strategy Intelligence Pack",
    defaultDemoId: "strategy_market_pressure_demo",
    defaultProductMode: "strategy",
    promptExamples: ["competitor pricing pressure", "market share decline", "strategic response options", "channel conflict"],
    panelIds: ["strategy_overview_panel", "strategy_advice_panel", "strategy_exec_panel"],
    cockpitSummaryBlocks: ["overview", "position", "alternatives", "action"],
    visibleNavGroups: ["scene_group", "strategy_group", "risk_group", "memory_group", "executive_group"],
    visibleSections: ["scene", "objects", "timeline", "advice", "conflict", "risk", "memory", "opponent", "patterns", "executive"],
    scenarioKpiMapping: DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS.strategy,
    adviceConfig: DEFAULT_DOMAIN_ADVICE_CONFIGS.strategy,
    tags: ["strategy", "competition", "market"],
  }),
};

export function listDomainPacks(): NexoraDomainPack[] {
  return Object.values(DEFAULT_DOMAIN_PACKS);
}

export function getDomainPack(domainId?: string | null): NexoraDomainPack {
  const normalized = String(domainId ?? "").trim().toLowerCase();
  return DEFAULT_DOMAIN_PACKS[normalized] ?? DEFAULT_DOMAIN_PACKS.general;
}
