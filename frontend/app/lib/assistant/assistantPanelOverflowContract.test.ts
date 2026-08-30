import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  ASSISTANT_PANEL_OVERFLOW_CONTRACT_REQUIRED_VALUE_EXPORTS,
  ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL,
  detectAssistantPanelOverflow,
  resolveAssistantPanelOverflowTrace,
  type AssistantPanelOverflowSizeTier,
} from "./assistantPanelOverflowContract.ts";
import { ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER } from "./assistantSupportAccordionContract.ts";
import { ASSISTANT_PANEL_DOCK_DEFINITIONS } from "./assistantPanelDockContract.ts";
import {
  ASSISTANT_PANEL_OVERFLOW_MAX_HEIGHT_PX,
  resolveAssistantPanelMaxHeightPx,
  resolveAssistantPanelOverflowSizeTier,
} from "./assistantPanelOverflowTokens.ts";

const assistantDir = dirname(fileURLToPath(import.meta.url));
const VALID_TIERS = new Set<AssistantPanelOverflowSizeTier>(["compact", "small", "medium"]);

function localImportSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  const re = /from\s+["'](\.[^"']+)["']/g;
  for (const match of source.matchAll(re)) {
    specifiers.push(match[1]!.replace(/\.(ts|tsx)$/, ""));
  }
  return specifiers;
}

function walkLocalImports(entryFile: string, visit: (file: string, source: string) => void): string[] {
  const seen = new Set<string>();
  const queue = [entryFile];
  while (queue.length > 0) {
    const file = queue.shift()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const source = readFileSync(join(assistantDir, file), "utf8");
    visit(file, source);
    for (const specifier of localImportSpecifiers(source)) {
      const resolved = specifier.startsWith("./") ? `${specifier.slice(2)}.ts` : `${specifier}.ts`;
      if (!resolved.startsWith("assistant") && !resolved.includes("/")) {
        continue;
      }
      const basename = resolved.split("/").pop()!;
      if (basename.endsWith(".ts") && !basename.includes("..")) {
        queue.push(basename);
      }
    }
  }
  return [...seen];
}

describe("assistantPanelOverflowContract exports and mapping", () => {
  it("runtime value export ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL exists", () => {
    assert.equal(
      ASSISTANT_PANEL_OVERFLOW_CONTRACT_REQUIRED_VALUE_EXPORTS.includes(
        "ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL"
      ),
      true
    );
    assert.equal(typeof ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL, "object");
    assert.equal(ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL === null, false);
  });

  it("type AssistantPanelOverflowSizeTier is usable at the type layer", () => {
    const tier: AssistantPanelOverflowSizeTier = ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL.insight;
    assert.equal(VALID_TIERS.has(tier), true);
  });

  it("maps every supported accordion panel to exactly one valid size tier", () => {
    const mapped = Object.keys(ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL);
    assert.deepEqual([...mapped].sort(), [...ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER].sort());
    assert.deepEqual(
      [...mapped].sort(),
      [...Object.keys(ASSISTANT_PANEL_DOCK_DEFINITIONS)].sort()
    );
    for (const panelId of ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER) {
      const tier = ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL[panelId];
      assert.equal(VALID_TIERS.has(tier), true, `${panelId} must have a valid tier`);
      assert.equal(resolveAssistantPanelOverflowSizeTier(panelId), tier);
    }
  });

  it("does not include unsupported panel ids", () => {
    assert.equal("primary" in ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL, false);
    assert.equal("chat" in ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL, false);
  });

  it("derives the intended max-height for every mapped tier", () => {
    assert.equal(ASSISTANT_PANEL_OVERFLOW_MAX_HEIGHT_PX.compact, 128);
    assert.equal(ASSISTANT_PANEL_OVERFLOW_MAX_HEIGHT_PX.small, 144);
    assert.equal(ASSISTANT_PANEL_OVERFLOW_MAX_HEIGHT_PX.medium, 192);
    for (const panelId of ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER) {
      const tier = ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL[panelId];
      assert.equal(resolveAssistantPanelMaxHeightPx(panelId), ASSISTANT_PANEL_OVERFLOW_MAX_HEIGHT_PX[tier]);
    }
  });

  it("keeps the overflow-size mapping immutable", () => {
    assert.equal(Object.isFrozen(ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL), true);
    assert.throws(() => {
      (ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL as { insight: AssistantPanelOverflowSizeTier }).insight =
        "compact";
    });
  });

  it("keeps detect and trace as runtime values", () => {
    assert.equal(typeof detectAssistantPanelOverflow, "function");
    assert.equal(typeof resolveAssistantPanelOverflowTrace, "function");
    assert.match(
      resolveAssistantPanelOverflowTrace({ panel: "actions", overflow: true }),
      /panel=actions\noverflow=true/
    );
  });
});

describe("assistantPanelOverflowContract module graph", () => {
  it("does not import dock, tokens, components, or client modules", () => {
    const source = readFileSync(join(assistantDir, "assistantPanelOverflowContract.ts"), "utf8");
    assert.equal(source.includes("assistantPanelDockContract"), false);
    assert.equal(source.includes("assistantPanelOverflowTokens"), false);
    assert.equal(source.includes("use client"), false);
    assert.equal(source.includes(".tsx"), false);
    assert.match(source, /assistantSupportAccordionContract/);
    const imports = localImportSpecifiers(source);
    assert.deepEqual(imports, ["./assistantSupportAccordionContract"]);
  });

  it("does not reach a component through local assistant imports", () => {
    walkLocalImports("assistantPanelOverflowContract.ts", (file, source) => {
      assert.equal(file.endsWith(".tsx"), false, `${file} must not be a component`);
      assert.doesNotMatch(source, /^["']use client["']/m, `${file} must not be a client boundary`);
      assert.equal(source.includes("../components/"), false, `${file} must not import components`);
    });
  });

  it("has no overflow-contract → tokens → overflow-contract cycle", () => {
    const tokenSource = readFileSync(join(assistantDir, "assistantPanelOverflowTokens.ts"), "utf8");
    assert.match(tokenSource, /assistantPanelOverflowContract/);
    const contractSource = readFileSync(join(assistantDir, "assistantPanelOverflowContract.ts"), "utf8");
    assert.equal(contractSource.includes("assistantPanelOverflowTokens"), false);
    assert.equal(contractSource.includes("assistantPanelOverflowRuntime"), false);
  });

  it("resolves identical runtime exports via static and dynamic import", async () => {
    const url = pathToFileURL(join(assistantDir, "assistantPanelOverflowContract.ts")).href;
    const dynamicModule = await import(url);
    assert.equal(
      dynamicModule.ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL,
      ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL
    );
    assert.deepEqual(
      Object.keys(dynamicModule.ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL),
      Object.keys(ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL)
    );
  });
});
