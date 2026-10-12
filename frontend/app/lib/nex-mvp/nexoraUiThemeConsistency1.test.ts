/**
 * NPA-T UI-THEME-CONSISTENCY:1 — V1/V2 consumers bind existing --nx-* tokens.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");

function read(rel: string): string {
  return readFileSync(join(FRONTEND, rel), "utf8");
}

describe("NPA-T UI-THEME-CONSISTENCY:1 consumers", () => {
  it("V1 Actions/Report use overlay-card tokens, not night-first rgba", () => {
    const operation = read(
      "app/executive/nex-mvp/presentation/NexoraSubjectOperation.tsx",
    );
    const report = read(
      "app/executive/nex-mvp/presentation/NexoraSubjectReport.tsx",
    );
    for (const source of [operation, report]) {
      assert.match(source, /var\(--nx-overlay-card-bg\)/);
      assert.doesNotMatch(source, /rgba\(8,\s*14,\s*24/);
    }
    assert.match(operation, /cockpit\.accentSoft/);
    assert.match(operation, /var\(--nx-bg-control\)/);
  });

  it("V1 Timeline fact cards use overlay-card token and keep RISK_COLOR highlight", () => {
    const dock = read("app/executive/exs1/shell/ExecutiveTimelineDock.tsx");
    assert.match(dock, /var\(--nx-overlay-card-bg\)/);
    assert.match(dock, /RISK_COLOR\[pack\.risk\]/);
    assert.doesNotMatch(
      dock,
      /linear-gradient\(165deg,\s*rgba\(26,\s*31,\s*42/,
    );
    assert.doesNotMatch(dock, /projectHistoricalTruth|cmsi|historicalTruth/);
    assert.match(
      dock,
      /transition: `border-color \$\{cockpit\.motion\.base\}/,
    );
  });

  it("V2 chrome uses existing HUD/popover/control tokens", () => {
    const view = read(
      "app/executive/nex-mvp/presentation/NexoraPresentationStateSelector.tsx",
    );
    const scenes = read(
      "app/executive/nex-mvp/NexoraSavedSceneCollectionAccess.tsx",
    );
    const breadcrumb = read(
      "app/executive/nex-mvp/stage/NexoraStageInteractionBreadcrumb.tsx",
    );
    assert.match(view, /var\(--nx-bg-hud\)/);
    assert.match(view, /var\(--nx-bg-control\)/);
    assert.match(scenes, /var\(--nx-popover-bg\)/);
    assert.doesNotMatch(scenes, /#0a0e14/);
    assert.match(breadcrumb, /var\(--nx-bg-hud\)/);
  });

  it("theme authority remains the existing document store", () => {
    const theme = read("app/lib/ui/nexoraUiTheme.tsx");
    assert.match(theme, /export type ThemeMode = "night" \| "day" \| "auto"/);
    assert.match(theme, /applyResolvedUiThemeToDocument/);
    assert.doesNotMatch(theme, /surfaceTheme|advisorTheme|stageTheme/);
  });
});
