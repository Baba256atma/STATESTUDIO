import { normalizeDomainId } from "./domainHelpers.ts";
import { validateDomainProjectSnapshot } from "./domainProjectValidation.ts";
import type {
  DomainProjectSaveResult,
  DomainProjectSnapshot,
} from "./domainProjectTypes.ts";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function sceneObjectCount(scene: unknown): number {
  const root = asRecord(scene);
  const nestedScene = asRecord(root.scene);
  const objects = Array.isArray(nestedScene.objects)
    ? nestedScene.objects
    : Array.isArray(root.objects)
      ? root.objects
      : [];
  return objects.length;
}

function sceneEdgeCount(scene: unknown): number {
  const root = asRecord(scene);
  const nestedScene = asRecord(root.scene);
  const loops = Array.isArray(nestedScene.loops)
    ? nestedScene.loops
    : Array.isArray(root.loops)
      ? root.loops
      : [];

  return loops.reduce((count, loop) => {
    const edges = asRecord(loop).edges;
    return count + (Array.isArray(edges) ? edges.length : 0);
  }, 0);
}

function normalizeName(value: unknown): string {
  const name = String(value ?? "").trim();
  return name || "Nexora Domain Project";
}

function defaultProjectId(domainId: string, scene: unknown): string {
  return `domain_${domainId}_${sceneObjectCount(scene)}_${sceneEdgeCount(scene)}`;
}

export function buildDomainProjectSnapshot(params: {
  projectId?: string;
  projectName?: string;
  activeDomainId: unknown;
  scene: unknown;
  derived?: DomainProjectSnapshot["derived"];
}): DomainProjectSaveResult {
  const warnings: string[] = [];
  const activeDomainId = normalizeDomainId(params.activeDomainId);
  if (activeDomainId !== params.activeDomainId) warnings.push("active_domain_fallback_applied");

  const now = new Date().toISOString();
  const snapshot: DomainProjectSnapshot = {
    version: "domain-project-v1",
    projectId: String(params.projectId ?? "").trim() || defaultProjectId(activeDomainId, params.scene),
    projectName: normalizeName(params.projectName),
    activeDomainId,
    createdAt: now,
    updatedAt: now,
    scene: params.scene,
    metadata: {
      createdBy: "nexora-domain",
      domainPhase: "domain",
      objectCount: sceneObjectCount(params.scene),
      edgeCount: sceneEdgeCount(params.scene),
    },
    ...(params.derived ? { derived: params.derived } : {}),
  };

  const validation = validateDomainProjectSnapshot(snapshot);
  return {
    success: validation.valid,
    snapshot: validation.valid ? snapshot : undefined,
    warnings: [...warnings, ...validation.warnings],
  };
}
