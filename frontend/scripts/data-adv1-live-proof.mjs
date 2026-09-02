/**
 * DATA-ADV:1 live /executive conversation proofs. Does not start BCA.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  askExecutiveChat,
  EXECUTIVE_EXISTING_URL,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), "artifacts/data-adv/DATA-ADV-1/proofs");
await mkdir(out, { recursive: true });

const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase("nexora-csv-real-data");
    req.onsuccess = () => resolve(null);
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve(null);
  });
});
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
await page.waitForTimeout(800);

async function clickTestId(id) {
  await page.evaluate((testId) => {
    const node = document.querySelector(`[data-testid="${testId}"]`);
    if (!(node instanceof HTMLElement)) throw new Error(`missing ${testId}`);
    node.click();
  }, id);
}

async function waitHydrated() {
  await page.locator('[data-csv-hydrated="true"]').waitFor({ state: "attached", timeout: 20000 });
}

async function openData() {
  if (!(await page.getByTestId("nexora-rdi2-data-explorer").count())) {
    await clickTestId("nexora-stage-data-control");
  }
  await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "visible", timeout: 15000 });
}

async function lastNexora() {
  return page.evaluate(() => [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')].at(-1)?.textContent ?? "");
}

async function focused() {
  return page.evaluate(() => document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject") ?? "none");
}

await waitHydrated();
await openData();
await clickTestId("nexora-rdi2-add-data");
await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
await page.locator('[data-testid="nexora-rdi4-source-choice"] button').first().evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-file-input").setInputFiles("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
await page.getByTestId("nexora-csv-needs-clarification").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-csv-ask-OTD");
await page.getByTestId("nexora-conversational-message-nexora").last().waitFor({ state: "visible" });
const otdQuestion = await lastNexora();
const otdTurn = await askExecutiveChat(page, "yes");
const ordQty = await askExecutiveChat(page, "what is ORD_QTY ?");
const from = await askExecutiveChat(page, "which file is it from?");
const elseIn = await askExecutiveChat(page, "what else is in that file?");
const files = await askExecutiveChat(page, "What files do we have?");
const focusAfterField = await focused();
await page.screenshot({ path: join(out, "proof-ord-qty.png"), fullPage: false });

await clickTestId("nexora-csv-review-close");
await clickTestId("nexora-rdi2-add-data");
await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
await page.locator('[data-testid="nexora-rdi4-source-choice"] button').first().evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-file-input").setInputFiles("test-fixtures/data-ux5-fix2/capacity.csv");
await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 15000 });
await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-use-this-data").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-csv-use-this-data");

const capacityAsk = await askExecutiveChat(page, "What data do we have for Capacity?");
const investigate = await askExecutiveChat(page, "What should I investigate for Delivery?");
const focusAfterGuidance = await focused();
await page.screenshot({ path: join(out, "proof-investigate.png"), fullPage: false });

await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
await waitHydrated();
const dataOpen = await page.getByTestId("nexora-rdi2-data-explorer").count();
const restoredOtd = await askExecutiveChat(page, "What is OTD?");
const restoredFiles = await askExecutiveChat(page, "What files do we have?");
await page.screenshot({ path: join(out, "proof-restore.png"), fullPage: false });

const report = {
  identity: "DATA-ADV:1/LiveManagerProof",
  url,
  otdQuestion,
  otdTurn: otdTurn.last,
  ordQty: ordQty.last,
  from: from.last,
  elseIn: elseIn.last,
  files: files.last,
  capacityAsk: capacityAsk.last,
  investigate: investigate.last,
  restoredOtd: restoredOtd.last,
  restoredFiles: restoredFiles.last,
  dataOpenAfterRefresh: dataOpen,
  focusAfterField,
  focusAfterGuidance,
  pageErrors: errors,
  ok: errors.length === 0
    && /Does OTD represent/i.test(otdQuestion)
    && /Confirmed for this source: OTD/i.test(otdTurn.last)
    && /ORD_QTY is a field/i.test(ordQty.last)
    && !/couldn't find a clear match/i.test(ordQty.last)
    && /data-ux3-ambiguous\.csv|this source/i.test(`${from.last} ${elseIn.last} ${ordQty.last}`)
    && /data-ux3-ambiguous\.csv/i.test(files.last)
    && /capacity\.csv/i.test(capacityAsk.last)
    && /investigation order|not a claim that one source caused|accepted data/i.test(investigate.last)
    && !/\bcaused the delivery\b/i.test(investigate.last)
    && dataOpen === 0
    && /OTD/i.test(restoredOtd.last)
    && !/couldn't find a clear match/i.test(restoredOtd.last)
    && focusAfterField === "none"
    && focusAfterGuidance === "none",
};

await writeFile(join(out, "live-report.json"), JSON.stringify(report, null, 2));
await browser.close();
if (!report.ok) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));
