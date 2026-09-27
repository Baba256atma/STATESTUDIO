/**
 * NPA-T STAGE-SPATIAL:1-ACCEPT — bounded live visual/runtime check.
 * Existing :3000 only. No production edits.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";

async function inspect(page) {
  return page.evaluate(() => {
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const canvases = document.querySelectorAll("canvas");
    const orbit = document.querySelector("[class*='OrbitControls'], .orbit-controls");
    const objects = [...document.querySelectorAll("[data-testid^='nexora-stage-object-control-']")];
    const advisor = document.querySelector('[aria-label="Nexora Advisor"], [data-testid="nexora-advisor"]')
      ?? document.body;
    const advisorText = (document.querySelector('[name="Nexora Advisor"]') ?? advisor)?.textContent ?? "";
    const subjectBlock = [...document.querySelectorAll("*")].find((el) => el.textContent === "Subject");
    return {
      canvasCount: canvases.length,
      hasOrbit: orbit != null,
      href: location.href,
      ovs3Enabled: stage?.getAttribute("data-ovs-3-enabled") ?? null,
      ovs3Family: stage?.getAttribute("data-ovs-3-family") ?? null,
      ovs3Scene: stage?.getAttribute("data-ovs-3-scene") ?? null,
      ovs3Structures: stage?.getAttribute("data-ovs-3-structures") ?? null,
      ovs3Data: stage?.getAttribute("data-ovs-3-data") ?? null,
      ovs1Family: stage?.getAttribute("data-ovs-1-family") ?? null,
      ovs1Primitive: stage?.getAttribute("data-ovs-1-primitive") ?? null,
      sceneIntent: stage?.getAttribute("data-stage-prod-scene-intent") ?? null,
      focused: objects
        .filter((el) => el.getAttribute("data-focused") === "true")
        .map((el) => ({
          id: el.getAttribute("data-canonical-id"),
          kind: el.getAttribute("data-object-type"),
          status: el.getAttribute("data-status"),
          selected: el.getAttribute("data-selected"),
          z: (el.getAttribute("data-stage-position") ?? "").split(",")[2] ?? null,
          scale: el.getAttribute("data-scale"),
          opacity: el.getAttribute("data-opacity"),
          executiveVisualState: el.getAttribute("data-executive-visual-state"),
          role: el.getAttribute("data-role"),
        })),
      objectZs: objects.map((el) => ({
        id: el.getAttribute("data-canonical-id"),
        z: (el.getAttribute("data-stage-position") ?? "").split(",")[2] ?? null,
      })),
      objectIds: objects.map((el) => el.getAttribute("data-canonical-id")),
      advisorHasRisk: /Subject\s*Risk/i.test(document.body.innerText) || /Advisor[^\n]*Risk/i.test(document.body.innerText),
      advisorHasCapacity: /Subject\s*Capacity/i.test(document.body.innerText),
    };
  });
}

async function openObjectList(page) {
  const details = page.locator('[data-testid="nexora-stage-object-list"]');
  if (!(await details.evaluate((el) => el.open).catch(() => false))) {
    await details.locator("summary").click({ timeout: 2_000 }).catch(() => undefined);
  }
}

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 8_000 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const report = { server: URL, pidHint: "reuse-existing-3000" };
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(800);
    await openObjectList(page);
    await page.locator('[data-testid="nexora-stage-object-control-obj-capacity"]').first().click({
      timeout: 4_000,
    });
    await page.waitForTimeout(900);
    report.capacity = await inspect(page);
    await page.screenshot({ path: join(here, "accept-capacity-control.png"), fullPage: false });

    await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 2_000 });
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /Investigate Risk/i }).first().click({ timeout: 4_000 });
    await page.waitForTimeout(1000);
    report.risk = await inspect(page);
    await page.screenshot({ path: join(here, "accept-risk-spatial.png"), fullPage: false });

    await page.locator('[data-testid="nexora-stage-object-control-obj-risk"]').first().click({
      timeout: 3_000,
    }).catch(() => undefined);
    await page.waitForTimeout(400);
    report.riskAfterObjectClick = await inspect(page);
    await page.screenshot({ path: join(here, "accept-risk-selection.png"), fullPage: false });

    await writeFile(join(here, "accept-report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close().catch(() => undefined);
  }
}

await main();
