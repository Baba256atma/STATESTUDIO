import type { SceneJson } from "../sceneTypes";

export const RETAIL_SUPPLY_CHAIN_DEMO_NAME = "Business Operations Fragility Demo";

export const retailSupplyChainDemoScene: SceneJson = {
  meta: {
    demo_id: "business_supply_fragility_demo",
    demo_name: RETAIL_SUPPLY_CHAIN_DEMO_NAME,
  },
  state_vector: { intensity: 0.54, volatility: 0.47 },
  scene: {
    scene: { intensity: 0.54, volatility: 0.47 },
    camera: {
      autoFrame: true,
      pos: [1.2, 7.2, 14],
      lookAt: [1, 0, -1],
    },
    kpi: {
      inventory: 0.42,
      delivery: 0.48,
      risk: 0.58,
    },
    objects: [
      { id: "obj_supplier_1", label: "Supplier", type: "box", position: [-8, 0, 0], transform: { pos: [-8, 0, 0] }, color: "#4F46E5", emphasis: 0.55, role: "core_system_node", semantic: { role: "risk_source", category: "dependency", domain: "business_system", tags: ["upstream", "dependency", "supplier", "exposure"], keywords: ["supplier", "upstream dependency", "source"], related_terms: ["vendor", "dependency", "supply"], business_meaning: "Primary upstream dependency that can inject disruption into the operating system.", dependencies: ["obj_delivery_1"] } },
      { id: "obj_delivery_1", label: "Operational Flow", type: "cylinder", position: [-5, 0, 0], transform: { pos: [-5, 0, 0] }, color: "#0EA5E9", emphasis: 0.7, role: "flow_node", semantic: { role: "flow_node", category: "operations", domain: "business_system", tags: ["flow", "throughput", "execution", "operations"], keywords: ["delivery", "flow", "throughput", "execution"], related_terms: ["pipeline", "logistics", "continuity"], business_meaning: "Core operating flow that converts upstream inputs into system throughput.", dependencies: ["obj_inventory_1", "obj_order_flow_1"] } },
      { id: "obj_inventory_1", label: "Capacity Buffer", type: "sphere", position: [-1.5, 0, 0], transform: { pos: [-1.5, 0, 0] }, color: "#F59E0B", emphasis: 0.65, role: "buffer_node", semantic: { role: "buffer_node", category: "resilience", domain: "business_system", tags: ["buffer", "capacity", "inventory", "protection"], keywords: ["capacity", "inventory", "buffer"], related_terms: ["coverage", "reserve", "slack"], business_meaning: "Protective buffer that absorbs volatility before it reaches customers and KPIs.", dependencies: ["obj_warehouse_1", "obj_customer_satisfaction_1"] } },
      { id: "obj_warehouse_1", label: "Operations", type: "box", position: [1.5, 0, 0], transform: { pos: [1.5, 0, 0] }, color: "#84CC16", emphasis: 0.44, role: "operational_node", semantic: { role: "operational_node", category: "execution", domain: "business_system", tags: ["operations", "execution", "coordination"], keywords: ["operations", "coordination", "execution"], related_terms: ["workflow", "processing", "handling"], business_meaning: "Execution layer that coordinates how work moves through the system.", dependencies: ["obj_order_flow_1"] } },
      { id: "obj_order_flow_1", label: "Fulfillment Flow", type: "torus", position: [5, 0, 0], transform: { pos: [5, 0, 0] }, color: "#22C55E", emphasis: 0.58, role: "flow_node", semantic: { role: "flow_node", category: "service_delivery", domain: "business_system", tags: ["fulfillment", "flow", "service", "throughput"], keywords: ["fulfillment", "order flow", "service flow"], related_terms: ["delivery path", "service continuity"], business_meaning: "Downstream service flow where operational pressure turns into customer and KPI effects.", dependencies: ["obj_cash_pressure_1", "obj_customer_satisfaction_1"] } },
      { id: "obj_demand_1", label: "Demand", type: "cone", position: [8, 0, 0], transform: { pos: [8, 0, 0] }, color: "#A855F7", emphasis: 0.5, role: "support_node", semantic: { role: "support_node", category: "market_signal", domain: "business_system", tags: ["demand", "market", "load"], keywords: ["demand", "intake", "volume"], related_terms: ["orders", "load", "inflow"], business_meaning: "Market-side signal that increases or reduces pressure on the operating system.", dependencies: ["obj_order_flow_1", "obj_customer_satisfaction_1"] } },
      { id: "obj_delay_1", label: "Disruption Risk", type: "icosahedron", position: [-5, 3.5, 0], transform: { pos: [-5, 3.5, 0] }, color: "#EF4444", emphasis: 0.68, role: "risk_source", semantic: { role: "risk_source", category: "risk", domain: "business_system", tags: ["risk", "disruption", "delay", "fragility"], keywords: ["delay", "disruption", "incident"], risk_kind: "operational_disruption", related_terms: ["shock", "interruption", "failure"], business_meaning: "Visible disruption source that increases fragility across the flow and buffer layer.", dependencies: ["obj_delivery_1", "obj_inventory_1"] } },
      { id: "obj_price_1", label: "Price Pressure", type: "torus", position: [0, 4.5, 0], transform: { pos: [0, 4.5, 0] }, color: "#F97316", emphasis: 0.5, role: "kpi_sensitive_node", semantic: { role: "kpi_sensitive_node", category: "commercial_pressure", domain: "business_system", tags: ["price", "margin", "pressure", "commercial"], keywords: ["price", "pricing", "margin"], risk_kind: "commercial_pressure", related_terms: ["cost", "commercial pressure", "pricing risk"], business_meaning: "Commercial pressure point that changes demand behavior and financial exposure.", dependencies: ["obj_demand_1", "obj_cash_pressure_1"] } },
      { id: "obj_cash_pressure_1", label: "Cash Pressure", type: "icosahedron", position: [4.5, 3.5, 0], transform: { pos: [4.5, 3.5, 0] }, color: "#DC2626", emphasis: 0.62, role: "strategic_node", semantic: { role: "strategic_node", category: "financial_exposure", domain: "business_system", tags: ["cash", "liquidity", "exposure", "strategy"], keywords: ["cash pressure", "liquidity", "financial pressure"], risk_kind: "kpi_pressure", related_terms: ["margin", "financial resilience", "constraint"], business_meaning: "Strategic pressure node where operational stress becomes a business decision constraint.", dependencies: ["obj_customer_satisfaction_1"] } },
      { id: "obj_customer_satisfaction_1", label: "Customer Trust", type: "sphere", position: [8, 3.5, 0], transform: { pos: [8, 3.5, 0] }, color: "#14B8A6", emphasis: 0.46, role: "customer_or_outcome_node", semantic: { role: "customer_or_outcome_node", category: "outcome", domain: "business_system", tags: ["customer", "trust", "outcome", "service"], keywords: ["customer trust", "customer impact", "trust"], related_terms: ["reputation", "retention", "service outcome"], business_meaning: "Downstream outcome node that reflects whether the system is protecting customer value.", dependencies: [] } },
    ],
    relations: [
      { from: "obj_supplier_1", to: "obj_delivery_1", type: "flow" },
      { from: "obj_delivery_1", to: "obj_inventory_1", type: "flow" },
      { from: "obj_inventory_1", to: "obj_warehouse_1", type: "flow" },
      { from: "obj_warehouse_1", to: "obj_order_flow_1", type: "flow" },
      { from: "obj_demand_1", to: "obj_order_flow_1", type: "dependency" },
      { from: "obj_delay_1", to: "obj_delivery_1", type: "risk" },
      { from: "obj_delay_1", to: "obj_inventory_1", type: "risk" },
      { from: "obj_price_1", to: "obj_demand_1", type: "pressure" },
      { from: "obj_price_1", to: "obj_cash_pressure_1", type: "pressure" },
      { from: "obj_inventory_1", to: "obj_customer_satisfaction_1", type: "flow" },
      { from: "obj_order_flow_1", to: "obj_cash_pressure_1", type: "dependency" },
      { from: "obj_demand_1", to: "obj_customer_satisfaction_1", type: "dependency" },
    ],
    loops: [
      {
        id: "loop_retail_flow",
        type: "quality_protection",
        label: "Core Business Flow",
        edges: [
          { from: "obj_supplier_1", to: "obj_delivery_1", weight: 0.70, polarity: "positive", kind: "flow" },
          { from: "obj_delivery_1", to: "obj_inventory_1", weight: 0.72, polarity: "positive", kind: "flow" },
          { from: "obj_inventory_1", to: "obj_warehouse_1", weight: 0.66, polarity: "positive", kind: "flow" },
          { from: "obj_warehouse_1", to: "obj_order_flow_1", weight: 0.62, polarity: "positive", kind: "flow" },
          { from: "obj_demand_1", to: "obj_order_flow_1", weight: 0.68, polarity: "positive", kind: "dependency" },
        ],
      },
      {
        id: "loop_retail_pressure",
        type: "risk_ignorance",
        label: "Business Pressure Loop",
        edges: [
          { from: "obj_delay_1", to: "obj_delivery_1", weight: 0.74, polarity: "negative", kind: "risk" },
          { from: "obj_delay_1", to: "obj_inventory_1", weight: 0.67, polarity: "negative", kind: "risk" },
          { from: "obj_price_1", to: "obj_demand_1", weight: 0.61, polarity: "negative", kind: "pressure" },
          { from: "obj_price_1", to: "obj_cash_pressure_1", weight: 0.63, polarity: "negative", kind: "pressure" },
          { from: "obj_inventory_1", to: "obj_customer_satisfaction_1", weight: 0.58, polarity: "positive", kind: "flow" },
          { from: "obj_order_flow_1", to: "obj_cash_pressure_1", weight: 0.54, polarity: "negative", kind: "dependency" },
          { from: "obj_demand_1", to: "obj_customer_satisfaction_1", weight: 0.52, polarity: "negative", kind: "dependency" },
        ],
      },
    ],
    active_loop: "loop_retail_flow",
    loops_suggestions: ["Protect critical capacity", "Reduce dependency concentration"],
  },
};

export const retailSupplyChainDemoAnalysis = {
  reply:
    "Business system demo loaded. Supplier and operational flow stress are elevated; try a prompt like 'supplier delay' to see how pressure propagates.",
  scene_json: retailSupplyChainDemoScene,
  fragility: {
    score: 0.62,
    level: "high",
    drivers: {
      inventory_pressure: 0.58,
      time_pressure: 0.67,
      quality_risk: 0.51,
    },
  },
  conflicts: [
    { pair: ["obj_supplier_1", "obj_delivery_1"], score: 0.66 },
    { pair: ["obj_delivery_1", "obj_customer_satisfaction_1"], score: 0.57 },
  ],
  object_selection: {
    rankings: [
      { id: "obj_delivery_1", score: 0.79, why: "Operational flow is the current throughput bottleneck." },
      { id: "obj_supplier_1", score: 0.72, why: "Supplier reliability is unstable under shifting business pressure." },
      { id: "obj_inventory_1", score: 0.69, why: "A thin capacity buffer amplifies downstream fulfillment risk." },
    ],
    highlighted_objects: ["obj_delivery_1", "obj_supplier_1"],
  },
  risk_propagation: {
    edges: [
      { from: "obj_supplier_1", to: "obj_delivery_1", weight: 0.71 },
      { from: "obj_delivery_1", to: "obj_inventory_1", weight: 0.68 },
      { from: "obj_inventory_1", to: "obj_customer_satisfaction_1", weight: 0.55 },
    ],
    summary: "Supplier pressure is propagating into operational flow, capacity, and customer trust risk.",
  },
  strategic_advice: {
    recommended_actions: [
      {
        type: "stabilize",
        action: "Protect critical capacity and buffer the flow",
        targets: ["obj_inventory_1", "obj_delivery_1"],
        impact: "Buffers flow volatility and limits downstream service disruption.",
        priority: 1,
      },
      {
        type: "supplier_resilience",
        action: "Reduce dependency concentration",
        targets: ["obj_supplier_1", "obj_delivery_1"],
        impact: "Reduces concentration risk from a single exposed dependency.",
        priority: 2,
      },
    ],
    primary_recommendation: {
      type: "stabilize",
      action: "Protect critical capacity and buffer the flow",
      targets: ["obj_inventory_1", "obj_delivery_1"],
      impact: "Buffers flow volatility and limits downstream service disruption.",
      priority: 1,
    },
    why: "Supplier pressure is already stressing operations, service continuity, and customer outcomes.",
    confidence: 0.81,
    summary: "Best next move is to stabilize core flow and capacity before pressure spreads further.",
  },
  opponent_model: {
    actor: { id: "external_actor", label: "External Actor" },
    possible_moves: [
      { id: "pressure_delivery", label: "Exploit operational weakness", impact: "Amplifies service-level risk." },
    ],
    best_response: {
      id: "stabilize_flow",
      label: "Stabilize operations and protect customer trust",
      targets: ["obj_delivery_1", "obj_customer_satisfaction_1"],
      why: "Operational flow is the easiest exposed pressure point.",
    },
    strategic_risk: 0.66,
    summary: "External pressure is most likely to target operational reliability.",
  },
  strategic_patterns: {
    detected_patterns: [
      {
        id: "pattern_supply_chain_instability",
        label: "Business dependency instability",
        frequency: 4,
        avg_fragility: 0.61,
        key_objects: ["obj_supplier_1", "obj_inventory_1", "obj_delivery_1"],
        why: "Dependency variance repeatedly cascades into flow pressure.",
      },
    ],
    top_pattern: {
      id: "pattern_supply_chain_instability",
      label: "Business dependency instability",
      frequency: 4,
      avg_fragility: 0.61,
      key_objects: ["obj_supplier_1", "obj_inventory_1", "obj_delivery_1"],
      why: "Dependency variance repeatedly cascades into flow pressure.",
    },
    summary: "Most repeated pattern is dependency-driven business instability.",
  },
};
