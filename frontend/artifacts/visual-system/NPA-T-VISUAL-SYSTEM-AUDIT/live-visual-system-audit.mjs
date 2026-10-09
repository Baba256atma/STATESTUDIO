/**
 * Audit-only live /executive capture. Does not change production code.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "../../../scripts/nex-mvp-final3-executive-chat-harness.mjs";

const out = dirname(fileURLToPath(import.meta.url));
const url = `${(process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0]}?reset=1`;
await mkdir(out, { recursive: true });

async function themeSnapshot(page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const computed = shell ? getComputedStyle(shell) : null;
    const manager = document.querySelector('[data-testid="nexora-conversational-message-manager"] span');
    const nexora = document.querySelector('[data-testid="nexora-conversational-message-nexora"] span');
    const chart = document.querySelector('[data-testid="nexora-evidence-visual-view"]');
    return {
      htmlDataTheme: html.getAttribute("data-theme"),
      htmlClass: html.className,
      shellThemeMode: shell?.getAttribute("data-theme-mode") ?? null,
      shellBackground: computed?.backgroundColor ?? null,
      localStorageTheme: localStorage.getItem("nx-theme-mode"),
      localStorageUiTheme: localStorage.getItem("nexora.ui_theme"),
      nxBgApp: getComputedStyle(html).getPropertyValue("--nx-bg-app").trim(),
      nxText: getComputedStyle(html).getPropertyValue("--nx-text").trim(),
      managerLabelColor: manager ? getComputedStyle(manager).color : null,
      nexoraLabelColor: nexora ? getComputedStyle(nexora).color : null,
      managerText: manager?.textContent?.trim() ?? null,
      nexoraText: nexora?.textContent?.trim() ?? null,
      chartPresent: Boolean(chart),
      dayPressed: document
        .querySelector('[data-testid="executive-theme-day"]')
        ?.getAttribute("aria-pressed"),
      nightPressed: document
        .querySelector('[data-testid="executive-theme-night"]')
        ?.getAttribute("aria-pressed"),
    };
  });
}

const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
await page.waitForTimeout(1200);

const night = await themeSnapshot(page);
await page.screenshot({ path: join(out, "overview-night.png"), fullPage: false });

const display = page.locator("summary").filter({ hasText: "DISPLAY" }).first();
const dayAvailable = (await page.locator('[data-testid="executive-theme-day"]').count()) > 0;
let afterDayClick = null;
if (dayAvailable) {
  if (await display.count()) {
    await display.click({ timeout: 4000 }).catch(() => null);
    await page.waitForTimeout(250);
  }
  await page.locator('[data-testid="executive-theme-day"]').click({ timeout: 4000, force: true });
  await page.waitForTimeout(600);
  afterDayClick = await themeSnapshot(page);
  await page.screenshot({ path: join(out, "after-day-click.png"), fullPage: false });
  await page
    .locator('[data-testid="executive-theme-night"]')
    .click({ timeout: 4000, force: true })
    .catch(() => null);
  await page.waitForTimeout(400);
}

await askExecutiveChat(page, "Focus on Delivery");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject") ===
    "obj-delivery",
  null,
  { timeout: 25000 },
).catch(() => null);
await page.waitForTimeout(800);
await page.screenshot({ path: join(out, "delivery-focus.png"), fullPage: false });
const chatAfterDelivery = await themeSnapshot(page);

await askExecutiveChat(page, "Focus on Risk");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject") ===
    "obj-risk",
  null,
  { timeout: 25000 },
).catch(() => null);
await page.waitForTimeout(800);
await page.screenshot({ path: join(out, "risk-focus.png"), fullPage: false });

await askExecutiveChat(page, "Focus on Customer");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject") ===
    "obj-customer",
  null,
  { timeout: 25000 },
).catch(() => null);
await page.waitForTimeout(800);
await page.screenshot({ path: join(out, "customer-focus.png"), fullPage: false });

const payload = {
  identity: "NPA-T VISUAL-SYSTEM:AUDIT/LiveRuntime",
  url,
  errors,
  dayAvailable,
  night,
  afterDayClick,
  chatAfterDelivery,
  focusedAfterFlow: await page
    .locator('[data-testid="nexora-executive-shell"]')
    .getAttribute("data-focused-subject"),
};

await writeFile(join(out, "live-browser.json"), `${JSON.stringify(payload, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(payload, null, 2));
