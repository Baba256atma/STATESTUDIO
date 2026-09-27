/**
 * VISUAL-SYSTEM:2 — live material look. Existing :3000.
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
      ovs1Primitive: stage?.getAttribute("data-ovs-1-primitive") ?? null,
      ovs1Family: stage?.getAttribute("data-ovs-1-family") ?? null,
      ovs3Family: stage?.getAttribute("data-ovs-3-family") ?? null,
      focused: objects
        .filter((el) => el.getAttribute("data-focused") === "true")
        .map((el) => ({
          id: el.getAttribute("data-canonical-id"),
          kind: el.getAttribute("data-object-type"),
          z: (el.getAttribute("data-stage-position") ?? "").split(",")[2] ?? null,
          status: el.getAttribute("data-status"),
        })),
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
  const report = { server: URL };
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(700);
    await openObjectList(page);
    await page.locator('[data-testid="nexora-stage-object-control-obj-capacity"]').first().click({
      timeout: 4_000,
    });
    await page.waitForTimeout(800);
    report.capacity = await inspect(page);
    await page.screenshot({ path: join(here, "vs2-capacity.png"), fullPage: false });

    for (const [file, name] of [
      ["vs2-gap.png", "problemCapacity Gap"],
      ["vs2-plan.png", "scenarioCapacity Expansion Plan"],
      ["vs2-expand.png", "decisionExpand Capacity"],
      ["vs2-execution.png", "executionCapacity Expansion"],
    ]) {
      await page.getByRole("button", { name }).first().click({ timeout: 4_000 });
      await page.waitForTimeout(800);
      report[file.replace("vs2-", "").replace(".png", "")] = await inspect(page);
      await page.screenshot({ path: join(here, file), fullPage: false });
    }

    await page.getByRole("option", { name: "Decision" }).first().click({ timeout: 3_000 }).catch(() => undefined);
    await page.waitForTimeout(700);
    report.workspaceDecision = await inspect(page);
    await page.screenshot({ path: join(here, "vs2-workspace-decision.png"), fullPage: false });

    await page.getByRole("option", { name: "Execution" }).first().click({ timeout: 3_000 }).catch(() => undefined);
    await page.waitForTimeout(700);
    report.workspaceExecution = await inspect(page);
    await page.screenshot({ path: join(here, "vs2-workspace-execution.png"), fullPage: false });

    await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 2_000 }).catch(() => undefined);
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: /Investigate Risk/i }).first().click({ timeout: 4_000 });
    await page.waitForTimeout(900);
    report.risk = await inspect(page);
    await page.screenshot({ path: join(here, "vs2-risk.png"), fullPage: false });

    await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close().catch(() => undefined);
  }
}

await main();
