/**
 * DATA-UX:5-FIX1 live /executive proof. Does not start DATA-UX:6.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), "artifacts/data-ux/DATA-UX-5-FIX1/proofs");
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

async function openCsvReview(filePath) {
  const railOpen = await page.getByTestId("nexora-rdi2-data-explorer").count();
  if (!railOpen) await clickTestId("nexora-stage-data-control");
  await page.getByTestId("nexora-rdi2-add-data").waitFor({ state: "visible", timeout: 15000 });
  await clickTestId("nexora-rdi2-add-data");
  await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
  await page.locator('[data-testid="nexora-rdi4-source-choice"] button').first().evaluate((node) => {
    if (node instanceof HTMLElement) node.click();
  });
  await page.getByTestId("nexora-csv-file-input").setInputFiles(filePath);
  await page.getByTestId("nexora-csv-needs-clarification").waitFor({ state: "visible", timeout: 15000 });
}

async function snapshot(name) {
  await page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((node) => node.remove()));
  const path = join(out, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

function countQuestions(text) {
  return page.evaluate((needle) => {
    const messages = [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')];
    return messages.filter((node) => (node.textContent ?? "").includes(needle)).length;
  }, text);
}

await openCsvReview("test-fixtures/data-ux5-fix1/otd-clarification.csv");
const beforeFocus = await page.evaluate(() =>
  document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-data-object-business-focus") ?? "none",
);
const unresolvedBefore = await page.locator("[data-testid='nexora-csv-needs-clarification']").textContent();
await clickTestId("nexora-csv-ask-OTD");
await page.getByTestId("nexora-conversational-message-nexora").last().waitFor({ state: "visible" });
const firstQuestion = await page.getByTestId("nexora-conversational-message-nexora").last().textContent();
const awaiting = await page.locator('[data-ask-nexora-state="awaiting-manager"]').count();
await clickTestId("nexora-csv-ask-OTD");
await clickTestId("nexora-csv-ask-OTD");
const questionCount = await countQuestions("Does OTD");
const shotAsk = await snapshot("proof-ask-once");

const unrelated = await askExecutiveChat(page, "What is Capacity Gap?");
const stillUnresolvedAfterUnrelated = await page.locator("[data-testid='nexora-csv-needs-clarification']").count();
await clickTestId("nexora-csv-ask-OTD");
const yes = await askExecutiveChat(page, "Yes.");
const unresolvedAfter = await page.locator("[data-testid='nexora-csv-needs-clarification']").count();
const confirmedCopy = await page.locator("[data-testid='nexora-csv-understanding-summary']").textContent();
const afterFocus = await page.evaluate(() =>
  document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-data-object-business-focus") ?? "none",
);
const shotYes = await snapshot("proof-yes-resolved");

await page.locator('[data-testid="nexora-rdi2-data-explorer"]').getByRole("button", { name: "Close", exact: true }).evaluate((node) => node instanceof HTMLElement && node.click());
await openCsvReview("test-fixtures/data-ux5-fix1/otd-clarification.csv");
await clickTestId("nexora-csv-ask-OTD");
const correction = await askExecutiveChat(page, "No, OTD means order-to-delivery time.");
const correctionCopy = await page.locator("[data-testid='nexora-csv-understanding-summary']").textContent();
const shotCorrection = await snapshot("proof-correction");

const report = {
  identity: "DATA-UX:5-FIX1/LiveManagerProof",
  url,
  errors,
  firstQuestion,
  awaiting: awaiting > 0,
  questionCount,
  unrelatedLast: unrelated.last,
  stillUnresolvedAfterUnrelated,
  yesLast: yes.last,
  unresolvedBefore,
  unresolvedAfter,
  confirmedCopy,
  correctionLast: correction.last,
  correctionCopy,
  beforeFocus,
  afterFocus,
  shots: { shotAsk, shotYes, shotCorrection },
  zeroPageErrors: errors.length === 0,
  ok:
    errors.length === 0 &&
    /Does OTD represent/i.test(firstQuestion ?? "") &&
    awaiting > 0 &&
    questionCount === 1 &&
    stillUnresolvedAfterUnrelated === 1 &&
    /confirmed/i.test(yes.last) &&
    unresolvedAfter === 0 &&
    /OTD/i.test(confirmedCopy ?? "") &&
    /order-to-delivery/i.test(correctionCopy ?? "") &&
    beforeFocus === afterFocus,
};
await writeFile(join(out, "live-report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
