"use client";

import {
  classifySceneSurface,
  isSceneSurfaceAllowedInOperationalWorkspace,
  logSceneCleanup,
  type SceneSurfaceType,
} from "./sceneSurfaceGovernance";

export type SceneOccupancySurface = {
  panelId: string;
  owner: string;
  visible: boolean;
  coverageEstimate?: number;
  overlapEstimate?: number;
  duplicateDataEstimate?: number;
  surfaceType?: SceneSurfaceType;
};

export type SceneOccupancyAudit = {
  panelCount: number;
  sceneCoveragePercent: number;
  overlapCount: number;
  duplicateDataCount: number;
  restrictedPanelCount: number;
};

const loggedAuditKeys = new Set<string>();

function logSceneOccupancyOnce(key: string, payload: SceneOccupancyAudit): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedAuditKeys.has(key)) return;
  loggedAuditKeys.add(key);
  globalThis.console?.info?.("[Nexora][SceneOccupancy]", payload);
}

export function runSceneOccupancyAudit(surfaces: readonly SceneOccupancySurface[]): SceneOccupancyAudit {
  const visibleSurfaces = surfaces.filter((surface) => surface.visible);
  const panelCount = visibleSurfaces.length;
  const sceneCoveragePercent = Math.min(
    100,
    Math.round(
      visibleSurfaces.reduce((sum, surface) => sum + Math.max(0, surface.coverageEstimate ?? 0), 0)
    )
  );
  const overlapCount = visibleSurfaces.reduce(
    (sum, surface) => sum + Math.max(0, Math.round(surface.overlapEstimate ?? 0)),
    0
  );
  const duplicateDataCount = visibleSurfaces.reduce(
    (sum, surface) => sum + Math.max(0, Math.round(surface.duplicateDataEstimate ?? 0)),
    0
  );
  const restrictedPanelCount = visibleSurfaces.reduce((sum, surface) => {
    const classification = classifySceneSurface(surface.panelId, surface.owner);
    const surfaceType = surface.surfaceType ?? classification.surfaceType;
    return isSceneSurfaceAllowedInOperationalWorkspace(surfaceType) ? sum : sum + 1;
  }, 0);

  const audit: SceneOccupancyAudit = {
    panelCount,
    sceneCoveragePercent,
    overlapCount,
    duplicateDataCount,
    restrictedPanelCount,
  };

  logSceneOccupancyOnce(
    `${panelCount}:${sceneCoveragePercent}:${overlapCount}:${duplicateDataCount}:${restrictedPanelCount}`,
    audit
  );
  logSceneCleanup({
    panelCount,
    restrictedPanelCount,
    duplicateControlCount: duplicateDataCount,
  });

  return audit;
}
