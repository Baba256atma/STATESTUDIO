/**
 * DATA-UX:5-FIX3 live /executive proofs. Does not start DATA-UX:6.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), "artifacts/data-ux/DATA-UX-5-FIX3/proofs");
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

async function openData() {
  if (!(await page.getByTestId("nexora-rdi2-data-explorer").count())) {
    await clickTestId("nexora-stage-data-control");
  }
  await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "visible", timeout: 15000 });
}

async function closeData() {
  if (await page.getByTestId("nexora-rdi2-data-explorer").count()) {
    await clickTestId("nexora-stage-data-control");
  }
}

async function startCsv() {
  await openData();
  await clickTestId("nexora-rdi2-add-data");
  await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
  await page.locator('[data-testid="nexora-rdi4-source-choice"] button').first().evaluate((node) => node instanceof HTMLElement && node.click());
}

async function chooseCsv(filePath) {
  await page.getByTestId("nexora-csv-file-input").setInputFiles(filePath);
  await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 15000 });
}

async function snapshot(name) {
  await page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((node) => node.remove()));
  const path = join(out, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

function libraryState() {
  return page.evaluate(() => {
    const explorer = document.querySelector('[data-testid="nexora-rdi2-data-explorer"]');
    return {
      open: Boolean(explorer),
      total: explorer?.getAttribute("data-source-count") ?? "missing",
      csv: explorer?.getAttribute("data-csv-count") ?? "missing",
      committed: explorer?.getAttribute("data-csv-committed-count") ?? "missing",
      pending: explorer?.getAttribute("data-csv-pending-count") ?? "missing",
      empty: Boolean(document.querySelector('[data-testid="nexora-data-rail-empty"]')),
      pendingRow: document.querySelector('[data-testid="nexora-csv-pending-row"]')?.getAttribute("data-source-filename") ?? null,
      pendingStatus: document.querySelector('[data-testid="nexora-csv-pending-row"]')?.getAttribute("data-source-status") ?? null,
      review: Boolean(document.querySelector('[data-nx="rdi2-csv-import-flow"]')),
      reviewState: document.querySelector("[data-rdi2-state]")?.getAttribute("data-rdi2-state") ?? null,
      filenames: [...document.querySelectorAll("[data-source-filename]")].map((node) => node.getAttribute("data-source-filename")),
      connectedKinds: [...document.querySelectorAll('[data-source-kind="connected"]')].map((node) => node.textContent),
      about: document.querySelector('[data-testid="nexora-csv-about"]')?.textContent ?? "",
      columns: Boolean(document.querySelector('[data-testid="nexora-csv-columns"]')),
      preview: Boolean(document.querySelector('[data-testid="nexora-csv-committed-preview"]')),
    };
  });
}

await startCsv();
await chooseCsv("test-fixtures/data-ux5-fix1/otd-clarification.csv");
const flowAOpen = await libraryState();
await snapshot("proof-a-pending-review");

await clickTestId("nexora-csv-review-close");
const flowAClosed = await libraryState();
await snapshot("proof-a-pending-listed");

await page.getByTestId("nexora-csv-pending-row").evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 10000 });
const flowAResume = await libraryState();
await snapshot("proof-a-resumed");

await closeData();
const dataClosed = await page.evaluate(() => Boolean(document.querySelector('[data-testid="nexora-rdi2-data-explorer"]')));
await openData();
const flowB = await libraryState();
await snapshot("proof-b-data-reopened");

await page.getByTestId("nexora-csv-pending-row").evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-cancel-import").waitFor({ state: "visible" });
await clickTestId("nexora-csv-cancel-import");
if (await page.getByTestId("nexora-csv-cancel-import").count()) {
  const label = await page.getByTestId("nexora-csv-cancel-import").textContent();
  if (/Confirm/i.test(label ?? "")) await clickTestId("nexora-csv-cancel-import");
}
const flowC = await libraryState();
await snapshot("proof-c-cancelled");

await startCsv();
await chooseCsv("test-fixtures/data-ux5-fix1/otd-clarification.csv");
const validateEnabled = await page.getByRole("button", { name: "Validate Import" }).isEnabled().catch(() => false);
if (validateEnabled) {
  await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
}
const flowD = await page.evaluate(() => ({
  pending: document.querySelector('[data-testid="nexora-rdi2-data-explorer"]')?.getAttribute("data-csv-pending-count"),
  committed: document.querySelector('[data-testid="nexora-rdi2-data-explorer"]')?.getAttribute("data-csv-committed-count"),
  alert: document.querySelector('[role="alert"]')?.textContent ?? "",
  use: Boolean(document.querySelector('[data-testid="nexora-csv-use-this-data"]')),
}));
await snapshot("proof-d-validation-failure");
await clickTestId("nexora-csv-cancel-import");
if (await page.getByTestId("nexora-csv-cancel-import").count()) {
  const label = await page.getByTestId("nexora-csv-cancel-import").textContent();
  if (/Confirm/i.test(label ?? "")) await clickTestId("nexora-csv-cancel-import");
}

await startCsv();
await chooseCsv("test-fixtures/data-ux5-fix2/delivery_2026.csv");
await page.getByRole("button", { name: "Validate Import" }).waitFor({ state: "visible", timeout: 15000 });
await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-use-this-data").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-csv-use-this-data");
await page.getByTestId("nexora-csv-about").waitFor({ state: "visible", timeout: 15000 });
const flowE = await libraryState();
await snapshot("proof-e-accepted");

await clickTestId("nexora-data-source-close-details");
const afterCloseCommitted = await libraryState();
await page.locator('[data-source-filename="delivery_2026.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
const flowF = await libraryState();
await snapshot("proof-f-committed-detail");

await startCsv();
await chooseCsv("test-fixtures/data-ux5-fix2/capacity.csv");
await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-use-this-data").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-csv-use-this-data");
const flowG = await libraryState();
await snapshot("proof-g-two-csvs");

const flowH = await libraryState();
await snapshot("proof-h-connected");

const report = {
  ok: errors.length === 0
    && flowAOpen.review === true
    && flowAOpen.pending === "1"
    && flowAClosed.pendingRow === "otd-clarification.csv"
    && flowAClosed.pendingStatus === "Pending"
    && flowAClosed.review === false
    && flowAResume.review === true
    && dataClosed === false
    && flowB.pendingRow === "otd-clarification.csv"
    && flowC.pendingRow === null
    && flowD.committed === "0"
    && flowD.use === false
    && flowE.committed === "1"
    && flowE.pending === "0"
    && flowE.filenames.includes("delivery_2026.csv")
    && afterCloseCommitted.about === ""
    && flowF.about.length > 0
    && flowF.columns === true
    && flowF.preview === true
    && flowG.filenames.includes("capacity.csv")
    && flowG.filenames.includes("delivery_2026.csv")
    && flowH.connectedKinds.some((text) => /Engineering Source/i.test(text ?? "")),
  flowAOpen,
  flowAClosed,
  flowAResume,
  dataClosed,
  flowB,
  flowC,
  flowD,
  flowE,
  afterCloseCommitted,
  flowF,
  flowG,
  flowH,
  pageErrors: errors,
};
await writeFile(join(out, "live-report.json"), JSON.stringify(report, null, 2));
await browser.close();
if (!report.ok) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));
