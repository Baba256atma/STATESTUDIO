/**
 * DATA-UX:5-FIX4 live /executive proofs. Does not start DATA-UX:6.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, EXECUTIVE_EXISTING_URL, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), "artifacts/data-ux/DATA-UX-5-FIX4/proofs");
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
    const flow = document.querySelector('[data-nx="rdi2-csv-import-flow"]');
    return {
      open: Boolean(explorer),
      total: explorer?.getAttribute("data-source-count") ?? "missing",
      csv: explorer?.getAttribute("data-csv-count") ?? "missing",
      committed: explorer?.getAttribute("data-csv-committed-count") ?? "missing",
      pending: explorer?.getAttribute("data-csv-pending-count") ?? "missing",
      empty: Boolean(document.querySelector('[data-testid="nexora-data-rail-empty"]')),
      pendingRows: [...document.querySelectorAll('[data-source-lifecycle="pending"]')].map((node) => node.getAttribute("data-source-filename")),
      review: Boolean(flow),
      intake: flow?.getAttribute("data-csv-intake") ?? null,
      headline: flow?.querySelector("div")?.textContent ?? "",
      newIntake: Boolean(document.querySelector('[data-testid="nexora-csv-new-intake"]')),
      existingSource: Boolean(document.querySelector('[data-testid="nexora-csv-existing-source"]')),
      understanding: document.querySelector('[data-testid="nexora-csv-understanding-summary"]')?.textContent ?? "",
      previewHeaders: [...document.querySelectorAll('[data-testid="nexora-csv-preview-disclosure"] th')].map((node) => node.textContent),
      filenames: [...document.querySelectorAll("[data-source-filename]")].map((node) => node.getAttribute("data-source-filename")),
      connectedKinds: [...document.querySelectorAll('[data-source-kind="connected"]')].map((node) => node.textContent),
      about: document.querySelector('[data-testid="nexora-csv-about"]')?.textContent ?? "",
    };
  });
}

await startCsv();
await chooseCsv("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 15000 });
const flowAFirst = await libraryState();
await snapshot("proof-a-first-pending");
await clickTestId("nexora-csv-review-close");

await clickTestId("nexora-rdi2-add-data");
await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
const flowAAddData = await libraryState();
await snapshot("proof-a-add-data-choice");
await page.locator('[data-testid="nexora-rdi4-source-choice"] button').first().evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-new-intake").waitFor({ state: "visible", timeout: 10000 });
const flowANewIntake = await libraryState();
await snapshot("proof-a-new-intake");
await chooseCsv("test-fixtures/data-ux5-fix2/capacity.csv");
await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-csv-review-close");
const flowABoth = await libraryState();
await snapshot("proof-a-two-pending");

await page.locator('[data-source-filename="data-ux3-ambiguous.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible" });
const flowBAmbiguous = await libraryState();
await clickTestId("nexora-csv-review-close");
await page.locator('[data-source-filename="capacity.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible" });
const flowBCapacity = await libraryState();
await snapshot("proof-b-independent");

let flowI = { asked: false, ambiguousStillNeeds: false };
try {
  await clickTestId("nexora-csv-review-close");
  await page.locator('[data-source-filename="data-ux3-ambiguous.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
  await page.getByTestId("nexora-csv-ask-OTD").waitFor({ state: "visible", timeout: 5000 });
  await clickTestId("nexora-csv-ask-OTD");
  await askExecutiveChat(page, "Yes.");
  await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible" });
  const afterAsk = await libraryState();
  await clickTestId("nexora-csv-review-close");
  await page.locator('[data-source-filename="capacity.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
  const capacityAfterAsk = await libraryState();
  flowI = {
    asked: /On-Time|OTD/i.test(afterAsk.understanding),
    ambiguousStillNeeds: /OTD/i.test(afterAsk.understanding),
    capacityUnchanged: /Current Revenue|usedCapacity|Production/i.test(capacityAfterAsk.understanding + capacityAfterAsk.previewHeaders.join(",")),
  };
  await snapshot("proof-i-ask-scoped");
} catch (error) {
  flowI = { asked: false, error: String(error) };
}

await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click()).catch(() => {});
const flowCCapacity = await page.evaluate(() => ({
  use: Boolean(document.querySelector('[data-testid="nexora-csv-use-this-data"]')),
  pending: document.querySelector('[data-testid="nexora-rdi2-data-explorer"]')?.getAttribute("data-csv-pending-count"),
  committed: document.querySelector('[data-testid="nexora-rdi2-data-explorer"]')?.getAttribute("data-csv-committed-count"),
}));
await snapshot("proof-c-validate-b");
if (await page.getByTestId("nexora-csv-use-this-data").count()) {
  await clickTestId("nexora-csv-use-this-data");
}
await page.getByTestId("nexora-csv-about").waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
const flowD = await libraryState();
await snapshot("proof-d-commit-b");

await page.locator('[data-source-filename="data-ux3-ambiguous.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-cancel-import").waitFor({ state: "visible" });
await clickTestId("nexora-csv-cancel-import");
if (await page.getByTestId("nexora-csv-cancel-import").count()) {
  const label = await page.getByTestId("nexora-csv-cancel-import").textContent();
  if (/Confirm/i.test(label ?? "")) await clickTestId("nexora-csv-cancel-import");
}
const flowE = await libraryState();
await snapshot("proof-e-cancel-a");

await startCsv();
await page.getByTestId("nexora-csv-new-intake").waitFor({ state: "visible", timeout: 10000 });
const flowF = await libraryState();
await snapshot("proof-f-third-add");
await chooseCsv("test-fixtures/data-ux5-fix1/otd-clarification.csv");
await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-csv-review-close");
await startCsv();
await page.getByTestId("nexora-csv-new-intake").waitFor({ state: "visible" });
await chooseCsv("test-fixtures/data-ux5-fix1/otd-clarification.csv");
await page.getByText("A pending source with this filename already exists.").waitFor({ state: "visible", timeout: 10000 });
const flowG = await libraryState();
const duplicateAlert = await page.evaluate(() => [...document.querySelectorAll("[role=alert]")].map((node) => node.textContent).join(" "));
await snapshot("proof-g-duplicate-pending");

await page.getByRole("button", { name: "Close", exact: true }).evaluate((node) => node instanceof HTMLElement && node.click()).catch(() => {});
await startCsv();
await chooseCsv("test-fixtures/data-ux5-fix2/delivery_2026.csv");
await page.getByRole("button", { name: "Validate Import" }).waitFor({ state: "visible", timeout: 15000 });
await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-use-this-data").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-csv-use-this-data");
await startCsv();
await chooseCsv("test-fixtures/data-ux5-fix2/delivery_2026.csv");
await page.getByTestId("nexora-csv-existing-source").waitFor({ state: "visible", timeout: 10000 });
const flowH = await libraryState();
await snapshot("proof-h-committed-duplicate");

await page.getByRole("button", { name: "Close", exact: true }).evaluate((node) => node instanceof HTMLElement && node.click()).catch(() => {});
const flowJ = await libraryState();
await page.locator('[data-source-kind="connected"]').first().evaluate((node) => node instanceof HTMLElement && node.click());
const connectedOpen = await page.evaluate(() => ({
  kind: document.querySelector('[data-source-kind="connected"][data-source-selected="true"]')?.textContent ?? "",
  csvPreview: Boolean(document.querySelector('[data-testid="nexora-csv-committed-preview"]')),
  csvColumns: Boolean(document.querySelector('[data-testid="nexora-csv-columns"]')),
}));
await snapshot("proof-j-connected");

const report = {
  ok: errors.length === 0
    && flowAAddData.review === false
    && flowANewIntake.newIntake === true
    && flowANewIntake.intake === "new"
    && !/data-ux3-ambiguous\.csv/.test(flowANewIntake.headline)
    && flowABoth.pendingRows.includes("data-ux3-ambiguous.csv")
    && flowABoth.pendingRows.includes("capacity.csv")
    && Number(flowABoth.pending) === 2
    && flowBAmbiguous.previewHeaders.includes("OTD")
    && flowBCapacity.previewHeaders.includes("currentRevenue")
    && flowD.filenames.includes("capacity.csv")
    && flowD.pendingRows.includes("data-ux3-ambiguous.csv")
    && !flowE.pendingRows.includes("data-ux3-ambiguous.csv")
    && flowE.filenames.includes("capacity.csv")
    && flowF.newIntake === true
    && /pending source with this filename already exists/i.test(duplicateAlert)
    && flowH.existingSource === true
    && /Engineering Source/i.test((flowJ.connectedKinds ?? []).join(" "))
    && connectedOpen.csvPreview === false
    && connectedOpen.csvColumns === false,
  flowAFirst,
  flowAAddData,
  flowANewIntake,
  flowABoth,
  flowBAmbiguous,
  flowBCapacity,
  flowCCapacity,
  flowD,
  flowE,
  flowF,
  flowG,
  flowH,
  flowI,
  flowJ,
  connectedOpen,
  duplicateAlert,
  pageErrors: errors,
};

await writeFile(join(out, "live-report.json"), JSON.stringify(report, null, 2));
await browser.close();
if (!report.ok) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));
