const { spawnSync } = require("node:child_process");

function login() {
  // Explicit account credentials take precedence over the managed session.
  if (process.env.EXPO_TOKEN) {
    console.log("Using the explicitly configured Expo account.");
    return;
  }

  const current = spawnSync("npx", ["--no-install", "expo", "whoami"], {
    stdio: ["ignore", "pipe", "ignore"],
    encoding: "utf8",
    timeout: 30000,
    env: { ...process.env, FORCE_COLOR: "0" },
  });
  const account = (current.stdout || "").trim();
  if (
    current.status === 0 &&
    account &&
    !account.startsWith("replit-private-")
  ) {
    console.log("Preserving your existing Expo CLI login.");
    return;
  }
  if (current.status !== 0 && account !== "Not logged in") {
    console.warn(
      "Could not verify the Expo account; leaving existing credentials unchanged.",
    );
    return;
  }

  if (!process.env.REPLIT_EXPO_SESSION_SECRET) {
    console.warn(
      "Expo development session is unavailable; iOS preview may require sign-in.",
    );
    return;
  }

  // Never print the session or child output; authentication is best-effort.
  const result = spawnSync(
    "npx",
    [
      "--no-install",
      "create-launch",
      "login",
      "--session",
      process.env.REPLIT_EXPO_SESSION_SECRET,
    ],
    { stdio: "ignore", timeout: 30000 },
  );
  if (result.status === 0) {
    console.log("Expo development authentication completed.");
  } else {
    console.warn(
      "Expo development authentication failed; iOS preview may require sign-in.",
    );
  }
}

login();
