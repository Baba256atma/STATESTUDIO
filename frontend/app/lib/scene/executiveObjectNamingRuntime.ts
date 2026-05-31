/** E2:58 — Stable executive object names rendered directly in the scene. */

import type { SceneObject } from "../sceneTypes";
import { resolveDomainAwareObjectName } from "../visual/domainVocabulary";

export type ExecutiveObjectNamingInput = {
  object: SceneObject;
  index: number;
  domainId?: string | null;
};

const logKeys = new Set<string>();

function fallbackObjectName(obj: SceneObject, index: number): string {
  const rawId = String(obj?.id ?? "").trim();
  if (rawId) {
    const cleaned = rawId.replace(/^obj_+/, "").replace(/_\d+$/, "").replace(/[_-]+/g, " ").trim();
    if (cleaned) {
      return cleaned
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
  }

  const firstTag = Array.isArray(obj?.tags) ? String(obj.tags[0] ?? "").trim() : "";
  if (firstTag) {
    return firstTag
      .replace(/[_-]+/g, " ")
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  const fallbackType = String(obj?.type ?? `Object ${index + 1}`);
  return fallbackType.charAt(0).toUpperCase() + fallbackType.slice(1);
}

export function resolveExecutiveObjectName(input: ExecutiveObjectNamingInput): string {
  const domainAwareName = resolveDomainAwareObjectName({
    explicitLabel: String((input.object as { label?: string }).label ?? "").trim() || null,
    objectName: String(input.object?.name ?? "").trim() || null,
    objectId: String(input.object?.id ?? "").trim() || null,
    tags: Array.isArray(input.object?.tags) ? input.object.tags.map((tag) => String(tag ?? "")) : null,
    domainId: input.domainId,
  });
  const name = normalizeExecutiveObjectName(domainAwareName || fallbackObjectName(input.object, input.index));
  logObjectNaming({
    objectId: String(input.object?.id ?? "").trim() || null,
    name,
    source: "executiveObjectNamingRuntime",
  });
  return name;
}

export function normalizeExecutiveObjectName(value: string | null | undefined, fallback = "Object"): string {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  return text.length > 42 ? `${text.slice(0, 41).trimEnd()}…` : text;
}

export function logObjectNaming(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][ObjectNaming]", payload);
}

export function resetExecutiveObjectNamingLogsForTests(): void {
  logKeys.clear();
}
