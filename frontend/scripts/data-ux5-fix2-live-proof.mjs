/**
 * DATA-UX:5-FIX2 live /executive proofs. Does not start DATA-UX:6.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), "artifacts/data-ux/DATA-UX-5-FIX2/proofs");
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
  const railOpen = await page.getByTestId("nexora-rdi2-data-explorer").count();
  if (!railOpen) await clickTestId("nexora-stage-data-control");
  await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "visible", timeout: 15000 });
}

async function closeData() {
  const railOpen = await page.getByTestId("nexora-rdi2-data-explorer").count();
  if (railOpen) await clickTestId("nexora-stage-data-control");
  await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
}

async function importCsv(filePath) {
  await openData();
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

function libraryState() {
  return page.evaluate(() => {
    const explorer = document.querySelector('[data-testid="nexora-rdi2-data-explorer"]');
    return {
      open: Boolean(explorer),
      total: explorer?.getAttribute("data-source-count") ?? "missing",
      csv: explorer?.getAttribute("data-csv-count") ?? "missing",
      connected: explorer?.getAttribute("data-connected-count") ?? "missing",
      empty: Boolean(document.querySelector('[data-testid="nexora-data-rail-empty"]')),
      filenames: [...document.querySelectorAll("[data-source-filename]")].map((node) => node.getAttribute("data-source-filename")),
      selected: explorer?.getAttribute("data-selected-source-id") ?? "none",
      details: Boolean(document.querySelector('[data-testid="nexora-rdi3-source-intelligence"]')),
      live: Boolean(document.querySelector('[data-testid="nexora-rdi4-live-source"]')),
      emptyCopy: document.querySelector('[data-testid="nexora-data-rail-empty"]')?.textContent ?? "",
    };
  });
}

await importCsv("test-fixtures/data-ux5-fix2/delivery_2026.csv");
const afterImport = await libraryState();
await snapshot("proof-a-imported");

await clickTestId("nexora-data-source-close-details");
const afterCloseDetails = await libraryState();
await snapshot("proof-a-details-closed");

await closeData();
const dataClosed = await page.evaluate(() => Boolean(document.querySelector('[data-testid="nexora-rdi2-data-explorer"]')));
await openData();
const afterReopenData = await libraryState();
await snapshot("proof-a-data-reopened");

const filenameButton = page.locator('[data-source-filename="delivery_2026.csv"]');
await filenameButton.evaluate((node) => node instanceof HTMLElement && node.click());
const reopenedDetails = await libraryState();
const detailName = await page.evaluate(() => document.querySelector('[data-testid="nexora-rdi3-source-intelligence"] strong')?.textContent ?? "");
await snapshot("proof-a-csv-reopened");

await importCsv("test-fixtures/data-ux5-fix2/capacity.csv");
const afterSecondCsv = await libraryState();
await snapshot("proof-e-two-csvs");

await openData();
let connected = {
  attempted: false,
  connected: false,
  related: "",
  viewChangesSource: "",
  askCollapsed: false,
  sourceAfterAsk: false,
  returned: false,
  reason: "not-run",
};

async function openConnectedDetails() {
  const row = page.locator('[data-source-kind="connected"]').first();
  if (!(await row.count())) return false;
  await row.evaluate((node) => node instanceof HTMLElement && node.click());
  await page.getByTestId("nexora-rdi4-live-source").waitFor({ state: "visible", timeout: 8000 });
  return true;
}

const existingConnected = await page.locator('[data-source-kind="connected"]').count();
if (existingConnected) {
  connected.attempted = true;
  connected.connected = await openConnectedDetails();
} else {
  await clickTestId("nexora-rdi2-add-data");
  const liveButton = page.locator('[data-testid="nexora-rdi4-source-choice"] button').nth(1);
  if (await liveButton.count()) {
    connected.attempted = true;
    await liveButton.evaluate((node) => node instanceof HTMLElement && node.click());
    await page.getByTestId("nexora-rdi4-connect-flow").waitFor({ state: "visible", timeout: 10000 });
    await page.getByRole("button", { name: "Test Connection" }).evaluate((node) => node instanceof HTMLElement && node.click());
    try {
      await page.getByRole("button", { name: "Connect", exact: true }).waitFor({ state: "visible", timeout: 20000 });
      await page.getByRole("button", { name: "Connect", exact: true }).evaluate((node) => node instanceof HTMLElement && node.click());
      await page.getByTestId("nexora-rdi4-refresh").waitFor({ state: "visible", timeout: 10000 });
      await clickTestId("nexora-rdi4-refresh");
      await page.getByRole("button", { name: "Save Observation" }).waitFor({ state: "visible", timeout: 25000 });
      await page.getByRole("button", { name: "Save Observation" }).evaluate((node) => node instanceof HTMLElement && node.click());
      await page.getByRole("button", { name: "Done" }).evaluate((node) => node instanceof HTMLElement && node.click());
      connected.connected = await openConnectedDetails();
    } catch (error) {
      connected.reason = error instanceof Error ? error.message : String(error);
      const cancel = page.locator('[data-testid="nexora-rdi4-connect-flow"] button').filter({ hasText: "Cancel" });
      if (await cancel.count()) await cancel.evaluate((node) => node instanceof HTMLElement && node.click());
    }
  }
}

if (connected.connected) {
  connected.related = await page.evaluate(() => document.querySelector('[data-testid="nexora-rdi4-live-source"]')?.innerText ?? "");
  await snapshot("proof-c-engineering-source");
  const viewChanges = page.getByTestId("nexora-pm1-view-changes");
  if (await viewChanges.count()) {
    await viewChanges.evaluate((node) => {
      if (node instanceof HTMLDetailsElement) node.open = true;
    });
    connected.viewChangesSource = await page.evaluate(() => document.querySelector('[data-testid="nexora-pm1-view-changes"]')?.textContent ?? "");
  }
  await clickTestId("nexora-data-source-ask-nexora");
  await page.waitForTimeout(500);
  const dataOpen = await page.evaluate(() => Boolean(document.querySelector('[data-testid="nexora-rdi2-data-explorer"]')));
  connected.askCollapsed = dataOpen === false;
  await snapshot("proof-d-ask-nexora");
  const returnBtn = page.getByTestId("nexora-data-source-return");
  if (await returnBtn.count()) {
    await returnBtn.evaluate((node) => node instanceof HTMLElement && node.click());
    await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "visible", timeout: 10000 });
  } else {
    await openData();
  }
  connected.returned = true;
  connected.sourceAfterAsk = (await libraryState()).filenames.includes("delivery_2026.csv");
  connected.reason = "ok";
}

await openData();
async function removeListedCsv(fileName) {
  const row = page.locator(`[data-source-filename="${fileName}"]`);
  if (!(await row.count())) return;
  await row.evaluate((node) => node instanceof HTMLElement && node.click());
  await page.getByTestId("nexora-data-source-more").waitFor({ state: "visible", timeout: 8000 });
  await clickTestId("nexora-data-source-more");
  await clickTestId("nexora-data-source-remove-intent");
  await page.getByTestId("nexora-data-source-remove-confirm").waitFor({ state: "visible" });
  await clickTestId("nexora-data-source-remove-confirm");
  await page.waitForTimeout(200);
  if (await page.getByTestId("nexora-data-source-remove-confirm").count()) {
    await clickTestId("nexora-data-source-remove-confirm");
  }
}
const afterFirstRemoveTarget = (await libraryState()).filenames[0];
if (afterFirstRemoveTarget) await removeListedCsv(afterFirstRemoveTarget);
const afterFirstRemove = await libraryState();
for (const name of [...afterFirstRemove.filenames]) await removeListedCsv(name);
const afterAllCsvRemoved = await libraryState();
await snapshot("proof-b-empty-after-remove");

const report = {
  ok: errors.length === 0
    && afterImport.filenames.includes("delivery_2026.csv")
    && afterImport.empty === false
    && afterCloseDetails.filenames.includes("delivery_2026.csv")
    && afterCloseDetails.details === false
    && dataClosed === false
    && afterReopenData.filenames.includes("delivery_2026.csv")
    && afterReopenData.empty === false
    && reopenedDetails.details === true
    && detailName.includes("delivery_2026.csv")
    && afterSecondCsv.filenames.includes("capacity.csv")
    && afterAllCsvRemoved.empty === true
    && afterAllCsvRemoved.csv === "0"
    && connected.connected === true
    && /Connected source|Engineering Source/i.test(connected.related)
    && connected.askCollapsed === true
    && connected.sourceAfterAsk === true
    && connected.returned === true,
  afterImport,
  afterCloseDetails,
  dataClosed,
  afterReopenData,
  reopenedDetails,
  detailName,
  afterSecondCsv,
  connected,
  afterFirstRemove,
  afterAllCsvRemoved,
  pageErrors: errors,
};
await writeFile(join(out, "live-report.json"), JSON.stringify(report, null, 2));
await browser.close();
if (!report.ok) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));
