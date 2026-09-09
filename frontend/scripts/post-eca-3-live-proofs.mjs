/**
 * NPA-T POST-ECA:3 live /executive proofs. Isolated verified port.
 * Uses the actual Data Library. Does not start ECA:13 or POST-ECA:4.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/post-eca/POST-ECA-3");
const GENERIC = /couldn't find a clear match/i;
const OUTCOME = /which business outcome/i;
const PRODUCT = /executive decision workspace/i;

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

  const empty = await turn("do you have any file like CSV ?");
  await startCsv();
  await page.getByTestId("nexora-csv-file-input").setInputFiles("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
  await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 15000 });
  const pendingExplain = await turn("explain all CSV files you have");
  const pendingNamed = await turn("Explain data-ux3-ambiguous.csv.");
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

  const explainAll = await turn("explain all CSV files you have");
  const dataConcept = await turn("explian Data ?");
  const dataSource = await turn("explain Data source ?");
  const availability = await turn("do you have any file like CSV ?");
  const listed = await turn("What CSV files do you have?");
  const follow = await turn("Explain the second one.");
  const stage = await turn("what is on the stage?");
  const csvAfterStage = await turn("explain all CSV files you have.");
  await turn("Focus on Risk.");
  const need = await turn("What do you need to investigate Margin Pressure?");
  const have = await turn("Do we already have that data?");
  const nexoraHave = await turn("What Data does Nexora have?");

  await page.screenshot({ path: join(out, "live-proofs.png") });
  await browser.close();

  const runtime1 = pass(!GENERIC.test(explainAll.reply ?? "") && /csv|capacity\.csv|data-ux3/i.test(explainAll.reply ?? ""), explainAll);
  const runtime2 = pass(!GENERIC.test(dataConcept.reply ?? "") && !GENERIC.test(dataSource.reply ?? "") && /Data is where Nexora keeps/i.test(dataConcept.reply ?? "") && /Data Source is where Nexora receives/i.test(dataSource.reply ?? ""), { dataConcept, dataSource });
  const runtime3 = pass(!OUTCOME.test(availability.reply ?? "") && /csv/i.test(availability.reply ?? ""), { empty, availability });
  const runtime4 = pass(/under review|pending|not accepted/i.test(pendingNamed.reply ?? "") && /capacity\.csv|csv/i.test(explainAll.reply ?? ""), { pendingExplain, pendingNamed, explainAll });
  const runtime5 = pass(/csv/i.test(listed.reply ?? "") && !GENERIC.test(follow.reply ?? ""), { listed, follow });
  const runtime6 = pass(!OUTCOME.test(have.reply ?? "") && !GENERIC.test(have.reply ?? ""), { need, have });
  const runtime7 = pass(!GENERIC.test(csvAfterStage.reply ?? "") && /csv/i.test(csvAfterStage.reply ?? "") && Boolean(stage.reply) && !PRODUCT.test(nexoraHave.reply ?? ""), { stage, csvAfterStage, nexoraHave });

  const report = {
    identity: "NPA-T POST-ECA:3/LiveDataLibraryConversation",
    url,
    isolatedPort: started.port,
    errors,
    runtimes: {
      runtime1: { name: "explain all CSV files", ...runtime1 },
      runtime2: { name: "explain Data / Data Source", ...runtime2 },
      runtime3: { name: "do you have any CSV", ...runtime3 },
      runtime4: { name: "pending vs active source", ...runtime4 },
      runtime5: { name: "specific source follow-up", ...runtime5 },
      runtime6: { name: "ECA:4 existing-data bridge", ...runtime6 },
      runtime7: { name: "Stage/Data context switching", ...runtime7 },
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
