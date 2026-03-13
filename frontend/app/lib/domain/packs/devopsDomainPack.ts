import {
  DEFAULT_DOMAIN_ADVICE_CONFIGS,
} from "../domainAdviceExecutiveFraming";
import {
  DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS,
} from "../domainScenarioKpiMapping";
import { createUniversalDomainPackTemplate } from "../domainPackTemplate";

export const DEVOPS_DOMAIN_PROMPT_EXAMPLES = [
  "service dependency failure",
  "database latency",
  "traffic spike",
  "queue backlog",
  "worker bottleneck",
  "cache failure",
  "api instability",
];

export const DEVOPS_DOMAIN_TEMPLATE = createUniversalDomainPackTemplate({
  domainId: "devops",
  label: "DevOps",
  description: "Service dependency, failure propagation, reliability pressure, and resilience decisions.",
  iconHint: "server",
  domainPackId: "devops_resilience_pack",
  defaultDemoId: "devops_dependency_failure_demo",
  defaultProductMode: "devops",
  promptExamples: DEVOPS_DOMAIN_PROMPT_EXAMPLES,
  tags: ["devops", "services", "latency", "resilience", "failure_propagation"],
  visibleNavGroups: ["scene_group", "strategy_group", "risk_group", "memory_group", "executive_group"],
  visibleSections: ["scene", "objects", "focus", "timeline", "advice", "risk_flow", "risk", "memory", "patterns", "executive"],
  scenarioKpiMapping: DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS.devops,
  adviceConfig: DEFAULT_DOMAIN_ADVICE_CONFIGS.devops,
  experienceDefaults: {
    preferredWorkspaceModeId: "analyst",
    preferredCockpitLayoutMode: "expanded",
    preferredRightPanelTab: "risk_flow",
    helperTitle: "See how service pressure moves through dependencies, latency, queues, and recovery paths",
    helperBody: "Focus on failure propagation, service fragility, reliability KPIs, and the next stabilizing action across the runtime system.",
    promptGuideTitle: "Start with a service instability prompt.",
    promptGuideBody: "Prompt -> dependency pressure -> propagated failure path -> reliability KPI impact -> resilience action. Use short prompts tied to latency, outages, queues, traffic, or recovery stress.",
    executiveFramingStyle: "resilience",
    demoLabel: "DevOps Service Resilience Demo",
  },
  vocabulary: [
    { id: "api_gateway", label: "API Gateway", coreRole: "flow", synonyms: ["gateway", "ingress"], tags: ["edge"] },
    { id: "service", label: "Auth Service", coreRole: "node", synonyms: ["service", "runtime"], tags: ["service"] },
    { id: "database", label: "Database", coreRole: "dependency", synonyms: ["db"], tags: ["storage"] },
    { id: "queue", label: "Queue", coreRole: "buffer", synonyms: ["backlog"], tags: ["latency"] },
    { id: "worker", label: "Worker Pool", coreRole: "node", synonyms: ["executor"], tags: ["throughput"] },
    { id: "cache", label: "Cache Layer", coreRole: "buffer", synonyms: ["redis", "cache"], tags: ["resilience"] },
  ],
  scannerHints: [
    {
      entityKeywords: ["service", "api", "gateway", "database", "queue", "worker", "cache", "latency", "timeout", "error", "dependency", "throughput"],
      relationKeywords: ["depends on", "blocks", "calls", "times out", "retries", "queues into", "reads from"],
      loopKeywords: ["pressure", "constraint", "recovery", "cascade", "retry storm", "backlog"],
      tags: ["devops", "runtime", "scanner"],
    },
  ],
  panelDefinitions: [
    { id: "devops_overview_panel", slot: "right", priority: 10, title: "DevOps Overview", tags: ["overview"] },
    { id: "service_dependency_panel", slot: "bottom", priority: 20, title: "Service Dependencies", tags: ["dependencies"] },
    { id: "failure_propagation_panel", slot: "right", priority: 30, title: "Failure Propagation", tags: ["risk"] },
    { id: "reliability_kpi_panel", slot: "right", priority: 40, title: "Reliability KPIs", tags: ["kpi"] },
    { id: "resilience_advice_panel", slot: "right", priority: 50, title: "Resilience Advice", tags: ["advice"] },
  ],
  cockpitDefaults: {
    layoutMode: "expanded",
    summaryBlocks: ["overview", "dependencies", "reliability", "resilience", "action"],
    panelIds: [
      "devops_overview_panel",
      "service_dependency_panel",
      "failure_propagation_panel",
      "reliability_kpi_panel",
      "resilience_advice_panel",
    ],
  },
  demoDefaults: {
    defaultDemoId: "devops_dependency_failure_demo",
    label: "DevOps Service Resilience Demo",
    assetKey: "devops_service_resilience",
    starterWorkspaceLabel: "DevOps Reliability Workspace",
  },
});

export const DEVOPS_DOMAIN_DESCRIPTOR_INPUT = DEVOPS_DOMAIN_TEMPLATE.descriptor;

export const DEVOPS_DOMAIN_PACK_INPUT = DEVOPS_DOMAIN_TEMPLATE.pack;
