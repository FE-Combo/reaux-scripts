#!/usr/bin/env node

"use strict";

const chalk = require("chalk");
const process = require("process");
const { spawn } = require("../lib");

const args = process.argv;

const scripts = ["dev", "build", "eject"];

const scriptIndex = args.findIndex((_) => scripts.includes(_));

const script = scriptIndex > 0 ? args[scriptIndex] : "unknown";

const nodeArgs = scriptIndex > 0 ? args.slice(scriptIndex + 1) : [];

if (scripts.includes(script)) {
  spawn(process.execPath, [require.resolve("../scripts/" + script), ...nodeArgs]);
} else {
  console.error(`Unknown script ${chalk.red(args.join(" "))}. Perhaps you need to update reaux-scripts? See: https://github.com/FE-Combo/reaux-scripts`);
}
