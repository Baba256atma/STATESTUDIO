/**
 * NPA-T VISUAL-SYSTEM:1 — live geometry look. Existing :3000. No production edits.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";

async function inspect(page) {
  return page.evaluate(() => {
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const objects = [...document.querySelectorAll("[data-testid^='nexora-stage-object-control-']")];
    return {
      href: location.href,
      canvasCount: document.querySelectorAll("canvas").length,
      ovs1Primitive: stage?.getAttribute("data-ovs-1-primitive") ?? null,
      ovs1Family: stage?.getAttribute("data-ovs-1-family") ?? null,
      ovs3Family: stage?.getAttribute("data-ovs-3-family") ?? null,
      focused: objects
        .filter((el) => el.getAttribute("data-focused") === "true")
        .map((el) => ({
          id: el.getAttribute("data-canonical-id"),
          kind: el.getAttribute("data-object-type"),
          z: (el.getAttribute("data-stage-position") ?? "").split(",")[2] ?? null,
        })),
      objectIds: objects.map((el) => el.getAttribute("data-canonical-id")),
    };
  });
}

async function openObjectList(page) {
  const details = page.locator('[data-testid="nexora-stage-object-list"]');
  if (!(await details.evaluate((el) => el.open).catch(() => false))) {
    await details.locator("summary").click({ timeout: 2_000 }).catch(() => undefined);
  }
}

async function clickControl(page, id) {
  await openObjectList(page);
  await page.locator(`[data-testid="nexora-stage-object-control-${id}"]`).first().click({
    timeout: 4_000,
  });
  await page.waitForTimeout(800);
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

    await clickControl(page, "obj-capacity");
    report.capacity = await inspect(page);
    await page.screenshot({ path: join(here, "vs1-capacity.png"), fullPage: false });

    for (const [key, id] of [
      ["gap", "ctx-problem-capacity"],
      ["plan", "ctx-scenario-capacity"],
      ["expand", "ctx-decision-capacity"],
      ["execution", "ctx-execution-capacity"],
    ]) {
      try {
        await clickControl(page, id);
        report[key] = await inspect(page);
        await page.screenshot({ path: join(here, `vs1-${key}.png`), fullPage: false });
      } catch (error) {
        report[key] = { error: String(error) };
      }
    }

    await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 2_000 }).catch(() => undefined);
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: /Investigate Risk/i }).first().click({ timeout: 4_000 });
    await page.waitForTimeout(900);
    report.risk = await inspect(page);
    await page.screenshot({ path: join(here, "vs1-risk.png"), fullPage: false });

    await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close().catch(() => undefined);
  }
}

await main();
