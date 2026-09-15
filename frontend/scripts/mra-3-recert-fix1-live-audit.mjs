/**
 * MRA:3-RECERT-FIX1 live /executive deictic follow-up fidelity.
 * Requires a production `next start` unless EXECUTIVE_URL is set.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/mra/MRA-3-RECERT-FIX1");
const LEAK =
  /\b(?:NCA(?::|-)|NXA(?::|-)|ECA(?::|-)|CC:\d|DTH|POST:\d|DATA-ADV|canonicalWriter|INSUFFICIENT_REALITY)\b/i;
const STEAL = /Investigate Capacity Expansion Plan/i;

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

async function waitForHttp(url, attempts = 80) {
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

async function readShell(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
    };
  });
}

async function clickTestId(page, id) {
  await page.evaluate((testId) => {
    const node = document.querySelector(`[data-testid="${testId}"]`);
    if (!(node instanceof HTMLElement)) throw new Error(`missing ${testId}`);
    node.click();
  }, id);
}

async function importCsv(page) {
  await page.locator('[data-csv-hydrated="true"]').waitFor({ state: "attached", timeout: 20000 });
  if (!(await page.getByTestId("nexora-rdi2-data-explorer").count())) {
    await clickTestId(page, "nexora-stage-data-control");
  }
  await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "visible", timeout: 15000 });
  await clickTestId(page, "nexora-rdi2-add-data");
  await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
  await page.locator('[data-testid="nexora-rdi4-source-choice"] button').first().evaluate((node) => node instanceof HTMLElement && node.click());
  const fileInput = page.getByTestId("nexora-csv-file-input");
  await fileInput.waitFor({ state: "attached", timeout: 15000 });
  await fileInput.setInputFiles("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
  await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 20000 });
  const validate = page.getByRole("button", { name: "Validate Import" });
  if (await validate.count()) {
    await validate.evaluate((node) => node instanceof HTMLElement && node.click());
  }
  const use = page.getByTestId("nexora-csv-use-this-data");
  if (await use.count()) {
    await use.waitFor({ state: "visible", timeout: 15000 });
    await use.click();
    await page.waitForTimeout(800);
  }
}

function check(id, actual, expected, anti) {
  const text = actual ?? "";
  const pass = expected.test(text) && (!anti || !anti.test(text));
  return { id, pass, expected: String(expected), anti: anti ? String(anti) : null, actual: text.slice(0, 320) };
}

const started = { child: null };
try {
  let base = process.env.EXECUTIVE_URL ?? null;
  if (!base) {
    const port = await findFreePort();
    const child = spawn("npx", ["next", "start", "-H", "127.0.0.1", "-p", String(port)], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PORT: String(port) },
    });
    started.child = child;
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));
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

  async function turn(utterance) {
    const chat = await askExecutiveChat(page, utterance);
    return { managerTurn: utterance, reply: chat.last, leak: LEAK.test(chat.last ?? ""), ...(await readShell(page)) };
  }

  async function reset(withCsv) {
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
    await page.waitForTimeout(600);
    if (withCsv) await importCsv(page);
  }

  const live = { identity: "NPA-T MRA:3-RECERT-FIX1/LiveDeicticFidelity", url, errors, checks: [], journeys: {} };

  await reset(true);
  live.journeys.blocker = [];
  for (const utterance of [
    "show me scenarios",
    "is there any CSV files?",
    "explain it",
    "Capacity Gap",
    "explain it",
    "Demand Surge",
    "tell me more about it",
  ]) {
    live.journeys.blocker.push(await turn(utterance));
  }
  live.checks.push(check("RECERT-001", live.journeys.blocker.at(-1).reply, /Demand Surge/i, STEAL));

  await reset(false);
  live.journeys.operations = [];
  live.journeys.operations.push(await turn("Demand Surge"));
  live.journeys.operations.push(await turn("explain it"));
  live.checks.push(check("explain-it", live.journeys.operations.at(-1).reply, /Demand Surge/i, STEAL));
  live.journeys.operations.push(await turn("how sure are you?"));
  live.checks.push(check("how-sure", live.journeys.operations.at(-1).reply, /Demand Surge|sure|uncertain|projection/i, STEAL));
  live.journeys.operations.push(await turn("what impact could it have?"));
  live.checks.push(check("impact", live.journeys.operations.at(-1).reply, /Demand Surge|impact|affect|projection/i, STEAL));

  await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
  live.pageErrors = errors.length;
  live.passed = live.checks.every((item) => item.pass) && errors.length === 0;
  await writeFile(join(out, "live-audit.json"), JSON.stringify(live, null, 2));
  await browser.close();
  if (started.child) started.child.kill("SIGTERM");
  if (!live.passed) {
    console.error(JSON.stringify(live.checks, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ passed: true, pageErrors: errors.length, checks: live.checks.map((item) => item.id) }, null, 2));
} catch (error) {
  if (started.child) started.child.kill("SIGTERM");
  throw error;
}
