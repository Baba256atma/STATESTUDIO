/**
 * P3 — Resolve executive layout template from domain, object semantics, and scene purpose.
 */

import { shouldSuppressIdleDebugLog } from "../../runtime/idleRuntimeStabilityGuard";
import type {
  ExecutiveLayoutObjectRoleProfile,
  ExecutiveLayoutTemplateId,
  ResolveExecutiveLayoutTemplateInput,
  ResolveExecutiveLayoutTemplateResult,
} from "./executiveLayoutTemplateTypes";

const loggedTemplateSignatures = new Set<string>();

const SUPPLY_CHAIN_KEYWORDS = [
  "supplier",
  "delivery",
  "inventory",
  "warehouse",
  "demand",
  "customer",
  "delay",
  "order_flow",
  "order flow",
  "fulfillment",
  "capacity buffer",
  "operational flow",
  "cash pressure",
];

const PMO_KEYWORDS = [
  "milestone",
  "task",
  "resource",
  "budget",
  "stakeholder",
  "decision",
  "project",
  "goal",
  "strategy",
  "timeline",
  "delivery",
];

const FINANCIAL_KEYWORDS = [
  "cash_flow",
  "cash flow",
  "revenue",
  "cost",
  "margin",
  "forecast",
  "investment",
  "debt",
  "liquidity",
  "pricing",
  "price pressure",
];

const DOMAIN_TEMPLATE_MAP: Readonly<Record<string, ExecutiveLayoutTemplateId>> = Object.freeze({
  supply_chain: "supply_chain",
  retail: "supply_chain",
  pmo: "project_pmo",
  finance: "financial",
});

function normalizeToken(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function scoreKeywordHits(tokens: string[], keywords: readonly string[]): number {
  const haystack = tokens.join(" ");
  let score = 0;
  for (const keyword of keywords) {
    const normalized = normalizeToken(keyword);
    if (!normalized) continue;
    if (haystack.includes(normalized)) score += normalized.includes(" ") ? 2 : 1;
  }
  return score;
}

function scoreTemplateFromProfiles(
  profiles: ExecutiveLayoutObjectRoleProfile[],
  keywords: readonly string[]
): number {
  return profiles.reduce((total, profile) => total + scoreKeywordHits(profile.tokens, keywords), 0);
}

function resolveDomainTemplateId(domainId?: string | null): ExecutiveLayoutTemplateId | null {
  const normalized = normalizeToken(domainId).replace(/\s+/g, "_");
  if (!normalized) return null;
  if (DOMAIN_TEMPLATE_MAP[normalized]) return DOMAIN_TEMPLATE_MAP[normalized];
  if (normalized.includes("supply")) return "supply_chain";
  if (normalized.includes("pmo") || normalized.includes("project")) return "project_pmo";
  if (normalized.includes("financ") || normalized.includes("cash")) return "financial";
  return null;
}

export function collectExecutiveObjectSemanticTokens(obj: unknown, fallbackId = "object"): string[] {
  const record = obj as {
    label?: unknown;
    name?: unknown;
    role?: unknown;
    type?: unknown;
    semantic?: { role?: unknown; category?: unknown; tags?: unknown[]; keywords?: unknown[] };
    tags?: unknown[];
  } | null;
  const label = normalizeToken(record?.label ?? record?.name ?? fallbackId);
  const role = normalizeToken(record?.role ?? record?.semantic?.role ?? "");
  const category = normalizeToken(record?.semantic?.category ?? "");
  const tags = [
    ...(Array.isArray(record?.semantic?.tags) ? record.semantic.tags : []),
    ...(Array.isArray(record?.semantic?.keywords) ? record.semantic.keywords : []),
    ...(Array.isArray(record?.tags) ? record.tags : []),
  ].map((tag) => normalizeToken(tag));

  return Array.from(new Set([label, role, category, ...tags].filter(Boolean)));
}

export function buildExecutiveLayoutObjectRoleProfiles(
  objects: unknown[],
  classifyRole: (obj: unknown) => import("./normalizeExecutiveObjectLayout").ExecutiveObjectLayoutRole,
  readId: (obj: unknown, index: number) => string,
  readLabel: (obj: unknown, id: string) => string
): ExecutiveLayoutObjectRoleProfile[] {
  return objects.map((obj, index) => {
    const id = readId(obj, index);
    return {
      id,
      role: classifyRole(obj),
      label: readLabel(obj, id),
      tokens: collectExecutiveObjectSemanticTokens(obj, id),
    };
  });
}

export function resolveExecutiveLayoutTemplate(
  input: ResolveExecutiveLayoutTemplateInput
): ResolveExecutiveLayoutTemplateResult {
  const domainId = input.domainId?.trim() || null;
  const domainTemplate = resolveDomainTemplateId(domainId);

  let supplyScore = scoreTemplateFromProfiles(input.objectRoles, SUPPLY_CHAIN_KEYWORDS);
  let pmoScore = scoreTemplateFromProfiles(input.objectRoles, PMO_KEYWORDS);
  let financialScore = scoreTemplateFromProfiles(input.objectRoles, FINANCIAL_KEYWORDS);

  const purposeText = normalizeToken(input.scenePurpose);
  if (purposeText.includes("supply")) supplyScore += 3;
  if (purposeText.includes("pmo") || purposeText.includes("project")) pmoScore += 3;
  if (purposeText.includes("financ")) financialScore += 3;

  let templateId: ExecutiveLayoutTemplateId = "generic_executive";
  let reason = "fallback_generic";

  if (domainTemplate) {
    templateId = domainTemplate;
    reason = "domain_id";
  } else {
    const scores = [
      { id: "supply_chain" as const, score: supplyScore },
      { id: "project_pmo" as const, score: pmoScore },
      { id: "financial" as const, score: financialScore },
    ].sort((a, b) => b.score - a.score);

    const best = scores[0];
    const runnerUp = scores[1];
    if (best && best.score >= 2 && best.score > (runnerUp?.score ?? 0)) {
      templateId = best.id;
      reason = "object_role_keywords";
    } else if (input.objectCount >= 6 && input.objectCount <= 12 && supplyScore >= 3) {
      templateId = "supply_chain";
      reason = "operational_supply_chain_heuristic";
    }
  }

  return {
    templateId,
    domainId,
    reason,
  };
}

export function logExecutiveLayoutTemplateResolvedOnce(input: {
  templateId: ExecutiveLayoutTemplateId;
  domainId: string | null;
  objectCount: number;
  roles: ExecutiveLayoutObjectRoleProfile[];
  reason: string;
}): void {
  if (process.env.NODE_ENV === "production") return;

  const roleSummary = input.roles.map((profile) => `${profile.id}:${profile.role}`).join(",");
  const signature = [
    input.templateId,
    input.domainId ?? "none",
    input.objectCount,
    roleSummary,
    input.reason,
  ].join("|");

  if (loggedTemplateSignatures.has(signature)) return;
  if (shouldSuppressIdleDebugLog(`layout-template-resolved:${signature}`)) return;
  loggedTemplateSignatures.add(signature);

  console.info("[Nexora][LayoutTemplateResolved]", {
    templateId: input.templateId,
    domainId: input.domainId,
    objectCount: input.objectCount,
    roles: input.roles.map((profile) => ({
      id: profile.id,
      role: profile.role,
      label: profile.label,
    })),
    reason: input.reason,
  });
}

export function resetExecutiveLayoutTemplateLogsForTests(): void {
  loggedTemplateSignatures.clear();
}
