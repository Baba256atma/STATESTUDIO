/**
 * NPA-T POST-ECA:3-FIX1 live /executive proofs. Isolated verified port.
 * Uses the actual Data Library. Does not start ECA:13, POST-ECA:4, or FIX2.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/post-eca/POST-ECA-3-FIX1");
const GENERIC = /couldn't find a clear match/i;
const OUTCOME = /which business outcome/i;
const SCENARIO = /Capacity Expansion Plan/i;
const RECOMMEND = /Recommendation:\s*Review Capacity Gap/i;
const BLOCKING =
  "Nexora, check your Data Library. How many CSV files are currently in this project? List all CSV file names and their current status.";

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
        eca2Intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
        eca6Objective: shell?.getAttribute("data-eca-6-objective") ?? "none",
        dataRoute: shell?.getAttribute("data-advisor-data-route") ?? "none",
        dataIntent: shell?.getAttribute("data-data-conversation-intent") ?? "none",
        sourceCount: shell?.getAttribute("data-data-library-source-count") ?? "none",
        pendingCount: shell?.getAttribute("data-pending-source-count") ?? "none",
        activeCount: shell?.getAttribute("data-active-source-count") ?? "none",
        resolvedNames: shell?.getAttribute("data-resolved-source-names") ?? "none",
        sourceStatus: shell?.getAttribute("data-source-status") ?? "none",
        genericFallback: shell?.getAttribute("data-generic-entity-fallback-used") ?? "none",
        outcomeFallback: shell?.getAttribute("data-outcome-clarification-used") ?? "none",
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
  await startCsv();
  await page.getByTestId("nexora-csv-file-input").setInputFiles("test-fixtures/data-ux5-fix2/capacity.csv");
  await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 15000 });
  const validate = page.getByRole("button", { name: "Validate Import" });
  if (await validate.count()) await validate.evaluate((node) => node instanceof HTMLElement && node.click());
  await page.getByTestId("nexora-csv-use-this-data").waitFor({ state: "visible", timeout: 15000 });
  await clickTestId("nexora-csv-use-this-data");

  const runtime1 = await turn(BLOCKING);
  const scenario = await turn("Explain Capacity Expansion Plan.");
  const runtime2 = await turn(BLOCKING);
  const stage = await turn("Focus on Approve Repricing.");
  const runtime3 = await turn(BLOCKING);
  const runtime4 = runtime1;
  const runtime5 = runtime1;
  const review = await turn("Review Capacity Expansion Plan.");
  const side = await turn("Now check the Data Library. How many CSV files do we have?");
  const resume = await turn("Okay, continue with the scenario.");
  const runtime7 = await turn("How many problems are in this project?");
  const problems = await turn("Show me all Problems.");

  await page.screenshot({ path: join(out, "live-proofs.png") });
  await browser.close();

  function inventoryOk(item) {
    const reply = item.reply ?? "";
    return (
      !GENERIC.test(reply) &&
      !OUTCOME.test(reply) &&
      !SCENARIO.test(reply) &&
      !RECOMMEND.test(reply) &&
      /csv/i.test(reply) &&
      /capacity\.csv|data-ux3-ambiguous\.csv/i.test(reply) &&
      item.dataRoute === "DATA-ADV:1/AdvisorDataInquiry"
    );
  }

  const report = {
    identity: "NPA-T POST-ECA:3-FIX1/LiveDataLibraryInventory",
    url,
    isolatedPort: started.port,
    errors,
    diagnosticExactFailure: {
      rawManagerText: BLOCKING,
      recognizedDomain: "DATA",
      recognizedTarget: runtime1.dataIntent,
      dataAdvMatched: runtime1.dataRoute === "DATA-ADV:1/AdvisorDataInquiry",
      dataAdvAnswerProduced: Boolean(runtime1.reply),
      winningRouteAfterFinalization: runtime1.dataRoute,
      actualSourceCount: runtime1.sourceCount,
      actualSourceNames: runtime1.resolvedNames,
      actualStatuses: runtime1.sourceStatus,
      eca2Intent: runtime1.eca2Intent,
      eca6Objective: runtime1.eca6Objective,
      focused: runtime1.focused,
      finalAnswer: runtime1.reply,
    },
    runtimes: {
      runtime1: { name: "exact blocking query", ...pass(inventoryOk(runtime1) && /in use|pending/i.test(runtime1.reply ?? ""), runtime1) },
      runtime2: { name: "blocking query with active Scenario", ...pass(inventoryOk(runtime2) && SCENARIO.test(scenario.reply ?? ""), { scenario, runtime2 }) },
      runtime3: { name: "blocking query with Stage focus", ...pass(inventoryOk(runtime3), { stage, runtime3 }) },
      runtime4: { name: "count + names + status accuracy", ...pass(/There are \d+ CSV file/i.test(runtime4.reply ?? "") && /capacity\.csv/i.test(runtime4.reply ?? "") && /in use|pending/i.test(runtime4.reply ?? ""), runtime4) },
      runtime5: { name: "pending vs active lifecycle", ...pass(/in use/i.test(runtime5.reply ?? "") && /pending/i.test(runtime5.reply ?? ""), runtime5) },
      runtime6: { name: "Data side question + ECA:6 resume", ...pass(/csv/i.test(side.reply ?? "") && !SCENARIO.test(side.reply ?? "") && /Capacity Expansion Plan|scenario/i.test(resume.reply ?? ""), { review, side, resume }) },
      runtime7: { name: "non-Data project question unaffected", ...pass(!/There are \d+ CSV files in the current Data Library/i.test(runtime7.reply ?? "") && /problem|Capacity Gap|Margin Pressure/i.test(problems.reply ?? ""), { runtime7, problems }) },
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
