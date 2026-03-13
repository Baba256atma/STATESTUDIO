import {
  DEFAULT_DOMAIN_ADVICE_CONFIGS,
} from "../domainAdviceExecutiveFraming";
import {
  DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS,
} from "../domainScenarioKpiMapping";
import { createUniversalDomainPackTemplate } from "../domainPackTemplate";

export const BUSINESS_DOMAIN_PROMPT_EXAMPLES = [
  "supplier delay",
  "demand spike",
  "cash pressure",
  "delivery disruption",
  "inventory stress",
  "customer trust decline",
  "capacity bottleneck",
];

export const BUSINESS_DOMAIN_TEMPLATE = createUniversalDomainPackTemplate({
  domainId: "business",
  label: "Business",
  description: "Business systems workspace for operational flow, fragility, KPI health, and strategic response.",
  iconHint: "briefcase",
  domainPackId: "business_operations_pack",
  defaultDemoId: "business_supply_fragility_demo",
  defaultProductMode: "business",
  promptExamples: BUSINESS_DOMAIN_PROMPT_EXAMPLES,
  tags: ["business", "operations", "flow", "fragility", "continuity"],
  visibleNavGroups: ["scene_group", "strategy_group", "risk_group", "workspace_group", "executive_group"],
  visibleSections: ["scene", "objects", "focus", "timeline", "advice", "conflict", "risk_flow", "risk", "workspace", "executive"],
  scenarioKpiMapping: DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS.business,
  adviceConfig: DEFAULT_DOMAIN_ADVICE_CONFIGS.business,
  experienceDefaults: {
    preferredWorkspaceModeId: "manager",
    preferredCockpitLayoutMode: "expanded",
    preferredRightPanelTab: "executive_dashboard",
    helperTitle: "See how business pressure moves through supply, capacity, fulfillment, and customer trust",
    helperBody: "Focus on business fragility, bottlenecks, KPI stress, and the next stabilizing move across the operating system.",
    promptGuideTitle: "Start with a business system pressure prompt.",
    promptGuideBody: "Prompt -> business pressure -> fragile path -> KPI exposure -> recommended action. Use short prompts tied to operations, demand, cash, or delivery stress.",
    executiveFramingStyle: "operational",
    demoLabel: "Business Operations Fragility Demo",
  },
  vocabulary: [
    { id: "supplier", label: "Supplier", coreRole: "source", synonyms: ["vendor"], tags: ["upstream", "dependency"] },
    { id: "inventory", label: "Capacity Buffer", coreRole: "buffer", synonyms: ["inventory", "buffer"], tags: ["capacity", "resilience"] },
    { id: "operations", label: "Operations", coreRole: "operational_node", synonyms: ["execution"], tags: ["flow", "execution"] },
    { id: "customer_trust", label: "Customer Trust", coreRole: "outcome", synonyms: ["customer outcome"], tags: ["customer", "trust"] },
  ],
  scannerHints: [
    {
      entityKeywords: ["supplier", "inventory", "operations", "delivery", "demand", "cash", "customer trust"],
      relationKeywords: ["depends on", "flows to", "drives", "reduces"],
      loopKeywords: ["pressure", "recovery", "cascade", "bottleneck"],
      tags: ["business", "scanner"],
    },
  ],
  panelDefinitions: [
    { id: "business_overview_panel", slot: "right", priority: 10, title: "Business Overview", tags: ["overview"] },
    { id: "business_risk_panel", slot: "right", priority: 20, title: "Business Risk", tags: ["risk"] },
    { id: "business_operations_panel", slot: "right", priority: 30, title: "Operations Flow", tags: ["operations"] },
    { id: "business_kpi_panel", slot: "right", priority: 40, title: "Business KPIs", tags: ["kpi"] },
    { id: "business_advice_panel", slot: "right", priority: 50, title: "Business Advice", tags: ["advice"] },
  ],
  cockpitDefaults: {
    layoutMode: "expanded",
    summaryBlocks: ["overview", "fragility", "operations", "kpis", "action"],
    panelIds: [
      "business_overview_panel",
      "business_risk_panel",
      "business_operations_panel",
      "business_kpi_panel",
      "business_advice_panel",
    ],
  },
  demoDefaults: {
    defaultDemoId: "business_supply_fragility_demo",
    label: "Business Operations Fragility Demo",
    assetKey: "business_operations_fragility",
    starterWorkspaceLabel: "Business Operations Workspace",
  },
});

export const BUSINESS_DOMAIN_DESCRIPTOR_INPUT = BUSINESS_DOMAIN_TEMPLATE.descriptor;

export const BUSINESS_DOMAIN_PACK_INPUT = BUSINESS_DOMAIN_TEMPLATE.pack;
