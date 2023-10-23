#!/usr/bin/env node

"use strict";

const chalk = require("chalk");
const process = require("process");
const { spawnSync, argv } = require("node-wiz");

const scripts = ["dev", "build", "eject"];

const scriptIndex = argv.findIndex((_) => scripts.includes(_));

const script = scriptIndex > 0 ? argv[scriptIndex] : "unknown";

const nodeArgs = scriptIndex > 0 ? argv.slice(scriptIndex + 1) : [];

if (scripts.includes(script)) {
  spawnSync(process.execPath, [require.resolve("../scripts/" + script), ...nodeArgs]);
} else {
  console.error(`Unknown script ${chalk.red(argv.join(" "))}. Perhaps you need to update reaux-scripts? See: https://github.com/FE-Combo/reaux-scripts`);
}
