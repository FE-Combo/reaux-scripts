const chalk = require("chalk");
const fs = require("fs-extra");
const webpack = require("webpack");
const webpackConfig = require("../config/webpack.config.prod.js");
const { appPublic, appDist, appHtml } = require("../config/paths");
const { spawnSync } = require("node-wiz");

const sourceDir = process.env.SOURCE_DIR || "src";

function execute() {
  /* clear console */
  process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
  console.info(chalk`{green.bold [task]} {white.bold check code style}`);
  spawnSync("prettier", ["--config", "prettier.config.js", "--list-different", `${sourceDir}/**/*.{ts,tsx,js,jsx,less,saas}`], "check code style failed, please format above files");

  console.info(chalk`{green.bold [task]} {white.bold cleanup [dist]}`);
  fs.emptyDirSync("dist");

  console.info(chalk`{green.bold [task]} {white.bold webpack}`);
  const compiler = webpack(webpackConfig);
  compiler.run((error, stats) => {
    if (error) {
      console.error(error.stack || error);
      if (error.details) {
        console.error(error.details);
      }
      process.exit(1);
    } else {
      const statsString = stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true, // Shows colors in the console
      });

      if (stats.hasErrors() || stats.hasWarnings()) {
        console.error(statsString);
        process.exit(1);
      }

      console.info(chalk`{white.bold Build successfully}`);
    }
  });
}

function copyPublicFolder() {
  fs.copySync(appPublic, appDist, {
    dereference: true,
    filter: (file) => file !== appHtml,
  });
}

execute();
copyPublicFolder();
