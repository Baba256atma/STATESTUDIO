/**
 * DATA-UX:5 live /executive proofs. Does not start another DATA-UX phase.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), "artifacts/data-ux/DATA-UX-5/proofs");
await mkdir(out, { recursive: true });

const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);

async function clickTestId(id) {
  await page.evaluate((testId) => {
    const node = document.querySelector(`[data-testid="${testId}"]`);
    if (!(node instanceof HTMLElement)) throw new Error(`missing ${testId}`);
    node.click();
  }, id);
}

async function importCsv(filePath) {
  const railOpen = await page.getByTestId("nexora-rdi2-data-explorer").count();
  if (!railOpen) await clickTestId("nexora-stage-data-control");
  await page.getByTestId("nexora-rdi2-add-data").waitFor({ state: "visible", timeout: 15000 });
  await clickTestId("nexora-rdi2-add-data");
  await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
  await page.locator('[data-testid="nexora-rdi4-source-choice"] button').first().evaluate((node) => {
    if (node instanceof HTMLElement) node.click();
  });
  await page.getByTestId("nexora-csv-file-input").setInputFiles(filePath);
  await page.getByRole("button", { name: "Validate Import" }).waitFor({ state: "visible", timeout: 15000 });
  await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
  await page.getByRole("button", { name: "Import", exact: true }).waitFor({ state: "visible", timeout: 15000 });
  await page.getByRole("button", { name: "Import", exact: true }).evaluate((node) => node instanceof HTMLElement && node.click());
  await page.getByRole("button", { name: "View Changes" }).waitFor({ state: "visible", timeout: 15000 });
  await page.getByRole("button", { name: "View Changes" }).evaluate((node) => node instanceof HTMLElement && node.click());
  await page.getByTestId("nexora-data-object-show-on-stage").waitFor({ state: "visible" });
}

async function snapshot(name) {
  await page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((node) => node.remove()));
  const path = join(out, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

async function openRemovalReview() {
  const railOpen = await page.getByTestId("nexora-rdi2-data-explorer").count();
  if (!railOpen) await clickTestId("nexora-stage-data-control");
  const reviewVisible = await page.getByTestId("nexora-data-source-removal-review").count();
  if (reviewVisible) return;
  const more = await page.getByTestId("nexora-data-source-more").count();
  if (more) await clickTestId("nexora-data-source-more");
  await page.getByTestId("nexora-data-source-remove-intent").waitFor({ state: "visible", timeout: 10000 });
  await clickTestId("nexora-data-source-remove-intent");
  await page.getByTestId("nexora-data-source-removal-review").waitFor({ state: "visible" });
}

await importCsv("test-fixtures/data-ux4/zero-object.csv");
await clickTestId("nexora-data-object-show-on-stage");
const stagedBefore = await page.evaluate(() => document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-staged-data-object-count"));
const explain = await askExecutiveChat(page, "What happens if I remove this?");
const removeAsk = await askExecutiveChat(page, "Remove it.");
const afterAsk = await page.evaluate(() => ({
  review: Boolean(document.querySelector('[data-testid="nexora-data-source-removal-review"]')),
  impact: document.querySelector('[data-testid="nexora-data-source-removal-review"]')?.getAttribute("data-removal-impact") ?? "none",
  staged: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-staged-data-object-count"),
  source: Boolean(document.querySelector('[data-data-object-id]')),
}));
const shotReview = await snapshot("proof-e-review");

await clickTestId("nexora-data-source-remove-cancel");
const afterCancel = await page.evaluate(() => ({
  review: Boolean(document.querySelector('[data-testid="nexora-data-source-removal-review"]')),
  staged: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-staged-data-object-count"),
}));

await clickTestId("nexora-data-object-show-on-stage");
await page.getByTestId("nexora-stage-data-object-remove-from-stage").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-stage-data-object-remove-from-stage");
const afterStageRemove = await page.evaluate(() => ({
  staged: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-staged-data-object-count"),
  focus: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-data-object-business-focus"),
}));
await clickTestId("nexora-stage-data-control");
await clickTestId("nexora-data-object-show-on-stage");
await clickTestId("nexora-stage-data-control");
await openRemovalReview();
await clickTestId("nexora-data-source-remove-confirm");
const afterConfirm = await page.evaluate(() => ({
  staged: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-staged-data-object-count"),
  selected: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-selected-data-object-id"),
  empty: Boolean(document.querySelector('[data-testid="nexora-data-rail-empty"]')),
  focus: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-data-object-business-focus"),
}));
const shotRemoved = await snapshot("proof-a-removed");

await importCsv("artifacts/data-ux/DATA-UX-2/fixtures/delivery-ready.csv");
await clickTestId("nexora-data-object-show-on-stage");
await clickTestId("nexora-stage-data-control");
await openRemovalReview();
const dependentImpact = await page.locator("[data-testid='nexora-data-source-removal-review']").getAttribute("data-removal-impact");
const shotDependent = await snapshot("proof-b-dependent-review");
await clickTestId("nexora-data-source-remove-cancel");

const report = {
  identity: "DATA-UX:5/LiveManagerProof",
  url,
  errors,
  stagedBefore,
  explain: explain.last,
  removeAsk: removeAsk.last,
  afterAsk,
  afterCancel,
  afterStageRemove,
  afterConfirm,
  dependentImpact,
  shots: { shotReview, shotRemoved, shotDependent },
  zeroPageErrors: errors.length === 0,
  ok:
    errors.length === 0 &&
    afterAsk.review === true &&
    afterAsk.impact === "NO_EXECUTIVE_IMPACT" &&
    afterCancel.review === false &&
    afterStageRemove.staged === "0" &&
    afterConfirm.empty === true &&
    afterConfirm.staged === "0" &&
    afterConfirm.selected === "none" &&
    dependentImpact === "DEPENDENT_DATA_BECOMES_UNAVAILABLE",
};
await writeFile(join(out, "live-report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
