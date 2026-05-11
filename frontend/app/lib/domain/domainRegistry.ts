import type {
  DomainObjectTemplate,
  DomainPanelVocabulary,
  DomainRelationshipTemplate,
  DomainRiskSignal,
  NexoraDomainDefinition,
  NexoraDomainId,
} from "./domainTypes.ts";

const DEFAULT_DOMAIN_ID: NexoraDomainId = "general";

const baseRelationships: DomainRelationshipTemplate[] = [
  {
    id: "input_to_process",
    fromRole: "input",
    toRole: "process",
    relationshipType: "flow",
    description: "Inputs move into the main operating process.",
    strength: 0.7,
    directional: true,
    visualPriority: "medium",
  },
  {
    id: "process_to_output",
    fromRole: "process",
    toRole: "output",
    relationshipType: "flow",
    description: "Operating process produces downstream output.",
    strength: 0.68,
    directional: true,
    visualPriority: "medium",
  },
  {
    id: "constraint_to_process",
    fromRole: "constraint",
    toRole: "process",
    relationshipType: "constraint",
    description: "Constraints limit or shape the process.",
    strength: 0.62,
    directional: true,
    visualPriority: "medium",
  },
  {
    id: "risk_to_decision",
    fromRole: "risk",
    toRole: "decision",
    relationshipType: "risk_path",
    description: "Risk signals inform the decision path.",
    strength: 0.74,
    directional: true,
    visualPriority: "high",
  },
  {
    id: "monitor_to_core",
    fromRole: "monitor",
    toRole: "core",
    relationshipType: "feedback",
    description: "Monitoring feeds intelligence back into the core system.",
    strength: 0.55,
    directional: true,
    visualPriority: "low",
  },
];

const processFlowRelationship: DomainRelationshipTemplate = {
  id: "process_to_process_flow",
  fromRole: "process",
  toRole: "process",
  relationshipType: "flow",
  description: "Sequential operating processes pass flow downstream.",
  strength: 0.58,
  directional: true,
  visualPriority: "low",
};

const outputRiskRelationship: DomainRelationshipTemplate = {
  id: "output_to_risk_path",
  fromRole: "output",
  toRole: "risk",
  relationshipType: "risk_path",
  description: "Output weakness can surface as downstream risk.",
  strength: 0.6,
  directional: true,
  visualPriority: "medium",
};

const generalPanelVocabulary: DomainPanelVocabulary = {
  executiveLabel: "Executive View",
  riskLabel: "System Risk",
  scenarioLabel: "Scenario",
  decisionLabel: "Decision",
  objectLabel: "Object",
  primaryQuestion: "What pressure matters most in this system?",
};

function objectTemplate(
  id: string,
  label: string,
  role: DomainObjectTemplate["role"],
  description: string,
  aliases: string[],
  defaultImportance = 0.55
): DomainObjectTemplate {
  return {
    id,
    label,
    role,
    description,
    defaultImportance,
    aliases,
  };
}

function riskSignal(
  id: string,
  label: string,
  severityHint: DomainRiskSignal["severityHint"],
  aliases: string[],
  explanation: string
): DomainRiskSignal {
  return {
    id,
    label,
    severityHint,
    aliases,
    explanation,
  };
}

function defineDomain(input: NexoraDomainDefinition): NexoraDomainDefinition {
  return {
    ...input,
    objectTemplates: input.objectTemplates.map((template) => ({
      ...template,
      aliases: Array.from(new Set(template.aliases.map((alias) => alias.trim()).filter(Boolean))),
    })),
    relationshipTemplates: input.relationshipTemplates.map((template) => ({ ...template })),
    riskSignals: input.riskSignals.map((signal) => ({
      ...signal,
      aliases: Array.from(new Set(signal.aliases.map((alias) => alias.trim()).filter(Boolean))),
    })),
  };
}

export const NEXORA_DOMAIN_REGISTRY: Record<NexoraDomainId, NexoraDomainDefinition> = {
  general: defineDomain({
    id: "general",
    name: "General",
    description: "Shared systems vocabulary for pressure, flow, risk, decisions, and outputs.",
    objectTemplates: [
      objectTemplate("general_core_system", "Core System", "core", "The central system being modeled.", ["core", "system", "platform"], 0.8),
      objectTemplate("general_input", "Input", "input", "A signal, resource, or demand entering the system.", ["input", "source", "demand"]),
      objectTemplate("general_process", "Process", "process", "The main transformation or operating flow.", ["process", "workflow", "operation"]),
      objectTemplate("general_constraint", "Constraint", "constraint", "A limit that shapes system behavior.", ["constraint", "limit", "blocker"]),
      objectTemplate("general_risk", "Risk", "risk", "A pressure or fragility signal.", ["risk", "issue", "fragility"]),
      objectTemplate("general_decision", "Decision", "decision", "A choice point or intervention gate.", ["decision", "choice", "gate"]),
      objectTemplate("general_output", "Output", "output", "A result or downstream outcome.", ["output", "outcome", "result"]),
    ],
    relationshipTemplates: [...baseRelationships, processFlowRelationship, outputRiskRelationship],
    riskSignals: [
      riskSignal("general_delay", "Delay", "medium", ["delay", "late", "blocked"], "Timing pressure may propagate through dependencies."),
      riskSignal("general_bottleneck", "Bottleneck", "high", ["bottleneck", "capacity", "constraint"], "A constrained node may limit system throughput."),
      riskSignal("general_volatility", "Volatility", "medium", ["volatility", "variance", "instability"], "Unstable inputs may reduce forecast and execution confidence."),
    ],
    panelVocabulary: generalPanelVocabulary,
  }),
  retail: defineDomain({
    id: "retail",
    name: "Retail",
    description: "Retail operating model for demand, inventory, fulfillment, pricing, and margin risk.",
    objectTemplates: [
      objectTemplate("retail_customer_demand", "Customer Demand", "input", "Demand signal from customers and channels.", ["customer", "demand", "traffic"], 0.75),
      objectTemplate("retail_inventory", "Inventory", "process", "Available stock and replenishment buffer.", ["inventory", "stock", "warehouse"], 0.78),
      objectTemplate("retail_supplier", "Supplier", "input", "Upstream vendor or replenishment source.", ["supplier", "vendor", "procurement"], 0.7),
      objectTemplate("retail_pricing", "Pricing", "decision", "Price and promotion decision surface.", ["pricing", "price", "promotion"]),
      objectTemplate("retail_store_operations", "Store Operations", "process", "Store or channel execution operations.", ["store", "ops", "operations"]),
      objectTemplate("retail_fulfillment", "Fulfillment", "output", "Customer delivery and order completion.", ["fulfillment", "delivery", "shipment"], 0.72),
      objectTemplate("retail_margin_risk", "Margin Risk", "risk", "Margin pressure from cost, pricing, or markdowns.", ["margin", "markdown", "cost risk"], 0.68),
    ],
    relationshipTemplates: [...baseRelationships, processFlowRelationship],
    riskSignals: [
      riskSignal("retail_stockout", "Stockout Risk", "high", ["stockout", "out of stock", "oos"], "Demand may exceed available inventory."),
      riskSignal("retail_margin_pressure", "Margin Pressure", "medium", ["margin", "markdown", "promotion cost"], "Price or cost pressure may erode contribution."),
      riskSignal("retail_fulfillment_delay", "Fulfillment Delay", "medium", ["fulfillment delay", "late delivery", "carrier miss"], "Delivery misses may affect customer experience."),
    ],
    panelVocabulary: {
      executiveLabel: "Retail Executive View",
      riskLabel: "Retail Risk",
      scenarioLabel: "Retail Scenario",
      decisionLabel: "Merchandising Decision",
      objectLabel: "Retail Node",
      primaryQuestion: "Where is retail flow most exposed?",
    },
  }),
  finance: defineDomain({
    id: "finance",
    name: "Finance",
    description: "Finance model for revenue, costs, cash flow, exposure, forecasts, and compliance risk.",
    objectTemplates: [
      objectTemplate("finance_revenue", "Revenue", "input", "Income stream and growth signal.", ["revenue", "sales", "income"], 0.75),
      objectTemplate("finance_cost_structure", "Cost Structure", "constraint", "Fixed and variable cost pressure.", ["cost", "opex", "expense"], 0.72),
      objectTemplate("finance_cash_flow", "Cash Flow", "process", "Cash movement and liquidity posture.", ["cash", "cash flow", "liquidity"], 0.82),
      objectTemplate("finance_exposure", "Exposure", "risk", "Market, credit, or concentration exposure.", ["exposure", "drawdown", "risk"], 0.72),
      objectTemplate("finance_forecast", "Forecast", "monitor", "Forward-looking financial signal.", ["forecast", "projection", "outlook"]),
      objectTemplate("finance_compliance_risk", "Compliance Risk", "risk", "Regulatory or policy risk signal.", ["compliance", "regulatory", "audit"], 0.68),
      objectTemplate("finance_decision_gate", "Decision Gate", "decision", "Capital allocation or approval gate.", ["decision", "approval", "capital gate"]),
    ],
    relationshipTemplates: [...baseRelationships, processFlowRelationship],
    riskSignals: [
      riskSignal("finance_liquidity_stress", "Liquidity Stress", "high", ["cash shortage", "liquidity", "working capital"], "Cash constraints may limit operating options."),
      riskSignal("finance_margin_compression", "Margin Compression", "medium", ["margin", "spread", "compression"], "Cost or pricing pressure may reduce profit headroom."),
      riskSignal("finance_compliance_gap", "Compliance Gap", "high", ["compliance", "regulatory", "audit gap"], "Policy or regulatory gaps may create downside exposure."),
    ],
    panelVocabulary: {
      executiveLabel: "Finance Executive View",
      riskLabel: "Financial Risk",
      scenarioLabel: "Finance Scenario",
      decisionLabel: "Capital Decision",
      objectLabel: "Finance Node",
      primaryQuestion: "Which financial exposure has the highest consequence?",
    },
  }),
  supply_chain: defineDomain({
    id: "supply_chain",
    name: "Supply Chain",
    description: "Supply chain model for suppliers, inventory, production, logistics, lead time, and delivery risk.",
    objectTemplates: [
      objectTemplate("supply_chain_supplier", "Supplier", "input", "Upstream supplier or source dependency.", ["supplier", "vendor", "source"], 0.82),
      objectTemplate("supply_chain_inventory", "Inventory", "process", "Stock buffer and material availability.", ["inventory", "stock", "safety stock"], 0.78),
      objectTemplate("supply_chain_production", "Production", "process", "Manufacturing or transformation step.", ["production", "manufacturing", "plant"], 0.7),
      objectTemplate("supply_chain_logistics", "Logistics", "process", "Transport and network movement.", ["logistics", "transport", "freight"], 0.7),
      objectTemplate("supply_chain_lead_time", "Lead Time", "monitor", "Timing signal across the chain.", ["lead time", "cycle time", "transit time"], 0.68),
      objectTemplate("supply_chain_bottleneck", "Bottleneck", "constraint", "Capacity or flow restriction.", ["bottleneck", "capacity", "constraint"], 0.76),
      objectTemplate("supply_chain_delivery_risk", "Delivery Risk", "risk", "Downstream delivery reliability risk.", ["delivery risk", "delay", "late shipment"], 0.75),
    ],
    relationshipTemplates: [...baseRelationships, processFlowRelationship],
    riskSignals: [
      riskSignal("supply_chain_supplier_delay", "Supplier Delay", "high", ["supplier delay", "vendor delay", "late material"], "Upstream delay may cascade into fulfillment."),
      riskSignal("supply_chain_inventory_shortage", "Inventory Shortage", "high", ["shortage", "low stock", "stockout"], "Buffer weakness can amplify demand or supply shocks."),
      riskSignal("supply_chain_logistics_disruption", "Logistics Disruption", "medium", ["port congestion", "freight delay", "carrier"], "Transport disruption may extend lead time."),
    ],
    panelVocabulary: {
      executiveLabel: "Supply Chain Executive View",
      riskLabel: "Supply Risk",
      scenarioLabel: "Supply Chain Scenario",
      decisionLabel: "Flow Decision",
      objectLabel: "Supply Node",
      primaryQuestion: "Where can disruption propagate fastest?",
    },
  }),
  pmo: defineDomain({
    id: "pmo",
    name: "PMO",
    description: "Project and portfolio model for scope, timeline, budget, resources, dependencies, and delivery risk.",
    objectTemplates: [
      objectTemplate("pmo_scope", "Scope", "input", "Committed work and requirement boundary.", ["scope", "requirements", "work package"], 0.72),
      objectTemplate("pmo_timeline", "Timeline", "constraint", "Schedule and milestone pressure.", ["timeline", "schedule", "milestone"], 0.78),
      objectTemplate("pmo_budget", "Budget", "constraint", "Funding and spend capacity.", ["budget", "cost", "funding"], 0.74),
      objectTemplate("pmo_resource_capacity", "Resource Capacity", "process", "Team and capacity availability.", ["resources", "capacity", "team"], 0.74),
      objectTemplate("pmo_dependency", "Dependency", "process", "Cross-team or external dependency.", ["dependency", "handoff", "blocker"], 0.75),
      objectTemplate("pmo_change_request", "Change Request", "decision", "Scope or plan change decision.", ["change request", "change", "cr"]),
      objectTemplate("pmo_delivery_risk", "Delivery Risk", "risk", "Risk to milestone or delivery outcome.", ["delivery risk", "delay", "slippage"], 0.76),
    ],
    relationshipTemplates: [...baseRelationships, processFlowRelationship, outputRiskRelationship],
    riskSignals: [
      riskSignal("pmo_schedule_slip", "Schedule Slip", "high", ["timeline slip", "schedule slip", "milestone delay"], "Schedule movement may affect downstream commitments."),
      riskSignal("pmo_budget_pressure", "Budget Pressure", "medium", ["budget", "overrun", "cost pressure"], "Spend pressure can constrain execution choices."),
      riskSignal("pmo_capacity_gap", "Capacity Gap", "high", ["capacity", "resourcing", "understaffed"], "Resource gaps may create delivery fragility."),
    ],
    panelVocabulary: {
      executiveLabel: "PMO Executive View",
      riskLabel: "Delivery Risk",
      scenarioLabel: "Project Scenario",
      decisionLabel: "Portfolio Decision",
      objectLabel: "Project Node",
      primaryQuestion: "Which project constraint threatens delivery most?",
    },
  }),
  saas_devops: defineDomain({
    id: "saas_devops",
    name: "SaaS / DevOps",
    description: "SaaS operations model for users, services, deployments, infrastructure, incidents, and reliability risk.",
    objectTemplates: [
      objectTemplate("saas_devops_users", "Users", "input", "Customers or users consuming the service.", ["users", "customers", "traffic"], 0.7),
      objectTemplate("saas_devops_service", "Service", "core", "Primary software service or product surface.", ["service", "app", "platform"], 0.82),
      objectTemplate("saas_devops_deployment", "Deployment", "process", "Release and deployment process.", ["deployment", "release", "deploy"], 0.7),
      objectTemplate("saas_devops_infrastructure", "Infrastructure", "process", "Runtime infrastructure and dependencies.", ["infrastructure", "cloud", "cluster"], 0.76),
      objectTemplate("saas_devops_incident", "Incident", "risk", "Operational incident or failure signal.", ["incident", "outage", "failure"], 0.78),
      objectTemplate("saas_devops_latency", "Latency", "monitor", "Performance and response time signal.", ["latency", "slow", "p95"], 0.72),
      objectTemplate("saas_devops_reliability_risk", "Reliability Risk", "risk", "Availability or resilience risk.", ["reliability", "availability", "sla"], 0.76),
    ],
    relationshipTemplates: baseRelationships,
    riskSignals: [
      riskSignal("saas_devops_incident_spike", "Incident Spike", "high", ["incident", "outage", "sev"], "Operational failures may affect users and reliability."),
      riskSignal("saas_devops_latency_rise", "Latency Rise", "medium", ["latency", "slow", "p95", "timeout"], "Performance degradation may signal infrastructure pressure."),
      riskSignal("saas_devops_deploy_regression", "Deploy Regression", "high", ["regression", "rollback", "bad deploy"], "Release issues may trigger service instability."),
    ],
    panelVocabulary: {
      executiveLabel: "SaaS Operations View",
      riskLabel: "Reliability Risk",
      scenarioLabel: "Reliability Scenario",
      decisionLabel: "Operations Decision",
      objectLabel: "Service Node",
      primaryQuestion: "Which reliability signal threatens users most?",
    },
  }),
  security: defineDomain({
    id: "security",
    name: "Security",
    description: "Security model for assets, identity, access paths, vulnerabilities, threats, controls, and exposure risk.",
    objectTemplates: [
      objectTemplate("security_asset", "Asset", "core", "Protected system, data, or service.", ["asset", "system", "data"], 0.8),
      objectTemplate("security_identity", "Identity", "input", "User, service account, or identity surface.", ["identity", "account", "principal"], 0.74),
      objectTemplate("security_access_path", "Access Path", "process", "Route through which access occurs.", ["access", "path", "permission"], 0.76),
      objectTemplate("security_vulnerability", "Vulnerability", "risk", "Known weakness or exposure point.", ["vulnerability", "cve", "weakness"], 0.82),
      objectTemplate("security_threat", "Threat", "input", "Threat actor or attack pressure.", ["threat", "attack", "adversary"], 0.78),
      objectTemplate("security_control", "Control", "constraint", "Preventive or detective safeguard.", ["control", "mitigation", "policy"], 0.72),
      objectTemplate("security_exposure_risk", "Exposure Risk", "risk", "Potential impact from vulnerable exposure.", ["exposure", "breach", "risk"], 0.78),
    ],
    relationshipTemplates: baseRelationships,
    riskSignals: [
      riskSignal("security_unpatched_vulnerability", "Unpatched Vulnerability", "high", ["vulnerability", "unpatched", "cve"], "Known weakness may increase exposure."),
      riskSignal("security_excess_access", "Excess Access", "high", ["access", "permission", "privilege"], "Overbroad access can widen blast radius."),
      riskSignal("security_control_gap", "Control Gap", "medium", ["control gap", "missing control", "policy gap"], "Missing safeguards may reduce resilience."),
    ],
    panelVocabulary: {
      executiveLabel: "Security Executive View",
      riskLabel: "Security Risk",
      scenarioLabel: "Security Scenario",
      decisionLabel: "Control Decision",
      objectLabel: "Security Node",
      primaryQuestion: "Which exposure creates the largest blast radius?",
    },
  }),
  healthcare_ops: defineDomain({
    id: "healthcare_ops",
    name: "Healthcare Ops",
    description: "Healthcare operations placeholder for capacity, care flow, staffing, compliance, and patient impact.",
    objectTemplates: [
      objectTemplate("healthcare_ops_patient_demand", "Patient Demand", "input", "Patient volume and care demand.", ["patient", "demand", "volume"], 0.74),
      objectTemplate("healthcare_ops_capacity", "Capacity", "constraint", "Beds, rooms, or service capacity.", ["capacity", "beds", "rooms"], 0.78),
      objectTemplate("healthcare_ops_staffing", "Staffing", "process", "Clinical or operational staffing availability.", ["staffing", "nurses", "clinicians"], 0.78),
      objectTemplate("healthcare_ops_care_flow", "Care Flow", "process", "Patient journey and operational handoff.", ["care flow", "handoff", "throughput"], 0.72),
      objectTemplate("healthcare_ops_compliance", "Compliance", "constraint", "Regulatory or protocol requirement.", ["compliance", "protocol", "regulatory"], 0.68),
      objectTemplate("healthcare_ops_delay_risk", "Delay Risk", "risk", "Risk of delay in patient or operational flow.", ["delay", "wait time", "backlog"], 0.76),
    ],
    relationshipTemplates: baseRelationships,
    riskSignals: [
      riskSignal("healthcare_ops_capacity_pressure", "Capacity Pressure", "high", ["capacity", "beds", "overcrowding"], "Capacity pressure may affect service reliability."),
      riskSignal("healthcare_ops_staffing_gap", "Staffing Gap", "high", ["staffing", "shortage", "coverage"], "Staffing gaps may constrain care flow."),
      riskSignal("healthcare_ops_wait_time_rise", "Wait Time Rise", "medium", ["wait time", "delay", "queue"], "Longer waits may signal throughput pressure."),
    ],
    panelVocabulary: {
      executiveLabel: "Healthcare Ops View",
      riskLabel: "Care Flow Risk",
      scenarioLabel: "Healthcare Scenario",
      decisionLabel: "Operations Decision",
      objectLabel: "Care Node",
      primaryQuestion: "Where is patient flow most constrained?",
    },
  }),
};

export function isKnownDomainId(value: unknown): value is NexoraDomainId {
  const normalized = String(value ?? "").trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(NEXORA_DOMAIN_REGISTRY, normalized);
}

export function getDefaultDomain(): NexoraDomainDefinition {
  return NEXORA_DOMAIN_REGISTRY[DEFAULT_DOMAIN_ID];
}

export function getDomainDefinition(domainId: unknown): NexoraDomainDefinition {
  const normalized = String(domainId ?? "").trim().toLowerCase();
  return isKnownDomainId(normalized) ? NEXORA_DOMAIN_REGISTRY[normalized] : getDefaultDomain();
}

export function listDomainDefinitions(): NexoraDomainDefinition[] {
  return Object.values(NEXORA_DOMAIN_REGISTRY);
}
