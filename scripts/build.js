const chalk = require("chalk");
const fs = require("fs-extra");
const childProcess = require("child_process");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.prod.js");

function spawn(command, params, errorMessage) {
  const isWindows = process.platform === "win32"; /* spawn with {shell: true} can solve .cmd resolving, but prettier doesn't run correctly on mac/linux */
  const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, params, { stdio: "inherit" });
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(chalk`{red.bold ${errorMessage}}`);
    console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${params.join(" ")}`);
    process.exit(1);
  }
}

function execute() {
  /* clear console */
  process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
  console.info(chalk`{green.bold [task]} {white.bold check code style}`);
  spawn("prettier", ["--config", "prettier.config.js", "--list-different", `**/*.{ts,tsx,less,saas}`], "check code style failed, please format above files");

  console.info(chalk`{green.bold [task]} {white.bold cleanup [dist]}`);
  fs.emptyDirSync("dist");

  console.info(chalk`{green.bold [task]} {white.bold webpack}`);
  const compiler = webpack(webpackConfig);
  compiler.run((error, stats) => {
    if (error) {
      console.error(error.stack || error);
      if (error.details) console.error(error.details);
      process.exit(1);
    } else {
      const statsJSON = stats.toJson();

      if (statsJSON.errors.length || statsJSON.warnings.length) {
        console.info(statsJSON);
        process.exit(1);
      }

      console.info(chalk`{white.bold Build successfully}`);
    }
  });
}

execute();
