/**
 * MRA:3 independent recertification — live /executive. Validation only.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/mra/MRA-3-FINAL-RECERT");
const LEAK =
  /\b(?:NCA(?::|-)|NXA(?::|-)|ECA(?::|-)|CC:\d|DTH|POST:\d|DATA-ADV|canonicalWriter|INSUFFICIENT_REALITY)\b/i;
const EXPANSION = /Capacity Expansion Plan explores/i;

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
  return { id, pass, expected: String(expected), anti: anti ? String(anti) : null, actual: text.slice(0, 280) };
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
    const row = { managerTurn: utterance, reply: chat.last, leak: LEAK.test(chat.last ?? ""), ...(await readShell(page)) };
    return row;
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

  const live = { identity: "NPA-T MRA:3-RECERT/LiveManagerSimulation", url, errors, checks: [], journeys: {} };

  await reset(false);
  live.journeys.orientation = [];
  for (const utterance of ["Hi.", "What's going on?", "What's on Stage?", "Show me the problems.", "Which one should I look at first?"]) {
    live.journeys.orientation.push(await turn(utterance));
  }

  await reset(true);
  live.journeys.historicalS1 = [];
  live.journeys.historicalS1.push(await turn("show me scenarios"));
  live.journeys.historicalS1.push(await turn("is there any CSV files?"));
  live.journeys.historicalS1.push(await turn("Capacity Gap"));
  const revenue = page.locator('[data-testid="nexora-stage-object-control-obj-revenue"]');
  if (await revenue.count()) {
    await revenue.evaluate((node) => node instanceof HTMLElement && node.click());
    await page.waitForTimeout(400);
    live.journeys.historicalS1.push({ managerTurn: "(click Revenue)", reply: null, ...(await readShell(page)) });
  }
  live.journeys.historicalS1.push(await turn("look at Capacity Gap"));
  live.journeys.historicalS1.push(await turn("explain it"));
  live.checks.push(check(
    "S1-HIST-problem",
    live.journeys.historicalS1.at(-1).reply,
    /Capacity Gap/i,
    EXPANSION,
  ));
  live.journeys.historicalS1.push(await turn("Demand Surge"));
  live.journeys.historicalS1.push(await turn("explain it"));
  live.checks.push(check(
    "S1-HIST-scenario",
    live.journeys.historicalS1.at(-1).reply,
    /Demand Surge/i,
    /^Capacity Gap/i,
  ));

  await reset(true);
  live.journeys.crossDomain = [];
  live.journeys.crossDomain.push(await turn("show me scenarios"));
  live.journeys.crossDomain.push(await turn("is there any CSV files?"));
  live.journeys.crossDomain.push(await turn("explain it"));
  live.checks.push(check("A-csv", live.journeys.crossDomain.at(-1).reply, /csv/i, EXPANSION));
  live.journeys.crossDomain.push(await turn("Capacity Gap"));
  live.journeys.crossDomain.push(await turn("explain it"));
  live.checks.push(check("B-problem", live.journeys.crossDomain.at(-1).reply, /Capacity Gap/i, EXPANSION));
  live.journeys.crossDomain.push(await turn("Demand Surge"));
  live.journeys.crossDomain.push(await turn("tell me more about it"));
  live.checks.push(check("C-surge", live.journeys.crossDomain.at(-1).reply, /Demand Surge/i, /^Capacity Gap/i));
  live.journeys.crossDomain.push(await turn("look at Capacity"));
  live.journeys.crossDomain.push(await turn("what's going on with that?"));
  live.checks.push(check("D-kpi", live.journeys.crossDomain.at(-1).reply, /Capacity/i, EXPANSION));
  live.journeys.crossDomain.push(await turn("Expand Capacity"));
  live.journeys.crossDomain.push(await turn("Capacity Expansion"));
  live.journeys.crossDomain.push(await turn("explain it"));
  live.checks.push(check("E-execution", live.journeys.crossDomain.at(-1).reply, /Capacity Expansion/i, null));
  live.journeys.crossDomain.push(await turn("what can Nexora do?"));
  live.journeys.crossDomain.push(await turn("explain it"));
  live.checks.push(check(
    "F-clarify",
    live.journeys.crossDomain.at(-1).reply,
    /which|do you mean|what do you mean|clarify|more than one/i,
    null,
  ));

  await reset(false);
  live.journeys.typo = [];
  live.journeys.typo.push(await turn("look at capcity"));
  live.checks.push(check("typo-capacity", live.journeys.typo.at(-1).reply, /Capacity Gap|Capacity/i, /couldn.t find/i));
  live.journeys.typo.push(await turn("explain it"));

  await reset(true);
  live.journeys.data = [];
  for (const utterance of [
    "Do you have any CSV files?",
    "Explain it.",
    "What do you understand from this file?",
    "What fields do you understand?",
    "Can this data tell us anything about Capacity Gap?",
    "Does this prove Capacity Gap caused the problem?",
    "Capacity Gap",
    "explain it",
    "show me scenarios",
    "is there any CSV files?",
  ]) {
    live.journeys.data.push(await turn(utterance));
  }

  await reset(false);
  live.journeys.investigation = [];
  for (const utterance of [
    "Show me the problems.",
    "Look at Capacity Gap.",
    "Explain it.",
    "Why is this happening?",
    "What do we actually know?",
    "What are you assuming?",
    "What evidence do we have?",
    "What don’t we know?",
    "What should I investigate next?",
  ]) {
    live.journeys.investigation.push(await turn(utterance));
  }

  await reset(false);
  live.journeys.scenario = [];
  for (const utterance of [
    "Show me the scenarios.",
    "Explain Demand Surge.",
    "How sure are you?",
    "explain the second one",
    "which one is more important?",
    "risk exposure",
    "What do you recommend?",
    "Why?",
    "is that a decision already",
  ]) {
    live.journeys.scenario.push(await turn(utterance));
  }

  await reset(false);
  live.journeys.decisionExecution = [];
  for (const utterance of [
    "show me scenarios",
    "compare them",
    "I prefer Demand Surge",
    "Approve Demand Surge",
    "is that approved?",
    "What happens next?",
    "Are we ready?",
    "Start it.",
    "Did it start?",
    "What’s its status?",
    "Who owns it?",
    "What is blocking it?",
    "Did our decision cause the improvement?",
  ]) {
    live.journeys.decisionExecution.push(await turn(utterance));
  }

  await reset(false);
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

  await reset(true);
  live.journeys.longSession = [];
  const longUtterances = [
    "hey, walk me through today",
    "whats going on",
    "whats on stage",
    "show me problems",
    "look at capcity",
    "why is that happening",
    "what do we actually know",
    "show me scenarios",
    "is there any CSV files?",
    "explain it",
    "ok Capacity Gap",
    "explain it",
    "Demand Surge",
    "tell me more about it",
    "how sure are you",
    "look at Capacity",
    "what's going on with that?",
    "Risk",
    "explain it",
    "no I meant Capacity Gap",
    "explain it",
    "the second scenario",
    "That's not what I meant.",
    "Forget that request.",
    "Go back to the problem.",
    "what should I do",
    "compare the scenarios",
    "which one is more important",
    "I prefer Demand Surge",
    "is that already a decision",
    "Approve Demand Surge",
    "what happens next",
    "start it",
    "did it start",
    "who owns it",
    "Add this as a Risk.",
    "actually show me problems",
    "yes",
    "delete Margin Pressure",
    "no cancel that",
    "we're delayed a week",
    "did the decision cause better delivery",
    "thanks",
    "go back to the first problem",
    "explain it",
    "show me scenarios",
    "what is this",
    "Pricing Response",
    "explain it",
    "Approve Repricing",
    "explain it",
    "Pricing Rollout",
    "explain it",
    "whats on stage",
    "hi still here, anything urgent",
  ];
  for (const utterance of longUtterances) {
    live.journeys.longSession.push(await turn(utterance));
  }
  live.longSessionTurns = longUtterances.length;

  await reset(false);
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

  const leaks = Object.values(live.journeys).flat().filter((row) => row?.leak);
  live.leakCount = leaks.length;
  live.failedChecks = live.checks.filter((item) => !item.pass);
  live.zeroPageErrors = errors.length === 0;

  await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
  await browser.close();
  await writeFile(join(out, "live-audit.json"), JSON.stringify(live, null, 2));
  console.log(JSON.stringify({
    identity: live.identity,
    url,
    errorCount: errors.length,
    longSessionTurns: live.longSessionTurns,
    checks: live.checks.map((item) => ({ id: item.id, pass: item.pass })),
    failedChecks: live.failedChecks.map((item) => item.id),
    leakCount: live.leakCount,
    out: join(out, "live-audit.json"),
  }, null, 2));
  if (!live.zeroPageErrors) throw new Error(`page errors: ${errors.join(" | ")}`);
} finally {
  if (started.child) started.child.kill("SIGTERM");
}
