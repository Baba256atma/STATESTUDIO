import {
  resolveDomainSelection,
  listSelectableDomains,
  type NexoraDomainDescriptor,
  type NexoraResolvedDomainSelection,
} from "./domainSelectionRegistry";
import {
  getDomainPack,
  type NexoraNavGroupKey,
  type NexoraShellSectionKey,
} from "./domainPackRegistry";
import { NEXORA_SHARED_CORE_ENGINE } from "../core/nexoraCoreEngineBoundary";
import type { ProductModeId } from "../modes/productModesContract";

export type NexoraRightPanelDefault =
  | "timeline"
  | "conflict"
  | "object_focus"
  | "memory_insights"
  | "risk_flow"
  | "replay"
  | "strategic_advice"
  | "opponent_moves"
  | "strategic_patterns"
  | "executive_dashboard"
  | "collaboration"
  | "workspace";

export type NexoraExecutiveFramingStyle =
  | "systemic"
  | "operational"
  | "financial"
  | "resilience"
  | "strategic";

export interface NexoraDomainExperience {
  domainId: string;
  label: string;
  description: string;
  activeDomainPackId: string;
  defaultDemoId: string;
  preferredProductMode: "general" | "business" | "finance" | "devops" | "strategy";
  preferredWorkspaceModeId: ProductModeId;
  preferredCockpitLayoutMode: "standard" | "expanded";
  preferredRightPanelTab: NexoraRightPanelDefault;
  preferredPanels: string[];
  visibleNavGroups: NexoraNavGroupKey[];
  visibleSections: NexoraShellSectionKey[];
  promptExamples: string[];
  helperTitle: string;
  helperBody: string;
  promptGuideTitle: string;
  promptGuideBody: string;
  adviceFramingHints: string[];
  executiveFramingStyle: NexoraExecutiveFramingStyle;
  tags: string[];
  sharedCoreEngineId: string;
}

export interface NexoraResolvedDomainExperience {
  descriptor: NexoraDomainDescriptor;
  pack: ReturnType<typeof getDomainPack>;
  experience: NexoraDomainExperience;
  sharedCore: typeof NEXORA_SHARED_CORE_ENGINE;
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function deriveCockpitLayoutMode(domainId: string): "standard" | "expanded" {
  return domainId === "finance" || domainId === "devops" ? "expanded" : "standard";
}

function deriveWorkspaceModeId(domainId: string): ProductModeId {
  switch (domainId) {
    case "finance":
      return "analyst";
    case "devops":
      return "analyst";
    case "strategy":
      return "executive";
    case "business":
      return "manager";
    default:
      return "manager";
  }
}

function deriveRightPanelDefault(domainId: string): NexoraRightPanelDefault {
  switch (domainId) {
    case "finance":
      return "risk_flow";
    case "devops":
      return "risk_flow";
    case "strategy":
      return "strategic_advice";
    case "business":
      return "executive_dashboard";
    default:
      return "executive_dashboard";
  }
}

function deriveExecutiveFramingStyle(domainId: string): NexoraExecutiveFramingStyle {
  switch (domainId) {
    case "business":
      return "operational";
    case "finance":
      return "financial";
    case "devops":
      return "resilience";
    case "strategy":
      return "strategic";
    default:
      return "systemic";
  }
}

function buildHelperCopy(selection: NexoraResolvedDomainSelection): {
  helperTitle: string;
  helperBody: string;
  promptGuideTitle: string;
  promptGuideBody: string;
} {
  const packDefaults = selection.pack.experienceDefaults;
  if (
    packDefaults?.helperTitle &&
    packDefaults?.helperBody &&
    packDefaults?.promptGuideTitle &&
    packDefaults?.promptGuideBody
  ) {
    return {
      helperTitle: packDefaults.helperTitle,
      helperBody: packDefaults.helperBody,
      promptGuideTitle: packDefaults.promptGuideTitle,
      promptGuideBody: packDefaults.promptGuideBody,
    };
  }

  switch (selection.descriptor.id) {
    case "business":
      return {
        helperTitle: "See how business pressure moves through flow, buffers, and outcomes",
        helperBody: "Focus on flow disruption, fragility, and operational pressure across the business system.",
        promptGuideTitle: "Start with a business pressure prompt.",
        promptGuideBody: "Prompt -> highlighted flow -> fragility -> timeline -> action. Try a short business-system stress signal.",
      };
    case "finance":
      return {
        helperTitle: "See how financial pressure spreads through exposure and liquidity",
        helperBody: "Focus on downside risk, funding stress, concentration, and balance-sheet pressure.",
        promptGuideTitle: "Start with a finance stress prompt.",
        promptGuideBody: "Prompt -> exposed nodes -> downside risk -> timeline -> response. Try a short liquidity or drawdown signal.",
      };
    case "devops":
      return {
        helperTitle: "See how dependency failures propagate through service reliability",
        helperBody: "Focus on dependency load, failure propagation, and system resilience under operational stress.",
        promptGuideTitle: "Start with a resilience or dependency prompt.",
        promptGuideBody: "Prompt -> dependency highlight -> propagation -> timeline -> stabilization action.",
      };
    case "strategy":
      return {
        helperTitle: "See how strategic pressure shifts position, risk, and response options",
        helperBody: "Focus on competitive pressure, strategic scenarios, and decision responses under uncertainty.",
        promptGuideTitle: "Start with a strategic pressure prompt.",
        promptGuideBody: "Prompt -> strategic pressure -> scenario implications -> executive action.",
      };
    default:
      return {
        helperTitle: "See how pressure moves through a system",
        helperBody: "Focus on where fragility appears, how it spreads, and what stabilizing action makes sense next.",
        promptGuideTitle: "Start with a system pressure prompt.",
        promptGuideBody: "Prompt -> scene highlight -> risk -> timeline -> action. Try one of these to see the full flow.",
      };
  }
}

function deriveAdviceFramingHints(selection: NexoraResolvedDomainSelection): string[] {
  const config = selection.pack.adviceConfig;
  return uniq([
    ...(config?.managerHints ?? []),
    ...(config?.executiveHints ?? []),
    ...(config?.analystHints ?? []),
  ]).slice(0, 6);
}

function buildDomainExperience(selection: NexoraResolvedDomainSelection): NexoraDomainExperience {
  const helperCopy = buildHelperCopy(selection);
  const packDefaults = selection.pack.experienceDefaults;
  return {
    domainId: selection.descriptor.id,
    label: selection.descriptor.label,
    description: selection.descriptor.description,
    activeDomainPackId: selection.pack.id,
    defaultDemoId: selection.descriptor.defaultDemoId,
    preferredProductMode: selection.descriptor.defaultProductMode,
    preferredWorkspaceModeId:
      packDefaults?.preferredWorkspaceModeId ?? deriveWorkspaceModeId(selection.descriptor.id),
    preferredCockpitLayoutMode:
      packDefaults?.preferredCockpitLayoutMode ?? deriveCockpitLayoutMode(selection.descriptor.id),
    preferredRightPanelTab:
      packDefaults?.preferredRightPanelTab ?? deriveRightPanelDefault(selection.descriptor.id),
    preferredPanels: selection.pack.panelIds,
    visibleNavGroups: selection.pack.visibleNavGroups,
    visibleSections: selection.pack.visibleSections,
    promptExamples: uniq(selection.descriptor.promptExamples),
    helperTitle: helperCopy.helperTitle,
    helperBody: helperCopy.helperBody,
    promptGuideTitle: helperCopy.promptGuideTitle,
    promptGuideBody: helperCopy.promptGuideBody,
    adviceFramingHints: deriveAdviceFramingHints(selection),
    executiveFramingStyle:
      packDefaults?.executiveFramingStyle ?? deriveExecutiveFramingStyle(selection.descriptor.id),
    tags: uniq([...selection.descriptor.tags, ...selection.pack.tags]),
    sharedCoreEngineId: NEXORA_SHARED_CORE_ENGINE.id,
  };
}

export function resolveDomainExperience(domainId?: string | null): NexoraResolvedDomainExperience {
  const selection = resolveDomainSelection(domainId);
  return {
    ...selection,
    experience: buildDomainExperience(selection),
    sharedCore: NEXORA_SHARED_CORE_ENGINE,
  };
}

export function listDomainExperiences(): NexoraDomainExperience[] {
  return listSelectableDomains().map((descriptor) => resolveDomainExperience(descriptor.id).experience);
}
