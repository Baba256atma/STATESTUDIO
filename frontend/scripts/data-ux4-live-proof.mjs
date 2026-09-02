/**
 * DATA-UX:4 live /executive proofs. Presentation only. Does not start DATA-UX:5.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), "artifacts/data-ux/DATA-UX-4/proofs");
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
  await page.getByTestId("nexora-csv-file-input").waitFor({ state: "attached", timeout: 15000 });
  await page.getByTestId("nexora-csv-file-input").setInputFiles(filePath);
  await page.getByRole("button", { name: "Validate Import" }).waitFor({ state: "visible", timeout: 15000 });
  await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => {
    if (node instanceof HTMLElement) node.click();
  });
  await page.getByRole("button", { name: "Import", exact: true }).waitFor({ state: "visible", timeout: 15000 });
  await page.getByRole("button", { name: "Import", exact: true }).evaluate((node) => {
    if (node instanceof HTMLElement) node.click();
  });
  await page.getByRole("button", { name: "View Changes" }).waitFor({ state: "visible", timeout: 15000 });
  await page.getByRole("button", { name: "View Changes" }).evaluate((node) => {
    if (node instanceof HTMLElement) node.click();
  });
  await page.getByTestId("nexora-data-object-show-on-stage").waitFor({ state: "visible" });
}

async function snapshot(name) {
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((node) => node.remove());
  });
  const path = join(out, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

const focusBefore = await page.evaluate(() =>
  document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject") ?? "none",
);

await importCsv("test-fixtures/data-ux4/zero-object.csv");
await clickTestId("nexora-data-object-show-on-stage");
const proofA = await page.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  return {
    staged: shell?.getAttribute("data-staged-data-object-count") ?? "0",
    focus: shell?.getAttribute("data-data-object-business-focus") ?? "none",
    selected: shell?.getAttribute("data-selected-data-object-id") ?? "none",
    inspection: Boolean(document.querySelector('[data-testid="nexora-stage-data-object-inspection"]')),
    deletes: document.querySelector('[data-testid="nexora-stage-data-object-inspection"]')?.getAttribute("data-remove-from-stage-deletes-source") ?? "missing",
  };
});
const shotA = await snapshot("proof-a-zero-object");

const explain = await askExecutiveChat(page, "Explain this.");
const support = await askExecutiveChat(page, "What does it support?");

await importCsv("artifacts/data-ux/DATA-UX-2/fixtures/delivery-ready.csv");
await clickTestId("nexora-data-object-show-on-stage");
const proofC = await page.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  return {
    staged: shell?.getAttribute("data-staged-data-object-count") ?? "0",
    ids: shell?.getAttribute("data-staged-data-object-ids") ?? "none",
  };
});
const shotC = await snapshot("proof-c-multiple-sources");

await page.setViewportSize({ width: 1024, height: 768 });
const shotResponsive = await snapshot("proof-1024x768");
await page.setViewportSize({ width: 1502, height: 942 });

await clickTestId("nexora-stage-data-object-remove-from-stage");
const afterRemove = await page.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  return {
    staged: shell?.getAttribute("data-staged-data-object-count") ?? "0",
    rail: Boolean(document.querySelector('[data-testid="nexora-rdi2-data-explorer"]')),
    sourceButtons: [...document.querySelectorAll("[data-data-object-id]")].length,
  };
});
await clickTestId("nexora-stage-data-control");
const shotF = await snapshot("proof-f-remove-from-stage");

const report = {
  identity: "DATA-UX:4/LiveManagerProof",
  url,
  errors,
  focusBefore,
  proofA,
  explain: explain.last,
  support: support.last,
  explainFocus: explain.focused,
  proofC,
  afterRemove,
  shots: { shotA, shotC, shotResponsive, shotF },
  zeroPageErrors: errors.length === 0,
  ok:
    errors.length === 0 &&
    proofA.staged === "1" &&
    proofA.inspection === true &&
    proofA.deletes === "false" &&
    /CSV Data Object|no supported executive-object relationship/i.test(`${explain.last} ${support.last}`) &&
    Number(proofC.staged) >= 1 &&
    afterRemove.sourceButtons >= 1,
};
await writeFile(join(out, "live-report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
