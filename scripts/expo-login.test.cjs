const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { runInNewContext } = require("node:vm");

const source = readFileSync(join(__dirname, "expo-login.cjs"), "utf8");

function run(env, whoami, loginStatus = 0) {
  const calls = [];
  const logs = [];
  runInNewContext(source, {
    require: () => ({
      spawnSync: (command, args, options) => {
        calls.push({ command, args, options });
        return args.includes("whoami") ? whoami : { status: loginStatus };
      },
    }),
    process: { env },
    console: {
      log: (message) => logs.push(message),
      warn: (message) => logs.push(message),
    },
  });
  assert(!logs.join("\n").includes("test-session"));
  return { calls, logs };
}

test("preserves a personal Expo CLI login", () => {
  const { calls } = run(
    { REPLIT_EXPO_SESSION_SECRET: "test-session" },
    { status: 0, stdout: "personal-account\n" },
  );
  assert.equal(calls.length, 1);
});

test("explicit Expo token takes precedence", () => {
  const { calls } = run({ EXPO_TOKEN: "test-token" });
  assert.equal(calls.length, 0);
});

test("refreshes managed login without exposing session output", () => {
  const { calls } = run(
    { REPLIT_EXPO_SESSION_SECRET: "test-session" },
    { status: 0, stdout: "replit-private-test\n" },
  );
  assert.equal(calls.length, 2);
  assert(calls[1].args.includes("create-launch"));
  assert.equal(calls[1].options.stdio, "ignore");
  assert.equal(calls[1].options.timeout, 30000);
});

test("logs in when no account is present", () => {
  const { calls } = run(
    { REPLIT_EXPO_SESSION_SECRET: "test-session" },
    { status: 1, stdout: "Not logged in\n" },
  );
  assert.equal(calls.length, 2);
});

test("does not replace credentials after a network error or timeout", () => {
  for (const status of [1, null]) {
    const { calls } = run(
      { REPLIT_EXPO_SESSION_SECRET: "test-session" },
      { status, stdout: "" },
    );
    assert.equal(calls.length, 1);
  }
});

test("missing session and failed managed login do not abort startup", () => {
  assert.equal(
    run({}, { status: 1, stdout: "Not logged in\n" }).calls.length,
    1,
  );
  for (const status of [1, null]) {
    const { logs } = run(
      { REPLIT_EXPO_SESSION_SECRET: "test-session" },
      { status: 0, stdout: "replit-private-test\n" },
      status,
    );
    assert(logs.some((message) => message.includes("failed")));
  }
});
