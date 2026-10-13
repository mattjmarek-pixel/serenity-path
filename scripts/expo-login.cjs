const { spawnSync } = require("node:child_process");

// Never print the session or child output; authentication is best-effort.
if (process.env.REPLIT_EXPO_SESSION_SECRET) {
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
} else {
  console.warn(
    "Expo development session is unavailable; iOS preview may require sign-in.",
  );
}
