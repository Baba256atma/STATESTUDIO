import { getDomainPack, type NexoraDomainPack } from "./domainPackRegistry";
import { BUSINESS_DOMAIN_DESCRIPTOR_INPUT } from "./packs/businessDomainPack";
import { FINANCE_DOMAIN_DESCRIPTOR_INPUT } from "./packs/financeDomainPack";
import { DEVOPS_DOMAIN_DESCRIPTOR_INPUT } from "./packs/devopsDomainPack";

export interface NexoraDomainDescriptor {
  id: string;
  label: string;
  description: string;
  iconHint?: string;
  domainPackId: string;
  defaultDemoId: string;
  defaultProductMode: "general" | "business" | "finance" | "devops" | "strategy";
  promptExamples: string[];
  tags: string[];
}

export interface NexoraResolvedDomainSelection {
  descriptor: NexoraDomainDescriptor;
  pack: NexoraDomainPack;
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function createDescriptor(input: NexoraDomainDescriptor): NexoraDomainDescriptor {
  return {
    ...input,
    promptExamples: uniq(input.promptExamples),
    tags: uniq(input.tags),
  };
}

export const NEXORA_DOMAIN_SELECTION_REGISTRY: Record<string, NexoraDomainDescriptor> = {
  general: createDescriptor({
    id: "general",
    label: "General",
    description: "Shared systems workspace for broad pressure, fragility, and intervention analysis.",
    iconHint: "network",
    domainPackId: "general_core_pack",
    defaultDemoId: "general_systems_demo",
    defaultProductMode: "general",
    promptExamples: [
      "where is the system under pressure",
      "show the fragile path",
      "what would stabilize this system",
    ],
    tags: ["systems", "general", "shared_core"],
  }),
  business: createDescriptor(BUSINESS_DOMAIN_DESCRIPTOR_INPUT),
  finance: createDescriptor(FINANCE_DOMAIN_DESCRIPTOR_INPUT),
  devops: createDescriptor(DEVOPS_DOMAIN_DESCRIPTOR_INPUT),
  strategy: createDescriptor({
    id: "strategy",
    label: "Strategy",
    description: "Competitive pressure, alternatives, strategic response, and executive framing.",
    iconHint: "compass",
    domainPackId: "strategy_competition_pack",
    defaultDemoId: "strategy_market_pressure_demo",
    defaultProductMode: "strategy",
    promptExamples: ["competitor pricing pressure", "market share decline", "response options"],
    tags: ["strategy", "competition", "decision"],
  }),
};

export function listSelectableDomains(): NexoraDomainDescriptor[] {
  return Object.values(NEXORA_DOMAIN_SELECTION_REGISTRY);
}

export function resolveDomainDescriptor(domainId?: string | null): NexoraDomainDescriptor {
  const normalized = String(domainId ?? "").trim().toLowerCase();
  return NEXORA_DOMAIN_SELECTION_REGISTRY[normalized] ?? NEXORA_DOMAIN_SELECTION_REGISTRY.general;
}

export function resolveDomainSelection(domainId?: string | null): NexoraResolvedDomainSelection {
  const descriptor = resolveDomainDescriptor(domainId);
  return {
    descriptor,
    pack: getDomainPack(descriptor.id),
  };
}
