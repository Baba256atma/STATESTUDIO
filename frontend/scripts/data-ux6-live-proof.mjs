/**
 * DATA-UX:6 live /executive proofs. Does not start BCA.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), "artifacts/data-ux/DATA-UX-6/proofs");
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

async function waitHydrated() {
  await page.locator('[data-csv-hydrated="true"]').waitFor({ state: "attached", timeout: 20000 });
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

function libraryState() {
  return page.evaluate(() => {
    const explorer = document.querySelector('[data-testid="nexora-rdi2-data-explorer"]');
    return {
      files: [...document.querySelectorAll("[data-source-filename]")].map((node) => node.getAttribute("data-source-filename")),
      pending: [...document.querySelectorAll('[data-source-lifecycle="pending"]')].map((node) => node.getAttribute("data-source-filename")),
      ready: [...document.querySelectorAll('[data-source-lifecycle="committed"]')].map((node) => node.getAttribute("data-source-filename")),
      counts: {
        csv: explorer?.getAttribute("data-csv-count"),
        committed: explorer?.getAttribute("data-csv-committed-count"),
        pending: explorer?.getAttribute("data-csv-pending-count"),
      },
      related: document.querySelector('[data-testid="nexora-csv-related-objects"]')?.textContent ?? "",
      about: document.querySelector('[data-testid="nexora-csv-about"]')?.textContent ?? "",
      understanding: document.querySelector('[data-testid="nexora-csv-understanding-summary"]')?.textContent ?? "",
      connected: [...document.querySelectorAll('[data-source-kind="connected"]')].map((node) => node.textContent).join(" "),
      focused: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject"),
      durability: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-csv-durability"),
      intake: document.querySelector("[data-csv-intake]")?.getAttribute("data-csv-intake"),
    };
  });
}

async function commitCsv(filePath) {
  await startCsv();
  await chooseCsv(filePath);
  await page.getByRole("button", { name: "Validate Import" }).waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
  await page.getByTestId("nexora-csv-use-this-data").waitFor({ state: "visible", timeout: 15000 });
  await clickTestId("nexora-csv-use-this-data");
  await page.locator('[data-source-lifecycle="committed"]').first().waitFor({ state: "visible", timeout: 10000 });
}

async function reloadExecutive() {
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
  await waitHydrated();
}

await waitHydrated();
await commitCsv("test-fixtures/data-ux5-fix2/delivery_2026.csv");
await openData();
await page.locator('[data-source-filename="delivery_2026.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
const flowABefore = await libraryState();
await snapshot("proof-a-before-refresh");
await reloadExecutive();
await openData();
await page.locator('[data-source-filename="delivery_2026.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
const flowA = await libraryState();
await snapshot("proof-a-after-refresh");

await commitCsv("test-fixtures/data-ux5-fix2/capacity.csv");
await commitCsv("test-fixtures/data-ux6/customer.csv");
await reloadExecutive();
await openData();
const flowB = await libraryState();
await snapshot("proof-b-three-committed");

await startCsv();
await chooseCsv("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
await page.evaluate(() => {
  const details = document.querySelector('[data-testid="nexora-csv-columns"]');
  if (details instanceof HTMLDetailsElement) details.open = true;
});
await page.getByLabel("Map OTD").selectOption("shipping.on-time");
await clickTestId("nexora-csv-review-close");
await startCsv();
await chooseCsv("test-fixtures/data-ux5-fix1/otd-clarification.csv");
await clickTestId("nexora-csv-review-close");
const flowDBefore = await libraryState();
await snapshot("proof-d-multi-pending");
await reloadExecutive();
await openData();
const flowC = await libraryState();
await page.locator('[data-source-filename="data-ux3-ambiguous.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
const flowCOpen = await libraryState();
await snapshot("proof-c-pending-resume");

await clickTestId("nexora-csv-review-close");
await page.locator('[data-source-filename="otd-clarification.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
await clickTestId("nexora-csv-cancel-import");
if (await page.getByTestId("nexora-csv-cancel-import").count()) {
  const label = await page.getByTestId("nexora-csv-cancel-import").textContent();
  if (/Confirm/i.test(label ?? "")) await clickTestId("nexora-csv-cancel-import");
}
await reloadExecutive();
await openData();
const flowE = await libraryState();
await snapshot("proof-e-cancel");

await page.locator('[data-source-filename="capacity.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-data-source-more").waitFor({ state: "visible", timeout: 8000 });
await clickTestId("nexora-data-source-more");
await clickTestId("nexora-data-source-remove-intent");
await page.getByTestId("nexora-data-source-remove-confirm").waitFor({ state: "visible" });
await clickTestId("nexora-data-source-remove-confirm");
if (await page.getByTestId("nexora-data-source-remove-confirm").count()) {
  await clickTestId("nexora-data-source-remove-confirm");
}
await reloadExecutive();
await openData();
const flowF = await libraryState();
await snapshot("proof-f-remove");

await page.locator('[data-source-filename="delivery_2026.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-data-source-more").waitFor({ state: "visible" });
await clickTestId("nexora-data-source-more");
await page.getByRole("button", { name: "Update source" }).evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-file-input").setInputFiles("test-fixtures/data-ux6/delivery_2026.csv");
await page.getByRole("button", { name: "Validate Import" }).waitFor({ state: "visible", timeout: 15000 });
await page.getByRole("button", { name: "Validate Import" }).evaluate((node) => node instanceof HTMLElement && node.click());
await page.getByTestId("nexora-csv-use-this-data").waitFor({ state: "visible", timeout: 15000 });
await clickTestId("nexora-csv-use-this-data");
await reloadExecutive();
await openData();
await page.locator('[data-source-filename="delivery_2026.csv"]').evaluate((node) => node instanceof HTMLElement && node.click());
const flowG = await libraryState();
await snapshot("proof-g-update");

const flowH = await page.evaluate(async () => {
  const dbName = "nexora-csv-real-data";
  const raw = await new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName, 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("snapshots", "readonly");
      const get = tx.objectStore("snapshots").get("current");
      get.onsuccess = () => resolve(get.result ?? null);
      get.onerror = () => reject(get.error);
    };
  });
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  const workspaces = new Set((parsed?.committed ?? []).map((entry) => entry.workspaceId));
  return { workspaces: [...workspaces], files: (parsed?.committed ?? []).map((entry) => `${entry.workspaceId}:${entry.prepared?.fileName}`) };
});

await page.evaluate(async () => {
  const dbName = "nexora-csv-real-data";
  await new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName, 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("snapshots", "readwrite");
      const get = tx.objectStore("snapshots").get("current");
      get.onsuccess = () => {
        const value = get.result;
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        parsed.committed.push({ workspaceId: "overview", sourceContextId: "csv:overview:corrupt.csv", importId: "bad" });
        tx.objectStore("snapshots").put(JSON.stringify(parsed), "current");
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  });
});
await reloadExecutive();
await openData();
const flowI = await libraryState();
await snapshot("proof-i-corrupt");

const report = {
  ok: errors.length === 0
    && flowA.files.includes("delivery_2026.csv")
    && flowA.ready.includes("delivery_2026.csv")
    && /Related Objects/i.test(flowA.related)
    && !/caused/i.test(flowA.related)
    && flowB.ready.includes("delivery_2026.csv")
    && flowB.ready.includes("capacity.csv")
    && flowB.ready.includes("customer.csv")
    && flowC.pending.includes("data-ux3-ambiguous.csv")
    && /On-Time Deliveries|Confirmed by manager/i.test(flowCOpen.understanding)
    && flowDBefore.pending.includes("data-ux3-ambiguous.csv")
    && flowDBefore.pending.includes("otd-clarification.csv")
    && !flowE.pending.includes("otd-clarification.csv")
    && flowE.pending.includes("data-ux3-ambiguous.csv")
    && !flowF.files.includes("capacity.csv")
    && flowG.files.includes("delivery_2026.csv")
    && flowI.files.includes("delivery_2026.csv")
    && !flowI.files.includes("corrupt.csv")
    && /Engineering Source/i.test(flowA.connected)
    && flowH.workspaces.length === 1
    && flowH.workspaces[0] === "overview",
  flowABefore,
  flowA,
  flowB,
  flowC,
  flowCOpen,
  flowDBefore,
  flowE,
  flowF,
  flowG,
  flowH,
  flowI,
  pageErrors: errors,
};

await writeFile(join(out, "live-report.json"), JSON.stringify(report, null, 2));
await browser.close();
if (!report.ok) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));
