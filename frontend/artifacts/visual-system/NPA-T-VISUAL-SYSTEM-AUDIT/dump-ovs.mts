/**
 * Audit-only OVS/theme dump. Does not import or mutate production runtime.
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "../../../app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import { projectExecutiveOvsObjectKindHandoff } from "../../../app/lib/spatial-presentation/projectExecutiveOvsObjectKindHandoff.ts";
import {
  resolveExecutiveOvsObjectFamily,
  resolveExecutiveOvsObjectVisualLanguage,
} from "../../../app/lib/spatial-presentation/executiveOvsObjectVisualLanguage.ts";
import { resolveExecutiveOvsObjectStateVisual } from "../../../app/lib/spatial-presentation/executiveOvsObjectStateVisual.ts";
const EXECUTIVE_OBJECT_SURFACE_COLORS = {
  "object.surface.base": "#7dd3fc",
  "object.surface.watch": "#fbbf24",
  "object.surface.risk": "#f87171",
  "object.surface.unresolved": "#94a3b8",
} as const;

const out = dirname(fileURLToPath(import.meta.url));

function mixHexToward(hex: string, toward: string, t: number): string {
  const parse = (value: string) => {
    const raw = value.replace("#", "");
    return [
      Number.parseInt(raw.slice(0, 2), 16),
      Number.parseInt(raw.slice(2, 4), 16),
      Number.parseInt(raw.slice(4, 6), 16),
    ] as const;
  };
  const a = parse(hex);
  const b = parse(toward);
  const channel = (i: number) =>
    Math.round(a[i] * (1 - t) + b[i] * t)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(0)}${channel(1)}${channel(2)}`;
}

const objects = NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((object) => {
  const handoffKind = projectExecutiveOvsObjectKindHandoff({
    id: object.id,
    kind: object.kind,
  });
  const family = resolveExecutiveOvsObjectFamily(handoffKind);
  const language = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: handoffKind,
  });
  const state = resolveExecutiveOvsObjectStateVisual({
    objectKind: handoffKind,
    status: object.status,
    attention: object.attention,
  });
  const surfaceToken =
    state.managementClass === "critical"
      ? "object.surface.risk"
      : state.managementClass === "watch"
        ? "object.surface.watch"
        : state.managementClass === "unresolved"
          ? "object.surface.unresolved"
          : "object.surface.base";
  const baseColor = EXECUTIVE_OBJECT_SURFACE_COLORS[surfaceToken];
  const liveBodyColor = mixHexToward(baseColor, "#0b121c", 0.62);
  return {
    id: object.id,
    label: object.label,
    catalogKind: object.kind,
    status: object.status,
    attention: object.attention,
    handoffKind,
    family,
    primitive: language.primitive,
    width: language.width,
    height: language.height,
    depth: language.depth,
    aspect: `${language.width}:${language.height}:${language.depth}`,
    fallback: language.fallback,
    managementClass: state.managementClass,
    interactionClass: state.interactionClass,
    motionHint: state.motionHint,
    surfaceToken,
    baseColor,
    liveBodyColorApprox: liveBodyColor,
    emissiveScale: state.emissiveScale,
    liveEmissiveFactorApprox: Number(
      (language.material.emissiveScale * state.emissiveScale * 0.22).toFixed(4),
    ),
  };
});

const payload = {
  identity: "NPA-T VISUAL-SYSTEM:AUDIT/OvsCatalogDump",
  productionChanges: 0,
  objects,
};

await writeFile(join(out, "ovs-catalog-dump.json"), `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify(payload, null, 2));
