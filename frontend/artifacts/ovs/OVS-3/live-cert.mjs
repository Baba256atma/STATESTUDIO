/**
 * Bounded OVS:3-CERT gate check: confirm live spatial overlay idle.
 * Hard ~20s. Existing :3000 only.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    timeout: 8_000,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8_000);
  const report = { url: URL };
  try {
    const res = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    report.http = res?.status() ?? null;
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(900);
    report.live = await page.evaluate(() => {
      const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
      return {
        href: location.href,
        canvasCount: document.querySelectorAll("canvas").length,
        ovs1Enabled: stage?.getAttribute("data-ovs-1-enabled") ?? null,
        ovs3Enabled: stage?.getAttribute("data-ovs-3-enabled") ?? null,
        ovs3Family: stage?.getAttribute("data-ovs-3-family") ?? null,
        ovs3Scene: stage?.getAttribute("data-ovs-3-scene") ?? null,
        ovs3Data: stage?.getAttribute("data-ovs-3-data") ?? null,
        ovs3Structures: stage?.getAttribute("data-ovs-3-structures") ?? null,
        ovs3Roadmap: stage?.getAttribute("data-ovs-3-roadmap") ?? null,
        composition: stage?.getAttribute("data-stage-prod-composition") ?? null,
        sceneFamily: stage?.getAttribute("data-stage-prod-scene-family") ?? null,
        focusedSubject: document
          .querySelector("[data-focused-subject]")
          ?.getAttribute("data-focused-subject"),
        objectCount: document.querySelectorAll("[data-canonical-id][data-status]").length,
        kinds: [
          ...new Set(
            [...document.querySelectorAll("[data-canonical-id][data-object-type]")].map((el) =>
              el.getAttribute("data-object-type"),
            ),
          ),
        ],
      };
    });
    await page.screenshot({ path: join(here, "live-idle-overview.png"), fullPage: false });
    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    try {
      await page.screenshot({ path: join(here, "live-error.png"), fullPage: false });
    } catch {
      /* ignore */
    }
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ok: report.ok, error: report.error ?? null, live: report.live }, null, 2));
  if (!report.ok) process.exit(2);
}

await main();
