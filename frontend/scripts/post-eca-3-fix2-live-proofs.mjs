/**
 * NPA-T POST-ECA:3-FIX2 live /executive proofs. Isolated verified port.
 * Actual CSV state. Does not start POST-ECA:4, ECA:13, DATA-ADV:3, or FIX3.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/post-eca/POST-ECA-3-FIX2");
const INVENTORY = /There are \d+ CSV files? in the current Data Library/i;
const WHICH = /Which one do you want me to explain/i;
const CAP_HIJACK = /Understood\. CAP_AV remains unresolved/i;
const BKL_LOCK = /I still need a meaning for BKL/i;
const BLOCKING_KPI = "What useful KPIs can you calculate from this CSV with the fields you currently understand?";

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForHttp(url, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function pass(condition, actual) {
  return { pass: Boolean(condition), actual };
}

const started = { child: null, port: null };
try {
  let base = process.env.EXECUTIVE_URL ?? null;
  if (!base) {
    const port = await findFreePort();
    started.port = port;
    const child = spawn("npx", ["next", "start", "-H", "127.0.0.1", "-p", String(port)], {
      cwd: process.cwd(),
      stdio: "pipe",
      env: { ...process.env, PORT: String(port) },
    });
    started.child = child;
    base = `http://127.0.0.1:${port}/executive`;
    await waitForHttp(base);
  } else {
    base = base.split("?")[0];
  }
  const url = `${base}?reset=1`;
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await mkdir(out, { recursive: true });
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
  async function readShell() {
    return page.evaluate(() => {
      const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
      return {
        focused: shell?.getAttribute("data-focused-subject") ?? "none",
        dataRoute: shell?.getAttribute("data-advisor-data-route") ?? "none",
        dataIntent: shell?.getAttribute("data-data-conversation-intent") ?? "none",
        resolvedNames: shell?.getAttribute("data-resolved-source-names") ?? "none",
        sourceCount: shell?.getAttribute("data-data-library-source-count") ?? "none",
      };
    });
  }
  async function turn(utterance) {
    const chat = await askExecutiveChat(page, utterance);
    return { managerTurn: utterance, reply: chat.last, ...(await readShell()) };
  }

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
  await waitHydrated();

  await startCsv();
  await page.getByTestId("nexora-csv-file-input").setInputFiles("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
  await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 15000 });
  if (await page.getByTestId("nexora-csv-review-close").count()) {
    await clickTestId("nexora-csv-review-close");
  }

  const t1 = await turn("I mean data-ux3-ambiguous.csv.");
  const t2 = await turn("Which columns of data-ux3-ambiguous.csv do you understand, and which columns have an unclear business meaning?");
  const t3 = await turn("What does CAP_AV mean in this file?");
  const t4 = await turn("What does BKL mean? If you are not sure, tell me what information you need from me.");
  const t6 = await turn(BLOCKING_KPI);
  const t7 = await turn("Does this CSV provide evidence related to Capacity Gap?");
  const t9 = await turn("What can you conclude from this CSV, and what can you NOT conclude yet?");

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
  await waitHydrated();
  await startCsv();
  await page.getByTestId("nexora-csv-file-input").setInputFiles("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
  await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 15000 });
  if (await page.getByTestId("nexora-csv-review-close").count()) {
    await clickTestId("nexora-csv-review-close");
  }

  const cap = await turn("What does CAP_AV mean in this file?");
  const bkl = await turn("What does BKL mean?");
  const unknown = await turn("I don't know.");
  const continueSafe = await turn("What can you still tell me from the CSV?");
  const confirmCap = await turn("What does CAP_AV mean in this file?");
  const confirmed = await turn("CAP_AV means Available Capacity.");
  const reeval = await turn("Does that change what you can calculate?");
  const business = await turn("Explain Capacity Gap.");
  const side = await turn("What CSV files do we have?");
  const resume = await turn("Okay, continue with Capacity Gap.");

  await page.screenshot({ path: join(out, "live-proofs.png") });
  await browser.close();

  const runtime1Ok = !WHICH.test(t1.reply ?? "") && /CAP_AV/i.test(t2.reply ?? "") && /neither meaning is confirmed/i.test(t3.reply ?? "") && /BKL is a field/i.test(t4.reply ?? "") && !CAP_HIJACK.test(t4.reply ?? "") && !INVENTORY.test(t6.reply ?? "") && !BKL_LOCK.test(t7.reply ?? "") && !INVENTORY.test(t9.reply ?? "") && /cannot/i.test(t9.reply ?? "");
  const report = {
    identity: "NPA-T POST-ECA:3-FIX2/LiveCsvContentReasoning",
    url,
    isolatedPort: started.port,
    errors,
    diagnosticExactConversation: { t1, t2, t3, t4, t6, t7, t9 },
    runtimes: {
      runtime1: { name: "exact full reported conversation", ...pass(runtime1Ok, { t1, t2, t3, t4, t6, t7, t9 }) },
      runtime2: { name: "CAP_AV to BKL clarification escape", ...pass(/BKL is a field/i.test(bkl.reply ?? "") && !CAP_HIJACK.test(bkl.reply ?? ""), { cap, bkl }) },
      runtime3: { name: "KPI capability from actual CSV", ...pass(!INVENTORY.test(t6.reply ?? "") && /KPI|calculate|confirmed|unknown/i.test(t6.reply ?? ""), t6) },
      runtime4: { name: "CSV to Capacity Gap evidence relevance", ...pass(!BKL_LOCK.test(t7.reply ?? "") && /Capacity Gap|pending|evidence/i.test(t7.reply ?? ""), t7) },
      runtime5: { name: "bounded can/cannot conclude", ...pass(!INVENTORY.test(t9.reply ?? "") && /cannot/i.test(t9.reply ?? ""), t9) },
      runtime6: { name: "I don't know then continue", ...pass(/unresolved|Understood/i.test(unknown.reply ?? "") && !INVENTORY.test(continueSafe.reply ?? ""), { unknown, continueSafe }) },
      runtime7: { name: "semantic confirmation then re-evaluate", ...pass(/Available Capacity|Confirmed/i.test(confirmed.reply ?? ""), { confirmCap, confirmed, reeval }) },
      runtime8: { name: "business objective Data side question resume", ...pass(/csv/i.test(side.reply ?? "") && /Capacity Gap|continue|scenario/i.test(resume.reply ?? ""), { business, side, resume }) },
    },
  };
  await writeFile(join(out, "live-proofs.json"), JSON.stringify(report, null, 2));
  const failed = Object.values(report.runtimes).filter((item) => !item.pass);
  console.log(JSON.stringify({ ok: failed.length === 0 && errors.length === 0, failed: failed.map((item) => item.name), port: started.port, errors }, null, 2));
  if (failed.length || errors.length) process.exitCode = 1;
} finally {
  if (started.child && started.child.pid) {
    started.child.kill("SIGTERM");
  }
}
