const { spawnSync } = require("child_process");

const isWin = process.platform === "win32";
const npxCmd = isWin ? "npx.cmd" : "npx";
const npmCmd = isWin ? "npm.cmd" : "npm";

// tag expression comes from npm script argument
const tagExpression = process.argv[2];

if (!tagExpression) {
  console.error("No Cucumber tag expression provided.");
  process.exit(1);
}

console.log(`Running cucumber with tags: ${tagExpression}`);

const cucumber = spawnSync(
  npxCmd,
  ["cucumber-js", "--tags", tagExpression],
  { stdio: "inherit", env: process.env }
);

console.log("Running posttest (report generation)...");
spawnSync(
  npmCmd,
  ["run", "posttest"],
  { stdio: "inherit", env: process.env }
);

// keep cucumber exit code
process.exit(cucumber.status ?? 1);
