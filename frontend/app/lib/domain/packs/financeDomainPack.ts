import {
  DEFAULT_DOMAIN_ADVICE_CONFIGS,
} from "../domainAdviceExecutiveFraming";
import {
  DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS,
} from "../domainScenarioKpiMapping";
import { createUniversalDomainPackTemplate } from "../domainPackTemplate";

export const FINANCE_DOMAIN_PROMPT_EXAMPLES = [
  "liquidity stress",
  "market volatility spike",
  "leverage increase",
  "asset price drop",
  "portfolio exposure risk",
  "credit pressure rising",
  "systemic risk",
];

export const FINANCE_DOMAIN_TEMPLATE = createUniversalDomainPackTemplate({
  domainId: "finance",
  label: "Financial Risk",
  description: "Analyze market fragility, liquidity stress, portfolio exposure, and capital resilience.",
  iconHint: "chart",
  domainPackId: "finance_liquidity_pack",
  defaultDemoId: "finance_market_fragility_demo",
  defaultProductMode: "finance",
  promptExamples: FINANCE_DOMAIN_PROMPT_EXAMPLES,
  tags: ["finance", "markets", "liquidity", "portfolio", "fragility"],
  visibleNavGroups: ["scene_group", "strategy_group", "risk_group", "replay_group", "executive_group"],
  visibleSections: ["scene", "objects", "timeline", "advice", "conflict", "risk_flow", "risk", "replay", "executive"],
  scenarioKpiMapping: DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS.finance,
  adviceConfig: DEFAULT_DOMAIN_ADVICE_CONFIGS.finance,
  experienceDefaults: {
    preferredWorkspaceModeId: "analyst",
    preferredCockpitLayoutMode: "expanded",
    preferredRightPanelTab: "executive_dashboard",
    helperTitle: "See how exposure, liquidity, leverage, and volatility interact across a financial system",
    helperBody: "Focus on market fragility, portfolio exposure, funding stress, and the next stabilizing action across the financial network.",
    promptGuideTitle: "Start with a financial stress prompt.",
    promptGuideBody: "Prompt -> financial pressure -> propagation path -> portfolio and liquidity KPI impact -> stabilizing action. Use short prompts tied to volatility, leverage, credit, liquidity, or selloff risk.",
    executiveFramingStyle: "financial",
    demoLabel: "Finance Market Fragility Demo",
  },
  vocabulary: [
    { id: "market_demand", label: "Market Demand", coreRole: "support", synonyms: ["sentiment", "flow"], tags: ["market"] },
    { id: "asset_price", label: "Asset Price", coreRole: "flow", synonyms: ["valuation", "price"], tags: ["market"] },
    { id: "liquidity", label: "Liquidity", coreRole: "buffer", synonyms: ["funding", "market depth"], tags: ["funding"] },
    { id: "portfolio_exposure", label: "Portfolio Exposure", coreRole: "node", synonyms: ["book", "positioning"], tags: ["risk"] },
    { id: "leverage", label: "Leverage", coreRole: "constraint", synonyms: ["margin", "gearing"], tags: ["amplification"] },
    { id: "credit_pressure", label: "Credit Pressure", coreRole: "risk", synonyms: ["spread", "credit stress"], tags: ["funding"] },
  ],
  scannerHints: [
    {
      entityKeywords: ["asset", "market", "liquidity", "leverage", "volatility", "credit", "capital", "portfolio", "exposure", "demand"],
      relationKeywords: ["exposes", "signals", "drives", "transfers risk", "tightens", "widens"],
      loopKeywords: ["cascade", "constraint", "pressure", "contagion", "selloff"],
      tags: ["finance", "markets", "scanner"],
    },
  ],
  panelDefinitions: [
    { id: "finance_overview_panel", slot: "right", priority: 10, title: "Finance Overview", tags: ["overview"] },
    { id: "portfolio_risk_panel", slot: "right", priority: 20, title: "Portfolio Risk", tags: ["risk"] },
    { id: "liquidity_panel", slot: "right", priority: 30, title: "Liquidity", tags: ["liquidity"] },
    { id: "volatility_panel", slot: "right", priority: 40, title: "Volatility", tags: ["volatility"] },
    { id: "financial_advice_panel", slot: "right", priority: 50, title: "Financial Advice", tags: ["advice"] },
  ],
  cockpitDefaults: {
    layoutMode: "expanded",
    summaryBlocks: ["overview", "exposure", "liquidity", "fragility", "action"],
    panelIds: [
      "finance_overview_panel",
      "portfolio_risk_panel",
      "liquidity_panel",
      "volatility_panel",
      "financial_advice_panel",
    ],
  },
  demoDefaults: {
    defaultDemoId: "finance_market_fragility_demo",
    label: "Finance Market Fragility Demo",
    assetKey: "finance_market_fragility",
    starterWorkspaceLabel: "Finance Risk Workspace",
  },
});

export const FINANCE_DOMAIN_DESCRIPTOR_INPUT = FINANCE_DOMAIN_TEMPLATE.descriptor;

export const FINANCE_DOMAIN_PACK_INPUT = FINANCE_DOMAIN_TEMPLATE.pack;
