/**
 * MRA:3 live /executive journeys. Validation only.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), process.env.MRA_ARTIFACT_DIR ?? "artifacts/mra/MRA-3");

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
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      nextAction: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      authority: shell?.getAttribute("data-eca-2-authority") ?? "none",
      dataRoute: shell?.getAttribute("data-advisor-data-route") ?? "none",
      stageMode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      decisionCount: document.querySelector("[data-stage-thread-decision-count]")?.getAttribute("data-stage-thread-decision-count") ?? "none",
      executionCount: document.querySelector("[data-stage-thread-decision-count]")?.getAttribute("data-stage-thread-execution-count") ?? "none",
      canonicalApproved: shell?.getAttribute("data-canonical-approved-decision-count") ?? "none",
      canonicalExecutions: shell?.getAttribute("data-canonical-execution-count") ?? "none",
      eca8: shell?.getAttribute("data-eca-8-state") ?? "none",
      eca8Writes: shell?.getAttribute("data-eca-8-writes") ?? "none",
      eca9: shell?.getAttribute("data-eca-9-readiness") ?? "none",
      eca10: shell?.getAttribute("data-eca-10-live") ?? "none",
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

  const live = { identity: "NPA-T MRA:3/LiveManagerSimulation", url, errors, journeys: {} };

  live.journeys.C_orientation = [];
  for (const utterance of [
    "I'm Sam. I own this business.",
    "what's going on",
    "show me problems",
    "whats on stage",
    "no I mean the problems we actually have",
  ]) {
    live.journeys.C_orientation.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.A_investigation = [];
  for (const utterance of [
    "What are the main problems?",
    "look at capcity",
    "why is that happening?",
    "now margin",
    "go back to the first problem",
    "explain it",
  ]) {
    live.journeys.A_investigation.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.B_data = { import: null, turns: [] };
  try {
    await importReadyCsv(page);
    live.journeys.B_data.import = "ok";
  } catch (error) {
    live.journeys.B_data.import = String(error);
  }
  for (const utterance of [
    "What CSV do you have?",
    "Explain the CSV file you currently have and tell me what you understand from it.",
    "tell me about my data",
    "Can this CSV support Capacity Gap?",
    "does that prove it caused the problem?",
  ]) {
    live.journeys.B_data.turns.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.decisionExecution = [];
  for (const utterance of [
    "show scenarios",
    "Compare them.",
    "I prefer Demand Surge.",
    "Approve Demand Surge",
    "start it",
    "Are we still on track?",
    "Did our decision cause the improvement?",
  ]) {
    live.journeys.decisionExecution.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.mutation = [];
  for (const utterance of [
    "Add Supplier Delay as a Risk.",
    "no",
    "delete Margin Pressure",
    "no",
  ]) {
    live.journeys.mutation.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.nav = [];
  live.journeys.nav.push(await turn("show me problems"));
  live.journeys.nav.push({ action: "queue-problems", ...(await (async () => {
    const row = page.getByTestId("nexora-executive-queue-row-problem");
    if (await row.count()) await row.click();
    await page.waitForTimeout(400);
    return { managerTurn: "(queue Problems collection)", reply: null, ...(await readShell(page)) };
  })()) });
  live.journeys.nav.push({ action: "stage-back", ...(await (async () => {
    const back = page.getByTestId("nexora-stage-step-back");
    if (await back.count()) await back.click();
    await page.waitForTimeout(400);
    return { managerTurn: "(Stage Back)", reply: null, ...(await readShell(page)) };
  })()) });
  live.journeys.nav.push({ action: "stage-forward", ...(await (async () => {
    const fwd = page.getByTestId("nexora-stage-step-forward");
    if (await fwd.count()) await fwd.click();
    await page.waitForTimeout(400);
    return { managerTurn: "(Stage Forward)", reply: null, ...(await readShell(page)) };
  })()) });
  live.journeys.nav.push(await turn("whats on stage"));
  live.journeys.nav.push({ action: "overview", ...(await (async () => {
    await clickTestId(page, "nexora-workspace-option-overview");
    await page.waitForTimeout(400);
    return { managerTurn: "(Overview)", reply: null, ...(await readShell(page)) };
  })()) });
  live.journeys.nav.push(await turn("whats on stage"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
  await page.waitForTimeout(800);
  live.journeys.nav.push(await turn("what problems do we have"));

  await page.screenshot({ path: join(out, "live-proofs.png") });
  await browser.close();
  live.zeroPageErrors = errors.length === 0;
  await writeFile(join(out, "live-audit.json"), JSON.stringify(live, null, 2));
  console.log(JSON.stringify({ identity: live.identity, url, errorCount: errors.length, import: live.journeys.B_data.import, out: join(out, "live-audit.json") }, null, 2));
} finally {
  if (started.child) started.child.kill("SIGTERM");
}
