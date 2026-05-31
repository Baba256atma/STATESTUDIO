import type React from "react";

export type HudCollisionPriority = "high" | "medium" | "low";

export type HudCollisionPanel = {
  panelId: string;
  priority: HudCollisionPriority;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type HudCollisionResolution = {
  panelId: string;
  action: "none" | "reposition" | "compress" | "collapse";
  stylePatch?: React.CSSProperties;
};

const logKeys = new Set<string>();

function log(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

function intersects(a: HudCollisionPanel["rect"], b: HudCollisionPanel["rect"]): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function priorityWeight(priority: HudCollisionPriority): number {
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}

export function detectHudCollisions(panels: readonly HudCollisionPanel[]): readonly [HudCollisionPanel, HudCollisionPanel][] {
  const collisions: [HudCollisionPanel, HudCollisionPanel][] = [];
  for (let i = 0; i < panels.length; i += 1) {
    for (let j = i + 1; j < panels.length; j += 1) {
      const a = panels[i];
      const b = panels[j];
      if (!a || !b) continue;
      if (intersects(a.rect, b.rect)) collisions.push([a, b]);
    }
  }
  return collisions;
}

export function resolveHudCollisions(panels: readonly HudCollisionPanel[]): HudCollisionResolution[] {
  const collisions = detectHudCollisions(panels);
  if (collisions.length === 0) {
    return panels.map((panel) => ({ panelId: panel.panelId, action: "none" }));
  }

  log("[Nexora][HudCollision]", {
    collisionCount: collisions.length,
    panels: collisions.map(([a, b]) => `${a.panelId}:${b.panelId}`),
  });

  const resolutions = new Map<string, HudCollisionResolution>();
  collisions.forEach(([a, b]) => {
    const loser = priorityWeight(a.priority) <= priorityWeight(b.priority) ? a : b;
    const action: HudCollisionResolution["action"] =
      loser.priority === "low" ? "collapse" : loser.priority === "medium" ? "compress" : "reposition";
    resolutions.set(loser.panelId, {
      panelId: loser.panelId,
      action,
      stylePatch:
        action === "reposition"
          ? { transform: "translateY(48px)" }
          : action === "compress"
            ? { maxWidth: "min(72vw, 640px)" }
            : { opacity: 0.72 },
    });
  });

  return panels.map((panel) => resolutions.get(panel.panelId) ?? { panelId: panel.panelId, action: "none" });
}

export function resetHudCollisionRuntimeForTests(): void {
  logKeys.clear();
}
