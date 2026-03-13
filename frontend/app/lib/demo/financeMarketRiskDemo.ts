import type { SceneJson } from "../sceneTypes";

export const FINANCE_MARKET_RISK_DEMO_NAME = "Finance Market Fragility Demo";

export const financeMarketRiskDemoScene: SceneJson = {
  meta: {
    demo_id: "finance_market_fragility_demo",
    demo_name: FINANCE_MARKET_RISK_DEMO_NAME,
  },
  state_vector: { intensity: 0.57, volatility: 0.53 },
  scene: {
    scene: { intensity: 0.57, volatility: 0.53 },
    camera: {
      autoFrame: true,
      pos: [1.1, 7.3, 14.2],
      lookAt: [1, 0, -0.5],
    },
    kpi: {
      liquidity: 0.46,
      capital: 0.51,
      fragility: 0.62,
    },
    objects: [
      { id: "obj_market_demand_1", label: "Market Demand", type: "cone", position: [-8, 0, 0], transform: { pos: [-8, 0, 0] }, color: "#8B5CF6", emphasis: 0.46, role: "support_node", semantic: { role: "support_node", category: "market_signal", domain: "finance_system", tags: ["market", "demand", "flow"], keywords: ["market demand", "investor demand", "order flow"], related_terms: ["sentiment", "buy side", "flow"], business_meaning: "Market-side demand signal that influences price stability and portfolio conditions.", dependencies: ["obj_asset_price_1"] } },
      { id: "obj_asset_price_1", label: "Asset Price", type: "torus", position: [-4.8, 0, 0], transform: { pos: [-4.8, 0, 0] }, color: "#0EA5E9", emphasis: 0.62, role: "flow_node", semantic: { role: "flow_node", category: "market_price", domain: "finance_system", tags: ["asset", "price", "market"], keywords: ["asset price", "price", "market price"], related_terms: ["valuation", "mark to market", "pricing"], business_meaning: "Core price signal that converts market pressure into valuation and exposure effects.", dependencies: ["obj_portfolio_exposure_1", "obj_volatility_1"] } },
      { id: "obj_liquidity_1", label: "Liquidity", type: "sphere", position: [-1.2, 0, 0], transform: { pos: [-1.2, 0, 0] }, color: "#22C55E", emphasis: 0.68, role: "buffer_node", semantic: { role: "buffer_node", category: "funding", domain: "finance_system", tags: ["liquidity", "funding", "buffer"], keywords: ["liquidity", "funding", "market depth"], related_terms: ["cash", "depth", "financing"], business_meaning: "Protective buffer that allows the system to absorb stress without forced instability.", dependencies: ["obj_portfolio_exposure_1", "obj_capital_stability_1"] } },
      { id: "obj_portfolio_exposure_1", label: "Portfolio Exposure", type: "box", position: [2.1, 0, 0], transform: { pos: [2.1, 0, 0] }, color: "#2563EB", emphasis: 0.71, role: "operational_node", semantic: { role: "operational_node", category: "portfolio", domain: "finance_system", tags: ["portfolio", "exposure", "risk"], keywords: ["portfolio exposure", "exposure", "positioning"], related_terms: ["holdings", "book", "position"], business_meaning: "Central exposure node where pricing and liquidity pressure turn into financial fragility.", dependencies: ["obj_leverage_1", "obj_credit_pressure_1"] } },
      { id: "obj_leverage_1", label: "Leverage", type: "cylinder", position: [5.1, -0.7, 0], transform: { pos: [5.1, -0.7, 0] }, color: "#F59E0B", emphasis: 0.58, role: "constraint_node", semantic: { role: "constraint_node", category: "leverage", domain: "finance_system", tags: ["leverage", "amplification", "constraint"], keywords: ["leverage", "gearing", "margin"], related_terms: ["borrowed capital", "amplification", "margin"], business_meaning: "Amplifier that increases the system's sensitivity to market and liquidity stress.", dependencies: ["obj_capital_stability_1"] } },
      { id: "obj_credit_pressure_1", label: "Credit Pressure", type: "icosahedron", position: [1.8, 3.3, 0], transform: { pos: [1.8, 3.3, 0] }, color: "#DC2626", emphasis: 0.63, role: "risk_source", semantic: { role: "risk_source", category: "credit", domain: "finance_system", tags: ["credit", "pressure", "funding"], keywords: ["credit pressure", "spread widening", "funding pressure"], related_terms: ["credit stress", "funding squeeze", "spread risk"], business_meaning: "Risk source that tightens funding conditions and weakens capital flexibility.", dependencies: ["obj_liquidity_1", "obj_capital_stability_1"] } },
      { id: "obj_volatility_1", label: "Volatility", type: "icosahedron", position: [-2.5, 4.4, 0], transform: { pos: [-2.5, 4.4, 0] }, color: "#F97316", emphasis: 0.61, role: "risk_source", semantic: { role: "risk_source", category: "market_volatility", domain: "finance_system", tags: ["volatility", "instability", "market"], keywords: ["volatility", "vol spike", "market volatility"], related_terms: ["variance", "price swings", "risk"], business_meaning: "Market instability source that destabilizes prices, liquidity, and confidence across the system.", dependencies: ["obj_asset_price_1", "obj_market_demand_1"] } },
      { id: "obj_capital_stability_1", label: "Capital Stability", type: "sphere", position: [8, 1.3, 0], transform: { pos: [8, 1.3, 0] }, color: "#14B8A6", emphasis: 0.52, role: "customer_or_outcome_node", semantic: { role: "customer_or_outcome_node", category: "outcome", domain: "finance_system", tags: ["capital", "stability", "resilience"], keywords: ["capital stability", "capital resilience", "balance sheet"], related_terms: ["capital position", "solvency", "resilience"], business_meaning: "System-level financial resilience outcome showing whether the portfolio can withstand current pressure.", dependencies: [] } },
    ],
    relations: [
      { from: "obj_market_demand_1", to: "obj_asset_price_1", type: "flow" },
      { from: "obj_asset_price_1", to: "obj_portfolio_exposure_1", type: "dependency" },
      { from: "obj_liquidity_1", to: "obj_asset_price_1", type: "flow" },
      { from: "obj_liquidity_1", to: "obj_capital_stability_1", type: "flow" },
      { from: "obj_portfolio_exposure_1", to: "obj_leverage_1", type: "dependency" },
      { from: "obj_leverage_1", to: "obj_capital_stability_1", type: "pressure" },
      { from: "obj_credit_pressure_1", to: "obj_liquidity_1", type: "pressure" },
      { from: "obj_credit_pressure_1", to: "obj_capital_stability_1", type: "risk" },
      { from: "obj_volatility_1", to: "obj_asset_price_1", type: "pressure" },
      { from: "obj_volatility_1", to: "obj_market_demand_1", type: "pressure" },
      { from: "obj_portfolio_exposure_1", to: "obj_capital_stability_1", type: "risk" },
    ],
    loops: [
      {
        id: "loop_finance_market_fragility",
        type: "market_risk",
        label: "Market Fragility Loop",
        edges: [
          { from: "obj_market_demand_1", to: "obj_asset_price_1", weight: 0.66, polarity: "positive", kind: "flow" },
          { from: "obj_volatility_1", to: "obj_asset_price_1", weight: 0.74, polarity: "negative", kind: "pressure" },
          { from: "obj_asset_price_1", to: "obj_portfolio_exposure_1", weight: 0.71, polarity: "negative", kind: "dependency" },
          { from: "obj_portfolio_exposure_1", to: "obj_capital_stability_1", weight: 0.69, polarity: "negative", kind: "risk" },
          { from: "obj_liquidity_1", to: "obj_asset_price_1", weight: 0.63, polarity: "positive", kind: "flow" },
        ],
      },
      {
        id: "loop_finance_liquidity_constraint",
        type: "risk_ignorance",
        label: "Liquidity Constraint Loop",
        edges: [
          { from: "obj_credit_pressure_1", to: "obj_liquidity_1", weight: 0.76, polarity: "negative", kind: "pressure" },
          { from: "obj_liquidity_1", to: "obj_portfolio_exposure_1", weight: 0.68, polarity: "negative", kind: "flow" },
          { from: "obj_portfolio_exposure_1", to: "obj_leverage_1", weight: 0.64, polarity: "negative", kind: "dependency" },
          { from: "obj_leverage_1", to: "obj_capital_stability_1", weight: 0.71, polarity: "negative", kind: "pressure" },
          { from: "obj_credit_pressure_1", to: "obj_capital_stability_1", weight: 0.7, polarity: "negative", kind: "risk" },
        ],
      },
    ],
    active_loop: "loop_finance_market_fragility",
    loops_suggestions: ["Protect liquidity flexibility", "Reduce concentrated downside exposure"],
  },
};

export const financeMarketRiskDemoAnalysis = {
  reply:
    "Finance market fragility demo loaded. Liquidity and exposure stress are elevated; try a prompt like 'liquidity stress' to see how risk propagates through the financial system.",
  scene_json: financeMarketRiskDemoScene,
  fragility: {
    score: 0.64,
    level: "high",
    drivers: {
      liquidity_pressure: 0.73,
      volatility_spillover: 0.68,
      capital_sensitivity: 0.59,
    },
  },
  conflicts: [
    { pair: ["obj_liquidity_1", "obj_credit_pressure_1"], score: 0.74 },
    { pair: ["obj_portfolio_exposure_1", "obj_capital_stability_1"], score: 0.67 },
  ],
  object_selection: {
    rankings: [
      { id: "obj_liquidity_1", score: 0.81, why: "Liquidity is the primary resilience buffer under current market stress." },
      { id: "obj_portfolio_exposure_1", score: 0.76, why: "Portfolio exposure is concentrating downside risk into capital sensitivity." },
      { id: "obj_credit_pressure_1", score: 0.72, why: "Credit pressure is tightening the system's funding and stabilization options." },
    ],
    highlighted_objects: ["obj_liquidity_1", "obj_portfolio_exposure_1", "obj_credit_pressure_1"],
  },
  risk_propagation: {
    edges: [
      { from: "obj_credit_pressure_1", to: "obj_liquidity_1", weight: 0.76 },
      { from: "obj_liquidity_1", to: "obj_asset_price_1", weight: 0.61 },
      { from: "obj_asset_price_1", to: "obj_portfolio_exposure_1", weight: 0.72 },
      { from: "obj_portfolio_exposure_1", to: "obj_capital_stability_1", weight: 0.69 },
    ],
    summary: "Liquidity and volatility pressure are propagating into asset-price instability, concentrated exposure, and capital fragility.",
  },
  strategic_advice: {
    recommended_actions: [
      {
        type: "protect_liquidity",
        action: "Protect liquidity flexibility and reduce near-term funding strain",
        targets: ["obj_liquidity_1", "obj_credit_pressure_1"],
        impact: "Improves the system's ability to absorb stress without forced instability.",
        priority: 1,
      },
      {
        type: "reduce_exposure",
        action: "Reduce concentrated downside exposure in the portfolio",
        targets: ["obj_portfolio_exposure_1", "obj_leverage_1"],
        impact: "Lowers the chance that price shock will cascade into capital impairment.",
        priority: 2,
      },
    ],
    primary_recommendation: {
      type: "protect_liquidity",
      action: "Protect liquidity flexibility and reduce near-term funding strain",
      targets: ["obj_liquidity_1", "obj_credit_pressure_1"],
      impact: "Improves the system's ability to absorb stress without forced instability.",
      priority: 1,
    },
    why: "Funding pressure and concentrated exposure are already weakening the system's ability to stabilize under market stress.",
    confidence: 0.83,
    summary: "Best next move is to stabilize liquidity first, then reduce concentrated exposure before market fragility deepens.",
  },
  opponent_model: {
    actor: { id: "market_instability", label: "Market Instability" },
    possible_moves: [
      { id: "amplify_selloff", label: "Amplify selloff pressure", impact: "Drives volatility, weakens liquidity, and deepens capital stress." },
    ],
    best_response: {
      id: "defend_liquidity_buffer",
      label: "Defend liquidity and reduce exposure concentration",
      targets: ["obj_liquidity_1", "obj_portfolio_exposure_1"],
      why: "These are the clearest financial control points in the current system state.",
    },
    strategic_risk: 0.69,
    summary: "Market fragility is most likely to exploit liquidity weakness and concentrated downside exposure.",
  },
  strategic_patterns: {
    detected_patterns: [
      {
        id: "pattern_liquidity_exposure_fragility",
        label: "Liquidity-exposure fragility",
        frequency: 4,
        avg_fragility: 0.63,
        key_objects: ["obj_liquidity_1", "obj_portfolio_exposure_1", "obj_credit_pressure_1"],
        why: "Funding stress repeatedly converges with concentrated exposure into capital fragility.",
      },
    ],
    top_pattern: {
      id: "pattern_liquidity_exposure_fragility",
      label: "Liquidity-exposure fragility",
      frequency: 4,
      avg_fragility: 0.63,
      key_objects: ["obj_liquidity_1", "obj_portfolio_exposure_1", "obj_credit_pressure_1"],
      why: "Funding stress repeatedly converges with concentrated exposure into capital fragility.",
    },
    summary: "Most repeated pattern is liquidity-driven financial fragility under concentrated market exposure.",
  },
};
