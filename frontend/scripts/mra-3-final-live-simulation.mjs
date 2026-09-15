/**
 * MRA:3-FINAL live /executive simulation. Validation only.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/mra/MRA-3-FINAL");

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
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
      dataRoute: shell?.getAttribute("data-advisor-data-route") ?? "none",
      stageMode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      canonicalApproved: shell?.getAttribute("data-canonical-approved-decision-count") ?? "none",
      canonicalExecutions: shell?.getAttribute("data-canonical-execution-count") ?? "none",
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

async function importReadyCsv(page) {
  if (!(await page.getByTestId("nexora-rdi2-data-explorer").count())) {
    await clickTestId(page, "nexora-stage-data-control");
  }
  await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "visible", timeout: 15000 });
  await clickTestId(page, "nexora-rdi2-add-data");
  await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
  await page.locator('[data-testid="nexora-rdi4-source-choice"] button').first().evaluate((node) => node instanceof HTMLElement && node.click());
  await page.getByTestId("nexora-csv-file-input").setInputFiles("test-fixtures/data-ux5-fix2/capacity.csv");
  await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 20000 });
  const use = page.getByTestId("nexora-csv-use-this-data");
  if (await use.count()) {
    await use.click();
    await page.waitForTimeout(800);
  }
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

  async function turn(utterance) {
    const chat = await askExecutiveChat(page, utterance);
    return { managerTurn: utterance, reply: chat.last, ...(await readShell(page)) };
  }

  const live = { identity: "NPA-T MRA:3-FINAL/LiveManagerSimulation", url, errors, journeys: {} };

  live.journeys.orientation = [];
  for (const utterance of [
    "hi, I'm Sam. I run operations here.",
    "whats on stage",
    "show me problems",
    "what can you help me with",
  ]) {
    live.journeys.orientation.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.investigation = [];
  for (const utterance of [
    "What are the main problems?",
    "look at capcity",
    "explain it",
    "go back to the first problem",
    "explain it",
  ]) {
    live.journeys.investigation.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.crossDomain = { import: null, turns: [] };
  try {
    await importReadyCsv(page);
    live.journeys.crossDomain.import = "ok";
  } catch (error) {
    live.journeys.crossDomain.import = String(error);
  }
  for (const utterance of [
    "show me scenarios",
    "is there any CSV files?",
    "explain it",
    "Capacity Gap",
    "explain it",
    "Demand Surge",
    "tell me more about it",
    "look at Capacity",
    "what's going on with that?",
    "what can Nexora do?",
    "explain it",
  ]) {
    live.journeys.crossDomain.turns.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.data = { import: null, turns: [] };
  try {
    await importReadyCsv(page);
    live.journeys.data.import = "ok";
  } catch (error) {
    live.journeys.data.import = String(error);
  }
  for (const utterance of [
    "Do you have any CSV files?",
    "Explain it.",
    "Can this data support the Capacity Gap?",
    "Does it prove Capacity Gap caused the delivery problem?",
  ]) {
    live.journeys.data.turns.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.decisionExecution = [];
  for (const utterance of [
    "show me scenarios",
    "compare them",
    "which one is more important?",
    "risk exposure",
    "I prefer Demand Surge",
    "Approve Demand Surge",
    "start it",
    "Did it start?",
    "Did our Decision cause this improvement?",
  ]) {
    live.journeys.decisionExecution.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.mutation = [];
  for (const utterance of [
    "Add this as a Risk.",
    "show me problems",
    "yes",
    "delete Margin Pressure",
    "no",
  ]) {
    live.journeys.mutation.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.nav = [];
  live.journeys.nav.push(await turn("show me problems"));
  const row = page.getByTestId("nexora-executive-queue-row-problem");
  if (await row.count()) await row.click();
  await page.waitForTimeout(400);
  live.journeys.nav.push({ managerTurn: "(queue Problems collection)", reply: null, ...(await readShell(page)) });
  const back = page.getByTestId("nexora-stage-step-back");
  if (await back.count()) await back.click();
  await page.waitForTimeout(400);
  live.journeys.nav.push({ managerTurn: "(Stage Back)", reply: null, ...(await readShell(page)) });
  await clickTestId(page, "nexora-workspace-option-overview");
  await page.waitForTimeout(400);
  live.journeys.nav.push({ managerTurn: "(Overview dial)", reply: null, ...(await readShell(page)) });
  live.journeys.nav.push(await turn("whats on stage"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
  await page.waitForTimeout(800);
  live.journeys.nav.push(await turn("what problems do we have"));

  await page.screenshot({ path: join(out, "live-proofs.png") });
  await browser.close();
  live.zeroPageErrors = errors.length === 0;
  await writeFile(join(out, "live-audit.json"), JSON.stringify(live, null, 2));
  console.log(JSON.stringify({
    identity: live.identity,
    url,
    errorCount: errors.length,
    import: live.journeys.crossDomain.import,
    out: join(out, "live-audit.json"),
  }, null, 2));
} finally {
  if (started.child) started.child.kill("SIGTERM");
}
