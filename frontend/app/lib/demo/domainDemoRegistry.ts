import { financeMarketRiskDemoAnalysis, financeMarketRiskDemoScene } from "./financeMarketRiskDemo";
import { retailSupplyChainDemoAnalysis, retailSupplyChainDemoScene } from "./retailSupplyChainDemo";
import { devopsServiceReliabilityDemoAnalysis, devopsServiceReliabilityDemoScene } from "./devopsServiceReliabilityDemo";
import { resolveDomainExperience, type NexoraResolvedDomainExperience } from "../domain/domainExperienceRegistry";

export interface NexoraDomainDemoDefinition {
  id: string;
  label: string;
  domainId: string;
  scene: Record<string, unknown>;
  analysis: Record<string, unknown>;
  starterText: string;
  starterFocusObjectIds: string[];
}

type DomainDemoAssetKey =
  | "business_operations_fragility"
  | "devops_service_resilience"
  | "finance_market_fragility";

const DOMAIN_DEMO_ASSET_REGISTRY: Record<
  DomainDemoAssetKey,
  {
    scene: Record<string, unknown>;
    analysis: Record<string, unknown>;
  }
> = {
  business_operations_fragility: {
    scene: retailSupplyChainDemoScene as Record<string, unknown>,
    analysis: retailSupplyChainDemoAnalysis as Record<string, unknown>,
  },
  devops_service_resilience: {
    scene: devopsServiceReliabilityDemoScene as Record<string, unknown>,
    analysis: devopsServiceReliabilityDemoAnalysis as Record<string, unknown>,
  },
  finance_market_fragility: {
    scene: financeMarketRiskDemoScene as Record<string, unknown>,
    analysis: financeMarketRiskDemoAnalysis as Record<string, unknown>,
  },
};

function resolveBaseDemoAssets(selection: NexoraResolvedDomainExperience): {
  scene: Record<string, unknown>;
  analysis: Record<string, unknown>;
} {
  const assetKey = selection.pack.demoDefaults?.assetKey as DomainDemoAssetKey | undefined;
  const resolved =
    (assetKey ? DOMAIN_DEMO_ASSET_REGISTRY[assetKey] : undefined) ??
    DOMAIN_DEMO_ASSET_REGISTRY.business_operations_fragility;
  return {
    scene: clone(resolved.scene),
    analysis: clone(resolved.analysis),
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function titleCase(value: string): string {
  return String(value ?? "")
    .trim()
    .split(/[_\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildStarterText(selection: NexoraResolvedDomainExperience): string {
  const promptLead = selection.experience.promptExamples.slice(0, 2).join(" or ");
  const demoLabel = selection.pack.experienceDefaults?.demoLabel ?? `${selection.experience.label} Demo`;
  return `Loaded ${demoLabel}. Start with a prompt like ${promptLead} to see how Nexora traces pressure, fragility, KPI exposure, and action options.`;
}

/**
 * Narrative context for StrategicDecisionEngine on domain demo load (same pipeline as chat attachment).
 */
export function buildDemoStrategicAnalysisPrompt(
  demo: NexoraDomainDemoDefinition,
  experience: NexoraResolvedDomainExperience
): string {
  const analysis = demo.analysis as Record<string, unknown>;
  const pieces: string[] = [];
  const bc = experience.experience.demoBusinessContext;
  const dq = experience.experience.demoDecisionQuestion;
  if (typeof bc === "string" && bc.trim()) pieces.push(bc.trim());
  if (typeof dq === "string" && dq.trim()) pieces.push(dq.trim());
  if (typeof analysis.reply === "string" && analysis.reply.trim()) pieces.push(analysis.reply.trim());
  const sa = analysis.strategic_advice as Record<string, unknown> | undefined;
  if (sa) {
    if (typeof sa.summary === "string" && sa.summary.trim()) pieces.push(sa.summary.trim());
    if (typeof sa.why === "string" && sa.why.trim()) pieces.push(sa.why.trim());
  }
  const rp = analysis.risk_propagation as Record<string, unknown> | undefined;
  if (typeof rp?.summary === "string" && rp.summary.trim()) pieces.push(rp.summary.trim());
  const om = analysis.opponent_model as Record<string, unknown> | undefined;
  if (typeof om?.summary === "string" && om.summary.trim()) pieces.push(om.summary.trim());
  const sp = analysis.strategic_patterns as Record<string, unknown> | undefined;
  const top = sp?.top_pattern as Record<string, unknown> | undefined;
  if (typeof top?.why === "string" && top.why.trim()) pieces.push(top.why.trim());
  if (demo.label?.trim()) pieces.push(`Demo: ${demo.label.trim()}`);
  let text = pieces.join("\n\n");
  if (text.length < 8) {
    text = `${text}\n\nStrategic operations scenario requiring decision analysis.`;
  }
  return text.slice(0, 32000);
}

function deriveStarterFocusObjectIds(
  scene: Record<string, unknown>,
  analysis: Record<string, unknown>
): string[] {
  const selection = analysis?.object_selection;
  const highlighted = Array.isArray((selection as Record<string, unknown> | undefined)?.highlighted_objects)
    ? ((selection as Record<string, unknown>).highlighted_objects as unknown[])
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    : [];
  if (highlighted.length > 0) return Array.from(new Set(highlighted)).slice(0, 3);

  const rankings = Array.isArray((selection as Record<string, unknown> | undefined)?.rankings)
    ? ((selection as Record<string, unknown>).rankings as Array<Record<string, unknown>>)
        .map((item) => String(item?.id ?? "").trim())
        .filter(Boolean)
    : [];
  if (rankings.length > 0) return Array.from(new Set(rankings)).slice(0, 3);

  const objects =
    scene?.scene && typeof scene.scene === "object" && !Array.isArray(scene.scene)
      ? (((scene.scene as Record<string, unknown>).objects as unknown[]) ?? [])
      : [];
  return Array.isArray(objects)
    ? objects
        .map((item) => {
          const record = item as Record<string, unknown>;
          return String(record?.id ?? "").trim();
        })
        .filter(Boolean)
        .slice(0, 3)
    : [];
}

export function resolveDomainDemo(domainId?: string | null): NexoraDomainDemoDefinition {
  const selection = resolveDomainExperience(domainId);
  const { scene, analysis } = resolveBaseDemoAssets(selection);
  const demoId = selection.experience.defaultDemoId;
  const label = selection.pack.experienceDefaults?.demoLabel ?? `${selection.experience.label} Demo`;
  const starterText = buildStarterText(selection);

  const sceneMeta =
    scene.meta && typeof scene.meta === "object" && !Array.isArray(scene.meta)
      ? (scene.meta as Record<string, unknown>)
      : {};
  scene.meta = {
    ...sceneMeta,
    domain: selection.experience.domainId,
    demo_id: demoId,
    demo_name: label,
    domain_pack_id: selection.pack.id,
  };

  const sceneScene =
    scene.scene && typeof scene.scene === "object" && !Array.isArray(scene.scene)
      ? (scene.scene as Record<string, unknown>)
      : {};
  scene.scene = {
    ...sceneScene,
  };

  const analysisSceneJson =
    analysis.scene_json && typeof analysis.scene_json === "object" && !Array.isArray(analysis.scene_json)
      ? (analysis.scene_json as Record<string, unknown>)
      : {};
  const analysisSceneMeta =
    analysisSceneJson.meta && typeof analysisSceneJson.meta === "object" && !Array.isArray(analysisSceneJson.meta)
      ? (analysisSceneJson.meta as Record<string, unknown>)
      : {};
  analysis.scene_json = {
    ...analysisSceneJson,
    meta: {
      ...analysisSceneMeta,
      domain: selection.experience.domainId,
      demo_id: demoId,
      demo_name: label,
      domain_pack_id: selection.pack.id,
    },
  };

  analysis.analysis_summary = starterText;
  analysis.reply = starterText;
  analysis.domain = selection.experience.domainId;
  analysis.domain_pack_id = selection.pack.id;
  analysis.domain_label = selection.experience.label;
  analysis.demo_label = label;
  analysis.prompt_examples = selection.experience.promptExamples;
  analysis.selection_context = {
    domain_id: selection.experience.domainId,
    domain_label: selection.experience.label,
    domain_pack_id: selection.pack.id,
    default_demo_id: demoId,
    default_product_mode: selection.experience.preferredProductMode,
    preferred_workspace_mode_id: selection.experience.preferredWorkspaceModeId,
    preferred_cockpit_layout_mode: selection.experience.preferredCockpitLayoutMode,
    preferred_right_panel_tab: selection.experience.preferredRightPanelTab,
    panel_ids: selection.experience.preferredPanels,
    cockpit_summary_blocks: selection.pack.cockpitSummaryBlocks,
    helper_title: selection.experience.helperTitle,
    helper_body: selection.experience.helperBody,
    prompt_guide_title: selection.experience.promptGuideTitle,
    prompt_guide_body: selection.experience.promptGuideBody,
    advice_framing_hints: selection.experience.adviceFramingHints,
    executive_framing_style: selection.experience.executiveFramingStyle,
    shared_core_engine_id: selection.sharedCore.id,
  };

  const starterFocusObjectIds = deriveStarterFocusObjectIds(scene, analysis);

  return {
    id: demoId,
    label: label || `${titleCase(selection.descriptor.id)} Demo`,
    domainId: selection.experience.domainId,
    scene,
    analysis,
    starterText,
    starterFocusObjectIds,
  };
}
