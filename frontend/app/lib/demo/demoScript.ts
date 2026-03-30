import type { DemoNarrativeStepContract } from "./demoNarrativeTypes";
import type { NarrativeSceneAction } from "./narrativeSceneTypes";

export type DemoFlowState =
  | "idle"
  | "intro"
  | "shock"
  | "propagation"
  | "fragility"
  | "decision"
  | "outcome";

export type DemoVisualMode =
  | "balanced"
  | "shock"
  | "propagation"
  | "fragility"
  | "decision"
  | "outcome";

export type DemoScriptStep = DemoNarrativeStepContract & {
  step_id: Exclude<DemoFlowState, "idle">;
  title: string;
  narration_text: string;
  chat_input?: string;
  expected_focus_objects: string[];
  expected_intent?: string;
  visual_mode: DemoVisualMode;
  auto_advance_delay_ms?: number;
  fallback_focus_object_id?: string | null;
  fallback_reply?: string | null;
};

function action(scene_action: NarrativeSceneAction): NarrativeSceneAction {
  return scene_action;
}

export type DemoScript = {
  id: string;
  title: string;
  subtitle: string;
  steps: DemoScriptStep[];
};

export const RETAIL_FRAGILITY_DEMO_SCRIPT: DemoScript = {
  id: "retail_fragility_story_v1",
  title: "Retail Fragility Story",
  subtitle: "A guided narrative from steady-state operations to mitigation and recovery.",
  steps: [
    {
      step_id: "intro",
      title: "Normal State",
      narration_text: "Core retail operations look balanced, with flow and inventory still under control.",
      chat_input: "Show me system status",
      expected_focus_objects: ["obj_order_flow_1", "obj_inventory_1", "obj_delivery_1"],
      expected_intent: "chat_general",
      visual_mode: "balanced",
      scene_action: action({
        clear: true,
      }),
      auto_advance_delay_ms: 1400,
      fallback_focus_object_id: "obj_order_flow_1",
      fallback_reply: "Operations appear stable. Flow, delivery, and inventory are currently aligned.",
    },
    {
      step_id: "shock",
      title: "Shock",
      narration_text: "A supplier disruption appears and becomes the dominant source of system stress.",
      chat_input: "Supplier delay detected",
      expected_focus_objects: ["obj_supplier_1", "obj_delivery_1", "obj_delay_1"],
      expected_intent: "object_focus",
      visual_mode: "shock",
      scene_action: action({
        highlight_ids: ["obj_supplier_1", "obj_delivery_1", "obj_delay_1"],
        dim_ids: ["obj_price_1", "obj_cash_pressure_1"],
        focus_id: "obj_delivery_1",
        clear: true,
      }),
      auto_advance_delay_ms: 1600,
      fallback_focus_object_id: "obj_supplier_1",
      fallback_reply: "Supplier latency is rising and beginning to pressure downstream delivery capacity.",
    },
    {
      step_id: "propagation",
      title: "Propagation",
      narration_text: "The disruption spreads from supplier reliability into delivery execution and inventory health.",
      chat_input: "How does this affect delivery and inventory?",
      expected_focus_objects: ["obj_supplier_1", "obj_delivery_1", "obj_inventory_1", "obj_order_flow_1"],
      expected_intent: "simulation_run",
      visual_mode: "propagation",
      scene_action: action({
        highlight_ids: ["obj_inventory_1", "obj_order_flow_1", "obj_customer_satisfaction_1"],
        dim_ids: ["obj_price_1", "obj_cash_pressure_1"],
        focus_id: "obj_inventory_1",
        clear: true,
      }),
      auto_advance_delay_ms: 1600,
      fallback_focus_object_id: "obj_delivery_1",
      fallback_reply: "The issue is propagating through delivery into inventory and order flow.",
    },
    {
      step_id: "fragility",
      title: "Fragility Exposure",
      narration_text: "Nexora surfaces the system's weak points and shows where pressure is compounding.",
      chat_input: "Where is the system fragile?",
      expected_focus_objects: ["obj_risk_zone_1", "obj_inventory_1", "obj_delivery_1", "obj_cash_pressure_1"],
      expected_intent: "fragility_scan",
      visual_mode: "fragility",
      scene_action: action({
        highlight_ids: ["obj_price_1", "obj_cash_pressure_1", "obj_inventory_1"],
        dim_ids: ["obj_supplier_1", "obj_demand_1"],
        focus_id: "obj_cash_pressure_1",
        clear: true,
      }),
      auto_advance_delay_ms: 1700,
      fallback_focus_object_id: "obj_risk_zone_1",
      fallback_reply: "The main fragility is concentrated where delivery pressure is spilling into inventory and business risk.",
    },
    {
      step_id: "decision",
      title: "Strategic Response",
      narration_text: "The cockpit shifts from diagnosis to leverage, emphasizing the controllable intervention points.",
      chat_input: "What should we do about the supplier delay?",
      expected_focus_objects: ["obj_supplier_1", "obj_delivery_1", "obj_inventory_1"],
      expected_intent: "strategy_advice",
      visual_mode: "decision",
      scene_action: action({
        highlight_ids: ["obj_delivery_1", "obj_inventory_1", "obj_cash_pressure_1"],
        dim_ids: ["obj_demand_1", "obj_customer_satisfaction_1"],
        focus_id: "obj_delivery_1",
        clear: true,
      }),
      auto_advance_delay_ms: 1800,
      fallback_focus_object_id: "obj_supplier_1",
      fallback_reply: "Protect core supply and delivery capacity first, then stabilize inventory exposure.",
    },
    {
      step_id: "outcome",
      title: "Outcome",
      narration_text: "Mitigation contains the spread, and the system settles into a more stable operating posture.",
      chat_input: "Apply mitigation",
      expected_focus_objects: ["obj_order_flow_1", "obj_inventory_1", "obj_delivery_1"],
      expected_intent: "strategy_advice",
      visual_mode: "outcome",
      scene_action: action({
        highlight_ids: ["obj_order_flow_1", "obj_inventory_1", "obj_delivery_1"],
        dim_ids: ["obj_delay_1", "obj_cash_pressure_1"],
        focus_id: "obj_order_flow_1",
        clear: true,
      }),
      auto_advance_delay_ms: 0,
      fallback_focus_object_id: "obj_order_flow_1",
      fallback_reply: "Mitigation is containing the disruption and restoring a more stable flow through the system.",
    },
  ],
};
