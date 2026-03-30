import type { CustomerDemoProfile } from "./customerDemoTypes";

export const CUSTOMER_DEMO_PROFILES: CustomerDemoProfile[] = [
  {
    id: "retail_supply_chain",
    label: "Retail Supply Chain Demo",
    domain: "business",
    business_context: "Retail supply continuity, inventory resilience, and delivery pressure.",
    executive_focus: "Delivery risk and inventory stability",
    default_mode: "Executive",
    recommended_prompts: [
      "What happens if supplier delivery is delayed?",
      "Where is the system fragile?",
      "What should we do to protect inventory?",
      "How does this pressure spread through delivery and risk?",
    ],
    hero_summary: "Nexora shows how supplier disruption spreads into delivery pressure, inventory fragility, and executive risk.",
    initial_focus_object_ids: ["obj_supplier_1", "obj_delivery_1", "obj_inventory_1", "obj_risk_1"],
    scenario_script_id: "retail_fragility_story",
    panel_labels: {
      executive_summary_title: "Retail Executive Overview",
      pressure_title: "Delivery Pressure",
      intelligence_title: "Supply Intelligence",
      drivers_title: "Fragility Drivers",
      conflicts_title: "Operating Tensions",
      propagation_title: "Supply Propagation Path",
      decisions_title: "Recommended Actions",
      council_title: "Strategic Council",
      war_room_title: "Supply Chain War Room",
    },
    header_context_label: "Retail Supply Chain",
    empty_state_copy: {
      pressure: "No major delivery or inventory fragility is active in the current scene yet.",
      drivers: "No major supply-side fragility driver is active in the current scene.",
      conflicts: "No major delivery versus inventory tension is active in the current scene.",
      propagation: "No active supplier-to-delivery pressure chain is visible yet.",
      propagation_hint: "Ask about supplier delay, inventory protection, or delivery pressure to reveal the next chain.",
      decisions: "Run a retail pressure scenario or ask how to protect inventory to generate the next executive move.",
      council: "Executive council will activate when retail pressure or meaningful tradeoffs emerge in the current scene.",
      war_room: "Compose a non-destructive response for supplier, delivery, inventory, and downstream risk.",
    },
  },
  {
    id: "delivery_operations",
    label: "Delivery Operations Demo",
    domain: "business",
    business_context: "Operational flow, warehouse stability, and downstream bottlenecks.",
    executive_focus: "Execution bottlenecks and service continuity",
    default_mode: "Executive",
    recommended_prompts: [
      "Where is delivery pressure building?",
      "Which bottleneck creates the most downstream risk?",
      "What action stabilizes warehouse flow first?",
    ],
    hero_summary: "Nexora helps operators see where flow disruption is building before it turns into missed delivery outcomes.",
    initial_focus_object_ids: ["obj_delivery_1", "obj_warehouse_1", "obj_bottleneck_1", "obj_demand_1"],
    panel_labels: {
      executive_summary_title: "Operations Overview",
      pressure_title: "Operational Pressure",
      intelligence_title: "Flow Intelligence",
      conflicts_title: "Execution Tensions",
      propagation_title: "Operational Propagation",
      decisions_title: "Operational Actions",
      war_room_title: "Operations War Room",
    },
    header_context_label: "Delivery Operations",
    empty_state_copy: {
      pressure: "No major delivery or warehouse pressure is active in the current scene yet.",
      drivers: "No major operational bottleneck is active in the current scene.",
      conflicts: "No major execution tradeoff is active in the current scenario.",
      propagation: "No active delivery disruption chain is visible yet.",
      propagation_hint: "Ask about bottlenecks, flow disruption, or service pressure to reveal the next chain.",
      decisions: "Run an operations scenario or ask how to relieve the current bottleneck to generate the next move.",
      council: "Executive council will appear when operations pressure or execution tradeoffs become clearer.",
      war_room: "Shape a delivery response plan while keeping the live scene intact.",
    },
  },
  {
    id: "finance_pressure",
    label: "Finance Pressure Demo",
    domain: "finance",
    business_context: "Cost pressure, cash sensitivity, and downside containment.",
    executive_focus: "Cost exposure and fragile tradeoffs",
    default_mode: "Executive",
    recommended_prompts: [
      "What tradeoff is emerging between cash and delivery?",
      "Which action lowers fragility at the lowest cost?",
      "Where is financial pressure spreading next?",
    ],
    hero_summary: "Nexora shows where financial pressure is creating operational strain and strategic tradeoffs before losses compound.",
    initial_focus_object_ids: ["obj_price_1", "obj_cash_1", "obj_risk_1", "obj_inventory_1"],
    scenario_script_id: "cost_fragility_story",
    panel_labels: {
      executive_summary_title: "Finance Overview",
      pressure_title: "Cost Pressure",
      intelligence_title: "Financial Intelligence",
      drivers_title: "Exposure Drivers",
      conflicts_title: "Tradeoff Risk",
      propagation_title: "Cost Propagation Path",
      decisions_title: "Capital-Sensitive Actions",
      war_room_title: "Finance War Room",
    },
    header_context_label: "Finance Pressure",
    empty_state_copy: {
      pressure: "No major financial pressure is active in the current scenario yet.",
      drivers: "No major cost or exposure driver is active in the current scene.",
      conflicts: "No major finance-versus-operations tradeoff is active in the current scene.",
      propagation: "No active cost-to-risk chain is visible yet.",
      propagation_hint: "Ask about cash pressure, cost exposure, or downside risk to reveal the next chain.",
      decisions: "Run a finance stress scenario or ask for the lowest-cost stabilizing move to generate the next action.",
      council: "Executive council will appear when financial tradeoffs are strong enough to brief clearly.",
      war_room: "Evaluate cost-sensitive interventions without disrupting the current operating picture.",
    },
  },
  {
    id: "executive_risk",
    label: "Executive Risk Mode",
    domain: "strategy",
    business_context: "Strategic exposure, system fragility, and executive-level risk concentration.",
    executive_focus: "Strategic exposure and resilience posture",
    default_mode: "Executive",
    recommended_prompts: [
      "Where is strategic fragility building?",
      "Which concentration risk matters most right now?",
      "What should leadership do first to reduce exposure?",
    ],
    hero_summary: "Nexora reveals where strategic fragility is building before it becomes visible in outcomes or board-level pressure.",
    initial_focus_object_ids: ["obj_supplier_1", "obj_risk_1", "obj_inventory_1"],
    scenario_script_id: "strategic_exposure_story",
    panel_labels: {
      executive_summary_title: "Executive Risk Overview",
      pressure_title: "Strategic Exposure",
      intelligence_title: "Risk Intelligence",
      drivers_title: "Exposure Drivers",
      conflicts_title: "Executive Tensions",
      propagation_title: "Exposure Path",
      decisions_title: "Risk Response Options",
      war_room_title: "Executive Risk War Room",
    },
    header_context_label: "Executive Risk",
    empty_state_copy: {
      pressure: "No major strategic exposure is active in the current scene yet.",
      drivers: "No major fragility driver is active in the current strategic view.",
      conflicts: "No major executive tension is active in the current scenario yet.",
      propagation: "No active exposure path is visible yet.",
      propagation_hint: "Ask about concentration, pressure, or fragility to reveal the next strategic chain.",
      decisions: "Ask for the next executive move to generate a risk-aware recommendation.",
      council: "Executive council will appear when the scenario contains meaningful tradeoffs or leadership tension.",
      war_room: "Use War Room to test strategic mitigation paths without changing the live scene.",
    },
  },
  {
    id: "strategy_command",
    label: "Strategy Command Demo",
    domain: "strategy",
    business_context: "Strategic options, leadership tradeoffs, and next-move evaluation.",
    executive_focus: "Decision sequencing and competitive posture",
    default_mode: "Executive",
    recommended_prompts: [
      "What strategic tension matters most right now?",
      "Which option improves resilience without overextending operations?",
      "What should leadership sequence first?",
    ],
    hero_summary: "Nexora helps leadership compare strategic options, expose tensions, and choose a credible next move under pressure.",
    initial_focus_object_ids: ["obj_strategy_1", "obj_risk_1", "obj_delivery_1"],
    panel_labels: {
      executive_summary_title: "Strategy Overview",
      pressure_title: "Decision Pressure",
      intelligence_title: "Strategic Intelligence",
      drivers_title: "Decision Drivers",
      conflicts_title: "Strategic Tensions",
      propagation_title: "Consequence Path",
      decisions_title: "Recommended Next Moves",
      war_room_title: "Strategy War Room",
    },
    header_context_label: "Strategy Command",
    empty_state_copy: {
      pressure: "No major decision pressure is active in the current strategy view yet.",
      drivers: "No major strategic driver is active in the current scene.",
      conflicts: "No major strategic disagreement is active in the current scenario.",
      propagation: "No active consequence path is visible yet.",
      propagation_hint: "Ask about tradeoffs, strategic pressure, or the next move to reveal how consequences spread.",
      decisions: "Run a strategy scenario or ask what leadership should do next to generate a recommendation.",
      council: "Strategic council will appear when Nexora sees enough tradeoff signal to brief leadership clearly.",
      war_room: "Use War Room to compare strategic response paths while preserving the current scene.",
    },
  },
];

export function getCustomerDemoProfile(profileId: string | null | undefined): CustomerDemoProfile | null {
  if (!profileId) return null;
  return CUSTOMER_DEMO_PROFILES.find((profile) => profile.id === profileId) ?? null;
}

export function getDefaultCustomerDemoProfileId(domainId: string | null | undefined): string | null {
  switch (String(domainId ?? "").trim().toLowerCase()) {
    case "finance":
      return "finance_pressure";
    case "strategy":
      return "executive_risk";
    case "business":
      return "retail_supply_chain";
    default:
      return null;
  }
}
