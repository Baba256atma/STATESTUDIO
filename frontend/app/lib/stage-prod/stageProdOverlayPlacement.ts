/**
 * NPA-T STAGE-PROD:4 overlay placement — persistent Stage surfaces occupy
 * non-overlapping slots. Does not own Objects, cards' content, or a layout engine.
 */
import { OBJECT_PANEL_WIDTH } from "@/app/lib/hud/hudPanelDesignContract.ts";

export const stageProdOverlayPlacementIdentity =
  "NPA-T STAGE-PROD:4/OverlayPlacement" as const;

export const STAGE_PROD_OVERLAY_PLACEMENT_BOUNDARY = Object.freeze({
  ownsObjects: false as const,
  ownsDirector: false as const,
  ownsSceneOrg: false as const,
  createsLayoutEngine: false as const,
  createsCardSystem: false as const,
  usesContinuousMeasurement: false as const,
  zIndexFixesPersistentCollision: false as const,
});

export const STAGE_PROD_OVERLAY_LAYER = Object.freeze({
  objects: 0,
  persistent: 4,
  transient: 8,
  modal: 12,
} as const);

export const STAGE_PROD_OVERLAY_INSET_PX = 12;
export const STAGE_PROD_OVERLAY_TOP_PX = 72;
export const STAGE_PROD_OVERLAY_BOTTOM_PX = 20;
export const STAGE_PROD_OVERLAY_GAP_PX = 8;
export const STAGE_PROD_OVERLAY_REPORT_WIDTH_PX = 296;
export const STAGE_PROD_OVERLAY_OPERATION_WIDTH_PX = 192;
export const STAGE_PROD_OVERLAY_CHART_WIDTH_PX = 420;
export const STAGE_PROD_OVERLAY_SURFACE_HEIGHT_PX = 280;
export const STAGE_PROD_OVERLAY_OPERATION_HEIGHT_PX = 220;
export const STAGE_PROD_OVERLAY_CONTEXT_HEIGHT_PX = 360;

export type StageProdOverlaySurface =
  | "investigation"
  | "report"
  | "operation"
  | "chart";

export type StageProdOverlayRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type StageProdOverlayStyle = Readonly<{
  position: "absolute";
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  width: string;
  maxWidth?: string;
  maxHeight: string;
  zIndex: number;
}>;

export type StageProdOverlayPlacement = Readonly<{
  identity: typeof stageProdOverlayPlacementIdentity;
  investigation: StageProdOverlayStyle | null;
  report: StageProdOverlayStyle | null;
  operation: StageProdOverlayStyle | null;
  chart: StageProdOverlayStyle | null;
  omitted: readonly StageProdOverlaySurface[];
  cardLimitHonored: true;
}>;

export type StageProdOverlayPlacementInput = Readonly<{
  readonly investigation: boolean;
  readonly report: boolean;
  readonly operation: boolean;
  readonly chart: boolean;
  readonly viewportWidth?: number;
  readonly viewportHeight?: number;
}>;

const DEFAULT_VIEWPORT = Object.freeze({ width: 1100, height: 640 });

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function intersects(a: StageProdOverlayRect, b: StageProdOverlayRect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function contextWidth(viewportWidth: number): number {
  return Math.min(OBJECT_PANEL_WIDTH, Math.floor(viewportWidth * 0.42));
}

function chartWidth(viewportWidth: number): number {
  return Math.min(STAGE_PROD_OVERLAY_CHART_WIDTH_PX, Math.floor(viewportWidth * 0.46));
}

function reportWidth(viewportWidth: number): number {
  return Math.min(STAGE_PROD_OVERLAY_REPORT_WIDTH_PX, Math.floor(viewportWidth * 0.32));
}

export function projectStageProdOverlayRects(input: StageProdOverlayPlacementInput): Readonly<{
  viewport: Readonly<{ width: number; height: number }>;
  rects: Readonly<Partial<Record<StageProdOverlaySurface, StageProdOverlayRect>>>;
  omitted: readonly StageProdOverlaySurface[];
  persistentIntersections: readonly (readonly [StageProdOverlaySurface, StageProdOverlaySurface])[];
}> {
  const viewport = Object.freeze({
    width: input.viewportWidth ?? DEFAULT_VIEWPORT.width,
    height: input.viewportHeight ?? DEFAULT_VIEWPORT.height,
  });
  const inset = STAGE_PROD_OVERLAY_INSET_PX;
  const omitted: StageProdOverlaySurface[] = [];
  const rects: Partial<Record<StageProdOverlaySurface, StageProdOverlayRect>> = {};

  if (input.investigation) {
    const width = contextWidth(viewport.width);
    const bottomBand =
      input.chart || input.report
        ? Math.min(STAGE_PROD_OVERLAY_SURFACE_HEIGHT_PX, Math.floor(viewport.height * 0.42))
        : 0;
    const height = Math.min(
      STAGE_PROD_OVERLAY_CONTEXT_HEIGHT_PX,
      Math.floor(viewport.height * 0.5),
      Math.max(
        120,
        viewport.height -
          STAGE_PROD_OVERLAY_TOP_PX -
          STAGE_PROD_OVERLAY_BOTTOM_PX -
          bottomBand -
          STAGE_PROD_OVERLAY_GAP_PX,
      ),
    );
    rects.investigation = Object.freeze({
      x: viewport.width - inset - width,
      y: STAGE_PROD_OVERLAY_TOP_PX,
      width,
      height,
    });
  }

  const showChart = input.chart;
  let showReport = input.report;
  const chartW = showChart ? chartWidth(viewport.width) : 0;
  const reportW = showReport ? reportWidth(viewport.width) : 0;
  if (showChart && showReport && chartW + reportW + inset * 2 + STAGE_PROD_OVERLAY_GAP_PX > viewport.width) {
    showReport = false;
    omitted.push("report");
  }

  const surfaceH = Math.min(STAGE_PROD_OVERLAY_SURFACE_HEIGHT_PX, Math.floor(viewport.height * 0.42));
  const surfaceY = viewport.height - STAGE_PROD_OVERLAY_BOTTOM_PX - surfaceH;
  if (showChart) {
    rects.chart = Object.freeze({
      x: viewport.width - inset - chartW,
      y: surfaceY,
      width: chartW,
      height: surfaceH,
    });
  }
  if (showReport) {
    rects.report = Object.freeze({
      x: inset,
      y: surfaceY,
      width: reportW,
      height: surfaceH,
    });
  }

  if (input.operation) {
    const width = Math.min(STAGE_PROD_OVERLAY_OPERATION_WIDTH_PX, Math.floor(viewport.width * 0.34));
    const height = Math.min(STAGE_PROD_OVERLAY_OPERATION_HEIGHT_PX, Math.floor(viewport.height * 0.4));
    const rightOffset = rects.investigation
      ? inset + rects.investigation.width + STAGE_PROD_OVERLAY_GAP_PX
      : inset;
    rects.operation = Object.freeze({
      x: clamp(viewport.width - rightOffset - width, inset, viewport.width - inset - width),
      y: STAGE_PROD_OVERLAY_TOP_PX,
      width,
      height,
    });
  }

  const persistent: StageProdOverlaySurface[] = [];
  if (rects.investigation) persistent.push("investigation");
  if (rects.report) persistent.push("report");
  if (rects.chart) persistent.push("chart");
  const persistentIntersections = persistent.flatMap((left, index) =>
    persistent.slice(index + 1).flatMap((right) => {
      const a = rects[left];
      const b = rects[right];
      if (a == null || b == null || !intersects(a, b)) return [];
      return [Object.freeze([left, right] as const)];
    }),
  );

  return Object.freeze({
    viewport,
    rects: Object.freeze(rects),
    omitted: Object.freeze(omitted),
    persistentIntersections: Object.freeze(persistentIntersections),
  });
}

const INVESTIGATION_STYLE: StageProdOverlayStyle = Object.freeze({
  position: "absolute",
  top: `${STAGE_PROD_OVERLAY_TOP_PX}px`,
  right: `${STAGE_PROD_OVERLAY_INSET_PX}px`,
  width: `min(${OBJECT_PANEL_WIDTH}px, 42%)`,
  maxHeight: `min(50%, calc(100% - ${STAGE_PROD_OVERLAY_TOP_PX}px - 42% - ${STAGE_PROD_OVERLAY_BOTTOM_PX}px - ${STAGE_PROD_OVERLAY_GAP_PX}px))`,
  zIndex: STAGE_PROD_OVERLAY_LAYER.persistent,
});

const REPORT_STYLE: StageProdOverlayStyle = Object.freeze({
  position: "absolute",
  left: `${STAGE_PROD_OVERLAY_INSET_PX}px`,
  bottom: `${STAGE_PROD_OVERLAY_BOTTOM_PX}px`,
  width: `min(${STAGE_PROD_OVERLAY_REPORT_WIDTH_PX}px, 32%)`,
  maxHeight: "42%",
  zIndex: STAGE_PROD_OVERLAY_LAYER.persistent,
});

const CHART_STYLE: StageProdOverlayStyle = Object.freeze({
  position: "absolute",
  right: `${STAGE_PROD_OVERLAY_INSET_PX}px`,
  bottom: `${STAGE_PROD_OVERLAY_BOTTOM_PX}px`,
  width: `min(${STAGE_PROD_OVERLAY_CHART_WIDTH_PX}px, 46%)`,
  maxHeight: "42%",
  zIndex: STAGE_PROD_OVERLAY_LAYER.persistent,
});

const OPERATION_DEFAULT_STYLE: StageProdOverlayStyle = Object.freeze({
  position: "absolute",
  top: `${STAGE_PROD_OVERLAY_TOP_PX}px`,
  right: `${STAGE_PROD_OVERLAY_INSET_PX}px`,
  width: `min(${STAGE_PROD_OVERLAY_OPERATION_WIDTH_PX}px, 34%)`,
  maxHeight: "40%",
  zIndex: STAGE_PROD_OVERLAY_LAYER.transient,
});

const OPERATION_BESIDE_CONTEXT_STYLE: StageProdOverlayStyle = Object.freeze({
  position: "absolute",
  top: `${STAGE_PROD_OVERLAY_TOP_PX}px`,
  right: `calc(${STAGE_PROD_OVERLAY_INSET_PX}px + min(${OBJECT_PANEL_WIDTH}px, 42%) + ${STAGE_PROD_OVERLAY_GAP_PX}px)`,
  width: `min(${STAGE_PROD_OVERLAY_OPERATION_WIDTH_PX}px, 34%)`,
  maxHeight: "40%",
  zIndex: STAGE_PROD_OVERLAY_LAYER.transient,
});

export function resolveStageProdOverlayPlacement(
  input: StageProdOverlayPlacementInput,
): StageProdOverlayPlacement {
  const projected = projectStageProdOverlayRects(input);
  return Object.freeze({
    identity: stageProdOverlayPlacementIdentity,
    investigation: input.investigation ? INVESTIGATION_STYLE : null,
    report: projected.rects.report ? REPORT_STYLE : null,
    operation: input.operation
      ? input.investigation
        ? OPERATION_BESIDE_CONTEXT_STYLE
        : OPERATION_DEFAULT_STYLE
      : null,
    chart: input.chart ? CHART_STYLE : null,
    omitted: projected.omitted,
    cardLimitHonored: true,
  });
}

export function stageProdOverlayRectsIntersect(
  left: StageProdOverlayRect,
  right: StageProdOverlayRect,
): boolean {
  return intersects(left, right);
}
