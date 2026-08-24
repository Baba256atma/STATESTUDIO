/**
 * NEX-MVP-FINAL:2 — live show inventory → explain it.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-mvp-final-2-explain-quality");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.setDefaultTimeout(45000);
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
const response = await page.goto("http://localhost:3000/executive", {
  waitUntil: "domcontentloaded",
});
await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
await page.waitForTimeout(600);

async function ask(utterance) {
  const field = page.locator('[data-testid="nexora-conversational-input-field"]');
  await field.fill(utterance);
  await field.press("Enter");
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent?.length > 8,
  );
  await page.waitForTimeout(250);
  return page.evaluate(() => ({
    focused: document
      .querySelector('[data-testid="nexora-executive-shell"]')
      ?.getAttribute("data-focused-subject"),
    last:
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent ?? "",
  }));
}

const shown = await ask("show inventory");
const explained = await ask("explain it.");
await page.screenshot({ path: join(OUT, "01-explain-inventory.png") });
await browser.close();

const report = {
  phase: "NEX-MVP-FINAL:2",
  http: response?.status() ?? 0,
  shown,
  explained,
  priorStateFallback: /prior-state comparison/i.test(explained.last),
  explainsInventory: /Inventory/i.test(explained.last) && explained.last.length > 80,
  focusedInventory: shown.focused === "obj-inventory" || /Inventory/i.test(shown.last),
  errors,
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(
  report.http === 200 &&
    report.explainsInventory &&
    report.priorStateFallback === false &&
    report.errors.length === 0
    ? 0
    : 1,
);
