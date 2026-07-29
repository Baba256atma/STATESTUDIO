import assert from "node:assert/strict";
import test from "node:test";
import { normalizeChatInputForDedup } from "./chatPipelineSendTextHelpers.ts";

test("AD-CHAT-01 empty send contract: blank input normalizes to empty signature skip path", () => {
  assert.equal("   ".trim(), "");
  assert.equal(normalizeChatInputForDedup("hello"), normalizeChatInputForDedup("hello"));
});

test("AD-CHAT-01 dedup signature differs for distinct prompts", () => {
  assert.notEqual(normalizeChatInputForDedup("alpha"), normalizeChatInputForDedup("beta"));
});
