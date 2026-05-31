/**
 * E2:71 — Canonical HUD layout signatures for stable compare / dedupe.
 */

export const HUD_LAYOUT_PIXEL_TOLERANCE = 2;

export type HudLayoutPanelSignatureInput = {
  panelId: string;
  anchor?: string | null;
  top?: number | string | null;
  left?: number | string | null;
  right?: number | string | null;
  bottom?: number | string | null;
  width?: number | null;
  height?: number | null;
  collapsed?: boolean;
  visible?: boolean;
  viewportWidth?: number;
};

export function bucketViewportWidth(viewportWidth: number): number {
  if (viewportWidth < 768) return 390;
  if (viewportWidth < 1024) return 820;
  return 1440;
}

export function normalizeHudLayoutNumber(value: number | string | null | undefined): number | string | null {
  if (value == null) return null;
  if (typeof value === "string") return value;
  return Math.round(Number(value.toFixed(1)));
}

export function areHudLayoutNumbersStable(
  before: number,
  after: number,
  tolerancePx: number = HUD_LAYOUT_PIXEL_TOLERANCE
): boolean {
  return Math.abs(before - after) <= tolerancePx;
}

export function buildHudPanelLayoutSignature(input: HudLayoutPanelSignatureInput): string {
  return JSON.stringify({
    panelId: input.panelId,
    anchor: input.anchor ?? null,
    top: normalizeHudLayoutNumber(input.top),
    left: normalizeHudLayoutNumber(input.left),
    right: normalizeHudLayoutNumber(input.right),
    bottom: normalizeHudLayoutNumber(input.bottom),
    width: normalizeHudLayoutNumber(input.width),
    height: normalizeHudLayoutNumber(input.height),
    collapsed: Boolean(input.collapsed),
    visible: input.visible ?? true,
    viewportBucket: bucketViewportWidth(input.viewportWidth ?? 1440),
  });
}

export function buildHudZoneLayoutSignature(
  category: string,
  payload: Record<string, unknown>,
  viewportWidth?: number
): string {
  const normalized: Record<string, unknown> = { category };
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "number") {
      normalized[key] = normalizeHudLayoutNumber(value);
    } else {
      normalized[key] = value;
    }
  }
  normalized.viewportBucket = bucketViewportWidth(viewportWidth ?? 1440);
  return JSON.stringify(normalized, Object.keys(normalized).sort());
}

export function buildHudAnchorRegistrationSignature(input: {
  panelId: string;
  dockZone: string;
  anchorPosition: Record<string, unknown>;
  visible?: boolean;
  collapsedState?: boolean;
  viewportWidth?: number;
}): string {
  return buildHudPanelLayoutSignature({
    panelId: input.panelId,
    anchor: input.dockZone,
    top: typeof input.anchorPosition.top === "number" ? input.anchorPosition.top : null,
    left: typeof input.anchorPosition.left === "number" ? input.anchorPosition.left : null,
    right: typeof input.anchorPosition.right === "number" ? input.anchorPosition.right : null,
    bottom: typeof input.anchorPosition.bottom === "number" ? input.anchorPosition.bottom : null,
    collapsed: input.collapsedState,
    visible: input.visible,
    viewportWidth: input.viewportWidth,
  });
}
