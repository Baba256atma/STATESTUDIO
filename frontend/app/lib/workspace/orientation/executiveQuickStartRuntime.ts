import type {
  ExecutiveOrientationContext,
  ExecutiveQuickStartRecommendation,
} from "./executiveOrientationTypes";
import { logExecutiveQuickStart } from "./executiveOrientationInstrumentation";

const QUICK_START_CATALOG: ExecutiveQuickStartRecommendation[] = [
  {
    id: "analyze_risks",
    label: "Analyze Current Risks",
    rationale: "Review elevated signals before they propagate.",
  },
  {
    id: "review_dependencies",
    label: "Review Critical Dependencies",
    rationale: "Trace upstream and downstream operational links.",
  },
  {
    id: "create_scenario",
    label: "Create Scenario",
    rationale: "Compare strategic options under controlled conditions.",
  },
  {
    id: "inspect_network",
    label: "Inspect Supplier Network",
    rationale: "Validate supply-side exposure across the scene.",
  },
  {
    id: "compare_options",
    label: "Compare Strategic Options",
    rationale: "Evaluate tradeoffs across active scenarios.",
  },
  {
    id: "select_object",
    label: "Select a System Node",
    rationale: "Focus analysis on one operational object.",
  },
  {
    id: "map_system",
    label: "Map Operational System",
    rationale: "Describe the system to generate the executive scene.",
  },
];

function scoreRecommendation(
  item: ExecutiveQuickStartRecommendation,
  input: ExecutiveOrientationContext
): number {
  if (item.id === "map_system" && input.objectCount === 0) return 100;
  if (item.id === "select_object" && input.objectCount > 0 && !input.selectedObjectLabel) return 90;
  if (item.id === "analyze_risks" && input.elevatedRiskCount > 0) return 95;
  if (item.id === "review_dependencies" && input.relationshipCount > 0) return 85;
  if (item.id === "create_scenario" && input.activeScenarioCount === 0 && input.objectCount > 0) return 80;
  if (item.id === "compare_options" && input.activeScenarioCount > 1) return 88;
  if (item.id === "inspect_network" && input.domainLabel?.toLowerCase().includes("supply")) return 82;
  if (item.id === "inspect_network" && input.recommendedFocusLabel?.toLowerCase().includes("supplier"))
    return 78;
  if (item.id === "analyze_risks" && input.fragilityLevel === "medium") return 70;
  if (item.id === "review_dependencies" && input.objectCount > 0) return 65;
  return 40;
}

/** E2:48 Part 4 — contextual executive recommendations (non-tutorial tone). */
export function resolveExecutiveQuickStartRecommendations(
  input: ExecutiveOrientationContext,
  limit = 3
): ExecutiveQuickStartRecommendation[] {
  const ranked = QUICK_START_CATALOG.map((item) => ({
    item,
    score: scoreRecommendation(item, input),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);

  logExecutiveQuickStart("resolved", { count: ranked.length, ids: ranked.map((entry) => entry.id) });
  return ranked;
}

export type ExecutiveQuickStartActionId = ExecutiveQuickStartRecommendation["id"];
