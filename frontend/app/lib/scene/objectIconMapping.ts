import type { SceneObject } from "../sceneTypes";

export type SceneObjectIcon = {
  src: string;
  key: string;
  label: string;
};

const ICON_SRC_BY_KEY: Record<string, string> = {
  ai: "/icons/ai.svg",
  core: "/icons/core.svg",
  finance: "/icons/finance.svg",
  operations: "/icons/operations.svg",
  risk: "/icons/risk.svg",
  security: "/icons/security.svg",
  signal: "/icons/signal.svg",
  supply_chain: "/icons/supply-chain.svg",
};

const KEYWORD_TO_ICON_KEY: Array<[string, string]> = [
  ["finance", "finance"],
  ["financial", "finance"],
  ["cash", "finance"],
  ["revenue", "finance"],
  ["cost", "finance"],
  ["risk", "risk"],
  ["fragility", "risk"],
  ["exposure", "risk"],
  ["threat", "security"],
  ["security", "security"],
  ["vulnerability", "security"],
  ["access", "security"],
  ["ai", "ai"],
  ["agent", "ai"],
  ["intelligence", "ai"],
  ["operation", "operations"],
  ["operations", "operations"],
  ["process", "operations"],
  ["service", "operations"],
  ["supplier", "supply_chain"],
  ["inventory", "supply_chain"],
  ["logistics", "supply_chain"],
  ["delivery", "supply_chain"],
  ["signal", "signal"],
  ["monitor", "signal"],
  ["scanner", "signal"],
  ["core", "core"],
];

function normalizeText(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function collectIconHints(obj: SceneObject): string[] {
  const semantic = obj.semantic && typeof obj.semantic === "object" ? obj.semantic : {};
  const meta = obj.meta && typeof obj.meta === "object" ? (obj.meta as Record<string, unknown>) : {};
  return [
    obj.domain,
    meta.domainId,
    obj.role,
    meta.semanticRole,
    obj.type,
    obj.category,
    obj.risk_kind,
    obj.label,
    obj.name,
    obj.canonical_name,
    semantic.role,
    semantic.domain,
    semantic.category,
    semantic.type,
    ...(Array.isArray(obj.tags) ? obj.tags : []),
    ...(Array.isArray(obj.keywords) ? obj.keywords : []),
    ...(Array.isArray(semantic.tags) ? semantic.tags : []),
    ...(Array.isArray(semantic.keywords) ? semantic.keywords : []),
  ].map(normalizeText).filter(Boolean);
}

export function resolveSceneObjectIcon(obj: SceneObject): SceneObjectIcon | null {
  const hints = collectIconHints(obj);
  const directKey = hints.find((hint) => ICON_SRC_BY_KEY[hint]);
  if (directKey) {
    return {
      src: ICON_SRC_BY_KEY[directKey],
      key: directKey,
      label: `${directKey.replace(/_/g, " ")} icon`,
    };
  }

  const joinedHints = ` ${hints.join(" ")} `;
  const matched = KEYWORD_TO_ICON_KEY.find(([keyword]) => joinedHints.includes(` ${keyword} `));
  if (!matched) return null;

  const [, key] = matched;
  return {
    src: ICON_SRC_BY_KEY[key],
    key,
    label: `${key.replace(/_/g, " ")} icon`,
  };
}
