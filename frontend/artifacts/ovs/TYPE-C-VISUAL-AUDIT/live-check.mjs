/**
 * TYPE-C-VISUAL:AUDIT — bounded screenshots only. No product change.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const TYPE_C = "http://127.0.0.1:3000/type-c";
const EXEC = "http://127.0.0.1:3000/executive?ovs1=1";

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    timeout: 8000,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(20000);

  await page.goto(TYPE_C, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: join(here, "type-c-visual-audit-a-normal.png") });
  await page.screenshot({ path: join(here, "type-c-visual-audit-d-space.png") });

  const canvas = page.locator("canvas").first();
  if (await canvas.count()) {
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width * 0.52, box.y + box.height * 0.48);
      await page.waitForTimeout(800);
      await page.screenshot({ path: join(here, "type-c-visual-audit-c-selected.png") });
    }
  }

  const risk = page.getByRole("button", { name: /Risk and weak-point analysis/i });
  if (await risk.count()) {
    await risk.click().catch(() => undefined);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(here, "type-c-visual-audit-b-attention.png") });
  }

  await page.goto(EXEC, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2500);
  const nmi = page.locator('[data-testid="executive-nav-nmi"]');
  if (await nmi.count()) {
    if ((await nmi.getAttribute("aria-pressed")) !== "true") {
      await nmi.click({ timeout: 4000 }).catch(() => undefined);
      await page.waitForTimeout(400);
    }
  }
  const scenario = page.locator('[data-testid="nexora-executive-queue-row-scenario"]');
  if (await scenario.count()) {
    await scenario.click({ timeout: 4000, force: true }).catch(() => undefined);
    await page.waitForTimeout(900);
  }
  await page.screenshot({ path: join(here, "executive-visual-audit-e-normal.png") });
  await page.screenshot({ path: join(here, "executive-visual-audit-h-space.png") });

  const canvas2 = page.locator('[data-testid="nexora-stage-canvas"]');
  if (await canvas2.count()) {
    const box = await canvas2.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.42);
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(here, "executive-visual-audit-g-focus.png") });
    }
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
