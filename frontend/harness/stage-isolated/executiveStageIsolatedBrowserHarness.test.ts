/**
 * NPA-T STAGE-ISOLATED-BROWSER-HARNESS:1
 * Production exclusion plus a loopback render of the real Stage canvas.
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { chromium, type Page } from "playwright";

const harnessDir = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(harnessDir, "../..");
const bundleDir = join(frontendRoot, ".tmp/stage-isolated-harness");
const esbuildBin = join(frontendRoot, "node_modules/tsx/node_modules/esbuild/bin/esbuild");

const shellSource = readFileSync(join(frontendRoot, "app/executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
const pageSource = readFileSync(join(frontendRoot, "app/executive/page.tsx"), "utf8");
const stageMountSource = readFileSync(join(frontendRoot, "app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"), "utf8");
const harnessSource = readFileSync(join(harnessDir, "main.tsx"), "utf8");
const composeSource = readFileSync(join(harnessDir, "composeIsolatedStagePresentation.ts"), "utf8");

function read(path: string): string {
  return readFileSync(path, "utf8");
}

test("the isolated harness is outside the production route tree", () => {
  for (const source of [shellSource, pageSource, stageMountSource]) {
    assert.equal(source.includes("harness/stage-isolated"), false);
    assert.equal(source.includes("projectTestOwnedStageCatalog"), false);
    assert.equal(source.includes("company-alpha"), false);
  }
  assert.equal(pageSource.includes("dataset"), true);
  assert.equal(harnessSource.includes("projectTestOwnedStageCatalog"), true);
  assert.equal(harnessSource.includes("NexoraStageCanvas"), true);
  assert.equal(composeSource.includes("deriveNexoraMVPStageInteractionPresentation"), true);
  assert.equal(composeSource.includes("applyExecutiveStage2DTopologyRecompositionToStagePresentation"), true);
  assert.equal(composeSource.includes("applyExecutiveStageObjectLabelTerritoryToStagePresentation"), true);
  assert.equal(harnessSource.includes("localStorage"), false);
  assert.equal(harnessSource.includes("indexedDB"), false);
  assert.equal(harnessSource.includes("setActiveWorkspace"), false);
  assert.equal(composeSource.includes("localStorage"), false);
});

type Box = { id: string; x: number; y: number; w: number; h: number };
type Status = {
  scenario: string;
  anchor: string;
  focused: string;
  advisor: string;
  subjectIds: string[];
  world: { id: string; position: number[] }[];
  labels: Box[];
  storageKeys: number;
  databases: number;
};

async function readStatus(page: Page): Promise<Status> {
  return page.evaluate(() => {
    const status = document.querySelector("[data-testid='harness-status']");
    const labels = [...document.querySelectorAll("[data-testid^='nexora-stage-object-label-']")].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        id: element.getAttribute("data-canonical-id") ?? "",
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
      };
    }).filter((box) => box.w > 0 && box.h > 0);
    return {
      scenario: status?.getAttribute("data-scenario") ?? "",
      anchor: status?.getAttribute("data-anchor") ?? "",
      focused: status?.getAttribute("data-focused") ?? "",
      advisor: status?.getAttribute("data-advisor") ?? "",
      subjectIds: (status?.getAttribute("data-subject-ids") ?? "").split(",").filter(Boolean),
      world: JSON.parse(status?.getAttribute("data-world") ?? "[]") as { id: string; position: number[] }[],
      labels,
      storageKeys: window.localStorage.length,
      databases: 0,
    };
  });
}

function overlaps(a: Box, b: Box): boolean {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
}

function overlapCount(boxes: Box[]): number {
  let count = 0;
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      if (overlaps(boxes[i]!, boxes[j]!)) count += 1;
    }
  }
  return count;
}

test("the loopback harness renders Alpha and Beta through the Stage canvas", { timeout: 180000 }, async () => {
  mkdirSync(bundleDir, { recursive: true });
  const bundlePath = join(bundleDir, "bundle.js");
  execFileSync(esbuildBin, [
    join(harnessDir, "main.tsx"),
    "--bundle",
    "--format=esm",
    `--outfile=${bundlePath}`,
    "--jsx=automatic",
    `--alias:@=${frontendRoot}`,
    "--define:process.env.NODE_ENV=\"development\"",
  ], { cwd: frontendRoot, stdio: "pipe" });
  const bundle = read(bundlePath);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body,#root{margin:0;height:100%;background:#0a0e14;color:#e8eef6;font-family:system-ui}</style></head><body><div id="root"></div><script type="module" src="/bundle.js"></script></body></html>`;
  const server: Server = createServer((request, response) => {
    if (request.url === "/bundle.js") {
      response.writeHead(200, { "content-type": "text/javascript" });
      response.end(bundle);
      return;
    }
    response.writeHead(200, { "content-type": "text/html" });
    response.end(html);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  assert.equal(address.address, "127.0.0.1");
  const url = `http://127.0.0.1:${address.port}/`;
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("[data-testid='nexora-stage-object-label-company-alpha']", { timeout: 30000 });
    const alpha = await readStatus(page);
    assert.equal(alpha.scenario, "workspace-a");
    assert.equal(alpha.anchor, "company-alpha");
    assert.equal(alpha.focused, "");
    assert.equal(alpha.advisor, "");
    assert.deepEqual(alpha.subjectIds.sort(), [
      "company-alpha",
      "test-budget-alpha",
      "test-capacity-alpha",
      "test-inventory-alpha",
      "test-risk-alpha",
    ].sort());
    for (const absent of ["company-beta", "test-delivery-beta", "test-quality-beta", "test-foreign-beta", "test-denied-alpha", "test-undisclosed-alpha", "test-unrelated-alpha", "test-unresolved-alpha"]) {
      assert.equal(alpha.subjectIds.includes(absent), false);
      assert.equal(alpha.labels.some((label) => label.id === absent), false);
    }
    const alphaCenter = alpha.world.find((object) => object.id === "company-alpha");
    assert.deepEqual(alphaCenter?.position, [0, 0, 0]);
    for (const id of ["test-capacity-alpha", "test-budget-alpha", "test-inventory-alpha", "test-risk-alpha"]) {
      const world = alpha.world.find((object) => object.id === id);
      assert.ok(world);
      const radius = Math.hypot(world.position[0] ?? 0, world.position[1] ?? 0);
      assert.ok(radius > 1.4 && radius < 2.1, `${id} radius ${radius}`);
      assert.ok(alpha.labels.some((label) => label.id === id), id);
    }
    const alphaLabel = alpha.labels.find((label) => label.id === "company-alpha");
    assert.ok(alphaLabel);
    const centerX = alphaLabel.x + alphaLabel.w / 2;
    const centerY = alphaLabel.y + alphaLabel.h / 2;
    assert.equal(alpha.labels.some((label) => label.id !== "company-alpha" && label.x + label.w / 2 < centerX - 30), true);
    assert.equal(alpha.labels.some((label) => label.id !== "company-alpha" && label.x + label.w / 2 > centerX + 30), true);
    assert.equal(alpha.labels.some((label) => label.id !== "company-alpha" && label.y + label.h / 2 < centerY - 30), true);
    assert.equal(alpha.labels.some((label) => label.id !== "company-alpha" && label.y + label.h / 2 > centerY + 30), true);
    assert.equal(overlapCount(alpha.labels), 0);
    assert.equal(alpha.labels.some((label) => label.x < 0 || label.y < 0 || label.x + label.w > 1920 || label.y + label.h > 1080), false);
    assert.equal(alpha.storageKeys, 0);

    await page.getByTestId("harness-workspace-beta").click();
    await page.waitForSelector("[data-testid='nexora-stage-object-label-company-beta']", { timeout: 15000 });
    const beta = await readStatus(page);
    assert.equal(beta.anchor, "company-beta");
    assert.equal(beta.advisor, "");
    assert.deepEqual(beta.subjectIds.sort(), ["company-beta", "test-delivery-beta", "test-quality-beta"].sort());
    assert.equal(beta.subjectIds.some((id) => id.includes("alpha")), false);
    assert.deepEqual(beta.world.find((object) => object.id === "company-beta")?.position, [0, 0, 0]);
    assert.equal(beta.labels.some((label) => label.id === "test-delivery-beta"), true);
    assert.equal(beta.labels.some((label) => label.id === "test-quality-beta"), true);
    assert.equal(overlapCount(beta.labels), 0);

    await page.getByTestId("harness-workspace-alpha").click();
    await page.waitForSelector("[data-testid='nexora-stage-object-label-company-alpha']");
    const restored = await readStatus(page);
    assert.equal(restored.anchor, "company-alpha");
    assert.equal(restored.subjectIds.some((id) => id.includes("beta")), false);
    assert.equal(restored.advisor, "");

    await page.getByTestId("harness-no-center").click();
    await page.waitForFunction(() => document.querySelector("[data-testid='harness-status']")?.getAttribute("data-scenario") === "no-center");
    const none = await readStatus(page);
    assert.equal(none.anchor, "");
    assert.equal(none.subjectIds.includes("company-alpha"), false);
    assert.equal(none.subjectIds.includes("company-beta"), false);

    await page.getByTestId("harness-foreign-company").click();
    await page.waitForFunction(() => document.querySelector("[data-testid='harness-status']")?.getAttribute("data-scenario") === "foreign-company");
    const foreign = await readStatus(page);
    assert.equal(foreign.anchor, "");
    assert.deepEqual(foreign.subjectIds, []);
    assert.equal(foreign.labels.length, 0);

    await page.getByTestId("harness-workspace-alpha").click();
    await page.waitForSelector("[data-testid='nexora-stage-object-label-company-alpha']");
    await page.getByTestId("harness-focus-capacity").click();
    await page.waitForFunction(() => document.querySelector("[data-testid='harness-status']")?.getAttribute("data-focused") === "test-capacity-alpha");
    const focus = await readStatus(page);
    assert.equal(focus.anchor, "");
    assert.equal(focus.focused, "test-capacity-alpha");
    assert.equal(focus.advisor, "test-capacity-alpha");
    assert.deepEqual(focus.world.find((object) => object.id === "test-capacity-alpha")?.position, [0, 0, 0]);

    await page.getByTestId("harness-overview").click();
    await page.waitForFunction(() => document.querySelector("[data-testid='harness-status']")?.getAttribute("data-anchor") === "company-alpha");
    const back = await readStatus(page);
    assert.equal(back.focused, "");
    assert.equal(back.advisor, "");
    assert.deepEqual(back.world.find((object) => object.id === "company-alpha")?.position, [0, 0, 0]);

    await page.setViewportSize({ width: 800, height: 700 });
    await page.waitForTimeout(400);
    const narrow = await readStatus(page);
    assert.equal(narrow.anchor, "company-alpha");
    const narrowCenter = narrow.labels.find((label) => label.id === "company-alpha");
    assert.ok(narrowCenter);
    assert.equal(overlapCount(narrow.labels), 0);
    assert.equal(narrow.labels.some((label) => label.x < 0 || label.y < 0 || label.x + label.w > 800 || label.y + label.h > 700), false);
    assert.equal(narrow.storageKeys, 0);
  } finally {
    await browser.close();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    rmSync(bundleDir, { recursive: true, force: true });
  }
});
