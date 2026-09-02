/**
 * DATA-UX:5-FIX5 live /executive proofs. Does not start DATA-UX:6.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), "artifacts/data-ux/DATA-UX-5-FIX5/proofs");
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

async function setDetailsOpen(id, open) {
  await page.evaluate(({ testId, open: nextOpen }) => {
    const node = document.querySelector(`[data-testid="${testId}"]`);
    if (node instanceof HTMLDetailsElement) node.open = nextOpen;
  }, { testId: id, open });
}

async function openData() {
  if (!(await page.getByTestId("nexora-rdi2-data-explorer").count())) {
    await clickTestId("nexora-stage-data-control");
  }
  await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "visible", timeout: 15000 });
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

function reviewState() {
  return page.evaluate(() => {
    const detailsOpen = (id) => document.querySelector(`[data-testid="${id}"]`)?.open === true;
    const mapping = document.querySelector('[data-nx="rdi2-csv-import-flow"]')?.getAttribute("data-rdi2-state");
    return {
      about: document.querySelector('[data-testid="nexora-csv-about"]')?.textContent ?? "",
      attention: document.querySelector('[data-testid="nexora-csv-needs-attention"]')?.textContent ?? "",
      understanding: document.querySelector('[data-testid="nexora-csv-understanding-summary"]')?.textContent ?? "",
      clarification: document.querySelector('[data-testid="nexora-csv-needs-clarification"]')?.textContent ?? "",
      potential: document.querySelector('[data-testid="nexora-csv-potentially-related"]')?.textContent ?? "",
      relatedPending: document.querySelector('[data-testid="nexora-csv-pending-related-objects"]')?.textContent ?? "",
      relatedCommitted: document.querySelector('[data-testid="nexora-csv-related-objects"]')?.textContent ?? "",
      columns: Boolean(document.querySelector('[data-testid="nexora-csv-columns"]')),
      preview: Boolean(document.querySelector('[data-testid="nexora-csv-preview-disclosure"]')),
      askOtd: Boolean(document.querySelector('[data-testid="nexora-csv-ask-OTD"]')),
      clarificationOpen: detailsOpen("nexora-csv-needs-clarification"),
      columnsOpen: detailsOpen("nexora-csv-columns"),
      previewOpen: detailsOpen("nexora-csv-preview-disclosure"),
      likelyBkl: /Likely Bkl/i.test(document.body.innerText ?? ""),
      intake: document.querySelector("[data-csv-intake]")?.getAttribute("data-csv-intake"),
      rdi2State: mapping,
      filenames: [...document.querySelectorAll("[data-source-filename]")].map((node) => node.getAttribute("data-source-filename")),
      connected: [...document.querySelectorAll('[data-source-kind="connected"]')].map((node) => node.textContent),
    };
  });
}

async function mapSelect(column, value) {
  await setDetailsOpen("nexora-csv-columns", true);
  const select = page.getByLabel(`Map ${column}`);
  await select.waitFor({ state: "attached", timeout: 8000 });
  await select.selectOption(value);
}

await startCsv();
await chooseCsv("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
const flowA = await reviewState();
await snapshot("proof-a-readability");

await setDetailsOpen("nexora-csv-columns", true);
await mapSelect("DT", "date");
await mapSelect("ORD_QTY", "");
await mapSelect("BKL", "");
await mapSelect("OTD", "shipping.on-time");
await mapSelect("CAP_AV", "production.total");
const afterMappings = await reviewState();
await page.getByRole("button", { name: "Validate Import" }).waitFor({ state: "visible", timeout: 10000 });
await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-needs-attention").waitFor({ state: "visible", timeout: 15000 });
const flowB = await reviewState();
await snapshot("proof-b-needs-attention");

const beforeCollapse = await page.evaluate(() => document.querySelector('[data-nx="rdi2-csv-import-flow"]')?.getAttribute("data-rdi2-state"));
await setDetailsOpen("nexora-csv-needs-clarification", false);
await setDetailsOpen("nexora-csv-columns", false);
await setDetailsOpen("nexora-csv-preview-disclosure", false);
const flowCCollapsed = await reviewState();
await snapshot("proof-c-collapse");
await setDetailsOpen("nexora-csv-needs-clarification", true);
await setDetailsOpen("nexora-csv-columns", true);
await setDetailsOpen("nexora-csv-preview-disclosure", true);
const afterCollapse = await page.evaluate(() => document.querySelector('[data-nx="rdi2-csv-import-flow"]')?.getAttribute("data-rdi2-state"));
const flowC = { before: beforeCollapse, after: afterCollapse, collapsed: flowCCollapsed };

await setDetailsOpen("nexora-csv-columns", true);
let flowD = { opened: false };
if (await page.getByTestId("nexora-csv-change-meaning-CAP_AV").count()) {
  await clickTestId("nexora-csv-change-meaning-CAP_AV");
  await page.getByTestId("nexora-csv-keep-current").waitFor({ state: "visible", timeout: 8000 });
  await clickTestId("nexora-csv-keep-current");
  flowD = { opened: true, kept: true };
}
await snapshot("proof-d-change-meaning");

await clickTestId("nexora-csv-review-close");
await startCsv();
await chooseCsv("test-fixtures/data-ux5-fix2/capacity.csv");
const flowGSecond = await reviewState();
await clickTestId("nexora-csv-review-close");
const flowG = await page.evaluate(() => ({
  pending: document.querySelector('[data-testid="nexora-rdi2-data-explorer"]')?.getAttribute("data-csv-pending-count"),
  files: [...document.querySelectorAll("[data-source-filename]")].map((node) => node.getAttribute("data-source-filename")),
}));
await snapshot("proof-g-multi-pending");

await page.locator('[data-source-filename="capacity.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByRole("button", { name: "Validate Import" }).waitFor({ state: "visible", timeout: 10000 });
await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-use-this-data").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-csv-use-this-data");
await page.getByTestId("nexora-csv-related-objects").waitFor({ state: "visible", timeout: 15000 });
const flowF = await reviewState();
await snapshot("proof-f-committed-related");

const flowE = {
  potential: Boolean(flowA.potential || afterMappings.potential || flowB.potential),
  potentialCopy: afterMappings.potential || flowB.potential || flowA.potential,
  fallback: /Available after validation/i.test(flowA.relatedPending),
  notConnectedCopy: /has not connected these objects yet/i.test((afterMappings.potential || flowB.potential || "") + (afterMappings.relatedPending || "")),
};

const report = {
  ok: errors.length === 0
    && /About this data/i.test(flowA.about)
    && /Nexora understands/i.test(flowA.understanding)
    && /Needs clarification/i.test(flowA.clarification)
    && flowA.columns
    && flowA.preview
    && flowA.likelyBkl === false
    && /Used Capacity/i.test(flowB.attention)
    && /Production/i.test(flowB.attention)
    && /does not mean the file is broken/i.test(flowB.attention)
    && !/the source is broken/i.test(flowB.attention)
    && flowC.before === flowC.after
    && flowCCollapsed.clarificationOpen === false
    && flowCCollapsed.columnsOpen === false
    && flowCCollapsed.previewOpen === false
    && flowD.opened === true
    && flowG.files.includes("data-ux3-ambiguous.csv")
    && flowG.files.includes("capacity.csv")
    && /Related Objects/i.test(flowF.relatedCommitted)
    && !/caused/i.test(flowF.relatedCommitted)
    && /Engineering Source/i.test((flowA.connected ?? []).join(" ")),
  flowA,
  flowB,
  flowC,
  flowD,
  flowE,
  flowF,
  flowG,
  flowGSecond,
  afterMappings,
  pageErrors: errors,
};

await writeFile(join(out, "live-report.json"), JSON.stringify(report, null, 2));
await browser.close();
if (!report.ok) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));
