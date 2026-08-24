/**
 * Shared real-/executive Chat helpers for FINAL:3 / 3R browser certification.
 */
export const DATABASE_STYLE =
  /tracked business object|current executive context|recorded status|recorded relationship|Evidence:|Recommended next:|\bNext: |Nexora knows /i;

export const FINAL3_REFERENCE = "NEX-MVP-FINAL:3/natural-reference-v1";
export const FINAL3_EXPLAIN = "NEX-MVP-FINAL:3/executive-explain-v1";
export const EXECUTIVE_EXISTING_URL = "http://localhost:3000/executive";
export const EXECUTIVE_CERT_URL =
  "http://localhost:3000/executive?entrance=1&reset=1";

export function assertCanonicalFocus(turn, expectedId, label) {
  if (turn.focused !== expectedId) {
    throw new Error(
      `${label}: expected focused ${expectedId}, got ${turn.focused}. Reply: ${turn.last}`,
    );
  }
  if (/couldn.t find/i.test(turn.last)) {
    throw new Error(`${label}: not-found reply: ${turn.last}`);
  }
}

export async function readRuntimeIdentity(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      authority: shell?.getAttribute("data-nexora-conversation-authority") ?? "",
      reference: shell?.getAttribute("data-nexora-final3-reference") ?? "",
      explain: shell?.getAttribute("data-nexora-final3-explain") ?? "",
      mode: shell?.getAttribute("data-nex-exp1-mode") ?? "",
    };
  });
}

export function assertFinal3Client(identity) {
  if (identity.authority !== "executeNexoraConversationalExperience") {
    throw new Error(`Missing conversation authority: ${JSON.stringify(identity)}`);
  }
  if (identity.reference !== FINAL3_REFERENCE || identity.explain !== FINAL3_EXPLAIN) {
    throw new Error(
      `Stale or alternate FINAL:3 client. identity=${JSON.stringify(identity)}`,
    );
  }
}

export async function openExecutivePage(page, url) {
  page.setDefaultTimeout(45000);
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
  await page.waitForTimeout(800);
  const identity = await readRuntimeIdentity(page);
  assertFinal3Client(identity);
  return { http: response?.status() ?? 0, identity };
}

export async function completeFirstTimeIdentity(page) {
  await askExecutiveChat(page, "My name is Alex.");
  return askExecutiveChat(page, "I manage a manufacturing company.");
}

export async function openExecutiveChat(page) {
  return openExecutivePage(page, EXECUTIVE_EXISTING_URL);
}

export async function askExecutiveChat(page, utterance) {
  const field = page.locator('[data-testid="nexora-conversational-input-field"]');
  await field.fill(utterance);
  await field.press("Enter");
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent?.length > 8,
  );
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
      authority: shell?.getAttribute("data-nexora-conversation-authority") ?? "",
      reference: shell?.getAttribute("data-nexora-final3-reference") ?? "",
      explain: shell?.getAttribute("data-nexora-final3-explain") ?? "",
      last:
        [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
          .at(-1)?.textContent ?? "",
    };
  });
}
